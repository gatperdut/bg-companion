import koffi from 'koffi/indirect';

export const STDCALL = '__stdcall';

export const HANDLE = koffi.alias('HANDLE', 'void');

export const HANDLE_PTR = koffi.pointer(HANDLE);

export type HANDLE_PTR_TYPE = typeof HANDLE_PTR;

export const ADDRESS = koffi.alias('ADDRESS', 'void');

export const ADDRESS_PTR = koffi.pointer(ADDRESS);

export type ADDRESS_PTR_TYPE = typeof ADDRESS_PTR;

export const BOOL = koffi.alias('BOOL', 'bool');

export const CHAR_ARRAY = (length: number) => {
  return koffi.array('char', length, 'Array');
};
