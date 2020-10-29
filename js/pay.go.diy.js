// JavaScript Document
$(function () {

	"use strict";
	
	/*================*/
	/* 功能 - 判断参数是否有内容 */
	/*================*/
	function isNullOrUndefined(obj){
		if(obj===null||obj===undefined||obj===""||obj==="undefined"||obj==="null"){
			return false;
		}else{
			return true;
		}
	}
	
	var wlzBuy = $.cookie("wlzBuy");
	var wlzOrder = $.cookie("wlzOrder");
	
	if(isNullOrUndefined(wlzBuy) || isNullOrUndefined(wlzOrder)){
		$(location).attr("href", "pay.html");
	}

});