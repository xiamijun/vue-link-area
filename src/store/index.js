/** @format */

import Vue from 'vue';
import Vuex from 'vuex';
import user from './modules/user';
import getters from './getters';

import { VUEX_DEFAULT_CONFIG } from '@/config';

Vue.use(Vuex);
// 加入Module state默认就局部化了
// getters actions mutation 默认是全局的 加入namespace:true也可以将它们局部化
export default new Vuex.Store({
  ...VUEX_DEFAULT_CONFIG,
  modules: {
    user
  },
  getters
});
