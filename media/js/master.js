(function($) {
	
	app = {
		
		pageStructure: [],
		scrollOffset: 0,
		
		getCurrentPage: function()
		{
			return window.location.pathname.substring(1);
		},
		
		load: function()
		{
			$.get("/api", {
				request: "get_parsed_page",
				page: app.getCurrentPage()
			}, app.loadHTML);
			
			$.get("/api", {
				request: "get_page_structure"
			}, app.loadBreadcrumbNav);
			
			$(".breadcrumb-dropdown").hover(function() {
				var margin = -($(".siblings", this).width() / 2);
				$(".siblings", this).css("marginLeft", margin+"px");
			});
		},
		
		loadHTML: function(data)
		{
			if (data && data.status == "success")
			{
				$("#content").html(data.content);
				document.getElementById("app").scrollTop = Math.round(app.scrollOffset * (document.getElementById("app").scrollHeight - window.innerHeight) * 10000) / 10000;
			}
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
		
		loadBreadcrumbNav: function(data)
		{
			if (data && data.status == "success")
			{
				var currentPage = app.getCurrentPage();
				
				for (var i in data.pages)
				{
					if (data.pages[i] == "Index")
					{
						continue;
					}
					
					var parts = data.pages[i].split("/");
					
					for (var j in parts)
					{
						var currentPagePath = currentPage.split("/").slice(0, j+1).join("/");
						var path = data.pages[i].split("/").slice(0, j+1).join("/");
						
						var sharesAncestor = (path.indexOf(currentPagePath.split("/").slice(0, j).join("/")) == 0);
						
						if (sharesAncestor)
						{
							if (!app.pageStructure.hasOwnProperty(j))
							{
								app.pageStructure[j] = {};
							}
							
							app.pageStructure[j][parts[j]] = path;
						}
					}
				}
				
				app.pageStructure = app.pageStructure.slice(0, currentPage.split("/").length+1);
				
				for (var level in app.pageStructure)
				{
					var ele = $("<div>");
					ele.addClass("siblings");
					
					for (var label in app.pageStructure[level])
					{
						var url = "/"+app.pageStructure[level][label];
						var itemEle = $("<a>");
						
						itemEle
							.attr("href", url)
							.text(label);
							
						ele.append(itemEle);
					}
					
					$("#nav-level-"+level).append(ele);
				}
				
				if (app.pageStructure.length > currentPage.split("/").length)
				{
					$(".breadcrumb-seperator, .breadcrumb-dropdown").show();
				}
			}
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
		}
	};
	
})(jQuery);