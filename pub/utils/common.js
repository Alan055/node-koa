// 公共函数 很多地方都可以用的到的

// router中  某个接口同时允许get和post两种方式 的函数
function getPost(router, path, callback){
	router.get(path, callback)
	router.post(path, callback)
}
// router中  某个接口只允许get方式 的函数
function getOnly(router, path, callback){ // 一般是都支持滴 除了获取文件 只能用get
	router.get(path, callback)
}
// router中  某个接口只允许post方式 的函数
function postOnly(router, path, callback){ // 一般是都支持滴  除了获取文件 只能用get
	router.post(path, callback)
}




module.exports = {
	getPost, // router中  某个接口同时允许get和post两种方式 的函数
	getOnly, // router中  某个接口只允许get方式 的函数
	postOnly, // router中  某个接口只允许post方式 的函数
}