// JavaScript Document
$(function () {

	"use strict";
	
	// 获得当前页id
	var url = location.href;
	
	/*================*/
	/* 功能 - 提取url中的解析字符串 */
	/*================*/
	function UrlParamHash(url) {
		var params = [],
			h;
		var hash = url.slice(url.indexOf("?") + 1).split('&');
//		alert(hash);
		for (var i = 0; i < hash.length; i++) {
			h = hash[i].split("="); //
			params[h[0]] = h[1];
//			alert(h);
		}
		return params;
	}
	
	/*================*/
	/* 功能 - 判断手机号格式是否正确 */
	/*================*/
	function isMobID(prodid){
		var pattern = new RegExp(/^1[3,4,5,7,8][0-9]{9}$/);
//		alert(pattern.exec(prodid));
		if (!pattern.exec(prodid)){return false;}
		return true;
	}
	
	/*=======================================================================================*/
	
	/*================*/
	/* 写页面功能1 - 填写用户基本信息 */
	/*================*/
	function setUserInfo(MobID) {
		$("#iMob").text(MobID);
		
		//模拟获取的基本信息----用户积分
		var userPoints = 999;
		$("#iPoints").text(userPoints);
		//用模拟用户积分获得----会员等级
		var userLevel = "数据错误";
		if(userPoints <= 500){userLevel = "预备会员";}
		else if(userPoints <= 1000){userLevel = "普通会员";}
		else if(userPoints <= 2000){userLevel = "青铜会员";}
		else if(userPoints <= 4000){userLevel = "百银会员";}
		else if(userPoints <= 8000){userLevel = "黄金会员";}
		else if(userPoints <= 16000){userLevel = "铂金会员";}
		else if(userPoints <= 40000){userLevel = "VIP";}
		else if(userPoints <= 100000){userLevel = "SVIP";}
		$("#setTitle").text(userLevel);
		$("#iLevel").text(userLevel);
		
		//模拟获取的基本信息----金池含量
		var userGolden = 0;
		$("#iGolden").text(userGolden);
		
		//模拟获取用户数据并写入
		var userBeforeHistoryID = [];
		setHistory(userBeforeHistoryID);
		setHistory(userBeforeHistoryID);
	}
	
	
	/*================*/
	/* 写页面功能2 - 写入历史购买记录 */
	/*================*/
	function setHistory(beforeHistoryID) {
		beforeHistoryID =1;
		//新的购买历史
		var sData = "2020-07-20";
		var sTracking = "商品将1～2日内发货，并在此查看快递单号";
		var htmlRowSpacing = "<div class='empty-space h25-xs h40-md'></div>";
		var htmlRowSpacing2 = "<div class='empty-space h30-xs'></div>";
		var htmlRowSpacing3 = "<div class='empty-space h50-xs'></div>";
		
		var htmlVarMoney = new Array("229.00","10.00","219.00");
		var htmlVarProdMoney = "<div class='comment'><div class='text-center'><hr><span>价格：¥" + htmlVarMoney[0] + ", 优惠：" + htmlVarMoney[1] + ", 实付款：" + htmlVarMoney[2] + "</span></div></div>";
		
		var htmlVarProdImg = "img/icon-more.png";
		var htmlVarProdTitle = "TEEBACCO球鞋系列图案印花短袖T恤";
		var htmlVarProdColor = "白色";
		var htmlVarProdSize = "S";
		var htmlVarProd = "";
		for(var i = 0; i < 3; i++){
			htmlVarProd += "<div class='comment'><img src='"+htmlVarProdImg+"'><div class='description'><span class='big'>"+htmlVarProdTitle+"</span><div class='empty-space h10-xs'></div><span>颜色："+htmlVarProdColor+", 尺寸："+htmlVarProdSize+"</span></div></div>";
		}
		htmlVarProd += htmlVarProdMoney;
		var htmlVal = "<div class='form-wrapper'>" + htmlRowSpacing + "<h7 class='h7'>" + sData + "</h7><hr/>" + "<span class='big'>" + sTracking + "</span>" + htmlRowSpacing2 + "<div class='comments-wrapper'>"+htmlVarProd + htmlRowSpacing3+"</div></div>";
		
		if($("div.form-wrapper").length > 0){
			$("div.form-wrapper").after(htmlVal);
		}else{
			$("#setHistory").append(htmlVal);
		}
		//以往的购买历史
	}
	
	
	
	/*=======================================================================================*/
	
	//cookieMobID需要改为调用cookie中的登录状态，成功就返回手机号
	var cookieMobID = $.cookie("wenlongzhangName");
	
	/*================*/
	/* 页面配置 - 判断获取的用户Mobid是否正确，如果正确执行页面数据获取填充 */
	/*================*/
	
	if(decodeURI(cookieMobID)){
		setUserInfo(cookieMobID);
	}else{
		//如果页面id不合适，返回原页
		$(location).attr('href', 'login.html');
	}
	
	
//	//判断 - 页面传入的Mob是否正确
//	if(isMobID(decodeURI(UrlParamHash(url).Mob))){
//		cookieMobID = UrlParamHash(url).Mob;
//		//如果获取的手机号正确，初始化填入表格中
//		setUserInfo(cookieMobID);
//	}else{
//		//二次判断 - 读取cookie
//		if(true){
//			//模拟正确
//			cookieMobID = 13822262354;
//			$(location).attr('href', 'i.html?Mob='+cookieMobID);
//		}else{
//			//如果页面id不合适，返回原页
//			$(location).attr('href', 'login.html');
//		}
//	}

});