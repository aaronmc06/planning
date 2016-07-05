/*============================================================
	Property of:		MISOM TECHNOLOGIES
	Developer:			AARON MCCOLOUGH FT. JORGE MURILLO
	Application Name:	FARA_FRESNILLO
	Directory:			FARA_FRESNILLO/LOCATION/JS
	File Name:			load_dropdowns.js
=============================================================*/

var inputLocationList = [];
var StatusNameList = [];
var StatusGUIDList = [];

LoadLists();

$(document).ready(function() {
	$(".lang-common.configuration").html(languagePack.common.configuration);
	$(".lang-locationStatus.title").html(languagePack.locationStatus.title);
	$(".lang-common.saveChanges").html(languagePack.common.saveChanges);
	$(".lang-common.uploadChanges").html(languagePack.common.updateChanges);
});

function LoadLists() {
	inputLocationList = [];
	
	var dataObject = {};
	
	LoadStatusDropDown();	
}

function LoadStatusDropDown() {
	StatusGUIDList = [];
	StatusNameList = [];
	
	var jqxhrstatus = $.getJSON(ruIP + ruPort + planningDB + planningEN + "read/geo/LocationStatus?where=\"IsActive = '1'\"", function() {
		
		var statusData = $.parseJSON(jqxhrstatus.responseText);
		
		StatusNameList.push("None");
		StatusGUIDList.push(null);
		
		for(var key in statusData) {
			var dataObject = {};
			
			dataObject.id    = statusData[key].LocationStatus_GUID;
			dataObject.title = statusData[key].DisplayName;
			StatusNameList.push(dataObject.title);
			StatusGUIDList.push(dataObject.id);
		}
		
		LoadLocationGrid(ruIP + ruPort + planningDB + planningEN + "read/dbo/v_LocationCurrentStatus?where=\"AreaIsActive = '1' AND ZoneIsActive = '1' AND LocationIsActive = '1' ORDER BY LocationDisplayName ASC\"");
	});
}