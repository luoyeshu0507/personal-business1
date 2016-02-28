var tList={
    init:function(){
        this.badgesEvent(); //badges's hover and click events
        this.monthSelector(); //month selector event
        this.someVisionEvent(); //some event which will ont be changed by ajax
        this.badgesSwipe();
    },
    badgesSwipe:function(){ //competition list badges swiper
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
    monthSelector:function(){ //month selector event
        $('.t-months i').click(function(){
            var $self=$(this);
            var $list=$('.t-months i');
            var $siblings=$self.siblings('.on');
            var start=-1;
            var end=-1;
            var index=$list.index($self);
            if($siblings.length==0){
                $self.toggleClass('on');
            } else if($siblings.length==1){
                if($(this).hasClass('on')){
                    $siblings.removeClass("on");
                } else{
                    start=$list.index($siblings);
                    end=Math.max(index,start);
                    start=Math.min(index,start);
                    $list.removeClass("on").slice(start,end+1).addClass("on");
                }
            } else{
                start=$list.index($siblings.eq(0));
                end=$list.index($siblings.last());
                if(index<=start) start=index;
                else if(index>=end) end=index;
                else index-start>=end-index ? end=index:start=index;
                $list.removeClass("on").slice(start,end+1).addClass("on");
            }
        }); 
    },
    badgesEvent:function(){ //badges's hover and click events
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
    someVisionEvent:function(){ //some event which will ont be changed by ajax
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
            $('.t-months i').removeClass('on');
        }).last().addClass("c-year-active");

        //badges swiper
        $('.c-list-badges-swiper span,.c-list-badges-swiper i').click(function(){
            tList.swipBadges($(this).data('direction'));
        });

        //selector
        // $('.c-list-badgewrap span,.c-list-month li,.c-list-years .swiper-slide').click(this.selector);
        // this.selector();
    },
    swipBadges:function(direction){ //swip Badges
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
    },
    selector:function(){ // the selector event on the top of the page
        var postdata={
            badge:[],
            start_month:1,
            end_month:12,
            page_size:100,
            page_num:1,
            year:2016
        };
        var i=0,len=0;
        var $activeBadges=$(".c-list-badgewrap .c-badge-active");
        var $month=$('.c-list-month li.c-bright-point');
        for(i=0,len=$activeBadges.length;i<len;i++){
            postdata.badge.push($activeBadges.eq(i).data('name'));
        }
        if($month.length>0){
            postdata.start_month=$month.eq(0).index()+1;
            postdata.end_month=$month.last().index()+1;
        }
        postdata.year=parseInt($(".c-year-active").text());
        tList.ajaxCompeitionList(postdata);
    },
    ajaxCompeitionList:function(o){ // ajax for the competition's list after selector
        $.ajax({
            url: "http://139.196.195.4/competition/homepage/list",
            type:'POST',
            dataType:"JSONP",
            jsonp:"callbackparam",
            data: o,
            success: function(data){
                if(data.result=="success"){
                    console.log(data);
                    tList.renderCompetitionList(data);
                } else{
                    console.log('get competition list error');
                }
            },
            error:function(e){
                console.log('get competition list error');
            }
        });
    },
    renderCompetitionList:function(data){ //render the competition list data got by ajax
        var list=data.competition;
        var listhtml='';
        var imgshtml='';
        for(var i=0;i<list.length;i++){
            listhtml+='<li class="c-list-wrap" data-id="'+list[i].id+'">'+
                    '<div class="c-list-shownpart">'+
                        '<a href="#" target="_blank" class="c-list-img '+(list[i].open_status ? 'c-list-closed':'')+'">'+
                            '<img src="'+list[i].img+'" alt="">'+
                        '</a>'+
                        '<div class="c-list-middle">'+
                            '<h3>'+list[i].title+'</h3>'+
                            '<div class="c-list-tip">'+list[i].type+'</div>'+
                            '<div class="swiper-container">'+
                                '<div class="swiper-wrapper">'+
                                    (function(badges){
                                        var html='';
                                        for(var j=0;j<badges.length;j++){
                                            html+='<div class="swiper-slide"><img src="'+badges[j]+'"></div>';
                                        }
                                        return html;
                                    })(list[i].badge)+
                                '</div>'+
                                '<div class="swiper-button-next"></div>'+
                                '<div class="swiper-button-prev"></div>'+
                            '</div>'+
                            '<p class="c-list-detail">'+list[i].content+'</p>'+
                            '<a href="javascript:void(0);" class="c-list-openbtn">展开作品</a>'+
                            '<ul class="c-list-likes">'+
                                '<li>'+
                                    '<a href="javascript:void(0);" data-interaction="0" class="g-icon g-icon-heart"></a>'+
                                    '<i>'+list[i].like_num+'</i>'+
                                '</li>'+
                                '<li>'+
                                    '<a href="javascript:void(0);" data-interaction="1" class="g-icon g-icon-see"></a>'+
                                    '<i>'+list[i].collect_num+'</i>'+
                                '</li>'+
                                '<li>'+
                                    '<a href="javascript:void(0);" data-interaction="4" class="g-icon g-icon-share"></a>'+
                                    '<i>'+list[i].share_num+'</i>'+
                                '</li>'+
                            '</ul>'+
                        '</div>'+
                        '<ul class="c-list-right">'+
                            '<li>'+
                                '<i>主办者：</i>'+
                                '<em>'+list[i].organizer.join(" ")+'</em>'+
                            '</li>'+
                            '<li>'+
                                '<i>赞助方/ainmal：</i>'+
                                '<em>'+list[i].sponsor+'</em>'+
                            '</li>'+
                            '<li>'+
                                '<i>参赛费用：</i>'+
                                '<em>'+list[i].fee+'</em>'+
                            '</li>'+
                            '<li>'+
                                '<i>评判标准：</i>'+
                                '<em>'+list[i].rule+'</em>'+
                            '</li>'+
                            '<li>'+
                                '<i>颁发奖项：</i>'+
                                '<em>希特勒艺术基金 + Pigment</em>'+
                            '</li>'+
                            '<li>'+
                                '<i>联络方式：</i>'+
                                '<em>'+list[i].contact+'</em>'+
                            '</li>'+
                            '<li>'+
                                '<i>收件期限：</i>'+
                                '<em>截止到2016年5月7日（上传皆可评选）</em>'+
                            '</li>'+
                        '</ul>'+
                    '</div>'+
                    '<div class="c-list-hiddenpart clearfix">'+
                        '<i class="c-list-arrow"></i>'+
                        '<button class="c-list-subbtn">SUBMIT</button>'+
                    '</div>'+
                '</li>';
            imgshtml+='<div class="swiper-slide">'+
                            '<a href="javascript:void(0);">'+
                                '<img src="'+list[i].img+'" alt="">'+
                            '</a>'+
                        '</div>';
        }
        $('#c-competition-list').html(listhtml);
        $('.c-list-listimgs .swiper-wrapper').html(imgshtml);
        tList.badgesSwipe(); //competition list badges swiper
    }
};


$(function(){
    tList.init(); //start js
});
