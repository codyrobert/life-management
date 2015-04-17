<?php
function get_page_structure()
{
	$ignore_files = [
		'/.',
		'/..',
	];
	
	foreach (new RecursiveIteratorIterator(new RecursiveDirectoryIterator(ROOT.'/content/markdown')) as $filename)
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
			$files[] = substr($filename, strlen(ROOT.'/content/markdown/'), -3);
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
	
	$filepath = ROOT.'/content/markdown/'.$file.'.md';
	
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
	
	$filepath = ROOT.'/content/markdown/'.$file.'.md';
	
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
	
	improved_file_put_contents(ROOT.'/content/markdown/'.$file.'.md', $content);
	
	$converter = new ParsedownExtra();
	
	return [
		'status' => 'success',
		'content' => $converter->text($content),
	];
}


function improved_file_put_contents($dir, $contents)
{
    $parts = explode('/', $dir);
    $file = array_pop($parts);
    $dir = '';
    foreach($parts as $part)
        if(!is_dir($dir .= "/$part")) mkdir($dir);
    file_put_contents("$dir/$file", $contents);
}


function upload_media($file)
{
	if (!file_exists(ROOT.'/content'))
	{
		mkdir(ROOT.'/content');
	}
	
	if (!file_exists(ROOT.'/content/uploads'))
	{
		mkdir(ROOT.'/content/uploads');
	}
	
	$tempFile = $file['tmp_name'];
    $targetFile =  substr(md5(time()), -8).'_'.$file['name'];
 
    move_uploaded_file($tempFile, ROOT.'/content/uploads/'.$targetFile);
    
    return [
	    'status' => 'success',
	    'file' => '/content/uploads/'.$targetFile,
    ];
}