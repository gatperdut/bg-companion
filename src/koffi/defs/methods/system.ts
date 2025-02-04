import { user32 } from 'src/koffi/win32-libs';
import { STDCALL } from '../constants';
import { INT32 } from '../primitives';

export const GetSystemMetrics = user32.func(STDCALL, 'GetSystemMetrics', INT32, [INT32]);
