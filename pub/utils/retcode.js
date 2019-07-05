// 在写业务逻辑之前  先规划好返回值

const  retCode = {
	SessionExpired: -1, // session 过期
	Fail: 1, // 失败
	Success: 200, // 成功
	ArgsError: 2, // 参数错误
	UserExisted: 10, // 用户已经存在
	UsernameOrPasswordError: 11, // 用户名或者密码错误
	UserNotExist: 12, // 用户不存在
}
const message = { // 映射的msg中文意思
	[retCode.SessionExpired]: '登录信息已过期，请重新登录',
	[retCode.Fail]: '数据库写入失败',
	[retCode.Success]: '请求成功',
	[retCode.ArgsError]: '参数错误',
	[retCode.UserExisted]: '用户已存在',
	[retCode.UsernameOrPasswordError]: '用户名或密码错误',
	[retCode.UserNotExist]: '用户不存在',

}

module.exports = {retCode, message}
