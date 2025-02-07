import { EntityHandler } from './entity.handler';
import { VK_LSHIFT } from './koffi/defs/constants';
import { GetAsyncKeyState } from './koffi/defs/methods/keyboard';
import { WindowHandler } from './window.handler';

export class KeyboardHandler {
  constructor(
    private windowHandler: WindowHandler,
    private entityHandler: EntityHandler
  ) {
    // Empty
  }

  public run(): void {
    if (!this.windowHandler.focused) {
      this.entityHandler.hideTrackers();

      return;
    }

    const state: number = GetAsyncKeyState(VK_LSHIFT);

    if (state) {
      this.entityHandler.showTrackers();
    } else {
      this.entityHandler.hideTrackers();
    }

    const ctrl = GetAsyncKeyState(0xa2);
    if (ctrl) {
      this.entityHandler.print();
    }
  }
}
