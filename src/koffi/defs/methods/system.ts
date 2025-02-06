import { kernel32, user32 } from 'src/koffi/defs/libs';
import { STDCALL } from '../constants';
import { HANDLE_PTR } from '../handles';
import { BOOL, INT32, LONG } from '../primitives';

export const GetSystemMetrics = user32.func(STDCALL, 'GetSystemMetrics', INT32, [INT32]);

export const GetCurrentProcess = kernel32.func(STDCALL, 'GetCurrentProcess', HANDLE_PTR, []);

export const SetPriorityClass = kernel32.func(STDCALL, 'SetPriorityClass', BOOL, [
  HANDLE_PTR,
  LONG,
]);
