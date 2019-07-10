// 业务逻辑  获取文件相关

const uploadModel = require('./../model/upload')
const retCode = require('./../utils/retcode').retCode

var fs = require('fs');
var join = require('path').join; // 文件拼接链接  根据环境自动选择是 / or \
const readline = require('readline');
// let JSZIP = require('jszip')
// let zip = new JSZIP()
let unzip = require('unzip')
const calc = require('../../run') // 计算函数

const reptile = {
	async saveFile(ctx){ // 保存文件
		let file = ctx.req.files.file // 文件传过来会先保存在内存中  需要先去找到位置
		let fileRAM = fs.createReadStream(file.path) // 拿到内存中的文件
		let path = join('upload',file.name)
		let writeStream = fs.createWriteStream(path) // 创建一个二进制文件 此时里面是没有数据的
		console.log("123")
		fileRAM.pipe(writeStream) // 使用pipe通道将二进流转移到指定文件中

		fs.createReadStream(path).pipe(unzip.Extract({ path: join('app_calc') }))


		// let targetName = join('', 'upload',file.name)
		// console.log(111,await calc())
		let result = {
			code: retCode.Success,
			data: file
		}
		return result
	}
}




module.exports = reptile
