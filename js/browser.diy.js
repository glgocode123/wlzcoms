// JavaScript Document
$(function () {

	"use strict";
	
	var iBrowser;
	
	
	function isWap() {
		if (/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)) {
			return true;
		} else {
			return false;
		}
	}

	function isWeiXin() {
		var ua = window.navigator.userAgent.toLowerCase();
		if (ua.match(/MicroMessenger/i) === 'micromessenger') {
			return true;
		} else {
			return false;
		}
	}	
	
	
	/*================*/
	/* 0 - 删除元素 */
	/*================*/
	function removeObject(objectName){
		$(objectName).remove();
	}

	if (isWap() || isWeiXin()) {
		iBrowser = true;//手机浏览器或者微信
		$(".is-mobile").css("display","block");
		removeObject(".is-unmobile");
//		$(".is-mobile").removeClass("hidden");//hidden class
	} else {
		//如果不是手机可显示的页面，跳转回首页
		if ($("div").is(".isMobPage")) {$(location).attr('href', 'index.html');}
		
		iBrowser = false;
		$(".is-mobile").css("display","none");
		removeObject(".is-mobile");
	}
	
	
	
	
	return false;
});
