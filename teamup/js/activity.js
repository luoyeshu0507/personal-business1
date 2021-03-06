var tActivity={
    init:function(){
        this.richtextSwiper();
        this.badgesSwiper();
        this.followSomeone();
        this.getCommentList(1);
        this.comment();
        this.joinActivity();
        this.gobacktop();
        this.like();
    },
    gobacktop:function(){
        var $gobackbtn=$('<div class="go-top-btn"><i class="g-icon g-icon-gotop"></i></div>');
        $("body").append($gobackbtn);
        $gobackbtn.click(function(){
            $("body,html").animate({'scrollTop':0}, 200);
        });
    },
    richtextSwiper:function(){
        $('.t-switcher li').click(function(){
            $(this).addClass('on').siblings().removeClass('on');
            $('.t-richtext-wrap .t-richtext-item').eq($(this).index()).addClass('show').siblings().removeClass('show');
        });
    },
    joinActivity:function(){
        var $joinbtn=$(".t-join-btn");
        if(!window.current_user) {
            $joinbtn.addClass('d-disabled');
            return;
        }
        $joinbtn.click(function(){
            var $self=$(this);
            var o={
                "team_id": team_id,
                "current_user": current_user
            }
            $.ajax({
                url: "http://139.196.195.4/team/activity/apply",
                type:'POST',
                dataType:"JSONP",
                jsonp:"callbackparam",
                data: o,
                success: function(data){
                    if(data.result=='success'){
                        if(!data.status){
                            $self.removeClass('d-disabled');
                        } else{
                            $self.addClass('d-disabled');
                        }
                        $('.t-num i').eq(0).html(data.left_num);
                        $('.t-num i').eq(1).html(data.total_num);
                        var persent=~~(data.left_num/data.total_num*100)+'%';
                        $('.t-num i').eq(2).html(persent);
                        $('.t-num em').css('width',persent);
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
    badgesSwiper:function(){
        //the artist's badges swiper
        var swiper = new Swiper('.t-detail .swiper-container', {
            nextButton: '.t-detail .swiper-button-next',
            prevButton: '.t-detail .swiper-button-prev',
            paginationClickable: true,
            slidesPerView: 5,
            slidesPerGroup : 5,
            freeMode: true
        });
    },
    followSomeone:function(){ //follow someone or unfollow someone
        $('.t-detail .t-follow').click(function(){
            var $self=$(this);
            var o={
                "service_id": author_id,
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
                "service_type":3,
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
                        $('.d-comment-pagenation').html(tActivity.getPagenation(data.total_page,n));
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
                tActivity.getCommentList(i);
            }
        });
        if(current_user){
            $('.d-comment-text button').click(function(){
                var comment=$(this).parent().find('textarea').val().trim();
                if(!comment) return;
                var o={
                    "current_user":current_user,
                    "content":comment,
                    "service_type":3,
                    "service_id":service_id,
                    "author_id":author_id
                };
                $.ajax({
                    url: "http://139.196.195.4/comment",
                    type:'POST',
                    dataType:"JSONP",
                    jsonp:"callbackparam",
                    data: o,
                    success: function(data){
                        if(data.result=='success'){
                            $('.d-comment-text textarea').val("");
                            tActivity.getCommentList(1);
                        } else{
                            console.log('comment error');
                        }
                    },
                    error:function(e){
                        console.log('comment error');
                    }
                });
            });
        } else{
            $('.d-comment-text button').addClass('d-disabled');
        }
    },
    like:function(){
        $('.t-likes').on('click','.g-icon',function(){
            var $self=$(this);
            var interaction_type=$self.data('interaction');
            if(interaction_type!='0'&&interaction_type!='1') return;
            var o={
                "current_user":current_user,
                "interaction_type":interaction_type,
                "service_type":3,
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
    tActivity.init(); //start page js
});

