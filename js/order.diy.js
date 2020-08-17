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
	
	//调用，创建实例
	var xc = new CartHelper();
	
	//获取页面参数
	var prodida = decodeURI(UrlParamHash(url).prodida),
//		MobID = decodeURI(UrlParamHash(url).Mob);
		MobID = $.cookie('wenlongzhangName');
	
	
	//页面数据初始化
//	if($.cookie('wenlongzhangName') === MobID){
//		//如果获取的手机号正确，初始化填入order-form
//		if (isMobID(MobID)){
//			$('.order-form input[name="mob"]').val(MobID);
//			$('.order-form input[name="mob"]').parent().addClass('focus');
//		}else{
//			$(location).attr('href', 'login.html?user=false');
//		}
//	}else{
//		$(location).attr('href', 'login.html');
//	}
	
	//如果获取的手机号正确，初始化填入order-form
	if (isMobID(MobID)){
		$('.order-form input[name="mob"]').val(MobID);
		$('.order-form input[name="mob"]').parent().addClass('focus');
	}else{
		$(location).attr('href', 'login.html?user=false');
	}
	
	//读取cookie
	var pro_cart = xc.Read();
	
	//cooike有东西
	if(pro_cart.Count > 0){
		
		var htmlVal = "";
			
		//产品数组
		var abc = pro_cart.Items;
			
		var proID = "",
			proImg = "",
			proTitle = "",
			htmlRowSpacing = "",
			proPrice = "",
			proParmsCount = "";
		
		//如果有参数，结算目标产品
		if( prodida.substring(0, prodida.length - 1) > 2020000000 ){
			for(var i = 0; i < abc.length; i++){
				if( prodida === abc[i].Id ){
					htmlRowSpacing = "<div class='empty-space h25-xs h45-md'></div>";
					proID = abc[i].Id.substring(0, abc[i].Id.length - 1);
					proImg = "<img src='product/" + proID + "/head-img.jpg'>";
					proTitle = "<span class='big'>" + abc[i].Name + "</span>";
					proPrice = "<span>价格：¥" + abc[i].Price + ".00</span>";
					proParmsCount = "<p>" + abc[i].Parms + "\xa0\xa0|\xa0\xa0数量:" + abc[i].Count + "件</p>";
					
					htmlVal += htmlRowSpacing + "<div class='comment'>"+ proImg + "<div class='description'> " + proTitle + proPrice + "<div class='empty-space h10-xs'></div>" + proParmsCount + "<div class='empty-space h15-xs'></div></div></div>";
					continue;
				}
			}
		}else{
			//如果页面没有传递参数进来（结账全部产品）
			for(var j = 0; j < abc.length; j++){
				htmlRowSpacing = "<div class='empty-space h25-xs h45-md'></div>";
				proID = abc[j].Id.substring(0, abc[j].Id.length - 1);
				proImg = "<img src='product/" + proID + "/head-img.jpg'>";
				proTitle = "<span class='big'>" + abc[j].Name + "</span>";
				proPrice = "<span>价格：¥" + abc[j].Price + ".00</span>";
				proParmsCount = "<p>" + abc[j].Parms + "\xa0\xa0|\xa0\xa0数量:" + abc[j].Count + "件</p>";

				htmlVal += htmlRowSpacing + "<div class='comment'>" + proImg + "<div class='description'> " + proTitle + proPrice + "<div class='empty-space h10-xs'></div>" + proParmsCount + "<div class='empty-space h15-xs'></div></div></div>";
			}
		}
		
		htmlVal += "";
		if ( htmlVal === "" ){
			$(location).attr('href', '404.html');
		}else{
			$("span#setProdNum").text("共" + pro_cart.Count + "件，");
			$("span#setProdPrice").text("¥" + pro_cart.Total + ".00");
			$("span#setPreferential").text("已使用红包（VIP金券），节省了xxx.xx元");
			//写页面
			$("div#setProdList").html(htmlVal);
		}
	}else{
		alert("啥都木有！");
	}

	//=============================================================================================
	$('#btnOrder').on("click", function(){
		var $this = $('.order-form');
						   
		$('.invalid').removeClass('invalid');						   
		var msg = '以下必填项不正确：',
//			successMessage = "商品将1～2日内发货，彼时可在会员中心查看快递单号.",
			error = 0;
		//如果输入的不是正确的手机号
        if ($.trim($('.order-form input[name="mob"]').val())) 
		{error = 1; $this.find('input[name="mob"]').parent().addClass('invalid'); msg = msg +  '\n - 手机号';}
		//如果原先有手机号但是输入没有内容
		if ($.trim($('.order-form input[name="name"]').val()) === '') 
		{error = 1; $this.find('input[name="name"]').parent().addClass('invalid'); msg = msg +  '\n - 收货人';}
		if ($.trim($('.order-form textarea[name="address"]').val()) === '') 
		{error = 1; $this.find('textarea[name="address"]').parent().addClass('invalid'); msg = msg +  '\n - 收货地址';}

        if (error){
        	updateTextPopup('ERROR', msg);
        }else{
			//取得cookie中
			
			
			
			//如果数据正确
			$(location).attr('href', 'i.html');
			
//            var url = 'send_mail.php',
//            	mob = $.trim($this.find('input[name="mob"]').val()),
//            	name = $.trim($this.find('input[name="name"]').val()),
//            	subject = ($this.find('input[name="subject"]').length)?$.trim($this.find('input[name="subject"]').val()):'',
//            	address = $.trim($this.find('textarea[name="address"]').val());
//
//            $.post(url,{'mob':mob,'name':name,'subject':subject,'address':address},function(data){
//	        	updateTextPopup('THANK YOU!', successMessage);
//	        	$this.append('<input type="reset" class="reset-button"/>');
//	        	$('.reset-button').click().remove();
//	        	$this.find('.focus').removeClass('focus');
//			});
			
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