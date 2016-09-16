/**
 * @file
 * A Backbone view for the edit_ui region element.
 */

(function (Drupal, Backbone, drupalSettings) {
  "use strict";

  /**
   * Backbone view for the edit_ui region.
   */
  Drupal.editUi.region.RegionVisualView = Backbone.View.extend({
    /**
     * Custom data.
     */
    activeClass: 'is-edit-ui-region-active',
    selectClass: 'is-edit-ui-region-selected',

    /**
     * {@inheritdoc}
     */
    initialize: function (options) {
      // Add listeners.
      this.listenTo(this.model, 'change:isActive', this.toggleActive);
      this.listenTo(this.model, 'change:isSelected', this.toggleSelected);
      this.listenTo(this.model, 'init', this.initData);
      this.listenTo(this.model, 'startDrag', this.startDrag);
      this.listenTo(this.model, 'resetDrag', this.resetDrag);
      this.listenTo(this.model, 'drag', this.drag);
      this.listenTo(this.model, 'drop', this.drop);
      this.listenTo(this.model, 'addBlock', this.addBlock);
      this.listenTo(this.model, 'calculateDimensions', this.calculateDimensions);

      // Get DOM elements.
      this.$block = this.$el.children('.js-edit-ui__region-block');

      // Initialize default.
      this.model.setBlock(this.$block);
      this.revertOnSpill = drupalSettings.edit_ui_block.revert_on_spill;
    },

    /**
     * Toggle class depending on model.
     */
    toggleActive: function () {
      this.$el.toggleClass(this.activeClass, this.model.get('isActive'));
    },

    /**
     * Toggle class depending on model.
     */
    toggleSelected: function () {
      this.$el.toggleClass(this.selectClass, this.model.get('isSelected'));
    },

    /**
     * Initiliaze region when dragging.
     *
     * @param Drupal.editUi.block.BlockModel block
     *   The dragged block.
     */
    startDrag: function (block) {
      this.beforeModel = null;
      if (this.model.get('region') === block.get('region')) {
        this.startBeforeModel = this.getBeforeModelByWeigh(block.get('weight'));
      }
      else {
        this.startBeforeModel = null;
      }
    },

    /**
     * Reset region for dragging.
     */
    resetDrag: function () {
      this.beforeModel = null;
    },

    /**
     * Check if block is inside the region.
     *
     * @param Object args
     *   The drag position.
     * @return boolean
     *   Inside or not.
     */
    isInside: function (args) {
      var regionOffset = this.model.get('offset');
      var regionDimensions = this.model.get('dimensions');
      return args.x > regionOffset.left &&
             args.x < regionOffset.left + regionDimensions.width &&
             args.y > regionOffset.top &&
             args.y < regionOffset.top + regionDimensions.height;
    },

    /**
     * Drag event callback.
     *
     * @param Drupal.editUi.block.BlockModel block
     *   The block model of the dragged element.
     * @param Object args
     *   The drag position.
     */
    drag: function (block, args) {
      var beforeModel;
      var region = block.get('region');

      if (!this.isInside(args)) {
        if (this.model.get('isActive')) {
          // Leave the region.
          this.model.deactivate();

          if (!block.isNew() && region && this.revertOnSpill) {
            this.beforeModel = null;
            region = Drupal.editUi.region.collections.regionCollection.getRegion(block.get('startRegion'));
            region.trigger('addBlock', block, block.get('block'));
          }
          else if (block.isNew()) {
            this.beforeModel = null;
            Drupal.editUi.block.models.draggingBlockModel.trigger('update');
          }

          // Recalculate dimensions.
          Drupal.editUi.utils.calculateDimensions();
        }
      }
      else {
        if (!this.model.get('isActive')) {
          // Enter the region.
          this.model.activate();

          // Reset drag for all other regions (but this region).
          Drupal.editUi.region.collections.regionCollection.resetDrag(this.model);
        }

        // Manage block order inside the region.
        beforeModel = this.getBeforeModelByPosition(args.y);

        if (beforeModel === this.beforeModel || beforeModel === block) {
          // No changes => skip.
          return;
        }
        this.beforeModel = beforeModel;

        if (region) {
          // Existing block.
          this.model.trigger('addBlock', block, block.get('block'));
        }
        else {
          // New block.
          if (beforeModel !== block) {
            Drupal.editUi.block.models.draggingBlockModel.trigger('update', beforeModel.get('block'));
          }
          else {
            Drupal.editUi.block.models.draggingBlockModel.trigger('update');
          }
        }

        // Recalculate dimensions.
        Drupal.editUi.utils.calculateDimensions();
      }
    },

    /**
     * Drop event callback.
     *
     * @param Drupal.editUi.block.BlockModel block
     *   The block model of the dropped element.
     */
    drop: function (block) {
      var weight;
      var blocks;
      var region = this.model.get('region');

      if (!block || !this.beforeModel || this.beforeModel === this.startBeforeModel) {
        // In that case we haven't do anything.
        return;
      }

      blocks = Drupal.editUi.block.collections.blockCollection
        .getRegionBlocks(region)
        .filter(function (model) {
          return model.cid !== block.cid;
        });

      // Calculate and update weights.
      if (this.beforeModel instanceof Drupal.editUi.block.BlockModel) {
        weight = this.beforeModel.get('weight') + 1;
        block.drop(this.model.get('region'), weight);

        // We must update all following block weight.
        blocks
          .slice(blocks.indexOf(this.beforeModel) + 1)
          .forEach(function (model) {
            weight++;
            model.setWeight(weight);
          });
      }
      else if (blocks[0]) {
        block.drop(this.model.get('region'), blocks[0].get('weight') - 1);
      }
      else {
        block.drop(this.model.get('region'), 0);
      }

      // Trigger addBlock event.
      this.model.trigger('addBlock', block, block.get('block'));
      this.beforeModel = null;
    },

    /**
     * Add block in the region.
     *
     * @param Drupal.editUi.block.BlockModel addedBlock
     *   The model of the block.
     * @param jQuery $block
     *   The block element.
     */
    addBlock: function (addedBlock, $block) {
      var beforeModel;

      if (!this.beforeModel) {
        beforeModel = this.getBeforeModelByWeigh(addedBlock.get('weight'));
      }
      else {
        beforeModel = this.beforeModel;
      }

      // Insert block.
      addedBlock.set('region', this.model.get('region'));
      beforeModel.get('block').after($block);
    },

    /**
     * Calculate the region dimensions.
     */
    calculateDimensions: function () {
      var offset = this.$el.offset();
      var paddingTop = this.$el.css('paddingTop');
      var paddingLeft = this.$el.css('paddingLeft');

      // Remove px unit.
      paddingTop = Number(paddingTop.substr(0, paddingTop.indexOf('px')));
      paddingLeft = Number(paddingLeft.substr(0, paddingLeft.indexOf('px')));

      // Save dimensions.
      this.model.setOffset({
        top: offset.top + paddingTop,
        left: offset.left + paddingLeft
      });
      this.model.setDimensions({
        width: this.$el.width(),
        height: this.$el.height()
      });
    },

    /**
     * Get the model representing the element that are just before
     * the dragged/dropped element using position as compare value.
     *
     * @param Number value
     *   The top position.
     * @return mixed
     *   The model representing the element.
     */
    getBeforeModelByPosition: function (value) {
      var i;
      var beforeModel;
      var compareValue;
      var prospectiveModels = {};
      var blocks = Drupal.editUi.block.collections.blockCollection.getRegionBlocks(this.model.get('region'));

      // Check for prospective before Model.
      for (i = 0; i < blocks.length; i++) {
        compareValue = blocks[i].get('offset').top + blocks[i].get('dimensions').height / 2;
        if (blocks[i].get('isVisible') && value > compareValue) {
          prospectiveModels[compareValue] = blocks[i];
        }
      }

      // Get the closest one.
      if (Object.keys(prospectiveModels).length) {
        beforeModel = prospectiveModels[Math.max.apply(null, Object.keys(prospectiveModels))];
      }

      // If not found the before model is equal to the region.
      if (!beforeModel) {
        beforeModel = this.model;
      }

      return beforeModel;
    },

    /**
     * Get the model representing the element that is just before
     * the dragged/dropped element using weight as compare value.
     *
     * @param Number value
     *   The block weight.
     * @return mixed
     *   The model representing the element.
     */
    getBeforeModelByWeigh: function (value) {
      var compareValue;
      var beforeModel;
      var blocks;
      var i;

      // Force block sort.
      Drupal.editUi.block.collections.blockCollection.sort();
      blocks = Drupal.editUi.block.collections.blockCollection.getRegionBlocks(this.model.get('region'));
      i = blocks.length - 1;

      // Fetch before Model.
      while (blocks[i] && !beforeModel) {
        compareValue = blocks[i].get('weight');
        if (blocks[i].get('isVisible') && value > compareValue) {
          beforeModel = blocks[i];
        }
        else {
          i--;
        }
      }

      // If not found the before model is equal to the region.
      if (!beforeModel) {
        beforeModel = this.model;
      }

      return beforeModel;
    }
  });

}(Drupal, Backbone, drupalSettings));
