// JavaScript Document
$(function () {

	"use strict";
	
	
	function isNullOrUndefined(obj){
		if(obj===null||obj===undefined||obj===""||obj==="undefined"||obj==="null"){
			return false;
		}else{
			return true;
		}
	}
	/*=======================================================================================*/
	// 查询
	/*=======================================================================================*/
	function showSerch(userOrderArr){
		var sethtml = "";
		for(var i = 0; i < userOrderArr.length; i++){
			sethtml += '<div style="font-size:32px;">系统id:' + userOrderArr[i].id + '</div>';
			sethtml += '<div style="font-size:32px;">orderID:' + userOrderArr[i].orderID + '</div>';
			sethtml += '<div style="font-size:32px;">MobID:' + userOrderArr[i].MobID + '</div>';
			sethtml += '<div style="font-size:32px;">data:' + userOrderArr[i].data + '</div>';
			sethtml += '<div style="font-size:32px;">AWB:' + userOrderArr[i].AWB + '</div>';
			sethtml += '<div style="font-size:32px;">MobNum:' + userOrderArr[i].MobNum + '</div>';
			sethtml += '<div style="font-size:32px;">Name:' + userOrderArr[i].Name + '</div>';
			sethtml += '<div style="font-size:32px;">Address:' + userOrderArr[i].Address + '</div>';
			sethtml += '<div style="font-size:32px;">Points:' + userOrderArr[i].Points + '</div>';
			sethtml += '<div style="font-size:32px;">Golden:' + userOrderArr[i].Golden + '</div>';
			sethtml += '<div style="font-size:32px;">price:' + userOrderArr[i].price + '</div>';
			sethtml += '<div style="font-size:32px;">discount:' + userOrderArr[i].discount + '</div>';
			sethtml += '<div style="font-size:32px;">Total:' + userOrderArr[i].Total + '</div>';
			sethtml += '<div style="font-size:32px;">prodArr:<br \>';

			for(var j = 0; j < userOrderArr[i].prodArr.length; j++){
				sethtml += '<br \><span style="font-size:24px;">' + userOrderArr[i].prodArr[j].proID + '</span><br \>'; 
				sethtml += '<span style="font-size:24px;">' + userOrderArr[i].prodArr[j].proName + '</span><br \>'; 
				sethtml += '<span style="font-size:24px;">' + userOrderArr[i].prodArr[j].proParm + '</span><br \>'; 
			}

			sethtml += '</div><br \>';
		}
		$("#showSerchValue").html(sethtml);
	}
	
	//以收款查询
	$("#serchTotal").children(".serch").on("click",function(){
		$.getJSON("http://d3j1728523.wicp.vip/order?Total=" + $("input[name='serchTotalVal']").val(), function(jsonAllUser){
			showSerch(jsonAllUser);
		});
	});
	
	//ID查询
	$("#serchID").children(".serch").on("click",function(){
		var serchHref = $("input[name='sid']:checked").val() + "=" + $(this).prev().val();
		$.getJSON("http://d3j1728523.wicp.vip/order?" + serchHref, function(jsonAllUser){
			showSerch(jsonAllUser);
		});
	});
	
	//查询全部
	$("#serchAll").children(".serch").on("click",function(){
		$.getJSON("http://d3j1728523.wicp.vip/order", function(jsonAllUser){
			showSerch(jsonAllUser);
		});
	});
	
	/*=======================================================================================*/
	// 变更前绑定
	/*=======================================================================================*/
	
	//绑定的数据
	var sysid = 0;
	var orderID = 0;
	var MobID = 0;
	var data = "";
	var AWB = "";
	var MobNum = 0;
	var Name = 0;
	var Address = 0;
	var Points = 0;
	var tfPoints = "";
	var Golden = "";
	var tfGolden = 0;
	var price = "";
	var discount = "";
	var Total = 0;
	var prodArr = "";
	
	//绑定指定用户
	$("#serchOrderID").children(".serch").on("click",function(){
		if(isNullOrUndefined($("input[name='rsOID']:checked").val())){
			var serchHref = $("input[name='rsOID']:checked").val() + "=" + $(this).prev().val();
			$.getJSON("http://d3j1728523.wicp.vip/order?" + serchHref, function(jsonTheUser){
				if(jsonTheUser.length > 0){
					//显示绑定的数据
					sysid = jsonTheUser[0].id;
					$("#sysid").text(sysid);
					orderID = jsonTheUser[0].orderID;
					$("#orderID").text(orderID);
					MobID = jsonTheUser[0].MobID;
					$("#MobID").text(MobID);
					data = jsonTheUser[0].data;
					$("input[name='data']").val(data);
					AWB = jsonTheUser[0].AWB;
					$("input[name='AWB']").val(AWB);
					MobNum = jsonTheUser[0].MobNum;
					$("input[name='MobNum']").val(MobNum);
					Name = jsonTheUser[0].Name;
					$("input[name='Name']").val(Name);
					Address = jsonTheUser[0].Address;
					$("input[name='Address']").val(Address);
					Points = jsonTheUser[0].Points[0];
					$("input[name='Points']").val(Points);
					tfPoints = jsonTheUser[0].Points[1];
					$("input[name='tfPoints']").val(tfPoints);
					Golden = jsonTheUser[0].Golden[0];
					$("input[name='Golden']").val(Golden);
					tfGolden = jsonTheUser[0].Golden[1];
					$("input[name='tfGolden']").val(tfGolden);
					price = jsonTheUser[0].price;
					$("input[name='price']").val(price);
					discount = jsonTheUser[0].discount;
					$("input[name='discount']").val(discount);
					Total = jsonTheUser[0].Total;
					$("input[name='Total']").val(Total);

					var sethtml = "";
					prodArr += ',"prodArr":[';
					for(var j = 0; j < jsonTheUser[0].prodArr.length; j++){
						prodArr += '{"proID":"' + jsonTheUser[0].prodArr[j].proID + '",';
						sethtml += '<br \><span style="font-size:24px;">' + jsonTheUser[0].prodArr[j].proID + '</span><br \>'; 

						prodArr += '"proName":"' + jsonTheUser[0].prodArr[j].proName + '",';
						sethtml += '<span style="font-size:24px;">' + jsonTheUser[0].prodArr[j].proName + '</span><br \>'; 

						prodArr += '"proParm":"' + jsonTheUser[0].prodArr[j].proParm + '"';
						sethtml += '<span style="font-size:24px;">' + jsonTheUser[0].prodArr[j].proParm + '</span><br \>'; 

						if(j === jsonTheUser[0].prodArr.length - 1){
							prodArr += '}';
						}else{
							prodArr += '},';
						}
					}
					prodArr += ']';
					$("#prodArr").html(sethtml);
				}else{
					alert("无法获取");
				}
			});
		}else{
			alert("未选择id或MobID！");
		}
	});
	
	/*=======================================================================================*/
	// 变更
	/*=======================================================================================*/

	$("#setFH").on("click",function(){
		$("input[name='AWB']").val("订单发货中...");
	});
	$("#setYC").on("click",function(){
		$("input[name='AWB']").val("订单异常！请联系客服！");
	});
	$("#setCL").on("click",function(){
		$("input[name='AWB']").val("订单处理中...");
	});
	$("#setSH").on("click",function(){
		$("input[name='AWB']").val("订单审核中...");
	});
	
	
	//修改
	$(".typeInfo").on("click",function(){
		sysid = $("#sysid").text();
		orderID = $("#orderID").text();
		MobID = $("#MobID").text();
		data = $("input[name='data']").val();
		AWB = $("input[name='AWB']").val();
		MobNum = $("input[name='MobNum']").val();
		Name = $("input[name='Name']").val();
		Address = $("input[name='Address']").val();
		Points = $("input[name='Points']").val();
		tfPoints = $("input[name='tfPoints']").val();
		Golden = $("input[name='Golden']").val();
		tfGolden = $("input[name='tfGolden']").val();
		price = $("input[name='price']").val();
		discount = $("input[name='discount']").val();
		Total = $("input[name='Total']").val();
		
		var cJsonData = '{"id":' + sysid + ',"orderID":' + orderID + ',"MobID":' + MobID + ',"data":"' + data + '","AWB":"' + AWB + '","MobNum":' + MobNum + ',"Name":"' + Name + '","Address":"' + Address + '","Points":[' + Points + ',' + tfPoints + '],"Golden":[' + Golden + ',' + tfGolden + '],"price":' + price + ',"discount":' + discount + ',"Total":' + Total + prodArr + '}';
		
		alert(cJsonData);
		$.ajax({
			type: "PUT",
			url: "http://d3j1728523.wicp.vip/order/" + sysid,
			async: false,
			contentType: "application/json",//; charset=utf-8
			data: cJsonData,
			dataType: "json",
			success: function () {

				$("#showTYPEzt").html("成功");
//				$("#showTYPEnr").html("内容："+cJsonData);

			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				console.log(XMLHttpRequest.status);
				console.log(XMLHttpRequest.readyState);
				console.log(textStatus);
				console.log(errorThrown);
				$("#showTYPEzt").html("失败");
//				$("#showTYPEnr").html("内容："+cJsonData);
			}
		});
	});
	//删除
	$(".typeDel").on("click",function(){
		sysid = $("#sysid").text();
		
		alert(sysid);
		
		$.ajax({
			type: "DELETE",
			url: "http://d3j1728523.wicp.vip/order/" + sysid,
			async: false,
			dataType: "json",
			success: function () {

				$("#showTYPEzt").html("成功");
				alert("删除数据成功，请自行刷新页面！");
//				$("#showTYPEnr").html("内容："+cJsonData);

			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				console.log(XMLHttpRequest.status);
				console.log(XMLHttpRequest.readyState);
				console.log(textStatus);
				console.log(errorThrown);
				$("#showTYPEzt").html("失败");
//				$("#showTYPEnr").html("内容："+cJsonData);
			}
		});
	});
	

});