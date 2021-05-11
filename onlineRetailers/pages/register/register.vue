<template>
  <div class="register-container">
    <u-top-tips ref="registerTips"></u-top-tips>
    <div>
      <u-form ref="registerForm" label-position="top">
        <u-form-item label="用户名">
          <u-input v-model="registerMsg.username" type="text" :clearable="true" placeholder="请输入用户名"
                   :border="true"></u-input>
        </u-form-item>
        <u-form-item label="密码" class="password">
          <u-input v-model="registerMsg.password" type="password" :clearable="true" placeholder="请输入密码"
                   :border="true"></u-input>
        </u-form-item>
        <u-form-item label="确认密码" class="password">
          <u-input v-model="registerMsg.confirmPassword" type="password" :clearable="true" placeholder="请再次输入密码"
                   :border="true"></u-input>
        </u-form-item>
        <u-form-item label="昵称">
          <u-input v-model="registerMsg.name" type="text" :clearable="true" placeholder="请输入昵称"
                   :border="true"></u-input>
        </u-form-item>
        <u-form-item label="性别">
          <u-input v-model="registerMsg.sex" type="select" placeholder="请输入性别" :border="true" :select-open="sexShow"
                   @click="sexShow = !sexShow"></u-input>
          <u-action-sheet :list="sexList" v-model="sexShow" @click="selectSex"></u-action-sheet>
        </u-form-item>
        <u-form-item label="年龄">
          <u-input v-model="registerMsg.age" type="text" :clearable="true" placeholder="请输入年龄" :border="true"></u-input>
        </u-form-item>
        <u-form-item label="选择头像">
          <u-upload :action="uploadImageUrl" @on-success="getImage" max-count="1"></u-upload>
        </u-form-item>
      </u-form>
      <u-button type="success" shape="circle" @click="submit">提交</u-button>
    </div>
  </div>
</template>

<script>
import {mapMutations, mapState} from "vuex";

export default {
  data() {
    return {
      registerMsg: {username: '', password: '', confirmPassword: '', name: '', sex: '', age: '', image: ''},
      sexList: [{text: '男'}, {text: '女'}],
      sexShow: false
    }
  },

  computed: {
    /*
    * 获取vuex中的state属性里的共有数据
    * */
    ...mapState(['uploadImageUrl'])
  },

  methods: {
    /*
    * 按需获取mutations的方法
    * */
    ...mapMutations(['registerUser']),

    /*
    * 确认选择的性别
    * */
    selectSex(index) {
      this.registerMsg.sex = this.sexList[index].text;
    },

    /*
    * 提交注册信息
    * */
    submit(){
      this.registerUser([this.registerMsg, this]);
    },

    /**
     * 获得上传成功后的图片链接
     * @param res
     */
    getImage(res){
      this.registerMsg.image = res.data;
    }
  }
}
</script>

<style>
page {
  background-color: #f7f7f7;
}

.register-container {
  width: 80%;
  margin: 0 auto;
}

.u-input__right-icon {
  padding-top: 7px !important;
}

.password .u-input__right-icon{
  display: flex;
}
</style>