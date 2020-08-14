// JavaScript Document
$(function () {

	"use strict";


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
	};

	//购物车操作
	var CartHelper = function () {
		this.cookieName = $.cookie('test123wlzCart');
		
		this.Clear = function () {
			var cart = new Cart();
			this.Save(cart);
			return cart;
		};

		//向购物车添加
		this.Add = function (id, name, count, price) {
			alert("_id:"+id+"名:"+name+"数量:"+count+"价格:"+price);
			var cart = this.Read();
			var index = this.Find(id);

			if (count === 0) {
				this.Del(id);

			} else {
				//如果ID已存在，覆盖数量
				if (index > -1) {
					cart.Total -= (((cart.Items[index].Count * 100) * (cart.Items[index].Price * 100)) / 10000);
					cart.Items[index].Count = count;
					cart.Total += (((cart.Items[index].Count * 100) * (cart.Items[index].Price * 100)) / 10000);

				} else {
					var item = new CartItem();
					item.Id = id;
					item.Name = name;
					item.Count = count;
					item.Price = price;
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
		//根据ID查找
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
			alert(source);
			$.cookie(this.cookieName, source);
		};
		//读取COOKIE中的集合
		this.Read = function () {
			var source = $.cookie(this.cookieName);
//			alert(source);
			var cart = new Cart();
			if (source === null || source === "") {
				return cart;
			}
			var arr = source.toString().split("|$|");
			cart.Count = arr.length;
			for (var i = 0; i < arr.length; i++) {
				var item = this.ItemToObject(arr[i]);
				cart.Items.push(item);
				cart.Total += (((item.Count * 100) * (item.Price * 100)) / 10000);
			}
			return cart;
		};
		this.ItemToString = function (item) {
			return item.Id + "||" + encodeURIComponent(item.Name) + "||" + item.Count + "||" + item.Price;
		};
		this.ItemToObject = function (str) {
			var arr = str.split('||');
			var item = new CartItem();
			item.Id = arr[0];
			item.Name = decodeURIComponent(arr[1]);
			item.Count = arr[2];
			item.Price = arr[3];
			return item;
		};
	};
	
	//调用
	var xc = new CartHelper();
	
	
	//==================在cookie购物车模板中，把数据渲染出来，并调用js:===========================
//	console.log(xc.Read());
	function getCookie(){
		
		var pro_list = xc.Read();

		var abs = pro_list.Items;
//		alert(abs);


//		var username = $.cookie("username");
//		alert(username);

		// alert(abs[0]["Id"]);

		var ul = '';
		
		for (var i = 0; i < abs.length; i++) {
			alert("id:"+abs[i].Id);
			ul += '<ul class="cart_list_td clearfix" v-for="(sku,index) in cart" id="porcdesc" ><li class="col01"><input type="checkbox" name="product_id" v-model="sku.selected" @change="update_selected(index)" value="' + abs[i].Id + ',' + abs[i].Id + ',' + abs[i].Name + '" onclick="dod()"></li><li class="col02"><img src="">img</li><li class="col03" id="prodtit" >' + abs[i].Name + '</li><li class="col05" id="prodpic">' + abs[i].Price + '元</li><li class="col08">' + abs[i].Count + '</li><li id="pkid" value="' + abs[i].Id + '"><a @click="on_delete(index)" onclick="delpro(' + abs[i].Id + ')">删除</a></li></ul>';
		}

		ul += '';
		$("#pro_list").html(ul);
		
	}
	//初始化先读一次
	getCookie();
	
//	===========在商品详情页中写了onclick(),并调用js里面的添加购物车逻辑:==========================
//	function getcookie(){
//		xc.Add(id,$('#title').html(),4,$('#price').html());
//		alert(xc.Read());
//		alert($('#title').html());
//	}
	
	//保存cookie
	var showNum = 0;
	$("#saveCookie").on("click", function(){
		var PName=document.getElementById("prodName");
		var PID=document.getElementById("prodID");
		var PNum=document.getElementById("prodNum");
		var Price=document.getElementById("price");
		if(PName.value===""){
			alert("请输入产品名称！");
		}else if(PID.value===""){
			alert("请输入产品ID！");
		}else if(PNum.value===""){
			alert("请输入数量！");
		}else if(Price.value===""){
			alert("请输入价格！");
		}else{
			xc.Add(PID.value,PName.value,PNum.value,Price.value);
			$("#addNum").text(showNum++);
//			setCookie(UName.id,UName.value,30);
//			setCookie(PName.id,PName.value,30);
		}
	});
	$("#showCookie").on("click", function(){
		getCookie();
	});

});
	
