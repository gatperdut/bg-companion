import koffi from 'koffi/indirect';
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
import { Sprite } from './sprite';
import { blankArray, joinName } from './utils';

export class MemHandler {
  public pid: number;

  private processSnapshot: HANDLE_PTR_TYPE;

  public processHandle: HANDLE_PTR_TYPE;

  public gameObjectPtrs: number[];

  public sprites: Sprite[];

  constructor() {
    // Empty
  }

  private init(): void {
    this.pid = null;

    this.gameObjectPtrs = [];

    this.sprites = [];
  }

  public run(): void {
    this.init();

    this.processSnapshot = CreateToolhelp32Snapshot(TH32CS_SNAPPROCESS, 0);

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

    Process32First(this.processSnapshot, procEntry);

    do {
      if (joinName(procEntry.szExeFile) === 'Baldur.exe') {
        this.pid = procEntry.th32ProcessID;

        break;
      }
    } while (Process32Next(this.processSnapshot, procEntry));

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
    } while (Module32Next(this.processSnapshot, modEntry));

    const modBaseAddr: bigint = koffi.address(modEntry.modBaseAddr);

    this.processHandle = OpenProcess(PROCESS_VM_READ, true, this.pid);

    const offset: number = 0x68d434;

    const numEntities: number = memReadNumber(
      this.processHandle,
      modBaseAddr + BigInt(offset),
      'INT32'
    );

    const listPointer: bigint = modBaseAddr + BigInt(offset + 0x4 + 0x18);

    for (let i = 2001 * 16; i <= numEntities * 16; i += 16) {
      this.gameObjectPtrs.push(
        memReadNumber(this.processHandle, listPointer + BigInt(i + 8), 'PTR')
      );
    }

    CloseHandle(moduleSnapshot);
  }

  public processSnapshotClose(): void {
    CloseHandle(this.processSnapshot);
  }
}
