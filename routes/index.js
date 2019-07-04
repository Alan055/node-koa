const Router = require('koa-router')
const router = new Router({prefix: '/api'})

require('./login')(router) // 导入登录路由

module.exports = router
