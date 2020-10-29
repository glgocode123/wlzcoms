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
	
	var userCookie = $.cookie("wlzName");
	
	//已完成支付
	$("#btn-doneBuy").on("click",function(){
		
		//wlzName cookie 有内容
		if(isNullOrUndefined(userCookie)){
			
			var arr = userCookie.split("||");
			//写入cookie
			
			$.getJSON("http://d3j1728523.wicp.vip/user?MobID="+arr[0], function(jsonData){
				if(jsonData.length > 0){
					
					switch (arr[1]) {
						case "RWSU":
							$.cookie("wlzName", arr[0] + "||RWSU||true||" + jsonData[0].Points + "||" + jsonData[0].Golden + "||" + arr[5], { expires: 1 });
							break;
						case "WSU":
							$.cookie("wlzName", arr[0] + "||WSU||true||" + jsonData[0].Points + "||" + jsonData[0].Golden + "||" + arr[5], { expires: 1 });
							 break;
						case "RSU":
							$.cookie("wlzName", arr[0] + "||RWSU||true||" + jsonData[0].Points + "||" + jsonData[0].Golden + "||" + arr[5], { expires: 1 });
							 break;
						case "NSU":
							$.cookie("wlzName", arr[0] + "||WSU||true||" + jsonData[0].Points + "||" + jsonData[0].Golden + "||" + arr[5], { expires: 1 });
					} 
					
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
					
					//服务器都没有用户数据，还删除个屁啊。。。
//					$.ajax({
//						type:"DELETE",
//						url:"http://localhost:3000/users?MobID="+arr[0],
//						async: false,
//						dataType:"json",
//						success:function(){
//							$.removeCookie("wlzName");
//							$.removeCookie("wlzOrder");
//							$.removeCookie("wlzBuy");
//						
//							$(location).attr("href", "404.html");
//						},
//						error:function(err){
//							console.error(err);
//						}
//					});
				}

			});
			
		}else{
			
			//如果没有用户登录cookie
			$(location).attr("href", "404.html");
		}
		
	});
	
	//遇到问题
	$("#btn-resetBuy").on("click",function(){
		
		//wlzName cookie 有内容
		if(isNullOrUndefined(userCookie)){
			
			var arr = userCookie.split("||");
			
			$.getJSON("http://d3j1728523.wicp.vip/user?MobID="+arr[0], function(jsonData){
				
				if(jsonData.length > 0){
					
					var newJSONDataUser = '{"MobID":' + arr[0] + ',"Points":' + arr[3] + ',"Golden":' + arr[4] + '}';
					$.ajax({
						type: "PUT",
						url: "http://d3j1728523.wicp.vip/user/" + jsonData[0].id,
						async: false,
						contentType: "application/json",//; charset=utf-8
						data: newJSONDataUser,
						dataType: "json",
						success: function () {

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
			
		}else{
			
			//如果没有用户登录cookie
			$(location).attr("href", "404.html");
		}
		
	});

});