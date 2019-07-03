// 在写业务逻辑之前  先规划好返回值

const  retCode = {
	SessionExpired: -1, // session 过期
	Fail: 0, // 失败
	Success: 1, // 成功
	ArgsError: 2, // 参数错误
	UserExisted: 10, // 用户已经存在
	UsernameOrPasswordError: 11, // 用户名或者密码错误
	UserNotExist: 12, // 用户不存在
}

module.exports = retCode
