/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck

import koffi from 'koffi/indirect';
import { GameSprite } from './game-sprite.class';
import { kernel32, psapi } from './libs';
import { memRead_int32, memRead_ptr, memRead_uint32 } from './mem-read.service';
import { joinName } from './util.service';

export type MemResult = {
  pid: number;
  gameSprites: GameSprite[];
};

const TH32CS_SNAPPROCESS = 0x2;
const TH32CS_SNAPMODULE = 0x8;

const PROCESS_VM_READ = 0x0010;
const PROCESS_QUERY_INFORMATION = 0x0400;

const PROCESSENTRY32 = koffi.struct('PROCESSENTRY32', {
  dwSize: 'uint32',
  cntUsage: 'uint32',
  th32ProcessID: 'uint32',
  th32DefaultHeapID: 'ulong *',
  th32ModuleID: 'uint32',
  cntThreads: 'uint32',
  th32ParentProcessID: 'uint32',
  pcPriClassBase: 'long',
  dwFlags: 'uint32',
  szExeFile: koffi.array('char', 260, 'Array'),
});

const MODULEENTRY32 = koffi.struct('MODULEENTRY32', {
  dwSize: 'uint32',
  th32ModuleID: 'uint32',
  th32ProcessID: 'uint32',
  GlblcntUsage: 'uint32',
  ProccntUsage: 'uint32',
  modBaseAddr: 'void*',
  modBaseSize: 'uint32',
  hModule: 'void*',
  szModule: koffi.array('char', 255 + 1, 'Array'),
  szExePath: koffi.array('char', 260, 'Array'),
});

// typedef struct tagMODULEENTRY32 {
//     DWORD   dwSize;
//     DWORD   th32ModuleID;
//     DWORD   th32ProcessID;
//     DWORD   GlblcntUsage;
//     DWORD   ProccntUsage;
//     BYTE    *modBaseAddr;
//     DWORD   modBaseSize;
//     HMODULE hModule;
//     char    szModule[MAX_MODULE_NAME32 + 1];
//     char    szExePath[MAX_PATH];
//   } MODULEENTRY32;

koffi.struct('MODULEINFO', {
  lpBaseOfDll: 'void *',
  SizeOfImage: 'uint32',
  EntryPoint: 'void *',
});

const CreateToolhelp32Snapshot = kernel32.func('__stdcall', 'CreateToolhelp32Snapshot', 'void *', [
  'uint32',
  'void *',
]);

const Process32First = kernel32.func(
  'bool __stdcall Process32First(_In_ void* hSnapshot, _Inout_ PROCESSENTRY32* lppe)'
);

const Process32Next = kernel32.func(
  'bool __stdcall Process32Next(_In_ void* hSnapshot, _Inout_ PROCESSENTRY32* lppe)'
);

const Module32First = kernel32.func(
  'bool __stdcall Module32First(_In_ void* hSnapshot, _Inout_ MODULEENTRY32* lpme)'
);

const Module32Next = kernel32.func(
  'bool __stdcall Module32Next(_In_ void* hSnapshot, _Inout_ MODULEENTRY32* lpme)'
);

const OpenProcess = kernel32.func(
  'void* __stdcall OpenProcess(_In_ uint32 dwDesiredAccess, _In_ bool bInheritHandle, _In_ uint32 dwProcessId)'
);

const ReadProcessMemory_uint8 = kernel32.func(
  'bool __stdcall ReadProcessMemory(_In_ void* hProcess, _In_ void* lpBaseAddress, _Out_ uint8* lpBuffer, _In_ ulong nSize, _Out_ uint32* lpNumberOfBytesRead)'
);

const ReadProcessMemory_uint16 = kernel32.func(
  'bool __stdcall ReadProcessMemory(_In_ void* hProcess, _In_ void* lpBaseAddress, _Out_ uint16* lpBuffer, _In_ ulong nSize, _Out_ uint32* lpNumberOfBytesRead)'
);

const ReadProcessMemory_uint32 = kernel32.func(
  'bool __stdcall ReadProcessMemory(_In_ void* hProcess, _In_ void* lpBaseAddress, _Out_ uint32* lpBuffer, _In_ ulong nSize, _Out_ uint32* lpNumberOfBytesRead)'
);

const ReadProcessMemory_int32 = kernel32.func(
  'bool __stdcall ReadProcessMemory(_In_ void* hProcess, _In_ void* lpBaseAddress, _Out_ uint32* lpBuffer, _In_ ulong nSize, _Out_ int32* lpNumberOfBytesRead)'
);

const ReadProcessMemory_int64 = kernel32.func(
  'bool __stdcall ReadProcessMemory(_In_ void* hProcess, _In_ void* lpBaseAddress, _Out_ int64* lpBuffer, _In_ ulong nSize, _Out_ int32* lpNumberOfBytesRead)'
);

const ReadProcessMemory_uint64 = kernel32.func(
  'bool __stdcall ReadProcessMemory(_In_ void* hProcess, _In_ void* lpBaseAddress, _Out_ uint64* lpBuffer, _In_ ulong nSize, _Out_ int32* lpNumberOfBytesRead)'
);

const ReadProcessMemory_pointer = kernel32.func(
  'bool __stdcall ReadProcessMemory(_In_ void* hProcess, _In_ void* lpBaseAddress, _Out_ uint32* lpBuffer, _In_ ulong nSize, _Out_ int32* lpNumberOfBytesRead)'
);

const CloseHandle = kernel32.func('__stdcall', 'CloseHandle', 'bool', ['void *']);

const EnumProcessModules = psapi.func(
  'bool __stdcall EnumProcessModules(_In_ void* hProcess, _Out_ void** lphModule, _In_ uint32 cb, _Out_ uint32* lpcbNeeded)'
);

const GetModuleFileNameExA = psapi.func(
  'uint32 __stdcall GetModuleFileNameExA(_In_ void* hProcess, _In_ void* hModule, _Out_ uint8_t* lpFilename, _In_ uint32 nSize)'
);

const GetModuleInformation = psapi.func(
  'bool __stdcall GetModuleInformation(_In_ void* hProcess, _In_ void* hModule, _Out_ MODULEINFO* lpmodinfo, _In_ uint32 cb)'
);

export const mem = (): MemResult => {
  const memResult: MemResult = {
    pid: null,
    gameSprites: [],
  };

  const procSnap = CreateToolhelp32Snapshot(TH32CS_SNAPPROCESS, 0);

  const procEntry = {
    dwSize: koffi.sizeof(PROCESSENTRY32),
    cntUsage: 0,
    th32ProcessID: 0,
    th32DefaultHeapID: 0,
    th32ModuleID: 0,
    cntThreads: 0,
    th32ParentProcessID: 0,
    pcPriClassBase: 0,
    dwFlags: 0,
    szExeFile: new Array(260).fill(0),
  };

  Process32First(procSnap, procEntry);

  do {
    if (joinName(procEntry.szExeFile) === 'Baldur.exe') {
      memResult.pid = procEntry.th32ProcessID;

      break;
    }
  } while (Process32Next(procSnap, procEntry));

  if (!memResult.pid) {
    console.log('No PID found.');
  }

  const modEntry = {
    dwSize: koffi.sizeof(MODULEENTRY32),
    th32ModuleID: 0,
    th32ProcessID: 0,
    GlblcntUsage: 0,
    ProccntUsage: 0,
    modBaseAddr: 0,
    modBaseSize: 0,
    hModule: 0,
    szModule: new Array(255 + 1).fill(0),
    szExePath: new Array(260).fill(0),
  };

  const moduleSnap = CreateToolhelp32Snapshot(TH32CS_SNAPMODULE, memResult.pid);

  Module32First(moduleSnap, modEntry);

  do {
    if (joinName(modEntry.szModule) === 'Baldur.exe') {
      break;
    }
  } while (Module32Next(procSnap, modEntry));

  const modBaseAddr = koffi.address(modEntry.modBaseAddr);

  const procHandle = OpenProcess(PROCESS_VM_READ, true, memResult.pid);

  const offset = 0x68d434;

  const numEntities = memRead_int32(procHandle, modBaseAddr + BigInt(offset));

  const list = modBaseAddr + BigInt(offset + 0x4 + 0x18);

  const cGameObjectPtrs: number[] = [];

  for (let i = 2001 * 16; i <= numEntities * 16; i += 16) {
    if (memRead_uint32(procHandle, list + BigInt(i)) === 65535) {
      continue;
    }

    cGameObjectPtrs.push(memRead_ptr(procHandle, list + BigInt(i + 8)));
  }

  for (let i = 0; i < cGameObjectPtrs.length; i++) {
    const gameSprite: GameSprite = new GameSprite(procHandle, cGameObjectPtrs[i]);
    if (gameSprite.loaded) {
      memResult.gameSprites.push(gameSprite);
    }
  }

  CloseHandle(moduleSnap);
  CloseHandle(procSnap);

  return memResult;
};
