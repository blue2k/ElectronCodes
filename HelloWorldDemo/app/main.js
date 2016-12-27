// ./app/main.js

//采用javascript严格模式
'use strict';

// 应用的控制模块
const electron = require('electron');
const app = electron.app;

const path = require('path');
const { nativeImage } = require('electron');
const tray = electron.tray;

// 创建原生浏览器窗口的模块
const BrowserWindow = electron.BrowserWindow;
var mainWindow = null;
var aboutWindow = null;

//通讯模块
const ipcMain = electron.ipcMain;

//对话框模块
const dialog = electron.dialog;
var infoDialogOption = {
    type: "info",
    title: "信息",
    buttons: ["确定"],
    message: "",
    detail: ""
};
var questionDialogOption = {
    type: "question",
    title: "询问",
    buttons: ["确定", "取消"],
    message: "",
    detail: ""
};


//创建应用程序窗口
function createWindow() {   // 创建一个新的浏览器窗口
      
    mainWindow = new BrowserWindow({ width: 800, height: 600 });    // 并且装载应用的index.html页面
      
    mainWindow.loadURL(`file://${__dirname}/webpages/Views/login.html`);  
    //mainWindow.loadURL(`file://${__dirname}/webpages/demo.html`);   
    // 打开开发工具页面
    //win.webContents.openDevTools();

    // 当窗口关闭时调用的方法      
    mainWindow.on('closed', () => {   
        // 解除窗口对象的引用，通常而言如果应用支持多个窗口的话，你会在一个数组里
        // 存放窗口对象，在窗口关闭的时候应当删除相应的元素。    
        aboutWindow = null;    
        mainWindow = null; 
    });

    mainWindow.tray = createTray();
}

//通知栏图标菜单
function createTray() {
    let image = nativeImage.createFromPath(path.join(__dirname, '../assets/icon.png'));
    image.setTemplateImage(true);

    var trayIcon = new electron.Tray(image);
    trayIcon.setToolTip("通知栏菜单");
    var contextMenu = Menu.buildFromTemplate([{
            label: '退出',
            type: 'normal',
            click: function() {
                questionDialogOption.message = "确定退出程序吗？";
                var result = dialog.showMessageBox(questionDialogOption);
                if (result == '0') {
                    if (aboutWindow != null)
                        aboutWindow.close();
                    mainWindow.close();
                    console.log("退出程序");
                }
            }
        },
        { label: 'Item2', type: 'radio', checked: true },
        { label: 'Item3', type: 'radio' }
    ]);
    trayIcon.setContextMenu(contextMenu);

    trayIcon.on('click', () => {
        infoDialogOption.message = '显示主界面';
        dialog.showMessageBox(infoDialogOption);
    });
    return trayIcon;
}

// 当所有窗口都关闭的时候退出应用
app.on('window-all-closed', function() {
    // 对于OS X系统，应用和相应的菜单栏会一直激活直到用户通过Cmd + Q显式退出
    if (process.platform != 'darwin') {
        app.quit();
    }
});

app.on('activate', function() {  
    // 对于OS X系统，当dock图标被点击后会重新创建一个app窗口，并且不会有其他
    // 窗口打开      
    if (mainWindow === null) {     createWindow();   }
});

// 当 Electron 结束的时候，这个方法将会生效
// 初始化并准备创建浏览器窗口
app.on('ready', createWindow);

function CloseWindow() {
    questionDialogOption.message = "确定退出程序吗？";
    var result = dialog.showMessageBox(questionDialogOption);
    if (result == '0') {
        if (aboutWindow != null)
            aboutWindow.close();
        mainWindow.close();
        console.log("退出程序");
    }
};

const Menu = electron.Menu;
var template = [{
    label: '退出',
    click: function() {
        questionDialogOption.message = "确定退出程序吗？";
        var result = dialog.showMessageBox(questionDialogOption);
        if (result == '0') {
            if (aboutWindow != null)
                aboutWindow.close();
            mainWindow.close();
            console.log("退出程序");
        }
    },
    //submenu: {
    //     label: 'Undo',
    //     accelerator: 'CmdOrCtrl+Z',
    //     role: 'undo'
    //   }
    // ]
}];
var menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);


//监听Web Page里发出的Message
ipcMain.on('asynchronous-message', function(event, arg) {
    console.log('window async listener:' + arg); //prints ping
    infoDialogOption.message = 'ipcMain test';
    infoDialogOption.detail = 'window async listener:  ' + arg;
    dialog.showMessageBox(infoDialogOption);
    event.sender.send('asynchronous-reply', 'pong'); //在main process里向web page发出message

});
ipcMain.on('synchronous-message', function(event, arg) {
    Console.log("window synch listener:" + arg); // prints "ping"
    event.returnValue = 'pong';
});

//监听登录消息
ipcMain.on('login-command', function(event, arg) {
    console.log('Login:' + arg); //prints ping
    event.sender.send('login-reply-command', arg); //在main process里向web page发出message

});

//监听显示关于窗口消息
ipcMain.on('show-about-command', function(event, arg) {
    if (aboutWindow != null) {
        aboutWindow.show();
        return;
    }

    var aboutUrl = `file://${__dirname}/settings.html`;
    aboutWindow = new BrowserWindow({
        frame: false,
        height: 200,
        width: 500,
        resizable: false
    });    
    aboutWindow.on('resize', updateReply)
    aboutWindow.on('move', updateReply)
    aboutWindow.on('closed', () => {  aboutWindow = null; });
    aboutWindow.loadURL(aboutUrl);  
    aboutWindow.show();
});

function updateReply() {

};