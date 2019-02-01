
> A selection box for linkage area which supports four-level at most
>
>  可配置级别地址联动选择框，最大可支持四级地址联动

___

### 一、使用示例

 

![](http://xiejun-image.oss-cn-hangzhou.aliyuncs.com/hexo/linkArea.gif)

### 二、组件功能

- 可根据配置选择联动级别，最大支持四级联动
- 可根据传入地址编码回显地址
- 地址变动时通过location方法监听回传地址对象

### 三、组件参数及事件

**参数**

| 参数   | 说明                                                         | 类型   | 默认值 |
| ------ | ------------------------------------------------------------ | ------ | ------ |
| loCode | 需要回显地址时使用，地址编码必须对应地址的code               | String | null   |
| level  | 显示层级参数，参数无效或者不传时默认显示4级联动，即省、市、区、街道；1级只显示省，2级显示省、市；以此类推。（参数大于1时向下取整，最大为4级） | Number | 4      |

**方法**

**location(data)**  :监听组件地址变化函数，接收object对象，形如{name :'',value:''},其中name对应所选中文地址，value对应地址编码。



### 四、使用方法

```javascript
import linkarea from '@edu/app-linkarea/src/index'
```

```html
<template>
  <linkarea :loCode='1101' :level= 4 @location="location"></linkarea>
</template>
```
