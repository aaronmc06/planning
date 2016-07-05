/*============================================================
	Property of:		MISOM TECHNOLOGIES
	Developer:			AARON MCCOLOUGH FT. JORGE MURILLO
	Application Name:	FARA_FRESNILLO
	Directory:			FARA_FRESNILLO/CONFIG/PERSON_AREA/JS
	File Name:			load_dropdowns.js
=============================================================*/

var areaNameList = [];
var areaGUIDList = [];

LoadLists();

$(document).ready(function() {
	$(".lang-common.configuration").html(languagePack.common.configuration);
	$(".lang-personArea.title1").html(languagePack.personArea.title1);
	$(".lang-personArea.title2").html(languagePack.personArea.title2);
	$(".lang-common.saveChanges").html(languagePack.common.saveChanges);
	$(".lang-common.uploadChanges").html(languagePack.common.updateChanges);
});

function LoadLists() {
	var dataObject = {};
			
	LoadPersonsGrid(ruIP + ruPort + listsDB + listEN + "read/web/v_Person?where=\"IsActive = '1'\"");
}

function loadAreaList(personGUID){
	areaNameList = [];
	areaGUIDList = [];
	
	var jqxhrsteps = $.getJSON(ruIP + ruPort + planningDB + planningEN + "read/geo/Area?where=\"IsActive = '1'\"", function() {
		var areasData = jQuery.parseJSON(jqxhrsteps.responseText);
		
		for(var key in areasData) {
			var dataObject = {};
			dataObject.id      = areasData[key].Area_GUID;
			dataObject.title   = areasData[key].AreaName;
			areaNameList.push(dataObject.title);
			areaGUIDList.push(dataObject.id);
		}

		LoadAreasGrid(ruIP + ruPort + planningDB + planningEN + "read/dbo/v_PersonArea?where=\"PersonGUID = '" + personGUID +"' AND IsActive = '1'\"");
		
	});
}