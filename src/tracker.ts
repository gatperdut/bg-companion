import {
  CursorShape,
  Direction,
  QBoxLayout,
  QMainWindow,
  QPushButton,
  QWidget,
  WindowType,
} from '@nodegui/nodegui';
import { EntitiesHandler } from './entities.handler';
import { SetForegroundWindow } from './koffi/defs/methods/windows';
import { RECT_TYPE } from './koffi/defs/structs/rect';
import { Sprite } from './sprite';
import { WindowHandler } from './window.handler';

export class Tracker {
  private window: QMainWindow;

  private button: QPushButton;

  constructor(
    private entitiesHandler: EntitiesHandler,
    private windowHandler: WindowHandler,
    public sprite: Sprite,
    private rect: RECT_TYPE
  ) {
    this.createWindow();
  }

  public createWindow(): void {
    this.window = new QMainWindow();

    this.window.setWindowFlag(WindowType.FramelessWindowHint, true);
    this.window.setWindowFlag(WindowType.NoDropShadowWindowHint, true);
    this.window.setWindowFlag(WindowType.WindowStaysOnTopHint, true);
    this.window.setWindowFlag(WindowType.Tool, true);
    this.window.setInlineStyle('max-width: 10px; max-height: 10px; background: transparent;');

    const centralWidget = new QWidget();
    centralWidget.setInlineStyle('max-width: 10px; max-height: 10px;');

    const rootLayout = new QBoxLayout(Direction.TopToBottom);
    rootLayout.setContentsMargins(0, 0, 0, 0);

    centralWidget.setObjectName('myroot');
    centralWidget.setLayout(rootLayout);

    // QIcon(path.join(__dirname, '../assets/logox200.png'));
    this.button = new QPushButton();
    this.button.setAutoFillBackground(true);
    this.button.setFixedSize(10, 10);
    this.button.setContentsMargins(0, 0, 0, 0);
    this.button.setToolTip(this.sprite.name);
    this.button.setInlineStyle('background-color: red;');
    this.button.setCursor(CursorShape.PointingHandCursor);
    this.button.addEventListener('clicked', this.clickBnd);
    rootLayout.addWidget(this.button);

    this.window.setCentralWidget(centralWidget);
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
    this.button.removeEventListener('clicked', this.clickBnd);

    this.window.delete();
  }

  public hide(): void {
    this.window.hide();
  }

  public show(): void {
    this.window.show();
  }

  private click = () => {
    SetForegroundWindow(this.windowHandler.windowHandle);

    console.log(JSON.stringify(this.sprite));
  };

  private clickBnd = this.click.bind(this);
}
