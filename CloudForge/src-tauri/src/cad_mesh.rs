//! CAD 表面预览：保留 STL 的全部三角面，不经点云去重或采样。

use std::fs::File;
use std::io::Read;
use std::path::Path;

const MAX_FILE_BYTES: u64 = 128 * 1024 * 1024;
const MAX_TRIANGLES: usize = 1_000_000;
const BYTES_PER_TRIANGLE: usize = 9 * std::mem::size_of::<f32>();

/// 返回非索引三角网格位置：每面 9 个小端 f32，保留原文件坐标和单位。
pub fn load(path: &str) -> Result<Vec<u8>, String> {
    let path = Path::new(path);
    if !path.extension().and_then(|s| s.to_str()).is_some_and(|s| s.eq_ignore_ascii_case("stl")) {
        return Err("CAD 表面预览需要 STL 文件；请先将 STEP 转换为 STL".into());
    }
    let file = File::open(path).map_err(|e| format!("无法打开 CAD 文件：{e}"))?;
    let metadata = file.metadata().map_err(|e| format!("无法读取 CAD 文件信息：{e}"))?;
    if !metadata.is_file() {
        return Err("CAD 路径必须指向普通文件".into());
    }
    if metadata.len() > MAX_FILE_BYTES {
        return Err("CAD 文件超过预览上限（128 MiB）".into());
    }
    let mut bytes = Vec::with_capacity(metadata.len() as usize);
    file.take(MAX_FILE_BYTES + 1).read_to_end(&mut bytes)
        .map_err(|e| format!("读取 CAD 文件失败：{e}"))?;
    if bytes.len() as u64 > MAX_FILE_BYTES {
        return Err("CAD 文件超过预览上限（128 MiB）".into());
    }
    if bytes.is_empty() {
        return Err("CAD 文件为空".into());
    }

    // 二进制 STL 的头也可以以 solid 开头，因此优先判断完整记录长度。
    if bytes.len() >= 84 {
        let count = u32::from_le_bytes(bytes[80..84].try_into().unwrap()) as usize;
        if count.checked_mul(50).and_then(|n| n.checked_add(84)) == Some(bytes.len()) {
            return parse_binary(&bytes, count);
        }
    }
    let ascii_bytes = bytes.strip_prefix(&[0xef, 0xbb, 0xbf]).unwrap_or(&bytes);
    let starts_with_solid = ascii_bytes.iter().position(|b| !b.is_ascii_whitespace())
        .map(|start| {
            let tail = &ascii_bytes[start..];
            tail.get(..5).is_some_and(|word| word.eq_ignore_ascii_case(b"solid"))
                && tail.get(5).map_or(true, |b| b.is_ascii_whitespace())
        }).unwrap_or(false);
    if starts_with_solid {
        let text = std::str::from_utf8(ascii_bytes)
            .map_err(|_| "ASCII STL 包含无效的 UTF-8 文本".to_string())?;
        return parse_ascii(text);
    }
    if bytes.len() < 84 {
        return Err("STL 文件头不完整，或不是有效的 ASCII STL".into());
    }
    let count = u32::from_le_bytes(bytes[80..84].try_into().unwrap()) as usize;
    parse_binary(&bytes, count)
}

fn parse_binary(bytes: &[u8], count: usize) -> Result<Vec<u8>, String> {
    check_triangle_count(count)?;
    let expected = count.checked_mul(50).and_then(|n| n.checked_add(84))
        .ok_or("STL 面数溢出")?;
    if bytes.len() != expected {
        return Err(format!("二进制 STL 长度不符：声明 {count} 个三角面，需要 {expected} 字节，实际 {} 字节（文件可能截断）", bytes.len()));
    }
    let mut positions = Vec::with_capacity(count * BYTES_PER_TRIANGLE);
    for (index, record) in bytes[84..].chunks_exact(50).enumerate() {
        // 前 3 个数是法向量，其后 9 个数是顶点；末尾 2 字节是属性标记。
        for (component, raw) in record[..48].chunks_exact(4).enumerate() {
            let value = f32::from_le_bytes(raw.try_into().unwrap());
            if !value.is_finite() {
                return Err(format!("STL 第 {} 个三角面包含非有限坐标或法向量", index + 1));
            }
            if component >= 3 {
                positions.extend_from_slice(&value.to_le_bytes());
            }
        }
    }
    Ok(positions)
}

fn check_triangle_count(count: usize) -> Result<(), String> {
    if count == 0 {
        return Err("STL 中没有三角面".into());
    }
    if count > MAX_TRIANGLES {
        return Err("STL 超过预览上限（100 万个三角面）".into());
    }
    Ok(())
}

#[derive(Clone, Copy)]
enum AsciiState {
    Solid,
    FacetOrEnd,
    OuterLoop,
    Vertex(usize),
    EndLoop,
    EndFacet,
    Done,
}

fn parse_ascii(text: &str) -> Result<Vec<u8>, String> {
    let mut state = AsciiState::Solid;
    let mut triangle = [0.0_f32; 9];
    let mut count = 0;
    let mut positions = Vec::new();
    for (line_index, line) in text.lines().enumerate() {
        let line = line.trim();
        if line.is_empty() {
            continue;
        }
        let line_number = line_index + 1;
        let mut words = line.split_whitespace();
        let keyword = words.next().unwrap();
        let invalid = || format!("ASCII STL 第 {line_number} 行三角面结构无效");
        match state {
            AsciiState::Solid | AsciiState::Done => {
                if !keyword.eq_ignore_ascii_case("solid") {
                    return Err(invalid());
                }
                // solid 名称可以有空格；也支持一个文件中顺序存放多个 solid。
                state = AsciiState::FacetOrEnd;
            }
            AsciiState::FacetOrEnd => {
                if keyword.eq_ignore_ascii_case("endsolid") {
                    state = AsciiState::Done;
                } else if keyword.eq_ignore_ascii_case("facet")
                    && words.next().is_some_and(|s| s.eq_ignore_ascii_case("normal")) {
                    parse_vector(words, line_number)?;
                    if count >= MAX_TRIANGLES {
                        return Err("STL 超过预览上限（100 万个三角面）".into());
                    }
                    state = AsciiState::OuterLoop;
                } else {
                    return Err(invalid());
                }
            }
            AsciiState::OuterLoop => {
                if !keyword.eq_ignore_ascii_case("outer")
                    || !words.next().is_some_and(|s| s.eq_ignore_ascii_case("loop"))
                    || words.next().is_some() {
                    return Err(invalid());
                }
                state = AsciiState::Vertex(0);
            }
            AsciiState::Vertex(index) => {
                if !keyword.eq_ignore_ascii_case("vertex") {
                    return Err(invalid());
                }
                let vertex = parse_vector(words, line_number)?;
                triangle[index * 3..index * 3 + 3].copy_from_slice(&vertex);
                state = if index == 2 { AsciiState::EndLoop } else { AsciiState::Vertex(index + 1) };
            }
            AsciiState::EndLoop => {
                if !keyword.eq_ignore_ascii_case("endloop") || words.next().is_some() {
                    return Err(invalid());
                }
                state = AsciiState::EndFacet;
            }
            AsciiState::EndFacet => {
                if !keyword.eq_ignore_ascii_case("endfacet") || words.next().is_some() {
                    return Err(invalid());
                }
                for value in triangle {
                    positions.extend_from_slice(&value.to_le_bytes());
                }
                count += 1;
                state = AsciiState::FacetOrEnd;
            }
        }
    }
    if !matches!(state, AsciiState::Done) {
        return Err("ASCII STL 结构不完整：缺少三角面结束标记或 endsolid".into());
    }
    check_triangle_count(count)?;
    Ok(positions)
}

fn parse_vector(mut words: std::str::SplitWhitespace<'_>, line_number: usize) -> Result<[f32; 3], String> {
    let mut vector = [0.0; 3];
    for value in &mut vector {
        *value = words.next().and_then(|s| s.parse::<f32>().ok())
            .filter(|v| v.is_finite())
            .ok_or_else(|| format!("ASCII STL 第 {line_number} 行需要 3 个有限坐标"))?;
    }
    if words.next().is_some() {
        return Err(format!("ASCII STL 第 {line_number} 行坐标数量不是 3"));
    }
    Ok(vector)
}
