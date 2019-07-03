var app = require('koa')()
  , logger = require('koa-logger')
  , json = require('koa-json')
  , views = require('koa-views')
  , onerror = require('koa-onerror');

var index = require('./routes/index');
var users = require('./routes/users');

const config = require('./config/config') // 链接配置
const session = require('koa-session') // 缓存
const redisStore = require('koa-session-redis')

const index = require('./routes/index')
const reg = require('./routes/reg')
const login = require('./routes/login')
const logout = require('./routes/logout')

// error handler
onerror(app);

// global middlewares 全局中间件
app.use(require('koa-bodyparser')({enableType: ['json', 'form', 'text']}));
app.use(json());
app.use(logger());
app.use(require('koa-static')(__dirname + '/public'))

app.use(views('views', {
	root: __dirname + '/views',
	default: 'jade' // 这个是koa2 语言 jade.js
}));


app.use(async (ctx, next)=>{
  const start = new Date;
  await next()
  const ms = new Date - start;
  console.log('%s %s - %s', this.method, this.url, ms);
});

app.keys = ['Porschev'];
const redis_conf = {
	key: 'Porschev',
	maxAge: config.REDIS.maxAge,
	overwrite: true,
	httpOnly: true,
	rolling: false,
	sign: true,
	store: new RedisStore({
		host: config.REDIS.host,
		port: config.REDIS.port,
		password: config.REDIS.password
	})
};

app.use(session(redis_conf, app));

// routes definition
app.use(index.routes(), index.allowedMethods());
app.use(reg.routes(), reg.allowedMethods());
app.use(login.routes(), login.allowedMethods());
app.use(logout.routes(), logout.allowedMethods());

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

app.listen(config.SERVER_atPORT, () => {
	console.log(`Starting  port ${config.SERVER_PORT}!`)
});

module.exports = app;
