/** @format */

export default [
  {
    name: 'login',
    method: 'POST',
    desc: '登录',
    path: '/login', // 一定是以 '/' 开头
    params: {
      password: '',
      username: ''
    }
  }
];
