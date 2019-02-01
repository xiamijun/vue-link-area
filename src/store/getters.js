/** @format */
// getter action mutation 默认是在全局的环境下 设置namespace:true可以改变这个情况
const getters = {
  name: state => state.user.userName
};
export default getters;
