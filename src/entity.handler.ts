import _ from 'lodash';
import { Entity } from './entity';
import { HANDLE_PTR_TYPE } from './koffi/defs/handles';
import { Rect } from './window.handler';

export class EntityHandler {
  private entities: Record<number, Entity>;

  constructor() {
    this.init();
  }

  private init(): void {
    this.entities = {};
  }

  public run(processHandle: HANDLE_PTR_TYPE, gameObjectPtrs: number[], rect: Rect): void {
    const entities: Entity[] = _.filter(
      _.map(
        gameObjectPtrs,
        (gameObjectPtr: number): Entity => new Entity(processHandle, gameObjectPtr, rect)
      ),
      (entity: Entity): boolean => entity.loaded
    );

    this.entitiesClean(entities);

    this.entitiesUpsert(entities);

    _.each(_.values(this.entities), (entity: Entity): void => {
      entity.advanced();

      entity.track();
    });
  }

  private entitiesClean(entities: Entity[]): void {
    const spriteIds: number[] = _.map(entities, (entity: Entity): number => entity.sprite.id);

    const remove: number[] = [];

    _.each(_.values(this.entities), (entity: Entity): void => {
      if (!spriteIds.includes(entity.sprite.id)) {
        remove.push(entity.sprite.id);
      }
    });

    remove.forEach((id: number): void => {
      this.entities[id].close();

      delete this.entities[id];
    });
  }

  private entitiesUpsert(entities: Entity[]): void {
    _.each(entities, (entity: Entity): void => {
      if (this.entities[entity.sprite.id]) {
        this.entities[entity.sprite.id].sprite = entity.sprite;
      } else {
        this.entities[entity.sprite.id] = entity;

        entity.createWindow();
      }
    });
  }
}
