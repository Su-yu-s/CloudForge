"""Launch an explicitly requested Windows desktop preview through WMI.

Paths and command-line arguments travel as JSON over stdin, never as PowerShell
source. WMI detaches the GUI from the requesting shell's process job.
"""
import base64
import json
import os
from pathlib import Path
import subprocess
import sys


WORKSPACE = Path(__file__).resolve().parents[2]


_POWERSHELL = r"""
$ErrorActionPreference = 'Stop'
$utf8 = [System.Text.UTF8Encoding]::new($false)
[Console]::InputEncoding = $utf8
[Console]::OutputEncoding = $utf8
$OutputEncoding = $utf8
$processId = 0
$created = $false
try {
    $request = [Console]::In.ReadToEnd() | ConvertFrom-Json
    $creation = Invoke-CimMethod -ClassName Win32_Process -MethodName Create -Arguments @{
        CommandLine = [string]$request.command_line
        CurrentDirectory = [string]$request.cwd
    }
    $returnCode = [int]$creation.ReturnValue
    if ($returnCode -ne 0) {
        @{ ok = $false; launched = $false; alive = $false; pid = $null;
           return_code = $returnCode; error = "WMI process creation failed (code $returnCode)" } |
            ConvertTo-Json -Compress
        exit 0
    }
    $created = $true
    $processId = [int]$creation.ProcessId
    if ($processId -le 0) { throw 'WMI returned no process ID' }
    $alive = $true
    for ($attempt = 0; $attempt -lt 20; $attempt++) {
        Start-Sleep -Milliseconds 100
        $desktopProcess = Get-Process -Id $processId -ErrorAction SilentlyContinue
        if ($null -eq $desktopProcess -or $desktopProcess.HasExited) {
            $alive = $false
            break
        }
    }
    if ($alive) {
        @{ ok = $true; launched = $true; alive = $true; pid = $processId;
           return_code = $returnCode } | ConvertTo-Json -Compress
    } else {
        @{ ok = $false; launched = $true; alive = $false; pid = $processId;
           return_code = $returnCode; error = 'The created GUI process exited during startup' } |
            ConvertTo-Json -Compress
    }
} catch {
    @{ ok = $false; launched = $created; alive = $false; pid = $processId;
       error = $_.Exception.Message } | ConvertTo-Json -Compress
}
"""


def failure(message, **fields):
    result = {"ok": False, "launched": False, "alive": False, "error": message}
    result.update(fields)
    return result


def absolute_file(value, label):
    """Resolve relative CLI paths from the project root before handing them to WMI."""
    if not value:
        raise ValueError(f"缺少{label}")
    path = Path(value).expanduser()
    if not path.is_absolute():
        path = WORKSPACE / path
    path = path.resolve()
    if not path.is_file():
        raise ValueError(f"{label}不存在：{path}")
    return path


def emit(result):
    # The backend decodes stdout as UTF-8, independently of the Windows locale.
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    print(json.dumps(result, ensure_ascii=False), flush=True)


def launch_gui(executable, document, application):
    if os.name != "nt":
        return failure("GUI 预览仅支持 Windows")
    try:
        executable = absolute_file(executable, f"{application} 可执行文件")
        document = absolute_file(document, "预览文件")
        if executable.suffix.casefold() != ".exe":
            return failure(f"{application} 必须使用 Windows GUI .exe 文件")
        system_root = os.environ.get("SystemRoot")
        if not system_root:
            return failure("未找到 Windows SystemRoot 环境变量")
        powershell = absolute_file(
            Path(system_root)
            / "System32" / "WindowsPowerShell" / "v1.0" / "powershell.exe",
            "Windows PowerShell",
        )
        # list2cmdline applies Windows argv quoting, including trailing slashes.
        request = {
            "command_line": subprocess.list2cmdline([str(executable), str(document)]),
            "cwd": str(executable.parent),
        }
        encoded = base64.b64encode(_POWERSHELL.encode("utf-16-le")).decode("ascii")
        completed = subprocess.run(
            [str(powershell), "-NoLogo", "-NoProfile", "-NonInteractive", "-EncodedCommand", encoded],
            input=json.dumps(request, ensure_ascii=True),
            capture_output=True,
            text=True,
            encoding="utf-8",
            errors="replace",
            timeout=10,
            creationflags=subprocess.CREATE_NO_WINDOW,
        )
        output = completed.stdout.strip().lstrip("\ufeff")
        try:
            result = json.loads(output)
        except (ValueError, TypeError):
            diagnostic = (completed.stderr.strip() or output or f"exit code {completed.returncode}")[:500]
            return failure(f"{application} 启动请求未返回有效结果：{diagnostic}")
        if not isinstance(result, dict):
            return failure(f"{application} 启动请求返回了无效结果")
        if completed.returncode != 0:
            diagnostic = (completed.stderr.strip() or result.get("error") or str(completed.returncode))[:500]
            return failure(f"{application} 启动失败：{diagnostic}")
        if result.get("ok") is True and result.get("alive") is True:
            result["note"] = f"{application} 窗口进程已启动，正在载入文件"
        else:
            detail = result.get("error") or "无法确认新建的窗口进程是否存活"
            result["ok"] = False
            result["error"] = f"{application} 启动失败：{detail}"
        return result
    except subprocess.TimeoutExpired:
        return failure(f"{application} 启动请求超过 10 秒，无法确认是否打开；请查看桌面窗口后重试")
    except (OSError, ValueError) as exc:
        return failure(str(exc))

