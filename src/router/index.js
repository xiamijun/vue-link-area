/** @format */

import Vue from 'vue';
import Router from 'vue-router';

import { routerMap } from './modules/module-one';
import { ROUTER_DEFAULT_CONFIG } from '@/config';

Vue.use(Router);

let routerInstance = new Router({
  ...ROUTER_DEFAULT_CONFIG,
  routes: routerMap
});

export default routerInstance;
