import koffi from 'koffi/indirect';
import { GameSprite } from './game-sprite.class';
import { PROCESS_VM_READ, TH32CS_SNAPMODULE, TH32CS_SNAPPROCESS } from './koffi/defs/constants';
import {
  CloseHandle,
  CreateToolhelp32Snapshot,
  Module32First,
  Module32Next,
  OpenProcess,
  Process32First,
  Process32Next,
} from './koffi/defs/methods/process';
import { MODULEENTRY32, PROCESSENTRY32 } from './koffi/defs/structs';
import { memReadNumber } from './koffi/memread';
import { joinName } from './util.service';

export type MemResult = {
  pid: number;
  gameSprites: GameSprite[];
};

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

  const numEntities = memReadNumber(procHandle, modBaseAddr + BigInt(offset), 'INT32');

  const list = modBaseAddr + BigInt(offset + 0x4 + 0x18);

  const cGameObjectPtrs: number[] = [];

  for (let i = 2001 * 16; i <= numEntities * 16; i += 16) {
    if (memReadNumber(procHandle, list + BigInt(i), 'UINT32') === 65535) {
      continue;
    }

    cGameObjectPtrs.push(memReadNumber(procHandle, list + BigInt(i + 8), 'PTR'));
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
