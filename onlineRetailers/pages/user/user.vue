<template>
  <div class="user-container">
    <div class="user-info-content">
      <div class="user-info-icon uni-flex uni-row center">
        <image :src="userInfo.image"/>
      </div>
      <div class="uni-flex uni-row center">
        <p>{{ userInfo.name }}</p>
      </div>
    </div>
    <div class="user-info">
      <div class="uni-flex uni-row center user-info-balance-title">
        <div>钱包余额</div>
      </div>
      <div class="uni-flex uni-row center user-info-balance">
        <span>￥</span>
        <p>0.00</p>
      </div>
      <div class="user-info-buttons">
        <div class="uni-flex uni-row" style="-webkit-justify-content: space-between;justify-content: space-between;">
          <u-button shape="circle" size="medium" type="primary">立即充值</u-button>
          <u-button shape="circle" size="medium" type="primary">寻找商店</u-button>
        </div>
      </div>
    </div>
    <div class="user-func">
      <uni-list>
        <uni-list-item title="订单查询" showArrow></uni-list-item>
        <uni-list-item title="个人信息" showArrow link="navigateTo" to="../info/info"></uni-list-item>
      </uni-list>
    </div>
    <div class="user-func">
      <uni-list>
        <uni-list-item title="投诉与建议" showArrow></uni-list-item>
        <uni-list-item title="条款与规则" showArrow></uni-list-item>
        <uni-list-item title="账号与安全" showArrow link="navigateTo" to="../security/security"></uni-list-item>
      </uni-list>
    </div>
    <div>
      <u-tabbar :list="tabBarList" active-color="#5098ff" :border-top="true"
                inactive-color="#bfbfbf" height="45px"></u-tabbar>
    </div>
    <u-toast ref="userToast"/>
  </div>
</template>

<script>
import {mapState} from 'vuex';

export default {
  data() {
    return {}
  },

  computed: {
    /*
    * 获取vuex中的state属性里的共有数据
    * */
    ...mapState(['tabBarList', 'userInfo'])
  },

  methods: {}
}
</script>

<style>
page {
  background-color: #f7f7f7;
}

.user-container {
  padding: 0 4%;
}

.user-info {
  margin-top: 5%;
  height: 170px;
  border-radius: 10px;
  background-color: white;
}

.user-info-content {
  margin-top: 5%;
  border-radius: 10px;
  background-color: white;
  padding: 20px 0;
}

.user-info-icon image {
  width: 80px;
  height: 80px;
  border-radius: 40px;
  border: 1px solid #909399;
}

.user-info-content p {
  font-size: 20px;
  font-weight: 900;
  letter-spacing: 1px;
  margin-top: 15px;
}

.user-info-balance-title {
  padding: 10px;
  font-size: 17px;
}

.user-info-balance {
  font-weight: 900;
}

.user-info-balance span {
  margin-top: 10px;
}

.user-info-balance p {
  font-size: 28px;
  letter-spacing: 2px;
}

.user-info-buttons {
  margin-top: 5%;
}

.user-func {
  background-color: white;
  padding: 5% 5%;
  width: 90%;
  margin-top: 5%;
  border-radius: 10px;
}
</style>