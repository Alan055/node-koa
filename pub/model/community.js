const moment = require('moment')
const mysqlHelper = require('./../db/mysql-helper')

const objFn = {
	// 在社区总表中添加一条数据
	async addCommunity(args) {
		let sql = `insert into community_wall (username,title,type,img_url,create_time) values (?,?,?,?,?)`
		let params = [args.username, args.title, args.type, args.imgUrl, args.createTime]
		let result = await mysqlHelper.query(sql, params)
		return result
	},
	// 在心情墙上添加一条数据
	async addMoodList(args) {
		let sql = `insert into mood_list (username,title,img_url,create_time) values (?,?,?,?)`
		let params = [args.username, args.title, args.imgUrl, args.createTime]
		let result = await mysqlHelper.query(sql, params)
		return result
	},
	// 在问答墙上添加一条数据
	async addQaList(args) {
		let sql = ``
		let params = []
		let result = await mysqlHelper.query(sql, params)
		return result
	},
	// 在分享技术墙上添加一条数据
	async addshareList(args) {
		let sql = ``
		let params = []
		let result = await mysqlHelper.query(sql, params)
		return result
	},
	// 在评论表中添加一条数据
	async addCommentList(args) {
		let sql = ``
		let params = []
		let result = await mysqlHelper.query(sql, params)
		return result
	},
}

module.exports = objFn