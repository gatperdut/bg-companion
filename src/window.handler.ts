import koffi from 'koffi/indirect';
import {
  DWMWA_EXTENDED_FRAME_BOUNDS,
  SM_CXFULLSCREEN,
  SM_CYFULLSCREEN,
} from './koffi/defs/constants';
import { HANDLE_PTR_TYPE } from './koffi/defs/handles';
import { GetSystemMetrics } from './koffi/defs/methods/system';
import { DwmGetWindowAttribute, EnumWindows } from './koffi/defs/methods/windows';
import { RECT } from './koffi/defs/structs';
import { EnumWindowsCallbackRegister, getWindowThreadProcessId } from './koffi/windows';

export type Rect = {
  left: number;
  top: number;
  right: number;
  bottom: number;
};

export type Screen = {
  width: number;
  height: number;
};

export class WindowHandler {
  private windowHandle: HANDLE_PTR_TYPE;

  private callback: unknown;

  public rect: Rect;

  public screen: Screen;

  constructor() {
    this.init();
  }

  private init(): void {
    this.callback = EnumWindowsCallbackRegister(this.enumWindowsCallback);

    this.rect = {
      left: null,
      top: null,
      right: null,
      bottom: null,
    };

    this.screen = {
      width: null,
      height: null,
    };
  }

  private enumWindowsCallback = (windowHandle: HANDLE_PTR_TYPE, someWindowPid: number) => {
    const windowPid = getWindowThreadProcessId(windowHandle);

    if (windowPid === someWindowPid) {
      this.windowHandle = windowHandle;

      return false;
    }

    return true;
  };

  public run(pid: number): void {
    EnumWindows(this.callback, pid);

    DwmGetWindowAttribute(
      this.windowHandle,
      DWMWA_EXTENDED_FRAME_BOUNDS,
      this.rect,
      koffi.sizeof(RECT)
    );

    this.screen.width = GetSystemMetrics(SM_CXFULLSCREEN);

    this.screen.height = GetSystemMetrics(SM_CYFULLSCREEN);
  }
}
