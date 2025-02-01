import koffi from 'koffi/indirect';
import { joinName } from './util.service';

const kernel32 = koffi.load('kernel32.dll');

const ReadProcessMemory_uint8 = kernel32.func('bool __stdcall ReadProcessMemory(_In_ void* hProcess, _In_ void* lpBaseAddress, _Out_ uint8* lpBuffer, _In_ ulong nSize, _Out_ uint32* lpNumberOfBytesRead)');

const ReadProcessMemory_uint16 = kernel32.func('bool __stdcall ReadProcessMemory(_In_ void* hProcess, _In_ void* lpBaseAddress, _Out_ uint16* lpBuffer, _In_ ulong nSize, _Out_ uint32* lpNumberOfBytesRead)');

const ReadProcessMemory_uint32 = kernel32.func('bool __stdcall ReadProcessMemory(_In_ void* hProcess, _In_ void* lpBaseAddress, _Out_ uint32* lpBuffer, _In_ ulong nSize, _Out_ uint32* lpNumberOfBytesRead)');

const ReadProcessMemory_int32 = kernel32.func('bool __stdcall ReadProcessMemory(_In_ void* hProcess, _In_ void* lpBaseAddress, _Out_ uint32* lpBuffer, _In_ ulong nSize, _Out_ int32* lpNumberOfBytesRead)');

const ReadProcessMemory_int64 = kernel32.func('bool __stdcall ReadProcessMemory(_In_ void* hProcess, _In_ void* lpBaseAddress, _Out_ int64* lpBuffer, _In_ ulong nSize, _Out_ int32* lpNumberOfBytesRead)');

const ReadProcessMemory_uint64 = kernel32.func('bool __stdcall ReadProcessMemory(_In_ void* hProcess, _In_ void* lpBaseAddress, _Out_ uint64* lpBuffer, _In_ ulong nSize, _Out_ int32* lpNumberOfBytesRead)');

const ReadProcessMemory_ptr = kernel32.func('bool __stdcall ReadProcessMemory(_In_ void* hProcess, _In_ void* lpBaseAddress, _Out_ uint32* lpBuffer, _In_ ulong nSize, _Out_ int32* lpNumberOfBytesRead)');

export const memRead_string = (procHandle, ptr: bigint): string => {
    const result: number[] = [];

    let character: number;

    let i: number = 0;

    while (character = memRead_uint8(procHandle, ptr + BigInt(i))) {
        result.push(character);

        i++;
    }

    return joinName(result);
}

export const memRead_int16 = (procHandle, ptr: bigint): number => {
    const bytesRead: number[] = [0];

    const value: number[] = [0];

    ReadProcessMemory_uint16(procHandle, ptr, value, 2, bytesRead);

    return value[0];
}

export const memRead_uint32 = (procHandle, ptr: bigint): number => {
    const bytesRead: number[] = [0];

    const value: number[] = [0];

    ReadProcessMemory_uint32(procHandle, ptr, value, 4, bytesRead);

    return value[0];
}

export const memRead_ptr = (procHandle, ptr: bigint) => {
    const bytesRead: number[] = [0];

    const value: number[] = [0];

    ReadProcessMemory_ptr(procHandle, ptr, value, 4, bytesRead);

    return value[0];
}

export const memRead_uint8 = (procHandle, ptr: bigint) => {
    const bytesRead: number[] = [0];

    const value: number[] = [0];

    ReadProcessMemory_uint8(procHandle, ptr, value, 1, bytesRead);

    return value[0];
}

