<template>
  <view>
    <u-top-tips ref="loginTips"></u-top-tips>
    <div class="login-container">
      <div class="login-info">
        <u-form ref="loginForm" label-position="top">
          <u-form-item label="用户名">
            <u-input v-model="loginMsg.username" :clearable="true" placeholder="请输入用户名" :border="true"></u-input>
          </u-form-item>
          <u-form-item label="密码">
            <u-input v-model="loginMsg.password" type="password" :clearable="true" :password-icon="true"
                     placeholder="请输入密码"
                     :border="true"></u-input>
          </u-form-item>
        </u-form>
        <div class="login-func uni-flex uni-row between">
          <div class="text">
            <u-checkbox-group>
              <u-checkbox v-model="saveChecked" active-color="#2979ff" shape="circle">保存密码</u-checkbox>
            </u-checkbox-group>
          </div>
          <div class="text login-forgetPwd">
            <p style="color: #909399">忘记密码？</p>
          </div>
        </div>
        <div class="login-buttons">
          <div>
            <u-button type="success" shape="circle" @click="login">登录</u-button>
          </div>
          <div class="login-register">
            <u-button type="primary" shape="circle" @click="goRegister">注册</u-button>
          </div>
        </div>
      </div>
    </div>
  </view>
</template>

<script>
import {mapMutations} from "vuex";

export default {
  data() {
    return {
      loginMsg: {
        username: '',
        password: ''
      },
      saveChecked: false
    }
  },

  computed: {},

  methods: {
    /*
    * 按需获取mutations的方法
    * */
    ...mapMutations(['loginRequest']),

    /*
    * 点击登录时触发的事件
    * */
    login() {
      this.loginRequest([this.loginMsg, this, this.saveChecked]);
    },

    /*
    * 跳转至注册界面
    * */
    goRegister(){
      uni.navigateTo({url: '../register/register'});
    }
  },

  onLoad() {
    /*
    * 获取保存的账号/密码/保存状态
    * */
    uni.getStorage({key: 'username', success: res => this.loginMsg.username = res.data});
    uni.getStorage({key: 'password', success: res => this.loginMsg.password = res.data});
    uni.getStorage({key: 'status', success: res => this.saveChecked = res.data});
  }
}
</script>

<style>
page {
  background-color: #f7f7f7;
}

.login-container {
  width: 80%;
  margin: 0 auto;
}

.login-info {
  margin-top: 40%;
}

.u-input__right-icon {
  padding-top: 8px !important;
  display: flex;
}

.login-func {
  margin-top: 2%;
}

.login-forgetPwd {
  padding-top: 2px;
}

.login-buttons {
  margin-top: 7%;
}

.login-register {
  margin-top: 8%;
}
</style>