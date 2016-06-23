$(function(){
	var index=0;
	var $self=null;
	var $items=$(".tabs .item");
	$(".side-bar li").on("click",function(){
		$self=$(this);
		if($self.hasClass('on')) return;
		index=$self.index();
		$self.addClass('on').siblings().removeClass('on');
		$items.removeClass('on').eq(index).addClass('on');
	});
	$(".tabs").on("click",".topbar span",function(){
		$self=$(this);
		if($self.hasClass('on')) return;
		index=$self.index();
		$self.addClass('on').siblings().removeClass('on');
		$self.parent().next().find(".tab").eq(index).addClass('on').siblings().removeClass('on');
	});
});