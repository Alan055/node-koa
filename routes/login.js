// 登录路由
const userbll = require('./../pub/bll/userinfo')

async function fn(ctx, next) {
	let result = await userbll.login(ctx)
	ctx.body = result
}

function init(router) {
	router.get('/login',fn)
	router.post('/login',fn)
}


module.exports = init
