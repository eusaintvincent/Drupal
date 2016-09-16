/**
 * @file
 * Drupal behavior for the edit_ui_contextual blocks.
 */

(function (Drupal, $) {
  "use strict";

  /**
   * edit_ui_contextual block Backbone objects.
   */
  Drupal.editUi.block.views.contextualVisualView = [];

  /**
   * Add edit_ui_contextual custom behavior on edit_ui blocks.
   *
   * @param {Drupal.editUi.block.BlockModel} block
   *   The edit_ui block model.
   *
   * @listens event:add
   */
  Drupal.editUi.block.collections.blockCollection.on('add', function (block) {
    var $block = $('#' + block.get('html_id'));
    if ($block.length > 0) {
      Drupal.editUi.block.views.contextualVisualView = new Drupal.editUi.block.ContextualVisualView({
        model: block,
        el: $block
      });
    }
  });

})(Drupal, jQuery);
