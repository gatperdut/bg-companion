/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck

import * as _ from 'lodash-es';
import sourceMapSupport from 'source-map-support';
import { GameSprite } from './game-sprite.class';
import { mem, MemResult } from './mem';
import { Tracker } from './tracker.class';
import { win } from './window.service';

sourceMapSupport.install();

const trackers: Record<number, Tracker> = {};

const main = (): void => {
  setInterval(loop, 500);
};

const loop = (): void => {
  const memResult: MemResult = mem();

  const winResult = win(memResult.pid);

  const rect = winResult.rect;

  const screen = winResult.screen;

  trackersClean(memResult.gameSprites);

  trackersUpsert(memResult.gameSprites, rect, screen);
};

const trackersUpsert = (gameSprites: GameSprite[], rect, screen): void => {
  _.each(gameSprites, (gameSprite: GameSprite): void => {
    if (trackers[gameSprite.id]) {
      trackers[gameSprite.id].gameSprite = gameSprite;
      trackers[gameSprite.id].rect = rect;
    } else {
      trackers[gameSprite.id] = new Tracker(gameSprite, rect, screen);
    }

    trackers[gameSprite.id].track();
  });
};

const trackersClean = (gameSprites: GameSprite[]): void => {
  const gameSpriteIds: number[] = gameSprites.map(
    (gameSprite: GameSprite): number => gameSprite.id
  );

  const remove: number[] = [];

  _.each(trackers, (tracker: Tracker): void => {
    if (!gameSpriteIds.includes(tracker.gameSprite.id)) {
      remove.push(tracker.gameSprite.id);
    }
  });

  remove.forEach((id: number): void => {
    trackers[id].close();

    delete trackers[id];
  });
};

main();
