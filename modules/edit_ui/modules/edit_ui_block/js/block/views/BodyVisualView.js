/**
 * @file
 * A Backbone view for the edit_ui body element.
 */

(function (Drupal, Backbone, $, Modernizr) {
  "use strict";

  /**
   * Backbone view for the edit_ui body.
   */
  Drupal.editUi.block.BodyVisualView = Backbone.View.extend({
    /**
     * Custom data.
     */
    draggingClass: 'is-edit-ui-body-dragging',

    /**
     * Main element.
     */
    el: 'body',

    /**
     * Dom elements events.
     */
    events: {
      "startDrag": "startDrag"
    },

    /**
     * {@inheritdoc}
     */
    initialize: function (options) {
      // Init variables.
      this.$window = $(window);

      // Add listeners.
      this.listenTo(this.collection, 'add', this.blockAdded);
      this.listenTo(this.collection, 'change:isDragging', this.render);
    },

    /**
     * {@inheritdoc}
     */
    remove: function () {
      this.$window.off('.editUiBlockBodyVisualView');
      Backbone.View.prototype.remove.apply(this, arguments);
    },

    /**
     * {@inheritdoc}
     */
    render: function (block) {
      this.$el.toggleClass(this.draggingClass, block.get('isDragging'));
    },

    /**
     * Block added callback (called when block has been added to collection).
     *
     * @param Drupal.editUi.block.BlockModel block
     *   Block model instance.
     */
    blockAdded: function (block) {
      var region = Drupal.editUi.region.collections.regionCollection.getRegion(block.get('region'));

      // Region is empty when a block is created from the toolbar.
      if (!region) {
        return;
      }

      if ($('#' + block.get('html_id')).length === 0) {
        // Wait other blocks initializes and create a placeholder block.
        window.setTimeout(
          $.proxy(this.initBlock, this, block),
          0
        );
      }
      else {
        this.initViews(block, $('#' + block.get('html_id')));
      }
    },

    /**
     * Initializes a block and add it to the region.
     *
     * @param Drupal.editUi.block.BlockModel block
     *   Block model instance.
     * @param jQuery $el
     *   Block DOM jQuery object.
     */
    initBlock: function (block, $el) {
      if (!$el || $el.length === 0) {
        // Create a placeholder block.
        $el = $(Drupal.theme('editUiBlockPlaceholderBlock', block.attributes));
      }

      // Add block into region.
      Drupal.editUi.region.collections.regionCollection
        .getRegion(block.get('region'))
        .trigger('addBlock', block, $el);

      // Other initilalizations.
      Drupal.attachBehaviors($el.get(0));
      this.initViews(block, $el);
    },

    /**
     * Init views for block.
     *
     * @param Drupal.editUi.block.BlockModel block
     *   Block model instance.
     * @param jQuery $block
     *   Block DOM jQuery object.
     */
    initViews: function (block, $block) {
      var blockVisualView;
      var blockTooltipVisualView;
      var $el;

      // Add HTML wrapper.
      $el = $(Drupal.theme('editUiBlockWrapperBlock', block.attributes));
      $block.after($el);
      $el.wrapInner($block);

      // Init the block view.
      blockVisualView = new Drupal.editUi.block.BlockVisualView({
        el: $el,
        model: block
      });
      Drupal.editUi.block.views.blockVisualViews.push(blockVisualView);

      // Init the block's tooltip.
      blockTooltipVisualView = new Drupal.editUi.block.BlockTooltipVisualView({
        el: $el,
        model: block
      });
      Drupal.editUi.block.views.blockTooltipVisualViews.push(blockTooltipVisualView);
    },

    /**
     * Start drag.
     *
     * @param Event event
     *   The event object.
     * @param Drupal.editUi.block.BlockModel block
     *   The block model of the dragged element.
     * @param Object position
     *   The mouse or touch position.
     * @param Object dimensions
     *   Original element dimensions.
     * @param Object offset
     *   Original element offset.
     */
    startDrag: function (event, block, position, dimensions, offset) {
      // Initialize drag for regions.
      Drupal.editUi.region.collections.regionCollection.startDrag(block);

      // Select start region.
      var region = Drupal.editUi.region.collections.regionCollection.getRegion(block.get('region'));
      if (region) {
        region.select();
      }

      // Add listeners.
      if (Modernizr.touchevents) {
        this.$window.on('touchmove.editUiBlockBodyVisualView', $.proxy(this.drag, this, block));
        this.$window.on('touchend.editUiBlockBodyVisualView', $.proxy(this.drop, this, block));
      }
      else {
        this.$window.on('mousemove.editUiBlockBodyVisualView', $.proxy(this.drag, this, block));
        this.$window.on('mouseup.editUiBlockBodyVisualView', $.proxy(this.drop, this, block));
      }
    },

    /**
     * Drag.
     *
     * @param Drupal.editUi.block.BlockModel block
     *   The dropped block.
     * @param Event event
     *   The event object.
     */
    drag: function (block, event) {
      var position;
      event.preventDefault();

      // Dragging block styles.
      position = Drupal.editUi.utils.getPosition(event);
      Drupal.editUi.block.models.draggingBlockModel.setOffset({
        top: position.y,
        left: position.x
      });

      // Propagates drag events to region collection.
      Drupal.editUi.region.collections.regionCollection.drag(block, position.x, position.y);
    },

    /**
     * Drop.
     *
     * @param Drupal.editUi.block.BlockModel block
     *   The dropped block.
     * @param Event event
     *   The event object.
     */
    drop: function (block, event) {
      // Propagates drop events to region collection.
      var position = Drupal.editUi.utils.getPosition(event);
      Drupal.editUi.region.collections.regionCollection.drop(block, position.x, position.y);

      // Remove listeners.
      this.$window.off('.editUiBlockBodyVisualView');

      // Update model state.
      block.stopDrag();

      // Trigger stopDrag event.
      Drupal.editUi.block.models.draggingBlockModel.trigger('stopDrag', block, position);

      // Reset default states.
      Drupal.editUi.utils.reset();
    }
  });

}(Drupal, Backbone, jQuery, Modernizr));
