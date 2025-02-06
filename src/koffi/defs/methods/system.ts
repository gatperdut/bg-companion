import { kernel32, user32 } from 'src/koffi/defs/libs';
import { STDCALL } from '../constants';
import { HANDLE_PTR } from '../handles';
import { INT32 } from '../primitives';

export const GetSystemMetrics = user32.func(STDCALL, 'GetSystemMetrics', INT32, [INT32]);

export const GetCurrentProcess = kernel32.func(STDCALL, 'GetCurrentProcess', HANDLE_PTR, []);

export const GetForegroundWindow = user32.func(STDCALL, 'GetForegroundWindow', HANDLE_PTR, []);
