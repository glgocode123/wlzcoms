$(function() {

	"use strict";
	
	
	// 获得当前页id
	var url = location.href;
	
	//cookieMobID需要改为调用cookie中的登录状态，成功就返回手机号
	var pattern = new RegExp(/^1[3,4,5,7,8][0-9]{9}$/),
		h,
		hash = url.slice(url.indexOf("?") + 1).split('&'),
		OrderID = "",
		MobID = "",
		orderProdID = [];
	for(var i=0; i<hash.length; i++){
		h = hash[i].split("=");
		if(h[0] === "orderid"){
			OrderID = h[1];
		}else if(h[0] === "Mob"){
			MobID = h[1];
		}else{
			orderProdID[h[0]] = h[1];
		}
	}
	
	
	//模拟cookie
	var	cookieMobID = MobID,
		cookieOrderID = OrderID;
	//页面数据初始化
	if(cookieMobID === MobID && cookieOrderID === OrderID){
		//如果获取的手机号正确，初始化填入order-form
		if (pattern.test(cookieMobID)){
			$('.order-form input[name="mob"]').val(cookieMobID);
			$('.order-form input[name="mob"]').parent().addClass('focus');
		}
		//填入订单中产品列表的数据
		if (orderProdID) {			
			var htmlVal = "";
			var ProdOrder = [];
			var iProdImg = "icon-img-1.jpg";
			var iProdImgPath = "img"+"/";
			var iProdTitle = "TEEBACCO球鞋系列图案印花短袖T恤";
			var iProdPrice = 229.00;
			var iProdParameter = ["白色","S","1"];
			
			var prodPrice = 999.23;
			var preferential = 0;
			
			for(var j = 0; j < 2; j++){
				var htmlRowSpacing = "<div class='empty-space h25-xs h45-md'></div>";
				var htmlRowSpacing2 = "<div class='empty-space h10-xs'></div>";
				var htmlRowSpacing3 = "<div class='empty-space h15-xs'></div>";
				
				var htmlProdImg = "<img src='"+iProdImgPath+iProdImg+"'>";
				var htmlProdTitle = "<span class='big'>"+iProdTitle+"</span>";
				var htmlProdPrice = "<span>价格：¥"+iProdPrice+"</span>";
				preferential += iProdPrice;
				var htmlProdParameter = "<p>颜色:"+iProdParameter[0]+"\xa0\xa0|\xa0\xa0尺寸:"+iProdParameter[1]+"\xa0\xa0|\xa0\xa0数量:"+iProdParameter[2]+"件</p>";
				
				htmlVal = htmlRowSpacing + "<div class='comment'>" + htmlProdImg + "<div class='description'>" + htmlProdTitle + htmlProdPrice + htmlRowSpacing2 + htmlProdParameter + htmlRowSpacing3 + "</div></div>";
			}
			
			preferential = preferential - prodPrice;
			
			if($("div#setProdList div.comment").length > 0){
				//如果已经有产品列表，在列表后写入
				$("div#setProdList div.comment").after(htmlVal);
			}else{
				//如果没有产品列表，为父元素添加子元素（列表）
				$("div#setProdList").append(htmlVal);
			}
			
			var prodNum = $("div#setProdList div.comment").length;
			//写入结算信息
			$("#setProdNum").text("共"+prodNum+"件，");
			$("#setProdPrice").text(prodPrice);
			$("#setPreferential").text("已使用红包（VIP金券），节省了"+preferential+"元");
		}
		
	}else{
		$(location).attr('href', '404.html');
	}

	$('#btnOrder').on("click", function(){
		var $this = $('.order-form');
						   
		$('.invalid').removeClass('invalid');						   
		var msg = '以下必填项不正确：',
//			successMessage = "商品将1～2日内发货，彼时可在会员中心查看快递单号.",
			error = 0;
		//如果输入的不是正确的手机号
        if (!pattern.test($.trim($('.order-form input[name="mob"]').val()))) 
		{error = 1; $this.find('input[name="mob"]').parent().addClass('invalid'); msg = msg +  '\n - 手机号';}
		//如果原先有手机号但是输入没有内容
		if ($.trim($('.order-form input[name="name"]').val()) === '') 
		{error = 1; $this.find('input[name="name"]').parent().addClass('invalid'); msg = msg +  '\n - 收货人';}
		if ($.trim($('.order-form textarea[name="address"]').val()) === '') 
		{error = 1; $this.find('textarea[name="address"]').parent().addClass('invalid'); msg = msg +  '\n - 收货地址';}

        if (error){
        	updateTextPopup('ERROR', msg);
        }else{
			//取得cookie中
			
			
			
			//如果数据正确
			$(location).attr('href', 'i.html');
			
//            var url = 'send_mail.php',
//            	mob = $.trim($this.find('input[name="mob"]').val()),
//            	name = $.trim($this.find('input[name="name"]').val()),
//            	subject = ($this.find('input[name="subject"]').length)?$.trim($this.find('input[name="subject"]').val()):'',
//            	address = $.trim($this.find('textarea[name="address"]').val());
//
//            $.post(url,{'mob':mob,'name':name,'subject':subject,'address':address},function(data){
//	        	updateTextPopup('THANK YOU!', successMessage);
//	        	$this.append('<input type="reset" class="reset-button"/>');
//	        	$('.reset-button').click().remove();
//	        	$this.find('.focus').removeClass('focus');
//			});
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