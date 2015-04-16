<?php
function get_page_structure($dir = null)
{
	if ($dir === null)
	{
		$dir = ROOT.'/_pages';
	}
	
	$ignore_files = [
		ROOT.'/.',
		ROOT.'/..',
		ROOT.'/api/',
		ROOT.'/media/',
	];
	
	foreach (new RecursiveIteratorIterator(new RecursiveDirectoryIterator($dir)) as $filename)
	{
		$ignore = false;
		
		foreach ($ignore_files as $ignore_filename)
		{
			if (strpos($filename, $ignore_filename) === 0)
			{
				$ignore = true;
				continue;
			}
		}
		
		if ($ignore === false)
		{
			$files[] = substr($filename, strlen(ROOT.'/'));
		}
	}
	
	if (count((array)@$files))
	{
		return [
			'status' => 'success',
			'files' => $files,
		];
	}
	
	return [
		'status' => 'failed',
	];
}


function get_page($file)
{
	$filepath = ROOT.'/_pages/'.$file.'.md';
	
	if (file_exists($filepath))
	{
		return [
			'status' => 'success',
			'content' => file_get_contents($filepath),
		];
	}
	
	return [
		'status' => 'failed',
	];
}


function get_parsed_page($file)
{
	$filepath = ROOT.'/_pages/'.$file.'.md';
	
	if (file_exists($filepath))
	{
		$converter = new League\CommonMark\CommonMarkConverter();
		
		return [
			'status' => 'success',
			'parsed_content' => $converter->convertToHtml(file_get_contents($filepath)),
		];
	}
	
	return [
		'status' => 'failed',
	];
}


function save_page($file, $content)
{
	improved_file_put_contents(ROOT.'/_pages/'.$file.'.md', $content);
	
	$converter = new League\CommonMark\CommonMarkConverter();
	
	return [
		'status' => 'success',
		'parsed_content' => $converter->convertToHtml($content),
	];
}


function improved_file_put_contents($dir, $contents){
        $parts = explode('/', $dir);
        $file = array_pop($parts);
        $dir = '';
        foreach($parts as $part)
            if(!is_dir($dir .= "/$part")) mkdir($dir);
        file_put_contents("$dir/$file", $contents);
    }