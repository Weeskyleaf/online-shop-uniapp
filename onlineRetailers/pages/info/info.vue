<template>
  <div>
    <u-top-tips ref="infoTips"></u-top-tips>
    <div>
      <uni-list>
        <uni-list-item title="头像" showArrow note="点击可修改头像" @click="changeIcon" link>
          <template slot="footer">
            <image :src="userInfo.image" style="width: 60px;height: 60px;"></image>
          </template>
        </uni-list-item>
        <uni-list-item title="昵称" showArrow @click="changeName" link>
          <template slot="footer"><p class="info">{{ userInfo.name }}</p></template>
        </uni-list-item>
        <uni-list-item title="用户名" showArrow @click="changeUsername" link>
          <template slot="footer"><p class="info">{{ userInfo.username }}</p></template>
        </uni-list-item>
        <uni-list-item title="性别" showArrow @click="sexShow = !sexShow" link>
          <template slot="footer"><p class="info">{{ userInfo.sex }}</p></template>
        </uni-list-item>
        <uni-list-item title="年龄" showArrow @click="changeAge" link>
          <template slot="footer"><p class="info">{{ userInfo.age }}</p></template>
        </uni-list-item>
      </uni-list>
    </div>
    <div class="info-other">
      <uni-list>
        <uni-list-item title="我的地址" showArrow @click="addressShow = !addressShow" link></uni-list-item>
      </uni-list>
    </div>
    <uni-popup ref="namePopup" type="dialog">
      <uni-popup-dialog mode="input" title="昵称" @confirm="confirmName"
                        v-model="userInfo.name"></uni-popup-dialog>
    </uni-popup>
    <uni-popup ref="usernamePopup" type="dialog">
      <uni-popup-dialog mode="input" title="用户名" @confirm="confirmUsername"
                        v-model="userInfo.username"></uni-popup-dialog>
    </uni-popup>
    <u-select v-model="sexShow" :list="sexList" @confirm="confirmSex" :default-value="defaultSexIndex"></u-select>
    <uni-popup ref="agePopup" type="dialog">
      <uni-popup-dialog mode="input" title="年龄" @confirm="confirmAge"
                        v-model="userInfo.age"></uni-popup-dialog>
    </uni-popup>
    <u-picker mode="region" v-model="addressShow" @confirm="confirmAddress"></u-picker>
    <div class="info-button">
      <u-button type="success" @click="saveInfo">保存</u-button>
    </div>
  </div>
</template>

<script>
import {mapState, mapMutations} from 'vuex';

export default {
  data() {
    return {
      sexList: [{value: 1, label: '男'}, {value: 0, label: '女'}],
      defaultSexIndex: [],
      sexShow: false,
      addressShow: false
    }
  },

  computed: {
    /*
    * 获取vuex中的state属性里的共有数据
    * */
    ...mapState(['uploadImageUrl', 'userInfo'])
  },

  methods: {
    /*
    * 按需获取mutations的方法
    * */
    ...mapMutations(['changeInfo']),

    /*
    * 更换头像
    * */
    changeIcon() {
      uni.chooseImage({
        count: 1,
        success: (chooseImageRes) => {
          const tempFilePaths = chooseImageRes.tempFilePaths;
          uni.uploadFile({
            url: this.uploadImageUrl,
            filePath: tempFilePaths[0],
            name: 'file',
            success: (uploadFileRes) => this.userInfo.image = JSON.parse(uploadFileRes.data).data
          });
        }
      });
    },

    /*
    * 弹出昵称弹窗
    * */
    changeName() {
      this.$refs.namePopup.open();
    },

    /*
    * 弹出用户名弹窗
    * */
    changeUsername() {
      this.$refs.usernamePopup.open();
    },

    /*
    * 弹出年龄弹窗
    * */
    changeAge() {
      this.$refs.agePopup.open();
    },

    /*
    * 确认修改昵称
    * */
    confirmUsername(done, value) {
      done();
      this.userInfo.username = value;
    },

    /*
    * 确认修改用户名
    * */
    confirmName(done, value) {
      done();
      this.userInfo.name = value;
    },

    /*
    * 确认修改性别
    * */
    confirmSex(e) {
      this.userInfo.sex = e[0].label;
    },

    /*
    * 确认修改年龄
    * */
    confirmAge(done, value) {
      done();
      this.userInfo.age = value;
    },

    /*
    * 确认更改地址
    * */
    confirmAddress(e) {
      console.log(e);
    },

    /*
    * 保存并修改个人信息
    * */
    saveInfo() {
      this.changeInfo(this);
    }
  },

  updated() {
    /*
    * 变更单列选择器的默认选项
    * */
    if (this.userInfo.sex === '男') this.defaultSexIndex = [0];
    else if (this.userInfo.sex === '女') this.defaultSexIndex = [1];
  }
}
</script>

<style>
page {
  background-color: #f7f7f7;
}

.info-other {
  margin-top: 3%;
}

.info {
  color: #909399;
}

.info-button {
  margin: 0 auto;
  margin-top: 5%;
  width: 98%;
}
</style>