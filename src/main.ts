import sourceMapSupport from 'source-map-support';
import { EntityHandler } from './entity.handler';
import { KeyboardHandler } from './keyboard.handler';
import { GetCurrentProcess, SetPriorityClass } from './koffi/defs/methods/system';
import { MemHandler } from './mem.handler';
import { WindowHandler } from './window.handler';

sourceMapSupport.install();

class Main {
  private memHandler: MemHandler;

  private windowHandler: WindowHandler;

  private entityHandler: EntityHandler;

  private keyboardHandler: KeyboardHandler;

  constructor() {
    this.init();
  }

  private init(): void {
    this.priority();

    this.memHandler = new MemHandler();

    this.windowHandler = new WindowHandler();

    this.entityHandler = new EntityHandler();

    this.keyboardHandler = new KeyboardHandler(this.entityHandler);
  }

  public run(): void {
    setInterval(this.loop.bind(this), 300);
  }

  private priority(): void {
    const handle = GetCurrentProcess();

    SetPriorityClass(handle, 0x00004000);
  }

  private loop(): void {
    this.memHandler.run();

    this.windowHandler.run(this.memHandler.pid);

    this.entityHandler.run(
      this.memHandler.processHandle,
      this.memHandler.gameObjectPtrs,
      this.windowHandler.rect
    );

    this.memHandler.processSnapshotClose();
  }
}

new Main().run();
