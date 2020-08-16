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


	//JS中this指的是全局变量,假如全局变量没有此参数时相当于在此方法中重新定义,如果全局变量中有此参数那么this仍然绑定到外部函数的this变量上

	//购物车
	var Cart = function () {
		this.Count = 0;
		this.Total = 0;
//		this.Items = new Array();
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
		this.cookieName = 'wenlongzhangCart';
		
		//清空购物车cookie
		this.Clear = function () {
			var cart = new Cart();
			this.Save(cart);
			return cart;
		};

		//向购物车添加
		this.Add = function (id, name, count, price, parms) {
			alert("_id:"+id+"名:"+name+"数量:"+count+"价格:"+price+"参数(备注)："+parms);
			
			//加入功能——如果参数不同，生成不同ID
			//加入功能——END
			
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
	

	//==================在cookie购物车模板中，把数据渲染出来，并调用js:===========================
	//设置页面=渲染数据
	function setHtml(){
		//读取cookie
		var pro_cart = xc.Read();
		//产品数组
		var abc = pro_cart.Items;
		//cooike有东西
		if(pro_cart.Count > 0){
			var htmlVal = "";
			for(var i = 0; i < abc.length; i++){
				var proID = abc[i].Id.substring(0, abc[i].Id.length - 1),
					proImg = "<img src='product/" + proID + "/head-img.jpg'>",
					proTitle = "<span class='big'>" + abc[i].Name + "</span>",
					htmlRowSpacing = "<div class='empty-space h10-xs'></div>",
					proPrice = "<span>价格：¥" + abc[i].Price + ".00</span>",
					proParms = "<p>" + abc[i].Parms + "</p>",
					htmlRowSpacing2 = "<div class='empty-space h15-xs'></div>",
					proCount = "<a class='btn-style3 reduceCount'>-</a>\xa0\xa0<span>" + abc[i].Count + "</span>\xa0\xa0<a class='btn-style3 addCount'>+</a>\xa0",
					proBuy = "<a class='btn-style1 proBuy' href='#'><span>单独购买</span></a>",
					proDel = "<a class='btn-style1 proDel' href='#'><span>移除</span></a>";
				
				htmlVal += "<div class='comment'>" + proImg + "<div class='description' value='" + abc[i].Id + "'>" + proTitle + htmlRowSpacing + proPrice + proParms + htmlRowSpacing2 + proCount + proBuy + proDel + "</div></div>";
				//判断是否最后一个数据区域
				if ( i === abc.length - 1 ){
					htmlVal += "<div class='empty-space h25-xs h45-md'></div>";
				}
			}
			htmlVal += "";
			$("div#setCartPro").html(htmlVal);
		}else{
			alert("购物车中啥都木有！");
		}
	}
	
	//==================END================================================================
	
	//==================渲染数据后产品列表中的逻辑=============================================
	//增加数量
	$("a.addCount").on("click", function(){
		$(this).next().text($(this).next().text()+1);
	}).blur(function(){
		xc.Change($(this).parent().val(), $(this).next().text());
	});
	//减少数量
	$("a.reduceCount").on("click", function(){
		//当前Count是1
		if($(this).prev().text() <= 1){
//			xc.Del($(this).parent().val());
//			$(this).parent().parent().remove();
			$(this).prev().text(1);
		}else{
			$(this).prev().text($(this).prev().text()-1);
		}
	}).blur(function(){
		xc.Change($(this).parent().val(), $(this).prev().text());
	});
	//单独购买
	$("a.proBuy").on("click", function(){
		xc.Del($(this).parent().val());
		$(location).attr("href", "order.html?");
	});
	//删除
	$("a.proDel").on("click", function(){
		xc.Del($(this).parent().val());
		$(this).parent().parent().remove();
	});
	//==================END================================================================
	
	/*=======================================================================================*/
	
	//cookieMobID需要改为调用cookie中的登录状态，成功就返回手机号
//	var cookieMobID;
	
	/*================*/
	/* 页面配置 - 判断获取的用户Mobid是否正确，如果正确执行页面数据获取填充 */
	/*================*/
//	var userMobID = 0;
//	//判断 - 页面传入的Mob是否正确
//	if(isMobID(decodeURI(UrlParamHash(url).Mob))){
//		cookieMobID = UrlParamHash(url).Mob;
//		//如果获取的手机号正确,记录手机号，用于提交？
//		userMobID = cookieMobID;
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
	
	//==================END================================================================
	
	//==================页面初始化逻辑，主要是操作cookie数据===========================
	
	//调用，创建实例
	var xc = new CartHelper();
	
	//模拟获取页面参数
	var prodid = decodeURI(UrlParamHash(url).prodid),
		prodName = decodeURI(UrlParamHash(url).name),
		prodPrice = decodeURI(UrlParamHash(url).price),
		prodParms = decodeURI(UrlParamHash(url).parms);
		
	//判断是否有必要参数，如果没有或者参数错误，都当成页面没有传参处理
	if(prodid > 2020000000 && prodName.length > 0 && prodPrice > 0 ){
		//读取cookie
		var pro_cart = xc.Read();
		//产品数组
		var abc = pro_cart.Items;
		//
		var cookieID = "",
			cookieIDCount = 0,
			subProdID = []; 
		//判断是否有参数的产品
		if(prodParms.length > 0) {
			//遍历产品
			for (var i = 0; i < pro_cart.Items.length; i++) {
				//如果cookieID是prodid衍生的实例
				if (prodid === abc[i].Id.substring(0, abc[i].Id.length - 1)){
					//找出有相同参数得选项
					if (prodParms === abc[i].Parms){
						//如果有，xc.Add
						cookieID = abc[i].Id;
						cookieIDCount = abc[i].Count - 0 + 1;
						continue;
					}
					//记录同一产品出现的所有不同实例
					subProdID.push(abc[i].Id.charAt(abc[i].Id.length - 1));
				}
			}
			//cookie中没有出现过相同的实例
			if(cookieID === "" && cookieIDCount === 0){
				//如果没有找到任何prodid的实例（*可能没有cookie/或者没有加这个产品的情况）
				if (subProdID.length <= 0){
					cookieID = prodid + "a";
					cookieIDCount = 1;
				}else{
					outermost:
					for(var j = 0; j < 26; ++j){
						for(var k = 0; k < subProdID.length; k++){
							//从26个小写字母中选择一个之前没有出现过的实例
							if(String.fromCharCode(97+j) !== subProdID[k]){
								cookieID = prodid + String.fromCharCode(97+j);
								cookieIDCount = 1;
								continue outermost;
							}
						}
					}
				}
			}
			//生成cookieID，并写入参数
			pro_cart = xc.Add(cookieID, prodName, cookieIDCount, prodPrice, prodParms);
		}else{
			//循环目前的cookie，看有没有相同产品
			for (var l = 0; l < pro_cart.Items.length; l++) {
				if ((prodid+"a") === abc[l].Id){
					//如果找到了相同的产品，数量+1
					cookieIDCount = abc[l].Count - 0 + 1;
					continue;
				}
			}
			//如果找不到相同产品，就增加一个产品
			if(cookieIDCount <= 0){
				cookieIDCount = 1;
			}
			//直接生成cookieID(因为没有参数，所有只能改数量)，并写入参数
			pro_cart = xc.Add(prodid + "a", prodName , cookieIDCount, prodPrice, prodParms);
		}
		//写入cookie后，刷新页面
		$(location).attr("href", "cart.html");
	}else{
		//如果页面没有传递参数进来
		setHtml();
	}

	
		
	
		
});