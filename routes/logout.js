const router = require('koa-router')()
const userbll = require('./../pub/bll/userinfo')
const retCode = require('./../pub/utils/retcode')

router.prefix('/logout')

router.get('/', async (ctx, next)=>{
	await ctx.render('logout', {})
})

router.post('/', async (ctx, next) => {

	ctx.session = null;

	let result = {
		code: retCode.Success,
		data: null
	}
	ctx.body = result;
})

module.exports = router
