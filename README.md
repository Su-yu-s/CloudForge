# 云铸 CloudForge

从点云扫描到几何参数、CAD 模型与核验报告的工作台。项目使用 **Agnes Harness（AGH）组织任务、调用工具并记录执行过程**，C++ 核心完成几何检测与精拟合，Python/CadQuery 生成 STEP、STL 等交付物。

本仓库包含 CloudForge 与本项目配套修改后的 AGH 源码、完整点云数据、演示材料及复现所需的依赖清单。克隆后从 [复现指南](复现指南.md) 开始。

## 可以展示什么

- 在 AGH 中选择点云，查看三维点云与检测出的平面、球、圆柱、圆锥、圆环及覆盖率。
- 通过会话工具或工作台入口运行检测，基于检测结果生成 CAD，在网页预览真实三角网格并叠加点云对照。
- 在“验证”页固定当前输入与阈值，将请求交给 AGH 的 `cloudforge_verify_current` 工具执行，查看检查范围、实际输出与执行轨迹。
- 导出结构化参数、CAD、报告及 AGH 执行记录。没有真值时只报告实际完成的结构、尺寸等检查，不声明精度已通过。

## 目录

| 目录 / 文件 | 内容 |
|---|---|
| [CloudForge/](CloudForge/) | Vue 3 / Three.js 前端、Tauri 2 桌面端、Rust / C++ 核心、Python CAD 工具 |
| [CloudForge/hackathon/cloudforge-tools/](CloudForge/hackathon/cloudforge-tools/) | AGH 后端工具插件，含当前模型核验入口 |
| [CloudForge/hackathon/cloudforge-panel/](CloudForge/hackathon/cloudforge-panel/) | 点云 / CAD / 验证 / 报告四页签工作台 |
| [CloudForge/.agh/skills/cloud-casting/](CloudForge/.agh/skills/cloud-casting/) | 随仓工作流 Skill |
| [agnes-harness/](agnes-harness/) | 本项目使用的 AGH 源码及相关修复；请直接构建此版本 |
| [data/](data/) | livingroom1、office1 点云片段与 Colored ICP 示例 |
| [deliverables/](deliverables/) | 现有演示海报、政策页与 PPT 素材 |
| [依赖清单.txt](依赖清单.txt) | 工具链、下载入口、锁文件及安装命令速查 |
| [CAD依赖锁定-Windows-Python312.txt](CAD依赖锁定-Windows-Python312.txt) | 本次收录的 Windows / Python 3.12 CAD 环境版本快照 |

## 复现与演示

完整步骤见 [复现指南.md](复现指南.md)：安装 Windows x64 工具链，补齐不随仓分发的 RANSAC 第三方库，构建 CLI 与 AGH，配置自己的模型账号，安装 CloudForge 插件，再开始演示。AGH 默认网页地址为 `http://127.0.0.1:4177/`。

小样本位于 `CloudForge/hackathon/demo-data/`，可先用它们演示，无需批量分析整个 `data/`。完整数据随仓提供，依赖目录、编译缓存、个人 AGH 配置、密钥与私人会话不入库。

部分项目内旧文档保留早期构建记录、旧目录或旧上游提交号；**当前组合仓库的安装顺序以根 [复现指南](复现指南.md) 为准**。现有历史结果与素材展示过去的运行，重新选择点云后应生成当前结果，不能将旧 PASS 当作新输入的核验结论。

## 许可与第三方来源

项目自有代码与 AGH 的许可、归属以 [LICENSE](LICENSE)、[agnes-harness/LICENSE](agnes-harness/LICENSE)、[agnes-harness/NOTICE](agnes-harness/NOTICE) 及各组件声明为准。Eigen 已随源码保留许可文件。

`ransac_sd` 原始库仅授权研究用途，未授予本仓库公开再分发权利，因此不随仓收录；复现者需自行获取并遵守其许可。具体目录与兼容性要求见 [第三方说明](CloudForge/src-tauri/cpp/third_party/README.md) 和根复现指南。
