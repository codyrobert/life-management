<!DOCTYPE html>
<html>
	
	<head>
	
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	
	<title>Cloud <?php echo $_SERVER['REQUEST_URI']; ?></title>
	<meta name="description" content="Write an awesome description for your new site here. You can edit this line in _config.yml. It will appear in your document head meta (for Google search results) and in your feed.xml site description.
">
	
	<link rel="canonical" href="http://cloud/index.php">
	
	<link rel="stylesheet" href="/media/vendor/mdi/css/materialdesignicons.min.css" />
	<link rel="stylesheet" href="/media/css/master.css">
	
</head>

	
<body onload="app.load();">
	
	<header class="site-header">
	<div class="wrap">
	
		<h1 class="site-title"><a href=""><i class="mdi mdi-cloud"></i> <?php echo $_SERVER['REQUEST_URI']; ?></a></h1>
		
		<nav class="site-nav view-mode">
			<ul>
				<li><a onclick="app.openEditMode();"><i class="mdi mdi-pencil-box-outline"></i></a></li>
			</ul>
		</nav>
		
		<nav class="site-nav edit-mode">
			<ul>
				<li><a onclick="app.closeEditMode();"><i class="mdi mdi-close"></i></a></li>
			</ul>
		</nav>
	
	</div>
</header>


	<div id="content" class="page-content wrap view-mode"></div>
	<textarea id="editor" class="page-content wrap edit-mode"></textarea>
	
	<footer class="site-footer">
	<div class="wrap">
	
	</div>
</footer>

	
	<script src="/media/vendor/jquery/dist/jquery.min.js"></script>
	<script src="/media/js/master.js"></script>
	
</body>
	
</html>