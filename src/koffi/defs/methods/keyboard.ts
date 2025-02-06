import { user32 } from 'src/koffi/defs/libs';
import { STDCALL } from '../constants';
import { INT32, UINT16 } from '../primitives';

export const GetAsyncKeyState = user32.func(STDCALL, 'GetAsyncKeyState', UINT16, [INT32]);
