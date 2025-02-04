import koffi from 'koffi/indirect';
import { GameSprite } from './game-sprite.class';
import { PROCESS_VM_READ, TH32CS_SNAPMODULE, TH32CS_SNAPPROCESS } from './koffi/defs/constants';
import { HANDLE_PTR_TYPE } from './koffi/defs/handles';
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
import { blankArray, joinName } from './utils';

export class MemHandler {
  public pid: number;

  public gameSprites: GameSprite[];

  constructor() {
    // Empty
  }

  private init(): void {
    this.pid = null;

    this.gameSprites = [];
  }

  public update(): void {
    this.init();

    const procSnap: HANDLE_PTR_TYPE = CreateToolhelp32Snapshot(TH32CS_SNAPPROCESS, 0);

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
      szExeFile: blankArray(260),
    };

    Process32First(procSnap, procEntry);

    do {
      if (joinName(procEntry.szExeFile) === 'Baldur.exe') {
        this.pid = procEntry.th32ProcessID;

        break;
      }
    } while (Process32Next(procSnap, procEntry));

    if (!this.pid) {
      console.log('No PID found.');

      return;
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
      szModule: blankArray(255 + 1),
      szExePath: blankArray(260),
    };

    const moduleSnapshot: HANDLE_PTR_TYPE = CreateToolhelp32Snapshot(TH32CS_SNAPMODULE, this.pid);

    Module32First(moduleSnapshot, modEntry);

    do {
      if (joinName(modEntry.szModule) === 'Baldur.exe') {
        break;
      }
    } while (Module32Next(procSnap, modEntry));

    const modBaseAddr: bigint = koffi.address(modEntry.modBaseAddr);

    const processHandle: HANDLE_PTR_TYPE = OpenProcess(PROCESS_VM_READ, true, this.pid);

    const offset: number = 0x68d434;

    const numEntities: number = memReadNumber(processHandle, modBaseAddr + BigInt(offset), 'INT32');

    const listPointer: bigint = modBaseAddr + BigInt(offset + 0x4 + 0x18);

    const gameObjectPtrs: number[] = [];

    for (let i = 2001 * 16; i <= numEntities * 16; i += 16) {
      if (memReadNumber(processHandle, listPointer + BigInt(i), 'UINT32') === 65535) {
        continue;
      }

      gameObjectPtrs.push(memReadNumber(processHandle, listPointer + BigInt(i + 8), 'PTR'));
    }

    for (let i: number = 0; i < gameObjectPtrs.length; i++) {
      const gameSprite: GameSprite = new GameSprite(processHandle, gameObjectPtrs[i]);

      if (gameSprite.loaded) {
        this.gameSprites.push(gameSprite);
      }
    }

    CloseHandle(moduleSnapshot);
    CloseHandle(procSnap);
  }
}
