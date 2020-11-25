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
//	$('#chaxun[name="mob"]').val();
	/*=======================================================================================*/
	// 查询
	/*=======================================================================================*/
	
	//查询全部
	$("#serchAll").children(".serch").on("click",function(){
		$.getJSON("http://d3j1728523.wicp.vip/user", function(jsonAllUser){
			var sethtml = "";
			for(var i = 0; i < jsonAllUser.length; i++){
				sethtml += '<div style="font-size:24px;">id:' + jsonAllUser[i].id + '</div>';
				sethtml += '<div style="font-size:24px;">MobID:' + jsonAllUser[i].MobID + '</div>';
				sethtml += '<div style="font-size:24px;">Points:' + jsonAllUser[i].Points + '</div>';
				sethtml += '<div style="font-size:24px;">Golden:' + jsonAllUser[i].Golden + '</div>';
				sethtml += '<div style="font-size:24px;">Buy:' + jsonAllUser[i].Buy + '</div>';
				sethtml += '<div style="font-size:24px;">Bad:' + jsonAllUser[i].Bad + '</div><br \>';
			}
			$("#showSerchValue").html(sethtml);
		});
	});
	
	//查询今日有购买的人
	$("#serchBuy").children(".serch").on("click",function(){
		$.getJSON("http://d3j1728523.wicp.vip/user?Buy=" + $("input[name='isBuy']:checked").val(), function(jsonAllUser){
			var sethtml = "";
			for(var i = 0; i < jsonAllUser.length; i++){
				sethtml += '<div style="font-size:24px;">id:' + jsonAllUser[i].id + '</div>';
				sethtml += '<div style="font-size:24px;">MobID:' + jsonAllUser[i].MobID + '</div>';
				sethtml += '<div style="font-size:24px;">Points:' + jsonAllUser[i].Points + '</div>';
				sethtml += '<div style="font-size:24px;">Golden:' + jsonAllUser[i].Golden + '</div>';
				sethtml += '<div style="font-size:24px;">Buy:' + jsonAllUser[i].Buy + '</div>';
				sethtml += '<div style="font-size:24px;">Bad:' + jsonAllUser[i].Bad + '</div><br \>';
			}
			$("#showSerchValue").html(sethtml);
		});
	});
//	?MobID="+inputMob

	/*=======================================================================================*/
	// 变更前绑定
	/*=======================================================================================*/
	//绑定指定用户
	$("#serchID").children(".serch").on("click",function(){
		var serchHref = $("input[name='rsID']:checked").val() + "=" + $(this).prev().val();
		$.getJSON("http://d3j1728523.wicp.vip/user?" + serchHref, function(jsonTheUser){
			if(jsonTheUser.length > 0){
				//显示绑定的数据
				$("#ssvid").text(jsonTheUser[0].id);
				$("#ssvMobID").text(jsonTheUser[0].MobID);
				$("input[name='ssvP']").val(jsonTheUser[0].Points);
				$("input[name='ssvG']").val(jsonTheUser[0].Golden);
				$("input[name='ssvAdvance']").val(jsonTheUser[0].Advance);
				$("input[name='ssvBuy']").val(jsonTheUser[0].Buy);
				$("input[name='ssvBad']").val(jsonTheUser[0].Bad);
			}else{
				alert("无法获取");
			}
		});
	});
	
	/*=======================================================================================*/
	// 变更
	/*=======================================================================================*/
	
	//绑定的数据
	var ssvid = 0;
	var ssvMobID = 0;
	var ssvP = 0;
	var ssvG = 0;
	var ssvA = false;
	var ssvBuy = false;
	var ssvBad = false;
	//修改
	$(".typeInfo").on("click",function(){
		ssvid = $("#ssvid").text();
		ssvMobID = $("#ssvMobID").text();
		ssvP = $("input[name='ssvP']").val();
		ssvG = $("input[name='ssvG']").val();
		ssvA = $("input[name='ssvAdvance']").val();
		ssvBuy = $("input[name='ssvBuy']").val();
		ssvBad = $("input[name='ssvBad']").val();
		
		var cJsonData = '{"id":' + ssvid + ',"MobID":' + ssvMobID + ',"Points":' + ssvP + ',"Golden":' + ssvG + ',"Buy":' + ssvBuy + ',"Advance":' + ssvA + ',"Bad":' + ssvBad + '}';
		
		alert(cJsonData);
		$.ajax({
			type: "PUT",
			url: "http://d3j1728523.wicp.vip/user/" + ssvid,
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
		ssvid = $("#ssvid").text();
		
		$.ajax({
			type: "DELETE",
			url: "http://d3j1728523.wicp.vip/user/" + ssvid,
			async: false,
			dataType: "json",
			success: function () {

				$("#showTYPEzt").html("成功");
				
				ssvid = 0;
				ssvMobID = 0;
				ssvP = 0;
				ssvG = 0;
				ssvA = false;
				ssvBuy = false;
				ssvBad = false;
				
				$("#ssvid").text("如没有显示，请勿操作！");
				$("#ssvMobID").text("如没有显示，请勿操作！");
				$("input[name='ssvP']").val("");
				$("input[name='ssvG']").val("");
				$("input[name='ssvAdvance']").val();
				$("input[name='ssvBuy']").val("");
				$("input[name='ssvBad']").val("");
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
	//加入黑名单
	$(".addBad").on("click",function(){
		ssvid = $("#ssvid").text();
		ssvMobID = $("#ssvMobID").text();
		ssvP = $("input[name='ssvP']").val();
		ssvG = $("input[name='ssvG']").val();
		ssvA = $("input[name='ssvAdvance']").val();
		ssvBuy = $("input[name='ssvBuy']").val();
		
		$("input[name='ssvBad']").val('true');
		ssvBad = $("input[name='ssvBad']").val();
		
		var cJsonData = '{"id":' + ssvid + ',"MobID":' + ssvMobID + ',"Points":' + ssvP + ',"Golden":' + ssvG + ',"Buy":' + ssvBuy + ',"Advance":' + ssvA + ',"Bad":' + ssvBad + '}';
		
		alert(cJsonData);
		$.ajax({
			type: "PUT",
			url: "http://d3j1728523.wicp.vip/user/" + ssvid,
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
	//解除黑名单
	$(".delBad").on("click",function(){
		ssvid = $("#ssvid").text();
		ssvMobID = $("#ssvMobID").text();
		ssvP = $("input[name='ssvP']").val();
		ssvG = $("input[name='ssvG']").val();
		ssvA = $("input[name='ssvAdvance']").val();
		ssvBuy = $("input[name='ssvBuy']").val();
		
		$("input[name='ssvBad']").val('false');
		ssvBad = $("input[name='ssvBad']").val();
		
		var cJsonData = '{"id":' + ssvid + ',"MobID":' + ssvMobID + ',"Points":' + ssvP + ',"Golden":' + ssvG + ',"Buy":' + ssvBuy + ',"Advance":' + ssvA + ',"Bad":' + ssvBad + '}';
		
		alert(cJsonData);
		$.ajax({
			type: "PUT",
			url: "http://d3j1728523.wicp.vip/user/" + ssvid,
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
	
});