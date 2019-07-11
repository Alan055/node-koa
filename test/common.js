//投注页面公共事件


// 奖金池
const maxBounsArr = [100000, 200000, 400000];
// 最高奖金
const maxBounsObj = {
	pk10: maxBounsArr[1],
	elvenY: maxBounsArr[1],
	dpc: maxBounsArr[0],
	k3: maxBounsArr[1],
	sscs: maxBounsArr[2],
	flb: maxBounsArr[2],
};


//计算最高奖金限额的函数
function calc_maxBouns(id,biggerType) {
	// 逻辑是根据不同的玩法，ssc pk10 3d  11x5 来拿到不同的奖金（写死的）
	let maxBouns;
	if (id == 911 || id == 50) {
		maxBouns = maxBounsArr[1];
	} else {
		maxBouns = maxBounsObj[biggerType];
	}
	return maxBouns ? maxBouns : maxBounsArr[2];
}


export default {
	calc_maxBouns,
}