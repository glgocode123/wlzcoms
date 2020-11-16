// JavaScript Document
$(function () {

	"use strict";
	
//	function shareQQ(url, title, pic) {
//		var param = {
//			url: url || window.location.href,
//			desc: '', /*分享理由*/
//			title : title || '', /*分享标题(可选)*/
//			summary : '',/*分享描述(可选)*/
//			pics : pic || '',/*分享图片(可选)*/
//			flash : '', /*视频地址(可选)*/
//			site: '' /*分享来源 (可选) */
//		};
//		var s = [];
//		for (var i in param) {
//			s.push(i + '=' + encodeURIComponent(param[i] || ''));
//		}
//		var targetUrl = "http://connect.qq.com/widget/shareqq/iframe_index.html?" + s.join('&') ;
//		window.open(targetUrl, 'qq', 'height=520, width=720');
//	}
	
//	function sinaWeiBo(title, url, pic) {
//		var param = {
//			url: url || window.location.href,
//			type: '3',
//			count: '1', /** 是否显示分享数，1显示(可选)*/
//			appkey: '', /** 您申请的应用appkey,显示分享来源(可选)*/
//			title: '', /** 分享的文字内容(可选，默认为所在页面的title)*/
//			pic: pic || '', /**分享图片的路径(可选)*/ 
//			ralateUid:'', /**关联用户的UID，分享微博会@该用户(可选)*/
//			rnd: new Date().valueOf()
//		};
//		var temp = [];
//		for(var p in param) {
//			temp.push(p + '=' +encodeURIComponent( param[p ] || '' ) );
//		}
//		var targetUrl = 'http://service.weibo.com/share/share.php?' + temp.join('&');
//		window.open(targetUrl, 'sinaweibo', 'height=430, width=400');
//	}
	
	
	//点击微信图标
	$(".fa-wechat").on('click', function(){
		if( $(".wechat-qrcode").css("display")==='none'){ 
			$(".wechat-qrcode").show();
		}else{
			$(".wechat-qrcode").hide();
		}
	});
	
	//点击qq图标
	$(".fa-qq").on('click', function(){
//		http://connect.qq.com/widget/shareqq/index.html?url=你的分享网址&sharesource=qzone&title=你的分享标题&pics=你的分享图片地址&summary=你的分享描述&desc=你的分享简述
		
		var url = window.location.href;//你的分享网址
		var title = "QQ分享的文字内容";//分享的文字内容(可选，默认为所在页面的title)
		var pic = "../img/advabce-bg-top.jpg";//你的分享图片
		var summary = "QQ分享的分享描述";//你的分享描述
		var desc = "QQ分享的分享简述";//你的分享简述
		var href = 'http://connect.qq.com/widget/shareqq/index.html?url=' + url + '&sharesource=qzone&title=' + title + '&pics=' + pic + '&summary=' + summary + '&desc=' + desc;
		window.open(href, '_blank');
	});
	
	//点击weibo图标
	$(".fa-weibo").on('click', function(){
//		http://service.weibo.com/share/share.php?url=你的分享网址&sharesource=weibo&title=你的分享标题&pic=你的分享图片&appkey=你的key，需要在新浪微博开放平台中申请
		var url = window.location.href;//地址
		var title = "weibo分享的title文字内容";//分享的文字内容(可选，默认为所在页面的title)
		var pic = "../img/advabce-bg-top.jpg";//你的分享图片
		var href = 'http://service.weibo.com/share/share.php?url=' + url + '&sharesource=weibo&title=' + title + '&pic=' + pic + '&appkey=你的key，需要在新浪微博开放平台中申请';
		window.open(href, '_blank');
	});
	
	
});