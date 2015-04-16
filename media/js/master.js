(function($) {
	
	app = {
		
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
			$("html").addClass("edit-mode");
			
			$.get("/api", {
				request: "get_page",
				page: app.getCurrentPage()
			}, app.loadMarkdown);
		},
		
		closeEditMode: function()
		{
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
				$("#editor").val(data.content).focus();
			}
			else
			{
				$("#editor").val("").focus();
			}
		},
		
		loadHTML: function(data)
		{
			if (data && data.status == "success")
			{
				$("#content").html(data.parsed_content);
			}
		}
	};
	
})(jQuery);