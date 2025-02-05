import koffi from 'koffi/indirect';
import { dwmapi, user32 } from 'src/koffi/defs/libs';
import { STDCALL } from '../constants';
import { HANDLE_PTR } from '../handles';
import { LONG } from '../primitives';
import { RECT_PTR } from '../structs/rect';

export const GetWindowThreadProcessId = user32.func(STDCALL, 'GetWindowThreadProcessId', LONG, [
  HANDLE_PTR,
  koffi.out(koffi.pointer(LONG)),
]);

export const EnumWindowsCallbackProto = koffi.proto(
  'bool __stdcall enumWindowsCallback(_In_ void* hwnd, _In_ long lParam)'
);

export const EnumWindows = user32.func(STDCALL, 'EnumWindows', 'bool', [
  koffi.pointer(EnumWindowsCallbackProto),
  LONG,
]);

export const DwmGetWindowAttribute = dwmapi.func(STDCALL, 'DwmGetWindowAttribute', LONG, [
  HANDLE_PTR,
  LONG,
  koffi.out(RECT_PTR),
  LONG,
]);
