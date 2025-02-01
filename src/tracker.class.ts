import { Direction, QBoxLayout, QIcon, QMainWindow, QPushButton, QWidget, WindowType } from "@nodegui/nodegui";
import { GameSprite } from "./game-sprite.class";
import * as path from "node:path";

export class Tracker {
    private window: QMainWindow;

    constructor(public gameSprite: GameSprite) {
        this.init();
    }

    private init(): void {
        this.window = new QMainWindow();

        this.window.setWindowFlag(WindowType.FramelessWindowHint, true);

        const centralWidget = new QWidget();

        const rootLayout = new QBoxLayout(Direction.TopToBottom);

        centralWidget.setObjectName("myroot");
        centralWidget.setLayout(rootLayout);

        const button = new QPushButton();
        button.setIcon(new QIcon(path.join(__dirname, '../assets/logox200.png')));
        button.addEventListener('clicked', () => {
            console.log('the button was clicked');
        })

        rootLayout.addWidget(button);
        this.window.setCentralWidget(centralWidget);
        this.window.setStyleSheet(
        `
            #myroot {
                background-color: #009688;
                height: '100%';
                align-items: 'center';
                justify-content: 'center';
            }
        `
        );
    }

    public close(): void {
        this.window.close();
    }
}