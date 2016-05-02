var cList={
    init:function(){
        this.badgesEvent(); //badges's hover and click events
        this.monthSelector(); //month selector event
        this.listCircleProcesser(); //list's circle processer
        this.listDetailShow(); //list's detail click to show or hide
        this.someVisionEvent(); //some event which will ont be changed by ajax
        this.displayImage(); //display one image when clicked on fullscreen
        this.like(); //like,collect,share..
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
    listCircleProcesser:function(){ //list's circle processer
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
    monthSelector:function(){ //month selector event
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
    listDetailShow:function(){ //list's detail click to show or hide
        $('.c-container').on("click",".c-list-openbtn",function(){
            var $self=$(this);
            var $parent=$self.parents(".c-list-wrap");
            $parent.find('.c-list-hiddenpart').stop().slideToggle();
            if($self.html()=="展开") {
                cList.ajaxCompeitionWorks($parent);
                $self.html('收起');
                $parent.find('.c-list-detail').animate({'max-height':'300px'},300);
            } else {
                $self.html('展开');
                $parent.find('.c-list-detail').animate({'max-height':'140px'},300);
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
        }).last().addClass("c-year-active");

        //badges swiper
        $('.c-list-badges-swiper span,.c-list-badges-swiper i').click(function(){
            cList.swipBadges($(this).data('direction'));
        });

        $(".c-container").on("mouseover",'.c-list-right li',function(){
            $(this).css('max-height','none');
        }).end().on("mouseout",'.c-list-right li',function(){
            $(this).css('max-height','36px');
        })

        //selector
        $('.c-list-badgewrap span,.c-list-month li,.c-list-years .swiper-slide').click(this.selector);
        this.selector();
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
    swipListImgs:function(){ // swip ListImgs
        $('.c-list-listimgs').swiper({
            pagination: '.swiper-pagination',
            slidesPerView: 6,
            slidesPerGroup : 6,
            centeredSlides: false,
            paginationClickable: true,
            spaceBetween: 28
        });
    },
    displayImage:function(){
        $('body').on('click','.c-list-listimgs .swiper-slide img,.c-list-img img',function(){
            $body=$('body').append($('<div id="c-display-imgbg"></div>'))
            .append($('<div class="c-display-imgwrap"></div>').append($('<img>').attr('src',$(this).attr('src'))));
            $('#c-display-imgbg,.c-display-imgwrap').click(function(){
                $('#c-display-imgbg,.c-display-imgwrap').remove();
            });
            $('.c-display-imgwrap img').click(function(){
                return false;
            });
            return false;
        });
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
        cList.ajaxCompeitionList(postdata);
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
                    cList.renderCompetitionList(data);
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
                            '<a href="javascript:void(0);" class="c-list-openbtn">展开</a>'+
                            '<ul class="c-list-likes">'+
                                '<li>'+
                                    '<a href="javascript:void(0);" data-interaction="0" class="g-icon g-icon-heart '+(list[i].like_flag?'on':'')+'"></a>'+
                                    '<i>'+list[i].like_num+'</i>'+
                                '</li>'+
                                '<li>'+
                                    '<a href="javascript:void(0);" data-interaction="1" class="g-icon g-icon-see '+(list[i].collect_flag?'on':'')+'"></a>'+
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
        cList.badgesSwipe(); //competition list badges swiper
        cList.swipListImgs(); //swipe list images
    },
    ajaxCompeitionWorks:function($obj){ //after click '展开作品', get the works with ajax
        var cid=$obj.data('id');
        var o={
            competition_id:cid,
            page_size:100,
            page_num:1
        }
        if($obj.find('.c-list-imgswrap').length>0) return;
        if(cid) {
            $.ajax({
                url: "http://139.196.195.4/competition/homepage/artwork",
                type:'POST',
                dataType:"JSONP",
                jsonp:"callbackparam",
                data: o,
                success: function(data){
                    if(data.result=='success'){
                        var list=data.artworks;
                        var html='';
                        for(var i=0;i<list.length;i++){
                            html+='<a data-id="'+list[i].id+'" href="/competition/artwork/detail/'+list[i].id+'" class="c-list-imgswrap" target="_blank">'+
                                        '<span data-score="'+list[i].total_score+'" data-vote="'+list[i].total_vote+'">'+
                                            '<img src="'+list[i].img+'">'+
                                            '<em><b title="score:'+list[i].total_score+'">2.5</b><strong title="vote:'+list[i].total_vote+'"></strong></em>'+
                                        '</span>'+
                                        '<i>'+list[i].title+'</i>'+
                                    '</a>';
                        }
                        $obj.find('.c-list-hiddenpart').append(html);
                    } else{
                        console.log('get works error');
                    }
                },
                error:function(e){
                    console.log('get works error');
                }
            });
        }
    },
    like:function(){
        $('.c-container').on('click','.c-list-likes .g-icon',function(){
            var $self=$(this);
            var service_id=$self.parents('.c-list-wrap').data('id');
            var interaction_type=$self.data('interaction');
            if(interaction_type!='0'&&interaction_type!='1') return;
            var o={
                "current_user":current_user,
                "interaction_type":interaction_type,
                "service_type":'2',
                "service_id":service_id,
                "author_id":78
            }
            $.ajax({
                url: "http://139.196.195.4/interaction/operate",
                type:'POST',
                dataType:"JSONP",
                jsonp:"callbackparam",
                data: o,
                success: function(data){
                    if(data.result=='success'){
                        $self.toggleClass('on');
                        var num=$self.next().html()-1+1;
                        if($self.hasClass('on')){
                            num++;
                        } else{
                            num=num&&--num;
                        }
                        $self.next().html(num);
                    } else{
                        console.log('like error');
                    }
                },
                error:function(e){
                    console.log('like error');
                }
            });
        });
    }
};


$(function(){
    cList.init(); //start js
});
