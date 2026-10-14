# 定位 FreeCAD 安装：注册表 Uninstall 键 → 常见目录 → PATH，输出 JSON
# 用法: python hackathon/tools/find-freecad.py
# 供 Skill 的交付预览使用；找到后用 freecad_exe 打开 STEP、freecadcmd_exe 跑验证脚本
import glob, json, os, winreg

def exe_from_displayicon(value):
    # DisplayIcon 形如 "D:\...\FreeCAD.exe" 或带 ",0" 后缀
    if not value:
        return None
    p = value.split(",")[0].strip().strip('"')
    return p if p.lower().endswith(".exe") and os.path.exists(p) else None

found = []

# 1) 注册表（64/32 位视图 + HKCU）
for hive, view in ((winreg.HKEY_LOCAL_MACHINE, winreg.KEY_WOW64_64KEY),
                   (winreg.HKEY_LOCAL_MACHINE, winreg.KEY_WOW64_32KEY),
                   (winreg.HKEY_CURRENT_USER, 0)):
    try:
        key = winreg.OpenKey(hive, r"Software\Microsoft\Windows\CurrentVersion\Uninstall", 0, winreg.KEY_READ | view)
    except OSError:
        continue
    try:
        i = 0
        while True:
            try:
                sub = winreg.OpenKey(key, winreg.EnumKey(key, i))
                i += 1
            except OSError:
                break
            try:
                name, _ = winreg.QueryValueEx(sub, "DisplayName")
            except OSError:
                continue
            if "freecad" not in name.lower():
                continue
            try:
                icon, _ = winreg.QueryValueEx(sub, "DisplayIcon")
            except OSError:
                icon = None
            exe = exe_from_displayicon(icon)
            if exe and exe not in found:
                found.append(exe)
    finally:
        winreg.CloseKey(key)

# 2) 常见安装目录
for pat in (r"C:\Program Files\FreeCAD*\bin\FreeCAD.exe",
            r"C:\Program Files (x86)\FreeCAD*\bin\FreeCAD.exe",
            r"C:\FreeCAD*\bin\FreeCAD.exe",
            r"D:\*reecad*\bin\FreeCAD.exe",
            r"E:\*reecad*\bin\FreeCAD.exe"):
    for exe in glob.glob(pat):
        if exe not in found:
            found.append(exe)

# 3) PATH
for p in os.environ.get("PATH", "").split(os.pathsep):
    exe = os.path.join(p, "FreeCAD.exe")
    if os.path.isfile(exe) and exe not in found:
        found.append(exe)

result = {"ok": bool(found), "freecad_exe": found[0] if found else None,
          "freecadcmd_exe": (os.path.join(os.path.dirname(found[0]), "freecadcmd.exe")
                             if found and os.path.isfile(os.path.join(os.path.dirname(found[0]), "freecadcmd.exe"))
                             else None),
          "candidates": found}
print(json.dumps(result, ensure_ascii=False, indent=1))
