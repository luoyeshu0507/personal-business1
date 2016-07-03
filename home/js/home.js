var home={
    init:function(){
        this.bannerSwiper();
    },
    bannerSwiper:function(){ //banner swiper
        var swiper = new Swiper('.h-banner .swiper-container', {
            nextButton: '.h-banner .swiper-button-next',
            prevButton: '.h-banner .swiper-button-prev',
            autoHeight: true,
            loop:true
        });
    }
};


$(function(){
    home.init(); //start page js
});

