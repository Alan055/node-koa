<template>
  <div class="chooseNumBox" v-if="data">
    <!--玩法介绍-->
    <div class="palyIntroduction">
      <div class="left">
        <!--这个问号是详细介绍-->
        <div style="position: relative">
          <span @mouseenter="showPlayDetail=true" @mouseleave="showPlayDetail=false">
            <span class="symbol icon_v3">&#xe6ad;</span>
            <label>玩法示意：</label>
            <!--详细介绍-->
            <div class="detailedIntroduction" v-if="showPlayDetail">
              <div v-html="data.example"></div>
              <div v-html="filterText(data.help)"></div>
            </div>
          </span>
          <span class="simpleIntroduction" v-html="data.tips"></span>
        </div>
      </div>
      <div class="right">
        <span class="symbol icon_v3">&#xe65c;</span>
        玩法奖金 :<b> ¥ {{currentBonus}}</b>
      </div>
    </div>
    <!--
    * 选号展示
    * 其实这里是有三种玩法，--ssc
    * 多选--select，单选--checkbox，手写--textarea，
    -->
    <!--单选模式里面有包含多手写或者多选的，所以要放在上面-->
    <div class="singleSelect" v-if="data.checkbox&&chooseArr">
      <div class="singleSelectItem" v-for="v,i in data.checkbox.layout" :key="i">
        <label> {{v.title}}</label>
        <!--虽然说这里是二维的，但是实际上只有一层-->
        <CheckboxGroup v-model="chooseArr" @on-change="calcNote()">
          <Checkbox v-for="(m,n) in v.value" :key="n" :label="m" size="large"></Checkbox>
        </CheckboxGroup>
      </div>

    </div>
    <!--多选(选号)-->
    <ul class="chooseNum" :class="oneMenu!=='和值'?'lottery_'+biggerType:''" v-if="data.select&&balls">
      <li v-for="(v,i) in data.select.layout" :key="i">
        <label v-if="v.title">{{v.title}}</label>
        <div class="balls" :class="{'moreBalls':!v.title}">
          <span
            @click="(v.trigger==='only'||v.only)&&toolsClick(5,i);v.trigger==='all'?toolsClick(!m.active?0:5,i):m.active=!m.active;calcNote()"
            :class="{'active':m.active,'zh':isNaN(Number(m.num))}" v-for="(m,n) in balls[i]" :key="n"
            v-if="biggerType!=='k3'||oneMenu==='和值'">{{m.num}}</span>
          <span
            @click="v.trigger==='only'&&toolsClick(5,i);v.trigger==='all'?toolsClick(!m.active?0:5,i):m.active=!m.active;calcNote()"
            :class="{'active':m.active,'zh':isNaN(Number(m.num))}" v-for="(m,n) in balls[i]" :key="n"
            v-if="biggerType==='k3'&&oneMenu!=='和值'">
            <i v-for="(x,y) in String(m.num).split('')" :key="y" class="sieveBg" :class="'sieve'+(x==='*'?'7':x)"></i>
          </span>
        </div>
        <div class="toools" v-if="v.tools" :class="{'noTitle':!v.title}">
          <span @click="toolsClick(t,i)" v-for="(s,t) in tools" :key="t">{{s}}</span>
        </div>
      </li>

    </ul>

    <!--手写-->
    <div class="handwriting" v-if="data.textarea">
      <textarea autofocus @input="textChange()" v-model.trim="text"></textarea>
      <div class="help">
        <label
          class="lf">每注号码之间请用一个{{biggerType.search(/elvenY|pk10/)>-1?'':'空格或'}}英文逗号或英文分号隔开（输入的号码会自动排序并去除不合格号码）。</label><span
        @click="text=''"><i
        class="icon_v3">&#xe6ab;</i>清空号码</span>
      </div>
    </div>
    <!--选注栏-->
    <al_chooseNote :note="note">
      <al_addNumber></al_addNumber>
    </al_chooseNote>
    <div class="luzhu-open-btn" :class="{active:showLuzhuFlag}" @click="showLuzhuFn" v-show="showLuzhuBtn">线路图 <i
      class="icon_v3">&#xe616;</i></div>
  </div>
</template>

<script>
  import al_chooseNote from "./alanChooseNote.vue";//引入选注栏组件
  import lottery_calc from "./js/lottery_calc.js";//引入计算方法（其实是引入计算组数的方法 mapping.LotteryUtils）
  import al_addNumber from "./alanAddNumber.vue";
  import {mapState, mapMutations} from 'vuex';

  export default {
    //biggerType  //通过id查找到的彩种类型 最大的彩种类型  sscs jd flb other elvenY dpc
    props: ['data', 'config', 'oneMenu'],//data是选号区的组合数据，config是选注栏的配置，进度条大小，比例，单价等
    components: {al_chooseNote, al_addNumber},
    data() {
      return {
        //玩法示意
        showPlayDetail: false,//控制鼠标移入时，详细玩法的显示与隐藏
        currentBonus: '',//选号上面的当前奖金数

        //多选时
        balls: null,//选号的数据，从data里面来但是需要加个属性来判断是否已选中
        tools: ['全', '大', '小', '单', '双', '清',], //工具条
        toolsClick1: {
          '0'(i) {
            for (let val of this.balls[i]) {
              val.active = true
            }
          },//全选的时候
          '1'(i) {
            let a = (Math.ceil(this.balls[i][this.balls[i].length - 1].num) / 2);
            for (let val of this.balls[i]) {
              val.active = a < val.num ? true : false
            }
          },//选大的时候
          '2'(i) {
            let a = (Math.ceil(this.balls[i][this.balls[i].length - 1].num) / 2);
            for (let val of this.balls[i]) {

              val.active = a >= val.num ? true : false
            }
          },//选小的时候
          '3'(i) {
            for (let val of this.balls[i]) {
              val.active = val.num % 2 !== 0 ? true : false
            }
          },//选单的时候
          '4'(i) {
            for (let val of this.balls[i]) {
              val.active = val.num % 2 === 0 ? true : false
            }
          },//选双的时候
          '5'(i) {
            for (let val of this.balls[i]) {
              val.active = false
            }
          },//选清的时候
        },

        // 手写时
        text: '',//手写时的数据绑定
        //单选时
        chooseArr: null,//单选时的选中数据;
        note: 0,//注数，用于传到选注栏组件中 --这个大于0来控制是否可以追号
      }
    },
    computed: {
      ...mapState(['showLuzhuFlag', 'initStatus', 'biggerType', 'lottery_method', 'bonus', 'baseInfo', 'mode', 'writeNumber_Data', 'multiple', 'lotteryConfig', 'currentPlayInfo']),
      // 打开走势图开关
      showLuzhuBtn() {
        return this.$store.getters.showLuzhuBtn.show
      }
    },
    watch: {
      //监听data数据的变化，从而来刷新整个页面 --选注栏的注数也重置
      data() {
        this.init()
      },
      '$store.state.currentPlayInfo'() {
        this.$store.commit('setData', {key: 'showLuzhuFlag', value: true})
      },
      initStatus() {
        this.init()
      },
      bonus() {
        this.init_currentBonus()
      },
      mode() {
        this.init_currentBonus()
      },
      multiple() {
        this.init_currentBonus()
      },
      // 做号投注的数据 --用于做号投注生成号码之后将生成的号码同步到主页面上
      writeNumber_Data: {
        deep: true,
        handler: function () {
          this.text = this.writeNumber_Data.label;// 同步数据
          // 计算注数
          this.calcNote();
        }
      }
    },
    methods: {
      //setNote--更改vuex中的注数
      ...mapMutations(['setData']),
      showLuzhuFn() {
        let flag = this.showLuzhuFlag ? false : true
        this.$store.commit('setData', {key: 'showLuzhuFlag', value: flag})
      },
      //选号区右上角的当前奖金  初始化  还不是很清楚里面的计算逻辑
      init_currentBonus() {
        let ps = this.lottery_method.bonus ? this.lottery_method.bonus.split(',') : [0];
        let psx = Number(this.lottery_method.x);
        let userMinCode = this.config.sysCode - this.baseInfo.lotteryAccount.point * 20 // 这个位置会去减去返点  因为下面是减号  负负得正 所有最终计算的奖金组是加上返点的！
        //特殊处理
        if (String(this.data.shortname).includes('hhzx')) {
          var topbonus = ps[0];
          ps.unshift(Number(parseFloat(topbonus / 2)).toFixed(2))
        }
        let arr = [];
        for (let val of ps) {
          let percent = Number(val) / userMinCode;
          let pm = (Number(val) + ((userMinCode - parseInt(this.lotteryConfig.minBetCode, 10)) / Number(2000)) * psx) * (this.config.sysUnitMoney / 2); // userMinCode会加上返点
          arr.push(pm);
        }
        arr.sort(function (a, b) {
          return Number(a) > Number(b) ? 1 : -1;
        });
        let mode = this.moneyTranslation[this.mode].rate
        if (arr.length == 1) {
          arr[0] = arr[0] * mode * this.multiple;
          this.currentBonus = arr[0].toFixed(3);
        } else {
          arr[0] = arr[0] * mode * this.multiple;
          arr[arr.length - 1] = arr[arr.length - 1] * mode;
          this.currentBonus = arr[0].toFixed(3) + ' ~ ' + arr[arr.length - 1].toFixed(3);
        }
        if (this.biggerType.search(/sscs|flb/) > -1 && this.currentPlayInfo.realname.includes('龙虎')) {
          let longhu = (this.currentBonus / 4.5).toFixed(2)
          this.currentBonus = `${longhu}/${longhu}/${Number(this.currentBonus).toFixed(2)}`
        }
      },
      //处理多选的数据
      buildDataSelect() {
        let arr = [];
        //将选号取出来，做成一个二维数组对象
        for (let [v, i] of new Map(this.data.select.layout.map((v, i) => [v, i]))) {
          arr[i] = []
          for (let val of v.balls) {
            arr[i].push({num: val, active: false})
          }
        }
        //赋值给balls，然后渲染到页面上
        this.balls = arr;
      },
      //处理手写的数据 --这里面不需要处理
      buildDataTextarea() {

      },
      //处理单选的数据
      buildDataCheckbox() {
        let arr = []
        for (let [v, i] of new Map(this.data.checkbox.layout.map((v, i) => [v, i]))) {
          arr[i] = [];
        }
        //虽然this.data.checkbox.layout是二维的，但实际上都只有一层
        this.chooseArr = [];
      },

      // //点击事件
      //选号右边的工具条点击事件
      toolsClick(t, i) {
        //这里好像不能直接写
        let fn = this.toolsClick1[t + ''];
        fn.call(this, i)
        //点击的不是清时，就会出发点击球的事件
        i !== 5 && this.calcNote()
      },
      //查询单选框有哪几个选中了

      //多选球的点击事件
      // boolsClick(){
      //  // let arr=[];//把选中的球装起来，容器
      //  // //遍历二维数组
      //  // let i=0;
      //  // for(let val of this.balls){
      //  // 	arr[i]=[]
      //  // 	for(let v of val){
      //  // 		v.active&&(arr[i].push(v))
      //  // 	}
      //  // 	i++
      //  // }
      //  // //如果这个容器里面第一层有一个数组的长度为0，就说明有一行是没有选中的，直接跳出
      //  // let note=1;//注数
      //  // for(let val of arr){
      //   //  note=note*(val.length)//注数算法是：各行选中的个数之积
      //  // }
      //  // ///能走到这里来，说明选号区里面每一行至少有一个球是选中了的
      //  // //改变选注区的数据
      //  // this.note=note
      //
      //  //计算注数（所有的玩法整合在一起）
      //  this.calcNote()
      // },
      //输入框（手写）内容修改时
      textChange() {
        // 这里不能统一过滤  要分开  因为像11选5和pk10的都是01 02 03..  所以他们的选号只能是空格和其他分隔符  这里做个适配
        if (this.biggerType.search(/elvenY|pk10/) > -1) {
          this.text = this.text.replace(/[;；.。，、|\n]/g, ',')
        } else {
          this.text = this.text.replace(/[;；.。，、| \n]/g, ',')
        }

        this.calcNote()
      },
      // 文字过滤器
      filterText(v) {
        let str1 = '<span style="color: #F53B4A;">开奖号码</span>'
        let str2 = '<span style="color: #F53B4A;">顺序一致</span>'
        return v.replace(/开奖号码/, str1).replace(/顺序一致/, str2)
      },
      // 快三 二同号  标准选号  不同号的数据不能是二同号已选的数据
      k3_special() {
        if (this.data.shortname === 'ethdx') {// 快三  二不同号
          let i = 0;
          for (let val of this.balls[0]) {
            val.active && (this.balls[1][i].active = false)
            i++
          }
        }
      },
      // 计算注数（所有的玩法整合在一起）
      calcNote() {
        this.k3_special()// 快三 二同号  标准选号  不同号的数据不能是二同号已选的数据  需要过滤掉
        /*
        *  分别拿到单选按钮、选号、手写的已选中数据
        *  然后拼接成一个数组传到函数中计算
        */
        //单选按钮的不需要取，直接就是this.chooseArr ----tmd这套算法太恶心了   后期都重构掉
        let check_arr = [] //二维数组  下面的嵌套循环
        if (this.data.checkbox) {
          let i = 0;
          for (let v of this.data.checkbox.layout) {
            check_arr[i] = [];
            let arr = v.value;
            for (let val of arr) {
              check_arr[i].push(this.chooseArr.find((e) => (e === val)) ? '√' : '-')
            }
            i++
          }
        }
        //手写取的数据就是this.text.split(' ')
        let text_arr = this.text ? this.text.split(',') : [];
        //选号的数据--这个比较复杂  需要遍历
        let arr_ball = []//--是个二维数组
        let i = 0;
        for (let val of this.balls) {
          arr_ball[i] = []
          for (let v of val) {
            v.active && (arr_ball[i].push(v.num))
          }
          i++
        }
        /*
        * 组合之后的数据其实最多只有两组，因为单选只能配一个（手写或者选号）
        * 所以第一个数组就可能是单选的（checkbox），第二个之后的数组就是选号或者手写的数据
        *
         */
        let bigArr = [].concat(check_arr).concat(text_arr).concat(arr_ball)
        //拼接好了，传入到计算注数器中计算
        // let inputFormat=calc._inputFormat
        // 传递的参数是（当前彩种的手写code，三组数据的数组） 如（'CQSSC'，[[1],[2],[3]]）
        //得到的str就是已选中的选号，这个要存起来，方便之后点击立即投注的时候使用
        // let str=calc().inputFormat(this.data.shortname,bigArr)//--其实我觉得这个应该在点击的时候再去计算
        // 然后计算注数  --存起来
        let calc = lottery_calc['lottery_' + this.biggerType]
        this.note = calc().inputNumbers(this.data.shortname, bigArr);
        this.setData({key: 'note', value: this.note})//将注数存在vuex中，方便之后投注时使用
        this.setData({key: 'chooseNumberData', value: bigArr})//将选号数组存在vuex中，当选号的时候，要去计算一下选到了哪些有效号码，在点击投注的时候计算
        this.setData({key: 'shortName', value: this.data.shortname})//将选号数组存在vuex中，当选号的时候，要去计算一下选到了哪些有效号码，在点击投注的时候计算
      },

      init() {
        this.dataInit()
        this.init_currentBonus() //选号区右上角的当前奖金  初始化
        this.data.select && this.buildDataSelect()
        this.data.textarea && this.buildDataTextarea()
        this.data.checkbox && this.buildDataCheckbox()
      },
      dataInit() {
        //初始化  注数  手写   选号  单选框
        this.note = 0
        this.text = ''
        this.balls = []
        this.chooseArr = []
        //相应的vuex数据也要初始化
        this.setData({key: 'note', value: this.note})
        this.setData({key: 'chooseNumberData', value: this.chooseArr})
      }
    },
    created() {
      this.init()
    },
    mounted() {

    },

  }
</script>

<style lang='less' scoped>
  @import "../../css/global.less";

  .chooseNumBox {
    margin-top: 12px;
    border-top: 1px solid @methodBox_bor;
    background: #f6f7f7;
    width: 100%;
    height: fit-content;
    .palyIntroduction {
      height: 34px;
      line-height: 34px;
      color: #666;
      font-size: 14px;
      padding-left: 10px;
      padding-right: 12px;
      position: relative;
      background: #fff;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid @methodBox_bor;
      .left {
        float: left;
        width: calc(~"100% - 240px");
        text-align: left;
        line-height: 18px;
        .symbol {
          color: #FF6A76;
          width: 17px;
          display: inline-block;
          height: 17px;
          line-height: 17px;
        }
        label {
          color: @themeColor;
        }
        .detailedIntroduction {
          position: absolute;
          width: 488px;
          background: url("lotteryImg/bg_play_prompt_kuang.png") no-repeat;
          background-size: 100% 100%;
          line-height: 24px;
          padding: 30px 20px;
          z-index: 22;
          top: 10px;
          left: 10px;
          text-align: left;
          color: @twoMenuColor_Sel;
        }
      }
      .right {
        height: 34px;
        width: auto;
        float: right;
        color: @gameplayColor;
        text-align: left;
        overflow: hidden;
        margin-top: 0px;
        display: flex;
        justify-content: left;
        .symbol {
          width: 16px;
          color: #ACACAC;
          display: inline-block;
          height: 34px;
          line-height: 34px;
          margin-right: 5px;
          overflow: hidden;
        }
        b {
          color: @themeColor;
          font-weight: normal;
          margin-left: 5px;
        }
      }
    }
    /*多选*/
    .chooseNum {
      background: #f8f8f8;
      padding-left: 12px;
      padding-right: 12px;
      -moz-user-select: none; /*火狐*/
      -webkit-user-select: none; /*webkit浏览器*/
      -ms-user-select: none; /*IE10*/
      -khtml-user-select: none; /*早期浏览器*/
      user-select: none;
      position: relative;
      li {
        overflow: auto;
        text-align: left;
        width: 100%;
        /* height: 56px; */
        line-height: 70px;
        display: -ms-flexbox;
        display: flex;
        -ms-flex-align: center;
        align-items: center;
        border-bottom: 1px dashed #EBEBEB;
        color: @chooseNumberBoxColor_Lab;
        &:last-child {
          border: none;
        }
        label {
          display: inline-block;
          float: left;
          width: 7.5%;
          /*color: #666666;*/
          font-size: 14px;
          font-weight: 700;
          text-align: left;
          padding-left: 5px;
        }
        .balls {
          display: inline-block;
          float: left;
          width: 69%;
          display: -ms-flexbox;
          display: flex;
          -ms-flex-align: center;
          align-items: center;
          flex-wrap: wrap;
          span {
            background: #fff;
            border-radius: 20px;
            border: 1px solid #ccc;
            display: inline-block;
            min-width: 36px;
            height: 36px;
            line-height: 34px;
            text-align: center;
            cursor: pointer;
            margin-right: 10px;
            font-size: 18px;
            color: @chooseNumberBoxColor_Sel;
            // margin-bottom: 4px;

            &:hover {
              .bor(@themeColor);
              color: @themeColor;
            }
            &.active {
              color: #fff;
              background: @themeColor;
              border: 0;
              -webkit-animation: ball 0.15s ease-out 0s forwards;
              animation: ball 0.15s ease-out 0s forwards;
            }
            &.zh {
              min-width: 76px;
            }
          }
        }
        .moreBalls {
          padding-top: 16px;
          span {
            margin-bottom: 16px;
          }
        }
        .toools {
          margin-left: 2%;
          display: flex;
          justify-content: space-around;
          float: left;
          width: 24%;
          height: 36px;
          border-radius: 18px;
          .bor(#DDDDDD);
          overflow: hidden;
          background: #fff;
          align-items: center;
          padding-left: 1px;
          span {
            color: @chooseNumberBoxColor_Sel;
            border-radius: 50%;
            display: inline-block;
            width: 28px;
            text-align: center;
            height: 28px;
            line-height: 28px;
            background: #EFEFEF;
            cursor: pointer;
            font-size: 16px;
            &:hover {
              color: #fff;
              border: none;
              background: @themeColor;
            }
          }
        }
        .noTitle {
          margin-left: 10%;
        }
      }
      &.lottery_k3 {
        background: #fff;
        .balls {
          width: 92.5%;
          padding-top: 20px;
          span {
            line-height: 48px;
            min-width: auto;
            width: auto;
            height: 48px;
            border-radius: 6px;
            border: none;
            padding: 5px 10px;
            margin: 0;
            display: flex;
            align-items: center;
            margin-right: 5px;
            margin-bottom: 20px;
            &:hover {
              border: none;
              background: #ffcfd3;
            }
            &.active {
              background: @themeColor;
            }
            .sieveBg {
              display: flex;
              background-size: 100% 100% !important;
              width: 38px;
              height: 38px;
              margin-right: 5px;
              &:last-child {
                margin-right: 0;
              }
            }
            .sieve1 {
              background: url("lotteryImg/ic_dice_1.png") no-repeat;
            }
            .sieve2 {
              background: url("lotteryImg/ic_dice_2.png") no-repeat;
            }
            .sieve3 {
              background: url("lotteryImg/ic_dice_3.png") no-repeat;
            }
            .sieve4 {
              background: url("lotteryImg/ic_dice_4.png") no-repeat;
            }
            .sieve5 {
              background: url("lotteryImg/ic_dice_5.png") no-repeat;
            }
            .sieve6 {
              background: url("lotteryImg/ic_dice_6.png") no-repeat;
            }
            .sieve7 {
              background: url("lotteryImg/ic_dice_7.png") no-repeat;
              width: 70px;
            }
          }
        }

      }
    }
    /*手写*/
    .handwriting {
      height: fit-content;
      padding: 0 10px;
      background: #fff;
      padding-top: 10px;
      textarea {
        width: 100%;
        height: 168px;
        resize: none;
        background: #f8f8f8;
        line-height: 20px;
        font-size: 14px;
        color: #787876;
        padding: 0.5em;
        font-family: Microsoft YaHei, Arial, Helvetica, sans-serif;
        border: 1px solid #e3e3e3;
        overflow: auto;
        .al_scorll();
      }
      .help {
        height: 50px;
        line-height: 50px;
        text-align: left;
        span {
          text-align: center;
          cursor: pointer;
          width: 130px;
          height: 40px;
          float: right;
          color: #666;
          background: #ebebeb;
          border-radius: 20px;
          line-height: 40px;
          margin-top: 5px;
          margin-right: 5px;
          font-size: 14px;
          i {
            font-size: 16px;
            margin-right: 5px;
            vertical-align: bottom;
            color: #ADADAD;
          }
        }
      }
    }
    /*单选*/
    .singleSelect {
      height: 40px;
      width: 100%;
      line-height: 40px;
      background: #fff;
      .singleSelectItem {
        width: 100%;
        display: -ms-flexbox;
        display: flex;
        /*-ms-flex-pack: left;*/
        justify-content: left;
        font-size: 16px;
        > div {
          display: inline-block;
        }
        > label {
          display: inline-block;
          float: left;
          width: 10%;
          color: #666666;
          font-size: 18px;
          font-weight: 700;
          text-align: center;
        }
      }
    }
    .luzhu-open-btn {
      cursor: pointer;
      padding: 3px 10px;
      color: #fff;
      margin: 0 0 0 auto;
      width: 76px;
      background-color: #F53B4A;
      i {
        display: inline-block;
        transition: all 0.3s;
        vertical-align: top;
        top: -2px;
        position: relative;
      }
      &.active i {
        transform: rotate(180deg);
      }
    }
  }

  @media screen and (max-width: 1024px) {
    .chooseNumBox {
      .chooseNum {
        background: #fff;
        border-top: 1px solid @methodBox_bor;
        .balls {
          span {
            min-width: 32px !important;
            height: 32px !important;
            line-height: 32px !important;
          }
        }
        .toools {
          width: 159px !important;
          height: 30px !important;
          span {
            width: 22px !important;
            height: 22px !important;
            line-height: 22px !important;
            font-size: 12px !important;
          }
        }
      }

      .handwriting {
        .help {
          height: 110px;
          span {
            margin-right: calc(~"50% - 65px");
          }
        }
      }
    }
  }
</style>
