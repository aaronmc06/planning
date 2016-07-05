/*============================================================
	Property of:		MISOM TECHNOLOGIES
	Developer:			AARON MCCOLOUGH FT. JORGE MURILLO
	Application Name:	FARA_FRESNILLO
	Directory:			FARA_FRESNILLO/CONFIG/PLAN_CONFIG/STEP_MEASURE/JS
	File Name:			load_dropdowns.js
=============================================================*/

var inputStepList	= [];
var MeasureGUIDList = [];
var MeasureNameList	= [];

LoadLists();

$(document).ready(function() {
	$(".lang-common.configuration").html(languagePack.common.configuration);
	$(".lang-stepMeasure.title1").html(languagePack.stepMeasure.title1);
	$(".lang-stepMeasure.title2").html(languagePack.stepMeasure.title2);
	$(".lang-common.saveChanges").html(languagePack.common.saveChanges);
	$(".lang-common.uploadChanges").html(languagePack.common.updateChanges);
});

function LoadLists() {
	inputStepList = [];
	
	var dataObject = {};

	LoadMeasureDropDown();	
}

function LoadMeasureDropDown() {
	MeasureGUIDList = [];
	MeasureNameList	= [];
	
	var jqxhrmachines = $.getJSON(ruIP + ruPort + planningDB + planningEN + "read/cfg/Measure?where=\"IsActive = '1' ORDER BY DisplayName ASC\"", function() {
		
		var machinesData = jQuery.parseJSON(jqxhrmachines.responseText);
		
		for(var key in machinesData) {
			var dataObject = {};
			
			dataObject.id    = machinesData[key].Measure_GUID;
			dataObject.title = machinesData[key].DisplayName;
			MeasureNameList.push(dataObject.title);
			MeasureGUIDList.push(dataObject.id);
		}
		
		LoadSteps2Grid(ruIP + ruPort + planningDB + planningEN + "read/dbo/v_MethodStepConfig?where=\"Step_IsActive = '1'Order By MethodDisplayName, StepDisplayName Asc\"");
	});
}