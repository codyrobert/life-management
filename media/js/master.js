(function($) {
	
	app = {
		
		scrollOffset: 0,
		
		getCurrentPage: function()
		{
			var path = window.location.pathname.substring(1);
			
			if (path.length == 0)
			{
				path = "index";
			}
			
			return path;
		},
		
		load: function()
		{
			$.get("/api", {
				request: "get_parsed_page",
				page: app.getCurrentPage()
			}, app.loadHTML);
		},
		
		openEditMode: function()
		{
			app.scrollOffset = Math.round(document.getElementById("app").scrollTop / (document.getElementById("app").scrollHeight - window.innerHeight) * 10000) / 10000;
			
			$("html").addClass("edit-mode");
			
			$.get("/api", {
				request: "get_page",
				page: app.getCurrentPage()
			}, app.loadMarkdown);
		},
		
		closeEditMode: function()
		{
			app.scrollOffset = Math.round(document.getElementById("editor").scrollTop / (document.getElementById("editor").scrollHeight - window.innerHeight) * 10000) / 10000;
			
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
				document.getElementById("editor").scrollTop = Math.round(app.scrollOffset * (document.getElementById("editor").scrollHeight - window.innerHeight) * 10000) / 10000;
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
				$("#content").html(data.content);
				document.getElementById("app").scrollTop = Math.round(app.scrollOffset * (document.getElementById("app").scrollHeight - window.innerHeight) * 10000) / 10000;
			}
		}
	};
	
})(jQuery);