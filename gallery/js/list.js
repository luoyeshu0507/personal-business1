var gList={
    init:function(){
        this.badgesEvent(); //badges's hover and click events
        this.authorSelector(); //author selector event
        this.someVisionEvent(); //some event which will ont be changed by ajax
        this.like(); //like,collect,share..
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
        return;
        //selector
        $('.c-list-badgewrap span,.c-list-month li,.c-list-years .swiper-slide').click(this.selector);
        this.selector();
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
                    console.log(data);
                    // gList.renderCompetitionList(data);
                } else{
                    console.log('ajaxAuthorList error');
                }
            },
            error:function(e){
                console.log('ajaxAuthorList error');
            }
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
        gList.ajaxCompeitionList(postdata);
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
                    gList.renderCompetitionList(data);
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
