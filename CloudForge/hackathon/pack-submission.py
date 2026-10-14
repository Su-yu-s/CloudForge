#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
云铸 CloudForge 参赛包打包脚本（可复现）。

用法：
    python hackathon/pack-submission.py [输出.zip]

默认输出到桌面：云铸-参赛包-CloudForge.zip

排除项：依赖与构建产物（node_modules / target / build / .test-run /
.agh-home / .claude / __pycache__ / .vite）、编辑器与备份文件。
打包后自动校验：包内文件路径不含旧命名（litept）。
"""

import os
import sys
import zipfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ARC_ROOT = "CloudForge"

EXCLUDE_DIRS = {
    "node_modules", "target", "build", ".test-run", ".agh-home",
    ".claude", "__pycache__", ".vite", ".git",
}
EXCLUDE_SUFFIX = (".bak", ".pyc")
EXCLUDE_INFIX = (".bak-",)

DEFAULT_OUT = os.path.join(
    os.path.expanduser("~"), "Desktop", "云铸-参赛包-CloudForge.zip"
)


def should_skip_dir(name: str) -> bool:
    return name in EXCLUDE_DIRS


def should_skip_file(name: str) -> bool:
    if name.endswith(EXCLUDE_SUFFIX):
        return True
    return any(tag in name for tag in EXCLUDE_INFIX)


def collect():
    files = []
    for dirpath, dirnames, filenames in os.walk(ROOT):
        dirnames[:] = sorted(d for d in dirnames if not should_skip_dir(d))
        for fn in sorted(filenames):
            if should_skip_file(fn):
                continue
            full = os.path.join(dirpath, fn)
            rel = os.path.relpath(full, ROOT)
            files.append((full, rel))
    return files


def main():
    out = sys.argv[1] if len(sys.argv) > 1 else DEFAULT_OUT
    os.makedirs(os.path.dirname(out), exist_ok=True)

    files = collect()
    total_bytes = sum(os.path.getsize(p) for p, _ in files)

    with zipfile.ZipFile(out, "w", zipfile.ZIP_DEFLATED, compresslevel=9) as zf:
        for full, rel in files:
            zf.write(full, os.path.join(ARC_ROOT, rel.replace(os.sep, "/")))

    size = os.path.getsize(out)
    print(f"打包完成: {out}")
    print(f"  文件数: {len(files)}（原始 {total_bytes / 1048576:.1f} MB → 压缩后 {size / 1048576:.1f} MB）")
    print(f"  排除目录: {', '.join(sorted(EXCLUDE_DIRS))}")

    # 自检：包内不得残留旧命名
    with zipfile.ZipFile(out) as zf:
        hits = [n for n in zf.namelist() if "litept" in n.lower()]
        bad = zf.testzip()
    if bad:
        print(f"  [错误] 压缩包损坏: {bad}")
        return 1
    if hits:
        print(f"  [警告] 包内仍有旧命名路径 {len(hits)} 个:")
        for h in hits[:20]:
            print(f"    - {h}")
        return 1
    print("  自检: 包内路径无旧命名 ✓ / CRC 校验通过 ✓")
    return 0


if __name__ == "__main__":
    sys.exit(main())
