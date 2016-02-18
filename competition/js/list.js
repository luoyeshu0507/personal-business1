var cLsit={
    init:function(){
        this.badgesEvent(); //badges's hover and click events
        this.monthSelector(); //month selector event
        this.badgesSwipe(); //competition list badges swiper
        this.listCircleProcesser(); //list's circle processer
        this.listDetailShow(); //list's detail click to show or hide
        this.someVisionEvent(); //some event which will ont be changed by ajax
    },
    badgesSwipe:function(){
        $('.c-list-middle .swiper-container').each(function(){
            $(this).swiper({
                nextButton: $(this).find('.swiper-button-next'),
                prevButton: $(this).find('.swiper-button-prev'),
                slidesPerView: 5,
                slidesPerGroup : 5,
                freeMode: true
            });
        });
    },
    listCircleProcesser:function(){
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
    },
    monthSelector:function(){
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
                if($(this).hasClass('c-bright-point')){
                    $siblings.removeClass("c-bright-point c-bright-line");
                    $(this).removeClass('c-bright-line');
                } else{
                    start=$list.index($siblings);
                    end=Math.max(index,start);
                    start=Math.min(index,start);
                    $list.removeClass("c-bright-point c-bright-line").slice(start,end).addClass("c-bright-point c-bright-line").next().addClass("c-bright-point");
                }
            } else{
                start=$list.index($siblings.eq(0));
                end=$list.index($siblings.last());
                if(index<=start) start=index;
                else if(index>=end) end=index;
                else index-start>=end-index ? end=index:start=index;
                $list.removeClass("c-bright-point c-bright-line").slice(start,end).addClass("c-bright-point c-bright-line").next().addClass("c-bright-point");
            }
        }); 
    },
    listDetailShow:function(){
        $('.c-container').on("click",".c-list-openbtn",function(){
            var $self=$(this);
            var $parent=$self.parents(".c-list-wrap");
            $parent.find('.c-list-hiddenpart').stop().slideToggle();
            if($self.html()=="展开作品") {
                $self.html('收起作品');
                $parent.find('.c-list-detail').animate({'max-height':'300px'},300);
            } else {
                $self.html('展开作品');
                $parent.find('.c-list-detail').animate({'max-height':'140px'},300);
            }
        });
    },
    badgesEvent:function(){
        var $bigbadge=$('.c-list-bigbadge');
        var $badgeText=$('.c-list-badgetext');
        $('.c-list-badgewrap span').mouseover(function() {
            var $self=$(this);
            $self.css("z-index",'1').siblings().css('z-index','auto');
            $bigbadge.attr('src',$self.find('img').attr('src'));
            $badgeText.html($self.data('note'));
        }).click(function(){
            $(this).toggleClass('c-badge-active');
        });
    },
    someVisionEvent:function(){
        //years swiper
        $('.c-list-years').swiper({
            slidesPerView: 3,
            slidesPerGroup : 3,
            centeredSlides: false,
            spaceBetween: 0,
            nextButton: $('.c-list-years').find('.swiper-next'),
            prevButton: $('.c-list-years').find('.swiper-prev')
        }).slideTo(100,0);
        $('.c-list-years').find('.swiper-slide').click(function(){
            $(this).addClass("c-year-active").siblings().removeClass('c-year-active');
        }).last().addClass("c-year-active");

        //badges swiper
        $('.c-list-badges-swiper span,.c-list-badges-swiper i').click(function(){
            cLsit.swipBadges($(this).data('direction'));
        });
    },
    swipBadges:function(direction){
        var $badges=$('.c-list-badgewrap span');
        var $shownBadges=$badges.not(":hidden");
        var $nextall=$shownBadges.last().nextAll();
        var $prevall=$shownBadges.first().prevAll();
        var len=8;
        $badges.stop(true,true).fadeOut(200);
        if(direction=='prev'){
            if($prevall.length>0){
                $prevall.slice(-len).stop(true,true).fadeIn(200);
            } else {
                var last=$badges.length%len||len;
                $badges.slice(-last).stop(true,true).fadeIn(200);
            }
        } else if(direction=='next'){
            if($nextall.length>0){
                $nextall.slice(0,len).stop(true,true).fadeIn(200);
            } else {
                $badges.slice(0,len).stop(true,true).fadeIn(200);
            }
        }
    }
};


$(function(){
    cLsit.init(); //start js
    $('.c-list-listimgs').swiper({
        pagination: '.swiper-pagination',
        slidesPerView: 6,
        slidesPerGroup : 6,
        centeredSlides: false,
        paginationClickable: true,
        spaceBetween: 28
    });

    var o={
        "content_score": 3.37273, 
        "form_score": 1.89092, 
        "result": "success", 
        "technique_score": 3.27273, 
        "total_rated": 22, 
        "total_score": 2.85557
    };
    $.ajax({
        url: "http://139.196.195.4/competition/vote",
        type:'POST',
        dataType:"JSONP",
        jsonp:"callbackparam",
        data: o,
        success: function(data){
            console.log(data)
        },
        error:function(e){
            console.log('vote error');
        }
    });
});
