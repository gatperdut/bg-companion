import { CursorShape, Direction, QAbstractButton, QBoxLayout, QIcon, QMainWindow, QPushButton, QRadioButton, QToolButton, QWidget, SizeConstraint, WindowType } from "@nodegui/nodegui";
import { GameSprite } from "./game-sprite.class";
import * as path from "node:path";

export class Tracker {
    private window: QMainWindow;

    private button: QPushButton;

    private click = () => {
        console.log('the button was clicked');
    };

    constructor(public gameSprite: GameSprite, private rect) {
        if (gameSprite.name !== 'Xan fan') {
            return;
        }

        this.init();
    }

    private init(): void {
        this.window = new QMainWindow();

        this.window.setWindowFlag(WindowType.FramelessWindowHint, true);
        this.window.setWindowFlag(WindowType.NoDropShadowWindowHint, true);
        this.window.setWindowFlag(WindowType.WindowStaysOnTopHint, true);
        this.window.setInlineStyle('max-width: 10px; max-height: 10px; background: transparent;')

        const centralWidget = new QWidget();
        centralWidget.setInlineStyle('max-width: 10px; max-height: 10px;')

        const rootLayout = new QBoxLayout(Direction.TopToBottom);
        rootLayout.setContentsMargins(0, 0, 0, 0);

        centralWidget.setObjectName("myroot");
        centralWidget.setLayout(rootLayout);

        // QIcon(path.join(__dirname, '../assets/logox200.png'));
        const button = new QPushButton();
        button.setAutoFillBackground(true);
        button.setFixedSize(10, 10);
        button.setContentsMargins(0, 0, 0, 0);
        button.setToolTip(this.gameSprite.name);
        button.setInlineStyle('background-color: red;')
        button.setCursor(CursorShape.PointingHandCursor);
        button.addEventListener('clicked', this.click);
        rootLayout.addWidget(button);

        this.window.setCentralWidget(centralWidget);

        this.track();
        
        this.window.show();
    }

    public track(): void {
        if (this.gameSprite.name !== 'Xan fan') {
            return;
        }

        const left = this.rect.left + (this.gameSprite.relativeX / this.gameSprite.viewportX) * (this.rect.right - this.rect.left);

        const top = this.rect.top + (this.gameSprite.relativeY / this.gameSprite.viewportY) * (this.rect.bottom - this.rect.top);

        this.window.move(left, top)
    }

    public close(): void {
        this.button.removeEventListener('clicked', this.click);

        this.window.close();
    }
}