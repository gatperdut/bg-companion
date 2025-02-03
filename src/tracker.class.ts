/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck

import {
  CursorShape,
  Direction,
  QBoxLayout,
  QMainWindow,
  QPushButton,
  QWidget,
  WindowType,
} from '@nodegui/nodegui';
import { GameSprite } from './game-sprite.class';

export class Tracker {
  private window: QMainWindow;

  private button: QPushButton;

  private click = () => {
    console.log(this.gameSprite);
  };

  constructor(
    public gameSprite: GameSprite,
    public rect,
    private screen
  ) {
    this.init();
  }

  private init(): void {
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
    this.button.setToolTip(this.gameSprite.name);
    this.button.setInlineStyle('background-color: red;');
    this.button.setCursor(CursorShape.PointingHandCursor);
    this.button.addEventListener('clicked', this.click);
    rootLayout.addWidget(this.button);

    this.window.setCentralWidget(centralWidget);

    this.track();
  }

  public track(): void {
    if (
      this.gameSprite.relativeX < 0 ||
      this.gameSprite.relativeX > this.gameSprite.viewportX ||
      this.gameSprite.relativeY < 0 ||
      this.gameSprite.relativeY > this.gameSprite.viewportY
    ) {
      if (!this.window.isHidden()) {
        this.window.hide();
      }

      return;
    }
    const rectWidth = this.rect.right - this.rect.left;
    const rectHeight = this.rect.bottom - this.rect.top;

    const left = Math.round(
      this.rect.left + (this.gameSprite.relativeX / this.gameSprite.viewportX) * rectWidth
    );
    const top = Math.round(
      this.rect.top + (this.gameSprite.relativeY / this.gameSprite.viewportY) * rectHeight
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
