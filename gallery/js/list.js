var gList={
    pageIndex:1,
    pageSize:10,
    type:1,
    typeChanged:false,
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
            if(gList.type==1){
                gList.ajaxGalleryWeeklyStarList(1);
            } else{
                gList.ajaxGalleryStarList(1);
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
        var $con=$("#c-competition-list,.w-worklist");
        $('.c-list-badgewrap span').mouseover(function() {
            var $self=$(this);
            $bigbadge.attr('src',$self.find('img').attr('src'));
            $badgeText.html($self.data('note'));
        }).click(function(){
            var $self=$(this);
            $self.toggleClass('c-badge-active');
            if($self.is("#weekly_star")){
                if(gList.type==2){
                    gList.type=1;
                    gList.typeChanged=true;
                    $con.hide();
                }
                $self.addClass("c-badge-active").siblings().removeClass('c-badge-active');
            } else{
                if(gList.type==1){
                    gList.type=2;
                    gList.typeChanged=true;
                    $con.hide();
                }
                if($('.c-badge-active:not("#weekly_star")').length==0){
                    $("#weekly_star").addClass('c-badge-active');
                    gList.type=1;
                    gList.typeChanged=true;
                    $con.hide();
                } else{
                    $("#weekly_star").removeClass('c-badge-active');
                }
            }
            gList.ajaxAuthorList();
        });
    },
    someVisionEvent:function(){ //some event which will ont be changed by ajax
        gList.ajaxAuthorList();  //ajax author list
        $(".g-icon-refresh").click(gList.ajaxAuthorList);
        $(".gl-artist-imglist").on("click","li",function(){
            $(this).toggleClass('on');
            if(gList.type==1){
                gList.ajaxGalleryWeeklyStarList();
            } else{
                gList.ajaxGalleryStarList();
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
        if(gList.type==1){
            gList.ajaxGalleryWeeklyStarList();
        } else{
            gList.ajaxGalleryStarList();
        }
    },
    ajaxGalleryWeeklyStarList:function(page){ // ajax for the competition's list after selector
        gList.pageIndex=page&&(gList.pageIndex+1)||1;
        var o={
            artist:[],
            page_num:gList.pageIndex,
            page_size:gList.pageSize,
            type:1
        };
        var $artists=$(".gl-artist-imglist li.on");
        $artists.length||($artists=$(".gl-artist-imglist li"));
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
                    gList.renderGalleryWeeklyStarList(data);
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
        var list=data.galleries;console.log(data);
        var listhtml='';
        var $con=$('#c-competition-list');
        if(gList.pageIndex==1||gList.typeChanged){
            $con.html("").show();
            $(".w-worklist").hide();
            gList.typeChanged=false;
        }
        for(var i=0;i<list.length;i++){
            listhtml+='<li class="c-list-wrap" data-id="'+list[i].gallery_id+'">'+
                        '<a class="ga-list-imga" href="'+list[i].gallery_detail_url+'" target="_blank">'+
                            '<img src="'+list[i].gallery_img+'">'+
                        '</a>'+
                        '<div class="ga-list-text">'+
                            '<h2>'+list[i].title+'</h2>'+
                            '<div class="ga-list-subtitle">'+list[i].title+'</div>'+
                            '<div class="ga-list-year">'+new Date(list[i].create_time).getFullYear()+'</div>'+
                            '<div class="ga-list-description">'+list[i].content+'</div>'+
                            '<ul class="c-list-likes">'+
                                '<li>'+
                                    '<a data-interaction="0" href="javascript:void(0);" class="g-icon g-icon-heart '+(list[i].like_flag?"on":"")+'"></a>'+
                                    '<i>'+list[i].like_number+'</i>'+
                                '</li>'+
                                '<li>'+
                                    '<a data-interaction="1" href="javascript:void(0);" class="g-icon g-icon-see '+(list[i].collect_flag?"on":"")+'"></a>'+
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
    ajaxGalleryStarList:function(page){ // ajax for the competition's list after selector
        gList.pageIndex=page&&(gList.pageIndex+1)||1;
        var o={
            artist:[],
            page_num:gList.pageIndex,
            page_size:gList.pageSize+5,
            type:2
        };
        var $artists=$(".gl-artist-imglist li.on");
        $artists.length||($artists=$(".gl-artist-imglist li"));
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
                    gList.renderGalleryStarList(data);
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
        var list=data.galleries;
        var listhtml='';
        var $con=$('.w-works');
        if(gList.pageIndex==1||gList.typeChanged){
            $con.html("").parent().show();
            $('#c-competition-list').hide();
            gList.typeChanged=false;
        }
        for(var i=0;i<list.length;i++){
            listhtml+='<li>'+
                        '<a class="w-work-imga" href="'+list[i].gallery_detail_url+'"><img src="'+list[i].gallery_img+'" alt=""></a>'+
                        '<a href="'+list[i].gallery_detail_url+'" class="w-work-title">'+list[i].title+'</a>'+
                        '<a href="'+list[i].author_link_url+'" class="w-work-author"><img src="'+list[i].author_img+'" alt=""></a>'+
                    '</li>';
        }
        $('.loadmore').remove();
        $con.append(listhtml);
        if(gList.pageIndex*(gList.pageSize+5)<data.total_num){
            $con.append('<li class="loadmore"><span>LOAD MORE</span></li>');
        }
        gList.badgesSwipe(); //competition list badges swiper
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
            var author_id=$self.parents('.c-list-wrap').find("button").data("id");
            if(interaction_type!='0'&&interaction_type!='1') return;
            var o={
                "current_user":current_user,
                "interaction_type":interaction_type,
                "service_type":0,
                "service_id":service_id,
                "author_id":author_id
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
    gList.init(); //start js
});
