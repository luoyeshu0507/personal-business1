var tList={
    pageIndex:1,
    pageSize:10,
    init:function(){
        this.badgesEvent(); //badges's hover and click events
        this.monthSelector(); //month selector event
        this.someVisionEvent(); //some event which will ont be changed by ajax
        this.badgesSwipe();
        this.followSomeone();
        this.loadmoreEvent();
        this.gobacktop();
    },
    gobacktop:function(){
        var $gobackbtn=$('<div class="go-top-btn"><i class="g-icon g-icon-gotop"></i></div>');
        $("body").append($gobackbtn);
        $gobackbtn.click(function(){
            $("body,html").animate({'scrollTop':0}, 200);
        });
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
    loadmoreEvent:function(){
        $(".c-container").on("click",".loadmore span",function(){
            tList.selector(1);
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
        $('.c-list-badgewrap span,.t-months i,.c-list-years .swiper-slide').click(function(){
            tList.selector();
        });
        this.selector();
    },
    selector:function(page){ // the selector event on the top of the page
        tList.pageIndex=page&&(tList.pageIndex+1)||1;
        var postdata={
            badge:[],
            page_num:tList.pageIndex,
            start_month:1,
            end_month:12,
            page_size:tList.pageSize,
            year:2016,
            location:bound_location
        };
        var i=0,len=0;
        var $activeBadges=$(".c-list-badgewrap .c-badge-active");
        var $month=$('.t-months i.on');
        for(i=0,len=$activeBadges.length;i<len;i++){
            postdata.badge.push($activeBadges.eq(i).data('name'));
        }
        if($month.length>0){
            postdata.start_month=$month.eq(0).index()+1;
            postdata.end_month=$month.last().index()+1;
        }
        postdata.year=parseInt($(".c-year-active").text());
        tList.ajaxTeamupList(postdata);
    },
    ajaxTeamupList:function(o){ // ajax for the competition's list after selector
        $.ajax({
            url: "http://139.196.195.4/team/homepage/list",
            type:'POST',
            dataType:"JSONP",
            jsonp:"callbackparam",
            data: o,
            success: function(data){
                if(data.result=="success"){
                    tList.renderTeamupList(data);
                } else{
                    console.log('get teamup list error');
                }
            },
            error:function(e){
                console.log('get teamup list error');
            }
        });
    },
    renderTeamupList:function(data){ //render the competition list data got by ajax
        var list=data.team;
        var listhtml='';
        var imgshtml='';
        var $con=$('#c-competition-list');
        if(tList.pageIndex==1){
            $con.html("");
        }
        for(var i=0;i<list.length;i++){
            listhtml+='<li data-id="'+list[i].team_id+'" class="c-list-wrap">'+
                        '<div class="c-list-shownpart">'+
                            '<a href="http://139.196.195.4/team/detail/'+list[i].team_id+'" target="_blank" class="c-list-img '+(list[i].open_status ? 'c-list-closed':'')+'">'+
                                '<img src="'+list[i].team_cover+'">'+
                            '</a>'+
                            '<div class="c-list-middle"><div style="width:100%;margin-left:20px;">'+
                                '<h3>'+list[i].title+'</h3>'+
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
                                '<ul class="c-list-right">'+
                                    '<li>'+
                                        '<i>主题：</i>'+
                                        '<em>'+list[i].title+'</em>'+
                                    '</li>'+
                                    '<li>'+
                                        '<i>地点：</i>'+
                                        '<em>'+list[i].address+'</em>'+
                                    '</li>'+
                                    '<li>'+
                                        '<i>具体时间：</i>'+
                                        '<em>'+list[i].start_time.split(' ')[0]+' ~ '+list[i].end_time.split(' ')[0]+'</em>'+
                                    '</li>'+
                                    '<li>'+
                                        '<i>报名时间：</i>'+
                                        '<em>'+list[i].start_time.split(' ')[0]+'</em>'+
                                    '</li>'+
                                '</ul></div>'+
                                '<p class="c-list-detail">'+list[i].content+'</p>'+
                                '<div class="t-user-info">'+
                                    '<a href="'+list[i].author_url+'" class="t-user-img">'+
                                        '<img src="'+list[i].author_img+'">'+
                                    '</a>'+
                                    '<i>'+list[i].author_name+'</i>'+
                                    '<span>'+list[i].author_address+'</span>'+
                                    '<button  data-id="1">FOLLOW</button>'+
                                '</div>'+(function(type,obj){
                                    var h='',j=0;
                                    if(type=='team_up_team'){
                                        h+='<ul class="t-team-member">';
                                        for(j=0;j<obj.job_users.length;j++){
                                            h+='<li><img src="'+obj.job_users[j]+'"></li>';
                                        }
                                        for(j=0;j<obj.total_job_num-obj.job_users.length;j++){
                                            h+='<li><i></i></li>';
                                        }
                                        h+='</ul>'
                                    } else if(type=='team_up_activity'){
                                        h+='<div class="t-join"><i><span>'+obj.left_num+'</span>'+obj.activity_num+'</i><a href="http://139.196.195.4/team/detail/'+list[i].team_id+'">JOIN</a></div>';
                                    }
                                    return h;
                                })(list[i].type,list[i])+
                            '</div>'+
                        '</div>'+
                    '</li>';
        }
        $('.loadmore').remove();
        $con.append(listhtml);
        if(tList.pageIndex*tList.pageSize<data.total_num){
            $con.append('<li class="loadmore"><span>LOAD MORE</span></li>');
        }
        tList.badgesSwipe(); //competition list badges swiper
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
    followSomeone:function(){ //follow someone or unfollow someone
        $('.c-container').on('click','.t-user-info button',function(){
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
    }
};


$(function(){
    tList.init(); //start js
});
