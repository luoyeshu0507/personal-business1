var tTeam={
    init:function(){
        this.richtextSwiper();
        this.badgesSwiper();
        this.followSomeone();
        this.getCommentList(1);
        this.comment();
        this.ajaxPositionList();
    },
    richtextSwiper:function(){
        $('.t-switcher li').click(function(){
            $(this).addClass('on').siblings().removeClass('on');
            $('.t-richtext-wrap .t-richtext-item').eq($(this).index()).addClass('show').siblings().removeClass('show');
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
                        $('.d-comment-pagenation').html(tTeam.getPagenation(data.total_page,n));
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
                tTeam.getCommentList(i);
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
                            tTeam.getCommentList(1);
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
    ajaxPositionList:function(){
        if(!current_user) return;
        var o={
            team_id:team_id,
            current_user:current_user
        }
        $.ajax({
            url: "http://139.196.195.4/team/position/list",
            type:'POST',
            dataType:"JSONP",
            jsonp:"callbackparam",
            data: o,
            success: function(data){
                if(data.result=='success'){
                    tTeam.renderPositionList(data.positions);
                } else{
                    console.log('position list error');
                }
            },
            error:function(e){
                console.log('position list error');
            }
        });
    },
    renderPositionList:function(list){
        var $container=$('.t-position');
        var html='';
        var isIn=false;
        var one=null;
        for(var i=0;i<list.length;i++){
            one=list[i];
            if(one.winner){
                if(one.position_status=='apply'){
                    html+='<dd data-id="'+one.id+'" class="wait on"><span></span>';
                } else if(one.position_status=='not_apply'){
                    html+='<dd data-id="'+one.id+'"><a href="javascript:void(0);"><img src="'+one.winner+'"></a>';
                } else if(one.position_status=='got'){
                    html+='<dd data-id="'+one.id+'"><a href="javascript:void(0);"><img src="'+one.winner+'"></a><strong>X</strong>';
                }
            } else{
                if(one.position_status=='apply'){
                    html+='<dd data-id="'+one.id+'" class="wait on"><span></span>';
                } else if(one.position_status=='not_apply'){
                    html+='<dd data-id="'+one.id+'" class="wait"><span></span>';
                }
            }
            html+='<i>'+one.job_name+'</i>'+
                    '<ul class="t-requirement"><li>'+
                        one.job_requirement.join('</li><li>')+
                    '</li></ul>'+
                '</dd>';
        }
        $container.append(html)
        .on('click','.wait',function(){
            var $self=$(this);
            if(apply_cost>0&&!$self.hasClass('on')){
                tTeam.alert(400,180,'提示','<div class="t-alert-text">加入成功将扣除'+apply_cost+'点金币，确认加入么？</div>',function(){
                    tTeam.dealPosition($self);
                });
            } else {
                tTeam.dealPosition($self);
            }
        })
        .on('click','dd strong',function(){
            var $self=$(this);
            if(apply_cost!=0){
                tTeam.alert(400,180,'提示','<div class="t-alert-text">退出将不退回已扣除的'+Math.abs(apply_cost)+'点金币，确认退出么？</div>',function(){
                    tTeam.cancelPosition($self);
                });
            } else {
                tTeam.dealPosition($self);
            }
        });
    },
    dealPosition:function(pos){
        var $self=pos;
        if(apply_cost>0&&!$self.hasClass('on')) apply_cost=-apply_cost;
        var o={
            position_id:$self.data('id'),
            current_user:current_user
        }
        $.ajax({
            url: "http://139.196.195.4/team/position/deal",
            type:'POST',
            dataType:"JSONP",
            jsonp:"callbackparam",
            data: o,
            success: function(data){
                if(data.result=='success'){
                    if(data.msg=='add'){
                        $self.addClass('on');
                    } else if(data.msg=='delete'){
                        $self.removeClass('on');
                    }
                } else{
                    console.log('apply position error');
                }
            },
            error:function(e){
                console.log('apply position error');
            }
        });
    },
    cancelPosition:function(pos){
        var $self=pos.parents('dd');
        var o={
            position_id:$self.data('id'),
            current_user:current_user
        }
        $.ajax({
            url: "http://139.196.195.4/team/position/deal",
            type:'POST',
            dataType:"JSONP",
            jsonp:"callbackparam",
            data: o,
            success: function(data){
                if(data.result=='success'){
                    location.href=location.href;
                } else{
                    console.log('cancel position error');
                }
            },
            error:function(e){
                console.log('cancel position error');
            }
        });
    },
    alert:function(width,height,title,content,callback){//alert something
        $('.g-opacity-bg').remove();
        var $body=$('body');
        $body.append('<div class="g-opacity-bg"></div>');
        var alertHtml='<div class="g-alert-content" style="margin:-'+height/2+'px auto auto -'+width/2+'px;width:'+width+'px;height:'+height+'px;"><div class="g-alert-title">'+title+'<span class="g-alert-close">X</span></div><div class="g-alert-body" style="height:'+(height-30)+'px;">';
        var alertContent=content;
        if((typeof callback)=='function'){
            alertContent+='<div class="g-alert-btns"><em>取消</em><i>确定</i></div>';
        }
        alertHtml+=alertContent+'</div></div>';
        $body.append(alertHtml);
        if((typeof callback)=='function'){
            var $btns=$('.g-alert-btns');
            $btns.find('em').click(tTeam.closeAlert);
            $btns.find('i').click(function(){
                tTeam.closeAlert();
                callback();
            });
        }
        $('.g-opacity-bg,.g-alert-close').click(tTeam.closeAlert);
    },
    closeAlert:function(){
        $('.g-opacity-bg,.g-alert-content').remove();
    }
};


$(function(){
    tTeam.init(); //start page js
});

