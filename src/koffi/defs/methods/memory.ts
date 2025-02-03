import koffi from 'koffi/indirect';

import { kernel32 } from 'src/win32-libs';
import {
  ADDRESS_PTR,
  BOOL,
  HANDLE_PTR,
  HANDLE_PTR_TYPE,
  INT32,
  STDCALL,
  UINT16,
  UINT32,
  UINT8,
  ULONG,
} from '../primitives';

type ReadProcessMemoryFn = (
  handlePtr: HANDLE_PTR_TYPE,
  address: typeof ADDRESS_PTR,
  value: number[],
  size: number,
  bytesRead: number[]
) => number;

// ReadProcessMemory_uint16(procHandle, ptr, value, 2, bytesRead);
export const ReadProcessMemory_number = (type: unknown): ReadProcessMemoryFn => {
  return kernel32.func(STDCALL, 'ReadProcessMemory', BOOL, [
    HANDLE_PTR,
    ADDRESS_PTR,
    koffi.out(koffi.pointer(type)),
    ULONG,
    koffi.out(koffi.pointer(UINT32)),
  ]);
};

export const ReadProcessMemory_uint8 = ReadProcessMemory_number(UINT8);

export const ReadProcessMemory_uint16 = ReadProcessMemory_number(UINT16);

export const ReadProcessMemory_uint32 = ReadProcessMemory_number(UINT32);

export const ReadProcessMemory_int32 = ReadProcessMemory_number(INT32);

export const ReadProcessMemory_ptr = ReadProcessMemory_number(UINT32);
