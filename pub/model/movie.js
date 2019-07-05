const moment = require('moment')
const mysqlHelper = require('./../db/mysql-helper')

const reptile = {
	async search(args){
		if(!args.startDate){
			args.startDate = moment(0).format("YYYY-MM-DD HH:mm:ss")
			args.endDate = moment().format("YYYY-MM-DD HH:mm:ss")
		}
		let sql = `select SQL_CALC_FOUND_ROWS * from movie_data where name like "%${args.keyword}%" and type=? and release_date>=? and release_date<=? order by id asc limit ?,?;select FOUND_ROWS() as total;`;
		let params = [ args.type||'喜剧片', args.startDate, args.endDate, args.pageNumber*args.pageSize, parseInt(args.pageSize)]
		let result = await mysqlHelper.query(sql, params)
		// const sql3 = `select * from movie_type`


		return {
			list: result[0],
			total: result[1][0].total
		}
	},
	async type(args){
		let sql = 'select * from movie_type;' // 查总数
		let result = await mysqlHelper.query(sql, [])

		// 查分类总数
		let sql = "SELECT "
		for(let val of typeList){
			sql += `SUM(type='${val.type_name}') AS '${val.id}',`
		}
		sql = sql.substr(0,sql.length-1)
		sql += ' FROM movie_data;'


		return result
	}
}

module.exports = reptile