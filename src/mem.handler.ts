import koffi from 'koffi/indirect';
import { PROCESS_VM_READ, TH32CS_SNAPMODULE, TH32CS_SNAPPROCESS } from './koffi/defs/constants';
import { HANDLE_PTR_TYPE } from './koffi/defs/handles';
import {
  CreateToolhelp32Snapshot,
  Module32First,
  Module32Next,
  OpenProcess,
  Process32First,
  Process32Next,
} from './koffi/defs/methods/process';
import { MODULEENTRY32_TYPE, MODULEENTRY32_empty } from './koffi/defs/structs/moduleentry32';
import { PROCESSENTRY32_TYPE, PROCESSENTRY32_empty } from './koffi/defs/structs/processentry32';
import { memReadNumber } from './koffi/memread';
import { Sprite } from './sprite';
import { joinName } from './utils';

export class MemHandler {
  private processSnapshot: HANDLE_PTR_TYPE;

  public processHandle: HANDLE_PTR_TYPE;

  public processPid: number;

  private moduleSnapshot: HANDLE_PTR_TYPE;

  private modBaseAddr: bigint;

  private offset: number = 0x68d434;

  public gameObjectPtrs: number[];

  public sprites: Sprite[];

  constructor() {
    this.init();
  }

  private init(): void {
    this.processSnapshot = CreateToolhelp32Snapshot(TH32CS_SNAPPROCESS, 0);

    const processEntry32: PROCESSENTRY32_TYPE = PROCESSENTRY32_empty();

    Process32First(this.processSnapshot, processEntry32);

    do {
      if (joinName(processEntry32.szExeFile) === 'Baldur.exe') {
        this.processPid = processEntry32.th32ProcessID;

        break;
      }
    } while (Process32Next(this.processSnapshot, processEntry32));

    if (!this.processPid) {
      console.log('No PID found.');

      return;
    }

    const moduleEntry32: MODULEENTRY32_TYPE = MODULEENTRY32_empty();

    this.moduleSnapshot = CreateToolhelp32Snapshot(TH32CS_SNAPMODULE, this.processPid);

    Module32First(this.moduleSnapshot, moduleEntry32);

    do {
      if (joinName(moduleEntry32.szModule) === 'Baldur.exe') {
        break;
      }
    } while (Module32Next(this.processSnapshot, moduleEntry32));

    this.modBaseAddr = koffi.address(moduleEntry32.modBaseAddr);

    this.processHandle = OpenProcess(PROCESS_VM_READ, true, this.processPid);
  }

  private clear(): void {
    this.gameObjectPtrs = [];

    this.sprites = [];
  }

  public run(): void {
    this.clear();

    const numEntities: number = memReadNumber(
      this.processHandle,
      this.modBaseAddr + BigInt(this.offset),
      'INT32'
    );

    const listPointer: bigint = this.modBaseAddr + BigInt(this.offset + 0x4 + 0x18);

    for (let i = 2001 * 16; i <= numEntities * 16; i += 16) {
      this.gameObjectPtrs.push(
        memReadNumber(this.processHandle, listPointer + BigInt(i + 8), 'PTR')
      );
    }
  }

  public destructor(): void {
    // CloseHandle(moduleSnapshot);
    // CloseHandle(this.processSnapshot);
  }
}
