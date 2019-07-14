var Koa = require('koa')
  , logger = require('koa-logger')
  , json = require('koa-json')
  , views = require('koa-views')
  , onerror = require('koa-onerror')
  , koaBody = require('koa-body');
let app = new Koa()

const config = require('./config/config') // 链接配置

// error handler
onerror(app);


// global middlewares 全局中间件
app.use(require('koa-bodyparser')({enableType: ['json', 'form', 'text']}));
// app.use(koaBody({
// 	multipart: true,
// 	formidable: {
// 		maxFileSize: 500*1024*1024 // 设置上传文件大小最大限制，默认2M
// 	}
// }));
app.use(json());
app.use(logger());
app.use(require('koa-static')(__dirname + '/public'))


const message = require('./pub/utils/retcode').message
// 这个是拦截器
app.use(async (ctx, next)=>{ // next()之前  是拿到接口响应之后  还没开始操作
  const start = new Date;
  await next() 	// next()之后  是通过路由操作结束之后  可以拿到即将返回的数据
	ctx.body.msg = message[ctx.body.code] // 增加msg 中文消息提示
	console.log('%s %s 处理时间：%s'+'ms', ctx.method, ctx.url,  new Date - start); // 这里是检测每次接口处理所需要花费的时间
});

// 设置session缓存
const session = require('koa-session') // 缓存
const RedisStore = require('koa2-session-redis') // 一个redis的仓库
app.keys = ['Porschev'];
const redis_conf = {
	key: 'Porschev', // cookie key
	maxAge: config.REDIS.maxAge, // 最大的缓存时间
	overwrite: true, // 是否可以重写
	httpOnly: true, //
	rolling: false, // 强制在每个响应上设置会话标识符cookie 到期时间为maxAge  即是否每次都刷新cookie
	sign: true, // 是否使用签名
	store: new RedisStore({
		host: config.REDIS.host,
		port: config.REDIS.port,
		password: config.REDIS.password,
		set(){
			console.log('ttt')
		}
	})
};
app.use(session(redis_conf, app)); // 第一个写后台的童鞋可能不明白redis和session 看config

// 路由配置
const router = require('./routes/index')
app.use(router.routes(),router.allowedMethods()) // 全部一起配置  启动路由

// error-handling
app.on('error', (err, ctx) => { // 服务报错的情况下
  console.error('server error', err, ctx)
});

app.listen(config.SERVER_PORT, '0.0.0.0' , () => { // 启动服务 监听端口
	console.log(`Starting  port ${config.SERVER_PORT}!`)
});

module.exports = app; // 这个感觉根本不需要
