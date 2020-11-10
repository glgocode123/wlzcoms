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
	function getWserverHistory(mobid){
		$.getJSON("http://d3j1728523.wicp.vip/order?MobID="+mobid, function(jsonData){
			return jsonData;
		});
	}
	
	/*================*/
	/* 写页面功能1 - 填写用户基本信息 */
	/*================*/
	function setUserInfo(userArrInfo) {
		
		//userInfo - cookie数据：0手机号||1服务器状态||2什么数据库||3积分||4金池||5历史记录数量
		//如果是只读数据库进来的
		
		var iPoints = 0,
			iGolden = 0,
			iHistoryR = [],
			iHistoryW = [],
			iCookieHistoryW = [];
		
		//有修改：老用户买过东西（修改） 或 新用户买过东西（修改） true = RWSU & WSU
		//else
		//没修改：老用户没买东西（修改） 或 新用户没买东西（修改） false = RSU & NSU
		if(userArrInfo[2]==="true"){
			//用户下面判断有没有cookie记录
			var wlzNHCookie = $.cookie("wlzNewHistory");
			//老用户买过东西/修改
			if(userArrInfo[1] === "RWSU"){
//				alert("RWSU");
				alert("RWSU:" + wlzNHCookie);
				
				//cookie：没有历史记录
				if(wlzNHCookie === null || wlzNHCookie === "" || wlzNHCookie === undefined || wlzNHCookie === "undefined"){
					//访问可写数据库
					$.getJSON("http://d3j1728523.wicp.vip/user?MobID="+userArrInfo[0], function(jsonData){
						//可写服务器是最新的数据
						iPoints = jsonData[0].Points;
						iGolden = jsonData[0].Golden;
						
						//用户cookie中的数据 !== 获得的服务器数据 = 用户端&可写服务端有被篡改嫌疑
						if(userArrInfo[3] !== iPoints.toString() || userArrInfo[4] !== iGolden.toString()){
							alert("error,用户数据不匹配！");
							$(location).attr("href","404.html");
						}else{
							iHistoryW = getWserverHistory(userArrInfo[0]);
						}
					});
				}else{//老用户，有数据修改//如果有此cookie，说明有修改数据在本地
					alert(wlzNHCookie);
					if(wlzNHCookie.split("|$|").length > 0){
						//有内容
						iCookieHistoryW = wlzNHCookie.split("|$|");
					}else{
						//访问可写数据库
						$.getJSON("http://d3j1728523.wicp.vip/user?MobID="+userArrInfo[0], function(jsonData){
							//可写服务器是最新的数据
							iPoints = jsonData[0].Points;
							iGolden = jsonData[0].Golden;

							//用户cookie中的数据 !== 获得的服务器数据 = 用户端&可写服务端有被篡改嫌疑
							if(userArrInfo[3] !== iPoints.toString() || userArrInfo[4] !== iGolden.toString()){
								alert("error,用户数据不匹配！");
								$(location).attr("href","404.html");
							}else{
								iHistoryW = getWserverHistory(userArrInfo[0]);
							}
						});
					}
				}
				//访问只读数据库
				$.getJSON("user/" + userArrInfo[0] + ".json", function(jsonData){
					//可写服务器才是最新的数据，如果为0，说明获取不到可写数据库数据
					if(iPoints === 0 ){iPoints = jsonData.Points;}
					if(iGolden === 0 ){iGolden = jsonData.Golden;}

					//这里无需判断points和golden的数据是否匹配，因为RWSU最新数据是在写入服务器的
					iHistoryR = jsonData.History;
				});
			}else if(userArrInfo[1]==="WSU"){
				//新用户买过东西/修改
				
				alert("WSU1");
				//刚刚注册的用户，没有买过东西
				if(wlzNHCookie === null || wlzNHCookie === "" || wlzNHCookie === undefined || wlzNHCookie === "undefined"){
					//访问可写数据库
					$.getJSON("http://d3j1728523.wicp.vip/user?MobID="+userArrInfo[0], function(jsonData){
						//可写服务器是最新的数据
						iPoints = jsonData[0].Points;
						iGolden = jsonData[0].Golden;
						
						alert(userArrInfo[3]);
						alert(iPoints);
						alert(userArrInfo[4]);
						alert(iGolden);
						//用户cookie中的数据 !== 获得的服务器数据 = 用户端&可写服务端有被篡改嫌疑
						if(userArrInfo[3] !== iPoints.toString() || userArrInfo[4] !== iGolden.toString()){
							alert("error,用户数据不匹配！");
							$(location).attr("href","404.html");
						}else{
							iHistoryW = getWserverHistory(userArrInfo[0]);
						}
					});
				}else{//有修改数据在本地
					if(wlzNHCookie.split("|$|").length > 0){
						iCookieHistoryW = wlzNHCookie.split("|$|");
					}else{
						//访问可写数据库
						$.getJSON("http://d3j1728523.wicp.vip/user?MobID="+userArrInfo[0], function(jsonData){
							//可写服务器是最新的数据
							iPoints = jsonData[0].Points;
							iGolden = jsonData[0].Golden;

							//用户cookie中的数据 !== 获得的服务器数据 = 用户端&可写服务端有被篡改嫌疑
							if(userArrInfo[3] !== iPoints.toString() || userArrInfo[4] !== iGolden.toString()){
								alert("error,用户数据不匹配！");
								$(location).attr("href","404.html");
							}else{
								iHistoryW = getWserverHistory(userArrInfo[0]);
							}
						});
					}
				}
			}
		}else{
			if(userArrInfo[1] === "RSU"){
				alert("RSU");
				//老用户，今天数据没有任何修改
				//访问只读数据库
				$.getJSON("user/" + userArrInfo[0] + ".json", function(jsonData){
					//可写服务器才是最新的数据
					if(iPoints === 0 ){iPoints = jsonData.Points;}
					if(iGolden === 0 ){iGolden = jsonData.Golden;}
					//用户cookie中的数据 !== 获得的服务器数据 = 用户端有被篡改嫌疑
					if(userArrInfo[3] !== iPoints.toString() || userArrInfo[4] !== iGolden.toString()){
						alert("error,用户数据不匹配！");
						$(location).attr("href","404.html");
					}else{
						iHistoryR = jsonData.History;
					}
				});
			}else if(userArrInfo[1]==="NSU"){
				alert("NSU");
				//刚刚注册的用户，没有修改
//				iHistoryW = [];
				//目前还没有完成，这个判断究竟具体怎么用（提示优惠活动，或者显示用户导向提示）
				alert("你获得新用户首单买一赠一资格！即日起在本站购买任何产品都将获赠：屁眼儿菊花残笔记本一份！");
				
				$("#setHistory").html("<div class='form-wrapper'><div class='empty-space h25-xs h40-md'></div><h7 class='h7'>购物后才有历史记录！</h7><span class='big'>你还没有买过任何产品，购物后将在此显示你的历史购物清单。</span><div class='empty-space h30-xs'></div></div>");
			}else{
				$(location).attr("href","404.html");
			}
		}
		
		//经过以上的流程，如果不跳转到404，用户数据是匹配的，所以
		//下面直接使用用户数据就好
		
		//页面写入：手机号
		$("#iMob").text(userArrInfo[0]);
		
		//页面写入：用户积分
		var userPoints = userArrInfo[3];
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
		$("#iGolden").text(userArrInfo[4]);
		
		
		//只读数据库历史记录太大不记录cookie，因为cookie最好4K以内
		//如果有数据，说明第一次访问，还没有记录cookie
		if(iHistoryW.length > 0){
			//写入cookie，同步写入页面显示，可以减少对写入服务器的访问
			setServerHistory(true, iHistoryW);
		}
		//如果有数据，说明当天购买信息在cookie，同时上面的逻辑是不会执行的
		if(iCookieHistoryW.length > 0){
			setCookieHistory(iCookieHistoryW);
		}
		//如果有数据，说明老用户，读取只读服务器写入数据
		if(iHistoryR.length > 0){
			setServerHistory(false, iHistoryR);
		}
	}
	
	
	/*================*/
	/* 历史购买记录 —— 分为：server和cookie两种调用方法 */
	/*================*/
	function setServerHistory(takeCookie, historyArray) {
		//一边生成历史记录cookie的rSource，一遍写入页面内容，最后才是记录cookie，如果中途断开了，最多这次记录不成功，下次进入这个页面还会在来一次。
		var rSource = "";
		//循环产品块
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
			
			//输入每个产品块的总数据
			rSource += historyArray[i].data + "||" + historyArray[i].AWB + "||" + historyArray[i].price + "||" + historyArray[i].discount + "||" + historyArray[i].Total + "|$|";
			
			//设置单个（块）记录的显示
			setHistoryShow(historyArray[i].data, historyArray[i].AWB, historyArray[i].price, historyArray[i].discount, historyArray[i].Total);
			
			//循环产品列表
			for(var j = 0; j < historyArray[i].prodArr.length; j++){
				//如果是最后一个产品，不要行距
				var prodtype = false;
				
				//设置产品cookie数据
				rSource += historyArray[i].prodArr[j].proID + "||" + historyArray[i].prodArr[j].proName + "||" + historyArray[i].prodArr[j].proParms;
				//如果是最后一个产品加|$|，不是就加|&|
				if(j===historyArray[i].prodArr.length - 1){
					//如果不是最后块，加区分符
					if(i !==  historyArray.length - 1){
						rSource += "|$|";
					}
				}else{
					rSource += "|&|";
					//如果不是最后一个产品，加个行距
					prodtype = true;
				}
				
				//设置单个（块）记录的产品：是否最后一个产品，产品id，产品名称，产品参数
				setHistoryShowProduct( prodtype, historyArray[i].prodArr[j].proID, historyArray[i].prodArr[j].proName, historyArray[i].prodArr[j].proParms);
			}
		}
		alert(rSource);
		//将数据写入cookie，下次就不用再访问数据库，之后购买等操作都会同时修改cookie和服务器，所以内容除非被用户恶意修改，否者是同步的。
		//只记录可写服务器的，因为只读服务器太多数据可能会超过4K
		if(takeCookie){
			$.cookie("wlzNewHistory", rSource, { expires: 1 });
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
				alert(cookieHistoryArray[i]);
				var iDate = cookieHistoryArray[i].split("||");
				setHistoryShow(iDate[0], iDate[1], iDate[9], iDate[10], iDate[11]);
			}else{
				var iProd = cookieHistoryArray[i].split("|&|");
				for(var j = 0; j < iProd.length; j++){
					var jDate = iProd[j].split("||");
					//如果不是最后一个
					if(j !== iProd[j].length - 1){
						setHistoryShowProduct(true, jDate[0], jDate[1], jDate[2]);
					}else{
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
//		var sData = titleString.slice(0,4) + "-" + titleString.slice(4,6) + "-" + titleString.slice(6);//"2020-07-20"
		var sData = titleString;//"2020-07-20"
		var sTracking = "商品将1～2日内发货，并在此查看快递单号";
		if (AWB !== "" || AWB !== undefined || AWB !== null){
			sTracking = "订单号：" + AWB;
		}
		var htmlVarProdMoney = '<div class="comment"><div class="text-center"><hr><span>价格：¥' + price + ', 优惠：' + discount + ', 实付款：' + total + '</span></div></div>';
		
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
		var htmlVarProdImg = "product/" + prodID + "/head-img.jpg";
		var htmlVarProd = '<div class="comment"><img src=' + htmlVarProdImg + ' alt=""><div class="description"><span class="big">' + prodName + '</span><div class="empty-space h10-xs"></div><span>' + prodParms + '</span></div></div>';
		if(prodtype){
			htmlVarProd += '<div class="empty-space h25-xs h45-md"></div>';
		}
		//在块中的价格comment前加入元素，第一个元素comment永远在第一个，价格comment永远在最后
		$("div.form-wrapper:last .comment:last").before(htmlVarProd);
	}
	
	
	
	/*=======================================================================================*/
	
	
	
	//cookieMobID需要改为调用cookie中的登录状态,与最新数据，数据以可写服务器为主
	
	var source = $.cookie("wlzName");
	if (source === null || source === "" || source === undefined || source === "undefined") {
		//如果用户没有登录，返回原页
		$(location).attr('href', 'login.html');
	}
	var userArr = source.split("||");
	
	/*================*/
	/* 页面配置 - 判断获取的用户Mobid是否正确，如果正确执行页面数据获取填充 */
	/*================*/
	
	if(isMobID(decodeURI(userArr[0]))){
		setUserInfo(userArr);
	}else{
		//如果页面id不合适，返回原页
		$(location).attr('href', 'login.html');
	}
	

});