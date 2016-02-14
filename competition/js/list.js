var cLsit={
    init:function(){
        this.badgesEvent(); //badges's hover and click events
        this.monthSelector(); //month selector event
        this.badgesSwipe(); //competition list badges swiper
        this.listCircleProcesser(); //list's circle processer
        this.listDetailShow(); //list's detail click to show or hide
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
            $self.parents(".c-list-wrap").find('.c-list-hiddenpart').stop().slideToggle();
            if($self.html()=="展开作品") {
                $self.html('收起作品');
            } else {
                $self.html('展开作品');
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
    }
};


$(function(){
    cLsit.init(); //start js
});
