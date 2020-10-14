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
		for(var i = 0; i < hash.length; i++){
			h = hash[i].split("="); //
			params[h[0]] = h[1];
//			alert(h);
		}
		return params;
	}
	
	/*================*/
	/* 功能 - 判断手机号格式是否正确 */
	/*================*/
	function isMobID(mobid){
		var pattern = new RegExp(/^1[3,4,5,7,8][0-9]{9}$/);
//		alert(pattern.exec(prodid));
		if (!pattern.exec(mobid)){return false;}
		return true;
	}
	
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
	
	
	//==================页面初始化逻辑，主要是操作cookie数据===========================
	
	//展示结账页面账单信息
	function setBillInfo(proID, proName, proCount, proPrice, proParms){
		//每次调用增加
		htmlValCount += proCount;
		htmlValParms += proPrice*proCount;
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
	
	//全局变量
	var htmlVal = "",
		htmlValCount = 0,//产品总数
		htmlValParms = 0,//总价格
		htmlValPreferential = 0;//折扣
	
	//cookie中的用户信息
	var	MobID = 0,
		userPoints = 0,
		userGolden = 0;
	var userCookie = $.cookie("wlzName");
	if (userCookie !== null || userCookie !== "" || userCookie !== undefined) {
		var userCookieArr = userCookie.split("||");
		MobID = userCookieArr[0];
		userPoints = userCookieArr[3];
		userGolden = userCookieArr[4];
	}
	//获取页面参数
	//prodida指的是单个产品购买
	var prodida = decodeURI(UrlParamHash(url).prodida),
		//用户判断从产品页过来的直接购买
		prodName = decodeURI(UrlParamHash(url).name),
		prodCount = decodeURI(UrlParamHash(url).count),
		prodPrice = decodeURI(UrlParamHash(url).price),
		prodParms = decodeURI(UrlParamHash(url).parms);
	
	
	//如果获取的手机号正确，初始化填入order-form
	if (isMobID(MobID)){
		$('.order-form input[name="mob"]').val(MobID);
		$('.order-form input[name="mob"]').parent().addClass('focus');
	}else{
		$(location).attr('href', 'login.html?user=false');
	}
	
	//用户信息，买东西一般会变更积分（增加积分）和金池含量（金池优惠抵扣）
	//userID||Points||Golden|&|	//orderID||date||AWB||price||discount||Total|$|proID||proName||proParms|$|proID||proName||proParms|$|proID||proName||proParms|&|	
	//userID||Points||Golden|&|	//orderID||date||AWB||price||discount||Total|$|proID||proName||proParms|$|proID||proName||proParms|$|proID||proName||proParms|&|
	
//e//	数据结构为：订单|$|内容|$|订单|$|内容 ， 例子：
//r//	[0]data||AWB||price||discount||Total
//r//	[1]proID||proName||proParms|&|proID||proName||proParms|&|proID||proName||proParms
//o//	[2]data||AWB||price||discount||Total
//r//	[3]proID||proName||proParms|&|proID||proName||proParms
//!//	Total为0的情况是一定不会出现的，因为如果没有产品何来总价
	
	
	
	//生成订单id：订单时间
	var myDate = new Date();
	var orderDate = myDate.getFullYear() + "-" + (myDate.getMonth()+1) + "-" + myDate.getDate();
	//写入cookie的数据
	var orderCookieValue = "";
	var orderAWB = "订单处理中...";
	//折扣
	var discount = 0;
	
	function isNullOrUndefined(obj){
		if(obj===null||obj===undefined||obj===""||obj==="undefined"||obj==="null"){
			return false;
		}else{
			return true;
		}
	}
	//参数不为空，说明这个是从产品页或者预售页直接过来
	//有的产品没有parms
	if(isNullOrUndefined(prodName) && isNullOrUndefined(prodCount) && isNullOrUndefined(prodPrice)){
		var proID = prodida.substring(0, prodida.length - 1);
		//设置订单信息
		setBillInfo(proID, prodName, prodCount, prodPrice, prodParms);
		//orderID||date||AWB||price||discount||Total|$|proID||proName||proParms
		orderCookieValue = "|$|" + myDate.getTime() + "||" + orderDate + "||" + orderAWB + "||" + prodPrice + "||" + discount + "||" + (prodPrice-discount) + "|$|" + proID + "||" + prodName + "||" + prodParms;
		
	}else{//有可能是从购物车进来的
		//调用，创建实例
		var wlzC = new CartHelper();
		//读取cookie
		var pro_cart = wlzC.Read();
		//购物车cooike有东西
		if(pro_cart.Count > 0){
			//产品数组
			var abc = pro_cart.Items;
			//如果存在值并且>2020000000，结算单个产品(不可能有小于2020000000的值，新网站只有2020后的时间段)
			if( prodida.substring(0, prodida.length - 1) > 2020000000 ){
				//循环判断cookie有没有同样的数据
				for(var i = 0; i < abc.length; i++){
					//如果有同样的prodida，就是从购物车进来的
					if( prodida === abc[i].Id ){
						//设置订单信息
						setBillInfo(abc[i].Id.substring(0, abc[i].Id.length - 1), abc[i].Name, abc[i].Count, abc[i].Price, abc[i].Parms);
						//orderID||date||AWB||price||discount||Total|$|proID||proName||proParms
						orderCookieValue = "|$|" + myDate.getTime() + "||" + orderDate + "||" + orderAWB + "||" + abc[i].Price + "||" + discount + "||" + (abc[i].Price-discount) + "|$|" + abc[i].Id.substring(0, abc[i].Id.length - 1) + "||" + abc[i].Name + "||" + abc[i].Parms;
						continue;
					}
				}
			}else{
				//如果页面没有prodida值传递进来（结账全部产品）
				var oCV = "";
				var oCVPrice = 0;
				for(var j = 0; j < abc.length; j++){
					//设置订单信息
					setBillInfo(abc[j].Id.substring(0, abc[j].Id.length - 1), abc[j].Name, abc[j].Count, abc[j].Price, abc[j].Parms);
					oCVPrice += abc[j].Price;
					//proID||proName||proParms|$|proID||proName||proParms
					oCV = abc[j].Id.substring(0, abc[j].Id.length - 1) + "||" + abc[j].Name + "||" + abc[j].Parms;
				}
				//|$|orderID||date||AWB||price||discount||Total|$|  "+"  oCV
				orderCookieValue = "|$|" + myDate.getTime() + "||" + orderDate + "||" + orderAWB + "||" + oCVPrice + "||" + discount + "||" + (oCVPrice-discount) + "|$|" + oCV;
			}
		}else{
//			alert("啥都木有！");
			//可能是用户历史记录进来的
			$(location).attr('href', '404.html');
		}
	}
	
	//写入页面的html内容
	htmlVal += "";
	//htmlVal:写入页面的内容 || orderCookieValue：写入cookie的内容
	if ( htmlVal === "" || orderCookieValue === ""){
		$(location).attr('href', '404.html');
	}else{
//			$("span#setProdNum").text("共" + pro_cart.Count + "件，");
		$("span#setProdPrice").text("¥" + htmlValParms + ".00");
		if(htmlValPreferential > 0){
			$("span#setProdPrice").parent().after('<div><span style="color: black;">已使用红包（VIP金券），节省了' + htmlValPreferential + '元</span></div>');
		}
//		$("span#setPreferential").text("已使用红包（VIP金券），节省了xxx.xx元");
		//写页面
		$("div#setProdList").html(htmlVal);
	}

	//=============================================================================================
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
			var orderUser = $.trim($('.order-form input[name="name"]').val());
			var orderAddress = $.trim($('.order-form textarea[name="address"]').val());
			var newJSONData = "{" + MobID + "||" + userPoints + "||" + userGolden + "||" + orderUser + "||" + orderAddress + orderCookieValue + "}";
			
			alert(newJSONData);
			
			//写入cookie，在立即支付页面再写入数据库
			$.cookie("wlzOrder" , newJSONData , { expires: 1 });
			
			//发送交易请求到w数据库
			$.ajax({
				type: "POST",
				url: "http://d3j1728523.wicp.vip/",
				async: false,
				contentType: "application/json; charset=utf-8",
				data: newJSONData,
				dataType: "json",
				success: function (message) {
					alert(message);
					if (message > 0) {
						$(location).attr('href', 'pay.html');
					}
				},
				error: function(XMLHttpRequest, textStatus, errorThrown) {
					console.log(XMLHttpRequest.status);
					console.log(XMLHttpRequest.readyState);
					console.log(textStatus);
					console.log(errorThrown);
				}
//				error: function (message) {
//					updateTextPopup("Error","您的订单未能提交，请稍后再试！(ErCode:"+message+")");
//				}
			});
//			
//			//如果数据正确
//			$(location).attr('href', 'i.html');
			
        }
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