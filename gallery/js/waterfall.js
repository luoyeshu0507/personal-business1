var wList={
    pageIndex:1,
    pageSize:10,
    type:1,
    typeChanged:false,
    itemIndex:0,
    init:function(){
        this.badgesEvent(); //badges's hover and click events
        this.authorSelector(); //author selector event
        this.someVisionEvent(); //some event which will ont be changed by ajax
        this.like(); //like,collect,share..
        this.loadmoreEvent();
        this.followSomeone();
    },
    followSomeone:function(){ //follow someone or unfollow someone
        $('.c-container').on("click",".t-user-info button",function(){
            var $self=$(this);
            var o={
                "service_id": $self.data('id'),
                "current_user": current_user
            }
            $.ajax({
                url: "http://139.196.195.4/follow",
                type:'POST',
                dataType:"JSONP",
                jsonp:"callbackparam",
                data: o,
                success: function(data){
                    if(data.result=='success'){
                        $self.toggleClass('d-disabled');
                    } else{
                        console.log('follow error');
                    }
                },
                error:function(e){
                    console.log('follow error');
                }
            });
        });
    },
    loadmoreEvent:function(){
        $("body").on("click",".loadmore span",function(){
            if(wList.type==1){
                wList.ajaxGalleryWeeklyStarList(1);
            } else{
                wList.ajaxGalleryStarList(1);
            }
        });
    },
    authorSelector:function(){ //month selector event
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
    badgesEvent:function(){ //badges's hover and click events
        var $bigbadge=$('.c-list-bigbadge');
        var $badgeText=$('.c-list-badgetext');
        var $con=$("#c-competition-list,.w-waterfall");
        $('.c-list-badgewrap span').mouseover(function() {
            var $self=$(this);
            $bigbadge.attr('src',$self.find('img').attr('src'));
            $badgeText.html($self.data('note'));
        }).click(function(){
            var $self=$(this);
            $self.toggleClass('c-badge-active');
            if($self.is("#weekly_star")){
                if(wList.type==2){
                    wList.type=1;
                    wList.typeChanged=true;
                    $con.hide();
                }
                $self.addClass("c-badge-active").siblings().removeClass('c-badge-active');
            } else{
                if(wList.type==1){
                    wList.type=2;
                    wList.typeChanged=true;
                    $con.hide();
                }
                if($('.c-badge-active:not("#weekly_star")').length==0){
                    $("#weekly_star").addClass('c-badge-active');
                    wList.type=1;
                    wList.typeChanged=true;
                    $con.hide();
                } else{
                    $("#weekly_star").removeClass('c-badge-active');
                }
            }
            wList.ajaxAuthorList();
        });
    },
    someVisionEvent:function(){ //some event which will ont be changed by ajax
        wList.ajaxAuthorList();  //ajax author list
        $(".g-icon-refresh").click(wList.ajaxAuthorList);
        $(".gl-artist-imglist").on("click","li",function(){
            $(this).toggleClass('on');
            if(wList.type==1){
                wList.ajaxGalleryWeeklyStarList();
            } else{
                wList.ajaxGalleryStarList();
            }
        });
    },
    ajaxAuthorList:function(){
        var o={
            badge:[]
        };
        var i=0,len=0;
        var $activeBadges=$(".c-list-badgewrap .c-badge-active");
        for(i=0,len=$activeBadges.length;i<len;i++){
            o.badge.push($activeBadges.eq(i).data('name'));
        }
        $.ajax({
            url: "http://139.196.195.4/magazines/artist",
            type:'POST',
            dataType:"JSONP",
            jsonp:"callbackparam",
            data: o,
            success: function(data){
                if(data.result=="success"){
                    wList.renderAuthorList(data);
                } else{
                    console.log('ajaxAuthorList error');
                }
            },
            error:function(e){
                console.log('ajaxAuthorList error');
            }
        });
    },
    renderAuthorList:function(data){
        var html="";
        var list=data.artists;
        var len=Math.min(list.length,12);
        console.log(data);
        for(var i=0;i<len;i++){
            html+='<li data-id="'+list[i].artist_id+'"><a href="javascript:void(0);"><img src="'+list[i].artist_img+'" alt=""></a><span>'+list[i].artist_name+'</span></li>';
        }
        $(".gl-artist-imglist").html(html);
        if(wList.type==1){
            wList.ajaxGalleryWeeklyStarList();
        } else{
            wList.ajaxGalleryStarList();
        }
    },
    ajaxGalleryWeeklyStarList:function(page){ // ajax for the competition's list after selector
        wList.pageIndex=page&&(wList.pageIndex+1)||1;
        var o={
            artist:[],
            page_num:wList.pageIndex,
            page_size:wList.pageSize,
            type:1
        };
        var $artists=$(".gl-artist-imglist li");
        for(var i=0;i<$artists.length;i++){
            o.artist.push($artists.eq(i).data("id"));
        }
        $.ajax({
            url: "http://139.196.195.4/gallery/artist/gallery",
            type:'POST',
            dataType:"JSONP",
            jsonp:"callbackparam",
            data: o,
            success: function(data){
                if(data.result=="success"){
                    wList.renderGalleryWeeklyStarList(data);
                } else{
                    console.log('get competition list error');
                }
            },
            error:function(e){
                console.log('get competition list error');
            }
        });
    },
    renderGalleryWeeklyStarList:function(data){ //render the competition list data got by ajax
        var list=data.galleries;
        var listhtml='';
        var $con=$('#c-competition-list');
        if(wList.pageIndex==1||wList.typeChanged){
            $con.html("").show();
            $(".w-waterfall").hide();
            wList.typeChanged=false;
        }
        for(var i=0;i<list.length;i++){
            listhtml+='<li class="c-list-wrap">'+
                        '<a class="ga-list-imga">'+
                            '<img src="'+list[i].gallery_img+'">'+
                        '</a>'+
                        '<div class="ga-list-text">'+
                            '<h2>'+list[i].title+'</h2>'+
                            '<div class="ga-list-subtitle">'+list[i].title+'</div>'+
                            '<div class="ga-list-year">'+new Date(list[i].create_time).getFullYear()+'</div>'+
                            '<div class="ga-list-description">'+list[i].content+'</div>'+
                            '<ul class="c-list-likes">'+
                                '<li>'+
                                    '<a href="javascript:void(0);" class="g-icon g-icon-heart '+(list[i].like_flag?"on":"")+'"></a>'+
                                    '<i>'+list[i].like_number+'</i>'+
                                '</li>'+
                                '<li>'+
                                    '<a href="javascript:void(0);" class="g-icon g-icon-see '+(list[i].collect_flag?"on":"")+'"></a>'+
                                    '<i>'+list[i].comment_number+'</i>'+
                                '</li>'+
                                '<li>'+
                                    '<a href="javascript:void(0);" class="g-icon g-icon-share"></a>'+
                                    '<i>'+list[i].collect_number+'</i>'+
                                '</li>'+
                            '</ul>'+
                        '</div>'+
                        '<div class="t-user-info">'+
                            '<a href="'+list[i].author_link_url+'" class="t-user-img">'+
                                '<img src="'+list[i].author_img+'">'+
                            '</a>'+
                            '<i>'+list[i].author_name+'</i>'+
                            '<span>'+list[i].author_address+'</span>'+
                            '<button data-id="'+list[i].author_id+'" class="'+(list[i].follow_flag?'d-disabled':'')+'">FOLLOW</button>'+
                        '</div>'+
                        '<div class="swiper-container">'+
                            '<div class="swiper-wrapper">'+
                                (function(list){
                                    var h="";
                                    for(var i=0;i<list.length;i++){
                                        h+='<div class="swiper-slide"><img src="'+list[i]+'"></div>';
                                    }
                                    return h;
                                })(list[i].author_badge)+
                            '</div>'+
                            '<div class="swiper-button-next"></div>'+
                            '<div class="swiper-button-prev"></div>'+
                        '</div>'+
                    '</li>';
        }
        $('.loadmore').remove();
        $con.append(listhtml);
        if(wList.pageIndex*wList.pageSize<data.total_num){
            $con.append('<li class="loadmore"><span>LOAD MORE</span></li>');
        }
        wList.badgesSwipe(); //competition list badges swiper
    },
    ajaxGalleryStarList:function(page){ // ajax for the competition's list after selector
        wList.pageIndex=page&&(wList.pageIndex+1)||1;
        var o={
            artist:[1,3],
            page_num:wList.pageIndex,
            page_size:wList.pageSize,
            type:2
        };
        var $artists=$(".gl-artist-imglist li");
        for(var i=0;i<$artists.length;i++){
            o.artist.push($artists.eq(i).data("id"));
        }
        $.ajax({
            url: "http://139.196.195.4/magazines/artist/magazine",
            type:'POST',
            dataType:"JSONP",
            jsonp:"callbackparam",
            data: o,
            success: function(data){
                if(data.result=="success"){
                    wList.renderGalleryStarList(data);
                } else{
                    console.log('get competition list error');
                }
            },
            error:function(e){
                console.log('get competition list error');
            }
        });
    },
    renderGalleryStarList:function(data){ //render the competition list data got by ajax
        var list=data.magazines;
        var listhtml={
            html0:"",
            html1:"",
            html2:""
        };
        var $con=$('.w-waterfall-items li');
        var rank=0;
        if(wList.pageIndex==1||wList.typeChanged){
            $con.html("").parent().parent().show();
            $('#c-competition-list').hide();
            wList.typeChanged=false;
            wList.itemIndex=0;
        }
        console.log(data);
        for(var i=0;i<list.length;i++){
            rank=wList.itemIndex++%3;
            listhtml["html"+rank]+='<div class="w-waterfall-item">'+
                                        '<a href="'+list[i].magazine_detail_url+'" class="w-waterfall-imga">'+
                                            '<img src="'+list[i].magazine_img+'" alt="">'+
                                        '</a>'+
                                        '<div class="w-waterfall-textwrap">'+
                                            '<a href="'+list[i].magazine_detail_url+'" class="w-waterfall-title">'+list[i].title+'</a>'+
                                            '<div class="w-waterfall-text">'+list[i].content+'</div>'+
                                            '<div class="w-waterfall-tips">'+
                                                '<a href="">food and drink</a>'+
                                                '<a href="">ps</a>'+
                                                '<a href="">people</a>'+
                                            '</div>'+
                                        '</div>'+
                                    '</div>';
        }
        $('.loadmore').remove();
        $con.eq(0).append(listhtml["html0"]);
        $con.eq(1).append(listhtml["html1"]);
        $con.eq(2).append(listhtml["html2"]);
        if(wList.pageIndex*wList.pageSize<data.total_num){
            $(".w-waterfall").append('<div class="loadmore"><span>LOAD MORE</span></div>');
        }
    },
    badgesSwipe:function(){ //competition list badges swiper
        $('.swiper-container').each(function(){
            $(this).swiper({
                nextButton: $(this).find('.swiper-button-next'),
                prevButton: $(this).find('.swiper-button-prev'),
                direction: 'vertical',
                slidesPerView: 5,
                slidesPerGroup : 5,
                freeMode: true
            });
        });
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
                "service_id":$self.parents('.c-list-wrap').data('id'),
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
    wList.init(); //start js
});
