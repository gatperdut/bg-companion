import koffi from 'koffi/indirect';
import { SetWindowsHookExACallbackProto } from './defs/methods/keyboard';

export const SetWindowsHookExACallbackRegister = (callback: unknown) => {
  return koffi.register(callback, koffi.pointer(SetWindowsHookExACallbackProto));
};
