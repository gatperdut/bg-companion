import koffi from 'koffi/indirect';
import { checkError } from './error.service';
import { user32 } from './libs';

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

// Hook for EVENT_OBJECT_FOCUS

export const win = (pid: number) => {
    EnumWindows(callback, pid);
    
    let rect = {
        left: 0,
        top: 0,
        right: 0,
        bottom: 0
    };

    GetWindowRect(windowHandle, rect);

    console.log(rect);
    return rect;
}