import koffi from 'koffi/indirect';

export const BYTE = koffi.alias('BYTE', 'unsigned char');

export const UINT8 = koffi.alias('UINT8', 'uint8');

export const INT16 = koffi.alias('INT16', 'int16');

export const UINT16 = koffi.alias('UINT16', 'uint16');

export const INT32 = koffi.alias('INT32', 'int32');

export const UINT32 = koffi.alias('UINT32', 'uint32');

export const DWORD = koffi.alias('DWORD', UINT32);

export const LONG = koffi.alias('LONG', 'long');

export const ULONG = koffi.alias('ULONG', 'ulong');

export const PTR = koffi.alias('PTR', UINT32);

export type NUMBER =
  | 'BYTE'
  | 'UINT8'
  | 'INT16'
  | 'UINT16'
  | 'INT32'
  | 'UINT32'
  | 'DWORD'
  | 'LONG'
  | 'ULONG'
  | 'PTR';
