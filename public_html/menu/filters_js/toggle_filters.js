/*============================================================
	Property of:		MISOM TECHNOLOGIES
	Developer:			AARON MCCOLOUGH
	Application Name:	FARA_FRESNILLO
	Directory:			FARA_FRESNILLO/MENU/FILTERS_JS
	File Name:			toggle_filters.js
=============================================================*/

var area_GF;
var zone_GF;
var language_GF = "";
var filtersHeight = "";	//"328px";//"376px";

var areaFILTER = true;
var zoneFILTER = true;
var filterCount = 2;

function CanToggleFilters() {
	if(!areaFILTER) {
		$("#filter_area").css("display","none");
		filterCount--;
	}
	if(!zoneFILTER) {
		$("#filter_zone").css("display","none");
		filterCount--;
	}
	
	filtersHeight = (136 + (48 * filterCount)).toString() + "px";
	
	$('#filter_icon_container').on('click', function(event){
    	event.preventDefault();
		
		$('#global_filter_container').toggleClass("hidden");
		
		if($('#global_filter_container').hasClass("hidden")) {
			CancelFilters();
		}
		else {			
			$('#global_filter_container').css("display", "block");
			$('#global_filter_container').animate({"height": filtersHeight}, 200);
		}
	});
	
	$(document).click(function(event) {
		if(!$('#global_filter_container').hasClass("hidden")) {
			if(!$(event.target).closest("#global_filter_container").length && !$(event.target).closest("#filter_icon_container").length) {
				CancelFilters();
			}
		}
	});
	
	$('#filters_cancel_btn').on('click', CancelFilters);
	
	$('#update_filters_btn').on('click', function(event){
		var defaultOption = languagePack.common.selectOption;
		
		if($("#area_filter").val() == null || $("#area_filter").val() == 0 || $("#zone_filter").val() == null || $("#zone_filter").val() == 0) {
			DisplayAlert(languagePack.message.error,languagePack.message.filtersSelected);
		}
		else {			
			UpdateCookiesWithFilters();			
			$("#filter_icon_container").click();			
			getURLBeforeLoad("aux");
		}
	});
}

function CancelFilters() {
	$('#global_filter_container').addClass("hidden");
	$('#global_filter_container').css("display", "none");
	$('#global_filter_container').css("height", "0px");	
}

function UpdateCookiesWithFilters() {	
	area_GF    = $("#area_filter").val();
	zone_GF    = $("#zone_filter").val();
	
	document.cookie = "areaFilter=" + $("#area_filter").val() + "; path=/";
	document.cookie = "zoneFilter=" + $("#zone_filter").val() + "; path=/";
}









