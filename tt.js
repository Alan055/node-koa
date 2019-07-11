
var fs = require('fs');
var join = require('path').join; // 文件拼接链接  根据环境自动选择是 / or \
const readline = require('readline');
let unzip = require('unzip')

let path = join('upload', '111.zip')
// let zip = fs.createReadStream(path)
// zip.pipe(unzip.Extract({path: join(__dirname,'test')})) // 解压到指定目录下


fs.createReadStream('upload/归档.zip').pipe(unzip.Extract({ path: 'test' }));


var JSZip = require("jszip");
var fs = require("fs");

var zip = new JSZip();

var file_content = fs.readFileSync('archive/a.txt');


zip.file("a.txt",file_content);

var data = fs.readFileSync("archive/img/pic.jpeg");
zip.file("img/pic.jpeg", data, {base64: true});

var zipfolder = zip.generate({type:"nodebuffer"});

fs.writeFile("jszip.zip", zipfolder, function(err) {
	if (err) throw err;
});
