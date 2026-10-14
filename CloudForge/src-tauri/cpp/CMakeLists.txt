cmake_minimum_required(VERSION 3.15)
project(cloudforge_core LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

if(MSVC)
  add_compile_options(/utf-8 /DNOMINMAX /W3)
endif()

# Eigen 5（项目内置，仅头文件）
set(EIGEN5_ROOT "${CMAKE_CURRENT_SOURCE_DIR}/third_party/eigen-5.0.1")

add_subdirectory(third_party/ransac_sd ${CMAKE_CURRENT_BINARY_DIR}/ransac_sd_lib)

# 核心库：源码原样来自 RANSAC_GUI，另加一层 Rust FFI 用的 C shim（cloudforge_shim）
set(CORE_SOURCES
    src/detected_shape.cpp
    src/point_cloud_io.cpp
    src/point_cloud_generator.cpp
    src/ransac_detector.cpp
    src/modern_ransac_refiner.cpp
    src/schnabel_detector.cpp
    src/ransac_lib_api.cpp
    shim/cloudforge_shim.cpp
)

add_library(cloudforge_core STATIC ${CORE_SOURCES})

target_include_directories(cloudforge_core
    PUBLIC
        ${CMAKE_CURRENT_SOURCE_DIR}/include
        ${CMAKE_CURRENT_SOURCE_DIR}/shim
        ${EIGEN5_ROOT}
)

target_link_libraries(cloudforge_core PUBLIC QRANSAC_SD_PRIM_SHAPES_LIB)
target_compile_definitions(cloudforge_core PUBLIC POINTSWITHINDEX)

install(TARGETS cloudforge_core QRANSAC_SD_PRIM_SHAPES_LIB ARCHIVE DESTINATION lib)
