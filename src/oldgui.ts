// const win = new QMainWindow();
// win.setWindowFlag(WindowType.FramelessWindowHint, true);
// win.setWindowTitle("Hello World");

// const centralWidget = new QWidget();



// const rootLayout = new QBoxLayout(Direction.TopToBottom);
// centralWidget.setObjectName("myroot");
// centralWidget.setLayout(rootLayout);

// const label = new QLabel();
// label.setObjectName("mylabel");
// label.setText("Hello");

// const button = new QPushButton();
// button.addEventListener('clicked', () => {
//   console.log('the button was clicked');
// })
// button.setIcon(new QIcon(path.join(__dirname, '../assets/logox200.png')));

// const label2 = new QLabel();
// label2.setText("World");
// label2.setInlineStyle(`
//   color: red;
// `);

// rootLayout.addWidget(label);
// rootLayout.addWidget(button);
// rootLayout.addWidget(label2);
// win.setCentralWidget(centralWidget);
// win.setStyleSheet(
// `
//   #myroot {
//     background-color: #009688;
//     height: '100%';
//     align-items: 'center';
//     justify-content: 'center';
//   }
//   #mylabel {
//     font-size: 16px;
//     font-weight: bold;
//     padding: 1;
//   }
// `
// );

// win.show();