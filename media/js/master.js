(function($) {
	
	app = {
		
		scrollOffset: 0,
		
		load: function()
		{
			$.get("/api", {
				request: "get_parsed_page",
				page: app.getCurrentPage()
			}, function(data) {
				if (data && data.status == "success")
				{
					$("#content").html(data.parsed_content);
				}
			});
		},
		
		getCurrentPage: function()
		{
			var path = window.location.pathname.substring(1);
			
			if (path.length == 0)
			{
				path = "index";
			}
			
			return path;
		},
		
		openEditMode: function()
		{
			app.scrollOffset = document.getElementById("app").scrollTop / (document.getElementById("app").scrollHeight - window.innerHeight);
			
			$("html").addClass("edit-mode");
			
			$.get("/api", {
				request: "get_page",
				page: app.getCurrentPage()
			}, app.loadMarkdown);
		},
		
		closeEditMode: function()
		{
			app.scrollOffset = document.getElementById("editor").scrollTop / (document.getElementById("editor").scrollHeight - document.getElementById("editor").offsetHeight);
			
			$("html").removeClass("edit-mode");
			
			$.get("/api", {
				request: "save_page",
				page: app.getCurrentPage(),
				content: $("#editor").val()
			}, app.loadHTML);
		},
		
		loadMarkdown: function(data)
		{
			if (data && data.status == "success")
			{
				$("#editor").val(data.content);
				document.getElementById("editor").scrollTop = app.scrollOffset * document.getElementById("editor").scrollHeight;
			}
			else
			{
				$("#editor").val("");
			}
		},
		
		loadHTML: function(data)
		{
			if (data && data.status == "success")
			{
				$("#content").html(data.parsed_content);
				document.getElementById("app").scrollTop = app.scrollOffset * document.getElementById("app").scrollHeight;
			}
		}
	};
	
})(jQuery);