// 登录路由
const router = require('koa-router')()
const userbll = require('./../pub/bll/userinfo')
const title = '首页'

router.get('/', async (ctx, next) => {
	//判断登录
	if(!ctx.session || !ctx.session.id){
		await ctx.redirect('/login') // 重定向到登录页
	}else{
		const id = ctx.session.id;
		await ctx.render('index', { title, id }) // 刷新用户的id缓存
	}
})

module.exports = router
