// ./app/main.js

//采用javascript严格模式
'use strict';

// 应用的控制模块
const electron = require('electron');
const app = electron.app;

// 创建原生浏览器窗口的模块
const BrowserWindow = electron.BrowserWindow;
var mainWindow = null;

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
      
    mainWindow.loadURL(`file://${__dirname}/index.html`);   
    // 打开开发工具页面
    //win.webContents.openDevTools();

    // 当窗口关闭时调用的方法      
    mainWindow.on('closed', () => {    
        // 解除窗口对象的引用，通常而言如果应用支持多个窗口的话，你会在一个数组里
        // 存放窗口对象，在窗口关闭的时候应当删除相应的元素。            
        mainWindow = null;  
    });
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

const Menu = electron.Menu;
var template = [{
    label: '关闭',
    click: function() {
        questionDialogOption.message = "确定退出程序吗？";
        var result = dialog.showMessageBox(questionDialogOption);
        if (result == '0') {
            mainWindow.close();
            console.log("关闭");
        }
    },
    // submenu: [
    //   {
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
    event.sender.send('asynchronous reply', 'pong'); //在main process里向web page发出message

});
ipcMain.on('synchronous-message', function(event, arg) {
    Console.log("window synch listener:" + arg); // prints "ping"
    event.returnValue = 'pong';
});