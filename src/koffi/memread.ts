import { joinName } from '../util.service';
import { ReadProcessMemoryNumber, ReadProcessMemoryNumberSize } from './defs/methods/memory';
import { HANDLE_PTR_TYPE } from './defs/primitives';
import { NUMBER } from './defs/primitives/numbers';

export const memRead_string = (procHandle: HANDLE_PTR_TYPE, ptr: bigint): string => {
  const result: number[] = [];

  let character: number;

  let i: number = 0;

  while ((character = memReadNumber(procHandle, ptr + BigInt(i), 'UINT8'))) {
    result.push(character);

    i++;
  }

  return joinName(result);
};

export const memReadNumber = (procHandle: HANDLE_PTR_TYPE, ptr: bigint, type: NUMBER) => {
  const bytesRead: number[] = [null];

  const value: number[] = [null];

  ReadProcessMemoryNumber[type](
    procHandle,
    ptr,
    value,
    ReadProcessMemoryNumberSize[type],
    bytesRead
  );

  return value[0];
};

// export const memRead_int16 = (procHandle: HANDLE_PTR_TYPE, ptr: bigint): number => {
//   const bytesRead: number[] = [null];

//   const value: number[] = [null];

//   ReadProcessMemory_uint16(procHandle, ptr, value, 2, bytesRead);

//   return value[0];
// };

// export const memRead_int32 = (procHandle: HANDLE_PTR_TYPE, ptr: bigint): number => {
//   const bytesRead: number[] = [null];

//   const value: number[] = [null];

//   ReadProcessMemory_int32(procHandle, ptr, value, 4, bytesRead);

//   return value[0];
// };

// export const memRead_uint32 = (procHandle: HANDLE_PTR_TYPE, ptr: bigint): number => {
//   const bytesRead: number[] = [null];

//   const value: number[] = [null];

//   ReadProcessMemory_uint32(procHandle, ptr, value, 4, bytesRead);

//   return value[0];
// };

// export const memRead_ptr = (procHandle: HANDLE_PTR_TYPE, ptr: bigint) => {
//   const bytesRead: number[] = [null];

//   const value: number[] = [null];

//   ReadProcessMemory_ptr(procHandle, ptr, value, 4, bytesRead);

//   return value[0];
// };

// export const memRead_uint8 = (procHandle: HANDLE_PTR_TYPE, ptr: bigint) => {
//   const bytesRead: number[] = [null];

//   const value: number[] = [null];

//   ReadProcessMemory_uint8(procHandle, ptr, value, 1, bytesRead);

//   return value[0];
// };
