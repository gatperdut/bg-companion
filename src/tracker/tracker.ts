import { QMainWindow, WindowType } from '@nodegui/nodegui';
import { SetForegroundWindow } from 'src/koffi/defs/methods/windows';
import { EntitiesHandler } from '../entities.handler';
import { RECT_TYPE } from '../koffi/defs/structs/rect';
import { Sprite } from '../sprite';
import { WindowHandler } from '../window.handler';
import { WidgetClosed } from './widget-closed';

export class Tracker {
  private window: QMainWindow;

  private widgetClosed: WidgetClosed;

  private isOpen: boolean = false;

  constructor(
    private entitiesHandler: EntitiesHandler,
    private windowHandler: WindowHandler,
    public sprite: Sprite,
    private rect: RECT_TYPE
  ) {
    // Empty
  }

  public init(): void {
    this.widgetClosed = new WidgetClosed(this, this.sprite);

    this.windowCreate();
  }

  public windowCreate(): void {
    this.window = new QMainWindow();

    this.window.setWindowFlag(WindowType.FramelessWindowHint, true);
    this.window.setWindowFlag(WindowType.NoDropShadowWindowHint, true);
    this.window.setWindowFlag(WindowType.WindowStaysOnTopHint, true);
    this.window.setWindowFlag(WindowType.Tool, true);

    this.window.setCentralWidget(this.widgetClosed.widget);

    this.updateCSS();
  }

  public track(): void {
    if (
      this.sprite.relativeX < 0 ||
      this.sprite.relativeX > this.sprite.viewportX ||
      this.sprite.relativeY < 0 ||
      this.sprite.relativeY > this.sprite.viewportY
    ) {
      if (!this.window.isHidden()) {
        this.window.hide();
      }

      return;
    }

    const rectWidth: number = this.rect.right - this.rect.left;

    const rectHeight: number = this.rect.bottom - this.rect.top;

    const left = Math.round(
      this.rect.left + (this.sprite.relativeX / this.sprite.viewportX) * rectWidth
    );
    const top = Math.round(
      this.rect.top + (this.sprite.relativeY / this.sprite.viewportY) * rectHeight
    );

    this.window.move(left, top);

    if (this.window.isHidden() && this.entitiesHandler.trackersShown) {
      this.window.show();
    }
  }

  public teardown(): void {
    this.widgetClosed.teardown();

    this.window.delete();
  }

  public hide(): void {
    this.window.hide();
  }

  public show(): void {
    this.window.show();
  }

  private open(): void {
    console.log('open');
    this.isOpen = true;

    this.updateCSS();
  }

  private close(): void {
    console.log('close');
    this.isOpen = false;

    this.updateCSS();
  }

  public closedClick(): void {
    SetForegroundWindow(this.windowHandler.windowHandle);

    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }

    console.log(JSON.stringify(this.sprite));
  }

  private updateCSS(): void {
    // this.window.setInlineStyle(
    //   `
    //     ${this.isOpen ? '' : 'max-width: 10px; max-height: 10px;'}
    //     background: transparent;
    //   `
    // );
    // this.centralWidget.setInlineStyle(
    //   `
    //     ${this.isOpen ? '' : 'max-width: 10px; max-height: 10px;'}
    //   `
    // );
  }
}
