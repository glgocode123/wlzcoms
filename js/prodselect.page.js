// JavaScript Document
$(function () {
	//处理shop页面的交互功能以及数据获取-展示

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
	/* 功能 - 判断参数是否有内容 */
	/*================*/
	function isNullOrUndefined(obj){
		if(obj===null||obj===undefined||obj===""||obj==="undefined"||obj==="null"){
			return true;
		}else{
			return false;
		}
	}
	
	//判断所需参数是否齐全，只读参数，不读cookie，因为只是流程中间页
	//修改 —— 要读取cookie中的prodid属性，虽然是中间页，但是如果用户记录这个页再进入，那么会走不下去，因为这个页面的下一个页面不是购物车，就是结账页面，如果没有获得实际的prodid和mob，就不应该进入这个页面。
	var prodID = "";
	var MobID = "";
	/*================*/
	/* 功能 - 判断产品id格式是否正确 */
	/*================*/
	function isProdID(prodid){
		var pattern = new RegExp(/^2[0-9]{9}$/);
//		alert(pattern.exec(prodid));
		if (!pattern.exec(prodid)){return false;}
		prodID = prodid;
		return true;
	}
	/*================*/
	/* 功能 - 判断Mob格式是否正确 */
	/*================*/
	function isMobID(mobid){
		var pattern = new RegExp(/^1[3,4,5,7,8][0-9]{9}$/);
		if (!pattern.exec(mobid)){return false;}
		MobID = mobid;
		return true;
	}
	
	//判断字符型对应布尔型
	var type;
	function typeIsBoolean(itype){
		if(itype==="true"){
			type = true;
			return true;
		}else if(itype==="false"){
			type = false;
			return true;
		}else{
			return false;
		}
	}
	
	function goNextPage(goPage,parmsVal){
		switch (goPage) {
			case "order":
				//直接购买：一个产品
				$(location).attr("href", "order.html?prodid=" + prodID + "&name=" + UrlParamHash(url).name + "&count=1" + "&price=" + UrlParamHash(url).price + "&Mob=" + MobID + parmsVal);
				break;
			case "cart":
				//加入购物车：prodid、prodName、prodPrice、prodParms
				//id = 产品ID
				//Name = 产品名称
				//Price = 产品价格
				//Parms = 产品参数
				$(location).attr("href", "cart.html?prodid=" + prodID + "&name=" + UrlParamHash(url).name + "&price=" + UrlParamHash(url).price + "&Mob=" + MobID + parmsVal);
				break;
			case "advance":
				//直接购买：一个产品
				$(location).attr("href", "advance.html?prodid=advance&name=" + UrlParamHash(url).name + "&count=1" + "&price=" + UrlParamHash(url).price + "&Mob=" + MobID + parmsVal);
		}
	}
	
	//模拟cookie，稍后需要改成读取cookie
	var cookieProdid = decodeURI(UrlParamHash(url).prodid);
	//首先判断cookie有没有记录prodid，并且判断是否于参数的prodid相同，没有视为用户保存的标签打开的
	if(cookieProdid === decodeURI(UrlParamHash(url).prodid)){
		//然后判断是否有参数
		if(isMobID(decodeURI(UrlParamHash(url).Mob)) && typeIsBoolean(decodeURI(UrlParamHash(url).type))){
			
			//设置选项卡(objName $ objVal:objVal:objVal # objName $ objVal:objVal:objVal)
			var parmsObj = decodeURI(UrlParamHash(url).parms);
			
			//如果有更多选项内容，生成选项页面。否者直接跳转下一页
			if(!isNullOrUndefined(parmsObj)){
				var sItemHtml = "",
					h;
				var hash = parmsObj.split('#');
				for (var i = 0; i < hash.length; i++) {
					sItemHtml += '<div class="empty-space h35-xs"></div>';
					h = hash[i].split("$"); 
					//设置选项标题
					sItemHtml += '<h7 class="h7">' + h[0] + '</h7><div class="empty-space h20-xs"></div><div class="selectItem" data-name="' + h[0] + '"><ul>';
					//设置选项内容
					var hashSub = h[1].split(":");
					if(hashSub.length === 1){
						sItemHtml += '<li><a class="active" data-name="' + hashSub[0] + '">' + hashSub[0] + '</a></li>';
					}else{
						var isActive = true;
						for(var j = 0; j < hashSub.length/2; j ++){

							//判断选项是否可用状态
							if(hashSub[j*2] === "true"){
								//是否选中
								if(isActive){
									isActive = false;
									sItemHtml += '<li><a class="active" data-name="' + hashSub[j*2+1] + '">' + hashSub[j*2+1] + '</a></li>';
								}else{
									sItemHtml += '<li><a data-name="' + hashSub[j*2+1] + '">' + hashSub[j*2+1] + '</a></li>';
								}
							}else{
								sItemHtml += '<li><a class="outStock" data-name="' + hashSub[j*2+1] + '">' + hashSub[j*2+1] + '</a></li>';
							}

						}
					}
					sItemHtml += '</ul></div>';
				}
				$("#sItem").append(sItemHtml);
			}else{
				//如果是直接购买
				if(type){
					//advance不可加入购物车，只能是直接购买
					if(cookieProdid==="advance"){
						//无选项，直接跳转订单提交页
						goNextPage("order","");
					}else{
						//无选项，直接跳转订单提交页
						goNextPage("order","");
					}
				}else{
					//无选项，直接跳转购物车
					goNextPage("cart","");
				}
			}
			
			
			//选项卡逻辑
			$("div.selectItem ul li a").on("click",function(){
				if(!$(this).is(".outStock")){
					$(this).parents().siblings().children().removeClass("active");
					$(this).addClass("active");
		//			alert($(this).data('name')+"_"+$(this).parents().parents().parents().data("name"));
				}
			});
			
			//页面下一步
			$(".btnNext").on("click", function(){
				var hrefSelectType = "&";
				
				//以上逻辑是可以使用的，保留，因为流程问题而改一下逻辑
				//因为下一页设置为没有太过详细的参数，统一使用parms保存参数信息，所以此处逻辑改为如下：
				hrefSelectType += "parms=";
				//逻辑改成了页面的参数以：parms=color:白色  xxx:xxx
				for(var i = 0; i < $("div.selectItem").length; i++){
					//参数名
					hrefSelectType += $("div.selectItem").eq(i).data("name");
					hrefSelectType += ":";
					//参数值
					hrefSelectType += $("div.selectItem").eq(i).children().children().children(".active").data("name");
					if(i !== $("div.selectItem").length-1){
						hrefSelectType += "  ";
					}
				}
				//如果是直接购买
				if(type){
					//advance不可加入购物车，只能是直接购买
					if(cookieProdid==="advance"){
						//有选项，直接跳转订单提交页
						goNextPage("advance",hrefSelectType);
					}else{
						//有选项，直接跳转订单提交页
						goNextPage("order",hrefSelectType);
					}
					
				}else{
					//有选项，直接跳转购物车
					goNextPage("cart",hrefSelectType);
				}
			});
		}else{
			window.history.go(-1);
		}
	}else{
		window.history.go(-1);
	}
	

	
	
	});