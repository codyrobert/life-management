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
		$parser = new Mni\FrontYAML\Parser();
		$document = $parser->parse(file_get_contents($filepath), false);
	
		$yaml = $document->getYAML();
		$content = $document->getContent();
		
		return [
			'status' => 'success',
			//'attributes' => $yaml,
			'content' => $content,
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
		$parser = new Mni\FrontYAML\Parser();
		$document = $parser->parse(file_get_contents($filepath));
	
		$yaml = $document->getYAML();
		$content = $document->getContent();
		
		return [
			'status' => 'success',
			'parsed_content' => $content,
		];
	}
	
	return [
		'status' => 'failed',
	];
}


function save_page($file, $content, $attributes)
{
	$attributes = array_merge([
		'layout' => 'master',
	], (array)$attributes);
	
	$yaml = Symfony\Component\Yaml\Yaml::Dump($attributes, 2);
	
	file_put_contents(ROOT.'/_pages/'.$file.'.md', /*'---'.PHP_EOL.$yaml.'---'.PHP_EOL.PHP_EOL.*/$content);
	
	$parser = new Mni\FrontYAML\Parser();
	$document = $parser->parse($content);
	
	return [
		'status' => 'success',
		'parsed_content' => $document->getContent(),
	];
}