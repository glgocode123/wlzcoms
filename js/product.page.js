// JavaScript Document
$(function () {
	//处理产品详细页的交互功能以及数据获取-展示，以传参的形式获取当前时那个产品的详细页

	"use strict";
	
	//网站同shop一样，采用数据填充
	//数据可以存放于对应的目录中，这样只需要更改路径就可以切换素材
	//网站文本内容尝试以json文件保存于同目录下，就可以切换文本
	//做一个总判断用的函数，以确保所有内容获取成功才进行网站显示，否则提示出问题
	
	
	
//	更改思路，shop的大部分内容是否可以采取同样请求方式，这样就不需要所有数据都存放于同一json文件下，而且产品json用户只有访问，没有写入的需求，同时也仅有文本数据需要读取，因为素材都是直接存储在github上的
//	
//	也就是数据形式应该是，json文件记录产品的唯一id，id可以作为：
//	1、找到产品素材的详细路径
//	2、用户购物车记录
//	3、页面传递购买流程
//	4、查找以购买记录
	
	
	// 获得当前页id
	var url = location.href;
	

	/*================*/
	/* 0 - 弹出菜单功能 */
	/*================*/
	function updateTextPopup2(title, text){
		//判断是否已经弹出了一个相同属性的框，这个是用global.js的关闭改的
		if($(".overlay-wrapper").hasClass("active")){
			$('.overlay-wrapper').removeClass('active');
		}
		$('.text-popup .text-popup-title').text(title);
		$('.text-popup .text-popup-message').text(text);
		$('.text-popup').addClass('active');
	}
	
	
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
	/* 功能 - 判断产品id格式是否正确 */
	/*================*/
	function isProdID(prodid){
		var pattern = new RegExp(/^2[0-9]{9}$/);
//		alert(pattern.exec(prodid));
		if (!pattern.exec(prodid)){return false;}
		return true;
	}
	/*================*/
	/* 功能 - 判断Mob格式是否正确 */
	/*================*/
	function isMobID(mobid){
		var pattern = new RegExp(/^1[3,4,5,7,8][0-9]{9}$/);
		if (!pattern.exec(mobid)){return false;}
		return true;
	}
	
	
	/*================*/
	/* 功能 - 格式化日期格式 */
	/*================*/
	function formatDate(date){
		var m=new Array("Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Spt","Oct","Nov","Dec");
		return m[date.slice(4, 6)-1]+" "+date.slice(6, 8)+"/"+date.slice(0, 4);
	}
	
	
	/*================*/
	/* 功能 - 判断参数是否有内容 */
	/*================*/
	function isNullOrUndefined(obj){
		if(obj===null||obj===undefined||obj===""||obj==="undefined"||obj==="null"){
			return true;
		}else{
			return false;
		}
	}
	
	/*================*/
	/* 功能 - 设置页面详情 */
	/*================*/
	function setProdPageDetails(prodid){
		var isJSON = false;
		//设置为同步请求
		$.ajaxSettings.async = false;
		$.getJSON('product/' + prodid + "/prod.json", function(jsonData){
			//设置页面标题
			$("#setProdTitle").text(jsonData.title);
			//设置产品价格
			$("#setProdRMB").text(jsonData.menoy);
			//设置发货时间
			$("#setProdDeliveryTime").text(jsonData.deliveryTime);
			//设置产品上线日期
			$("#setProdDate").text(formatDate(prodid.substring(0,8)));
			//设置产品简介
			$("#setProdInt").text(jsonData.int);
			//（img）设置PC专有的头图
			
			//设置视频：如果json中有视频路径，设置视频（未完善）
			var videoPath = jsonData.mainVideo;
			if(isNullOrUndefined(videoPath)){
				//如果没有视频源，删除视频源的框架
				$("#setMainVideo").parent().remove();
			}else{
				$("#setMainVideo").attr("src", videoPath);
			}
			//设置产品信息
			$("#setProdInfo").text(jsonData.prodinfo);
			//（img）设置产品正反面
			
			//（img）设置产品基本信息
			
			//（img）设置产品尺寸信息
			
			//设置产品详情
			$("#setProdDetails").text(jsonData.details);
			//（img）设置产品详细图
			//读取showImg的数值
			var showImg = jsonData.showImg;
			for(var showImgNum = 0; showImgNum < showImg; showImgNum++){
				//格式化
				var doubleDigit = "00";
				if(showImgNum < showImg-1){
					doubleDigit = "0"+(showImgNum+1);
				}else{
					doubleDigit = showImgNum+1;
				}
				//写入图片列
				$("div#setProdDetailImg").append("<img class='block' src='product/"+ prodid +"/detail-img_"+doubleDigit+".jpg' alt=''>");
			}
			
			//TAGE
//			jsonData.type;

//			jsonData.like;
			
			//设置通用路径图片(更改路径，变成prodid的对应路径————本身有路径，所以更改就好)
			var prodCommonImg = $("img.setProdCommonImg");
			for(var imgNum = 0; imgNum < prodCommonImg.length; imgNum++){
				var srcOriginal = prodCommonImg.eq(imgNum).attr("src");
				prodCommonImg.eq(imgNum).attr("src", srcOriginal.replace("img", prodid));
			}
			
			isJSON = true;
		});	
		// 如果没有JSON数据
		if(!isJSON){
			$(".mycart").remove();
			$("#setMainVideo").remove();
			updateTextPopup2("产品信息加载失败","关闭消息框后，将前往SHOP页面，如需反馈可与我们联系，感谢对本站的支持和理解（微信：*********）");
			$(location).attr('href', '../shop.html');
		}
	}
	
	//判断是否登录
	var iMob="";
	function readCookieMob(){
		var source = $.cookie("wlzName");
		if (source === null || source === "" || source === undefined) {
			return 0;
		}
		var arr = source.split("||");
		return arr[0];
	}
	function isUser(){
		var cookieMobID = readCookieMob();
		if(isMobID(decodeURI(UrlParamHash(url).Mob))){
			iMob = decodeURI(UrlParamHash(url).Mob);
//			alert("参数获取");
			return true;
		}else if(isMobID(cookieMobID)){
			iMob = cookieMobID;
//			alert("cookie获取");
			return true;
		}
		return false;
	}
	/*================*/
	/* 页面配置 - 判断获取的产品id是否正确,并且用户已经登录，如果正确执行页面数据获取填充 */
	/*================*/
	if(isProdID(decodeURI(UrlParamHash(url).prodid))){
		var truefalse = false;
		var hrefVal = "";
		//目前情况：不管是不是用户都现实页面内容
		//设置页面，此时hrefVal在之后才能获取正确的值
		setProdPageDetails(UrlParamHash(url).prodid);
		//如果是用户
		if(isUser()){
			//页面属性为用户
			truefalse = true;
			//产品属性页面跳转的link为：用户的形态//设置页面标题
			hrefVal = "prodselect.html?prodid="+UrlParamHash(url).prodid+"&name="+$("#setProdTitle").text()+"&price="+$("#setProdRMB").text()+"&Mob="+iMob;
		}else{
			//页面属性为非用户
			truefalse = false;
			//产品属性页面跳转的link为：非用户形态
			hrefVal = "login.html?fromPageType=product&prodID="+UrlParamHash(url).prodid;
		}
		$("#setAddCart").on('click', function(){
			if(truefalse){
				//马上结账：false （加入购物车）
				$(location).attr("href", hrefVal + "&type=false");
			}else{
				$(location).attr("href", hrefVal);
			}
		});
		$("#setNowBuy").on('click', function(){
			if(truefalse){
				//马上结账：true （立即购买）
				$(location).attr("href", hrefVal + "&type=true");
			}else{
				$(location).attr("href", hrefVal);
			}
		});
	}else{
		//如果页面id不合适，返回原页
		$(".mycart").remove();
		$("#setMainVideo").remove();
		updateTextPopup2("产品信息加载失败","关闭消息框后，将前往SHOP页面，如需反馈可与我们联系，感谢对本站的支持和理解（微信：*********）");
		$(location).attr('href', '../shop.html');
//		window.history.go(-1);
	}
	
});