/**
 * Created by CD on 2017/5/24.
 */
(function (window) {
    window.onload = function () {
        //阻止浏览器下拉事件
        document.querySelector('body').addEventListener('touchmove', function (e) {
            e.preventDefault();
        });
        var _x_start,_x_move,left_start,_x_end;
        var touchdiv3=$("#touchdiv3");
        var touchdiv2=$("#touchdiv2");
        var touchdiv1=$("#touchdiv1");
        var monst=$("#monst");
        monst.height($("#cd").height());
        document.querySelector('#touchdiv3').addEventListener("touchstart",function(e)
        {
            _x_start=e.targetTouches[0].pageX;
            left_start=touchdiv3.css("left");
        });
        document.querySelector('#touchdiv3').addEventListener("touchmove",function(e)
        {
            _x_move=e.targetTouches[0].pageX;
            touchdiv3.css("left",parseFloat(_x_move)-parseFloat(_x_start)+parseFloat(left_start)+"px");
        });
        document.querySelector('#touchdiv3').addEventListener("touchend",function(e)
        {
            _x_end=e.changedTouches[0].pageX;
            if(_x_start-_x_end>50){
                touchdiv3.animate({left:'-100%',top:'4%'},"fast","swing",function () {
                    monst.css("z-index",9999);
                    touchdiv3.css("z-index",1);
                    touchdiv1.css("z-index",2);
                    touchdiv2.css("z-index",4);
                });
            }else if(_x_start-_x_end<-50){
                touchdiv3.animate({left:'100%',top:'4%'},"fast","swing",function () {
                    monst.css("z-index",9999);
                    touchdiv3.css("z-index",1);
                    touchdiv1.css("z-index",2);
                    touchdiv2.css("z-index",4);
                });
            }
            if(_x_start-_x_end <-50 || _x_start-_x_end >50){
                touchdiv3.animate({left:'6%',top:'6%'},"fast","swing",function () {
                    monst.css("z-index",3);
                    _x_start = 0;
                    _x_end = 0;
                });
                touchdiv2.animate({left:'2%',top:'2%'},"fast");
                touchdiv1.animate({left:'4%',top:'4%'},"fast");
            }
            if(_x_start-_x_end >=-50 && _x_start-_x_end <=50){
                touchdiv3.animate({left:'2%',top:'2%'},"fast","swing",function () {
                    monst.css("z-index",3);
                    _x_start = 0;
                    _x_end = 0;
                });
            }
        });
        document.querySelector('#touchdiv2').addEventListener("touchstart",function(e)
        {
            _x_start=e.targetTouches[0].pageX;
            left_start=touchdiv2.css("left");
        });
        document.querySelector('#touchdiv2').addEventListener("touchmove",function(e)
        {
            _x_move=e.targetTouches[0].pageX;
            touchdiv2.css("left",parseFloat(_x_move)-parseFloat(_x_start)+parseFloat(left_start)+"px");
        });
        document.querySelector('#touchdiv2').addEventListener("touchend",function(e)
        {
            _x_end=e.changedTouches[0].pageX;
            if(_x_start-_x_end>50){
                touchdiv2.animate({left:'-100%',top:'4%'},"fast","swing",function () {
                    monst.css("z-index",9999);
                    touchdiv2.css("z-index",1);
                    touchdiv3.css("z-index",2);
                    touchdiv1.css("z-index",4);
                });
            }else if(_x_start-_x_end<-50){
                touchdiv2.animate({left:'100%',top:'4%'},"fast","swing",function () {
                    monst.css("z-index",9999);
                    touchdiv2.css("z-index",1);
                    touchdiv3.css("z-index",2);
                    touchdiv1.css("z-index",4);
                });
            }
            if(_x_start-_x_end <-50 || _x_start-_x_end >50){
                touchdiv2.animate({left:'6%',top:'6%'},"fast","swing",function () {
                    monst.css("z-index",3);
                    _x_start = 0;
                    _x_end = 0;
                });
                touchdiv3.animate({left:'4%',top:'4%'},"fast");
                touchdiv1.animate({left:'2%',top:'2%'},"fast");
            }
            if(_x_start-_x_end >=-50 && _x_start-_x_end <=50){
                touchdiv2.animate({left:'2%',top:'2%'},"fast","swing",function () {
                    monst.css("z-index",3);
                    _x_start = 0;
                    _x_end = 0;
                });
            }
        });
        document.querySelector('#touchdiv1').addEventListener("touchstart",function(e)
        {
            _x_start=e.targetTouches[0].pageX;
            left_start=touchdiv1.css("left");
        });
        document.querySelector('#touchdiv1').addEventListener("touchmove",function(e)
        {
            _x_move=e.targetTouches[0].pageX;
            touchdiv1.css("left",parseFloat(_x_move)-parseFloat(_x_start)+parseFloat(left_start)+"px");
        });
        document.querySelector('#touchdiv1').addEventListener("touchend",function(e)
        {
            _x_end=e.changedTouches[0].pageX;
            if(_x_start-_x_end>50){
                touchdiv1.animate({left:'-100%',top:'4%'},"fast","swing",function () {
                    monst.css("z-index",9999);
                    touchdiv1.css("z-index",1);
                    touchdiv2.css("z-index",2);
                    touchdiv3.css("z-index",4);
                });
            }else if(_x_start-_x_end<-50){
                touchdiv1.animate({left:'100%',top:'4%'},"fast","swing",function () {
                    monst.css("z-index",9999);
                    touchdiv1.css("z-index",1);
                    touchdiv2.css("z-index",2);
                    touchdiv3.css("z-index",4);
                });
            }
            if(_x_start-_x_end <-50 || _x_start-_x_end >50){
                touchdiv1.animate({left:'6%',top:'6%'},"fast","swing",function () {
                    monst.css("z-index",3);
                    _x_start = 0;
                    _x_end = 0;
                });
                touchdiv3.animate({left:'2%',top:'2%'},"fast");
                touchdiv2.animate({left:'4%',top:'4%'},"fast");
            }
            if(_x_start-_x_end >=-50 && _x_start-_x_end <=50){
                touchdiv1.animate({left:'2%',top:'2%'},"fast","swing",function () {
                    monst.css("z-index",3);
                    _x_start = 0;
                    _x_end = 0;
                });
            }
        });
    }
})(window);
