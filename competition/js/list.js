$(function(){
	var swiper = new Swiper('.c-list-middle .swiper-container', {
        pagination: '.swiper-pagination',
        nextButton: '.swiper-button-next',
        prevButton: '.swiper-button-prev',
        paginationClickable: true,
        slidesPerView: 5,
        slidesPerGroup : 5,
        freeMode: true
    });
    $('.c-container').on('mouseenter','.c-list-imgswrap span',function(){
    	if($(this).find('canvas').length) return;
		var score=$(this).data('score');
		var vote=$(this).data('vote');
		var $em=$(this).find('em');
		var $b=$em.find("b");
		var $strong=$em.find("strong");
		$em.circleProgress({
	        value: score/10,
	        size: 72,
	        thickness:9,
	        fill: {
	            gradient: ["#4dbf84"]
	        },
	        emptyFill:'#cceddc'
	    }).on('circle-animation-progress',function(event, animationProgress, stepValue){
	    	$b.html((animationProgress*score).toFixed(1));
	    	$strong.html((animationProgress*vote).toFixed(0));
	    });
    });

    //month selector
    $('.c-list-month li').click(function(){
    	var $self=$(this);
    	var $list=$('.c-list-month li');
    	var $siblings=$self.siblings('.c-bright-point');
    	var start=-1;
    	var end=-1;
    	var index=$list.index($self);
    	if($siblings.length==0){
    		$self.toggleClass('c-bright-point');
    	} else if($siblings.length==1){
			start=$list.index($siblings);
			end=Math.max(index,start);
            start=Math.min(index,start);
			$list.removeClass("c-bright-point c-bright-line").slice(start,end).addClass("c-bright-point c-bright-line").next().addClass("c-bright-point");
    	} else{
    		start=$list.index($siblings.eq(0));
    		end=$list.index($siblings.last());
    		if(index<=start) start=index;
			else if(index>=end) end=index;
    		else index-start>=end-index ? end=index:start=index;
    		$list.removeClass("c-bright-point c-bright-line").slice(start,end).addClass("c-bright-point c-bright-line").next().addClass("c-bright-point");
    	}
    });

    $('.c-container').on("click",".c-list-openbtn",function(){
    	$(this).parents(".c-list-wrap").find('.c-list-hiddenpart').stop().slideToggle();
    });
});
