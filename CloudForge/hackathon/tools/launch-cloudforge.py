# 通过 WMI 启动 CloudForge GUI；脱离调用 shell 的进程树清理。
# 用法: python hackathon/tools/launch-cloudforge.py <预览文件> [cloudforge_exe]
# 文件、exe 参数和 CLOUDFORGE_EXE 的相对路径均以本项目根目录为基准。
# 保留旧 CLI 参数；未指定 exe 时先读 CLOUDFORGE_EXE，再找工作区 release 构建。
import os
from pathlib import Path
import sys

from gui_launch import absolute_file, emit, failure, launch_gui


SUPPORTED_FORMATS = {".ply", ".pcd", ".txt", ".stl", ".obj", ".bin"}


def main():
    if len(sys.argv) not in (2, 3):
        return failure("用法：launch-cloudforge.py <预览文件> [cloudforge.exe]")
    try:
        document = absolute_file(sys.argv[1], "预览文件")
        if document.suffix.casefold() not in SUPPORTED_FORMATS:
            return failure("CloudForge GUI 支持 PLY / PCD / TXT / STL / OBJ / BIN；STEP 请先转成同源 STL 后预览")
        configured = sys.argv[2] if len(sys.argv) == 3 else os.environ.get("CLOUDFORGE_EXE")
        if configured:
            executable = absolute_file(configured, "CloudForge GUI 可执行文件")
        else:
            workspace = Path(__file__).resolve().parents[2]
            executable = workspace / "src-tauri" / "target" / "release" / "cloudforge.exe"
            if not executable.is_file():
                return failure(
                    f"未找到 CloudForge GUI：{executable}；请构建 GUI 或用 CLOUDFORGE_EXE 指定已安装的 cloudforge.exe"
                )
        return launch_gui(executable, document, "CloudForge")
    except (OSError, ValueError) as exc:
        return failure(str(exc))


if __name__ == "__main__":
    emit(main())

