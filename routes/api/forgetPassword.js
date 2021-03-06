// 登录路由
const userbll = require('../../pub/bll/userinfo')
const getPost = require('../../pub/utils/common').getPost

async function fn(ctx, next) {
	let result = await userbll.forgetPassword(ctx)
	ctx.body = result
}

module.exports = {
	routerFn: getPost,
	fn: fn
}
