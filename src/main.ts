import { QMainWindow, QWidget, QLabel, QPushButton, QIcon, QBoxLayout, Direction, WindowType } from '@nodegui/nodegui';
import * as path from "node:path";
import sourceMapSupport from 'source-map-support';
import { mem, MemResult } from './mem';
import { GameSprite } from './game-sprite.class';
import { Tracker } from './tracker.class';

import  * as _ from 'lodash-es'
import { win } from './window.service';

sourceMapSupport.install();


const trackers: Record<number, Tracker> = {};

const main = (): void => {
  setInterval(loop, 500);
}

const loop = (): void => {
  const memResult: MemResult = mem();

  const rect = win(memResult.pid);


  trackersClean(memResult.gameSprites);

  trackersUpsert(memResult.gameSprites, rect);
};

const trackersUpsert = (gameSprites: GameSprite[], rect): void => {
  _.each(gameSprites, (gameSprite: GameSprite): void => {
    if (trackers[gameSprite.id]) {
      trackers[gameSprite.id].gameSprite = gameSprite;

      trackers[gameSprite.id].track();

      return;
    }

    trackers[gameSprite.id] = new Tracker(gameSprite, rect);
  })
}

const trackersClean = (gameSprites: GameSprite[]): void => {
  const gameSpriteIds: number[] = gameSprites.map((gameSprite: GameSprite): number => gameSprite.id);

  const remove: number[] = [];

  _.each(trackers, (tracker: Tracker): void => {
    if (!gameSpriteIds.includes(tracker.gameSprite.id)) {
      remove.push(tracker.gameSprite.id);
    }
  })

  remove.forEach(
    (id: number): void => {
      trackers[id].close();

      delete trackers[id];
    }
  )
}

main();
