<template>
  <div class="shop-container">
    <div>
      <uni-search-bar :radius="100" @confirm="searchGoods" placeholder="搜索"></uni-search-bar>
    </div>
    <div class="shop-menu">
      <scroll-view scroll-y scroll-with-animation class="shop-u-tab-view shop-menu-scroll-view" :scroll-top="scrollTop"
                   :scroll-into-view="itemId">
        <view v-for="(item, index) in goodsList" :key="item.id" class="shop-u-tab-item"
              :class="[current === index ? 'shop-u-tab-item-active' : '']" @tap.stop="switchMenu(index)">
          <text class="u-line-1">{{ item.type_name }}</text>
        </view>
      </scroll-view>
      <scroll-view :scroll-top="scrollRightTop" scroll-y scroll-with-animation class="shop-right-box"
                   @scroll="rightScroll">
        <view class="shop-view">
          <view class="shop-item" :id="'item' + index" v-for="(item , index) in goodsList" :key="index">
            <view class="shop-item-title">
              <text>{{ item.type_name }}</text>
            </view>
            <view class="shop-item-container">
              <view class="shop-thumb-box" v-for="(item1, index1) in item.group" :key="index1"
                    @click="selectGoods(item.type_name, item1)">
                <image class="shop-item-menu-image" :src="item1.image"></image>
                <view class="shop-item-menu-name">{{ item1.type_name }}</view>
              </view>
            </view>
          </view>
        </view>
      </scroll-view>
    </div>
    <div class="navigation">
      <view class="left">
        <view class="item" style="text-align: center">
          <u-icon name="server-fill" :size="40" :color="$u.color['contentColor']"></u-icon>
          <view class="text u-line-1">客服</view>
        </view>
        <view class="item" style="text-align: center">
          <u-icon name="home" :size="40" :color="$u.color['contentColor']"></u-icon>
          <view class="text u-line-1">店铺</view>
        </view>
        <view class="item car" @click="goCart">
          <u-badge class="car-num" :count="shoppingCart" type="error" :offset="[-3, -6]"></u-badge>
          <u-icon name="shopping-cart" :size="40" :color="$u.color['contentColor']"></u-icon>
          <view class="text u-line-1">购物车</view>
        </view>
      </view>
      <view class="right">
        <view class="buy btn u-line-1">立即购买</view>
      </view>
    </div>
    <div>
      <u-tabbar :list="tabBarList" active-color="#5098ff" :border-top="true"
                inactive-color="#bfbfbf" height="45px"></u-tabbar>
    </div>
    <u-toast ref="shopToast"/>
    <u-modal v-model="goodsContentShow" :show-title="false" :show-confirm-button="false" mask-close-able>
      <div class="shop-goodsContent">
        <div class="shop-goodsContent-title">
          <p>{{ typeName2 }}</p>
        </div>
        <div class="shop-goodsContent-detail">
          <p class="shop-goodsContent-info">品牌</p>
          <u-radio-group v-model="radioValue">
            <u-radio @change="radioChange(item.count, item.price)" v-for="(item, index) in radioList" :key="index" :name="item.name">
              {{ item.name }}
            </u-radio>
          </u-radio-group>
          <div v-if="goodsType === 0">
            <p class="shop-goodsContent-info">规格</p>
            <u-radio-group v-model="size" width="50%">
              <u-radio v-for="(item, index) in sizeList" :key="index" :name="item.name">
                {{ item.name }}
              </u-radio>
            </u-radio-group>
          </div>
          <div v-else-if="goodsType === 1">
            <p class="shop-goodsContent-info">规格</p>
            <u-radio-group v-model="size" width="50%">
              <u-radio v-for="(item, index) in speciesList" :key="index" :name="item.name">
                {{ item.name }}
              </u-radio>
            </u-radio-group>
          </div>
          <p class="shop-goodsContent-info">数量</p><span>{{ count }}</span>
          <div class="uni-row uni-flex between" style="margin-top: 5%">
            <div class="text shop-goodsContent-price">
              <span>入手价 </span><span>￥</span><span>{{ price }}</span>
            </div>
            <div class="text" style="margin-top: 3%;">
              <u-button size="mini" type="warning" @click="addGoods">
                <u-icon name="plus" size="24" style="padding-bottom: 1px"></u-icon>
                加入购物车
              </u-button>
            </div>
          </div>
        </div>
      </div>
    </u-modal>
    <u-toast ref="shopToast"/>
  </div>
</template>

<script>
import {mapMutations, mapState} from 'vuex';

export default {
  data() {
    return {
      sizeList: [{name: 'S'}, {name: 'M'}, {name: 'L'}, {name: 'XL'}, {name: 'XXL'}],
      speciesList: [{name: '小'}, {name: '中'}, {name: '大'}],
      arr: [], // 右侧菜单每个item到顶部的距离的集合数组
      current: 0, // 当前项的值
      scrollTop: 0, // 左侧tab标题的滚动条位置
      scrollRightTop: 0, // 右侧商品种类的滚动条位置
      menuHeight: 0, // 左侧菜单的高度
      menuItemHeight: 0, // 左侧菜单item的高度
      itemId: '', // 右侧商品种类用于滚动的id
      goodsContentShow: false, // 商品详细信息弹出层
      typeName1: '',
      typeName2: '',
      radioValue: '',
      price: 0,
      count: 0,
      size: '',
      goods: {},
      goodsType: 0
    }
  },

  computed: {
    /*
    * 获取vuex中的state属性里的共有数据
    * */
    ...mapState(['tabBarList', 'goodsList', 'clickedGrid', 'selectTypeGoods', 'radioList', 'shoppingCart'])
  },

  methods: {
    /*
    * 按需获取mutations的方法
    * */
    ...mapMutations(['selectAll', 'setClickedGrid', 'selectType', 'clearRadioList', 'addGoodsList', 'shoppingCartAdd']),

    /**
     * 搜索商品
     * @param {Object} res
     */
    searchGoods(res) {
      console.log(res.value);
    },

    /**
     * 监听切换左侧tab
     * @param {number} index
     */
    async switchMenu(index) {
      // 尚未滚动且初次切换左侧tab时，计算高度
      if (this.arr.length === 0) await this.getMenuItemTop();
      if (index === this.current) return;
      this.scrollRightTop = this.oldScrollTop;
      // 异步任务，最后执行，由于点击导致页面Dom变化时才会执行，所以点击同一个tab时不会执行
      this.$nextTick(() => {
        this.scrollRightTop = this.arr[index];
        this.current = index;
        this.leftMenuStatus(index);
      })
    },

    /**
     * 获取一个目标元素的高度
     * @param {*} elClass
     * @param {string|number} dataVal
     */
    getElRect(elClass, dataVal) {
      new Promise(resolve => {
        // 初始化一个对象实例，可以使用select等方法选择节点
        const query = uni.createSelectorQuery().in(this);
        query.select('.' + elClass).fields({size: true}, res => {
          // 如果节点尚未生成，res(对象)值为null，循环调用执行
          if (!res) {
            setTimeout(() => this.getElRect(elClass), 10);
            return;
          }
          this[dataVal] = res.height;
          resolve();
        }).exec();
      });
    },

    /**
     * 设置左侧菜单的滚动状态
     * @param {number} index
     */
    async leftMenuStatus(index) {
      this.current = index;
      // 如果为左侧菜单和左侧菜单item的高度存在为0，意味着尚未初始化
      if (this.menuHeight == 0 || this.menuItemHeight == 0) {
        await this.getElRect('shop-menu-scroll-view', 'menuHeight');
        await this.getElRect('shop-u-tab-item', 'menuItemHeight');
      }
      // 将左侧菜单活动的item垂直居中
      this.scrollTop = index * this.menuItemHeight + this.menuItemHeight / 2 - this.menuHeight / 2;
    },

    /**
     * 获取右侧菜单每个item到顶部的距离
     */
    getMenuItemTop() {
      new Promise(resolve => {
        // 初始化一个对象实例，可以使用select等方法选择节点
        const selectorQuery = uni.createSelectorQuery();
        // boundingClientRect返回的值包含了选择出的Dom元素的宽、高、id、dataset等一系列属性值
        selectorQuery.selectAll('.shop-item').boundingClientRect((rects) => {
          // 如果节点尚未生成，rects值为[](因为用selectAll，所以返回的是数组)，循环调用执行
          if (!rects.length) {
            setTimeout(() => this.getMenuItemTop(), 10);
            return;
          }
          rects.forEach((rect) => {
            // 这里减去rects[0].top，是因为第一项顶部可能不是贴到导航栏(比如有个搜索框的情况)
            this.arr.push(rect.top - rects[0].top);
            resolve();
          });
          // 执行所有请求
        }).exec();
      });
    },

    /**
     * 右侧菜单滚动
     * @param e
     * @returns {Promise<void>}
     */
    async rightScroll(e) {
      this.oldScrollTop = e.detail.scrollTop;
      // 尚未切换左侧tab且初次滚动时，计算高度
      if (this.arr.length === 0) await this.getMenuItemTop();
      if (this.timer) return;
      // 如果尚未初始化左侧菜单高度，则在此进行计算
      if (!this.menuHeight) await this.getElRect('shop-menu-scroll-view', 'menuHeight');
      // 节流
      setTimeout(() => {
        this.timer = null;
        // scrollHeight为右侧菜单垂直中点位置
        let scrollHeight = e.detail.scrollTop + this.menuHeight / 2;
        for (let i = 0; i < this.arr.length; i++) {
          let height1 = this.arr[i]; // 左侧菜单前一项
          let height2 = this.arr[i + 1]; // 左侧菜单后一项
          // 如果不存在height2，意味着数据循环已经到了最后一个，设置左侧菜单为最后一项即可
          if (!height2 || scrollHeight >= height1 && scrollHeight < height2) {
            this.leftMenuStatus(i);
            return;
          }
        }
      }, 10);
    },

    /**
     * 选择详细商品
     */
    selectGoods(typeName1, obj) {
      if (obj.pid === 89) this.goodsType = 0;
      if (obj.pid === 104) this.goodsType = 1;
      this.clearRadioList();
      this.radioValue = '';
      this.size = '';
      this.price = 0;
      this.count = 0;
      this.goods = obj;
      this.typeName1 = typeName1, this.typeName2 = obj.type_name;
      this.selectType([obj.id, this]);
      this.goodsContentShow = !this.goodsContentShow;
    },

    /**
     * 添加至购物车
     */
    addGoods() {
      if (this.radioValue === '') {
        this.$refs.shopToast.show({title: '请选择品牌！', type: 'error', duration: 1000});
        return;
      }
      if (this.size === '') {
        this.$refs.shopToast.show({title: '请选择规格！', type: 'error', duration: 1000});
        return;
      }
      this.shoppingCartAdd();
      this.addGoodsList([this.radioValue, this.size, this.price, this.typeName1, this.typeName2]);
    },

    /**
     * 品牌挑选
     * @param {Array} e
     */
    radioChange(...e) {
      this.count = e[0];
      this.price = e[1];
    },

    /**
     * 跳转至购物车页面
     */
    goCart(){
      uni.navigateTo({url: '../cart/cart'});
    }
  },

  onLoad() {
    /*
    * 页面加载初显示两层商品类别
    * */
    this.selectAll(this);
  },

  onShow() {
    /*
    * 跳转至指定的左侧tab
    * */
    this.getMenuItemTop();
    this.switchMenu(this.clickedGrid);
  },

  mounted() {
    /*
    * 跳转至指定的左侧tab
    * */
    this.switchMenu(this.clickedGrid);
  },

  onHide() {
    /**
     * 保存最新的左侧tab
     */
    this.setClickedGrid(this.current);
  }
}
</script>

<style lang="scss">
.shop-menu {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.shop-u-tab-view {
  width: 110px;
  height: calc(77vh - var(--window-top));
}

.shop-u-tab-item {
  height: 60px;
  background: #f6f6f6;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: #444;
  font-weight: 400;
  line-height: 1;
}

.shop-u-tab-item-active {
  position: relative;
  color: #000;
  font-size: 16px;
  font-weight: 600;
  background: #fff;
}

.shop-u-tab-item-active::before {
  content: "";
  position: absolute;
  border-left: 5px solid $u-type-primary;
  height: 20px;
  left: 0;
  top: 21.5px;
}

.shop-right-box {
  background-color: rgb(250, 250, 250);
  height: calc(77vh - var(--window-top));
}

.shop-view {
  padding: 10px;
}

.shop-item {
  margin-bottom: 18px;
  background-color: #fff;
  padding: 5px;
  border-radius: 8px;
}

.shop-item:last-child {
  min-height: 100vh;
}

.shop-item-title {
  font-size: 14.5px;
  color: $u-main-color;
  font-weight: bold;
}

.shop-item-container {
  display: flex;
  flex-wrap: wrap;
}

.shop-thumb-box {
  width: 33.333333%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  margin-top: 12px;
}

.shop-item-menu-image {
  border-radius: 35px;
  width: 70px;
  height: 70px;
  margin: 5px 0;
}

.shop-item-menu-name {
  font-weight: normal;
  font-size: 16px;
  color: $u-main-color;
}

.shop-goodsContent {
  padding: 16px;
}

.shop-goodsContent-title {
  font-size: 18px;
  font-weight: 900;
  letter-spacing: 1px;
}

.shop-goodsContent-detail {
  margin-top: 2%;
}

.shop-goodsContent-info {
  margin-top: 4%;
  color: #909399;
  font-size: 14px;
}

.shop-goodsContent-price span:last-child {
  font-size: 24px;
  letter-spacing: 1px;
  font-weight: 900;
}

.navigation {
  position: absolute;
  bottom: 35px;
  display: flex;
  border: solid 1px #f2f2f2;
  background-color: #ffffff;
  padding: 10px 0;

  .left {
    display: flex;
    font-size: 12px;

    .item {
      margin: 0 25px;

      &.car {
        text-align: center;
        position: relative;

        .car-num {
          position: absolute;
          top: -10rpx;
          right: -10rpx;
        }
      }
    }
  }

  .right {
    margin-left: 23.5px;
    display: flex;
    font-size: 20px;
    align-items: center;

    .btn {
      line-height: 45px;
      padding: 0 20px;
      border-radius: 25px;
      color: #ffffff;
    }

    .buy {
      background-color: #ff7900;
    }
  }
}
</style>