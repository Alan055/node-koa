// 上传路由
const uploadbll = require('./../pub/bll/upload')
const getPost = require('./../pub/utils/common').getPost

async function fn(ctx, next) {
	let result = await uploadbll.saveFile(ctx)
	ctx.body = result
}

module.exports = {
	routerFn: getPost,
	fn: fn
}
