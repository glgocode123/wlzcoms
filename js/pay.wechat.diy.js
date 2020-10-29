// JavaScript Document
$(function () {

	"use strict";
	
	function isNullOrUndefined(obj){
		if(obj===null||obj===undefined||obj===""||obj==="undefined"||obj==="null"){
			return false;
		}else{
			return true;
		}
	}
	
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
	if (isNullOrUndefined(sourceOrder)) {
		$(location).attr("href", "shop.html");
	}else{
		var source = $.cookie("wlzBuy");
		if (isNullOrUndefined(source)) {
			$(location).attr("href", "pay.html");
		}
		
	}
		
});