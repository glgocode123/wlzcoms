// JavaScript Document
$(function () {

	"use strict";

	
	//cookieMobID需要改为调用cookie中的登录状态，成功就返回手机号
	var pattern = new RegExp(/^1[3,4,5,7,8][0-9]{9}$/),
		cookieMobID = 13602492312;
	
	//如果已经登录，跳转到用户中心，并把cookie获得的id传过去
	
	
	//如果获取的手机号正确
	if (pattern.test(cookieMobID)){
		$(location).attr("href","i.html?Mob="+cookieMobID);
	}
	
	
	$('#btn-order').on("click", function(){
		var $this = $('.login-form');
						   
		$('.invalid').removeClass('invalid');						   
		var msg = '以下必填项不正确：',
//			successMessage = "商品将1～2日内发货，彼时可在会员中心查看快递单号.",
			error = 0;
		//如果输入的不是正确的手机号
        if (!pattern.test($.trim($('.login-form input[name="mob"]').val()))) 
		{error = 1; $this.find('input[name="mob"]').parent().addClass('invalid'); msg = msg +  '\n - 手机号';}

        if (error){
        	updateTextPopup('ERROR', msg);
        }else{
			//直接跳转到i.html
			cookieMobID = $.trim($('.login-form input[name="mob"]').val());
			$(location).attr('href', 'i.html?Mob='+cookieMobID);
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