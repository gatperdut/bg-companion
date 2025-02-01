import koffi from 'koffi/indirect';

const kernel32 = koffi.load('kernel32.dll');

const psapi = koffi.load('psapi.dll');

const TH32CS_SNAPPROCESS = 0x2;
const TH32CS_SNAPMODULE = 0x8;

const PROCESS_VM_READ  = 0x0010;
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
    szExeFile: koffi.array('char', 260, 'Array')
})

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

const MODULEINFO = koffi.struct('MODULEINFO', {
    lpBaseOfDll: 'void *',
    SizeOfImage: 'uint32',
    EntryPoint: 'void *',
})

const CreateToolhelp32Snapshot = kernel32.func('__stdcall', 'CreateToolhelp32Snapshot', 'void *', ['uint32', 'void *'])

const Process32First = kernel32.func('bool __stdcall Process32First(_In_ void* hSnapshot, _Inout_ PROCESSENTRY32* lppe)');

const Process32Next = kernel32.func('bool __stdcall Process32Next(_In_ void* hSnapshot, _Inout_ PROCESSENTRY32* lppe)');

const Module32First = kernel32.func('bool __stdcall Module32First(_In_ void* hSnapshot, _Inout_ MODULEENTRY32* lpme)')

const Module32Next = kernel32.func('bool __stdcall Module32Next(_In_ void* hSnapshot, _Inout_ MODULEENTRY32* lpme)')

const OpenProcess = kernel32.func('void* __stdcall OpenProcess(_In_ uint32 dwDesiredAccess, _In_ bool bInheritHandle, _In_ uint32 dwProcessId)');

const ReadProcessMemory_uint8 = kernel32.func('bool __stdcall ReadProcessMemory(_In_ void* hProcess, _In_ void* lpBaseAddress, _Out_ uint8* lpBuffer, _In_ ulong nSize, _Out_ uint32* lpNumberOfBytesRead)');

const ReadProcessMemory_uint16 = kernel32.func('bool __stdcall ReadProcessMemory(_In_ void* hProcess, _In_ void* lpBaseAddress, _Out_ uint16* lpBuffer, _In_ ulong nSize, _Out_ uint32* lpNumberOfBytesRead)');

const ReadProcessMemory_uint32 = kernel32.func('bool __stdcall ReadProcessMemory(_In_ void* hProcess, _In_ void* lpBaseAddress, _Out_ uint32* lpBuffer, _In_ ulong nSize, _Out_ uint32* lpNumberOfBytesRead)');

const ReadProcessMemory_int32 = kernel32.func('bool __stdcall ReadProcessMemory(_In_ void* hProcess, _In_ void* lpBaseAddress, _Out_ uint32* lpBuffer, _In_ ulong nSize, _Out_ int32* lpNumberOfBytesRead)');

const ReadProcessMemory_int64 = kernel32.func('bool __stdcall ReadProcessMemory(_In_ void* hProcess, _In_ void* lpBaseAddress, _Out_ int64* lpBuffer, _In_ ulong nSize, _Out_ int32* lpNumberOfBytesRead)');

const ReadProcessMemory_uint64 = kernel32.func('bool __stdcall ReadProcessMemory(_In_ void* hProcess, _In_ void* lpBaseAddress, _Out_ uint64* lpBuffer, _In_ ulong nSize, _Out_ int32* lpNumberOfBytesRead)');

const ReadProcessMemory_pointer = kernel32.func('bool __stdcall ReadProcessMemory(_In_ void* hProcess, _In_ void* lpBaseAddress, _Out_ uint32* lpBuffer, _In_ ulong nSize, _Out_ int32* lpNumberOfBytesRead)');

const GetLastError = kernel32.func('__stdcall', 'GetLastError', 'uint32', []);

const CloseHandle = kernel32.func('__stdcall', 'CloseHandle', 'bool', ['void *']);

const EnumProcessModules = psapi.func('bool __stdcall EnumProcessModules(_In_ void* hProcess, _Out_ void** lphModule, _In_ uint32 cb, _Out_ uint32* lpcbNeeded)');

const GetModuleFileNameExA = psapi.func('uint32 __stdcall GetModuleFileNameExA(_In_ void* hProcess, _In_ void* hModule, _Out_ uint8_t* lpFilename, _In_ uint32 nSize)');

const GetModuleInformation = psapi.func('bool __stdcall GetModuleInformation(_In_ void* hProcess, _In_ void* hModule, _Out_ MODULEINFO* lpmodinfo, _In_ uint32 cb)');

let lastError = 0;

const checkError = (): number => {
    const error = GetLastError();

    if (error && error !== lastError) {
        console.error('***********ERROR: ', error);

        lastError = error;
    }

    return error;
}

export const mem = (): void => {
    checkError();

    const procSnap = CreateToolhelp32Snapshot(TH32CS_SNAPPROCESS, 0);

    checkError();

    let procEntry = {
        dwSize: koffi.sizeof(PROCESSENTRY32),
        cntUsage: 0,
        th32ProcessID: 0,
        th32DefaultHeapID: 0,
        th32ModuleID: 0,
        cntThreads: 0,
        th32ParentProcessID: 0,
        pcPriClassBase: 0,
        dwFlags: 0,
        szExeFile: new Array(260).fill(0)
    };

    console.log('PROCENTRYSIZE', koffi.sizeof(PROCESSENTRY32));

    Process32First(procSnap, procEntry);
    
    let pid;

    do {
        if (exeName(procEntry.szExeFile) === 'Baldur.exe') {
            pid = procEntry.th32ProcessID;

            console.log('PID: ', pid);

            break;
        };
    } while (Process32Next(procSnap, procEntry));
    checkError();
    
    checkError();
    
    if (!pid) {
        console.log('No PID found.');
    }
    
    let modEntry = {
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
    }
    
    const moduleSnap = CreateToolhelp32Snapshot(TH32CS_SNAPMODULE, pid);
    
    console.log('MODENTRYSIZE', koffi.sizeof(MODULEENTRY32));
    
    Module32First(moduleSnap, modEntry);
    checkError();
    
    do {
        if (exeName(modEntry.szModule) === 'Baldur.exe') {
            break;
        }
    } while (Module32Next(procSnap, modEntry));

    const modBaseAddr = koffi.address(modEntry.modBaseAddr);

    const procHandle = OpenProcess(PROCESS_VM_READ, true, pid);
    
    const offset = 0x68D434;
    
    let bytesRead = [0];

    let numEntities = [0];
    
    ReadProcessMemory_int32(procHandle, modBaseAddr + BigInt(offset), numEntities, 4, bytesRead);

    console.log('num entities: ', numEntities[0]);

    const list = modBaseAddr + BigInt(offset + 0x4 + 0x18);

    let ids = '';

    let padding = '';

    let objectPtrs = [];

    let types = [];
    
    let buffer = [0];

    let ptr = '';

    for (let i = 2001 * 16; i <= numEntities[0] * 16; i += 16) {

        ReadProcessMemory_uint16(procHandle, list + BigInt(i), buffer, 2, bytesRead);
        ids += buffer[0] + ' ';

        ReadProcessMemory_uint8(procHandle, list + BigInt(i + 2), buffer, 1, bytesRead);
        padding += buffer[0] + ' '; 
        ReadProcessMemory_uint8(procHandle, list + BigInt(i + 3), buffer, 1, bytesRead);
        padding += buffer[0] + ' '; 
        ReadProcessMemory_uint8(procHandle, list + BigInt(i + 4), buffer, 1, bytesRead);
        padding += buffer[0] + ' '; 
        ReadProcessMemory_uint8(procHandle, list + BigInt(i + 5), buffer, 1, bytesRead);
        padding += buffer[0] + ' '; 
        ReadProcessMemory_uint8(procHandle, list + BigInt(i + 6), buffer, 1, bytesRead);
        padding += buffer[0] + ' '; 
        ReadProcessMemory_uint8(procHandle, list + BigInt(i + 7), buffer, 1, bytesRead);
        padding += buffer[0] + ' '; 
        padding += '      ';



        ReadProcessMemory_uint8(procHandle, list + BigInt(i + 8), buffer, 1, bytesRead);
        ptr += buffer[0] + ' '; 
        ReadProcessMemory_uint8(procHandle, list + BigInt(i + 9), buffer, 1, bytesRead);
        ptr += buffer[0] + ' '; 
        ReadProcessMemory_uint8(procHandle, list + BigInt(i + 10), buffer, 1, bytesRead);
        ptr += buffer[0] + ' '; 
        ReadProcessMemory_uint8(procHandle, list + BigInt(i + 11), buffer, 1, bytesRead);
        ptr += buffer[0] + ' '; 
        ReadProcessMemory_uint8(procHandle, list + BigInt(i + 12), buffer, 1, bytesRead);
        ptr += buffer[0] + ' '; 
        ReadProcessMemory_uint8(procHandle, list + BigInt(i + 13), buffer, 1, bytesRead);
        ptr += buffer[0] + ' '; 
        ReadProcessMemory_uint8(procHandle, list + BigInt(i + 14), buffer, 1, bytesRead);
        ptr += buffer[0] + ' '; 
        ReadProcessMemory_uint8(procHandle, list + BigInt(i + 15), buffer, 1, bytesRead);
        ptr += buffer[0] + ' '; 
        ptr += '      ';

        ReadProcessMemory_pointer(procHandle, list + BigInt(i + 8), buffer, 4, bytesRead);
        objectPtrs.push(buffer[0]);

    }

    checkError();
    
    for (let i = 0; i < objectPtrs.length; i++) {
        ReadProcessMemory_uint8(procHandle, BigInt(objectPtrs[i]) + BigInt(0x8), buffer, 1, bytesRead);
        
        checkError();
        if (buffer[0] === 49) {
            console.log('FOUND')
        }
        types.push(buffer[0]);
    }
    
    checkError();

    // console.log(ids);
    // console.log(padding);
    // console.log(objectPtrs);
    console.log(types.join(' '));
    // console.log(ptr)

    console.log('DONE');

    CloseHandle(moduleSnap);
    CloseHandle(procSnap);
}

const exeName = (nums: number[]): string => {
    let result: string[] = [];

    let i = 0;

    while (i < nums.length && nums[i]) {
        result.push(String.fromCharCode(nums[i]));

        i++;
    }

    return result.join('');
}
