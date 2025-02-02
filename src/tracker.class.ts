import { Direction, QBoxLayout, QIcon, QMainWindow, QPushButton, QWidget, SizeConstraint, WindowType } from "@nodegui/nodegui";
import { GameSprite } from "./game-sprite.class";
import * as path from "node:path";

export class Tracker {
    private window: QMainWindow;

    constructor(public gameSprite: GameSprite, private rect) {
        if (gameSprite.name !== 'Xan fan') {
            return;
        }

        this.init();
    }

    private init(): void {
        this.window = new QMainWindow();

        this.window.setWindowFlag(WindowType.FramelessWindowHint, true);
        this.window.setWindowFlag(WindowType.WindowStaysOnTopHint, true);
        this.window.setInlineStyle('max-width: 10px; max-height: 10px; background-color: red;')

        const centralWidget = new QWidget();
        centralWidget.setInlineStyle('max-width: 10px; max-height: 10px;')

        const rootLayout = new QBoxLayout(Direction.TopToBottom);

        centralWidget.setObjectName("myroot");
        centralWidget.setLayout(rootLayout);

        const button = new QPushButton();
        button.setInlineStyle('max-width: 10px; max-height: 10px;');
        button.addEventListener('clicked', () => {
            console.log('the button was clicked');
        })

        rootLayout.addWidget(button);
        this.window.setCentralWidget(centralWidget);
        this.window.move(this.rect.left, this.rect.top)
        // this.window.setStyleSheet(
        // `
        //     #myroot {
        //         max-height: 20px;
        //         max-width: 20px;
        //         background-color: #009688;
        //     }
        // `
        // );

        this.window.show();
    }

    public close(): void {
        this.window.close();
    }
}