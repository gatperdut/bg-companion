import { kernel32 } from 'src/koffi/win32-libs';
import { STDCALL } from '../constants';
import { UINT32 } from '../primitives';

export const GetLastError = kernel32.func(STDCALL, 'GetLastError', UINT32, []);
