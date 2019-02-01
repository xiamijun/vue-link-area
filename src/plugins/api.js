/** @format */

import axios from './axios';
import _assign from 'lodash/assign';
import _merge from 'lodash/merge';
// import _isEmpty from 'lodash/isEmpty';

import { assert } from '@/utils';
import { API_DEFAULT_CONFIG, AXIOS_DEFAULT_CONFIG } from '@/config';
import API_CONFIG from '@/api';
/**
 * 生成api接口类
 */
class Api {
  constructor(options) {
    this.api = {};
    this.apiBuilder(options);
  }

  /**
   * 创建工程接口
   * @param sep 分隔符
   * @param config 接口配置对象
   * @param mock 是否开启mock
   * @param debug 是否开启debug模式
   * @param mockBaseURL mock接口地址
   */
  apiBuilder({ sep = '/', config = {}, mock = false, debug = false, mockBaseURL = '' }) {
    Object.keys(config).map(namespace => {
      this._apiSingleBuilder({
        namespace,
        mock,
        mockBaseURL,
        sep,
        debug,
        config: config[namespace]
      });
    });
  }

  /**
   * 创建单个接口
   * @param sep 分隔符
   * @param config 接口配置对象
   * @param mock 是否开启mock
   * @param debug 是否开启debug模式
   * @param mockBaseURL mock接口地址
   */
  _apiSingleBuilder({ namespace, sep = '/', config = {}, mock = false, debug = false, mockBaseURL = '' }) {
    config.forEach(api => {
      const { name, desc, params, method, path } = api;
      let apiname = `${namespace}${sep}${name}`; // 接口调用名称 this.$api['apiname']({参数},{HTTP请求的配置})
      let url = path; // 接口地址
      const baseURL = mock ? mockBaseURL : AXIOS_DEFAULT_CONFIG.baseURL; // 接口base地址

      debug && assert(name, `${url} :接口name属性不能为空`);
      debug && assert(url.indexOf('/') === 0, `${url} :接口路径path，首字符应为/`);
      // value可以使用函数调用符号
      Object.defineProperty(this.api, `${apiname}`, {
        value(outerParams, outerOptions) {
          // let _data = _isEmpty(outerParams) ? params : _pick(_assign({}, params, outerParams), Object.keys(params));
          // 未填的字段 使用默认值 未填的使用默认值
          //todo FormData 则需要手动的设置请求头 Content-type:multipart/form-data
          let _data =
            Array.isArray(outerParams) || outerParams instanceof FormData
              ? outerParams
              : _merge({}, params, outerParams);

          return axios(_normoalize(_assign({ url, desc, baseURL, method }, outerOptions), _data));
        }
      });
    });
  }
}

/**
 * 根据请求类型处理axios参数
 * @param options
 * @param data
 * @returns {*}
 * @private
 */
function _normoalize(options, data) {
  if (options.method === 'POST') {
    // 如果是 application/x-www-form-urlencoded 需要引入qs模块做参数处理
    // options.data = qs.stringifly(data)
    options.data = data;
  } else if (options.method === 'GET') {
    options.params = data;
  }
  return options;
}

/**
 * 导出接口
 */
export default new Api({
  config: API_CONFIG,
  ...API_DEFAULT_CONFIG
})['api'];
