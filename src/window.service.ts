import koffi from 'koffi/indirect';
import { checkError } from './error.service';
import { dwmapi, user32 } from './libs';

const GetWindowThreadProcessId = user32.func('long __stdcall GetWindowThreadProcessId(_In_ void* hwnd, _Inout_ long* lpdwProcessId)')

let windowHandle;

const enumWindowsCallback = (hWnd , pid) => {
    let wpid = [0];
    GetWindowThreadProcessId(hWnd, wpid);
    if (pid === wpid[0]) {
        windowHandle = hWnd;

        return false;
    }
    
    return true;
};

const EnumWindowsCallbackProto = koffi.proto('bool __stdcall enumWindowsCallback(_In_ void* hwnd, _In_ long lParam)')

const EnumWindows = user32.func('__stdcall', 'EnumWindows', 'bool ', [koffi.pointer(EnumWindowsCallbackProto), 'long']);

let callback = koffi.register(enumWindowsCallback, koffi.pointer(EnumWindowsCallbackProto))

const RECT = koffi.struct('RECT', {
    left: 'uint32',
    top: 'uint32',
    right: 'uint32',
    bottom: 'uint32',
});



const GetWindowRect = user32.func('bool __stdcall GetWindowRect(_In_ void* hwnd, _Out_ RECT* lpRect)');

const DwmGetWindowAttribute = dwmapi.func('long __stdcall DwmGetWindowAttribute(_In_ void* hwnd, _In_ long dwAttribute, _Out_ RECT* pvAttribute, _In_ long cbAttribute)');

const GetSystemMetrics = user32.func('int __stdcall GetSystemMetrics(_In_ int nIndex)');

// Hook for EVENT_OBJECT_FOCUS

export type WinResult = {
    rect;
    screen;
}

export const win = (pid: number): WinResult => {
    const result: WinResult = {
        rect: {
            left: 0,
            top: 0,
            right: 0,
            bottom: 0
        },
        screen: {
            width: 0,
            height: 0
        }
    }

    EnumWindows(callback, pid);
    
    // GetWindowRect(windowHandle, rect);
    // console.log(rect);

    DwmGetWindowAttribute(windowHandle, 9, result.rect, koffi.sizeof(RECT))

    result.screen.width = GetSystemMetrics(16)

    result.screen.height = GetSystemMetrics(17)

    console.log(result);

    return result;
}