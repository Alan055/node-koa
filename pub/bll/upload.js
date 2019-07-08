// 业务逻辑  获取文件相关

const uploadModel = require('./../model/upload')
const retCode = require('./../utils/retcode').retCode

var fs = require('fs');
var join = require('path').join; // 文件拼接链接  根据环境自动选择是 / or \
const readline = require('readline');

const calc = require('../../run') // 计算函数

const reptile = {
	async saveFile(ctx){ // 保存文件
		// console.log(ctx.req.files);
		console.log(111,await calc())
		let result = {
			code: retCode.Success,
			data: 123
		}
		return result
	}
}




module.exports = reptile
