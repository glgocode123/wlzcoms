// JavaScript Document
$(function () {

	"use strict";
	
	function isWeiXin() {
		var ua = window.navigator.userAgent.toLowerCase();
		if (ua.match(/MicroMessenger/i) === 'micromessenger') {
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
		}
		$("#btn-doneBuy").remove();
		$("#btn-resetBuy").remove();
		$("#setBuyInfo").children().eq(1).remove();
		
		//立即支付
		$("#btn-setBuy").on("click",function(){
			$.cookie("wlzBuy" ,buyType , { expires: 1 });
			$.ajaxSettings.async = false;
			$.getJSON('buy.json', function(jsonData){
				if(buyType === "wechat"){
					$(location).attr("href", jsonData.wechat);
				}else if(buyType === "alibuy"){
					$(location).attr("href", jsonData.alibuy);
				}
			});
		});
	}
	//设置购买确认页面
	function setDonePage(){
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
			$(location).attr('href', 'pay.html');
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