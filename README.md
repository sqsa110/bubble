# 移动端JQ 滑动插件

dom结构 div > ul > li

###参数列表###
obj   `轮播图盒子 默认是jq调用对象` *非必*
speed `动画时间  默认是1000` *非必*
heightAuto `自适应高度  默认是false` *非必*
heightAuto `自适应高度  默认是false` *非必*
bubbleOff  `冒泡开关  默认是false` *非必*
bubbleOff  `滑动开关  默认是true` *非必*

###方法列表###
setIndex  `设置当前显示index`
getIndex  `读取当前显示index标记`
upIndex   `移动到上一页`
nextIndex `移动到下一页`

###事件列表###
1. touchStartEv       `触摸按下的时候触发obj事件`
2. touchMoveReactEv   `在触摸移动过程中触发一次的移动事件`
3. touchMoveEv        `在触摸移动过程中不断触发的移动事件`
4. touchEndEv         `在触摸抬起时触发的移动事件`
5. before             `在动画开始前触发的移动事件`
6. after              `在动画结束后触发的移动事件`

``` javascript
  var list2 = $('#box2').carousel();
  $('#box2').on('touchStartEv',function(){
    console.log('start');
  });
  $('#box2').on('touchMoveReactEv',function(){
    console.log('move1');
  });
  $('#box2').on('touchMoveEv',function(){
    console.log('move2');
  });
  $('#box2').on('touchEndEv',function(){
    console.log('end');
  });
  $('#box2').on('before',function(){
    console.log('before');
  });
  $('#box2').on('after',function(){
    console.log('fater');
  });
```
