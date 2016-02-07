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
});
