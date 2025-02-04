import { kernel32 } from 'src/koffi/defs/libs';
import { STDCALL } from '../constants';
import { UINT32 } from '../primitives';

export const GetLastError = kernel32.func(STDCALL, 'GetLastError', UINT32, []);
