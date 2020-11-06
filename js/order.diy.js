// JavaScript Document
$(function () {

	"use strict";
	
	/*=======================================================================================*/
	// 介绍：
	// 1、购物车逻辑
	// 2、页面初始化
	// 3、写入cookie
	// 4、页面展示控制
	// 5、页面事件控制
	/*=======================================================================================*/
	
	//上级页面只有cart和直接购买（预售）
	//三种：直接购买单个产品，购物车单个产品，购物车全部产品
	
	//w服务器中的积分&金池都是今天的量，不会将只读服务器的历史量加进来，而且用户i.page中也只是显示只读的

	/*=======================================================================================*/
	// 购物车逻辑
	/*=======================================================================================*/

	//JS中this指的是全局变量,假如全局变量没有此参数时相当于在此方法中重新定义,如果全局变量中有此参数那么this仍然绑定到外部函数的this变量上

	//购物车
	var Cart = function () {
		this.Count = 0;
		this.Total = 0;
		this.Items = [];
	};
	//购物车集合对象
	var CartItem = function () {
		this.Id = 0;
		this.Name = "";
		this.Count = 0;
		this.Price = 0;
		this.Parms = "";
	};

	//购物车操作
	var CartHelper = function () {
		this.cookieName = "wlzCart";
		
		//清空购物车cookie
		this.Clear = function () {
			var cart = new Cart();
			this.Save(cart);
			return cart;
		};

		//向购物车添加
		this.Add = function (id, name, count, price, parms) {
			alert("_id:"+id+"名:"+name+"数量:"+count+"价格:"+price+"参数(备注)："+parms);
			
			var cart = this.Read();
			var index = this.Find(id);

			if (count === 0) {
				this.Del(id);

			} else {
				//如果ID已存在，覆盖数量，修改总价
				if (index > -1) {
					//购物车总价格-选中产品的价格
					cart.Total -= (((cart.Items[index].Count * 100) * (cart.Items[index].Price * 100)) / 10000);
					//购物车产品集合
					cart.Items[index].Count = count;
					//购物车总价格+更改数量后产品的价格
					cart.Total += (((cart.Items[index].Count * 100) * (cart.Items[index].Price * 100)) / 10000);

				} else {
					var item = new CartItem();
					item.Id = id;
					item.Name = name;
					item.Count = count;
					item.Price = price;
					item.Parms = parms;
					cart.Items.push(item);
					cart.Count++;
					cart.Total += (((item.Count * 100) * (item.Price * 100)) / 10000);
					// console.log(cart);
					// cart.Total += (((cart.Items[index].Count * 100) * (cart.Items[index].Price * 100)) / 10000);
				}
				cart.Total = Math.round(cart.Total * 100) / 100;
				this.Save(cart);
			}

			return cart;
		};
		//改变数量
		this.Change = function (id, count) {
			var cart = this.Read();
			var index = this.Find(id);
			cart.Items[index].Count = count;
			this.Save(cart);
			return cart;
		};
		//移出购物车
		this.Del = function (id) {
			var cart = this.Read();
			var index = this.Find(id);
			if (index > -1) {
				var item = cart.Items[index];
				cart.Count--;
				cart.Total = cart.Total - (((item.Count * 100) * (item.Price * 100)) / 10000);
				cart.Items.splice(index, 1);
				this.Save(cart);
			}

			return cart;

		};
		//根据ID查找，对应的数组位置0～n
		this.Find = function (id) {
			var cart = this.Read();
			var index = -1;
			for (var i = 0; i < cart.Items.length; i++) {
				if (cart.Items[i].Id === id) {
					index = i;
				}
			}
			return index;
		};
		//COOKIE操作
		this.Save = function (cart) {
			var source = "";
			for (var i = 0; i < cart.Items.length; i++) {
				if (source !== "") {
					source += "|$|";
				}
				source += this.ItemToString(cart.Items[i]);
			}
			$.cookie(this.cookieName, source);
		};
		//读取COOKIE中的集合
		this.Read = function () {
			var source = $.cookie(this.cookieName);
			alert(source);
			var cart = new Cart();
			if (source === null || source === "" || source === undefined) {
				return cart;
			}
			var arr = source.split("|$|");
			cart.Count = arr.length;
			for (var i = 0; i < arr.length; i++) {
				var item = this.ItemToObject(arr[i]);
				cart.Items.push(item);
				cart.Total += (((item.Count * 100) * (item.Price * 100)) / 10000);
			}
			return cart;
		};
		this.ItemToString = function (item) {
			return item.Id + "||" + encodeURIComponent(item.Name) + "||" + item.Count + "||" + item.Price + "||" + encodeURIComponent(item.Parms);
		};
		this.ItemToObject = function (str) {
			var arr = str.split('||');
			var item = new CartItem();
			item.Id = arr[0];
			item.Name = decodeURIComponent(arr[1]);
			item.Count = arr[2];
			item.Price = arr[3];
			item.Parms = decodeURIComponent(arr[4]);
			return item;
		};
	};
	
	/*=======================================================================================*/
	// 全局功能
	/*=======================================================================================*/
	
	
	/*================*/
	/* 功能 - 判断手机号格式是否正确 */
	/*================*/
	function isMobID(mobid){
		var pattern = new RegExp(/^1[3,4,5,7,8][0-9]{9}$/);
//		alert(pattern.exec(prodid));
		if (!pattern.exec(mobid)){return false;}
		return true;
	}
	
	/*================*/
	/* 功能 - 消息框 —— 插件 */
	/*================*/
	function updateTextPopup(title, text){
		$('.text-popup .text-popup-title').text(title);
		$('.text-popup .text-popup-message').text(text);
		$('.text-popup').addClass('active');
	}
	
	function isNullOrUndefined(obj){
		if(obj===null||obj===undefined||obj===""||obj==="undefined"||obj==="null"){
			return true;
		}else{
			return false;
		}
	}
	
	//展示结账页面账单信息
	function setBillInfo(proID, proName, proCount, proPrice, proParms){
		var	proImg = "",
			proTitle = "",
			htmlRowSpacing = "",
			proParmsCount = "";
		htmlRowSpacing = "<div class='empty-space h25-xs h45-md'></div>";
		proImg = "<img src='product/" + proID + "/head-img.jpg'>";
		proTitle = "<span class='big'>" + proName + "</span>";
		proPrice = "<span>价格：¥" + proPrice + ".00</span>";
		proParmsCount = "<p>" + proParms + "\xa0\xa0|\xa0\xa0数量:" + proCount + "件</p>";

		htmlVal += htmlRowSpacing + "<div class='comment'>"+ proImg + "<div class='description'> " + proTitle + proPrice + "<div class='empty-space h10-xs'></div>" + proParmsCount + "<div class='empty-space h15-xs'></div></div></div>";
		
	}
	
	
	/*=======================================================================================*/
	// 2、页面初始化
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
//		alert(hash);
		for(var i = 0; i < hash.length; i++){
			h = hash[i].split("="); //
			params[h[0]] = h[1];
//			alert(h);
		}
		return params;
	}
	
	
	//全局变量
	var htmlVal = "",
//		htmlValCount = 0,//产品总数
		htmlValParms = 0,//总价格
		//计算出剩下的金池(当前金池 - 本次可用金池)
		countGolden = 0,
		htmlValPreferential = 0;//折扣
	
	//cookie中的用户信息
	var	MobID = 0,
		userPoints = 0,
		userGolden = 0,
		userCookie = $.cookie("wlzName");
	if (userCookie === null || userCookie === "" || userCookie === undefined) {
		$(location).attr('href', 'login.html');
	}else{
		var userCookieArr = userCookie.split("||");
		MobID = userCookieArr[0];
		userPoints = userCookieArr[3];
		userGolden = userCookieArr[4];
		
		//如果获取的手机号正确，初始化填入order-form
		if (isMobID(MobID)){
			//为收货手机号赋值，并设置状态
			$('.order-form input[name="mob"]').val(MobID);
			$('.order-form input[name="mob"]').parent().addClass('focus');
		}else{
			$(location).attr('href', 'login.html?user=false');
		}
	}
	
	
	
	
	/*=======================================================================================*/
	// 3、
	/*=======================================================================================*/
	
	//写入数据库并生成cookie
	function submitData(orderCookieProArrValue, orderJSONProArrValue){
	
		//生成订单id：订单时间
		var myDate = new Date();
		var orderDate = myDate.getFullYear() + "-" + (myDate.getMonth()+1) + "-" + myDate.getDate();
		var orderAWB = "订单处理中...";
		
		//收货人基本信息
		var orderMobNum = $.trim($('.order-form input[name="mob"]').val());
		var orderUser = $.trim($('.order-form input[name="name"]').val());
		var orderAddress = $.trim($('.order-form textarea[name="address"]').val());
	
		/*================*/
		/* 数据 -  newCookieData：cookie数据结构*/
		/*================*/
		
		//用户信息，买东西一般会变更积分（增加积分）和金池含量（金池优惠抵扣）
		//userID||Points||Golden|&|	//orderID||date||AWB||price||discount||Total|$|proID||proName||proParms|$|proID||proName||proParms|$|proID||proName||proParms|&|	
		//userID||Points||Golden|&|	//orderID||date||AWB||price||discount||Total|$|proID||proName||proParms|$|proID||proName||proParms|$|proID||proName||proParms|&|
	
//e//	数据结构为：订单|$|内容|$|订单|$|内容 ， 例子：
//r//	[0]data||AWB||price||discount||Total
//r//	[1]proID||proName||proParms|&|proID||proName||proParms|&|proID||proName||proParms
//o//	[2]data||AWB||price||discount||Total
//r//	[3]proID||proName||proParms|&|proID||proName||proParms
//!//	Total为0的情况是一定不会出现的，因为如果没有产品何来总价
		
		//记录订单cookie（格式：订单id || 订单时间 || 订单状态AWB || 订单手机号 || 订单用户名 || 订单用户地址 || 总价 || 折扣 || 折后总价 + ——剩下的数据 ）
		alert(htmlValPreferential);
		var orderID = myDate.getTime();
		var newCookieData = orderID + "||" + orderDate + "||" + orderAWB + "||" + orderMobNum + "||" + orderUser + "||" + orderAddress + "||" + htmlValParms + "||" + htmlValPreferential + "||" + (htmlValParms - htmlValPreferential) +  orderCookieProArrValue;
		
		alert(newCookieData);

		//写入cookie，在立即支付页面再写入数据库
		$.cookie("wlzOrder" , newCookieData , { expires: 1 });
		
		/*================*/
		/* 数据提交user*/
		/*================*/
		
		//计算出获得的积分（当前积分 + 本次购物应获的积分）
		var countPoints = userWServerPoints + Math.round(htmlValParms/10);
			
		var newJSONDataUser = '{"MobID":' + MobID + ',"Points":' + countPoints + ',"Golden":' + countGolden + ',"Buy":true' + ',"Bad":false}';
		//判断是新增还是修改，只有user才会用，order只使用新增
		var ajaxType = "";
		if(userItemID === ""){
			ajaxType = "post";
		}else{
			ajaxType = "PUT";
		}
		alert("http://d3j1728523.wicp.vip/user" + userItemID);
		alert(newJSONDataUser);
		//发送交易请求到w数据库
		$.ajax({
			type: ajaxType,
			url: "http://d3j1728523.wicp.vip/user" + userItemID,
			async: false,
			contentType: "application/json",//; charset=utf-8
			data: newJSONDataUser,
			dataType: "json",
			success: function () {
		
				/*================*/
				/* 数据提交order*/
				/*================*/
				var newJSONDataOrder = '{"orderID":' + orderID + ',"MobID":' + MobID + ',"data":"' + orderDate + '","AWB":"' + orderAWB + '","MobNum":' + orderMobNum + ',"Name":"' + orderUser + '","Address":"' + orderAddress + '","Points":[' + 'true,' + Math.round(htmlValParms/10) + '],"Golden":[' + 'false,' + htmlValPreferential + '],"price":' + htmlValParms + ',"discount":' + htmlValPreferential + ',"Total":' + (htmlValParms - htmlValPreferential) + orderJSONProArrValue + "}";

				alert(newJSONDataOrder);

				//发送交易请求到w数据库
				$.ajax({
					type: "post",
					url: "http://d3j1728523.wicp.vip/order",
					async: false,
					contentType: "application/json",//; charset=utf-8
					data: newJSONDataOrder,
					dataType: "json",
					success: function () {
						$(location).attr('href', 'pay.html');
					},
					error: function(XMLHttpRequest, textStatus, errorThrown) {
						console.log(XMLHttpRequest.status);
						console.log(XMLHttpRequest.readyState);
						console.log(textStatus);
						console.log(errorThrown);
						$.removeCookie('wlzOrder',{ path: '/'}); 
						alert("您的订单未能提交，请稍后再试！");
						$(location).attr('href', 'index.html');
					}
		//				error: function (message) {
		//					updateTextPopup("Error","您的订单未能提交，请稍后再试！(ErCode:"+message+")");
		//				}
				});
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				console.log(XMLHttpRequest.status);
				console.log(XMLHttpRequest.readyState);
				console.log(textStatus);
				console.log(errorThrown);
				$.removeCookie('wlzOrder',{ path: '/'}); 
				alert("您的订单未能提交，请稍后再试！");
				$(location).attr('href', 'index.html');
			}
//				error: function (message) {
//					updateTextPopup("Error","您的订单未能提交，请稍后再试！(ErCode:"+message+")");
//				}
		});
		
//			
//			//如果数据正确
//			$(location).attr('href', 'i.html');
	}
	
	/*=======================================================================================*/
	// 4、页面展示控制 & 数据初始化
	/*=======================================================================================*/
	
	
	//获取页面参数
	//prodida指的是单个产品购买
	var prodida = decodeURI(UrlParamHash(url).prodida),
		//直接购买
		prodid = decodeURI(UrlParamHash(url).prodid),
		//用户判断从产品页过来的直接购买
		prodName = decodeURI(UrlParamHash(url).name),
		prodCount = decodeURI(UrlParamHash(url).count),
		prodPrice = decodeURI(UrlParamHash(url).price),
		prodParms = decodeURI(UrlParamHash(url).parms);
	
	//写入cookie的数据
	var orderCookieValue = "";
	//写入服务器的数据，和写入cookie是一样的数据，但是格式不同
	var orderJSONValue = "";
	
	//参数不为空，说明这个是从 "产品页" 或者 "预售页" 直接过来(直接购买)
	//有的产品没有parms
	if(!isNullOrUndefined(prodName) && !isNullOrUndefined(prodCount) && !isNullOrUndefined(prodPrice)){
		
		//结算单个产品的产品总价
		htmlValParms = prodPrice;
		
		alert(0);
		var proID = 0;
		//获得proID
		if(isNullOrUndefined(prodid) && !isNullOrUndefined(prodida)){
			proID = prodida.substring(0, prodida.length - 1);
		}else{
			proID = prodid;
		}
		
		//设置订单信息（url的参数）
		setBillInfo(proID, prodName, prodCount, prodPrice, prodParms);
		
		
		//订单数组（|$|proID||proName||proParms）
		orderCookieValue = "|$|" + proID + "||" + prodName + "||" + prodParms;
		
		orderJSONValue = ',"prodArr":[{' + '"proID":"' + proID + '","proName":"' + prodName + '","proParm":"' + prodParms + '"}]';
		
	}else{//有可能是从购物车进来的
		
		alert(1);
		//调用，创建实例
		var wlzC = new CartHelper();
		//读取cookie
		var pro_cart = wlzC.Read();
		//购物车cooike有东西
		if(pro_cart.Count > 0){
			//产品数组
			var abc = pro_cart.Items;
			
			//如果存在prodida值，并且>2020000000，结算单个产品(不可能有小于2020000000的值，新网站只有2020后的时间段)
			if( prodida.substring(0, prodida.length - 1) > 2020000000 ){
				//循环判断cookie有没有同样的数据
				for(var i = 0; i < abc.length; i++){
					//如果有同样的prodida，就是从购物车进来的
					if( prodida === abc[i].Id ){
						
						//结算单个产品的产品总价
						htmlValParms = abc[i].Price;
						
						//设置订单信息
						setBillInfo(abc[i].Id.substring(0, abc[i].Id.length - 1), abc[i].Name, abc[i].Count, abc[i].Price, abc[i].Parms);
						
						//订单数组（|$|proID||proName||proParms）
						orderCookieValue = "|$|" + abc[i].Id.substring(0, abc[i].Id.length - 1) + "||" + abc[i].Name + "||" + abc[i].Parms;
		
						orderJSONValue = ',"prodArr":[{' + '"proID":' + abc[i].Id.substring(0, abc[i].Id.length - 1) + ',"proName":' + abc[i].Name + ',"proParm":' + abc[i].Parms + '}]';
						continue;
					}
				}
			}else{//如果页面没有prodida值传递进来（结账全部产品）
				
				orderJSONValue = ',"prodArr":[';
				
				for(var j = 0; j < abc.length; j++){
					
					//累计购物车产品的总价
					htmlValParms += abc[j].Price;
					
					//设置订单信息
					setBillInfo(abc[j].Id.substring(0, abc[j].Id.length - 1), abc[j].Name, abc[j].Count, abc[j].Price, abc[j].Parms);
					
					//订单数组 |$|proID||proName||proParms|$|proID||proName||proParms
					orderCookieValue = "|$|" + abc[j].Id.substring(0, abc[j].Id.length - 1) + "||" + abc[j].Name + "||" + abc[j].Parms;
					
					orderJSONValue += '{"proID":' + abc[j].Id.substring(0, abc[j].Id.length - 1) + ',"proName":' + abc[j].Name + ',"proParm":' + abc[j].Parms + '}';
					//最后一个不加“，”号
					if(j !== abc.length - 1){
						orderJSONValue += ',';
					}
				}
				
				orderJSONValue = ']';
				
			}
		}else{
//			alert("啥都木有！");
			//可能是用户历史记录进来的
			$(location).attr('href', '404.html');
		}
	}
//		htmlValCount = 0,//产品总数
//		htmlValParms = 0,//总价格
//		htmlValPreferential = 0;//折扣
	
	//获得数据库用户今日修改数据
	var isOldUser = false,
		isNewUser = false,
		userWServerPoints = 0,
		userWServerGolden = 0,
		userItemID = "";
			
	//1、首先判断固定服务器（用此顺序因为要判断黑户，防止用户修改可写服务器）
	$.getJSON("user/" + MobID + ".json", function(jsonDataUserInfo){

		//如果用户是黑户，删除用户登录信息，跳转404
		if(jsonDataUserInfo.Bad){
			$.removeCookie('wlzName',{ path: '/'});
			$(location).attr('href', '404.html');
		}

		//老用户
		if(jsonDataUserInfo.length > 0){

			isOldUser = true;
			userWServerPoints += jsonDataUserInfo.Points;
			userWServerGolden += jsonDataUserInfo.Golden;

		}else{//不是老用户

			userWServerPoints = 0;
			userWServerGolden = 0;
		}

	});
	//2、然后判断可写服务器（如果可写服务器有数据，这样的顺序也能替换成最新数据）
	$.getJSON("http://d3j1728523.wicp.vip/user?MobID="+MobID, function(jsonData){
		
		//如果用户是黑户，删除用户登录信息，跳转404
		if(jsonData[0].Bad){
			$.removeCookie('wlzName',{ path: '/'});
			$(location).attr('href', '404.html');
		}
		
		//如果今天有数据（新注册用户/老用户有修改）
		if(jsonData.length > 0){
			
			isNewUser = true;
			userItemID = "/" + jsonData[0].id;
			userWServerPoints += jsonData[0].Points;
			userWServerGolden += jsonData[0].Golden;
			
		}else{//如果w服务器也没有用户数据
			
			//也不是老用户
			if(!isOldUser){//不是用户，一般情况下不可能进入这个页面
				$.removeCookie('wlzName',{ path: '/'});
				$(location).attr('href', '404.html');
			}
		}
	});
	
	//计算出将要使用的金池 htmlValPreferential
	//如果总价应用的金池数 小于 金池总数
	if(userWServerGolden > Math.floor(htmlValParms*15/100)){
		//可用的金池数
		htmlValPreferential = Math.floor(htmlValParms*15/100);
		//剩余的金池数
		countGolden = userWServerGolden - htmlValPreferential;
	}else{
		//可用的金池数
		htmlValPreferential = userWServerGolden;
		//将金池用完
		countGolden = 0;
	}
	
	//写入页面的html内容
	htmlVal += "";
	//htmlVal:写入页面的内容 || orderCookieValue：写入cookie的内容
	if ( htmlVal === "" || orderCookieValue === "" || orderJSONValue === ""){
		alert(3);
		$(location).attr('href', '404.html');
	}else{
		alert(4);
//			$("span#setProdNum").text("共" + pro_cart.Count + "件，");
		$("span#setProdPrice").text("¥" + (htmlValParms - htmlValPreferential) + ".00");
		if(htmlValPreferential > 0){
			$("span#setProdPrice").parent().after('<div><span style="color: black;">已使用折扣（金池），节省了' + htmlValPreferential + '元</span></div>');
		}
		//写页面
		$("div#setProdList").html(htmlVal);
	}
	
	/*=======================================================================================*/
	// 5、页面事件控制
	/*=======================================================================================*/
	
	//提交事件&数据逻辑
	$('#btnOrder').on("click", function(){
		var $this = $('.order-form');
						   
		$('.invalid').removeClass('invalid');						   
		var msg = '以下必填项不正确：',
//			successMessage = "商品将1～2日内发货，彼时可在会员中心查看快递单号.",
			error = 0;
		//如果输入的不是正确的手机号
//        if ($.trim($('.order-form input[name="mob"]').val()) === '') 
        if (!isMobID($.trim($('.order-form input[name="mob"]').val()))) 
		{error = 1; $this.find('input[name="mob"]').parent().addClass('invalid'); msg = msg +  '\n - 手机号';}
		//如果原先有手机号但是输入没有内容
		if ($.trim($('.order-form input[name="name"]').val()) === '') 
		{error = 1; $this.find('input[name="name"]').parent().addClass('invalid'); msg = msg +  '\n - 收货人';}
		if ($.trim($('.order-form textarea[name="address"]').val()) === '') 
		{error = 1; $this.find('textarea[name="address"]').parent().addClass('invalid'); msg = msg +  '\n - 收货地址';}

        if (error){
        	updateTextPopup('ERROR', msg);
        }else{
			
			//获得Cookie用户今日的购买历史
			var wlzNHCookie = $.cookie("wlzNewHistory");
			
			
			//今天有操作（w服务器）
			if(isNewUser){
				//本地没cookie购买历史
				if(isNullOrUndefined(wlzNHCookie)){
					
					//有wlzNewHistory cookie的时候，与数据库对比
					if(userWServerPoints.toString() === userPoints && userWServerGolden.toString() === userGolden){
						
						submitData(orderCookieValue, orderJSONValue);
						
					}else{//本地或者数据库可能被串改
						alert("1404");
						$(location).attr('href', '404.html');
					}
					
				}else{//本地cookie可能被删除
					$.removeCookie('wlzName',{ path: '/'}); 
					alert("ERROR!请从新登录！");
					$(location).attr('href', 'login.html');
				}
			}else if(!isNewUser){//今天没有操作（w服务器）
				//但本地有修改数据
				if(isNullOrUndefined(wlzNHCookie)){
					
					alert("2404");
					//本地或者数据库可能被串改
					$(location).attr('href', '404.html');
					
				}else{//本地没有数据
					
					submitData(orderCookieValue, orderJSONValue);
					
				}
			}else{//？？？这个情况应该不会出现
				alert("3404");
				$(location).attr('href', '404.html');
			}
			
			
        }
	});
	
	//输入框事件，用于操作那个黑色提示浮块
	$(document).on('keyup', '.input-wrapper .input', function(){
		$(this).parent().removeClass('invalid');
	});
	
});