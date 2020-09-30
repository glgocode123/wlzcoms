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
	}else{
		$(location).attr("href", "404.html");
	}
	
	var sourceOrder = $.cookie("wlzOrder");
	if (sourceOrder === null || sourceOrder === "" || sourceOrder === undefined) {
		$(location).attr("href", "404.html");
	}else{
		var source = $.cookie("wlzBuy");
		if (source === null || source === "" || source === undefined) {
			$(location).attr("href", "pay.html");
		}else{
			//已完成支付
			$("#btn-doneBuy").on("click",function(){
				$.removeCookie("wlzOrder");
				$.removeCookie("wlzBuy");
				$(location).attr("href", "i.html");
			});
			//遇到问题
			$("#btn-resetBuy").on("click",function(){
	//			$.removeCookie("wlzBuy");
				$(location).attr('href', 'contact.html');
			});
		}
		
	}
		
});