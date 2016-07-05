/*============================================================
	Property of:		MISOM TECHNOLOGIES
	Developer:			AARON MCCOLOUGH FT. JORGE MURILLO
	Application Name:	FARA_FRESNILLO
	Directory:			FARA_FRESNILLO/CONFIG/PLAN_CONFIG/MEASURES/JS
	File Name:			load_dropdowns.js
=============================================================*/

var MeasureList = [];
var MeasureCategoryGUIDList = [];
var MeasureCategoryNameList = [];
var MeasureTypeGUIDList = [];
var MeasureTypeNameList = [];

LoadLists();

$(document).ready(function() {
	$(".lang-common.configuration").html(languagePack.common.configuration);
	$(".lang-measures.title").html(languagePack.measures.title);
	$(".lang-common.saveChanges").html(languagePack.common.saveChanges);
	$(".lang-common.uploadChanges").html(languagePack.common.updateChanges);
});

function LoadLists() {
	MeasureList			= [];
	MeasureTypeGUIDList = [];
	
	var dataObject = {};
	
	LoadMeasureGroupsDropDown();
}

function LoadMeasureGroupsDropDown() {
	MeasureCategoryNameList = [];
	MeasureCategoryGUIDList = [];
	
	var jqxhrmachines = $.getJSON(ruIP + ruPort + planningDB + planningEN + "read/ref/MeasureCategory?where=\"IsActive = '1' ORDER BY DisplayName ASC\"", function() {
		
		var machinesData = jQuery.parseJSON(jqxhrmachines.responseText);
		
		MeasureCategoryNameList.push(" ");
		MeasureCategoryGUIDList.push(null);
		
		for(var key in machinesData) {
			var dataObject = {};
			
			dataObject.id    = machinesData[key].MeasureCategory_GUID;
			dataObject.title = machinesData[key].DisplayName;
			MeasureCategoryNameList.push(dataObject.title);
			MeasureCategoryGUIDList.push(dataObject.id);
		}
		
		LoadMeasureTypesDropDown();
	});
}

function LoadMeasureTypesDropDown() {
	MeasureTypeGUIDList = [];
	MeasureTypeNameList = [];
	
	var jqxhrmeasures = $.getJSON(ruIP + ruPort + planningDB + planningEN + "read/ref/MeasureType?where=\"IsActive = '1' ORDER BY DisplayName ASC\"", function() {
		
		var measuresData = $.parseJSON(jqxhrmeasures.responseText);
		
		MeasureTypeNameList.push(" ");
		MeasureTypeGUIDList.push(null);
		
		for(var key in measuresData) {
			var dataObject = {};
			
			dataObject.id    = measuresData[key].MeasureType_GUID;
			dataObject.title = measuresData[key].DisplayName;
			MeasureTypeNameList.push(dataObject.title);
			MeasureTypeGUIDList.push(dataObject.id);
		}
		
		LoadMeasuresGrid(ruIP + ruPort + planningDB + planningEN + "read/dbo/v_MeasureTypeConfig?where=\"Measure_IsActive = '1' ORDER BY Created ASC\"");
	});
}