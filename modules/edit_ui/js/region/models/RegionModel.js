/**
 * @file
 * A Backbone Model for the edit_ui region.
 */

(function (Drupal, Backbone) {

  "use strict";

  /**
   * Backbone model for the edit_ui region.
   */
  Drupal.editUi.region.RegionModel = Backbone.Model.extend({
    defaults: {
      region: '',
      block: null,
      isActive: false,
      isSelected: false,
      offset: {
        top: 0,
        left: 0
      },
      dimensions: {
        width: 0,
        height: 0
      }
    },

    /**
     * {@inheritdoc}
     */
    initialize: function (options) {
      this.set({region: options.region + ''});
    },

    /**
     * Set region active state.
     */
    activate: function () {
      this.set({isActive: true});
    },

    /**
     * Set region not active state.
     */
    deactivate: function () {
      this.set({isActive: false});
    },

    /**
     * Set region select state.
     */
    select: function () {
      this.set({isSelected: true});
    },

    /**
     * Set region select state.
     */
    unselect: function () {
      this.set({isSelected: false});
    },

    /**
     * Set region edit_ui block.
     *
     * @param jQuery $block
     *   Edit_ui block.
     */
    setBlock: function ($block) {
      this.set({block: $block});
    },

    /**
     * Set region offset.
     *
     * @param Object offset
     *   Region offset.
     */
    setOffset: function (offset) {
      this.set({offset: offset});
    },

    /**
     * Set region dimensions.
     *
     * @param Object dimensions
     *   Region dimensions.
     */
    setDimensions: function (dimensions) {
      this.set({dimensions: dimensions});
    }
  });

}(Drupal, Backbone));
