import _ from 'lodash';
import { Entity } from './entity';
import { HANDLE_PTR_TYPE } from './koffi/defs/handles';
import { RECT_TYPE } from './koffi/defs/structs/rect';

export class EntityHandler {
  private entities: Record<number, Entity> = {};

  private trackersShown: boolean = false;

  constructor() {
    // Empty
  }

  public run(processHandle: HANDLE_PTR_TYPE, gameObjectPtrs: number[], rect: RECT_TYPE): void {
    const entities: Entity[] = _.filter(
      _.map(
        gameObjectPtrs,
        (gameObjectPtr: number): Entity => new Entity(processHandle, gameObjectPtr, rect)
      ),
      (entity: Entity): boolean => entity.loaded
    );

    this.entitiesRemove(entities);

    this.entitiesInsert(entities);

    _.each(_.values(this.entities), (entity: Entity): void => {
      entity.update();
    });
  }

  private entitiesRemove(entities: Entity[]): void {
    const spriteIds: number[] = _.map(entities, (entity: Entity): number => entity.sprite.id);

    const remove: number[] = [];

    _.each(_.values(this.entities), (entity: Entity): void => {
      if (!spriteIds.includes(entity.sprite.id)) {
        remove.push(entity.sprite.id);
      }
    });

    _.each(remove, (id: number): void => {
      if (this.entities[id]) {
        this.entities[id].teardown();

        delete this.entities[id];
      }
    });
  }

  private entitiesInsert(entities: Entity[]): void {
    _.each(entities, (entity: Entity): void => {
      if (!this.entities[entity.sprite.id]) {
        this.entities[entity.sprite.id] = entity;

        entity.createTracker(this.trackersShown);
      }
    });
  }

  public hideTrackers(): void {
    if (this.trackersShown) {
      console.log('HIDE');
      _.each(_.values(this.entities), (entity: Entity): void => {
        entity.hideTracker();
      });

      this.trackersShown = false;
    }
  }

  public showTrackers(): void {
    if (!this.trackersShown) {
      console.log('SHOW');
      _.each(_.values(this.entities), (entity: Entity): void => {
        entity.showTracker();
      });

      this.trackersShown = true;
    }
  }

  public teardown(): void {
    _.each(_.values(this.entities), (entity: Entity): void => {
      entity.teardown();
    });

    this.entities = {};
  }
}
