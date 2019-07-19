// helloworld路由
// const bill = require('../../pub/bll/community')
const http = require('../../pub/utils/common').getOnly


async function fn(ctx, next) {
	console.log("进来了")
	await ctx.render('index', { title: '中间件', id: 1 })

}

module.exports = {
	routerFn: http,
	fn: fn
}