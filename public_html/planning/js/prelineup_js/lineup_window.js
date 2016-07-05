/*============================================================
	Property of:		MISOM TECHNOLOGIES
	Developer:			JORGE MURILLO
	Application Name:	FARA_FRESNILLO
	Directory:			FARA_FRESNILLO/PLANNING/JS/PRELINEUP_JS
	File Name:			lineup_window.js
=============================================================*/

var preLineupMachineLocations = [];
var preLineupLocationStatuses = [];
MachineLocationPreLineupLoad();
LocationStatusPreLineupLoad();

$(document).ready(function() {
	addingLineup = true;
	$('#lineup_window_cancel_btn').on("click", function(){
		CloseLineupWindow();
	});
	
	$(".lineupDate").datetimepicker({ timepicker:false, hours12:false, format:'m/d/Y', mask:true });
	
	$("#plan_lineup_date_field").on("change", function() {
		GetPlanDetailsForLineup(false);
	});
	
	$("#plan_lineup_shift_field").on("change", function() {
		GetPlanDetailsForLineup(false);
	});
});

function OpenLineupWindow(shiftDate, shift) {
	$("#plan_lineup_date_field").val(shiftDate);
	$("#plan_lineup_shift_field").val(shift);
	
	lineupShift     = shift;
	lineupShiftDate = shiftDate;
	
	GetPlanDetailsForLineup(true);
	
	OpenPopupWrapper();
}

function CloseLineupWindow() {
	ClosePopupWrapper();
	$('#lineup_window').css("display", "none");
	$('#lineup_window').css("opacity", 0);	
}

function MachineLocationPreLineupLoad() {
	preLineupMachineLocations = [];
	
	var jqxhrLineupMachineLocations = $.getJSON(ruIP + ruPort + planningDB + planningEN + "read/geo/Location?where=\"IsActive = '1' AND Area_GUID = '"+area_GF+"' ORDER BY DisplayName\"", function() {
		preLineupMachineLocations      = jQuery.parseJSON(jqxhrLineupMachineLocations.responseText);
	});
}
function LocationStatusPreLineupLoad() {
	preLineupLocationStatuses = [];
	
	var jqxhrLineupLocationStatuses = $.getJSON(ruIP + ruPort + planningDB + planningEN + "read/geo/LocationStatus?where=\"IsActive = '1' ORDER BY DisplayName\"", function() {
		preLineupLocationStatuses      = jQuery.parseJSON(jqxhrLineupLocationStatuses.responseText);
	});
}









