// JavaScript Document
$(function () {

	"use strict";

	
	//userMobID需要改为调用cookie中的登录状态，成功就返回手机号
	var pattern = new RegExp(/^1[3,4,5,7,8][0-9]{9}$/),
		userMobID = readCookieMob();
	
	function readCookieMob(){
		var source = $.cookie("wenlongzhangName");
		if (source === null || source === "" || source === undefined) {
			return 0;
		}
		var arr = source.split("||");
		return arr[0];
	}
	
	//如果已经登录，跳转到用户中心，并把cookie获得的id传过去
	
	
	//如果获取的手机号正确， 直接跳转（因为已经登录，cookie保存一天，因为每天都会更新数据库）
	if (pattern.test(userMobID)){
		$(location).attr("href","i.html?Mob="+userMobID);
	}
	
	//获取并比对服务器数据
	function getSeverDate(inputMob){
		//访问json

		//用于判断json中有没有
		var wServerUser = false,
			rServerUser = false;
		
		//服务器要等去旅游回来在弄
//		$.getJSON("http://d3j1728523.wicp.vip/i.json", function(jsonData){
//			for (var i = 0; i < jsonData.length; i++) {
//				if(inputMob === jsonData[i]){
//					wServerUser = true;
//					continue;
//				}
//			}
//		});
		//设置为同步请求
		$.ajaxSettings.async = false;
		$.getJSON("i.json", function(jsonData){
			for (var i = 0; i < jsonData.length; i++) {
				var jsonMob = jsonData[i].toString();
				if(inputMob === jsonMob){
					//已经是用户
					rServerUser = true;
					alert(rServerUser);
					//记录用户ID
					userMobID = jsonData[i];
					continue;
				}
			}
		});
			
		alert(rServerUser);
		//目前打烊不能进入登录页面， 所以不用管是否开了写入服务器， 只需要判断能否读到数据就好
		//判断登录服务器用户存在
		if(wServerUser){
			//(因为用户如果修改数据后，可写服务器有完整的基本信息+修改信息)，问题，究竟加入什么内容，因为可写服务器是不安全的，可能比用户cookie更不安全，因为用户cookie是用户自己的，而可写服务器是公开的，但是如果可写服务器的数据与用户本地数据不匹配，又将按照谁的？
//
//			if(rServerUser){
//				$.cookie("wenlongzhangName", userMobID+"||RWSU||true||999||123||true", { expires: 1 });
//				//，有则读取cookie======先读取wServer再读取rServer========
//				var rwSource = "";
//				$.cookie("wenlongzhangNewHistory", rwSource, { expires: 1 });
//				//RWSU = Read Write Sever User
//				$(location).attr('href', "i.html?Mob="+userMobID+"&userStatus=RWSU");
//			}else{
//				//今天注册过的新用户，或用户数据有修改=======（读取json不完整）========
//				//考虑将新购物的内容加入cookie， 这样可以不用经常查询可写服务器, 可以用true判断，有则读取cookie
//				$.cookie("wenlongzhangName", userMobID+"||WSU||true||999||123||true", { expires: 1 });
//				//，有则读取cookie======先读取wServer再读取rServer========
//				var wSource = "";
//				$.cookie("wenlongzhangNewHistory", wSource, { expires: 1 });
//				//RWSU = Read Write Sever User
//				$(location).attr('href', "i.html?Mob="+userMobID+"&userStatus=WSU");
//			}



		}else if(rServerUser){//判断只读服务器用户存在的情况
			//已经是用户
			$.getJSON("user/" + userMobID + ".json", function(jsonData){
				alert(jsonData.Points);
				//cookie数据：0手机号||1没有修改数据||2数据库||3积分||4金池||5历史记录数量
				//读取用户json，为的是保存数据在cookie
				$.cookie("wenlongzhangName", userMobID + "||RSU||false||" + jsonData.Points + "||" + jsonData.Golden + "||" + jsonData.History.length, { expires: 1 });
				
				//只读数据库历史记录太大不记录cookie，因为cookie最好4K以内
//				//写入历史记录cookie
//				var rSource = "";
//				for (var i = 0; i < jsonData.History.length; i++) {
//					rSource += jsonData.History[i].data + "||" + jsonData.History[i].AWB + "||" + jsonData.History[i].price + "||" + jsonData.History[i].discount + "||" + jsonData.History[i].Total + "|$|";
//					for(var j = 0; j < jsonData.History[i].prodid.length; j++){
//						rSource += jsonData.History[i].prodid[j].proID + "||" + jsonData.History[i].prodid[j].proName + "||" + jsonData.History[i].prodid[j].proParms;
//						if(j!==jsonData.History[i].prodid.length-1){
//							 += "|$|";
//						}else{
//							 += "|&|";
//						}
//					}
//				}
//				$.cookie("wenlongzhangNewHistory", rSource, { expires: 1 });
				
				//RSU = Read Sever User
				$(location).attr('href', 'i.html?Mob=' + userMobID + "&userStatus=RSU");
			});
		}else{
			//注册新用户
			updateTextPopup("error","当前无法注册！请24小时后再试！");
			//W服务器需要维护，先不写这个逻辑=======（读取json不完整）========
			//WSU
		}


		//			$.cookie("wenlongzhangName", userMobID, { expires: 1 });
		//			$(location).attr('href', 'i.html?Mob='+userMobID);
	}
	
	
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
	
	$(document).on('keyup', '.input-wrapper .input', function(){
		$(this).parent().removeClass('invalid');
	});

	function updateTextPopup(title, text){
		$('.text-popup .text-popup-title').text(title);
		$('.text-popup .text-popup-message').text(text);
		$('.text-popup').addClass('active');
	}

	
	
	
	
	

});