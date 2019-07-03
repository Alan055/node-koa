// 登录路由
const router = require('koa-router')()
const userbll = require('./../pub/bll/userinfo')
const title = '登录'

router.prefix('/login') // 这个是什么意思？？

router.get('/', async (ctx, next) => {
	await ctx.render('login', {title})
})

router.post('/', async (ctx, next) => {
	let result = await userbll.login(ctx)
	ctx.body = result
})

module.exports = router
