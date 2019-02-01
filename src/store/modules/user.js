/** @format */

const user = {
  state: {
    userName: ''
  },

  // mutation默认是全局的
  mutations: {
    SET_USER_NAME: (state, name) => {
      state.userName = name;
    }
  },

  // actions中可以使用 async函数
  // actions使用 大驼峰命名
  actions: {}
};

export default user;
