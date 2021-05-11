import Vue from 'vue';
import Vuex from 'vuex';
import baseUrl from "../static/js/url";

Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
        tabBarList: [
            {
                iconPath: "home",
                selectedIconPath: "home-fill",
                text: "主页",
                pagePath: "/pages/index/index"
            },
            {
                iconPath: "shopping-cart",
                selectedIconPath: "shopping-cart-fill",
                text: "商城",
                pagePath: "/pages/shop/shop"
            },
            {
                iconPath: "account",
                selectedIconPath: "account-fill",
                text: "我的",
                pagePath: "/pages/user/user"
            }
        ],
        userInfo: {},
        goodsList: [],
        radioList: [],
        selectedGoodsList: [],
        selectAllUrl: `${baseUrl}/CommodityTypeController/select_all_type`,
        selectTypeGoods: `${baseUrl}/CommodityController/find_commodity_by_type_id`,
        uploadImageUrl: `http://zedomi.free.vipnps.vip/fileUpload`,
        loginUrl: `${baseUrl}/userController/select`,
        registerUrl: `${baseUrl}/userController/save`,
        changeInfoUrl: `${baseUrl}/userController/update_detail`,
        changePasswordUrl: `${baseUrl}/userController/update_password`,
        clickedGrid: 0,
        shoppingCart: 0
    },

    mutations: {
        /**
         * 设置点击的宫格
         * @param state
         * @param value
         */
        setClickedGrid(state, value){
            state.clickedGrid = value;
        },

        /**
         * 得到两层商品信息
         * @param state
         * @param _this
         * @returns {Promise<void>}
         */
        async selectAll(state, _this) {
            state.goodsList = [];
            let [error, res] = await uni.request({url: state.selectAllUrl});
            // 输出返回的所有商品信息
            // console.log(res);
            if (res.data.code === 200) res.data.data.forEach((item, index) => state.goodsList.push(item));
            else _this.$refs.indexToast.show({title: '出错了', type: 'error', duration: 1000});
        },

        /**
         * 获取商品品牌
         * @param state
         * @param params
         * @returns {Promise<void>}
         */
        async selectType(state, params){
            state.radioList = [];
            let [error, res] = await uni.request({url: state.selectTypeGoods, data: {type_id: params[0] + ''}});
            // 输出返回的某类商品信息
            // console.log(res);
            if (res.data.code === 200) res.data.data.forEach((item, index) => state.radioList.push(item));
            else params[1].$refs.shopToast.show({title: '出错了', type: 'error', duration: 1000});
        },

        /**
         * 注册用户
         * @param state
         * @param params
         * @returns {Promise<void>}
         */
        async registerUser(state, params) {
            let [error, res] = await uni.request({
                url: state.registerUrl,
                data: params[0]
            });
            // 输出返回的注册的个人信息
            // console.log(res);
            let _this = params[1];
            if (res.data.code === 200) {
                setTimeout(() => {
                    uni.reLaunch({url: '/pages/login/login'})
                }, 1000);
                state.userInfo = res.data.data;
                uni.removeStorage({key: 'username'});
                uni.removeStorage({key: 'password'});
                uni.removeStorage({key: 'status'});
                _this.$refs.registerTips.show({title: '注册成功', type: 'success', duration: 1000});
            } else if (res.data.code === 1001) _this.$refs.registerTips.show({
                title: '该用户名已存在',
                type: 'error',
                duration: 1000
            });
        },

        /**
         * 登录并获取用户信息
         * @param state
         * @param params
         * @returns {Promise<void>}
         */
        async loginRequest(state, params) {
            let [error, res] = await uni.request({
                url: state.loginUrl,
                data: params[0]
            });
            // 输出返回的个人用户信息
            // console.log(res);
            let _this = params[1]
            if (res.data.code === 200) {
                setTimeout(() => uni.switchTab({url: '/pages/index/index'}), 1000);
                state.userInfo = res.data.data;
                // 登录成功后保存账号
                uni.setStorage({key: 'username', data: params[0].username});
                // 设置保存密码之后保存密码和状态
                if (params[2]) {
                    uni.setStorage({key: 'password', data: params[0].password});
                    uni.setStorage({key: 'status', data: params[2]});
                } else {
                    uni.removeStorage({key: 'password'});
                    uni.removeStorage({key: 'status'});
                }
                _this.$refs.loginTips.show({title: '登录成功', type: 'success', duration: 1000});
            } else if (res.data.code === 1001) _this.$refs.loginTips.show({
                title: '密码错误',
                type: 'error',
                duration: 1000
            });
            else if (res.data.code === 1002) _this.$refs.loginTips.show({
                title: '用户不存在',
                type: 'error',
                duration: 1000
            });
        },

        /**
         * 修改个人信息
         * @param state
         * @param _this
         * @returns {Promise<void>}
         */
        async changeInfo(state, _this) {
            let [error, res] = await uni.request({
                url: state.changeInfoUrl,
                data: state.userInfo
            });
            // 输出返回的修改后个人信息
            // console.log(res);
            if (res.data.code === 200) _this.$refs.infoTips.show({title: '修改成功', type: 'success', duration: 1000});
            else if (res.data.code === 1001) _this.$refs.infoTips.show({title: '修改失败', type: 'error', duration: 1000});
        },

        /**
         * 修改密码
         * @param state
         * @param _this
         * @returns {Promise<void>}
         */
        async changePassword(state, _this) {
            let [error, res] = await uni.request({
                url: state.changePasswordUrl,
                data: {username: state.userInfo.username, password: state.userInfo.password}
            });
            // 输出返回的修改后的个人信息
            // console.log(res);
            if (res.data.code === 200) _this.$refs.securityTips.show({title: '修改成功', type: 'success', duration: 1000});
            else if (res.data.code === 1001) _this.$refs.securityTips.show({title: '修改失败', type: 'error', duration: 1000});
        },

        /**
         * 清空单选
         * @param state
         */
        clearRadioList(state){
            state.radioList = [];
        },

        /**
         * 添加至购物车商品列表
         * @param state
         * @param goods
         */
        addGoodsList(state, goods){
            let obj = {name: goods[0], size: goods[1], price: goods[2], parent: goods[3], child: goods[4]};
            state.selectedGoodsList.push(obj);
        },

        /**
         * 清空购物车
         * @param state
         */
        clearGoodsList(state){
            state.selectedGoodsList = [];
        },

        /**
         * 删除购物车物品
         * @param state
         * @param index
         */
        spliceGoodsList(state, index){
            state.selectedGoodsList.splice(index, 1);
        },

        /**
         * 购物车数量增加
         * @param state
         */
        shoppingCartAdd(state){
            state.shoppingCart++;
        },

        /**
         * 购物车数量减少
         * @param state
         */
        shoppingCartSub(state){
            if (state.shoppingCart > 0) state.shoppingCart--;
        }
    },

    actions: {},

    getters: {}
});

export default store;