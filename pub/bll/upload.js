// 业务逻辑  获取文件相关

const uploadModel = require('./../model/upload')
const retCode = require('./../utils/retcode').retCode

const reptile = {
	async saveFile(ctx){ // 保存文件
		console.log( ctx.request.file)
		console.log(ctx.request.body)

		let form = ctx.request[ctx.method == 'GET' ? 'query' : 'body'] // 拿到请求主体
		// 返回结果
		let result = {
			code: retCode.Success,
			data: await uploadModel.saveFile(form)
		}
		return result
	}
}

module.exports = reptile