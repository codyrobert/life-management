<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);


define('ROOT', dirname(dirname(__DIR__)));
define('API', __DIR__);


require API.'/vendor/autoload.php';
require API.'/functions.php';


switch ($_GET['request'])
{
	case "get_page_structure":
		$response = (array)get_page_structure();
		break;
		
	case "get_page":
		$response = get_page($_GET['page']);
		break;
		
	case "get_parsed_page":
		$response = get_parsed_page($_GET['page']);
		break;
	
	case "save_page":
		$response = save_page($_GET['page'], $_GET['content']);
		break;
}

header('Content-Type: application/json');
echo json_encode(@$response);
exit;