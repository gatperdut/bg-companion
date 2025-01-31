import koffi from 'koffi/indirect';

const kernel32 = koffi.load('kernel32.dll');

const psapi = koffi.load('psapi.dll');

const TH32CS_SNAPPROCESS = 0x2;

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

const CreateToolhelp32Snapshot = kernel32.func('__stdcall', 'CreateToolhelp32Snapshot', 'void *', ['uint32', 'void *'])

const Process32First = kernel32.func('bool __stdcall Process32First(_In_ void* hSnapshot, _Inout_ PROCESSENTRY32* lppe)');

const Process32Next = kernel32.func('bool __stdcall Process32Next(_In_ void* hSnapshot, _Inout_ PROCESSENTRY32* lppe)');

const OpenProcess = kernel32.func('void* __stdcall OpenProcess(_In_ uint32 dwDesiredAccess, _In_ bool bInheritHandle, _In_ uint32 dwProcessId)');

const EnumProcessModules = psapi.func('bool __stdcall EnumProcessModules(_In_ void* hProcess, _Out_ void** lphModule, _In_ uint32 cb, _Out_ uint32* lpcbNeeded)');

const K32EnumProcessModules = kernel32.func('bool __stdcall K32EnumProcessModules(_In_ void* hProcess, _Out_ void** lphModule, _In_ uint32 cb, _Out_ uint32* lpcbNeeded)');

const ReadProcessMemory = kernel32.func('bool __stdcall ReadProcessMemory(_In_ void* hProcess, _In_ void* lpBaseAddress, _Out_ void* lpBuffer, _In_ ulong nSize, _Out_ ulong* lpNumberOfBytesRead)');

const GetLastError = kernel32.func('__stdcall', 'GetLastError', 'uint32', []);

const CloseHandle = kernel32.func('__stdcall', 'CloseHandle', 'bool', ['void *']);

const checkError = (): number => {
    const error = GetLastError();

    console.error('ERROR: ', error);

    return error;
}

export const mem = (): void => {
    checkError();

    const snapHandle = CreateToolhelp32Snapshot(TH32CS_SNAPPROCESS, 0);

    checkError();

    let entry = {
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

    console.log('SIZE TYPE', koffi.sizeof(PROCESSENTRY32));

    Process32First(snapHandle, entry);
    
    let pid;

    do {
        if (exeName(entry.szExeFile) === 'Baldur.exe') {
            pid = entry.th32ProcessID;

            console.log('PID: ', pid);

            break;
        };
    } while (Process32Next(snapHandle, entry));
    checkError();
    
    CloseHandle(snapHandle);
    checkError();
    
    if (!pid) {
        console.log('No PID found.');
    }
    
    const procHandle = OpenProcess(PROCESS_VM_READ | PROCESS_QUERY_INFORMATION, true, pid);
    console.log(procHandle);
    checkError();

    let moduleHandles = new Array(1024).fill(0);

    let cbNeeded = [0];

    EnumProcessModules(procHandle, moduleHandles, 8192, cbNeeded);
    checkError();
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
