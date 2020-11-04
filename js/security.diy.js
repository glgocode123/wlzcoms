// JavaScript Document
$(function () {

	"use strict";
	
//	history.pushState(null, null, document.URL);
//	window.addEventListener("popstate", function(){
//		history.pushState(null, null, document.URL);
//	});
//	
//	function forbidBackSpace(e) {
//		var ev = e || window.event; //获取event对象    
//		var obj = ev.target || ev.srcElement; //获取事件源    
//		var t = obj.type || obj.getAttribute('type'); //获取事件源类型    
//		//获取作为判断条件的事件类型    
//		var vReadOnly = obj.readOnly;
//		var vDisabled = obj.disabled;
//		//处理undefined值情况    
//		vReadOnly = (vReadOnly === undefined) ? false : vReadOnly;
//		vDisabled = (vDisabled === undefined) ? true : vDisabled;
//		//当敲Backspace键时，事件源类型为密码或单行、多行文本的，    
//		//并且readOnly属性为true或disabled属性为true的，则退格键失效    
//		var flag1 = ev.keyCode === 8 && (t === "password" || t === "text" || t === "textarea") && (vReadOnly === true || vDisabled === true);
//		//当敲Backspace键时，事件源类型非密码或单行、多行文本的，则退格键失效    
//		var flag2 = ev.keyCode === 8 && t !== "password" && t !== "text" && t !== "textarea";
//		//判断    
//		if (flag2 || flag1) { return false; }
//	}
//	//禁止后退键 作用于Firefox、Opera   
//	document.onkeypress = forbidBackSpace;
//	//禁止后退键  作用于IE、Chrome   
//	document.onkeydown = forbidBackSpace; 
	
	
	
	
//    var system = {
//        win: false,
//        mac: false,
//        xll: false,
//        ipad:false
//    };
//    //检测平台
//    var p = navigator.platform;
//    system.win = p.indexOf("Win") === 0;
//    system.mac = p.indexOf("Mac") === 0;
//    system.x11 = (p === "X11") || (p.indexOf("Linux") === 0);
//    system.ipad = (navigator.userAgent.match(/iPad/i) !== null)?true:false;
//    if (system.win || system.mac || system.xll ||system.ipad) {
//		alert();
//    } else {
//       	some code;
//    }
//	
	

});