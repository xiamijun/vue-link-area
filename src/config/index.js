/** @format */

// axios 默认配置
export const AXIOS_DEFAULT_CONFIG = {
  timeout: 20000,
  maxContentLength: 20000,
  headers: {
    // 'Content-Type': 'application/x-www-form-urlencoded'
    'Content-Type': 'application/json' // 跨域的时候会产生 options预检
  },
  // baseURL: 'http://localhost:8080/xiaozhi-back-api' //可以换种写法
  //baseURL: process.env.NODE_ENV !== 'production' ? '/xiaozhi-back-api' : 'http://172.16.130.164:8080/xiaozhi-back-api'
  baseURL: '/xiaozhi-back-api'
  // baseURL: '/'
};

// 开启请求参数打印
export const CONSOLE_REQUEST_ENABLE = true;
// 开启响应参数打印
export const CONSOLE_RESPONSE_ENABLE = true;

// 面包屑的 主页是dashboard
export const HOME_NAME = 'dashboard';

// Router 默认配置
export const ROUTER_DEFAULT_CONFIG = {
  mode: 'history',
  //base: process.env.NODE_ENV !== 'production' ? '/' : '/etsapp/'
  base: '/'
};

// API 默认配置
export const API_DEFAULT_CONFIG = {
  mockBaseURL: 'http://yapi.demo.qunar.com/mock/12982/flytest/v1', // mock地址
  mock: false, // 是否开启mock
  debug: false, // 是否开启debug模式
  sep: '/' // 接口调用分隔符
};

// vuex 默认配置 state 只能在mutation中改变
export const VUEX_DEFAULT_CONFIG = {
  strict: process.env.NODE_ENV !== 'production'
  // strict: false
};
