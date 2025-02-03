import koffi from 'koffi/indirect';
import { BYTE_PTR, CHAR_ARRAY, HANDLE_PTR, LONG, UINT32, ULONG } from './primitives';

export const PROCESSENTRY32 = koffi.struct('PROCESSENTRY32', {
  dwSize: UINT32,
  cntUsage: UINT32,
  th32ProcessID: UINT32,
  th32DefaultHeapID: koffi.pointer(ULONG),
  th32ModuleID: UINT32,
  cntThreads: UINT32,
  th32ParentProcessID: UINT32,
  pcPriClassBase: LONG,
  dwFlags: UINT32,
  szExeFile: CHAR_ARRAY(260),
});

export const PROCESSENTRY32_PTR = koffi.pointer(PROCESSENTRY32);

export const MODULEENTRY32 = koffi.struct('MODULEENTRY32', {
  dwSize: UINT32,
  th32ModuleID: UINT32,
  th32ProcessID: UINT32,
  GlblcntUsage: UINT32,
  ProccntUsage: UINT32,
  modBaseAddr: BYTE_PTR,
  modBaseSize: UINT32,
  hModule: HANDLE_PTR,
  szModule: CHAR_ARRAY(255 + 1),
  szExePath: CHAR_ARRAY(260),
});

export const MODULEENTRY32_PTR = koffi.pointer(MODULEENTRY32);
