import {
  CursorShape,
  Direction,
  QBoxLayout,
  QMainWindow,
  QPushButton,
  QWidget,
  WindowType,
} from '@nodegui/nodegui';
import { GameSprite as Sprite } from './game-sprite.class';
import { HANDLE_PTR_TYPE } from './koffi/defs/handles';
import { Rect } from './window.handler';

export class Tracker {
  public loaded: boolean = false;

  public sprite: Sprite;

  private window: QMainWindow;

  private button: QPushButton;

  constructor(
    private processHandle: HANDLE_PTR_TYPE,
    private gameObjectPtr: number,
    private rect: Rect
  ) {
    this.init();
  }

  private init(): void {
    this.sprite = new Sprite(this.processHandle, this.gameObjectPtr);

    this.loaded = !this.spriteInvalid;
  }

  private get spriteInvalid(): boolean {
    return (
      this.sprite.type !== 0x31 ||
      !this.sprite.hp ||
      !this.sprite.gameAreaPtr ||
      this.sprite.x < 0 ||
      this.sprite.y < 0 ||
      !this.sprite.name ||
      !this.sprite.resref ||
      !this.sprite.canBeSeen
    );
  }

  public advanced(): void {
    this.sprite.advanced();
  }

  private click = () => {
    console.log(this.sprite);
  };

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
    this.button.addEventListener('clicked', this.click);
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
    const rectWidth = this.rect.right - this.rect.left;
    const rectHeight = this.rect.bottom - this.rect.top;

    const left = Math.round(
      this.rect.left + (this.sprite.relativeX / this.sprite.viewportX) * rectWidth
    );
    const top = Math.round(
      this.rect.top + (this.sprite.relativeY / this.sprite.viewportY) * rectHeight
    );

    if (this.window.isHidden()) {
      this.window.show();
    }

    this.window.move(left, top);
  }

  public close(): void {
    this.button.removeEventListener('clicked', this.click);

    this.window.close();
  }
}
