$(function(){
	//banner swiper
    var galleryTop = new Swiper('.gallery-top', {
        nextButton: '.gallery-top .swiper-button-next',
        prevButton: '.gallery-top .swiper-button-prev'
    });
    var galleryThumbs = new Swiper('.gallery-thumbs', {
        spaceBetween: 10,
        slidesPerView: 'auto',
        touchRatio: 0.2,
        slideToClickedSlide: true,
        centeredSlides:true
    });
    galleryTop.params.control = galleryThumbs;
    galleryThumbs.params.control = galleryTop;

    //circle processer color
	var colorlist=[
		{
			bgcolor:"fcdbdc",
			circlecolor:"f38387"
		},
		{
			bgcolor:"fdfcf0",
			circlecolor:"f6f0b5"
		},
		{
			bgcolor:"dcf1fa",
			circlecolor:"87d0ee"
		},
		{
			bgcolor:"dcf3e8",
			circlecolor:"87d5b1"
		}
	];
	//draw circle processer
    $("[data-circle]").each(function(index){
    	var width=$(this).width();
    	var $span=$(this).find('span');
    	if(index>3) {
    		index=(index-1)%3;
    		width+=10;
    	}
    	$(this).circleProgress({
	        value: $(this).data('circle')/10,
	        size: width-10,
	        thickness:width/11,
	        startAngle:-Math.PI/2,
	        fill: {
	            gradient: ['#'+colorlist[index].circlecolor]
	        },
	        emptyFill:'#'+colorlist[index].bgcolor
	    }).on('circle-animation-progress',function(event, animationProgress, stepValue){
	    	$span.html((stepValue*10).toFixed(1));
	    });
    });

    //score marker
    $('.d-mark-scoretips span').on("mousedown",function(event){
		var $that=$(this);
    	var left=$(this).css("left");
    	var pagex=event.pageX;
    	var newleft=0;
    	$(document).on('mousemove.myevent',function(event) {
    		event.preventDefault();
			newleft=event.pageX-pagex+parseInt(left);
			newleft=newleft>-10 ? newleft : -10; 
			newleft=newleft<263 ? newleft : 263; 
    		$that.css('left',newleft+"px");
    		$that.html((10*(newleft+10)/273).toFixed(1));
    	}).on('mouseup.myevent',function(event) {
    		$(this).unbind('.myevent');
    	});
    });

    //submit your score
    $('.d-mark-subbtn').click(function(){
    	if($(this).hasClass("d-disabled")) return;
    	var sum=0,item=0;
    	$('.d-mark-scoretips span').each(function(i){
    		item=$(this).html()/10;
    		sum+=item;
    		$(".d-circle").eq(i).circleProgress({ value: item });
    	});
    	$(".d-circle").eq(3).circleProgress({ value: sum/3 });
    	$(this).addClass("d-disabled");
    });

    //the artist's badges swiper
    var swiper = new Swiper('.d-about-artist .swiper-container', {
        nextButton: '.d-about-artist .swiper-button-next',
        prevButton: '.d-about-artist .swiper-button-prev',
        paginationClickable: true,
        slidesPerView: 5,
        slidesPerGroup : 5,
        freeMode: true
    });
});

