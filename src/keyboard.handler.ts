import { EntityHandler } from './entity.handler';
import { GetAsyncKeyState } from './koffi/defs/methods/keyboard';
import { WindowHandler } from './window.handler';

export class KeyboardHandler {
  constructor(
    private windowHandler: WindowHandler,
    private entityHandler: EntityHandler
  ) {
    this.init();
  }

  private init(): void {
    // Empty
  }

  public run(): void {
    if (!this.windowHandler.focused) {
      this.entityHandler.hideTrackers();

      return;
    }

    const state: number = GetAsyncKeyState(0xa0);

    if (state) {
      this.entityHandler.showTrackers();
    } else {
      this.entityHandler.hideTrackers();
    }
  }
}
