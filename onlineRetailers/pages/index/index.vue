<template>
  <div class="index-container">
    <div class="uni-flex uni-row" style="-webkit-justify-content: space-between;justify-content: space-between;">
      <div class="text">
        <u-popup v-model="popupShow" width="60%">
          <div class="index-popup">
            <image :src="userInfo.image" alt="" class="index-popup-image"/>
            <text class="index-popup-username">{{ userInfo.name }}</text>
            <div class="index-popup-buttons">
              <u-button type="warning" @click="share" size="default" shape="circle">
                <u-icon name="share" style="margin-right: 10px;"></u-icon>
                分享给好友
              </u-button>
              <u-button type="primary" size="default" shape="circle">
                <u-icon name="integral" style="margin-right: 10px;"></u-icon>
                供应商招募
              </u-button>
              <u-button type="success" size="default" shape="circle">
                <u-icon name="order" style="margin-right: 10px;"></u-icon>
                服务经理报名
              </u-button>
            </div>
          </div>
        </u-popup>
        <u-icon name="list" size="40" @click="popupShow = !popupShow"></u-icon>
      </div>
      <div class="text">
        <u-popup v-model="popupRightShow" width="80%" mode="right">
          <div class="index-popup-right">
            <uni-list>
              <uni-list-item title="勿扰模式" :showSwitch="true" :switchChecked="notDisturb"
                             @switchChange="disturbChange"></uni-list-item>
              <uni-list-item title="新消息提醒" :showSwitch="true" :switchChecked="newsAlert" :disabled="notDisturb"
                             @switchChange="newsChange"></uni-list-item>
              <uni-list-item title="铃声提醒" :showSwitch="true" :switchChecked="ringsAlert"
                             :disabled="!newsAlert || notDisturb" @switchChange="ringsChange"></uni-list-item>
              <uni-list-item title="震动提醒" :showSwitch="true" :switchChecked="shockAlert"
                             :disabled="!newsAlert || notDisturb" @switchChange="shockChange"></uni-list-item>
            </uni-list>
          </div>
        </u-popup>
        <u-icon name="setting" size="40" @click="popupRightShow = !popupRightShow"></u-icon>
      </div>
    </div>
    <div class="index-swiper">
      <u-swiper :list="imageList" effect3d mode="none" title bg-color="#f6f6f6"></u-swiper>
    </div>
    <div class="index-allGoods">
      <u-grid :col="5">
        <u-grid-item v-for="(item, index) in goodsList" @click="gridClick(index)" :index="item.id"
                     style="background-color: #f6f6f6">
          <image :src="item.image"/>
          <view class="grid-text">{{ item.type_name }}</view>
        </u-grid-item>
      </u-grid>
    </div>
    <div class="index-otherFunc">
      <view>
        <u-row gutter="40">
          <u-col span="3" v-for="(item, index) in otherFuncList">
            <view class="index-otherFunc-bg">
              <div class="uni-flex uni-row center">
                <image :src="item.image" style="width: 30px;height: 30px"/>
              </div>
              <div class="uni-flex uni-row center">
                <p>{{ item.title }}</p>
              </div>
            </view>
          </u-col>
        </u-row>
      </view>
    </div>
    <div class="index-introduce">
      <image></image>
    </div>
    <div>
      <u-tabbar :list="tabBarList" active-color="#5098ff" :border-top="true"
                inactive-color="#bfbfbf" height="45px"></u-tabbar>
    </div>
    <uni-popup ref="sharePopup" type="share">
      <uni-popup-share title="分享到"></uni-popup-share>
    </uni-popup>
    <u-toast ref="indexToast"/>
  </div>
</template>

<script>
import {mapState, mapMutations} from 'vuex';

export default {
  data() {
    return {
      imageList: [
        {image: '../../static/images/swiper1.jpg', title: '恒爱耀圣诞,真情暖人心'},
        {image: '../../static/images/swiper2.jpg', title: '妈咪的爱'},
        {image: '../../static/images/swiper3.jpg', title: '缤纷冬季,温暖低价,全场清仓'},
        {image: '../../static/images/swiper4.jpg', title: '不再等待，全场折扣'}
      ],
      otherFuncList: [
        {image: '../../static/icons/card.png', title: '一卡通吃'},
        {image: '../../static/icons/pointShop.png', title: '积分商城'},
        {image: '../../static/icons/games.png', title: '小游戏'}
      ],
      popupShow: false,
      popupRightShow: false,
      notDisturb: false,
      newsAlert: true,
      ringsAlert: false,
      shockAlert: true
    }
  },

  computed: {
    /*
    * 获取vuex中的state属性里的共有数据
    * */
    ...mapState(['tabBarList', 'selectAllUrl', 'goodsList', 'userInfo', 'clickedGrid'])
  },

  methods: {
    /*
    * 按需获取mutations的方法
    * */
    ...mapMutations(['selectAll', 'setClickedGrid']),

    /*
    * 实现宫格点击监听
    * */
    gridClick(index) {
      this.setClickedGrid(index);
      uni.switchTab({url: '/pages/shop/shop'})
    },

    /*
    * 监听勿扰模式
    * */
    disturbChange() {
      this.notDisturb = !this.notDisturb;
      if (this.notDisturb) this.newsAlert = this.ringsAlert = this.shockAlert = false;
    },

    /*
    * 监听新消息提醒
    * */
    newsChange() {
      this.newsAlert = !this.newsAlert;
      if (!this.newsAlert) this.ringsAlert = this.shockAlert = false;
    },

    /*
    * 监听铃声消息提醒
    * */
    ringsChange() {
      if (this.newsAlert) this.ringsAlert = !this.ringsAlert;
    },

    /*
    * 监听震动消息提醒
    * */
    shockChange() {
      if (this.newsAlert) this.shockAlert = !this.shockAlert;
    },

    /**
     * 弹出分享底部弹窗
     */
    share() {
      this.popupShow = !this.popupShow;
      this.$refs.sharePopup.open();
    }
  },

  onLoad() {
    /*
    * 页面加载初显示所有商品类别
    * */
    this.selectAll(this);
  }
}
</script>

<style>
page {
  background-color: #f7f7f7;
}

.index-container {
  padding: 0 4%;
}

.index-popup {
  margin-top: 60%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.index-popup-image {
  width: 60px;
  height: 60px;
  border-radius: 30px;
  border: 1px solid #909399;
}

.index-popup-username {
  margin-top: 8%;
  font-size: 22px;
  letter-spacing: 1px;
}

.index-popup-buttons {
  width: 90%;
  margin: 0 auto;
  margin-top: 10%;
}

.index-popup-buttons button {
  margin-bottom: 8%;
}

.index-popup-right {
  margin-top: 20%;
}

.index-swiper {
  margin-top: 5%;
}

.index-allGoods {
  margin-top: 5%;
}

.index-allGoods image {
  width: 40px;
  height: 40px;
  border-radius: 20px;
}

.index-otherFunc {
  margin-top: 5%;
}

.index-otherFunc view {
  margin: 0 auto;
}

.index-otherFunc-bg {
  padding-top: 20%;
  background: #ffffff;
  height: 70px;
  border-radius: 14px;
  box-shadow: 2px 2px 5px #909399;
}
</style>