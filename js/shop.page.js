// JavaScript Document
$(function () {
	//处理shop页面的交互功能以及数据获取-展示

	"use strict";
	
	/*================*/
	/* 此功能文件用于：获得地址传参，激活对应额产品分类选项卡 */
	/*================*/

	//原始例子：https://blog.csdn.net/weixin_44763569/article/details/88714525
	//修改结合了，本项目的global.js中的“content-menu click”，删减原始例子中的初始项，该用调用本项目（也就是不做这一步，页面中引用global.js就好）

	// 获取 被访问时的 url
	var ur = location.href;
	
	// 获取该url “等号” 后面的数字 （id）
	var pageType = 0;
	//diy：返回某个指定的字符串值在字符串中首次出现的位置(也就是判断字符串在第几位)
	if(ur.indexOf("?") >= 0) {
		pageType = parseInt(ur.split('?')[1].split("=")[1]);
		if(pageType>=4){pageType=0;}
	}
	
	//设置JSON为同步请求
	$.ajaxSettings.async = false;
	
	// 获取当前分页id
	var pageNavID = 0;
	//获取&号后面的=后面的参数
	if(ur.indexOf("&") >=0) {
		pageNavID = parseInt(isRealNum(ur.split('&')[1].split("=")[1]));
	}
	//判断是否是数字,true返回val，false返回0
	function isRealNum(val){
		//isNaN()函数 把空串 空格 以及NULL 按照0来处理 所以先去除
		if(val === "" || val === null){
			return 0;
		}
		if(!isNaN(val)){
			return val;
		}else{
			return 0;
		}
	}
	
	// 使用传过来的 数字 （id） 来控制该选项卡的切换
	// 其实就是从页面 A 通过 URL “？” 后面的参数 给页面B 传一个 index
	function initPageTitleNav(){
		//this对象：手机版标题
		var content_menu_btn = $('.content-menu .button-drop a span');
		//清除所有的选中状态
		$('.content-menu ul li a').removeClass('active');
		//按照页面第一个参数，获得页面需要触发的对象
		var i = $('.content-menu ul li a').eq(pageType);
		//将需要出发的对象选中状态
		i.addClass('active');
		//写入手机版选择后的标题，标题内容根据需要触发的对象中获取
		content_menu_btn.text(i.data('name'));	
	}
	
	
	//设置手机版页面底部导航
	function set767PageNav(prodall){
		//计算出一共有多少个页面
		var pageall = Math.ceil(prodall/5);
		$(".page-pagination ul li.pcshow").remove();
		
		//如果参数传递的当前页面超过了总的页面数,或为负数,将当前页面设置为起始页
		if(pageNavID > pageall || pageNavID <= 0 || pageNavID === 1){
			pageNavID = 1;
			$(".page-pagination ul li").first().remove();
			$(".page-pagination ul li").last().children().attr("href", "?type="+pageType+"&page="+(pageNavID+1));
		}else if(pageNavID === pageall){
			$(".page-pagination ul li").first().children().attr("href", "?type="+pageType+"&page="+(pageNavID-1));
			$(".page-pagination ul li").last().remove();
		}else{
			$(".page-pagination ul li").first().children().attr("href", "?type="+pageType+"&page="+(pageNavID-1));
			$(".page-pagination ul li").last().children().attr("href", "?type="+pageType+"&page="+(pageNavID+1));
		}
	}
	//设置页面底部的导航
	function setBigPageNav(prodall){
		//计算出一共有多少个页面
		var pageall = Math.ceil(prodall/5);
		//如果参数传递的当前页面超过了总的页面数,或为负数,将当前页面设置为起始页
		if(pageNavID > pageall || pageNavID <= 0){pageNavID = 1;}
		//如果当前页起码是第一页，并且最少6页，并且当前页不是最后一页
		if(pageNavID > 0 && pageall > 5 && pageNavID!==pageall){
			//设置数字导航第一个为当前页的第二页
			$(".page-pagination ul").children().eq(1).children().text(pageNavID + 1);
			//写入底部页面导航的herf
			$(".page-pagination ul li").eq(1).children().attr("href", "?type="+pageType+"&page="+(pageNavID+1));
		}
		$(".page-pagination ul li").eq(0).children().attr("href", "?type="+pageType+"&page="+(pageNavID-1));
		if(pageNavID === 1){
//			$(".page-pagination ul li").eq(0).children().hide();
		}
		
		//总页面-当前页面=剩余页面数, 剩余页面数，5个或以上，可以满足页面设计的数量，不用删除按钮的情况
		//只改变按钮内容就可以了，循环3次就可以，因为上面已经改了一个了，这里从第三个选项开始所以i=2
		//剩余页面>=5页
		if(pageall-pageNavID >= 5){
			for(var i=2;i<5;i++){
				$(".page-pagination ul").children().eq(i).children().text(pageNavID + i);
				//写入底部页面导航的herf
				$(".page-pagination ul li").eq(i).children().attr("href", "?type="+pageType+"&page="+(pageNavID+i));
			}
			$(".page-pagination ul li").eq(i).children().attr("href", "?type="+pageType+"&page="+(pageNavID+i));
			$(".page-pagination ul li").eq(i+1).children().attr("href", "?type="+pageType+"&page="+(pageNavID+1));
		}else if(pageall > 5){//所有页面最少6页
			for(var j=6;j>=1;j--){
				if(j > pageall-pageNavID){
					$(".page-pagination ul").children().eq(j).remove();
				}else{
					$(".page-pagination ul").children().eq(j).children().text(pageNavID + j);
					//写入底部页面导航的herf
					$(".page-pagination ul li").eq(j).children().attr("href", "?type="+pageType+"&page="+(pageNavID+j));
				}
			}
		}else{//所有页面少于展示数量，直接使用1～5数字展示
			$(".page-pagination ul").children().eq(0).children().text(1);
			for(var k=6;k>0;k--){
				if(k > pageall-1){
					$(".page-pagination ul").children().eq(k).remove();
				}else{
					$(".page-pagination ul").children().eq(k).children().text(k+1);
					//写入底部页面导航的herf
					$(".page-pagination ul li").eq(k).children().attr("href", "?type="+pageType+"&page="+(k+1));
				}
			}
		}
	}
	
	
	
	/*================*/
	/* 添加产品列表中对应的产品信息 json*/
	/*================*/
	function setPROD(prodall){
		
		var isPageList = isRealNum(Math.ceil(prodall/5)) - parseInt(isRealNum(prodall/5));
		//当前页就是最后一页并且，最后一页不满
		if( isRealNum(Math.ceil(prodall/5))===pageNavID && isPageList>0){
			//最后一页产品数
			isPageList = prodall - parseInt(isRealNum(prodall/5))*5;
			for(var h=4; h > isPageList-1; h--){
				//删除多余节点
				$("div.left-right").children(".row").eq(h).remove();
			}
		}else if(isPageList === 0){
			$("div.left-right").after("<div class='row'><div class='col-md-6 col-md-offset-3'><article><h2 class='h2'>为了更好的使用，网站产品货架正在维护中，烦请24小时后再试</h2></article></div></div>");
			$("div.left-right").remove();
			$("div.page-pagination").remove();
		}else{
			isPageList = 5;
		}
		
		//产品列表内容编写
		for (var i=0;i<isPageList;i++){
			var objectPROD = $("div.setprod:eq("+i+")").children();
			//产品列表-图片
			objectPROD.eq(0).children().attr('href','product.html?prodid=2020061201'); 
			objectPROD.eq(0).children().css("background-image","url(product/2020090902/shop-img.jpg)");
			//产品列表-顶部方框中的大分类
			var opType = objectPROD.eq(1).children().eq(1).children();
			opType.attr('href','?type=2'); 
			opType.text("产品分类");
			//产品列表-详细数据
			var prodProduct = objectPROD.eq(1).children().eq(3).children();
			var prodDate = formatDate("20201008");//"JUNE 19/2016";
			var prodHeat = "33";
			var prodType = "带帽卫衣";
			prodProduct.children().eq(0).text(prodDate);
			prodProduct.children().eq(2).text(prodHeat);
			prodProduct.children().eq(3).text(prodType);
//			prodProduct.html("<span>"+prodDate+"</span><span>"+prodPrice+"\xa0<i class='fa fa-rmb'></i></span>");
			//<span>"+prodType+"</span>
			//<span>"+prodHeat+"\xa0<i class='fa fa-heart-o'></i></span>
			//产品列表-标题 & 简介
			var prodTitleValue = objectPROD.eq(3).children(":first").children().children(":first");
			var prodTitle = "Hoodies";
			var prodPrice = "120.00";
			prodTitleValue.children().children().attr('href','product.html?prodid=2020061201'); 
			prodTitleValue.children().children().eq(0).text(prodTitle); 
			prodTitleValue.children().children().eq(2).text("¥ "+prodPrice);
			prodTitleValue.next().children().eq(0).text("Gentlewoman 星辰吊带裙-黑色");
			prodTitleValue.next().children().eq(2).text("可选尺寸: 44 48 50");
			prodTitleValue.next().children().eq(5).text("地藏小王主题印花短袖T恤：材质舒适亲肤，短袖的设......");
			//产品列表-简介
		}
		
		
	



	}
	
	
	function formatDate(date){
		var m=new Array("Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Spt","Oct","Nov","Dec");
		return m[date.slice(4, 6)-1]+" "+date.slice(6, 8)+"/"+date.slice(0, 4);
	}

	
	
	
	// 页面初始化的时候——设置标题菜单
	initPageTitleNav();
	
	//虚拟设定一共有34个产品
	var prodall = 0;
	//全局数组——用来存储
	var prodArrayID = [];
	$.getJSON("shop.json", function(jsonData){
		alert(pageType);
		switch (pageType) {
			case 0:
				//全部产品数量
				prodall = jsonData[0].products.length + jsonData[1].products.length + jsonData[2].products.length;
				//将new添加进入数组
				for(var jsonI = jsonData[0].products.length-1; jsonI >= 0; jsonI--){
					prodArrayID.push(jsonData[0].products[jsonI]);
				}
				
				//将spot以偶数位添加进入数组 ，； 因为内循环是反向的，所以这里就可以正向了
				for(var jsonJ = 0; jsonJ < jsonData[1].products.length; jsonJ++){
					
					//当前数组的位置jsonJ应该（总数-1-当前数：反向位）在第一数组以内：执行插入（第二数组插入第一数组）
					if(jsonData[1].products.length-1 - jsonJ <= jsonData[0].products.length-1){
					
						prodArrayID.splice( jsonData[1].products.length-1 - jsonJ ,0 ,jsonData[1].products[jsonJ]);
						
					}else{
						//如果有多出部分，在原数组（第一数组）最后一位后开始添加，这样可以保证最新的顺序
						prodArrayID.splice(jsonData[0].products.length-1 , 0, jsonData[1].products[jsonJ]);
					}
					
				}
				//将前两个数组的总数固定下来
				var array1_2 = prodArrayID.length;
				//将sale每4添加进入数组
				//如此循环4～1
				for(var jsonK = jsonData[2].products.length; jsonK > 0; jsonK--){
//					prodArrayID.push(jsonData[2].products[jsonK]);
					//如果第三数组当前的位置，溢出了
					if(jsonK > parseInt(array1_2/4)){
						prodArrayID.splice(array1_2 , 0, jsonData[2].products[jsonK-1]);
					}else{
						prodArrayID.splice(4*jsonK - 1 , 0, jsonData[2].products[jsonK-1]);
					}
				}
				
				break;
			case 1:
				//New的产品数量
				prodall = jsonData[0].products.length;
				for(var L = jsonData[0].products.length-1; L >=0; L-- ){
					prodArrayID.push(jsonData[0].products[L]);
				}
				break;
			case 2:
				//Spot的产品数量
				prodall = jsonData[1].products.length;
				for(var N = jsonData[0].products.length-1; N >=0; N-- ){
					prodArrayID.push(jsonData[0].products[N]);
				}
				break;
			case 3:
				//Sale的产品数量
				prodall = jsonData[2].products.length;
				for(var M = jsonData[0].products.length-1; M >=0; M-- ){
					prodArrayID.push(jsonData[0].products[M]);
				}
		}
	});
	
	alert(prodall);
	var testArray = "";
	for(var testArrayIIII = 0; testArrayIIII < prodArrayID.length; testArrayIIII++){
		testArray += prodArrayID[testArrayIIII] + ",";
	}
	alert(testArray);
	
	if($(document).width() <= 767){
		set767PageNav(prodall);
	}else{
		setBigPageNav(prodall);
	}
	
	//设置页面中的产品列表
	setPROD(prodall);
	
	
	
	return false;

});