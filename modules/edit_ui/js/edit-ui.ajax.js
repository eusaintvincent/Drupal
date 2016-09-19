/**
 * @file
 * Add AJAX commands.
 */

(function (Drupal, $) {
  "use strict";

  /**
   * Command to add new status messages.
   */
  Drupal.AjaxCommands.prototype.editUiAddMessage = function (ajax, response, status) {
    var $content = $(response.content);
    var $messageBlockContainer = $('.js-edit-ui__block__system_messages_block').eq(0);

    // Hide and insert.
    $content.hide().appendTo($messageBlockContainer);

    // Show and hide old messages.
    $content.fadeIn(response.speed, function () {
      $messageBlockContainer.children().not(this).fadeOut(response.speed);
    });
  };

  /**
   * edit_ui ajax functions.
   */
  Drupal.editUi = Drupal.editUi || {};
  Drupal.editUi.ajax = {

    /**
     * call native Drupal AjaxCommands.
     */
    callAjaxCommands: function (model, response, options) {
      var commands = new Drupal.AjaxCommands();

      for (var i in response) {
        if (response.hasOwnProperty(i) && response[i].command && commands[response[i].command]) {
          commands[response[i].command]({getEffect: Drupal.ajax.prototype.getEffect}, response[i]);
        }
      }
    }

  };

})(Drupal, jQuery);
