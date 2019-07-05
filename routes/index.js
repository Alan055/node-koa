const Router = require('koa-router')
const router = new Router({prefix: '/api'}) //路由前缀

// 这里千万注意  写路由的时候  路径和接口的名字要相同 路由文件路径是/login 路由的path也应该是/login
// 如果一定不相同 那就写成对象数组的形式
const routerList = [
	'./login', // 登录路由
	'./register', // 注册路由
	'./logout',  // 注销路由
	'./reptile',  // 爬虫路由
	'./movie',  // 爬虫路由
	'./movieType',  // 爬虫路由
]

for (let path of routerList) {
	let obj = require(path)
	obj.routerFn(router, path.substr(1), obj.fn) // 注册路由  注册路由时要去掉path前面的一个点
}

// console.log(router) // 查看注册的路由

module.exports = router
