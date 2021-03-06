//Web页面通讯处理模块
const electron = require('electron');
const ipcRenderer = electron.ipcRenderer;

//监听mian process里发出的message
ipcRenderer.on('asynchronous-reply', (event, arg) => {
    // alert("web2" + arg);// prints "pong"  在electron中web page里的console方法不起作用，因此使用alert作为测试方法
    alert("Web Page received message: " + arg);
    infoDialogOption.message = 'ipcMain test';
    infoDialogOption.detail = "Web Page received message: " + arg;
    dialog.showMessageBox(infoDialogOption);
});

function say_hello() {
    //在web page里向main process发出message
    ipcRenderer.send('asynchronous-message', 'Hi world!'); // prints "pong"   
    // ipcRenderer.sendSync('synchronous-message', 'ping') // prints "pong"   
    // alert("web1" + 'ping');
};

function sayhello1(tmp) {
    alert(tmp);
    //在web page里向main process发出message
    ipcRenderer.send('asynchronous-message', 'Hi world!'); // prints "pong"   
    // ipcRenderer.sendSync('synchronous-message', 'ping') // prints "pong"   
    // alert("web1" + 'ping');
};