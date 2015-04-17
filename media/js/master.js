(function($) {
	
	jQuery.fn.extend({
		insertAtCaret: function(myValue){
			return this.each(function(i) {
				if (document.selection) {
					//For browsers like Internet Explorer
					this.focus();
					sel = document.selection.createRange();
					sel.text = myValue;
					this.focus();
				}
				else if (this.selectionStart || this.selectionStart == '0') {
					//For browsers like Firefox and Webkit based
					var startPos = this.selectionStart;
					var endPos = this.selectionEnd;
					var scrollTop = this.scrollTop;
					this.value = this.value.substring(0, startPos)+myValue+this.value.substring(endPos,this.value.length);
					this.focus();
					this.selectionStart = startPos + myValue.length;
					this.selectionEnd = startPos + myValue.length;
					this.scrollTop = scrollTop;
				} else {
					this.value += myValue;
					this.focus();
				}
			})
		}
	});
	
	app = {
		
		isMediaBrowserOpen: false,
		
		currentUploadId: 1,
		dropzone: null,
		pageStructure: [],
		scrollOffset: 0,
		
		closeEditMode: function()
		{
			app.scrollOffset = Math.round(document.getElementById("editor").scrollTop / (document.getElementById("editor").scrollHeight - window.innerHeight) * 10000) / 10000;
			
			$("html").removeClass("edit-mode");
			
			$.get("/api", {
				request: "save_page",
				page: app.getCurrentPage(),
				content: $("#editor").val()
			}, app.loadHTML);
			
			app.closeMediaBrowser();
		},
		
		closeMediaBrowser: function()
		{
			$("html").removeClass("media-browser-mode");
			app.isMediaBrowserOpen = false;
		},
		
		getCurrentPage: function()
		{
			return window.location.pathname.substring(1);
		},
		
		injectImageIntoEditor: function(src)
		{
			var title = src.substr(26);
			console.log("!["+title+"]("+src+")");
			$("#editor").insertAtCaret("!["+title+"]("+src+")");
		},
		
		load: function()
		{
			app.setupPage();
			app.setupMediaBrowser();
			app.setupDropzone();
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
		
		openMediaBrowser: function()
		{
			$("html").addClass("media-browser-mode");
			app.isMediaBrowserOpen = true;
		},
		
		setupDropzone: function()
		{
			if (app.dropzone === null)
			{
				app.dropzone = new Dropzone("#upload", {
					
					url: "/api/?request=upload",
					
					addedfile: function(file)
					{
						file.id = app.currentUploadId++;
						
						var tpl = $($("#media-template").html())
							.attr("id", "new-upload-"+file.id)
							.addClass("is-uploading");
						
						$("#media").prepend(tpl);
					},
					
					success: function(file, data)
					{
						var ele = $("#new-upload-"+file.id)
							.removeClass("is-uploading");
						
						if (data && data.status == "success")
						{	
							$(ele).addClass("is-complete");
							$("a", ele).data("file", data.file);
							$("img", ele).attr("src", data.file);
						}
						else
						{
							$(ele).addClass("is-failed");
						}
					},
					
					addRemoveLinks: false,
					createImageThumbnails: false,
					acceptedFiles: "image/*",
					previewTemplate: ""
					
				});
				
				$("#media").on("click", "a", function() {
					
					app.closeMediaBrowser();
					app.injectImageIntoEditor($(this).data("file"));
					
				});
			}
		},
		
		setupMediaBrowser: function()
		{
			app.mediaBrowserEle = $("<div>").attr("id", "mediaBrowser");
		},
		
		setupPage: function()
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
		
		toggleMediaBrowser: function()
		{
			if (app.isMediaBrowserOpen === true)
			{
				app.closeMediaBrowser();
			}
			else
			{
				app.openMediaBrowser();
			}
		},
	};
	
})(jQuery);