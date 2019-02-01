<!-- @format -->

<template>
  <div class="picker-area" @blur="hideList" tabindex="1" id="picker">
    <div class="picker-show">
      <span :class="['picker-province', chooseIndex == 0?'pressActive':'']" 
            :style="{'max-width': maxLen}"
            @click="selectClick(0)" 
            :title="province">{{province}}</span>
      <i v-if='showLevel(2)'>/</i>
      <span :class="['picker-city', chooseIndex  == 1?'pressActive':'']" 
            :style="{'max-width': maxLen}"
            @click="selectClick(1)" v-if='showLevel(2)' 
            :title="city">{{city}}</span>
      <i v-if='showLevel(3)'>/</i>
      <span :class="['picker-county', chooseIndex == 2?'pressActive':'']" 
            @click="selectClick(2)" v-if='showLevel(3)' 
            :title="county"
            :style="{'max-width': maxLen}">{{county}}</span>
      <i v-if='showLevel(4)'>/</i>
      <span :class="['picker-road', chooseIndex == 3?'pressActive':'']" 
            @click="selectClick(3)" v-if='showLevel(4)' 
            :title="road"
            :style="{'max-width': maxLen}">{{road}}</span>
      <em :class="['picker-arrow',showList ?'rorate': '']" @click="showSelect"></em>
    </div>
    <ul class="picker-list" ref="picker-list" v-if="showList && showDataArray.length > 0">
      <li v-for="item in showDataArray" :key="item.code" @click="chooseOption(item.code,item.name)">{{item.name}}</li>
    </ul>
  </div>
</template>
<script>
import locationData from '@/utils/pcas-code.json';
export default {
  name: 'linkarea', // vue component name
  props: {
    //地址编码
    loCode: {
      type: String,
      default: () => null
    },
    //显示的层级
    level: {
      type: Number,
      default: () => 4
    }
  },
  data() {
    return {
      chooseIndex: -1, //对应省市县
      showDataArray: [],
      provinceArray: [],
      cityArray: [],
      countyArray: [],
      roadArray: [],
      province: '请选择省',
      city: '请选择市',
      county: '请选择区',
      road: '请选择街道',
      locationCode: '',
      showList: false,
      maxLen: '80px'
    };
  },
  mounted: function() {
    //动态计算span最大宽度
    let obj = document.getElementById('picker');
    if (obj) {
      let width = obj.offsetWidth;
      width = width > 0 ? (width - 80) / this.LEVEL : 80;
      this.maxLen = width + 'px';
    }
  },
  methods: {
    /**
     * @description 点击span事件
     * @param index 点击顺序
     */
    selectClick(index) {
      switch (index) {
        //选择省
        case 0:
          this.showDataArray = locationData;
          this.provinceArray = this.showDataArray;
          this.selectHandler(index);
          break;
        //选择市
        case 1:
          if (this.locationCode.length > 0) {
            this.reloadData(this.provinceArray, 2);
            this.cityArray = this.showDataArray;
            this.selectHandler(index);
          }
          break;
        //选择区
        case 2:
          if (this.locationCode.length > 2) {
            this.reloadData(this.cityArray, 4);
            this.countyArray = this.showDataArray;
            this.selectHandler(index);
          }
          break;
        //选择街道
        case 3:
          if (this.locationCode.length > 4) {
            this.reloadData(this.countyArray, 6);
            this.roadArray = this.showDataArray;
            this.selectHandler(index);
          }
          break;
        default:
          break;
      }
    },
    /**
     * @description 处理展开操作
     * @param index 点击的顺序
     */
    selectHandler(index) {
      this.chooseIndex = index;
      this.showList = true;
      //增加滚动条置顶
      let pk = this.$refs['picker-list'];
      if (pk) {
        pk.scrollTop = 0;
      }
    },
    /**
     * @description 选中下拉选项
     * @param code 选中值
     * @param areaName 选中名称
     */
    chooseOption(code, areaName) {
      this.locationCode = code;
      switch (this.chooseIndex) {
        //选择省
        case 0:
          this.province = areaName;
          this.cityArray = [];
          this.countyArray = [];
          this.roadArray = [];
          this.city = '请选择市';
          this.county = '请选择区';
          this.road = '请选择街道';
          break;
        //选择市
        case 1:
          this.city = areaName;
          this.countyArray = [];
          this.roadArray = [];
          this.county = '请选择区';
          this.road = '请选择街道';
          break;
        //选择区
        case 2:
          this.county = areaName;
          this.roadArray = [];
          this.road = '请选择街道';
          break;
        //选择街道
        case 3:
          this.road = areaName;
          break;
        default:
          break;
      }
      if (this.chooseIndex == this.LEVEL - 1) {
        this.chooseIndex = -1;
        this.showList = false;
      }
      //模拟下一个点击事件
      if (this.chooseIndex > -1) {
        this.selectClick(this.chooseIndex + 1);
      }
    },
    /**
     * @description 更新下拉列表数据
     * @param arrayData 数据源
     * @param len 截取长度
     */
    reloadData(arrayData, len) {
      let tempArray = [];
      tempArray = arrayData.find(item => {
        return item.code == this.locationCode.substr(0, len);
      });
      this.showDataArray = tempArray.children;
    },
    /**
     * @description 根据编码找到对应地区
     * @param locationCode 地区编码
     */
    findLocation(locationCode) {
      let tempIndex = 0;
      this.provinceArray = locationData;
      if (locationCode.length > 1) {
        tempIndex = locationData.findIndex(item => {
          return item.code == locationCode.substr(0, 2);
        });
        if (tempIndex > -1) {
          this.province = this.provinceArray[tempIndex].name;
          this.cityArray = this.provinceArray[tempIndex].children;
        } else {
          this.province = '请选择省';
          this.cityArray = [];
        }
      }
      if (locationCode.length > 3) {
        tempIndex = this.cityArray.findIndex(item => {
          return item.code == locationCode.substr(0, 4);
        });
        if (tempIndex > -1) {
          this.city = this.cityArray[tempIndex].name;
          this.countyArray = this.cityArray[tempIndex].children;
        } else {
          this.city = '请选择市';
          this.countyArray = [];
        }
      }
      if (locationCode.length > 5) {
        tempIndex = this.countyArray.findIndex(item => {
          return item.code == locationCode.substr(0, 6);
        });
        if (tempIndex > -1) {
          this.county = this.countyArray[tempIndex].name;
          this.roadArray = this.countyArray[tempIndex].children;
        } else {
          this.county = '请选择区';
          this.roadArray = [];
        }
      }
      if (locationCode.length > 8) {
        tempIndex = this.roadArray.findIndex(item => {
          return item.code == locationCode;
        });
        if (tempIndex > -1) {
          this.road = this.roadArray[tempIndex].name;
        } else {
          this.road = '请选择街道';
        }
      }
    },
    /**
     * @description 失焦后隐藏下拉列表
     */
    hideList() {
      this.showList = false;
      this.chooseIndex = -1;
    },
    /**
     * @description 根据level级别显示控件
     * @param level 级别
     * @returns boolean
     */
    showLevel(level) {
      return this.LEVEL >= level;
    },
    /**
     * @description 点击箭头事件
     */
    showSelect() {
      if (this.showList) {
        this.showList = false;
      } else {
        this.selectClick(0);
      }
    }
  },
  watch: {
    /* 将选中的地区值传递给父组件 */
    locationCode(val) {
      let locationStr = '',
        returnObj = {};
      if (val.length > 1) {
        locationStr += this.province;
      }
      if (val.length > 3) {
        locationStr += this.city;
      }
      if (val.length > 5) {
        locationStr += this.county;
      }
      if (val.length > 8) {
        locationStr += this.road;
      }
      returnObj = { name: locationStr, value: val };
      this.$emit('location', returnObj);
    },
    /* 根据传进来的值定位地区 */
    loCode(val) {
      if (val != undefined && val != null && val != '') {
        if (typeof val == 'number') {
          this.locationCode = val.toString();
        } else {
          this.locationCode = val;
        }
        this.findLocation(this.locationCode);
      }
    }
  },
  computed: {
    //过滤level值
    LEVEL() {
      if (this.level < 1 || this.level > 4) {
        return 4;
      } else {
        return Math.round(this.level);
      }
    }
  }
};
</script>

<style scoped>
.picker-area {
  position: relative;
  font-size: 14px;
  background: #fff;
  cursor: default;
  width: 400px;
  border-color: #51afc9;
  outline: none;
}

.picker-show {
  position: relative;
  padding: 0 8px;
  height: 36px;
  line-height: 36px;
  border: 1px solid #dedede;
  border-radius: 3px;
}

.picker-show span {
  float: left;
  display: inline-block;
  height: 24px;
  line-height: 24px;
  padding: 0 3px;
  margin-top: 6px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: #333;
  cursor: pointer;
}

.picker-show span:hover {
  color: #fff;
  border-radius: 3px;
  max-width: 80px;
  background: #51afc9;
}

.picker-show span.pressActive {
  background: #51afc9;
  color: #fff;
  border-radius: 3px;
}

.picker-arrow {
  position: absolute;
  top: 14px;
  right: 8px;
  display: block;
  border: 6px solid #999;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-bottom: 6px solid transparent;
  cursor: pointer;
}

.picker-show i {
  float: left;
  display: inline-block;
  padding: 0 3px;
  color: #333;
  font-style: normal;
}

.picker-list {
  position: absolute;
  line-height: 36px;
  margin: 0;
  padding: 0;
  background: #fff;
  z-index: 100;
  overflow-y: auto;
  overflow-x: hidden;
  border: 1px solid #dedede;
  border-top: none;
  max-height: 240px;
  width: 398px;
}

.picker-list li {
  margin: 0;
  padding-left: 11px;
  list-style: none;
  color: #888;
}

.picker-list li:hover {
  color: #fff;
  font-weight: bold;
  background: #51afc9;
}

/* 滚动条美化样式 */
.picker-list::-webkit-scrollbar {
  width: 10px;
  position: absolute;
  left: 20px;
}
.picker-list::-webkit-scrollbar-track {
  background: #f3f6fb;
  border-radius: 10px;
}
.picker-list::-webkit-scrollbar-thumb {
  background: #6fb7cc;
  border-radius: 10px;
}

.rorate {
  top: 8px;
  right: 8px;
  border: 6px solid #999;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-top: 6px solid transparent;
  cursor: pointer;
}
</style>
