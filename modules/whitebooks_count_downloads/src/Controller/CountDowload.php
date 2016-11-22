<?php

namespace Drupal\whitebooks_count_downloads\src\Controller;

use Drupal\Core\Controller\ControllerBase as Controller;
use Drupal\Core\lib\Drupal as Request;

class CountDownload extends Controller
{
	Request::getContainer->get('
		UPDATE node_revision__field_download_count
		SET field_download_count_value = field_download_count_value+1
	')
}