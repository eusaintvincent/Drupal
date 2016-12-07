<?php

namespace Drupal\slick;

use Drupal\blazy\Dejavu\BlazyDefault;

/**
 * Defines shared plugin default settings for field formatter and Views style.
 *
 * @see FormatterBase::defaultSettings()
 * @see StylePluginBase::defineOptions()
 */
class SlickDefault extends BlazyDefault {

  /**
   * {@inheritdoc}
   */
  public static function baseSettings() {
    return [
      'optionset_thumbnail' => '',
      'override'            => FALSE,
      'overridables'        => [],
      'skin_arrows'         => '',
      'skin_dots'           => '',
      'skin_thumbnail'      => '',
      'thumbnail_caption'   => '',
    ] + parent::baseSettings();
  }

  /**
   * {@inheritdoc}
   *
   * @todo: Use parent::gridSettings().
   */
  public static function imageSettings() {
    return [
      'grid'               => 0,
      'grid_header'        => '',
      'grid_medium'        => 0,
      'grid_small'         => 0,
      'preserve_keys'      => FALSE,
      'thumbnail_effect'   => '',
      'thumbnail_position' => '',
      'visible_items'      => 0,
    ] + self::baseSettings() + parent::imageSettings();
  }

  /**
   * {@inheritdoc}
   */
  public static function extendedSettings() {
    return [
      'thumbnail' => '',
    ] + self::imageSettings() + parent::extendedSettings();
  }

}
