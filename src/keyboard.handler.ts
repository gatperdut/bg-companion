import { EntityHandler } from './entity.handler';
import { GetAsyncKeyState } from './koffi/defs/methods/keyboard';
import { WindowHandler } from './window.handler';

export class KeyboardHandler {
  private trackersShown: boolean;

  constructor(
    private windowHandler: WindowHandler,
    private entityHandler: EntityHandler
  ) {
    this.init();
  }

  private init(): void {
    this.trackersShown = false;
  }

  public run(): void {
    if (!this.windowHandler.focused) {
      this.entityHandler.hideTrackers();

      this.trackersShown = false;

      return;
    }

    const state: number = GetAsyncKeyState(0xa0);

    if (state) {
      if (!this.trackersShown) {
        this.entityHandler.showTrackers();
      }

      this.trackersShown = true;
    } else {
      if (this.trackersShown) {
        this.entityHandler.hideTrackers();
      }

      this.trackersShown = false;
    }
  }
}
