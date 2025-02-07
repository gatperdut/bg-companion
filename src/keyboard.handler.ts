import { EntitiesHandler } from './entities.handler';
import { VK_LSHIFT } from './koffi/defs/constants';
import { GetAsyncKeyState } from './koffi/defs/methods/keyboard';
import { WindowHandler } from './window.handler';

export class KeyboardHandler {
  constructor(
    private windowHandler: WindowHandler,
    private entitiesHandler: EntitiesHandler
  ) {
    // Empty
  }

  public run(): void {
    if (!this.windowHandler.focused) {
      // this.entitiesHandler.hideTrackers();

      return;
    }

    const state: number = GetAsyncKeyState(VK_LSHIFT);

    if (state) {
      this.entitiesHandler.toggleTrackers();
    }

    const ctrl = GetAsyncKeyState(0xa2);
    if (ctrl) {
      this.entitiesHandler.print();
    }
  }
}
