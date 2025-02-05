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
import { MODULEENTRY32_empty, MODULEENTRY32_TYPE } from './koffi/defs/structs/moduleentry32';
import { PROCESSENTRY32_empty, PROCESSENTRY32_TYPE } from './koffi/defs/structs/processentry32';
import { memReadNumber } from './koffi/memread';
import { Sprite } from './sprite';
import { joinName } from './utils';

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

    const processEntry32: PROCESSENTRY32_TYPE = PROCESSENTRY32_empty();

    Process32First(this.processSnapshot, processEntry32);

    do {
      if (joinName(processEntry32.szExeFile) === 'Baldur.exe') {
        this.pid = processEntry32.th32ProcessID;

        break;
      }
    } while (Process32Next(this.processSnapshot, processEntry32));

    if (!this.pid) {
      console.log('No PID found.');

      return;
    }

    const moduleEntry32: MODULEENTRY32_TYPE = MODULEENTRY32_empty();

    const moduleSnapshot: HANDLE_PTR_TYPE = CreateToolhelp32Snapshot(TH32CS_SNAPMODULE, this.pid);

    Module32First(moduleSnapshot, moduleEntry32);

    do {
      if (joinName(moduleEntry32.szModule) === 'Baldur.exe') {
        break;
      }
    } while (Module32Next(this.processSnapshot, moduleEntry32));

    const modBaseAddr: bigint = koffi.address(moduleEntry32.modBaseAddr);

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
