import Vue from 'vue'
import App from './App'
import uView from 'uview-ui';
import store from "./store/index";
import Vuex from 'vuex';

Vue.use(Vuex);
Vue.config.productionTip = false;
Vue.use(uView);

App.mpType = 'app'

const app = new Vue({
    ...App,
    store
})
app.$mount()
