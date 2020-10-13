// JavaScript Document
$(function () {

	"use strict";


	/*================*/
	/* 事件 - 添加收藏 */
	/*================*/
	$('.AddFavorite').on('click', function () {
		var title = 'WENLONGZHANG.com';
		var url = 'http://www.wenlongzhang.com';
		try {
			window.external.addFavorite(url, title);
		} catch (e) {
			try {
				window.sidebar.addPanel(title, url, "");
			} catch (e) {
				alert("抱歉，您内所使用的浏览器无法完成此操作。\n\n请使用快容捷键Ctrl+D进行添加！\n");
			}
		}
	});

	/*================*/
	/* 功能 - 测试网络通不通 */
	/*================*/
	function NetPing() {
		//连接写服务器
		$.ajax({
			url: 'http://d3j1728523.wicp.vip/',
			type: 'GET',
			complete: function (response) {
				alert(response);
				if (response.status === 200 || response.status === "200" ) {
					return true;
				} else {
					return false;
				}
			}
		});
	}
	

	/*================*/
	/* 功能 - 弹出菜单功能 */
	/*================*/
	function updateTextPopup2(title, text){
		//判断是否已经弹出了一个相同属性的框，这个是用global.js的关闭改的
		if($(".overlay-wrapper").hasClass("active")){
			$('.overlay-wrapper').removeClass('active');
		}
		$('.text-popup .text-popup-title').text(title);
		$('.text-popup .text-popup-message').text(text);
		$('.text-popup').addClass('active');
	}
	
	/*================*/
	/* 功能；日期方法 - 判断时间段 */
	/*================*/
	var date = {
		isDuringDate: function (beginDateStr, endDateStr){
			var strb = beginDateStr.split(":"),
				stre = endDateStr.split(":");
			if(strb.length !== 2 && stre.length !== 2){
				return false;
			}
			var b = new Date(),
				e = new Date(),
				n = new Date();
			b.setHours( strb[0] );
			b.setMinutes( strb[1] );
			e.setHours(stre[0]);
			e.setMinutes(stre[1]);
//			if(n.getTime()-b.getTime()>0 && n.getTime()-e.getTime()<0){
			if(n > b && n < e){
				return true;
			}
			return false;
			
		}
	};
	
	

	/*=======================================================================================*/
	
	/*================*/
	/* 页面配置 - 初始化判断浏览器是否开启cookie */
	/*================*/
	function CookieEnable() {
		
		if (navigator.cookiesEnabled) {
			return true;
		}else {
			var result = false;
			
			document.cookie = "testcookie=yes;";

			var cookieSet = document.cookie;

			if (cookieSet.indexOf("testcookie=yes") > -1) {result = true;}

			document.cookie = "";

			return result;
		}
	}
	
	/*================*/
	/* 页面配置 - 初始化判断用户是否登录状态 */
	/*================*/

	
	//cookieMobID需要改为调用cookie中的登录状态，成功就返回手机号
	var pattern = new RegExp(/^1[3,4,5,7,8][0-9]{9}$/),
		cookieMobID = readCookieMob();
	
	function readCookieMob(){
		var source = $.cookie("wlzName");
		if (source === null || source === "" || source === undefined || source === "null") {
			return 0;
		}
		var arr = source.split("||");
		return arr[0];
	}
	/*=======================================================================================*/
	
	
	//读取COOKIE中的集合
	function readCookieCartNum() {
		var source = $.cookie("wlzCart");
		if (source === null || source === "" || source === undefined || source === "null") {
			return 0;
		}
		var arr = source.split("|$|");
		return arr.length;
	}
	
	/*================*/
	/* 页面配置 - 初始化判断是否打烊 */
	/*================*/
	alert(NetPing());
	if (NetPing()) {
	
		if(CookieEnable()){
	
			//如果获取的手机号正确（这个是cookie中的一个数值，还有产品个数，用户基本信息等）
			if (pattern.test(cookieMobID)){
				//参数加入日期作为判断：是否历史记录中调取的href，如果不是当前就读cookie并更新参数
				$("a.mymember").attr("href","i.html?Data=20200815&Mob="+cookieMobID);
			
				//————购物车显示产品个数
				var cartnum = readCookieCartNum();
				//判断cookice，读取购物车数量，如果购物车为空或者读取失败则0
//				cartnum = 10;//模拟10个
				//显示购物车
				$("li.mycart a").children("span").text(cartnum);
				$("li.mycart a").attr("href", "cart.html?Mob="+cookieMobID);
			}else{
				$("a.mymember").attr("href","login.html");
			}
		}else{
			//如果浏览器没有开启cookie
			if ($("div").is(".isThePage")) {
				$(location).attr('href', 'index.html');
			}else{
				updateTextPopup2("ERROR","你的浏览器的Cookie功能被禁用，导致网站无法正常使用，请开启！");
			}
			//如果没有开启coocie，不显示购物车菜单
//			$("li.mycart").remove();
			
			//找到isShow，并添加isHide类
			$(".isShow").addClass("isHide");
			//禁止之前的连接
			$(".isShow > a").attr("href","#");
			//假删除横线
			$(".isShow > a").css("text-decoration","line-through");
			//当点击打烊不可用的功能时，提示打烊了
			$(".isHide").on('click', function () {
				updateTextPopup2("ERROR","你的浏览器的Cookie功能被禁用，导致此功能无法正常使用，请开启后尝试！");
			});
		}
		
	} else {
		//如果店铺打烊了：页面有isThePage，跳转回主页（打烊不可看的页面）
		if ($("div").is(".isThePage")) {
			$(location).attr('href', 'index.html');
		}else{
			//默认网站打烊
			var iTitle = "网站已打烊";
			var iText = "关闭此窗口可以继续浏览。登录、注册、购买等功能可在营业时间内使用！";
			//如果当前时间在营业时间中，则改为维护
			if(date.isDuringDate('10:00','21:00')){
				iTitle = "网站维护中";
				iText = "网站正在维护升级中（一般为24小时内），如需人工服务可联系我们的人工客服微信号（GLxxxxx）。维护期间仅提供查看服务，感谢您的谅解与配合！";
				//并设置系统通知，这里没想好
			}
			
			//进入页面的时候提示打烊了
			updateTextPopup2( iTitle, iText);

	//		$(".isShow").hide();
			
			//找到isShow，并添加isHide类
			$(".isShow").addClass("isHide");
			//禁止之前的连接
			$(".isShow > a").attr("href","#");
			//假删除横线
			$(".isShow > a").css("text-decoration","line-through");
			//当点击打烊不可用的功能时，提示打烊了
			$(".isHide").on('click', function () {
				updateTextPopup2(iTitle, iText);
			});
		}
	}
	
	
	/*=======================================================================================*/
	/*================*/
	/* 页面配置 - 初始化Menu内容，当前控制数20% */
	/*================*/
	//点击菜单中的口号
	$("p#menuSlogan").on('click', function () {
		updateTextPopup2("你值得享有更好的生活", "只有时间的沉淀才能做出好的产品，今时今日你还能相信把时间都花到开店和推销上的品牌可以做好产品吗？你没看错，我们是第一家会打烊的艺术家线上品牌店；把时间用在刀刃上，只为让产品更接近完美。");
	});
	//移动经过侧边菜单中的微信
	$("li.wechatQRCode").mouseover(function(){
		$(this).after("<img src='img/qrcode.png' style='width: 100%;'>");
	});
	$("li.wechatQRCode").mouseleave(function(){
		$(this).next().remove();
	});
	//
	
	
});