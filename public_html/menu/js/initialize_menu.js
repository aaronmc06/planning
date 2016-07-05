/*============================================================
	Property of:		MISOM TECHNOLOGIES
	Developer:			AARON MCCOLOUGH
	Application Name:	FARA_FRESNILLO
	Directory:			FARA_FRESNILLO/MENU/JS
	File Name:			initialize_menu.js
=============================================================*/


$(document).ready(function() {
	// BUTTONS
	
	$('.fg-button').hover(
		function(){ $(this).removeClass('ui-state-default').addClass('ui-state-focus'); },
		function(){ $(this).removeClass('ui-state-focus').addClass('ui-state-default'); }
	);
	
	// MENUS    	
	$('#hierarchy').menu({
		content: $('#hierarchy').next().html(),
		crumbDefaultText: ''
	});
	
	$('#hierarchybreadcrumb').menu({
		content: $('#hierarchybreadcrumb').next().html(),
		backLink: false
	});
	var goToPage = GetCookieValue("planningCurrentPage", "string");
	NavigateToPage(goToPage);	
});