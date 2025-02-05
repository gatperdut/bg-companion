import sourceMapSupport from 'source-map-support';
import { MemHandler } from './mem.handler';
import { TrackerHandler } from './tracker.handler';
import { WindowHandler } from './window.handler';

sourceMapSupport.install();

class Main {
  private memHandler: MemHandler;

  private windowHandler: WindowHandler;

  private trackerHandler: TrackerHandler;

  constructor() {
    this.init();
  }

  private init(): void {
    this.memHandler = new MemHandler();

    this.windowHandler = new WindowHandler();

    this.trackerHandler = new TrackerHandler();
  }

  public run(): void {
    setInterval(this.loop.bind(this), 500);
  }

  private loop(): void {
    this.memHandler.run();

    this.windowHandler.run(this.memHandler.pid);

    this.trackerHandler.run(
      this.memHandler.processHandle,
      this.memHandler.gameObjectPtrs,
      this.windowHandler.rect
    );

    this.memHandler.processSnapshotClose();
  }
}

new Main().run();
