//win本地文件操作模块

//打开系统本地文件或者网页链接
//这个使用的是electron里shell模块的方法，只能打开和删除，不能通过代码更改文件内容，具体请看shell的api http://electron.atom.io/docs/api/shell/
const { shell } = require('electron');

// Open a local file in the default app
function OpenFile() {
    var path1 = __dirname + "\docs\Electron项目打包.txt";
    shell.openItem(path1);
}

// Open a URL in the default way
function OpenUrl() {
    shell.openExternal('https://github.com');
}



//本地文件写入
function writeLogFile() {
    var path = require('path');
    var _path = path.join(__dirname, '..', '\\docs\\log.txt');
    console.log(_path); //测试路径对不对的
    var fs = require('fs');
    fs.readFile(_path, 'utf8', function(err, data) {
        if (err) return console.log(err);
    });

    fs.writeFile(_path, "electron + Javascript", function(err) {
        if (!err)
            console.log("写入成功！")
    });
}