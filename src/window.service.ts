/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck

import koffi from 'koffi/indirect';
import {
  DWMWA_EXTENDED_FRAME_BOUNDS,
  SM_CXFULLSCREEN,
  SM_CYFULLSCREEN,
} from './koffi/defs/constants';
import { HANDLE_PTR_TYPE } from './koffi/defs/handles';
import { GetSystemMetrics } from './koffi/defs/methods/system';
import { DwmGetWindowAttribute, EnumWindows } from './koffi/defs/methods/windowing';
import { RECT } from './koffi/defs/structs';
import { EnumWindowsCallbackRegister, getWindowThreadProcessId } from './koffi/windows';

let windowHandle: HANDLE_PTR_TYPE;

const enumWindowsCallback = (someWindowHandle: HANDLE_PTR_TYPE, someWindowPid: number) => {
  const windowPid = getWindowThreadProcessId(someWindowHandle);

  if (windowPid === someWindowPid) {
    windowHandle = someWindowHandle;

    return false;
  }

  return true;
};

const callback = EnumWindowsCallbackRegister(enumWindowsCallback);

export type WinResult = {
  rect;
  screen;
};

export const win = (pid: number): WinResult => {
  const result: WinResult = {
    rect: {
      left: 0,
      top: 0,
      right: 0,
      bottom: 0,
    },
    screen: {
      width: 0,
      height: 0,
    },
  };

  EnumWindows(callback, pid);

  DwmGetWindowAttribute(windowHandle, DWMWA_EXTENDED_FRAME_BOUNDS, result.rect, koffi.sizeof(RECT));

  result.screen.width = GetSystemMetrics(SM_CXFULLSCREEN);

  result.screen.height = GetSystemMetrics(SM_CYFULLSCREEN);

  return result;
};
