<template>
  <div>
    <u-navbar title="购物车"/>
    <scroll-view :scroll-top="scrollTop" :scroll-y="true" :scroll-with-animation="true" id="content">
      <uni-swipe-action>
        <uni-swipe-action-item :right-options="options" @click="deleteItem" @change="swipeChange($event, index)"
                               v-for="(item, index) in selectedGoodsList" :key="index"
                               class="history_block">
          <div class="uni-flex uni-row">
            <div class="uni-flex uni-column history_content">
              <div class="text history_title">{{ item.parent }}：{{ item.child }}，品牌：{{ item.name }}</div>
              <div class="uni-flex uni-row">
                <div class="text history_info">尺码：{{ item.size }} 价格：{{ item.price }}</div>
              </div>
            </div>
          </div>
        </uni-swipe-action-item>
      </uni-swipe-action>
    </scroll-view>
    <u-toast ref="cartToast"/>
  </div>
</template>

<script>
import {mapMutations, mapState} from "vuex";

export default {
  data() {
    return {
      options: [
        {
          text: '修改',
          style: {backgroundColor: '#ff9900'}
        },
        {
          text: '删除',
          style: {backgroundColor: '#dd524d'}
        }
      ],
      scrollTop: 0,
      index: 0
    }
  },

  computed: {
    ...mapState(['selectedGoodsList'])
  },

  methods: {
    ...mapMutations(['spliceGoodsList', 'shoppingCartSub']),

    deleteItem(e) {
      if (e.index === 1) this.spliceGoodsList(this.index);
      this.shoppingCartSub();
      this.$refs.cartToast.show({title: '删除成功', type: 'success', duration: 1000});
    },

    swipeChange(e, index) {
      if (e === 'right') this.index = index;
    }
  }
}
</script>

<style>
.history_block {
  background-color: white;
  margin-bottom: 4%;
}

.history_content {
  -webkit-flex: 1;
  flex: 1;
  -webkit-justify-content: space-between;
  justify-content: space-between;
}

.history_title {
  height: 60px;
  text-align: left;
  padding: 7px 0 0 10px;
  font-size: 20px;
  word-break: break-word;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.history_info {
  -webkit-flex: 1;
  flex: 1;
  padding: 0 0 13px 10px;
  font-size: 14px !important;
  color: #9093a6;
}
</style>