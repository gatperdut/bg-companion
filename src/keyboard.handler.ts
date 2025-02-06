import koffi from 'koffi/indirect';
import { EntityHandler } from './entity.handler';
import { WH_KEYBOARD_LL } from './koffi/defs/constants';
import { CallNextHookEx, SetWindowsHookExA } from './koffi/defs/methods/keyboard';
import { KBDLLHOOKSTRUCT, KBDLLHOOKSTRUCT_TYPE } from './koffi/defs/structs/kbdllhookstruct';
import { SetWindowsHookExACallbackRegister } from './koffi/keyboard';

export class KeyboardHandler {
  private callback: unknown;

  private hook: unknown;

  constructor(private entityHandler: EntityHandler) {
    this.init();
  }

  private init(): void {
    this.callback = SetWindowsHookExACallbackRegister(this.setWindowsHookExACallback);

    this.hook = SetWindowsHookExA(WH_KEYBOARD_LL, this.callback, null, 0);
  }

  private show: boolean = false;

  private setWindowsHookExACallback = (
    nCode: number,
    wParam: unknown,
    lParam: KBDLLHOOKSTRUCT_TYPE
  ) => {
    if (nCode >= 0) {
      const info = koffi.decode(lParam, KBDLLHOOKSTRUCT);
      if (info.vkCode === 160) {
        if (info.flags) {
          if (this.show) {
            this.entityHandler.hideTrackers();
          }
          this.show = false;
        } else {
          if (!this.show) {
            this.entityHandler.showTrackers();
          }
          this.show = true;
        }
      }
    }

    return CallNextHookEx(this.hook, nCode, wParam, lParam);
  };
}
