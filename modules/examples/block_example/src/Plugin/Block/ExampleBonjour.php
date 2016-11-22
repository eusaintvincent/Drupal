<?php

namespace Drupal\block_example\Plugin\Block;

use Drupal\Core\Block\BlockBase;


/**
 * Provides a 'Example: bonjour block' block.
 *
 * @Block(
 *   id = "example_bonjour",
 *   admin_label = @Translation("Example: bonjour block")
 * )
 */
class ExampleBonjour extends BlockBase {

  /**
   * {@inheritdoc}
   */
  public function build() {
    // We return an empty array on purpose. The block will thus not be rendered
    // on the site. See BlockExampleTest::testBlockExampleBasic().
    $user = \Drupal::currentUser()->getRoles();
        

    return array(
        '#type' => 'markup',
        '#markup' => 'coucou' 
    );
  }

}
