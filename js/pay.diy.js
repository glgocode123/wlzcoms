// JavaScript Document
$(function () {

	"use strict";
	
	function isWeiXin() {
		var ua = window.navigator.userAgent.toLowerCase();
//		if (ua.match(/microMessenger/i) === 'micromessenger') {
		if(ua.indexOf('micromessenger') !== -1){
			return true;
		} else {
			return false;
		}
	}
	//设置购买页面
	function setBuyPage(){
		if(!isWeiXin()){
			$("div.selectItem ul li a").eq(1).addClass("active");
			buyType = $("div.selectItem ul li a").eq(1).data('name');
			//这个不能在前面，因为0被删除了，1就会在0位
			$("div.selectItem ul li a").eq(0).remove();
		}else{
			buyType = $("div.selectItem ul li a").eq(0).data('name');
		}
		$("#btn-doneBuy").remove();
		$("#btn-resetBuy").remove();
		$("#setBuyInfo").children().eq(1).remove();
		
		//立即支付
		$("#btn-setBuy").on("click",function(){
			$.cookie("wlzBuy" ,buyType , { expires: 1 });
			if(buyType === "wechat"){
				$(location).attr("href", "WeChat.html");
			}else if(buyType === "alibuy"){
				$(location).attr("href", "https://qr.alipay.com/fkx19379iotrdyu0y2kqy01");
			}
		});
	}
	//设置购买确认页面
	function setDonePage(){
		if(buyType === "wechat"){
			$(location).attr("href", "WeChat.html");
		}
		$("#btn-setBuy").remove();
		$("#setBuyInfo").children().eq(0).remove();
		//已完成支付
		$("#btn-doneBuy").on("click",function(){
			$.removeCookie("wlzOrder");
			$(location).attr("href", "i.html");
		});
		//重新支付
		$("#btn-resetBuy").on("click",function(){
			$.removeCookie("wlzBuy");
			$(location).attr('href', 'contact.html');
		});
	}
	
	
	var source = $.cookie("wlzBuy");
	var buyType = "";
	if (source === null || source === "" || source === undefined) {
		setBuyPage();
		$("div.selectItem ul li a").on("click",function(){
			if(!$(this).is(".outStock")){
				$(this).parents().siblings().children().removeClass("active");
				$(this).addClass("active");
				buyType = $(this).data('name');
			}
		});
	}else{
		setDonePage();
	}
		
});