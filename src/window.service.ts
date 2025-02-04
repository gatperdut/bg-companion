/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck

import koffi from 'koffi/indirect';
import { SM_CXFULLSCREEN, SM_CYFULLSCREEN } from './koffi/defs/constants';
import { GetSystemMetrics } from './koffi/defs/methods/system';
import {
  DwmGetWindowAttribute,
  EnumWindows,
  EnumWindowsCallbackRegister,
  GetWindowThreadProcessId,
} from './koffi/defs/methods/windows';
import { RECT } from './koffi/defs/structs';

let windowHandle;

const enumWindowsCallback = (hWnd, pid) => {
  let wpid = [0];
  GetWindowThreadProcessId(hWnd, wpid);
  if (pid === wpid[0]) {
    windowHandle = hWnd;

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

  DwmGetWindowAttribute(windowHandle, 9, result.rect, koffi.sizeof(RECT));

  result.screen.width = GetSystemMetrics(SM_CXFULLSCREEN);

  result.screen.height = GetSystemMetrics(SM_CYFULLSCREEN);

  return result;
};
