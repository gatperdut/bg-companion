import koffi from 'koffi/indirect';
import { user32 } from 'src/koffi/defs/libs';
import { STDCALL } from '../constants';
import { HANDLE_PTR } from '../handles';
import { INT32, LONG_PTR, UINT32, ULONG_PTR } from '../primitives';

export const SetWindowsHookExACallbackProto = koffi.proto(
  STDCALL,
  'SetWindowsHookExACallbackProto',
  LONG_PTR,
  [INT32, ULONG_PTR, LONG_PTR]
);

export const SetWindowsHookExA = user32.func(STDCALL, 'SetWindowsHookExA', HANDLE_PTR, [
  INT32,
  koffi.pointer(SetWindowsHookExACallbackProto),
  HANDLE_PTR,
  UINT32,
]);

export const CallNextHookEx = user32.func(STDCALL, 'CallNextHookEx', LONG_PTR, [
  HANDLE_PTR,
  INT32,
  ULONG_PTR,
  LONG_PTR,
]);
