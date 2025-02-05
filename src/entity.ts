import { HANDLE_PTR_TYPE } from './koffi/defs/handles';
import { RECT_TYPE } from './koffi/defs/structs/rect';
import { Sprite } from './sprite';
import { Tracker } from './tracker';

export class Entity {
  public loaded: boolean = false;

  public sprite: Sprite;

  public tracker: Tracker;

  constructor(
    private processHandle: HANDLE_PTR_TYPE,
    private gameObjectPtr: number,
    private rect: RECT_TYPE
  ) {
    this.init();
  }

  private init(): void {
    this.sprite = new Sprite(this.processHandle, this.gameObjectPtr);

    this.loaded = !this.sprite.invalid;
  }

  public createTracker(): void {
    this.tracker = new Tracker(this.sprite, this.rect);
  }

  public update(): void {
    this.sprite.basic();

    this.sprite.advanced();

    this.tracker.track();
  }

  public close(): void {
    this.tracker.close();
  }
}
