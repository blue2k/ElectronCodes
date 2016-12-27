//登录页面处理模块
const electron = require('electron');
const ipcRenderer = electron.ipcRenderer;

//监听mian process里发出的message
ipcRenderer.on('login-reply-command', (event, arg) => {
    alert("login success: " + arg);

});

function doLogin(sname, spassword) {
    var cmd = sname.toString() + '|' + spassword.toString();
    //在web page里向main process发出message
    ipcRenderer.send('login-command', cmd);

};

function showAboutWindow() {  
    ipcRenderer.send('show-about-command', "");
    /*
    var aboutUrl = `file://${__dirname}/settings.html`;
    //alert(aboutUrl);
    let aboutWindow = new electron.remote.BrowserWindow({
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
    */
};

function updateReply() {

};

function showRegisterWindow() {

};