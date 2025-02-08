import { CursorShape, Direction, QBoxLayout, QPushButton, QWidget } from '@nodegui/nodegui';
import { Sprite } from 'src/sprite';
import { Tracker } from './tracker';

export class WidgetClosed {
  public widget: QWidget = new QWidget();

  private layout: QBoxLayout = new QBoxLayout(Direction.TopToBottom);

  private button: QPushButton = new QPushButton();

  constructor(
    private tracker: Tracker,
    private sprite: Sprite
  ) {
    this.layout.setContentsMargins(0, 0, 0, 0);
    this.widget.setObjectName('myroot');
    this.widget.setLayout(this.layout);

    // QIcon(path.join(__dirname, '../assets/logox200.png'));
    this.button.setAutoFillBackground(true);
    this.button.setFixedSize(10, 10);
    this.button.setContentsMargins(0, 0, 0, 0);
    this.button.setToolTip(this.sprite.name);
    this.button.setInlineStyle('background-color: red;');
    this.button.setCursor(CursorShape.PointingHandCursor);
    this.button.addEventListener('clicked', this.clickBnd);

    this.layout.addWidget(this.button);
  }

  public teardown(): void {
    this.button.removeEventListener('clicked', this.clickBnd);
  }

  private click = () => {
    this.tracker.closedClick();
  };

  private clickBnd = this.click.bind(this);
}
