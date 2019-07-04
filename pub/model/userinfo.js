// 创建一些假数据

const mysqlHelper = require('./../db/mysql-helper')

const userinfo = {
	// 添加一条数据
	async add(args) {
		let sql = 'insert into userlist (username, password) values(?, ?)'
		let params = [args.username, args.password]
		let result = await mysqlHelper.query(sql, params)
		return result
	},
	// 根据用户名查找一条数据
	async getByUserName(args) {
		let sql = 'select id, username, password from userlist where username=?'
		let params = [args.username]
		let result = await mysqlHelper.query(sql, params)
		return result
	},
	// 根据username得到数量
	async getCountByUserName(arg){
		let sql = 'select count(1) as username from userlist where username=?'
		let params = [args.username]
		let result = await mysqlHelper.query(sql, params)
		return result
	}
}

module.exports = userinfo
