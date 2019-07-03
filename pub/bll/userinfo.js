// 业务逻辑  登录、注册

const usermodel = require('./../model/userinfo')
const retCode = require('./../utils/retcode')

const userinfo = {
	// 注册
	async register(ctx){
		let form = ctx.request.body // 拿到请求主体
		// 入参
		const args = {
			username: form.username,
			password: form.password,
		}
		// 返回结果
		let result = {
			code: retCode.Success,
			data:null
		}
		// 验证是否为空
		if (!args.username || !args.password){
			result.code = retCode.ArgsError // 参数错误
			return result
		}
		// 根据用户名得到用户数量
		let  userNumResult = await usermodel.getCountByUserName(args)
		if(userNumResult[0].username > 0){ // 说明该账号已被注册咯
			result.code = retCode.UserExisted
			return result
		}
		// 插入注册表
		let userResult = await usermodel.add(args)
		if(userResult.insertId <= 0 ){ // 说明没有写入到数据库中
			result.code = retCode.Fail
			return result // 其实这个是多余的
		}
		return result
	},
	// 登录
	async login(ctx){
		let form = ctx.request.body // 拿到请求主体
		// 入参
		const args = {
			username: form.username,
			password: form.password,
		}
		// 验证是否为空
		if (!args.username || !args.password){
			result.code = retCode.ArgsError // 参数错误
			return result
		}
		// 根据用户名是否存在
		let  userResult = await usermodel.getByUserName(args)
		if(userNumResult.length == 0){ // 说明该账号未注册
			result.code = retCode.UserNotExist
			return result
		}
		// 用户名或者密码错误
		if(userResult[0].username != args.username || userResult[0].password != args.password){
			result.code = retCode.UsernameOrPasswordError
			return result
		}
		ctx.session = {id: userResult[0].id} // 将用户的id存在session中 保持一段时间登录
		return result
	}
}

module.exports = userinfo



