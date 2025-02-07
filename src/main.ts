import sourceMapSupport from 'source-map-support';
import { EntityHandler } from './entity.handler';
import { KeyboardHandler } from './keyboard.handler';
import { MemHandler } from './mem.handler';
import { WindowHandler } from './window.handler';

sourceMapSupport.install();

class Main {
  private memHandler: MemHandler;

  private windowHandler: WindowHandler;

  private entityHandler: EntityHandler;

  private keyboardHandler: KeyboardHandler;

  constructor() {
    this.memHandler = new MemHandler();

    this.windowHandler = new WindowHandler();

    this.entityHandler = new EntityHandler();

    this.keyboardHandler = new KeyboardHandler(this.windowHandler, this.entityHandler);
  }

  public run(): void {
    setInterval(this.loop.bind(this), 300);
  }

  private loop(): void {
    if (!this.memHandler.pid) {
      this.memHandler.init();
    }

    this.memHandler.run();

    if (!this.memHandler.pid) {
      this.windowHandler.teardown();

      return;
    }

    this.windowHandler.init(this.memHandler.pid);

    this.windowHandler.run();

    this.entityHandler.run(
      this.memHandler.processHandle,
      this.memHandler.gameObjectPtrs,
      this.windowHandler.rect
    );

    this.keyboardHandler.run();

    this.memHandler.destructor();
  }
}

new Main().run();
