/**
 * @file
 * Custom scripts for theme.
 */
(function ($) {

    $('header nav button').click(function () {
        $(this).toggleClass('on');
        $('header .navbar-nav').toggleClass('actif');
    });

    $('.single-item').slick({
        variableHeight: true,
        speed: 300,
        dots: true,
    });
})(jQuery);
