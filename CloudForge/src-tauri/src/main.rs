// release 模式隐藏 Windows 控制台黑窗
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

fn main() {
    cloudforge_lib::run();
}
