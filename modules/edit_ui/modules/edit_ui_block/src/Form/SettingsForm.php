<?php

/**
 * @file
 * Contains \Drupal\edit_ui_block\Form\SettingsForm.
 */

namespace Drupal\edit_ui_block\Form;

use Drupal\Core\Form\ConfigFormBase;
use Drupal\Core\Form\FormStateInterface;

/**
 * Configure Edit UI settings for this site.
 */
class SettingsForm extends ConfigFormBase {

  /**
   * {@inheritdoc}
   */
  public function getFormId() {
    return 'edit_ui_block_settings';
  }

  /**
   * {@inheritdoc}
   */
  protected function getEditableConfigNames() {
    return ['edit_ui.block'];
  }

  /**
   * {@inheritdoc}
   */
  public function buildForm(array $form, FormStateInterface $form_state) {
    $form['#attached']['library'][] = 'system/drupal.system';

    $config = $this->config('edit_ui.block');

    $form['blocks'] = array(
      '#type' => 'details',
      '#title' => t('Blocks'),
      '#open' => TRUE,
    );
    $form['blocks']['save_button'] = array(
      '#type' => 'checkbox',
      '#title' => t('Save button'),
      '#default_value' => $config->get('save_button'),
      '#description' => t('Add a save button that allows you to save your work only when you are done with the blocks layout.'),
    );
    $form['blocks']['revert_on_spill'] = array(
      '#type' => 'checkbox',
      '#title' => t('Revert on spill'),
      '#default_value' => $config->get('revert_on_spill'),
      '#description' => t('Revert the dragged element to its original place when dropped outside the region.'),
    );

    return parent::buildForm($form, $form_state);
  }

  /**
   * {@inheritdoc}
   */
  public function submitForm(array &$form, FormStateInterface $form_state) {
    $this->config('edit_ui.block')
      ->set('save_button', $form_state->getValue('save_button'))
      ->set('revert_on_spill', $form_state->getValue('revert_on_spill'))
      ->save();

    parent::submitForm($form, $form_state);
  }

}
