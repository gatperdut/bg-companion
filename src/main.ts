import * as _ from 'lodash-es';
import sourceMapSupport from 'source-map-support';
import { GameSprite } from './game-sprite.class';
import { MemHandler } from './mem.handler';
import { Tracker } from './tracker.class';
import { WindowHandler } from './window.handler';

sourceMapSupport.install();

class Main {
  private memHandler: MemHandler;

  private windowHandler: WindowHandler;

  private trackers: Record<number, Tracker> = {};

  constructor() {
    this.init();
  }

  private init(): void {
    this.memHandler = new MemHandler();

    this.windowHandler = new WindowHandler();
  }

  public run(): void {
    setInterval(this.loop.bind(this), 500);
  }

  private loop(): void {
    this.memHandler.update();

    this.windowHandler.update(this.memHandler.pid);

    this.trackersClean();

    this.trackersUpsert();
  }

  private trackersUpsert(): void {
    _.each(this.memHandler.gameSprites, (gameSprite: GameSprite): void => {
      if (this.trackers[gameSprite.id]) {
        this.trackers[gameSprite.id].gameSprite = gameSprite;
        this.trackers[gameSprite.id].rect = this.windowHandler.rect;
      } else {
        this.trackers[gameSprite.id] = new Tracker(
          gameSprite,
          this.windowHandler.rect,
          this.windowHandler.screen
        );
      }

      this.trackers[gameSprite.id].track();
    });
  }

  private trackersClean(): void {
    const gameSpriteIds: number[] = this.memHandler.gameSprites.map(
      (gameSprite: GameSprite): number => gameSprite.id
    );

    const remove: number[] = [];

    _.each(this.trackers, (tracker: Tracker): void => {
      if (!gameSpriteIds.includes(tracker.gameSprite.id)) {
        remove.push(tracker.gameSprite.id);
      }
    });

    remove.forEach((id: number): void => {
      this.trackers[id].close();

      delete this.trackers[id];
    });
  }
}

new Main().run();
