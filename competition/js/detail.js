var cDetail={
    init:function(){
        this.bannerSwiper(); //banner swiper
        this.drawCircleProcesser();
        this.scoreMarkerEvent();
        this.badgesSwiper();
        this.markeScore();
        this.followSomeone();
        this.getCommentList(1);
        this.comment();
    },
    bannerSwiper:function(){ //banner swiper
        var galleryTop = new Swiper('.gallery-top', {
            nextButton: '.gallery-top .swiper-button-next',
            prevButton: '.gallery-top .swiper-button-prev',
            autoHeight: true
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
    },
    drawCircleProcesser:function(){ //Circle Processer
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
    },
    scoreMarkerEvent:function(){ //score marker drag event
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
    },
    badgesSwiper:function(){
        //the artist's badges swiper
        var swiper = new Swiper('.d-about-artist .swiper-container', {
            nextButton: '.d-about-artist .swiper-button-next',
            prevButton: '.d-about-artist .swiper-button-prev',
            paginationClickable: true,
            slidesPerView: 5,
            slidesPerGroup : 5,
            freeMode: true
        });
    },
    markeScore:function(){  //submit your score
        $('.d-mark-subbtn').click(function(){
            var $self=$(this);
            if($self.hasClass("d-disabled")) return;
            var $scores=$('.d-mark-scoretips span');
            var o={
                "content_score": $scores.eq(0).html()/10, 
                "form_score": $scores.eq(1).html()/10, 
                "technique_score": $scores.eq(2).html()/10, 
                // "current_user": 123,
                // "artwork_id":3
            };
            $.ajax({
                url: "http://139.196.195.4/competition/vote",
                type:'POST',
                dataType:"JSONP",
                jsonp:"callbackparam",
                data: o,
                success: function(data){
                    if(data.result=="success"){
                        $(".d-circle").eq(0).circleProgress({ value: data.content_score/10 });
                        $(".d-circle").eq(1).circleProgress({ value: data.form_score/10 });
                        $(".d-circle").eq(2).circleProgress({ value: data.technique_score/10 });
                        $(".d-circle").eq(3).circleProgress({ value: data.total_score/10 });
                        $(".d-circle").eq(4).html('<span>'+data.total_rated+'</span>');
                        $self.addClass("d-disabled");
                    } else{
                        console.log('vote error');
                    }
                },
                error:function(e){
                    console.log('vote error');
                }
            });
        });

    },
    followSomeone:function(){ //follow someone or unfollow someone
        $('.d-about-artist button').click(function(){
            var $self=$(this);
            var o={
                "service_id": service_id,
                "current_user": $self.data('id')
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
    getPagenation:function(count, pageindex) {
        var count = count;
        var pageindex = pageindex;
        var a = [];
        //总页数少于10 全部显示,大于10 显示前3 后3 中间3 其余....
        if (pageindex == 1) {
            a[a.length] = "<span class='prev unclick'>prev</span>";
        } else {
            a[a.length] = "<span data-page='"+(pageindex-1)+"' class='prev'>prev</span>";
        }
        function setPageList() {
            if (pageindex == i) {
              a[a.length] = "<span data-page='"+i+"' class='on'>" + i + "</span>";
            } else {
              a[a.length] = "<span data-page='"+i+"'>" + i + "</span>";
            }
        }
        //总页数小于10
        if (count <= 10) {
            for (var i = 1; i <= count; i++) {
              setPageList();
            }
        }
        //总页数大于10页
        else {
            if (pageindex <= 4) {
                for (var i = 1; i <= 5; i++) {
                    setPageList();
                }
                a[a.length] = "...<span data-page='"+count+"'>" + count + "</span>";
            } else if (pageindex >= count - 3) {
                a[a.length] = "<span data-page='1'>1</span>...";
                for (var i = count - 4; i <= count; i++) {
                    setPageList();
                }
            } else { //当前页在中间部分
                a[a.length] = "<span data-page='1'>1</span>...";
                for (var i = pageindex - 2; i <= pageindex + 2; i++) {
                    setPageList();
                }
                a[a.length] = "...<span data-page='"+count+"'>" + count + "</span>";
            }
        }
        if (pageindex == count) {
            a[a.length] = "<span class='next unclick'>next</span>";
        } else {
            a[a.length] = "<span class='next' data-page='"+(pageindex+1)+"'>next</span>";
        }
        return a.join("");
    },
    getCommentList:function(n){
        var o={
                "page_num":n,
                "service_type":'2',
                "service_id":service_id,
                "page_size":5
            };
        $.ajax({
            url: "http://139.196.195.4/comment/page",
            type:'POST',
            dataType:"JSONP",
            jsonp:"callbackparam",
            data: o,
            success: function(data){
                if(data.result=='success'){
                    var html='';
                    var list=data.comments;
                    for(var i=0;i<list.length;i++){
                        html+='<dd>'+
                                '<a class="d-comment-img" href="javascript:void(0);"><img src="'+list[i].user_photo+'"></a>'+
                                '<p class="d-comment-text">'+
                                    '<span class="d-comment-name"><a href="javascript:void(0);">'+list[i].user+'</a> - '+list[i].create_time+'</span>'+
                                    '<i>'+list[i].content+'</i>'+
                                '</p></dd>';
                    }
                    $('.d-comment dl').find('dd:gt(0)').remove().end().append(html);
                    if(data.total_page>1){
                        $('.d-comment-pagenation').html(cDetail.getPagenation(data.total_page,n));
                    }
                } else{
                    console.log('get comments list error');
                }
            },
            error:function(e){
                console.log('get comments list error');
            }
        });
    },
    comment:function(){
        $('.d-comment-pagenation').on('click','span',function(){ //comments pagenation event
            var i=$(this).data('page');
            if(i){
                cDetail.getCommentList(i);
            }
        });
        if(current_user){
            $('.d-comment-text button').click(function(){
                console.log(1);
            });
        } else{
            $('.d-comment-text button').addClass('d-disabled');
        }
    }
};


$(function(){
    cDetail.init(); //start page js
});

