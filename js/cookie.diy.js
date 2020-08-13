// JavaScript Document
$(function () {

	"use strict";
	
//	$.cookie('name', '123123');
//	alert($.cookie('name'));
	
	/**
     * 添加商品及数量到购物车cookie中,返回当前商品在cookie中的总数
     */
    function AddToShoppingCar(id, num, type) {
		
		
		//实例缺少了cookieProductID，从逻辑看应该就是判断有没有传入ID
		var cookieProductID = id;
		
		var _num = 1;
        if (num !== undefined){
            _num = num;
        }
        if (type === undefined){
            alert("请设置产品种类");
            return false;
        }
        var totalNum = _num; //总数默认为传入参数
        var cookieSet = { expires: 7, path: '/' }; //设置cookie路径的
        // $.cookie(cookieProductID, null, cookieSet);//清除Cookie
        // var jsonStr = "[{'ProductID':'" + id + "','Num':'" + _num + "'}]"; 
		// 构造json字符串,id是商品id  num是这个商品的数量
        var jsonStr = "[{'ProductID':'" + id + "','Num':'" + _num + "','Type':'" + type + "'}]";
		//构造json字符串,id是商品id  num是这个商品的数量
        console.log(jsonStr);
        console.log($.cookie(cookieProductID));
        if ($.cookie(cookieProductID) === null) {
            $.cookie(cookieProductID, jsonStr, cookieSet); //如果没有这个cookie就设置他
            
            // ============
            var jsonObj = eval('(' + $.cookie(cookieProductID) + ')'); //如果有，把json字符串转换成对象
            var findProduct = false;//是否找到产品ID,找到则为TRUE,否则为FALSH
            for(var obj in jsonObj) {
                if(jsonObj[obj].ProductID === id) {
                    console.log("数量:" + parseInt(jsonObj[obj].Num));
                    jsonObj[obj].Num = parseInt(jsonObj[obj].Num);
                    totalNum = jsonObj[obj].Num;
                    findProduct = true;
                    break;
                }
            }
            if(findProduct === false){ //没找到,则添加
                jsonObj[jsonObj.length] = new Object();
                jsonObj[jsonObj.length - 1].ProductID = id;
                jsonObj[jsonObj.length - 1].Num = num;
                jsonObj[jsonObj.length - 1].Type = type;
            }
            $.cookie(cookieProductID, JSON.stringify(jsonObj), cookieSet); //写入coockie  JSON需要json2.js支持
            // ============
        }else{
            var jsonObj = eval("(" + $.cookie(cookieProductID) + ")"); //如果有，把json字符串转换成对象
            var findProduct = false;//是否找到产品ID,找到则为TRUE,否则为FALSH
            for(var obj in jsonObj) {
                if(jsonObj[obj].ProductID === id) {
                    console.log("数量:" + parseInt(jsonObj[obj].Num));
                    jsonObj[obj].Num = parseInt(jsonObj[obj].Num) + _num;
                    totalNum = jsonObj[obj].Num;
                    findProduct = true;
                    break;
                }
            }
            if(findProduct === false){ //没找到,则添加
                jsonObj[jsonObj.length] = new Object();
                jsonObj[jsonObj.length - 1].ProductID = id;
                jsonObj[jsonObj.length - 1].Num = num;
                jsonObj[jsonObj.length - 1].Type = type;
            }
            $.cookie(cookieProductID, JSON.stringify(jsonObj), cookieSet); //写入coockie  JSON需要json2.js支持
        }
        return totalNum;
        //  alert($.cookie(cookieProductID));
    }


});