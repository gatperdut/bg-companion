import koffi from 'koffi/indirect';

export const STDCALL = '__stdcall';

export const HANDLE = koffi.alias('HANDLE', 'void');

export const HANDLE_PTR = koffi.pointer(HANDLE);

export type HANDLE_PTR_TYPE = typeof HANDLE_PTR;

export const ADDRESS = koffi.alias('ADDRESS', 'void');

export const ADDRESS_PTR = koffi.pointer(ADDRESS);

export const BOOL = koffi.alias('BOOL', 'bool');

export const CHAR_ARRAY = (length: number) => {
  return koffi.array('char', length, 'Array');
};

export const BYTE = koffi.alias('BYTE', 'unsigned char');

export const BYTE_PTR = koffi.pointer(BYTE);

export const UINT8 = koffi.alias('UINT8', 'uint8');

export const UINT16 = koffi.alias('UINT16', 'uint16');

export const INT32 = koffi.alias('INT32', 'int32');

export const UINT32 = koffi.alias('UINT32', 'uint32');

export const DWORD = koffi.alias('DWORD', UINT32);

export const LONG = koffi.alias('LONG', 'long');

export const ULONG = koffi.alias('ULONG', 'ulong');
