import koffi from 'koffi/indirect';

import { kernel32 } from 'src/win32-libs';
import {
  ADDRESS_PTR,
  ADDRESS_PTR_TYPE,
  BOOL,
  HANDLE_PTR,
  HANDLE_PTR_TYPE,
  STDCALL,
} from '../primitives';
import {
  BYTE,
  DWORD,
  INT16,
  INT32,
  LONG,
  NUMBER,
  UINT16,
  UINT32,
  UINT8,
  ULONG,
} from '../primitives/numbers';

type ReadProcessMemoryFn = (
  handlePtr: HANDLE_PTR_TYPE,
  address: ADDRESS_PTR_TYPE,
  value: number[],
  size: number,
  bytesRead: number[]
) => number;

const ReadProcessMemoryNumberDefine = (type: unknown): ReadProcessMemoryFn => {
  return kernel32.func(STDCALL, 'ReadProcessMemory', BOOL, [
    HANDLE_PTR,
    ADDRESS_PTR,
    koffi.out(koffi.pointer(type)),
    ULONG,
    koffi.out(koffi.pointer(UINT32)),
  ]);
};

export const ReadProcessMemoryNumber: Record<NUMBER, ReadProcessMemoryFn> = {
  BYTE: ReadProcessMemoryNumberDefine(BYTE),
  UINT8: ReadProcessMemoryNumberDefine(UINT8),
  INT16: ReadProcessMemoryNumberDefine(INT16),
  UINT16: ReadProcessMemoryNumberDefine(UINT16),
  INT32: ReadProcessMemoryNumberDefine(INT32),
  UINT32: ReadProcessMemoryNumberDefine(UINT32),
  DWORD: ReadProcessMemoryNumberDefine(DWORD),
  LONG: ReadProcessMemoryNumberDefine(LONG),
  ULONG: ReadProcessMemoryNumberDefine(ULONG),
  PTR: ReadProcessMemoryNumberDefine(UINT32),
};

export const ReadProcessMemoryNumberSize: Record<NUMBER, number> = {
  BYTE: 1,
  UINT8: 1,
  INT16: 2,
  UINT16: 2,
  UINT32: 4,
  INT32: 4,
  DWORD: 4,
  LONG: 4,
  ULONG: 4,
  PTR: 4,
};
