# 通过 WMI 启动 FreeCAD GUI；按创建请求返回的实际 PID 确认进程存活。
# 用法: python hackathon/tools/preview-freecad.py <FreeCAD.exe> <预览文件>
# 两个参数的相对路径均以本项目根目录为基准。
import sys

from gui_launch import absolute_file, emit, failure, launch_gui


def main():
    if len(sys.argv) != 3:
        return failure("用法：preview-freecad.py <FreeCAD.exe> <预览文件>")
    try:
        executable = absolute_file(sys.argv[1], "FreeCAD GUI 可执行文件")
        if executable.name.casefold() != "freecad.exe":
            return failure("FreeCAD 预览需要 FreeCAD.exe GUI，不能使用 FreeCADCmd.exe")
        document = absolute_file(sys.argv[2], "预览文件")
        return launch_gui(executable, document, "FreeCAD")
    except (OSError, ValueError) as exc:
        return failure(str(exc))


if __name__ == "__main__":
    emit(main())

