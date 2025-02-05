import _ from 'lodash';
import { HANDLE_PTR_TYPE } from './koffi/defs/handles';
import { Tracker } from './tracker';
import { Rect } from './window.handler';

export class TrackerHandler {
  private trackers: Record<number, Tracker>;

  constructor() {
    this.init();
  }

  private init(): void {
    this.trackers = {};
  }

  public run(processHandle: HANDLE_PTR_TYPE, gameObjectPtrs: number[], rect: Rect): void {
    const trackers: Tracker[] = _.filter(
      _.map(
        gameObjectPtrs,
        (gameObjectPtr: number): Tracker => new Tracker(processHandle, gameObjectPtr, rect)
      ),
      (tracker: Tracker): boolean => tracker.loaded
    );

    this.trackersClean(trackers);

    this.trackersUpsert(trackers);

    _.each(_.values(this.trackers), (tracker: Tracker): void => {
      tracker.advanced();

      tracker.track();
    });
  }

  private trackersClean(trackers: Tracker[]): void {
    const spriteIds: number[] = _.map(trackers, (tracker: Tracker): number => tracker.sprite.id);

    const remove: number[] = [];

    _.each(_.values(this.trackers), (tracker: Tracker): void => {
      if (!spriteIds.includes(tracker.sprite.id)) {
        remove.push(tracker.sprite.id);
      }
    });

    remove.forEach((id: number): void => {
      this.trackers[id].close();

      delete this.trackers[id];
    });
  }

  private trackersUpsert(trackers: Tracker[]): void {
    _.each(trackers, (tracker: Tracker): void => {
      if (this.trackers[tracker.sprite.id]) {
        this.trackers[tracker.sprite.id].sprite = tracker.sprite;
      } else {
        this.trackers[tracker.sprite.id] = tracker;

        tracker.createWindow();
      }
    });
  }
}
