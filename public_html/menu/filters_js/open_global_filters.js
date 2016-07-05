/*============================================================
	Property of:		MISOM TECHNOLOGIES
	Developer:			AARON MCCOLOUGH
	Application Name:	FARA_FRESNILLO
	Directory:			FARA_FRESNILLO/MENU/FILTERS_JS
	File Name:			open_global_filters.js
=============================================================*/

$(document).ready(function() {
	$('#filter_icon_container').on('click', function(event){
    	event.preventDefault();
		
		$('#global_filter_container').toggleClass("hidden");
	});
});