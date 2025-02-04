import koffi from 'koffi/indirect';
import { HANDLE_PTR_TYPE } from './defs/handles';
import { EnumWindowsCallbackProto, GetWindowThreadProcessId } from './defs/methods/windowing';

export const EnumWindowsCallbackRegister = (callback: unknown) => {
  return koffi.register(callback, koffi.pointer(EnumWindowsCallbackProto));
};

export const getWindowThreadProcessId = (windowHandle: HANDLE_PTR_TYPE): number => {
  const windowPid: number[] = [0];

  GetWindowThreadProcessId(windowHandle, windowPid);

  return windowPid[0];
};
