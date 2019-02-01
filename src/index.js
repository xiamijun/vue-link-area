/** @format */

import 'iview/src/styles/index.less';
import '@/styles/public.less';

import Vue from 'vue';
import App from './App';

// 导入插件
import plugin from '@/plugins';
import router from '@/router';
import store from '@/store';
import iView from 'iview';

import '@/utils';

Vue.config.productionTip = false;

Vue.use(plugin);
Vue.use(iView);

window.app = new Vue({
  el: '#app',
  store,
  router,
  render: h => h(App)
});
