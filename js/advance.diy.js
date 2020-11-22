// JavaScript Document
$(function () {

	"use strict";


	//标题：
	$("#setProdInfo");

	//标题：产品详情
	$("#setProdDetails");

	
	
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
	var parmsVal = "";
	function setProdPageDetails(){
		var isJSON = false;
		//设置为同步请求
		$.ajaxSettings.async = false;
		$.getJSON("product/advance/prod.json", function(jsonData){
			
			//发布时间
			$("#setProdDate").text(formatDate(jsonData.date.substring(0,8)));
			//产品名
			$("#setProdTitle").text(jsonData.title);
			//产品描述
			$("#setProdInt").text(jsonData.int);
			//产品信息
			$("#setProdInfo").text(jsonData.prodinfo);
			
			//设置产品详情
			$("#setProdDetails").text(jsonData.details);
			//设置产品详细图
			//读取showImg的数值
			var showImg = jsonData.showImg + 1;
			var ProdDetailImgHtml = "";
			for(var showImgNum = 0; showImgNum < showImg; showImgNum++){
				//格式化
				var doubleDigit = "00";
				if(showImgNum < showImg-1){
					doubleDigit = "0"+(showImgNum+1);
				}else{
					doubleDigit = showImgNum+1;
				}
				//写入图片列
//				$("div#setProdDetailImg").append("<img class='block' src='product/advance/detail-img_"+doubleDigit+".jpg' alt=''>");
				ProdDetailImgHtml += "<img class='block' src='product/advance/detail-img_"+doubleDigit+".jpg' alt=''>";
			}
			$("div#setProdDetailImg").html(ProdDetailImgHtml);
			
			
			//设置视频：如果json中有视频路径，设置视频
			var videoPath = jsonData.mainVideo;
			if(isNullOrUndefined(videoPath)){
				//如果没有视频源，删除视频源的框架
				$("#setMainVideo").parent().remove();
			}else{
				$("#setMainVideo").attr("src", videoPath);
			}
			
			//循环根,获取一共有多少子对象 并 循环
			for(var parObj = 0; parObj < jsonData.parameter.length; parObj++){
				//对象名(数据结构请查看数据表)
				//参数结构 objName $ objVal:objVal:objVal # objName $ objVal:objVal:objVal
				parmsVal += jsonData.parameter[parObj].ObjName + "$";
				//循环子属性
				for(var parSubObj = 0; parSubObj < jsonData.parameter[parObj].ObjVal.length; parSubObj++){
					parmsVal += jsonData.parameter[parObj].ObjVal[parSubObj];
					//不是最后一项加入分割
					if(parSubObj === jsonData.parameter[parObj].ObjVal.length - 1){
						//判断是否最后一个块
						if(parObj !== jsonData.parameter.length - 1){
							parmsVal += "#";
						}
					}else{
						parmsVal += ":";
					}
				}
				alert(parmsVal);
			}
			
			isJSON = true;
		});	
		// 如果没有JSON数据
		if(!isJSON){
//			$(".mycart").remove();
//			$("#setMainVideo").remove();
//			alert("产品信息加载失败————关闭消息框后，将前往SHOP页面，如需反馈可与我们联系，感谢对本站的支持和理解（微信：*********1）");
//			$(location).attr('href', '../shop.html');
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
	
	/*================*/
	/* 功能 - 判断Mob格式是否正确 */
	/*================*/
	function isMobID(mobid){
		var pattern = new RegExp(/^1[3,4,5,7,8][0-9]{9}$/);
		if (!pattern.exec(mobid)){return false;}
		return true;
	}
	
	
	/*================*/
	/* 初始化也买呢 */
	/*================*/
	var truefalse = false;
	var hrefVal = "";
	//目前情况：不管是不是用户都现实页面内容
	//设置页面，此时hrefVal在之后才能获取正确的值
	setProdPageDetails();
	//如果是用户
	if(isMobID(readCookieMob())){
		//页面属性为用户
		truefalse = true;
		//产品属性页面跳转的link为：用户的形态//设置页面标题
		hrefVal = "prodselect.html?prodid=advance&name=" + $("#setProdTitle").text() + "&price=" + $("#setProdRMB").text() + "&Mob=" + iMob + "&parms=" + parmsVal;
	}else{
		//页面属性为非用户
		truefalse = false;
		//产品属性页面跳转的link为：非用户形态
		hrefVal = "login.html?fromPageType=advance";
	}
	//下单按钮
	$("#setNowBuy").on('click', function(){
		if(truefalse){
			//马上结账：true （立即购买）
			$(location).attr("href", hrefVal + "&type=true");
		}else{
			$(location).attr("href", hrefVal);
		}
	});
	
});