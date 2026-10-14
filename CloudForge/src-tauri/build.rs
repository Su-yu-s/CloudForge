use cmake::Config;

fn main() {
    // 显式声明 C++ 源监视（cmake crate 的目录监视对深层文件修改不可靠）
    println!("cargo:rerun-if-changed=cpp/CMakeLists.txt");
    println!("cargo:rerun-if-changed=cpp/shim");
    println!("cargo:rerun-if-changed=cpp/src");
    println!("cargo:rerun-if-changed=cpp/include");

    // 用 CMake 构建 C++ 核心库（ransac_sd + ransac_core + shim），算法代码原样保留
    let dst = Config::new("cpp").profile("Release").build();

    let lib_dir = dst.join("lib");
    println!("cargo:rustc-link-search=native={}", lib_dir.display());
    println!("cargo:rustc-link-lib=static=cloudforge_core");
    println!("cargo:rustc-link-lib=static=QRANSAC_SD_PRIM_SHAPES_LIB");
    // C++ 标准库（/MD 运行时对应 msvcprt），Rust 默认不链接
    #[cfg(target_env = "msvc")]
    {
        println!("cargo:rustc-link-lib=dylib=msvcprt");
    }

    tauri_build::build();
}
