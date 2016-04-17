var gList={
    pageIndex:1,
    pageSize:10,
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
        $(".c-container").on("click",".loadmore span",function(){
            gList.ajaxGalleryList(1);
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
        $('.c-list-badgewrap span').mouseover(function() {
            var $self=$(this);
            $bigbadge.attr('src',$self.find('img').attr('src'));
            $badgeText.html($self.data('note'));
        }).click(function(){
            var $self=$(this);
            $self.toggleClass('c-badge-active');
            if($self.is("#weekly_star")){
                $self.siblings().removeClass('c-badge-active');
            } else{
                $("#weekly_star").removeClass('c-badge-active');
            }
            gList.ajaxAuthorList();
        });
    },
    someVisionEvent:function(){ //some event which will ont be changed by ajax
        gList.ajaxAuthorList();  //ajax author list
        $(".g-icon-refresh").click(gList.ajaxAuthorList);
        $(".gl-artist-imglist").on("click","li",function(){
            $(this).toggleClass('on');
            gList.ajaxGalleryList();
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
            url: "http://139.196.195.4/gallery/artist",
            type:'POST',
            dataType:"JSONP",
            jsonp:"callbackparam",
            data: o,
            success: function(data){
                if(data.result=="success"){
                    gList.renderAuthorList(data);
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
        for(var i=0;i<len;i++){
            html+='<li data-id="'+list[i].artist_id+'"><a href="javascript:void(0);"><img src="'+list[i].artist_img+'" alt=""></a><span>'+list[i].artist_name+'</span></li>';
        }
        $(".gl-artist-imglist").html(html);
        gList.ajaxGalleryList();
    },
    ajaxGalleryList:function(page){ // ajax for the competition's list after selector
        gList.pageIndex=page&&(gList.pageIndex+1)||1;
        var o={
            artist:[],
            page_num:gList.pageIndex,
            page_size:gList.pageSize,
            type:2
        };
        if($("#weekly_star").hasClass('c-badge-active')) o.type=1;
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
                    gList.renderGalleryList(data);
                } else{
                    console.log('get competition list error');
                }
            },
            error:function(e){
                console.log('get competition list error');
            }
        });
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
    renderGalleryList:function(data){ //render the competition list data got by ajax
        var list=data.galleries;
        var listhtml='';
        var $con=$('#c-competition-list');
        if(gList.pageIndex==1){
            $con.html("");
        }
        for(var i=0;i<list.length;i++){
            listhtml+='<li class="c-list-wrap">'+
                        '<a class="ga-list-imga">'+
                            '<img src="'+list[i].gallery_img+'">'+
                        '</a>'+
                        '<div class="ga-list-text">'+
                            '<h2>'+list[i].title+'</h2>'+
                            '<div class="ga-list-subtitle">'+list[i].title+'</div>'+
                            '<div class="ga-list-year">'+list[i].title+'</div>'+
                            '<div class="ga-list-description">'+list[i].content+'</div>'+
                            '<ul class="c-list-likes">'+
                                '<li>'+
                                    '<a href="javascript:void(0);" class="g-icon g-icon-heart"></a>'+
                                    '<i>'+list[i].like_number+'</i>'+
                                '</li>'+
                                '<li>'+
                                    '<a href="javascript:void(0);" class="g-icon g-icon-see"></a>'+
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
        if(gList.pageIndex*gList.pageSize<data.total_num){
            $con.append('<li class="loadmore"><span>LOAD MORE</span></li>');
        }
        gList.badgesSwipe(); //competition list badges swiper
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
                        $self.toggleClass('g-icon-disabled');
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
    gList.init(); //start js
});
