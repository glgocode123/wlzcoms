// JavaScript Document
$(function () {

	"use strict";
	
	//设置为同步请求
	$.ajaxSettings.async = false;
	
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
	function setUserInfo(userInfo) {
		
		//userInfo - cookie数据：0手机号||1服务器状态||2什么数据库||3积分||4金池||5历史记录数量
		//如果是只读数据库进来的
		
		var iPoints = 0,
			iGolden = 0,
			iHistoryR = [],
			iHistoryW = [],
			iCookieHistoryW = [];
		
		//用户数据今天有修改过（买过东西 或 做过活动）
		if(userInfo[2]==="true"){
			//用户下面判断有没有cookie记录
			var wlzNHCookie = $.cookie("wenlongzhangNewHistory");
			if(userInfo[1] === "RWSU"){
				//老用户，有数据修改
				//如果有此cookie，说明有修改数据在本地
				if((wlzNHCookie !== null || wlzNHCookie !== "" || wlzNHCookie !== undefined) && wlzNHCookie.split("|$|").length > 0){
					iCookieHistoryW = wlzNHCookie.split("|$|");
				}else{//cookie：没有历史记录
					//访问可写数据库
					$.getJSON("http://d3j1728523.wicp.vip/i.json", function(jsonData){
						//可写服务器是最新的数据
						iPoints = jsonData.Points;
						iGolden = jsonData.Golden;
						
						//用户cookie中的数据 !== 获得的服务器数据 = 用户端&可写服务端有被篡改嫌疑
						if(userInfo[3] !== iPoints || userInfo[4] !== iGolden){
							alert("error,用户数据不匹配！404");
							$(location).attr("href","404.html");
						}else{
							iHistoryW = jsonData.History;
						}
					});
				}
				//访问只读数据库
				$.getJSON("user/" + userInfo[0] + ".json", function(jsonData){
					//可写服务器才是最新的数据，如果为0，说明获取不到可写数据库数据
					if(iPoints === 0 ){iPoints = jsonData.Points;}
					if(iGolden === 0 ){iGolden = jsonData.Golden;}

					//用户cookie中的数据 !== 获得的服务器数据 = 用户端有被篡改嫌疑
					if(userInfo[3] !== iPoints || userInfo[4] !== iGolden){
						alert("error,用户数据不匹配！404");
						$(location).attr("href","404.html");
					}else{
						iHistoryR = jsonData.History;
					}
				});
			}else if(userInfo[1]==="WSU"){
				//刚刚注册的用户，有修改
				//如果有此cookie，说明有修改数据在本地
				if((wlzNHCookie !== null || wlzNHCookie !== "" || wlzNHCookie !== undefined) && wlzNHCookie.split("|$|").length > 0){
					iCookieHistoryW = wlzNHCookie.split("|$|");
				}else{//cookie：没有历史记录
					//访问可写数据库
					$.getJSON("http://d3j1728523.wicp.vip/i.json", function(jsonData){
						//可写服务器是最新的数据
						iPoints = jsonData.Points;
						iGolden = jsonData.Golden;
						
						//用户cookie中的数据 !== 获得的服务器数据 = 用户端&可写服务端有被篡改嫌疑
						if(userInfo[3] !== iPoints || userInfo[4] !== iGolden){
							alert("error,用户数据不匹配！404");
							$(location).attr("href","404.html");
						}else{
							iHistoryW = jsonData.History;
						}
					});
				}
			}
		}else{
			if(userInfo[1] === "RSU"){
				alert(userInfo[0]);
				//老用户，今天数据没有任何修改
				//访问只读数据库
				$.getJSON("user/" + userInfo[0] + ".json", function(jsonData){
					//可写服务器才是最新的数据
					if(iPoints === 0 ){iPoints = jsonData.Points;}
					if(iGolden === 0 ){iGolden = jsonData.Golden;}
					//用户cookie中的数据 !== 获得的服务器数据 = 用户端有被篡改嫌疑
					if(userInfo[3] !== iPoints.toString() || userInfo[4] !== iGolden.toString()){
						alert("error,用户数据不匹配！404");
						$(location).attr("href","404.html");
					}else{
						iHistoryR = jsonData.History;
					}
				});
			}else if(userInfo[1]==="WSU"){
				//刚刚注册的用户，没有修改
				iHistoryW = [];
				//目前还没有完成，这个判断究竟具体怎么用
				alert("提示优惠活动，或者显示用户导向提示");
				
				$("#setHistory").html("<div class='form-wrapper'><div class='empty-space h25-xs h40-md'></div><h7 class='h7'>购物后才会显示历史记录！</h7><span class='big'>你还没有买过任何产品，购物后将在此显示你的历史购物清单。</span><div class='empty-space h30-xs'></div></div>");
			}
		}
		
		
		$("#iMob").text(userInfo[0]);
		
		//模拟获取的基本信息----用户积分
		var userPoints = userInfo[3];
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
		$("#iGolden").text(userInfo[4]);
		
		
		//只读数据库历史记录太大不记录cookie，因为cookie最好4K以内
		//如果有数据，说明第一次访问，还没有记录cookie
		if(iHistoryW.length > 0){
			//写入cookie，同步写入页面显示，可以减少对写入服务器的访问
			setServerHistory(true, iHistoryW);
		}
		//如果有数据，说明老用户，读取只读服务器写入数据
		if(iHistoryR.length > 0){
			setServerHistory(false, iHistoryR);
		}
		//如果有数据，说明有cookie，同时上面的逻辑是不会执行的（因为逻辑判断没有访问服务器）
		if(iCookieHistoryW.length > 0){
			setCookieHistory(iCookieHistoryW);
		}
	}
	
	
	/*================*/
	/* 历史购买记录 —— 分为：server和cookie两种调用方法 */
	/*================*/
	function setServerHistory(takeCookie, historyArray) {
		//一边生成历史记录cookie的rSource，一遍写入页面内容，最后才是记录cookie，如果中途断开了，最多这次记录不成功，下次进入这个页面还会在来一次。
		var rSource = "";
		for (var i = 0; i < historyArray.length; i++) {
			//数据结构为：订单|$|内容|$|订单|$|内容 ， 例子：
			//data||AWB||price||discount||Total|$|
			//proID||proName||proParms|&|
			//proID||proName||proParms|&|
			//proID||proName||proParms|$|
			//data||AWB||price||discount||Total|$|
			//proID||proName||proParms|&|
			//proID||proName||proParms|&|
			//proID||proName||proParms
			rSource += historyArray[i].data + "||" + historyArray[i].AWB + "||" + historyArray[i].price + "||" + historyArray[i].discount + "||" + historyArray[i].Total + "|$|";
			
			//设置单个（块）记录的显示
			setHistoryShow(historyArray[i].data, historyArray[i].AWB, historyArray[i].price, historyArray[i].discount, historyArray[i].Total);
			
			var prodtype = false;
			for(var j = 0; j < historyArray[i].prodArr.length; j++){
				rSource += historyArray[i].prodArr[j].proID + "||" + historyArray[i].prodArr[j].proName + "||" + historyArray[i].prodArr[j].proParms;
				alert(historyArray[i].prodArr[j].length);
				//如果不是最后一个
				if(j!==historyArray[i].prodArr[j].length - 1){
					if(i !== historyArray.length-1 ){
						rSource += "|$|";
						prodtype = true;
					}
				}else{
					rSource += "|&|";
				}
				//设置单个（块）记录的产品：是否最后一个产品，产品id，产品名称，产品参数
				setHistoryShowProduct( prodtype, historyArray[i].prodArr[j].proID, historyArray[i].prodArr[j].proName, historyArray[i].prodArr[j].proParms);
			}
		}
		alert(rSource);
		//将数据写入cookie，下次就不用再访问数据库，之后购买等操作都会同时修改cookie和服务器，所以内容除非被用户恶意修改，否者是同步的。
		//只记录可写服务器的，因为只读服务器太多数据可能会超过4K
		if(takeCookie){
			$.cookie("wenlongzhangNewHistory", rSource, { expires: 1 });
		}
		
	}
	function setCookieHistory(cookieHistoryArray) {
		//数据结构为：订单|$|内容|$|订单|$|内容 ， 例子：
		//[0]data||AWB||price||discount||Total
		//[1]proID||proName||proParms|&|proID||proName||proParms|&|proID||proName||proParms
		//[2]data||AWB||price||discount||Total
		//[3]proID||proName||proParms|&|proID||proName||proParms
		//Total为0的情况是一定不会出现的，因为如果没有产品何来总价
		for(var i = 0; i < cookieHistoryArray.length; i++){
			//偶数数组（头尾数据）
			if((i+2)%2 === 0){
				var iDate = cookieHistoryArray[i].splice("||");
				setHistoryShow(iDate[0], iDate[1], iDate[2], iDate[3], iDate[4]);
			}else{
				var iProd = cookieHistoryArray[i].splice("|&|");
				for(var j = 0; j < iProd.length; j++){
					var jDate = iProd[j].splice("||");
					//如果不是最后一个
					if(j !== iProd[j].length - 1){
						alert("显示");
						setHistoryShowProduct(true, jDate[0], jDate[1], jDate[2]);
					}else{
						alert("yingchang");
						setHistoryShowProduct(false, jDate[0], jDate[1], jDate[2]);
					}
					
				}
			}
		}
		
	}
	
	
	/*================*/
	/* 设置prod页面显示 —— 分为两种方法：历史块 和 块产品列表 */
	/*================*/
	//设置历史记录块的：标题，快递号，原价，优惠，终价
	function setHistoryShow(title, AWB, price, discount, total) {
		var titleString = title.toString();
		var sData = titleString.slice(0,4)+"-"+titleString.slice(4,6)+"-"+titleString.slice(6);//"2020-07-20"
		var sTracking = "商品将1～2日内发货，并在此查看快递单号";
		if (AWB !== "" || AWB !== undefined || AWB !== null){
			sTracking = "订单号："+AWB;
		}
		var htmlVarProdMoney = '<div class="comment"><div class="text-center"><hr><span>价格：¥'+price+', 优惠：'+discount+', 实付款：'+total+'</span></div></div>';
		
		var htmlVal = '<div class="form-wrapper"><div class="empty-space h25-xs h40-md"></div><h7 class="h7">' + sData + '</h7><hr><span class="big">' + sTracking + '</span><div class="empty-space h30-xs"></div><div class="comments-wrapper">' + htmlVarProdMoney + '<div class="empty-space h50-xs"></div></div></div>';
		
		
		//如果已经存在历史记录
		if($("div.form-wrapper").length > 0){
			//已有块之后插入兄弟元素
			$("div.form-wrapper").after(htmlVal);
		}else{
//			$("#setHistory").append(htmlVal);
			$("#setHistory").html(htmlVal);
		}
		
	}
//	此处逻辑还么有改过来
	//设置历史记录块的产品列表：最后一个false，产品ID，产品名称，产品参数
	function setHistoryShowProduct(prodtype, prodID, prodName,prodParms) {
		var htmlVarProdImg = "product/" + prodID + "/icon-more.png";
		var htmlVarProd = '<div class="comment"><img src=' + htmlVarProdImg + ' alt=""><div class="description"><span class="big">' + prodName + '</span><div class="empty-space h10-xs"></div><span>' + prodParms + '</span></div></div>';
		if(prodtype){
			htmlVarProd += '<div class="empty-space h25-xs h45-md"></div>';
		}
		//在块中的价格comment前加入元素，第一个元素comment永远在第一个，价格comment永远在最后
		$("div.form-wrapper:last .comment:last").before(htmlVarProd);
	}
	
	
	
	/*=======================================================================================*/
	
	//cookieMobID需要改为调用cookie中的登录状态,与最新数据，数据以可写服务器为主
	
	var source = $.cookie("wenlongzhangName");
	if (source === null || source === "" || source === undefined) {
		//如果用户没有登录，返回原页
		$(location).attr('href', 'login.html');
	}
	var arr = source.split("||");
	
	/*================*/
	/* 页面配置 - 判断获取的用户Mobid是否正确，如果正确执行页面数据获取填充 */
	/*================*/
	
	if(isMobID(decodeURI(arr[0]))){
		setUserInfo(arr);
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