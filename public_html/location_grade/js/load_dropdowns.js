/*============================================================
	Property of:		MISOM TECHNOLOGIES
	Developer:			AARON MCCOLOUGH FT. JORGE MURILLO
	Application Name:	FARA_FRESNILLO
	Directory:			FARA_FRESNILLO/LOCATION_GRADE/JS
	File Name:			load_dropdown.js
=============================================================*/

var LocationNameList = [];
var LocationGUIDList = [];

LoadLists();

$(document).ready(function() {
	$(".lang-common.configuration").html(languagePack.common.configuration);
	$(".lang-locationGrade.title").html(languagePack.locationGrade.title);
	$(".lang-common.saveChanges").html(languagePack.common.saveChanges);
	$(".lang-common.uploadChanges").html(languagePack.common.updateChanges);
});

function LoadLists() {
	LocationNameList = [];
	LocationGUIDList = [];
	
	var jqxhrlocations = $.getJSON(ruIP + ruPort + planningDB + planningEN + "read/dbo/v_AreaZoneLocation?where=\"ObraDisplayName = 'F' OR ObraDisplayName = 'RB' AND IsActive = '1' ORDER BY LocationDisplayName ASC\"", function() {
		
		var locationsData = $.parseJSON(jqxhrlocations.responseText);
		
		for(var key in locationsData) {
			var dataObject = {};
			
			dataObject.id    = locationsData[key].Location_GUID;
			dataObject.title = locationsData[key].LocationDisplayName;
			LocationNameList.push(dataObject.title);
			LocationGUIDList.push(dataObject.id);
		}
		
		LoadLocationGradeGrid(ruIP + ruPort + planningDB + planningEN + "read/dbo/v_LocationGrade?where=\"IsActive = '1' ORDER BY Created ASC\"");
	});
	
}