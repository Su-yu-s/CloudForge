@echo off
rem 云铸离线模型查看器：服务根 = CloudForge 仓库根（无需联网）
rem 用法1：双击直接打开空页面，把 .stl 拖进去
rem 用法2：带模型参数启动（相对仓库根）：start-viewer.bat livingroom_model.stl
cd /d "%~dp0..\..\.."
set MODEL=%1
if not "%MODEL%"=="" set MODEL=?model=/%MODEL:/=\%
start "" "http://127.0.0.1:8123/hackathon/tools/viewer/view-model.html%MODEL%"
python -m http.server 8123
