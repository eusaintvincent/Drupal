/**
 * @file
 * Extends the Backbone Model for the edit_ui block.
 */

(function (Drupal, drupalSettings) {

  "use strict";

  /**
   * {@inheritdoc}
   */
  Drupal.editUi.block.BlockModel.prototype.initialize = function (options) {
    Backbone.Model.prototype.initialize.apply(this, arguments);
    this.set('startRegion', this.get('region'));
    this.set('startWeight', this.get('weight'));
  };

  /**
   * {@inheritdoc}
   */
  Drupal.editUi.block.BlockModel.prototype.save = function () {
    Backbone.Model.prototype.save.apply(this, arguments);
    this.set({unsaved: false});
  };

  /**
   * Set block dragging state.
   */
  Drupal.editUi.block.BlockModel.prototype.startDrag = function () {
    this.set({
      isDragging: true,
      startRegion: this.get('region'),
      startWeight: this.get('weight')
    });
  };

  /**
   * Set block not dragging state.
   */
  Drupal.editUi.block.BlockModel.prototype.stopDrag = function () {
    this.set({isDragging: false});
  };

  /**
   * Drop block in a new region.
   *
   * @param String region
   *   The region identifier.
   * @param Number weight
   *   The weight of the block within the region.
   */
  Drupal.editUi.block.BlockModel.prototype.drop = function (region, weight) {
    var status;
    var data;

    if (region === this.get('startRegion') && weight === this.get('startWeight')) {
      // No changes.
      return;
    }

    if (region === '-1') {
      status = 0;
    }
    else {
      status = 1;
    }
    data = {
      region: region,
      weight: weight,
      status: status
    };

    if (!this.isNew() && !drupalSettings.edit_ui_block.save_button) {
      this.save(data, {wait: true});
    }
    else {
      data['unsaved'] = true;
      this.set(data);
    }
  };


  /**
   * Update weight of a block and save it.
   *
   * @param Number weight
   *   The weight of the block within the region.
   */
  Drupal.editUi.block.BlockModel.prototype.setWeight = function (weight) {
    var data = {weight: weight};

    if (weight === this.get('startWeight')) {
      // No changes.
      return;
    }

    if (!this.isNew() && !drupalSettings.edit_ui_block.save_button) {
      this.save(data);
    }
    else {
      data['unsaved'] = true;
      this.set(data);
    }
  };

}(Drupal, drupalSettings));
