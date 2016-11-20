/**
 * @file
 * Custom scripts for theme.
 */
(function ($) {

    // Hello World.
    Drupal.behaviors.helloWorld = {
        attach: function (context) {
            console.log('Hello World');
        }
    }

    $('header nav button').click(function () {
        $(this).toggleClass('on');
        $('header .navbar-nav').toggleClass('actif');
    });
})(jQuery);
