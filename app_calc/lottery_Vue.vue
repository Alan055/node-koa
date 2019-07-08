<template>
  <div class="alan_lottery" v-if="lotteryAll.length>0" :class="'skin'+skin + (isShow_bonusPool?' hasBonusPool':'')">
    <div class="pageTop">
      <div class="fixedTop" >
        <!--我的喜爱 组件-->
        <al_recentGame></al_recentGame>
        <bonusPool v-show="isShow_bonusPool"></bonusPool>
      </div>
      <!--页头组件，包含logo，倒计时，上一期开奖号码，历史开奖号码  四个部分-->
      <div class="lotteryTop">
        <!--logo的渐变色-->
        <div class="logo_bg">
          <!--logo-->
          <span class="logo"
                :style="`background:url(${currentLottery&&currentLottery.pcIcon?currentLottery.pcIcon:'/static/img/logo/icon_'+currentCodeStr+'.png'}) no-repeat`"></span>
        </div>
        <al_countdown :issue="currentIssue" class="countdown"></al_countdown>
        <al_lastLoteryNumber class="lastLoteryNumber" v-if="historyLotteryInfo.length>0"
                             :name="currentLottery.showName"></al_lastLoteryNumber>
        <!--走势图-->
        <div class="trend">
          <a class="trendBox"
             :href="currentLottery.id===250?'/trend':`/trendChart?id=${currentLottery.id}&w=1&q=50&chs=${currentLottery.showName}`"
             target="_blank">
            <img src="../lotteryRefactoring/lotteryImg/icon_trend_cai.png" alt="" class="top">
            <div class="bottom">走势开奖</div>
          </a>
        </div>
      </div>
      <!--官方和经典玩法的切换-->
      <al_switchLottery></al_switchLottery>
      <!--做号投注-->
      <al_writeNumberBet v-if="historyLotteryInfo.length>0"></al_writeNumberBet>
    </div>
    <div class="pageContent">
      <!--官网开奖按钮-->
      <a v-if="currentLottery.code.includes('TXSSC')" :href="offical_lottery_http" target="_blank" class="offical_lottery_http"> <img src="../lotteryRefactoring/lotteryImg/offical_lottery_http.png" alt=""></a>
      <!--投注功能相关-->
      <div class="lotteryContentBox">
        <!--动画 嵌入的iframe-->
        <div class="frame" :class="{close:!showPk10}" v-if="currentLottery&&String(currentLottery.id).search('43|204|110')>-1">
          <iframe :src="'/static/pk10/index.html?id='+currentLottery.id" id="pk-SetParent-iframe" v-if="showPk10"></iframe>
          <div class="btn-close" @click="showPk10 = !showPk10">{{showPk10 ? '关闭' : '开启'}}</div>
        </div>
        <div class="lotteryContent">
          <!--玩法页面--展示和点击-->
          <al_play v-if="biggerType!=='jd'&& currentLotteryId!==0&&historyLotteryInfo.length>0"
                   :zu="zuTypeEvent"></al_play>
          <jd_choose_area v-if="biggerType === 'jd' && currentLotteryId != 250"
                          :zu="zuTypeEvent" :currentLotteryId="currentLotteryId"></jd_choose_area>
          <lhc_choose_area v-if="biggerType === 'jd' && currentLotteryId == 250" :zu="zuTypeEvent"></lhc_choose_area>
          <v-line/>
          <!--添加号码页面，预投注模块-->
          <al_readyBetting v-if="biggerType !== 'jd'" :issue="currentIssue"
                           :name="currentLottery.showName"></al_readyBetting>
        </div>
        <!--订单记录页面-->
        <al_orderRecord :issue="currentIssue"></al_orderRecord>
      </div>

      <div class="lotteryRightInfo">
        <!--历史开奖号码-->
        <al_historyLoteryNumber class="lastLoteryNumber" v-if="historyLotteryInfo.length>0"
                                :historyLotteryInfo="historyLotteryInfo"
                                :zuTypeTop="zuTypeTop"></al_historyLoteryNumber>
        <div class="rank">
          <div v-for="(v,i) in rankTab" :key="i" class="tab" :class="{'active':rankTabIndex===i}"
               @click="rankTabIndex=i">
            <img :src="v.img" alt="">{{v.text}}
          </div>
          <div class="content">
            <al_currentWinMember v-show="rankTabIndex===0"></al_currentWinMember>
            <al_rank v-show="rankTabIndex===1"></al_rank>
          </div>
        </div>
      </div>
    </div>
    <!--时时彩开奖动画-->
    <div class="ssc_animation">
    </div>
    <advertisementPage :num="biggerType=='jd'?6:5"></advertisementPage>
  </div>
</template>

<script>

  //引入插件，公共事件等
  import {getLotteryType} from "../js/common.js";//公共方法
  import service from "../js/service";//http服务
  import {mapState, mapMutations, mapActions} from 'vuex';//状态管理
  import lotteryComment from "./lotteryRefactoring/js/common.js";//引入投注模块公共方法
  import line from "./lotteryRefactoring/line";//引入投注模块公共方法
  // 引入页面组件

  import al_recentGame from "../lotteryRefactoring/alanRecentGame.vue";// 最近游戏组件
  // import al_myFavorite from "./lotteryRefactoring/alanMyFavorite.vue";// 我的喜爱组件
  import al_switchLottery from "../lotteryRefactoring/alanSwitchLottery.vue"; // 切换经典玩法和官方玩法的组件
  import al_writeNumberBet from "../lotteryRefactoring/alanWriteNumberBet.vue";//做号投注组件
  import bonusPool from "./activity/bonusPool.vue"; // 奖金池活动



  import {Cookie} from '../js/common.js';

  /*
  * 下面这三个是页头组件  包含倒计时组件、上期开奖号码组件、历史开奖号码组件
   */
  import al_countdown from '../lotteryRefactoring/alanCountdown.vue'
  import al_lastLoteryNumber from '../lotteryRefactoring/alanlastLoteryNumber.vue'
  import al_historyLoteryNumber from '../lotteryRefactoring/alanhistoryLoteryNumber.vue'
  // 玩法页面组件
  import al_play from "../lotteryRefactoring/alanPlayFn.vue";
  // 预投注页面组件
  import al_readyBetting from "../lotteryRefactoring/alanReadyBetting.vue";
  // 订单记录页面组件
  import al_orderRecord from "../lotteryRefactoring/alanOrderRecord.vue";
  // 最近中奖会员
  import al_currentWinMember from "../lotteryRefactoring/alanRecentWinMember.vue";
  // 排行数据
  import al_rank from "../lotteryRefactoring/alanRank.vue";
  import jd_choose_area from './lotteryRefactoring/jdChooseArea.vue'
  import lhc_choose_area from './lotteryRefactoring/lhcChooseArea.vue'

  import advertisementPage from "./advertisement.vue";

  // 测试组态用
  //   function hasDuplicates(a, len) {
  // 	  if (arguments.length > 2) {
  // 		  var chkeylen = arguments[2];
  // 		  var bc = _.countBy(a, _.identity);
  // 		  var maxsame = 0;
  // 		  for (var key in bc) {
  // 			  if (typeof bc[key] !== 'undefined') {
  // 				  if (bc[key] > maxsame) {
  // 					  maxsame = bc[key];
  // 				  }
  // 			  }
  // 		  }
  // 		  var allkeys = Object.keys(bc);
  // 		  if (arguments.length > 3) {
  // 			  return _.uniq(a).length !== a.length && chkeylen == maxsame && arguments[3] == allkeys.length && (a.length - _.uniq(a).length == len);
  // 		  }
  // 		  return _.uniq(a).length !== a.length && chkeylen == maxsame && (a.length - _.uniq(a).length == len);
  // 	  }
  // 	  return _.uniq(a).length !== a.length ? (a.length - _.uniq(a).length   == len) : true;
  //   }

  export default {
    components: {
      al_recentGame,
      al_countdown,
      al_lastLoteryNumber,
      al_historyLoteryNumber,
      al_play,
      al_readyBetting,
      al_orderRecord,
      al_currentWinMember,
      al_rank,
      al_switchLottery,
      al_writeNumberBet,
      jd_choose_area,
      lhc_choose_area,
	    advertisementPage,
	    bonusPool,
      'v-line': line
    },
    data() {
      return {
        lotteryAll: this.$store.state.allLotteryList,//获取所有的彩种，如果是投注页面刷新就只能在监听器里面取值
        currentLotteryId: 0,//当前页面对应的彩种id值
        currentLottery: {},//当前彩种id值对应的彩种信息（彩种id，中文名称，code（对应的logo大写class，需转成小写））
        currentIssue: '',// 当前正在开奖的期数--用于倒计时上方的标题展示
        historyLotteryInfo: [],//历史开奖号码的信息
        zuTypeTop: null,//组态的列头数据--历史开奖号码第三列的列头数据
        // zuTypeContent: [],//组态的列内容--历史开奖号码第三列的列内容数据，不能喝其他数据拼和
        timer_openTime: null,//开奖定时器
        timer_openHistory: null,//如果没获取到开奖号码，就5s获取一次历史开奖号码数据
        zu_name: null,//保存一下组态事件传进来的参数
        zu_mapping: null,//保存一下组态事件传进来的参数
        zu_twoMenuName: null,//保存一下组态事件传进来的参数
        // recentGame:null,//最近游戏的数组
        rankTab: [
          {text: '最近中奖会员', img: '/static/img/icon_medal.png'},
          {text: '长龙排行数据', img: '/static/img/icon_trophy.png'},
        ],//排行榜的页签
        rankTabIndex: 0,//当前选中的排行榜页签
        showPk10: true,
        offical_lottery_http: appConfig().offical_lottery_http
      }
    },
    computed: {
      // 所有的彩种    是否是官方彩种，在进入和销毁时要改变是否是官方彩种的状态  //最近的一期开奖号码
      ...mapState(['allLotteryList', 'isOfficialLottery', 'isClassicLottery', 'initStatus_recentGame', 'historyLotteryInfoFirst', 'biggerType', 'initStatus_Rank', 'initStatus_history', 'baseInfo', 'skin', 'isShow_bonusPool']),
      // 当前经典玩法的codestr
      currentCodeStr() {
        if (this.biggerType === 'jd') {
          return this.currentLottery.code && this.currentLottery.code.replace('XJW', '')
        } else {
          return this.currentLottery.code
        }
      },
      name() {
        return this.baseInfo.nickName ? this.baseInfo.nickName : localStorage.getItem('_name')
      },
      // 是不是短时彩--时间比较短的彩种
      // 如果是时时彩  就打开开奖动画出来 --时时彩专属开奖动画 --韩国1.5分彩、东京1.5分彩、多伦多30秒、首尔1.5分彩、新德里1.5分彩、夏威夷分分彩、新加坡两分彩、腾讯分分彩、伦敦2分彩、纽约1.5分彩隐藏
      isShortTimeLottery() {
        return this.currentLottery.code.search(/HGSSC|DJSSC|TG30SSC|TX30SSC|QQ60SSC|SHOUERSSCXJW|TGSSC|ZYFFSSC|XJPSSC|TXSSC|LD2SSC|NEWYOSSC|MD60SSC|CND60SSC|JPZ60SSC|FLB45SSC|JPZ45SSC|XJP45SSC/) > -1
      }
    },
    watch: {
      allLotteryList() {
        this.lotteryAll = this.$store.state.allLotteryList;
        this.init()
      },
      $route(now, pre) {
        this.timer_openTime && (clearInterval(this.timer_openTime))
        this.init()
        this.setData({key: "number_tableData", value: []})// 清空购彩篮
      },
      baseInfo() {
        this.getNewComerCookie()
      }
    },
    methods: {
      ...mapMutations(['setData']),
      ...mapActions(['findMaxBouns']),
      //页头初始化函数
      topInit() {
        if (this.lotteryAll.length === 0) return
        // 获取当前彩种的code，用于logo的class
        this.currentLottery = this.lotteryAll.find((e) => (e.id == this.currentLotteryId))
        // console.log(this.currentLottery)
        this.setData({key: "currentLottery", value: this.currentLottery})
        // this.setData({key: 'maxBouns', value: lotteryComment.calc_maxBouns(this.currentLottery.id, this.biggerType)});// 计算最高奖金 -- 从接口取了
        this.findMaxBouns(this);// 计算最高奖金 -- 从接口取了
        //定时器-开奖倒计时
        this.countdown()
        //历史开奖数据汇总
        this.findHistoryLottery()
        // 将该游戏增加到缓存中，存储为最近游戏
        // this.saveRecentGame()
      },
      //缓存最近游戏
      // saveRecentGame() {
      // 	// 先从缓存中拿最近游戏的数据  对应名称为tc_recentGame_pc
      // 	let arr = window.localStorage.getItem('tc_recentGame_pc')
      // 	arr = arr ? JSON.parse(arr) : []
      // 	//算法问题  先查找是否已存在  然后插入 比先插入  然后去重效率高
      // 	for (var i = 0; i < arr.length; i++) {
      // 		if (arr[i].id === this.currentLotteryId) break
      // 	}
      // 	i < arr.length && arr.splice(i, 1)//说明存在 所以删除
      // 	arr.unshift(this.currentLottery)//从前面添加进去
      // 	window.localStorage.setItem('tc_recentGame_pc', JSON.stringify(arr));//刷新到缓存中
      //  //然后我要去取这个数组的各个元素的倒计时开奖时间
      //  this.recentGame=arr;//赋值给最近游戏，开始渲染
      // },
      //开奖倒计时---这个只能取一次，然后js控制定时器去+1秒，不能隔一秒去取一次
      countdown() {
        service.post(this, 'game-lottery/static-open-time', {name: this.currentLottery.code}).then(function (result) {
          //给当前正在开奖的期数赋值
          this.currentIssue = result.data.issue;
          this.setData({key: "stopOpenTime", value: result.data.stopTime}); // 将停止开奖时间存起来
          this.setData({key: "issue", value: this.currentIssue}); // 将当前正在开奖的期数存起来
          let openTime = result.data.surplusTime //用这个字段，需要加上本地的当前时间
          //取到倒计时时间格式hh-mm-ss，发送到vuex中
          this.timelast_setStore(openTime)
          //定时器
          this.timer_openTime = setInterval(function () {
            //取到倒计时时间格式hh-mm-ss，发送到vuex中
            let time = this.timelast_setStore(--openTime)
            // 下面有两个判断：一个是开奖了00-00-00  另一个是刚开完奖（此时取到的时间是-1）
            let that = this;
            //为00-00-00时清空定时器--并且出来弹框--清空定时器并不会跳出去，还是会执行完这个方法
            if (time === '00-00-00') {

              //将开奖号码区的期数修改成即将开奖的号码 code设置成null，页面的开奖号码就会变成开奖中...
              this.setData({key: "historyLotteryInfoFirst", value: {issue: this.currentIssue, code: null}})
              clearInterval(this.timer_openTime);
              this.$Modal.al_openLottery({
                status: 'warning',
                content: '第 ' + this.currentIssue + ' 期 已截止，<br/>请注意投注期号！',
                time: 4000
              })//4秒钟关闭弹出框 组件中已写有
              //倒计时结束时 目前不需要结束了，开奖结束后就去取开奖号码  开奖的逻辑
              this.openLottery_event();
            }
            //为-1时说明刚刚开奖，就不做操作，定时取开奖时间
            if (time === -1) {
              clearInterval(this.timer_openTime);
              this.countdown()
            }
          }.bind(this), 1000)
        }, function (err) {
          console.log(err)
        })
      },
      //倒计时 传入的参数是倒计时剩余的秒数
      timeReduceOne(v) {
        //获取现在时间距离开奖时间的毫秒差
        // let time = (new Date(v).getTime()) - (new Date().getTime())
        //如果是，说明刚刚开完奖，就返回-1,约定-1的时候显示00-00-00然后下次重新掉接口取
        if (v < 0) return -1;
        // time = parseInt(time / 1000);
        let h = parseInt(v / 3600) + '';
        let m = parseInt((v - h * 3600) / 60) + '';
        let s = parseInt((v % 60)) + '';
        // i===0取的是当前时间和开奖时间的对比，i===1是在定时器里面，要减一秒
        return `${(h + '').padStart(2, '0')}-${(m + '').padStart(2, '0')}-${(s + '').padStart(2, '0')}`;
      },
      //取到倒计时时间格式hh-mm-ss，发送到vuex中
      timelast_setStore(v) {
        this.setData({key: "openTimeS", value: v})
        //剩余时间-距离开奖还有多少时间
        let time = this.timeReduceOne(v)
        // 当开奖刚刚结束时,时间差是负数时会返回-1,手动转化为00-00-00
        time === -1 ? this.setData({key: "openTime", value: '00-00-00'}) : this.setData({key: "openTime", value: time});
        //倒计时返回，用于定时器判断
        return time
      },
      //历史开奖数据汇总   参数是刚刚开奖的数据  页面出来的时候  是不会传这个参数的  只有开奖的时候才会传这个参数
      findHistoryLottery(issue) {
        service.post(this, 'game-lottery/static-open-code', {
          name: this.currentLottery.code,
          history: true
        }).then(function (result) {
          let data = result.data
          //根据时间戳排序   不需要排序  因为刚刚开奖的号码  时间戳是0，所以没办法排序
          // data.sort(function (a, b) {
          // 	return b.time - a.time;
          // })
          //保存历史开奖数据
          this.historyLotteryInfo = data
          this.setData({key: "historyLotteryInfoFirst", value: data[0]})//第一个存起来  放在上期开奖号码组件里面
          // 当有传参时
          if (issue) {
            let lastOpenLottery = data.find(e => (e.issue === issue))

            //刷新组态
            this.findZuTypeData(this.zu_name, this.zu_mapping, this.zu_twoMenuName)
            if (lastOpenLottery && lastOpenLottery.code) {
              clearInterval(this.timer_openHistory)
              // this.zu_name && (this.findZuTypeData(this.zu_name, this.zu_mapping, this.zu_twoMenuName))
              // 如果是时时彩  就打开开奖动画出来 --时时彩专属开奖动画 --短时彩隐藏
              this.biggerType === 'sscs' && !this.isShortTimeLottery && this.$Modal.al_openLottery_ssc({openCode: this.historyLotteryInfoFirst.code})
	            // 初始化出码联动数据  通过改变vuex的状态
	            this.setData({key: "initStatus_Rank", value: !this.initStatus_Rank})
            }
          } else if (!this.historyLotteryInfoFirst || !this.historyLotteryInfoFirst.code) {
            //没传参时，就是页面刚进来的时候  如果是没取到开奖号码的话  会隔三秒去取一次
            setTimeout(function () {
              this.findHistoryLottery()
            }.bind(this), 3000)
          } else if (this.historyLotteryInfoFirst.code) {
            // 这里不做任何操作
          }
          // 拿到了开奖号码就刷新组态 --直接刷新   --感觉这个会对性能有影响
          this.findZuTypeData(this.zu_name, this.zu_mapping, this.zu_twoMenuName)
        }, function (err) {
          console.log(err)
        })
      },
      //组态更新事件--就是排行榜最后一列的数据展示，这个是通过在玩法一级菜单来控制的，
      //所以要吧这个事件传到玩法列表组件中获取一级菜单，再回调回来
      //因为开奖之后 历史开奖号码改变了，但是我们的一级菜单并没有改变，所以无法触发组态的刷新事件，这里我们把参数存起来，手动调这个事件
      zuTypeEvent(name, mapping, twoMenuName) {
        //name是一级菜单的名称，mapping是当前玩法大类（时时彩、11选5）的映射表大类
        this.zu_name = name;
        this.zu_mapping = mapping;
        this.zu_twoMenuName = twoMenuName;
        this.findZuTypeData(name, mapping, twoMenuName)
      },
      findZuTypeData(name, mapping, twoMenuName) {
        if (!mapping) return
        //name是一级菜单的名称，mapping是当前玩法大类（时时彩、11选5）的映射表大类
        this.zuTypeTop = mapping.zuTypeMaping[name] // 组态栏最上方的标题
        let method = this.zuTypeTop ? mapping.zuTypeMethod[name] : null;
        for (let val of this.historyLotteryInfo) {
          this.$set(val, 'zuType', val.code ? (method ? method(String(val.code), twoMenuName) : '') : '---') //传入组态
          this.$set(val, 'oneMenu', name) // 传入一级菜单的名称   通过这个名称来控制哪几个号码点亮  --五星  四星 前三 后三等
          this.$set(val, 'twoMenu', twoMenuName) // 传入一级菜单的名称   通过这个名称来控制哪几个号码点亮  --五星  四星 前三 后三等
        }
        this.setData({key: "initStatus_history", value: !this.initStatus_history})
        // this.zuTypeContent = arr;
      },
      //倒计时结束时  开奖的逻辑
      openLottery_event() {
        //先清除定时器  避免一直累加定时器
        this.timer_openHistory && (clearInterval(this.timer_openHistory))
        let lastIssue = this.currentIssue; //保存一下刚刚开奖的期数，然后去新请求到的历史开奖号码中去查找号码
        //重新开启开奖倒计时事件
        this.countdown();
        // 定时器  5秒钟取一次开奖号码，直接取历史开奖号码
        this.timer_openHistory = setInterval(function () {
          this.findHistoryLottery(lastIssue)
        }.bind(this), this.isShortTimeLottery ? 2000 : 5000) // 短时彩就是2秒  其他的就是5秒
        //延迟一秒去取开奖号码，原因是直接取会导致取到的数据还没开到下个期号  所以开奖号码区就不是以前的开奖号码，也不会立即出现开奖中的显示
        setTimeout(function () {
          this.findHistoryLottery(lastIssue)
        }.bind(this), 1000)
      },
      init() {
        this.currentLotteryId = Number(this.$route.hash.replace('#', ''))
        this.setData({key: 'biggerType', value: getLotteryType(this.currentLotteryId)}) // 最大的彩种类型  sscs jd flb other elvenY dpc
        this.setData({key: 'initStatus_recentGame', value: !this.initStatus_recentGame}) // 改变最近游戏初始化状态  让最近游戏初始化
        if (this.biggerType === 'jd') {
          this.setData({key: "isOfficialLottery", value: false})
          this.setData({key: "isClassicLottery", value: true})
        } else {
          this.setData({key: "isOfficialLottery", value: true})
          this.setData({key: "isClassicLottery", value: false})
        }
        this.topInit() // 页头初始化
      },
      // 读取新手指引cookie
      getNewComerCookie() {
        this.$nextTick(function () {
          if (!this.name) {
            return
          }
          // console.log(this.baseInfo.nickName,this.name,this.baseInfo, Cookie.getCookie("tc_tempoBetting_" + this.name),);
          if (Cookie.getCookie("tc_tempoBetting_" + this.name) !== 'true') {
            // Cookie.setCookie("tc_tempoBet_"+this.baseInfo.nickName, 1, 30);
            window.scrollTo(0, 0)
            // $('body').css({'overflow': 'hidden'})
            this.setData({key: "isShowBetting", value: true})
          }
        }.bind(this))
      },
    },
    mounted() {
      this.$nextTick(function () {
        this.getNewComerCookie()
      }.bind(this))
    },
    created() {
      this.setData({key: "isOfficialLottery", value: true})
      this.setData({key: "isBetting", value: true})
      this.init()
    },
    destroyed() {
      this.setData({key: "isOfficialLottery", value: false})
      this.setData({key: "isOfficialLottery", value: false})
      this.setData({key: "isClassicLottery", value: false})
      this.setData({key: "isBetting", value: false})
      this.setData({key: "currentLottery", value: null})
      // 关闭定时器
      clearInterval(this.timer_openTime)
      clearInterval(this.timer_openHistory)
    }
  }
</script>

<style lang='less' scoped>
  @import "../css/global.less";

  .alan_lottery {
    min-height: 300px;
    color: #333;
    margin: 0 auto;
    margin-top: 102px;
    display: flex;
    justify-content: center;
    &.hasBonusPool{
      .fixedTop{
        position: fixed;
        left: 0;
      }
      .lotteryTop{
        margin: 198px auto 0 !important;
      }
      .pageContent{
        padding-top: 346px;
      }
    }
    .pageTop {
      position: absolute;
      width: 100%;
      left: 0;
      z-index: 50;
      .fixedTop{
        width: 100%;
        height: 188px;
        background: url("../lotteryRefactoring/lotteryImg/bg_top_official.png") no-repeat;
        background-size: 100% 100%;
        z-index: 15;

      }
      .lotteryTop {
        width: 1200px;
        margin: -140px auto 0;
        height: 140px;
        background: url("../lotteryRefactoring/lotteryImg/bg_mod_top.png") no-repeat;
        background-size: 100% 100%;
        text-align: left;
        overflow: hidden;
        display: flex;
        align-items: center;
        > div {
          display: inline-block;
        }
        .logo_bg {
          width: 206px;
          height: 100%;
          border: 0;
          overflow: hidden;
          background: url("../lotteryRefactoring/lotteryImg/bg_cai.png") no-repeat;
          background-size: 100% 100%;
          text-align: center;
          line-height: 140px;
          .logo {
            display: inline-block;
            height: 100px;
            width: 140px;
            margin-top: 0px;
            margin-bottom: 0px;
            /*margin-left: 8px;*/
            background-clip: content-box;
            background-repeat: no-repeat;
            vertical-align: middle;
            /*background-size: 100% 100% !important;*/
          }
        }
        .countdown {
        }
      }
      .trend {
        width: 246px;
        height: 100%;
        display: flex !important;
        align-items: center;
        justify-content: center;
        .trendBox {
          width: 150px;
          height: 100px;
          border-radius: 20px;
          border: 2px solid rgba(255, 255, 255, 0.2);
          cursor: pointer;
          .top {

            width: 44px;
            height: 44px;
            margin: 0 auto;
            display: block;
            margin-top: 10px;
            margin-bottom: 15px;
          }
          .bottom {
            width: 64px;
            height: 27px;
            font-size: 16px;
            color: #FFDE00;
            margin: 0 auto;
            line-height: 13px;
          }
        }
      }
    }
    .pageContent {
      /*overflow: hidden;*/
      padding-top: 196px;
      padding-bottom: 53px;
      position: relative;
      >.offical_lottery_http{
        position: absolute;
        right: -45px;
        top: 346px;
      }
      .lotteryContentBox, .lotteryRightInfo {
        display: inline-block;
        float: left;
      }
      .lotteryContentBox {
        .frame {
          width: 100%;
          position: relative;
          margin-bottom: 20px;
          &.close {
            padding-bottom: 10px;
            &:before {
              padding-top: 0;
            }
          }
          iframe {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
          }
          .btn-close {
            position: absolute;
            top: 0;
            right: 10px;
            width: 50px;
            line-height: 20px;
            text-align: center;
            background-color: #E8E8E8;
            cursor: pointer;
            font-size: 14px;
            color: #333333;
          }
          &:before {
            content: '';
            display: block;
            padding-top: 66.5%;
          }
        }
      }
      .lotteryContentBox {
        width: 904px;
      }
      .lotteryContent {
        .bor(@methodBox_bor);
        background: #fff;
        width: 100%;
        /*padding-bottom: 30px;*/
        margin-bottom: 8px;
        // overflow: hidden;
      }
      .lotteryRightInfo {
        width: 288px;
        margin-left: 8px;
        height: fit-content;
        .rank {
          background: #fff;
          margin-top: 8px;
          width: 100%;
          /*height: 515px;*/
          height: 520px;
          .bor(@methodBox_bor);
          .tab {
            display: inline-block;
            width: 50%;
            float: left;
            line-height: 40px;
            font-size: 14px;
            border-bottom: 1px solid @methodBox_bor;
            cursor: pointer;
            background: #F0F0F0;
            &:last-child {
              border-left: 1px solid @methodBox_bor;
            }
            &.active {
              color: #F53B4A;
              position: relative;
              border: none;
              background: #fff;
              .al_navWood;
            }
            &:first-child {
              border-right: 1px solid @methodBox_bor;
            }
          }
          .content {
            width: 100%;
            height: calc(~"100% - 41px");
            overflow: hidden;
            > div {
              overflow: auto;
              .al_scorll();
            }
          }
        }
      }
    }

  }

  @media screen and (max-width: 1024px) {
    .alan_lottery {
      width: 958px;
      .pageTop {
        padding: 0 calc(~"50% - 446px");
      }
      .lotteryTop {
        width: 892px !important;
        .trend {
          width: 104px;
          a {
            border: none !important;
          }
        }
      }
      .lotteryContentBox {
        width: 660px !important;
        overflow: hidden;
      }
    }
  }
</style>
