/**
 * @file
 * Custom scripts for theme.
 */
(function ($) {

    $('header nav button').click(function () {
        $(this).toggleClass('on');
        $('header .navbar-nav').toggleClass('actif');
    });


    var global ={
        init: function(){
            this.hpcarousel();
        },
        hpcarousel: function(){
            $('.block--views-block--slide-block-1 .view__content').slick();
        }
    }


    
    $(document).ready(function(){
        global.init();
    })
    
})(jQuery);
