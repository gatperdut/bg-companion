// const procHandle = OpenProcess(PROCESS_VM_READ | PROCESS_QUERY_INFORMATION, true, pid);
// console.log(procHandle);
// checkError();

// let moduleHandles = new Array(1024).fill(0);

// let cbNeeded = [0];

// EnumProcessModules(procHandle, moduleHandles, 8192, cbNeeded);
// checkError();

// let moduleInfo = {
//     lpBaseOfDll:0,
//     SizeOfImage:0,
//     EntryPoint:0,
// }

// let moduleName = new Array(1000).fill(' ')

// let moduleHandle;

// for (let i = 0; i < 1000; i++) {
//     GetModuleFileNameExA(procHandle, moduleHandles[i], moduleName, 1000);
//     if (exeName(moduleName).endsWith('Baldur.exe')) {
//         moduleHandle = moduleHandles[i];

//         break;
//     }
//     i++;
// }

// GetModuleInformation(procHandle, moduleHandle, moduleInfo, koffi.sizeof(MODULEINFO));

// console.log(moduleInfo);

// checkError();