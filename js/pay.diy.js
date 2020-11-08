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
		alert(sourceOrder);
		$("#showInMoney").html(sourceOrder.split("|$|")[0].split("||")[8]);
		if(!isWeiXin()){
			$("div.selectItem ul li a").eq(1).addClass("active");
			buyType = $("div.selectItem ul li a").eq(1).data('name');
			//这个不能在前面，因为0被删除了，1就会在0位
			$("div.selectItem ul li a").eq(0).remove();
		}else{
			buyType = $("div.selectItem ul li a").eq(0).data('name');
			//微信的时候去掉淘宝支付选项
//			$("div.selectItem ul li a").eq(1).remove();
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
		$("#btn-setBuy").remove();
		$("#setBuyInfo").children().eq(0).remove();
	}
	
	
	var sourceOrder = $.cookie("wlzOrder");
	if (sourceOrder === null || sourceOrder === "" || sourceOrder === undefined) {
		$(location).attr("href", "shop.html");
	}else{
		//提取订单cookie并提交？
		//这里应该是：一按支付按钮，就将订单信息提交到服务数据库，但是订单信息的cookie形态可以直接用，需不需要格式化出来？
		//提交信息除了订单详情之外，需不需要订单号和金额？页面中需要金额，只是现实，传参就好
		
		
		
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
		}else if(isWeiXin()&&source==="wechat"){
			$(location).attr("href", "WeChat.html");
		}else{
			setDonePage();
		}
	}
		
});