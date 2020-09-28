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
	if(isWeiXin()){
		$.cookie("wlzBuy" ,"wechat" , { expires: 1 });
	}
	
	
	var source = $.cookie("wlzBuy");
	if (source === null || source === "" || source === undefined) {
		
	}else{
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
		
});