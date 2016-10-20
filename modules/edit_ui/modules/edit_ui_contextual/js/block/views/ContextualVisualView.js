/**
 * @file
 * A Backbone view for the edit_ui block element.
 */

(function (Drupal, Backbone, $, Modernizr) {
  "use strict";

  var strings = {
    confirmDelete: Drupal.t('Are you sure you want to delete the block "@name"?')
  };

  /**
   * Backbone view for the edit_ui block.
   */
  Drupal.editUi.block.ContextualVisualView = Backbone.View.extend({
    /**
     * Dom elements events.
     */
    events: {
      "click .edit-ui-contextualblock-delete": "deleteBlock"
    },

    /**
     * {@inheritdoc}
     */
    initialize: function (options) {
      // Add listeners.
      this.listenTo(this.model, 'destroy', this.remove);
    },

    /**
     * Delete block.
     *
     * @param Event event
     *   Event object.
     */
    deleteBlock: function (event) {
      event.preventDefault();
      var message = Drupal.formatString(strings.confirmDelete, {'@name': this.model.get('label')});

      if (confirm(message)) {
        this.model.destroy({success: Drupal.editUi.ajax.callAjaxCommands});
      }
    }
  });

}(Drupal, Backbone, jQuery, Modernizr));
