//登录页面处理模块
const electron = require('electron');
const ipcRenderer = require('electron').ipcRenderer;

//监听mian process里发出的message
ipcRenderer.on('Login-Reply-Command', (event, arg) => {
    alert("login success: " + arg);

});

function dologin(name, password) {
    alert("开始登录: " + user + "," + password);
    //在web page里向main process发出message
    ipcRenderer.send('login-command', name + '|' + password);

};