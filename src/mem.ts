import koffi from 'koffi/indirect';

const lib = koffi.load('kernel32.dll');

const TH32CS_SNAPPROCESS = 0x2

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

const CreateToolhelp32Snapshot = lib.func('__stdcall', 'CreateToolhelp32Snapshot', 'void *', ['uint32', 'void *'])

// const Process32First = lib.func('__stdcall', 'Process32First', 'bool', ['void *', PROCESSENTRY32])
const Process32First = lib.func('bool __stdcall Process32First(_In_ void *hSnapshot, _Inout_ PROCESSENTRY32 *lppe)');

// const Process32Next = lib.func('__stdcall', 'Process32Next', 'bool', ['void *', PROCESSENTRY32])
const Process32Next = lib.func('bool __stdcall Process32Next(_In_ void *hSnapshot, _Inout_ PROCESSENTRY32 *lppe)');

// int __stdcall GetCursorPos(_Out_ POINT *pos)'

const GetLastError = lib.func('__stdcall', 'GetLastError', 'uint32', []);

const CloseHandle = lib.func('__stdcall', 'CloseHandle', 'bool', ['void *']);

const checkError = (): number => {
    const error = GetLastError();

    console.error('ERROR: ', error);

    return error;
}

export const mem = (): void => {
    checkError();

    let snapHandle = CreateToolhelp32Snapshot(TH32CS_SNAPPROCESS, 0);

    console.log(snapHandle);

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

    console.log('SIZE OBJ', sizeOf(entry))

    Process32First(snapHandle, entry);
    
    
    do {
        if (exeName(entry.szExeFile) === 'Baldur.exe') {
            console.log('FOUND');
        };
    } while (Process32Next(snapHandle, entry));

    CloseHandle(snapHandle);
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

const typeSizes = {
    "undefined": () => 0,
    "boolean": () => 4,
    "number": () => 8,
    "string": item => 2 * item.length,
    "object": item => !item ? 0 : Object
      .keys(item)
      .reduce((total, key) => sizeOf(key) + sizeOf(item[key]) + total, 0)
  };
  
  const sizeOf = value => typeSizes[typeof value](value);
