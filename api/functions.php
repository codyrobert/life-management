<?php
function get_page_structure($dir = null)
{
	if ($dir === null)
	{
		$dir = ROOT.'/_pages';
	}
	
	$ignore_files = [
		'/.',
		'/..',
	];
	
	foreach (new RecursiveIteratorIterator(new RecursiveDirectoryIterator($dir)) as $filename)
	{
		$ignore = false;
		
		foreach ($ignore_files as $ignore_filename)
		{
			if (strpos($filename, $ignore_filename) !== false)
			{
				$ignore = true;
				continue;
			}
		}
		
		if ($ignore === false)
		{
			$files[] = substr($filename, strlen(ROOT.'/_pages/'), -3);
		}
	}
	
	if (count((array)@$files))
	{
		return [
			'status' => 'success',
			'pages' => $files,
		];
	}
	
	return [
		'status' => 'failed',
	];
}


function get_page($file = null)
{
	if (!$file)
	{
		$file = 'Index';
	}
	
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


function get_parsed_page($file = null)
{
	if (!$file)
	{
		$file = 'Index';
	}
	
	$filepath = ROOT.'/_pages/'.$file.'.md';
	
	if (file_exists($filepath))
	{
		$converter = new ParsedownExtra();
		
		return [
			'status' => 'success',
			'content' => $converter->text(file_get_contents($filepath)),
		];
	}
	
	return [
		'status' => 'failed',
	];
}


function save_page($file, $content)
{
	if (!$file)
	{
		$file = 'Index';
	}
	
	improved_file_put_contents(ROOT.'/_pages/'.$file.'.md', $content);
	
	$converter = new ParsedownExtra();
	
	return [
		'status' => 'success',
		'content' => $converter->text($content),
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