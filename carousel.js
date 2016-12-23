
/*
 * 轮播图插件   opt.obj 必传   opt.speed  opt.touchOff   Dom结构 div > ul > li
 * 自定义事件   需绑定在opt.obj上
 *             滑动按下自定义事件 touchStartEv    
 *             触发一次滑动移动自定义事件 touchMoveRepeatEv
 *             连续触发滑动移动自定义事件 touchMoveEv
 *             触发滑动结束自定义事件 touchEndEv
 *             动画开始前自定义事件 before
 *             动画结束自定义事件 after
 *             
 */
(function(){
    function Carousel(obj,opt){
        opt = $.extend({
            obj : obj,    //轮播图盒子
            speed : 1000,       //动画时间
            heightAuto : false, //自适应高度
            bubbleOff : false,  //冒泡开关
            moveWidth : 50,     //移动范围判断到下一页
            moveAutoOff : false, //触屏移动开关
            touchOff : true     //滑动开关
        },opt);
        for (var i in opt) {
            this[i] = opt[i];
        }
        this.startX = 0;
        this.disX = 0;
        this.ulL = 0;
        this.$ul = null;
        this.$li = null;
        this.boxW = null;
        this.index = 0;
        this.moveOff = true;
        this.init();
    }

    //初始化元素
    Carousel.prototype.init = function(){
        this.domInit();
        if ( this.touchOff ) {
            this.touch();
        }
        this.resize();
        return this;
    }

    //初始化dom结构
    Carousel.prototype.domInit = function(){
        this.boxW = this.obj.outerWidth(true);
        this.$ul = this.obj.children('ul');
        var $li = this.$ul.children('li');
        this.$li = $li;
        this.obj.css({
            overflow : 'hidden',
            visibility : 'visible',
            position : 'relative',
        });
        this.$ul.css({
            width : $li.length * 100 + '%',
            position : 'relative',
            transitionDuration : '0ms',
            left : this.ulL + 'px',
            padding : '0',
            margin : '0'
        });
        $li.css({
            width : 100 / $li.length + '%',
            display : 'table-cell',
            float : 'left',
            listStyle: 'none',
            paddingLeft : 0,
            paddingRight : 0,
            marginLeft : 0,
            marginRight : 0,
            verticalAlign : 'top'
        });
        return this;
    }

    //监听浏览器分辨率
    Carousel.prototype.resize = function(){
        var Timer;
        var that = this;
        $(window).resize(function(){
            clearTimeout(Timer);
            Timer = setTimeout(function(){
                that.setIndex(that.getIndex());
            },300);
        });
    }

    //读取当前窗口index
    Carousel.prototype.getIndex = function(){
        return this.index;
    }

    //设置当前窗口index
    Carousel.prototype.setIndex = function(i){
        this.index = i;
        this.move(this.index);
    }

    Carousel.prototype.setHeight = function(){
        var boxH = this.$li.eq(this.getIndex()).outerHeight(true);
        this.obj.css('height',boxH + 'px');
        return this;
    }

    //移动动画  传入li index标记
    Carousel.prototype.move = function(index){
        var that = this;
        this.moveOff = false;
        this.boxW = this.obj.outerWidth(true);
        this.beforeFn();
        this.$ul.animate({
                left: -this.boxW *  index,
            },this.speed, function() {
                that.moveEnd(index);
        });
        return this;
    }

    //动画结束函数
    Carousel.prototype.moveEnd = function(index){
        this.ulL =  -this.boxW * index;
        this.moveOff = true;
        this.afterFn();
        if ( this.heightAuto ){
            this.setHeight();
        }
    }

    //初始化滑动事件
    Carousel.prototype.touch = function(){
        this.touchStart();
        this.touchMove();
        this.touchEnd();
        return this;
    }

    //初始化滑动按下事件
    Carousel.prototype.touchStart = function(){
        var that = this;
        this.obj.on('touchstart', function(event) {
            that.touchClick = true;
            that.touchStartFn(event.originalEvent.changedTouches[0].clientX,event)
            if (that.bubbleOff) {
                event.preventDefault();
            }
        });
        return this;
    }

    //初始化滑动移动事件
    Carousel.prototype.touchMove = function(){
        var that = this;
        this.obj.on('touchmove',function(event){
            if (that.touchClick){
                that.touchMoveFn(event.originalEvent.changedTouches[0].clientX,event);
                event.preventDefault();
            }
        });
        return this;
    }

    //初始化滑动结束事件
    Carousel.prototype.touchEnd = function(){
        var that = this;
        this.obj.on('touchend',function(event){
            if (that.touchClick) {
                that.moveRepeatOff = true;
                that.touchEndFn(event.originalEvent.changedTouches[0].clientX,event);
                if (that.bubbleOff) {
                    event.preventDefault();
                }
                this.touchClick = false;
            }
        });
        return this;
    }

    //滑动按下触发函数
    Carousel.prototype.touchStartFn = function(x,ev){
        if (!this.moveOff) { return this; }
        this.moveRepeatOff = true;
        this.touchStartEv(ev);
        this.startX = x;
        return this;
    }

    //滑动移动函数
    Carousel.prototype.touchMoveFn = function(x,ev){
        if (!this.moveOff) { return this; }
        if (this.moveRepeatOff) {
            this.moveRepeatOff = false;
            this.touchMoveRepeatEv(ev);
        }
        
        if (this.moveAutoOff) {
            this.disX = x - this.startX;
            this.$ul.css('left',this.ulL + this.disX + 'px');
        }
        
        this.touchMoveEv(ev);
        return this;
    }

    //滑动结束函数
    Carousel.prototype.touchEndFn = function(x,ev){
        if (!this.moveOff) { return this; }
        if (x - this.startX > this.moveWidth) {
            this.upIndex();
        } else if(x - this.startX < 0 - this.moveWidth) {
            this.nextIndex();
        } else {
            this.move(this.getIndex());
        }
        this.touchEndEv();
        return this;
    }

    //上一页
    Carousel.prototype.upIndex = function(){
        if (0 < this.index){
            this.index--;
        }
        this.move(this.index);
        return this;
    }

    //下一页
    Carousel.prototype.nextIndex = function(){
        if (this.index < this.$li.length - 1){
            this.index++;
        }
        this.move(this.index);
        return this;
    }

    //触发滑动按下自定义事件touchStartEv
    Carousel.prototype.touchStartEv = function(ev){
        this.obj.trigger('touchStartEv',[ev,this,this.getIndex()]);
        return this;
    }

    //触发一次滑动移动自定义事件touchMoveRepeatEv
    Carousel.prototype.touchMoveRepeatEv = function(ev){
        this.obj.trigger('touchMoveReactEv',[ev,this,this.getIndex()]);
        return this;
    }

    //连续触发滑动移动自定义事件touchMoveEv
    Carousel.prototype.touchMoveEv = function(ev){
        this.obj.trigger('touchMoveEv',[ev,this,this.getIndex()]);
        return this;
    }

    //触发滑动结束自定义事件touchEndEv
    Carousel.prototype.touchEndEv = function(ev){
        this.obj.trigger('touchEndEv',[ev,this,this.getIndex()]);
        return this;
    }

    //触发动画开始前自定义事件before
    Carousel.prototype.beforeFn = function(){
        var i = this.getIndex();
        this.obj.trigger('before',[this,i]);
        return this;
    }

    //触发动画结束自定义事件after
    Carousel.prototype.afterFn = function(){
        var i = this.getIndex();
        this.obj.trigger('after',[this,i]);
        return this;
    }

    $.fn.carousel = function(opts){
        return new Carousel(this,opts);
    }
})($)
