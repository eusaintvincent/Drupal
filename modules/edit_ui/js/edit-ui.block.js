/**
 * @file
 * Drupal behavior for the edit_ui blocks.
 */

(function (Drupal, $) {
  "use strict";

  /**
   * Drupal edit_ui block behavior.
   */
  Drupal.behaviors.editUiBlock = {
    attach: function (context, settings) {
      if (!this.isInitialized) {
        this.isInitialized = true;

        // Trigger custom event.
        $(document).trigger('editUiBlockInitBefore');

        // Initialize collection.
        Drupal.editUi.block.collections.blockCollection.fetch();
      }
    }
  };

  /**
   * edit_ui block Backbone objects.
   */
  Drupal.editUi = Drupal.editUi || {};
  Drupal.editUi.block = {
    // A hash of View instances.
    views: {},
    // A hash of Collection instances.
    collections: {},
    // A hash of Model instances.
    models: {
      newBlockModel: null
    },
    // A hash of jQuery elements.
    elements: {}
  };

})(Drupal, jQuery);
