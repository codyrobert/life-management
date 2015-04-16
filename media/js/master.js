(function($) {
	
	app = {
		
		openEditMode: function()
		{
			$("html").addClass("edit-mode");
		},
		
		closeEditMode: function()
		{
			$("html").removeClass("edit-mode");
		}
	};
	
})(jQuery);