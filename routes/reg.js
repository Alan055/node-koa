// 注册路由
const router = require('koa-router')()
const userbll = require('./../pub/bll/userinfo')
const title = '注册'

router.prefix('/reg') // 这个是什么意思？？

router.get('/', async (ctx, next) => {
	await ctx.render('reg', {title})
})

router.post('/', async (ctx, next) => {
	let result = await userbll.register(ctx)
	ctx.body = result
})

module.exports = router
