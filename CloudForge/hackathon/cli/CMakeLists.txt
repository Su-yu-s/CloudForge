cmake_minimum_required(VERSION 3.15)
project(cloudforge_cli LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

if(MSVC)
  add_compile_options(/utf-8 /DNOMINMAX /W3)
endif()

# 复用仓库内核心库（RANSAC 检测 + 精拟合），与 src-tauri/cpp 共用同一份源码
add_subdirectory(
    ${CMAKE_CURRENT_SOURCE_DIR}/../../src-tauri/cpp
    ${CMAKE_CURRENT_BINARY_DIR}/cloudforge_core_build
)

add_executable(cloudforge-cli main.cpp)
target_link_libraries(cloudforge-cli PRIVATE cloudforge_core)

# 独立的 Windows 原生文件选择器，不链接点云检测/几何核心库。
# 默认全量构建会生成此目标；AGH 可提前加载并复用 Common Item Dialog。
if(WIN32)
  add_executable(cloudforge-picker native-picker.cpp)
  target_compile_definitions(cloudforge-picker PRIVATE UNICODE _UNICODE _WIN32_WINNT=0x0601)
  target_link_libraries(cloudforge-picker PRIVATE ole32 shell32 uuid user32)
endif()
