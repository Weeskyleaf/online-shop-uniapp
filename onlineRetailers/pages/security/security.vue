<template>
  <div>
    <u-top-tips ref="securityTips"></u-top-tips>
    <div>
      <uni-list>
        <uni-list-item title="修改密码" showArrow @click="changePwd" link></uni-list-item>
        <uni-list-item title="退出登录" showArrow @click="exit" link>
          <template slot="footer"><p class="info">请谨慎操作</p></template>
        </uni-list-item>
      </uni-list>
    </div>
    <uni-popup ref="passwordPopup" type="dialog">
      <uni-popup-dialog mode="input" title="新密码" @confirm="confirmPwd"></uni-popup-dialog>
    </uni-popup>
    <uni-popup ref="exitPopup" type="dialog">
      <uni-popup-dialog type="warn" content="确认要退出登录吗！" title="警告" @confirm="confirmExit"></uni-popup-dialog>
    </uni-popup>
    <div class="security-button">
      <u-button type="success" @click="savePwd">保存</u-button>
    </div>
  </div>
</template>

<script>
import {mapMutations, mapState} from "vuex";

export default {
  data() {
    return {}
  },

  computed: {
    /*
    * 获取vuex中的state属性里的共有数据
    * */
    ...mapState(['userInfo'])
  },

  methods: {
    /*
    * 按需获取mutations的方法
    * */
    ...mapMutations(['changePassword', 'clearGoodsList']),

    /*
    * 弹出密码弹窗
    * */
    changePwd() {
      this.$refs.passwordPopup.open();
    },

    /*
    * 确认修改密码
    * */
    confirmPwd(done, value) {
      done();
      this.userInfo.password = value;
    },

    /*
    * 保存并修改密码
    * */
    savePwd() {
      this.changePassword(this);
    },

    /*
    * 弹出退出弹窗
    * */
    exit() {
      this.$refs.exitPopup.open();
    },

    /*
    * 确认退出登录
    * */
    confirmExit() {
      this.clearGoodsList();
      uni.reLaunch({url: '/pages/login/login'});
    }
  }
}
</script>

<style>
page {
  background-color: #f7f7f7;
}

.info {
  color: #909399;
}

.security-button {
  margin: 0 auto;
  margin-top: 5%;
  width: 98%;
}
</style>