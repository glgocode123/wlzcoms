// JavaScript Document
$(function () {

	"use strict";
	
	//设置为同步请求
	$.ajaxSettings.async = false;
	
	function isNullOrUndefined(obj){
		if(obj===null||obj===undefined||obj===""||obj==="undefined"||obj==="null"){
			return true;
		}else{
			return false;
		}
	}
	
	var userCookie = $.cookie("wlzName");
	
	//已完成支付
	$("#btn-doneBuy").on("click",function(){
		
		//如果用户登录信息不对
		if(isNullOrUndefined(userCookie)){
			
			$.removeCookie("wlzBuy");
			$.removeCookie("wlzCart");
			$.removeCookie("wlzOrder");
			//如果没有用户登录cookie
			$(location).attr("href", "404.html");
			
		}else{

			var arr = userCookie.split("||");
			//写入cookie
			
			$.getJSON("http://d3j1728523.wicp.vip/user?MobID="+arr[0], function(jsonData){
				if(jsonData.length > 0){
						
					alert(arr[1]);
					
					switch (arr[1]) {
						case "RWSU":
							$.cookie("wlzName", arr[0] + "||RWSU||true||" + jsonData[0].Points + "||" + jsonData[0].Golden + "||" + arr[5] + "||" + jsonData[0].Buy + "||" + jsonData[0].Advance + "||" + jsonData[0].Bad, { expires: 1 });
							break;
						case "WSU":
							$.cookie("wlzName", arr[0] + "||WSU||true||" + jsonData[0].Points + "||" + jsonData[0].Golden + "||" + arr[5] + "||" + jsonData[0].Buy + "||" + jsonData[0].Advance + "||" + jsonData[0].Bad, { expires: 1 });
							break;
						case "RSU":
							$.cookie("wlzName", arr[0] + "||RWSU||true||" + jsonData[0].Points + "||" + jsonData[0].Golden + "||" + arr[5] + "||" + jsonData[0].Buy + "||" + jsonData[0].Advance + "||" + jsonData[0].Bad, { expires: 1 });
							break;
						case "NSU":
							$.cookie("wlzName", arr[0] + "||WSU||true||" + jsonData[0].Points + "||" + jsonData[0].Golden + "||" + arr[5] + "||" + jsonData[0].Buy + "||" + jsonData[0].Advance + "||" + jsonData[0].Bad, { expires: 1 });
					} 
					
					
					var sourceOrder = $.cookie("wlzOrder");
					var sourceHistory = $.cookie("wlzNewHistory");
					var sourceHistoryVal = "";
					//如果购买记录是空的，直接写入
					if(isNullOrUndefined(sourceHistory)){
						sourceHistoryVal = sourceOrder;
					}else{//否者，在之前之后写入
						sourceHistoryVal = sourceHistory + "|$|" + sourceOrder;
					}
					$.cookie("wlzNewHistory", sourceHistoryVal, { expires: 1 });
					
					
					$.removeCookie("wlzOrder");
					$.removeCookie("wlzBuy");
					//添加本地cookie历史记录
					$(location).attr("href", "i.html");
					
				}else{
							
					//如果服务器没有用户数据的情况
					$.removeCookie("wlzName");
					$.removeCookie("wlzOrder");
					$.removeCookie("wlzBuy");
					$(location).attr("href", "404.html");	
					
				}

			});
			
		}
		
	});
	
	//遇到问题
	$("#btn-resetBuy").on("click",function(){
		
		//wlzName cookie 有内容
		if(isNullOrUndefined(userCookie)){
			
			$.removeCookie("wlzBuy");
			$.removeCookie("wlzCart");
			$.removeCookie("wlzOrder");
			//如果没有用户登录cookie
			$(location).attr("href", "404.html");
			
		}else{
			
			var arr = userCookie.split("||");
			
			$.getJSON("http://d3j1728523.wicp.vip/user?MobID="+arr[0], function(jsonData){
				
				if(jsonData.length > 0){
					
					var newJSONDataUser = '{"MobID":' + arr[0] + ',"Points":' + arr[3] + ',"Golden":' + arr[4] + ',"Buy":' + arr[6]  + ',"Advance":' + arr[7] + ',"Bad":true' + '}';
					$.ajax({
						type: "PUT",
						url: "http://d3j1728523.wicp.vip/user/" + jsonData[0].id,
						async: false,
						contentType: "application/json",//; charset=utf-8
						data: newJSONDataUser,
						dataType: "json",
						success: function () {
							//冻结了账户，所以也要删除用户cookie
							$.removeCookie('wlzName',{ path: '/'});
							
							$.removeCookie("wlzOrder");
							$.removeCookie("wlzBuy");
							$(location).attr('href', 'contact.html');
							
						},
						error: function(XMLHttpRequest, textStatus, errorThrown) {
							console.log(XMLHttpRequest.status);
							console.log(XMLHttpRequest.readyState);
							console.log(textStatus);
							console.log(errorThrown);
						}
					});
					
				}else{
					//如果服务器没有用户数据的情况
					$.removeCookie("wlzName");
					$.removeCookie("wlzOrder");
					$.removeCookie("wlzBuy");
					$(location).attr("href", "404.html");	   
				}
					
			});

			
		}
		
	});

});