// JavaScript Document
$(function () {

	"use strict";
	
	

	/*================*/
	/* 00 - 生成二维码 */
	/*================*/
	
	if ( $("#qrcode").length > 0 ) {
		new QRCode(document.getElementById("qrcode"), {
			text: location.href,
			width: 650,
			height: 650,
			colorDark : "#000000",
			colorLight : "#ffffff",
			correctLevel : QRCode.CorrectLevel.H
		});
		$("#qrcode").children("img").css("width","70%").css("float","none").css("margin","0 auto");
	}
	
	if ( $("#shareQRcode").length > 0 ) {
		new QRCode(document.getElementById("shareQRcode"), {
			text: location.href,
			width: 100,
			height: 100,
			colorDark : "#000000",
			colorLight : "#ffffff",
			correctLevel : QRCode.CorrectLevel.H
		});
		$("#shareQRcode").children("img").css("float","none").css("margin","0 auto");
	}

//	function makeCode () {      
//		var elText = document.getElementById("text");
//
//		if (!elText.value) {
//			alert("Input a text");
//			elText.focus();
//			return;
//		}
//
//		qrcode.makeCode(elText.value);
//	}
//
//	makeCode();

//	$("#text").on("blur", function () {
//		makeCode();
//	}).on("keydown", function (e) {
//		if (e.keyCode == 13) {
//			makeCode();
//		}
//	});

	
	
});