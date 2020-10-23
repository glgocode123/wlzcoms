// JavaScript Document
$(function () {

	"use strict";

	
	/*=======================================================================================*/
	// 介绍：
	// 1、初始化：判断是否已经登录，如果是哪来的回到哪里去，直接来的去会员中心。
	// 2、判断两个服务器并：登录/注册
	// 3、判断只读服务器确定是否有加载内容，如果有之后有需要现实的页面将会出现“加载历史记录”的按钮
	// 4、页面展示控制
	// 5、页面事件控制
	/*=======================================================================================*/
	
	
	/*=======================================================================================*/
	// 全局功能
	/*=======================================================================================*/
	
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
	
	/*================*/
	/* 功能 - 读取cookie中的手机号 */
	/*================*/
	function readCookieMob(){
		var source = $.cookie("wlzName");
		if (source === null || source === "" || source === undefined) {
			return 0;
		}
		var arr = source.split("||");
		return arr[0];
	}
	
	/*================*/
	/* 功能 - 从什么页面来回到什么页面去 */
	/*================*/
	function jumpPage(jpMob,jpUserStatus){
		//判断是从什么页面来的
		if(isNullOrUndefined(UrlParamHash(url).fromPageType)){
			switch (UrlParamHash(url).fromPageType) {
				case "advance":
					$(location).attr('href', 'advance.html');
					break;
				case "cart":
					$(location).attr('href', 'cart.html');
					break;
				case "product":
					//如果是product页面进来的，应该存在prodID
					$(location).attr('href', 'product.html?prodid='+UrlParamHash(url).prodID);
			}
		}else if(jpUserStatus === ""){
			alert("跳转到i");
			$(location).attr('href', 'i.html?Mob=' + jpMob);
		}else{
			alert("跳转到i");
			$(location).attr('href', 'i.html?Mob=' + jpMob + "&userStatus="+jpUserStatus);
		}
	}
	
	/*================*/
	/* 功能 - 消息框 —— 插件 */
	/*================*/
	function updateTextPopup(title, text){
		$('.text-popup .text-popup-title').text(title);
		$('.text-popup .text-popup-message').text(text);
		$('.text-popup').addClass('active');
	}
	
	/*=======================================================================================*/
	// 全局变量
	/*=======================================================================================*/
	
	//userMobID需要改为调用cookie中的登录状态，成功就返回手机号
	var pattern = new RegExp(/^1[3,4,5,7,8][0-9]{9}$/),
		userMobID = readCookieMob();
	
	/*=======================================================================================*/
	// 1、页面初始化
	/*=======================================================================================*/
	
	// 获得当前页id
	var url = location.href;
	
	/*================*/
	/* 功能 - 提取url中的解析字符串 */
	/*================*/
	function UrlParamHash(url) {
		var params = [],
			h;
		var hash = url.slice(url.indexOf("?") + 1).split('&');
		for (var i = 0; i < hash.length; i++) {
			h = hash[i].split("="); //
			params[h[0]] = h[1];
		}
		return params;
	}
	
	//如果获取的手机号正确， 直接跳转（因为已经登录，cookie保存一天，因为每天都会更新数据库）
	if (pattern.test(userMobID)){
		//如果已经登录，跳转到用户中心，并把cookie获得的id传过去
//		$(location).attr("href","i.html?Mob="+userMobID);
		jumpPage(userMobID,"");
	}
	
	/*=======================================================================================*/
	// 2、3、大功能，负责点击“确定”后的操作
	
	// 五种状态：（RWSU老用户有更新、WSU新用户有更新、RSU老用户没更新、NSU注册新用户、404）
	//
	/*=======================================================================================*/
	//inputMob，用户输入的手机号码
	function getSeverDate(inputMob){

		//用于判断服务器是否有数据
		var rServerUser = false;
		
		//设置为同步请求
		$.ajaxSettings.async = false;
		
		//判断可读服务器，是否存在用户
		$.getJSON("i.json", function(jsonData){
			for (var i = 0; i < jsonData.length; i++) {
				var jsonMob = jsonData[i].toString();
				if(inputMob === jsonMob){
					//已经是用户
					rServerUser = true;
					//记录用户ID
					userMobID = jsonData[i];
					break;
				}
			}
		});
		
		//目前打烊不能进入登录页面， 所以不用管是否“开了”写入服务器， 只需要判断能否读到数据就好
		//判断可写服务器对应的用户
		$.getJSON("http://d3j1728523.wicp.vip/user?MobID="+inputMob, function(jsonData){
			//判断是否存在
			if(jsonData.length > 0){
				
				//记录用户ID
				userMobID = inputMob;
				
				var userPoints = jsonData[0].Points,
					userGolden = jsonData[0].Golden;
				
				//读取用户订单记录，用于写cookie
				$.getJSON("http://d3j1728523.wicp.vip/order?MobID="+inputMob, function(jsonData){
					var wSource = "";
					
					for (var j = 0; j < jsonData[0].Order.length; j++) {
						
						//块：记录
						wSource += 
							jsonData[0].Order[j].data + "||" + 
							jsonData[0].Order[j].AWB + "||" + 
							jsonData[0].Order[j].MobNum + "||" + 
							jsonData[0].Order[j].Points[0] + "||" + 
							jsonData[0].Order[j].Points[1] + "||" + 
							jsonData[0].Order[j].Golden[0] + "||" + 
							jsonData[0].Order[j].Golden[1] + "||" + 
							jsonData[0].Order[j].Name + "||" + 
							jsonData[0].Order[j].Address + "||" + 
							jsonData[0].Order[j].price + "||" + 
							jsonData[0].Order[j].discount + "||" + 
							jsonData[0].Order[j].Total + "|$|";

						for(var k = 0; k < jsonData[0].Order[j].prodArr.length; k++){

							//块：产品
							wSource += 
								jsonData[0].Order[j].prodArr[k].proID + "||" + 
								jsonData[0].Order[j].prodArr[k].proName + "||" + 
								jsonData[0].Order[j].prodArr[k].proParm;

							//Order中最后一个产品块
							if(k === jsonData[0].Order[j].prodArr.length - 1){
								//不是最后一个记录块
								if(j !== jsonData[0].Order.length - 1){
									wSource += "|$|";
								}
							}else{
								wSource += "|&|";
							}
						}
					}
					
					alert(wSource);
					//，有则读取cookie======先读取wServer再读取rServer========
					$.cookie("wlzNewHistory", wSource, { expires: 1 });
				});
						  
				//如果只读服务器存在
				//是老用户并且有修改（可写服务器）
				if(rServerUser){
					//老用户
					$.getJSON("user/" + userMobID + ".json", function(jsonData){
						//cookie数据：0手机号||1老用户&有修改数据||2可写数据库||3积分||4金池||5历史记录数量
						//读取用户json，为的是保存数据在cookie
						$.cookie("wlzName", userMobID + "||RWSU||true||" + userPoints + "||" + userGolden + "||" + jsonData.History.length, { expires: 1 });

						//RWSU = Read Write Sever User
						//$(location).attr('href', "i.html?Mob="+userMobID+"&userStatus=RWSU");
						jumpPage(userMobID,"RWSU");
					});
				}else{
					//新用户
					//考虑将新购物的内容加入cookie， 这样可以不用经常查询可写服务器, 可以用true判断，有则读取cookie
					//cookie数据：0手机号||1新用户||2可写数据库||3积分||4金池||5历史记录数量
					$.cookie("wlzName", userMobID + "||WSU||true||" + userPoints + "||" + userGolden + "||" + "0" , { expires: 1 });

					//RWSU = Read Write Sever User
					//$(location).attr('href', "i.html?Mob="+userMobID+"&userStatus=WSU");
					jumpPage(userMobID,"WSU");
				}
			}else{//如果可写服务器没有数据，判断只读服务器
				
				//如果只读服务器有此用户，就读取用户数据
				if(rServerUser){
					//已经是用户
					$.getJSON("user/" + userMobID + ".json", function(jsonData){
		//				alert(jsonData.Points);
						//cookie数据：0手机号||1没有修改数据||2可写数据库||3积分||4金池||5历史记录数量
						//读取用户json，为的是保存数据在cookie
						$.cookie("wlzName", userMobID + "||RSU||false||" + jsonData.Points + "||" + jsonData.Golden + "||" + jsonData.History.length, { expires: 1 });

						//RSU = Read Sever User
		//				$(location).attr('href', 'i.html?Mob=' + userMobID + "&userStatus=RSU");
						jumpPage(userMobID,"RSU");
					});
				}else{//如果只读服务器也没有数据
					
					var newJSONData =  '{"MobID":' + userMobID + ',"Points":' + '0' + ',"Golden":' + '0' + '}';
					//把来者注册成新用户
					//发送交易请求到w数据库
					$.ajax({
						type: "post",
						url: "http://d3j1728523.wicp.vip/user",
						async: false,
						contentType: "application/json",//; charset=utf-8
						data: newJSONData,
						dataType: "json",
						success: function () {
							//cookie数据：0手机号||1没有修改数据||2可写数据库||3积分||4金池||5历史记录数量
							//读取用户json，为的是保存数据在cookie
							$.cookie("wlzName", userMobID + "||NSU||false||" + 0 + "||" + 0 + "||" + 0, { expires: 1 });

							//NSU = New Sever User
			//				$(location).attr('href', 'i.html?Mob=' + userMobID + "&userStatus=NSU");
							jumpPage(userMobID,"NSU");
						},
						error: function(XMLHttpRequest, textStatus, errorThrown) {
							console.log(XMLHttpRequest.status);
							console.log(XMLHttpRequest.readyState);
							console.log(textStatus);
							console.log(errorThrown);
							updateTextPopup("Error","您的订单未能提交，请稍后再试！");
						}
					});
					
					
					//如果注册不成功
					updateTextPopup("error","当前无法注册！请24小时后再试！");

				}
			}
		});
	}
	
	/*=======================================================================================*/
	// 4、页面展示控制
	/*=======================================================================================*/
	
	//手机号触发样式
	$(document).on('keyup', '.input-wrapper .input', function(){
		$(this).parent().removeClass('invalid');
	});
	
	$('.messageMemberBenefits').on("click", function(){
        updateTextPopup('会员权益', '1、获得会员积分服务；2、享受对应等级会员礼包；3、获得金池使用权限；4、获得会员折扣资格。');
	});
	
	/*=======================================================================================*/
	// 5、页面事件控制
	/*=======================================================================================*/
	
	$('#btn-order').on("click", function(){
		var $this = $('.login-form');
						   
		$('.invalid').removeClass('invalid');
		var msg = '以下必填项不正确：',
//			successMessage = "商品将1～2日内发货，彼时可在会员中心查看快递单号.",
			error = 0;
		//如果输入的不是正确的手机号
        if (!pattern.test($.trim($('.login-form input[name="mob"]').val()))) {
			error = 1; $this.find('input[name="mob"]').parent().addClass('invalid'); msg = msg +  '\n - 手机号';
		}

        if (error){
        	updateTextPopup('ERROR', msg);
        }else{
			//如果输入的手机号正确
			//如果cookie中没有记录手机号
			//将输入内容，与服务器进行比对，并下一步操作
			getSeverDate($.trim($('.login-form input[name="mob"]').val()));
			
        }
	  	return false;
	});
	

});