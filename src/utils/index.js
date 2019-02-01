/** @format */

HTMLElement.prototype.getOffset = function(stopSelectorElement) {
  let offsetParent = this.offsetParent;
  let top = this.offsetTop,
    left = this.offsetLeft;
  while (offsetParent) {
    top += offsetParent.offsetTop;
    left += offsetParent.offsetLeft;
    offsetParent = offsetParent.offsetParent;
    if (stopSelectorElement && offsetParent === stopSelectorElement) {
      break;
    }
  }
  return {
    top: top,
    left: left,
    width: this.offsetWidth,
    height: this.offsetHeight
  };
};
//日期对象扩展
Date.prototype.format = function(format) {
  let o = {
    'M+': this.getMonth() + 1, //month
    'd+': this.getDate(), //day
    'h+': this.getHours(), //hour
    'm+': this.getMinutes(), //minute
    's+': this.getSeconds(), //second
    'q+': Math.floor((this.getMonth() + 3) / 3), //quarter
    S: this.getMilliseconds() //millisecond
  };
  if (/(y+)/.test(format)) {
    format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
  }
  for (let k in o) {
    if (new RegExp('(' + k + ')').test(format)) {
      format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length));
    }
  }
  return format;
};

export function yesterday() {
  return new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 1);
}

export function isBeyondMonth(startTime, endTime) {
  let sDate = new Date(startTime);
  let eDate = new Date(endTime);

  if (eDate.getFullYear() - sDate.getFullYear() > 1) {
    //先比较年
    return true;
  } else if (eDate.getMonth() - sDate.getMonth() > 1) {
    //再比较月
    return true;
  } else if (eDate.getMonth() - sDate.getMonth() == 1) {
    if (eDate.getDate() - sDate.getDate() >= 1) {
      return true;
    }
  } else if (eDate.getFullYear() - sDate.getFullYear() == 1) {
    if (eDate.getMonth() + 12 - sDate.getMonth() > 1) {
      return true;
    } else if (eDate.getDate() - sDate.getDate() >= 1) {
      return true;
    }
  }
  return false;
}

export function getweek(z) {
  //参数z是"2018-05-07 15:12:36"或者"2018/05/07 15:12:36"
  let day = Date.parse(z);
  let day11 = new Date(day);
  day11.setMonth(0);
  day11.setDate(1);
  day11.setHours(0);
  day11.setMinutes(0);
  day11.setSeconds(0); //到这里就得到该年的一月一日

  let day11mill = day11.getTime();
  let ori_day = day11.getDay(); //该年的一月一日是星期几
  let fill1 = 0; //与星期日相隔的毫秒数
  if (ori_day !== 0) {
    fill1 = ori_day * 60 * 60 * 24 * 1000;
  }

  let now = Date.parse(z);
  now = new Date(now);
  now.setHours(0);
  now.setMinutes(0);
  now.setSeconds(0);
  let nowmill = now.getTime();
  let now_day = now.getDay();
  let fill2 = 0;
  if (now_day !== 0) {
    fill2 = (7 - now_day) * 60 * 60 * 24 * 1000;
  }

  let cha2 = (nowmill - day11mill + fill1 + fill2) / (60 * 60 * 24 * 1000);
  let week = Math.ceil(cha2 / 7);
  if (week < 10) {
    week = '0' + week;
  }
  let year = now.getFullYear().toString();
  year = year.substring(2);
  return week;
}

//防抖
export function debounce(fn, wait) {
  let timer = null;
  return function(...args) {
    let _ctx = this; //保存Vue的this上下文
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(_ctx, args); //剩余参数
    }, wait);
  };
}

//断言的内容
export function assert(condition, msg) {
  if (!condition) throw new Error(`[Apior] ${msg}`);
}

//单例模式  AOP
export function getSingle(fn) {
  let instance = null;
  return function(...args) {
    return instance || (instance = fn.apply(this, args));
  };
}
//节流
export function throttle(fn, wait, time) {
  let previous = null; //记录上一次运行的时间
  let timer = null;

  return function() {
    let now = +new Date();

    if (!previous) previous = now;
    //当上一次执行的时间与当前的时间差大于设置的执行间隔时长的话，就主动执行一次
    if (now - previous > time) {
      clearTimeout(timer);
      fn();
      previous = now; // 执行函数后，马上记录当前时间
    } else {
      clearTimeout(timer);
      timer = setTimeout(function() {
        fn();
      }, wait);
    }
  };
}
//判断空数组，null,undefined,空字符串,空对象
export function isEmpty(obj) {
  //基础数据类型，是非空值
  if (typeof obj === 'boolean' || typeof obj === 'number') {
    return false;
  }
  if (
    obj == '' ||
    obj == null ||
    obj == undefined ||
    (obj && Array.isArray(obj) && !obj.length) ||
    (obj && Object.keys(obj).length === 0)
  ) {
    return true;
  } else {
    return false;
  }
}

//浮动数四舍五入  v表示要保存小数位
export function decimal(num, v) {
  let vv = Math.pow(10, v);
  return Math.round(num * vv) / vv;
}

export const deepFlatten = arr => [].concat(...arr.map(v => (Array.isArray(v) ? deepFlatten(v) : v)));

export function treeToList(routeList) {
  let res = [];
  function foo(nodeData) {
    let { resourceName, resourceUrl, children, actionVOS } = nodeData;
    // 过滤掉 resourceUrl是null的选项
    if (resourceUrl) res.push({ resourceName, resourceUrl, actionVOS });
    // children 挂载的是子节点
    if (!isEmpty(children)) {
      children.forEach(item => {
        foo(item);
      });
    }
  }
  routeList.forEach(item => {
    foo(item);
  });

  return res;
}

/**
 * @param {Array} arr1
 * @param {Array} arr2
 * @description 得到两个数组的交集, 两个数组的元素为数值或字符串
 */
export const getIntersection = (arr1, arr2) => {
  let len = Math.min(arr1.length, arr2.length);
  let i = -1;
  let res = [];
  while (++i < len) {
    const item = arr2[i];
    if (arr1.indexOf(item) > -1) res.push(item);
  }
  return res;
};

/**
 * @param {Array} arr1
 * @param {Array} arr2
 * @description 得到两个数组的并集, 两个数组的元素为数值或字符串
 */
export const getUnion = (arr1, arr2) => {
  return Array.from(new Set([...arr1, ...arr2]));
};

/**
 * @param {Array} target 目标数组
 * @param {Array} arr 需要查询的数组
 * @description 判断要查询的数组是否至少有一个元素包含在目标数组中
 */
export const hasOneOf = (targetarr, arr) => {
  return targetarr.some(_ => arr.indexOf(_) > -1);
};

export const findNodeUpperByClasses = (ele, classes) => {
  let parentNode = ele.parentNode;
  if (parentNode) {
    let classList = parentNode.classList;
    if (classList && classes.every(className => classList.contains(className))) {
      return parentNode;
    } else {
      return findNodeUpperByClasses(parentNode, classes);
    }
  }
};

// 小数转百分比，fixed 保留小数点位数
export const toPercent = (point, fixed) => {
  let str = Number(point * 100).toFixed(fixed);
  str += '%';
  return str;
};

// 转义HTML字符串，防止xss攻击
export const escapeHTML = str =>
  str.replace(
    /[&<>'"]/g,
    tag =>
      ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;'
      }[tag] || tag)
  );
