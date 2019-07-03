// 配置文件  用户区分开发环境和生产环境

const production = { // 生产
	SERVER_PORT: 3000, // 服务器断开配置
	REDIS: { // redis配置
		host: 'localhost',
		port: 3306,
		password: '1234',
		maxAge: 3600000,
	},
	MYSQL: { // mysql数据库配置
		host: 'localhsot',
		port: '3306',
		user: 'root',
		password: 'new-password',
		database: 'alanSQL',
		supportBigNumbers: true,
		multipleStatements: true,
		timezone: 'utc'
	}
}

const development = { // 开发
	SERVER_PORT: 3000, // 服务器断开配置
	REDIS: { // redis配置
		host: 'localhost',
		port: 3306,
		password: '1234',
		maxAge: 3600000,
	},
	MYSQL: { // mysql数据库配置
		host: 'localhsot',
		port: '3306',
		user: 'root',
		password: '123456', // 家里
		// password: 'a123456', // 公司
		database: 'alanSQL',
		supportBigNumbers: true,
		multipleStatements: true,
		timezone: 'utc'
	}
}

const config = development // 选择开发/生产模式

module.exports = config // 输出
