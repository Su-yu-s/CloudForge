// A persistent STA Common Item Dialog worker. No window is shown during prewarming.
// Protocol: UTF-8 JSON lines on stdin/stdout; diagnostics only on stderr.
// Microsoft API contracts:
// https://learn.microsoft.com/windows/win32/api/shobjidl_core/nf-shobjidl_core-ifiledialog-setfiletypes
// https://learn.microsoft.com/windows/win32/api/shobjidl_core/nf-shobjidl_core-ifiledialogevents-onfolderchange
// https://learn.microsoft.com/windows/win32/shell/common-file-dialog
#include <windows.h>
#include <shobjidl.h>
#include <shlobj.h>
#include <oleidl.h>
#include <wrl/client.h>
#include <algorithm>
#include <atomic>
#include <deque>
#include <mutex>
#include <stdexcept>
#include <thread>
#include <cstdint>
#include <iomanip>
#include <iostream>
#include <map>
#include <memory>
#include <sstream>
#include <string>
#include <utility>
#include <vector>

using Microsoft::WRL::ComPtr;

namespace {
constexpr size_t MAX_REQUEST_BYTES = 65536;
constexpr size_t MAX_FILTER_BYTES = 8192;
constexpr size_t MAX_DIRECTORY_BYTES = 32768;
constexpr size_t MAX_PATH_BYTES = 8 * 1024;
constexpr size_t MAX_DIALOGS = 8;
constexpr UINT_PTR SHOWN_TIMER = 1;
constexpr UINT REQUEST_MESSAGE = WM_APP + 1;
constexpr UINT INPUT_ENDED_MESSAGE = WM_APP + 2;

std::string utf8(const std::wstring& value) {
    if (value.empty()) return {};
    int size = WideCharToMultiByte(CP_UTF8, WC_ERR_INVALID_CHARS, value.data(),
        static_cast<int>(value.size()), nullptr, 0, nullptr, nullptr);
    if (!size) throw std::runtime_error("Invalid UTF-16 path");
    std::string output(size, '\0');
    WideCharToMultiByte(CP_UTF8, WC_ERR_INVALID_CHARS, value.data(),
        static_cast<int>(value.size()), output.data(), size, nullptr, nullptr);
    return output;
}

bool wide(const std::string& value, std::wstring& output) {
    if (value.empty()) { output.clear(); return true; }
    int size = MultiByteToWideChar(CP_UTF8, MB_ERR_INVALID_CHARS, value.data(),
        static_cast<int>(value.size()), nullptr, 0);
    if (!size) return false;
    output.resize(size);
    return MultiByteToWideChar(CP_UTF8, MB_ERR_INVALID_CHARS, value.data(),
        static_cast<int>(value.size()), output.data(), size) == size;
}

std::string quoted(const std::string& value) {
    std::string result = "\"";
    constexpr char hex[] = "0123456789abcdef";
    for (unsigned char c : value) {
        if (c == '"' || c == '\\') { result += '\\'; result += c; }
        else if (c < 0x20) {
            result += "\\u00"; result += hex[c >> 4]; result += hex[c & 15];
        } else result += c;
    }
    return result + '"';
}

void event(const std::string& name, const std::string& id = {},
           const std::string& state = {}, const std::string& valueKey = {},
           const std::string& value = {}, const bool* local = nullptr) {
    std::cout << "{\"event\":" << quoted(name);
    if (!id.empty()) std::cout << ",\"id\":" << quoted(id);
    if (!state.empty()) std::cout << ",\"state\":" << quoted(state);
    if (!valueKey.empty()) std::cout << ',' << quoted(valueKey) << ':' << quoted(value);
    if (local) std::cout << ",\"local\":" << (*local ? "true" : "false");
    std::cout << "}\n" << std::flush;
}
// Only the protocol's flat object of strings is accepted, with complete JSON
// escaping, paired Unicode surrogates and UTF-8 validation. No shell parsing.
class JsonStrings {
public:
    explicit JsonStrings(const std::string& input) : input_(input) {}
    bool parse(std::map<std::string, std::string>& members) {
        if (!take('{')) return false;
        if (take('}')) return end();
        while (true) {
            std::string key, value;
            if (!string(key) || !take(':') || !string(value)) return false;
            if (members.count(key)) return false;
            members.emplace(std::move(key), std::move(value));
            if (take('}')) return end();
            if (!take(',')) return false;
        }
    }
private:
    const std::string& input_;
    size_t at_ = 0;
    void space() {
        while (at_ < input_.size() && (input_[at_] == ' ' || input_[at_] == '\t' ||
            input_[at_] == '\r' || input_[at_] == '\n')) ++at_;
    }
    bool take(char c) {
        space();
        if (at_ == input_.size() || input_[at_] != c) return false;
        ++at_; return true;
    }
    bool end() { space(); return at_ == input_.size(); }
    bool hex4(uint32_t& number) {
        number = 0;
        for (int i = 0; i < 4; ++i) {
            if (at_ == input_.size()) return false;
            char c = input_[at_++];
            int digit = c >= '0' && c <= '9' ? c - '0' :
                c >= 'a' && c <= 'f' ? c - 'a' + 10 :
                c >= 'A' && c <= 'F' ? c - 'A' + 10 : -1;
            if (digit < 0) return false;
            number = (number << 4) | digit;
        }
        return true;
    }
    static void appendPoint(std::string& result, uint32_t point) {
        if (point <= 0x7f) result += static_cast<char>(point);
        else if (point <= 0x7ff) {
            result += static_cast<char>(0xc0 | (point >> 6));
            result += static_cast<char>(0x80 | (point & 63));
        } else if (point <= 0xffff) {
            result += static_cast<char>(0xe0 | (point >> 12));
            result += static_cast<char>(0x80 | ((point >> 6) & 63));
            result += static_cast<char>(0x80 | (point & 63));
        } else {
            result += static_cast<char>(0xf0 | (point >> 18));
            result += static_cast<char>(0x80 | ((point >> 12) & 63));
            result += static_cast<char>(0x80 | ((point >> 6) & 63));
            result += static_cast<char>(0x80 | (point & 63));
        }
    }
    bool string(std::string& value) {
        if (!take('"')) return false;
        while (at_ < input_.size()) {
            unsigned char c = input_[at_++];
            if (c == '"') {
                std::wstring check;
                return value.find('\0') == std::string::npos && wide(value, check);
            }
            if (c < 0x20) return false;
            if (c != '\\') { value += c; continue; }
            if (at_ == input_.size()) return false;
            char escape = input_[at_++];
            switch (escape) {
            case '"': case '\\': case '/': value += escape; break;
            case 'b': value += '\b'; break;
            case 'f': value += '\f'; break;
            case 'n': value += '\n'; break;
            case 'r': value += '\r'; break;
            case 't': value += '\t'; break;
            case 'u': {
                uint32_t point;
                if (!hex4(point)) return false;
                if (point >= 0xd800 && point <= 0xdbff) {
                    if (at_ + 2 > input_.size() || input_[at_] != '\\' || input_[at_ + 1] != 'u') return false;
                    at_ += 2;
                    uint32_t low;
                    if (!hex4(low) || low < 0xdc00 || low > 0xdfff) return false;
                    point = 0x10000 + ((point - 0xd800) << 10) + (low - 0xdc00);
                } else if (point >= 0xdc00 && point <= 0xdfff) return false;
                if (!point) return false;
                appendPoint(value, point);
                break;
            }
            default: return false;
            }
        }
        return false;
    }
};

struct Request { std::string id; std::wstring filter, directory; };
bool request(const std::string& line, Request& result) {
    std::map<std::string, std::string> fields;
    bool parsed = JsonStrings(line).parse(fields);
    auto id = fields.find("id");
    if (id != fields.end() && !id->second.empty() && id->second.size() <= 128 &&
        std::all_of(id->second.begin(), id->second.end(), [](unsigned char c) {
            return (c >= '0' && c <= '9') || (c >= 'a' && c <= 'z') ||
                (c >= 'A' && c <= 'Z') || c == '-' || c == '_';
        })) result.id = id->second;
    if (!parsed || fields.size() != 3 || result.id.empty() ||
        !fields.count("filter") || !fields.count("directory")) return false;
    if (fields["filter"].empty() || fields["filter"].size() > MAX_FILTER_BYTES ||
        fields["directory"].size() > MAX_DIRECTORY_BYTES) return false;
    return wide(fields["filter"], result.filter) && wide(fields["directory"], result.directory);
}

bool readLine(std::string& line, bool& overflow) {
    line.clear(); overflow = false;
    char c;
    bool read = false;
    while (std::cin.get(c)) {
        read = true;
        if (c == '\n') return true;
        if (line.size() < MAX_REQUEST_BYTES) line += c;
        else overflow = true;
    }
    return read;
}

std::string errorCode(HRESULT hr) {
    std::ostringstream value;
    value << "Windows file dialog error (0x" << std::hex << std::uppercase
          << std::setw(8) << std::setfill('0') << static_cast<unsigned long>(hr) << ')';
    return value.str();
}
void check(HRESULT hr) { if (FAILED(hr)) throw std::runtime_error(errorCode(hr)); }

bool localPath(const std::wstring& path) {
    if (path.size() < 3 || path[1] != L':' || (path[2] != L'\\' && path[2] != L'/')) return false;
    wchar_t root[] = { path[0], L':', L'\\', L'\0' };
    UINT kind = GetDriveTypeW(root);
    return kind == DRIVE_FIXED || kind == DRIVE_REMOVABLE || kind == DRIVE_CDROM || kind == DRIVE_RAMDISK;
}
ComPtr<IShellItem> folder(const std::wstring& path) {
    ComPtr<IShellItem> item;
    if (path.empty()) return item;
    HRESULT hr = SHCreateItemFromParsingName(path.c_str(), nullptr, IID_PPV_ARGS(&item));
    SFGAOF attributes = SFGAO_FOLDER | SFGAO_FILESYSTEM;
    if (FAILED(hr) || FAILED(item->GetAttributes(attributes, &attributes)) ||
        (attributes & (SFGAO_FOLDER | SFGAO_FILESYSTEM)) != (SFGAO_FOLDER | SFGAO_FILESYSTEM)) item.Reset();
    return item;
}
std::wstring currentDirectory() {
    DWORD size = GetCurrentDirectoryW(0, nullptr);
    std::wstring result(size, L'\0');
    DWORD count = size ? GetCurrentDirectoryW(size, result.data()) : 0;
    if (!count || count >= size) return {};
    result.resize(count); return result;
}

class Picker;
class DialogEvents final : public IFileDialogEvents {
public:
    explicit DialogEvents(Picker* owner) : owner_(owner) {}
    IFACEMETHODIMP QueryInterface(REFIID iid, void** result) override {
        if (!result) return E_POINTER;
        *result = nullptr;
        if (iid == IID_IUnknown || iid == IID_IFileDialogEvents) {
            *result = static_cast<IFileDialogEvents*>(this); AddRef(); return S_OK;
        }
        return E_NOINTERFACE;
    }
    IFACEMETHODIMP_(ULONG) AddRef() override { return InterlockedIncrement(&references_); }
    IFACEMETHODIMP_(ULONG) Release() override {
        ULONG count = InterlockedDecrement(&references_);
        if (!count) delete this;
        return count;
    }
    IFACEMETHODIMP OnFolderChange(IFileDialog* dialog) override;
    IFACEMETHODIMP OnTypeChange(IFileDialog* dialog) override;
    IFACEMETHODIMP OnFileOk(IFileDialog*) override { return S_OK; }
    IFACEMETHODIMP OnFolderChanging(IFileDialog*, IShellItem*) override { return S_OK; }
    IFACEMETHODIMP OnSelectionChange(IFileDialog*) override { return S_OK; }
    IFACEMETHODIMP OnShareViolation(IFileDialog*, IShellItem*, FDE_SHAREVIOLATION_RESPONSE* response) override {
        if (response) *response = FDESVR_DEFAULT;
        return S_OK;
    }
    IFACEMETHODIMP OnOverwrite(IFileDialog*, IShellItem*, FDE_OVERWRITE_RESPONSE* response) override {
        if (response) *response = FDEOR_DEFAULT;
        return S_OK;
    }
private:
    LONG references_ = 1;
    Picker* owner_;
};

struct Dialog {
    std::wstring filter;
    ComPtr<IFileOpenDialog> object;
    ComPtr<DialogEvents> events;
    DWORD cookie = 0;
    bool advised = false;
    ~Dialog() { if (advised) object->Unadvise(cookie); }
};

class Picker {
public:
    Picker() {
        workspace_ = currentDirectory();
        // Startup does not contact a redirected/network folder. Such folders
        // remain selectable by the user and valid in an explicit request.
        if (localPath(workspace_)) initialFolder_ = folder(workspace_);
        initialIsWorkspace_ = static_cast<bool>(initialFolder_);
        if (!initialFolder_) {
            wchar_t windowsPath[MAX_PATH] = {};
            UINT count = GetWindowsDirectoryW(windowsPath, MAX_PATH);
            if (count && count < MAX_PATH) initialFolder_ = folder(windowsPath);
        }
        const wchar_t* className = L"CloudForgePickerOwner";
        WNDCLASSW klass = {};
        klass.lpfnWndProc = windowProc;
        klass.hInstance = GetModuleHandleW(nullptr);
        klass.lpszClassName = className;
        if (!RegisterClassW(&klass)) throw std::runtime_error("Cannot prepare file dialog owner");
        owner_ = CreateWindowExW(WS_EX_TOOLWINDOW | WS_EX_TOPMOST | WS_EX_LAYERED,
            className, L"CloudForge 文件选择", WS_POPUP, 0, 0, 1, 1,
            nullptr, nullptr, klass.hInstance, this);
        if (!owner_) throw std::runtime_error("Cannot prepare file dialog owner");
        SetLayeredWindowAttributes(owner_, 0, 0, LWA_ALPHA);
        try {
            getDialog(L"支持的格式 (*.ply;*.pcd)|*.ply;*.pcd|所有文件 (*.*)|*.*");
            getDialog(L"支持的格式 (*.step;*.stp;*.stl)|*.step;*.stp;*.stl|所有文件 (*.*)|*.*");
        } catch (...) { DestroyWindow(owner_); owner_ = nullptr; throw; }
    }
    ~Picker() {
        dialogs_.clear();
        if (owner_) DestroyWindow(owner_);
        UnregisterClassW(L"CloudForgePickerOwner", GetModuleHandleW(nullptr));
    }
    void run() {
        // Keep all COM/UI work on this pumping STA. stdin blocks only the
        // reader thread; no COM pointer is passed to that thread.
        std::thread input([this] {
            try {
                std::string line;
                bool overflow;
                while (!stopping_ && readLine(line, overflow)) {
                    if (stopping_) break;
                    if (line.empty() && !overflow) continue;
                    {
                        std::lock_guard<std::mutex> lock(inboxMutex_);
                        if (inbox_.size() >= 32) break;
                        inbox_.push_back({ std::move(line), overflow });
                    }
                    if (!PostMessageW(owner_, REQUEST_MESSAGE, 0, 0)) break;
                }
            } catch (...) { /* end the worker without crossing the thread boundary */ }
            PostMessageW(owner_, INPUT_ENDED_MESSAGE, 0, 0);
        });
        MSG message = {};
        while (GetMessageW(&message, nullptr, 0, 0) > 0) {
            TranslateMessage(&message);
            DispatchMessageW(&message);
        }
        stopping_ = true;
        // Normally EOF already ended the reader. On a Win32 failure, cancel
        // only this worker thread's pending stdin read before joining it.
        CancelSynchronousIo(input.native_handle());
        input.join();
    }
    void probeShown(IFileDialog* dialog) {
        if (shown_ || activeId_.empty()) return;
        ComPtr<IOleWindow> window;
        HWND handle = nullptr;
        if (SUCCEEDED(dialog->QueryInterface(IID_PPV_ARGS(&window))) &&
            SUCCEEDED(window->GetWindow(&handle)) && handle && IsWindowVisible(handle)) {
            shown_ = true;
            KillTimer(owner_, SHOWN_TIMER);
            event("shown", activeId_);
        }
    }
    void open(const Request& input) {
        Dialog* dialog = nullptr;
        try {
            dialog = getDialog(input.filter);
            check(dialog->object->SetFileName(L""));
            check(dialog->object->SetFileTypeIndex(1));
            ComPtr<IShellItem> destination = lastLocalFolder_ ? lastLocalFolder_ : initialFolder_;
            if (!lastLocalFolder_ && !input.directory.empty() && (!initialIsWorkspace_ || input.directory != workspace_)) {
                auto specified = folder(input.directory);
                if (specified) destination = specified;
            }
            if (destination) {
                HRESULT hr = dialog->object->SetFolder(destination.Get());
                if (FAILED(hr) && initialFolder_) check(dialog->object->SetFolder(initialFolder_.Get()));
            }
            if (stopping_) { event("result", input.id, "cancelled"); return; }
            active_ = dialog;
            activeId_ = input.id;
            shown_ = false;
            POINT cursor = {};
            GetCursorPos(&cursor);
            MONITORINFO monitor = {}; monitor.cbSize = sizeof(monitor);
            GetMonitorInfoW(MonitorFromPoint(cursor, MONITOR_DEFAULTTONEAREST), &monitor);
            int x = monitor.rcWork.left + (monitor.rcWork.right - monitor.rcWork.left) / 2;
            int y = monitor.rcWork.top + (monitor.rcWork.bottom - monitor.rcWork.top) / 2;
            SetWindowPos(owner_, HWND_TOPMOST, x, y, 1, 1, SWP_NOACTIVATE);
            ShowWindow(owner_, SW_SHOW);
            SetForegroundWindow(owner_);
            SetActiveWindow(owner_);
            // The timer runs only in this user-requested modal loop. Events can
            // arrive before visibility, so both paths verify the actual HWND.
            if (!SetTimer(owner_, SHOWN_TIMER, 50, nullptr)) throw std::runtime_error("Cannot observe file dialog visibility");
            HRESULT hr = dialog->object->Show(owner_);
            KillTimer(owner_, SHOWN_TIMER);
            ShowWindow(owner_, SW_HIDE);
            active_ = nullptr;
            activeId_.clear();
            if (hr == HRESULT_FROM_WIN32(ERROR_CANCELLED)) {
                event("result", input.id, "cancelled"); return;
            }
            check(hr);
            ComPtr<IShellItem> selected;
            check(dialog->object->GetResult(&selected));
            PWSTR path = nullptr;
            check(selected->GetDisplayName(SIGDN_FILESYSPATH, &path));
            std::wstring selection(path);
            CoTaskMemFree(path);
            ComPtr<IShellItem> parent;
            if (SUCCEEDED(selected->GetParent(&parent))) {
                PWSTR directory = nullptr;
                if (SUCCEEDED(parent->GetDisplayName(SIGDN_FILESYSPATH, &directory))) {
                    if (localPath(directory)) lastLocalFolder_ = parent;
                    CoTaskMemFree(directory);
                }
            }
            auto selectedPath = utf8(selection);
            if (selectedPath.size() > MAX_PATH_BYTES) throw std::runtime_error("Selected file path exceeds 8 KiB UTF-8");
            bool pickedLocal = localPath(selection);
            event("result", input.id, "picked", "path", selectedPath, &pickedLocal);
        } catch (const std::exception& error) {
            KillTimer(owner_, SHOWN_TIMER);
            ShowWindow(owner_, SW_HIDE);
            active_ = nullptr;
            activeId_.clear();
            // An instance that failed preparation/Show is not reused on the next click.
            if (dialog) dialogs_.erase(std::remove_if(dialogs_.begin(), dialogs_.end(),
                [dialog](const auto& candidate) { return candidate.get() == dialog; }), dialogs_.end());
            event("result", input.id, "failed", "error", error.what());
        }
    }
private:
    struct Incoming { std::string line; bool overflow; };
    std::mutex inboxMutex_;
    std::deque<Incoming> inbox_;
    std::atomic<bool> stopping_{ false };
    bool initialIsWorkspace_ = false;
    HWND owner_ = nullptr;
    std::wstring workspace_;
    ComPtr<IShellItem> initialFolder_, lastLocalFolder_;
    std::vector<std::unique_ptr<Dialog>> dialogs_;
    Dialog* active_ = nullptr;
    std::string activeId_;
    bool shown_ = false;
    bool handling_ = false;
    static LRESULT CALLBACK windowProc(HWND hwnd, UINT message, WPARAM wparam, LPARAM lparam) {
        auto self = reinterpret_cast<Picker*>(GetWindowLongPtrW(hwnd, GWLP_USERDATA));
        if (message == WM_NCCREATE) {
            self = static_cast<Picker*>(reinterpret_cast<CREATESTRUCTW*>(lparam)->lpCreateParams);
            SetWindowLongPtrW(hwnd, GWLP_USERDATA, reinterpret_cast<LONG_PTR>(self));
        }
        if (message == REQUEST_MESSAGE && self) {
            try { self->processRequest(); }
            catch (const std::exception& error) {
                std::cerr << error.what() << '\n';
                self->endInput();
            }
            return 0;
        }
        if (message == INPUT_ENDED_MESSAGE && self) { self->endInput(); return 0; }
        if (message == WM_TIMER && wparam == SHOWN_TIMER && self && self->active_) {
            self->probeShown(self->active_->object.Get()); return 0;
        }
        return DefWindowProcW(hwnd, message, wparam, lparam);
    }
    void endInput() {
        stopping_ = true;
        if (active_) active_->object->Close(HRESULT_FROM_WIN32(ERROR_CANCELLED));
        PostQuitMessage(0);
    }
    void processRequest() {
        Incoming next;
        {
            std::lock_guard<std::mutex> lock(inboxMutex_);
            if (inbox_.empty()) return;
            next = std::move(inbox_.front());
            inbox_.pop_front();
        }
        Request input;
        if (next.overflow || !request(next.line, input)) {
            event("result", input.id, "failed", "error", "Invalid or oversized file dialog request");
        } else if (handling_) {
            event("result", input.id, "failed", "error", "A file dialog is already active");
        } else if (!stopping_) {
            // COM preparation and GetResult can pump messages as well as Show.
            // Guard the entire operation, including those reentrant windows.
            handling_ = true;
            try { open(input); }
            catch (...) { handling_ = false; throw; }
            handling_ = false;
        }
    }
    Dialog* getDialog(const std::wstring& filter) {
        for (auto& dialog : dialogs_) if (dialog->filter == filter) return dialog.get();
        std::vector<std::wstring> parts;
        size_t start = 0;
        while (true) {
            size_t end = filter.find(L'|', start);
            parts.push_back(filter.substr(start, end == std::wstring::npos ? end : end - start));
            if (end == std::wstring::npos) break;
            start = end + 1;
        }
        if (parts.empty() || parts.size() % 2 || parts.size() > 16 ||
            std::any_of(parts.begin(), parts.end(), [](const std::wstring& part) { return part.empty(); })) {
            throw std::runtime_error("Invalid file dialog filter");
        }
        auto dialog = std::make_unique<Dialog>();
        dialog->filter = filter;
        check(CoCreateInstance(CLSID_FileOpenDialog, nullptr, CLSCTX_INPROC_SERVER, IID_PPV_ARGS(&dialog->object)));
        FILEOPENDIALOGOPTIONS options;
        check(dialog->object->GetOptions(&options));
        check(dialog->object->SetOptions(options | FOS_FORCEFILESYSTEM | FOS_FILEMUSTEXIST |
            FOS_PATHMUSTEXIST | FOS_NOCHANGEDIR));
        check(dialog->object->SetTitle(L"选择文件"));
        std::vector<COMDLG_FILTERSPEC> specifications;
        for (size_t i = 0; i < parts.size(); i += 2) specifications.push_back({parts[i].c_str(), parts[i + 1].c_str()});
        // SetFileTypes is called once for this persistent instance. Switching
        // between point cloud/CAD filters selects another prepared instance.
        check(dialog->object->SetFileTypes(static_cast<UINT>(specifications.size()), specifications.data()));
        if (initialFolder_) check(dialog->object->SetFolder(initialFolder_.Get()));
        dialog->events.Attach(new DialogEvents(this));
        check(dialog->object->Advise(dialog->events.Get(), &dialog->cookie));
        dialog->advised = true;
        if (dialogs_.size() == MAX_DIALOGS) dialogs_.erase(dialogs_.begin());
        Dialog* result = dialog.get();
        dialogs_.push_back(std::move(dialog));
        return result;
    }
};
HRESULT DialogEvents::OnFolderChange(IFileDialog* dialog) { owner_->probeShown(dialog); return S_OK; }
HRESULT DialogEvents::OnTypeChange(IFileDialog* dialog) { owner_->probeShown(dialog); return S_OK; }
} // namespace

int wmain() {
    std::ios::sync_with_stdio(false);
    HRESULT com = CoInitializeEx(nullptr, COINIT_APARTMENTTHREADED | COINIT_DISABLE_OLE1DDE);
    if (FAILED(com)) { std::cerr << errorCode(com) << '\n'; return 1; }
    int result = 0;
    try {
        Picker picker;
        // COM objects, options, types, owner HWND and initial local folder are
        // ready; Show/activation happens only after an actual stdin request.
        event("ready");
        picker.run();
    } catch (const std::exception& error) {
        std::cerr << error.what() << '\n'; result = 1;
    }
    CoUninitialize();
    return result;
}
