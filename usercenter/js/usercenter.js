var uCenter={
    init:function(){
    	this.tabsEvent();
    	this.badgesEvent();
    },
    tabsEvent:function(){
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
    },
    badgesEvent:function(){
    	var $bigbadge=$(".big-badge");
    	var $note=$(".note");
    	var $name=$(".badge-wrap .name");
    	var $level=$(".level");
    	var $target=$(".target");
    	$(".badges").on("mouseover","span",function(){
    		var $self=$(this);
			$bigbadge.attr("src",$self.find("img").attr("src")).show();
			$note.html($self.data("note"));
			$name.html($self.data("name"));
			$level.html("Level "+($self.data("level")||0));
    	});
    }
};


$(function(){
    uCenter.init(); //start js
});
