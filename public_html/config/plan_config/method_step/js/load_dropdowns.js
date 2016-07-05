/*============================================================
	Property of:		MISOM TECHNOLOGIES
	Developer:			AARON MCCOLOUGH FT. JORGE MURILLO
	Application Name:	FARA_FRESNILLO
	Directory:			FARA_FRESNILLO/CONFIG/PLAN_CONFIG/METHOD_STEP/JS
	File Name:			load_dropdowns.js
=============================================================*/

var stepNameList	= [];
var stepGUIDList	= [];
var processGUIDList = [];
var processNameList = [];

LoadLists();

$(document).ready(function() {
	$(".lang-common.configuration").html(languagePack.common.configuration);
	$(".lang-methodStep.title1").html(languagePack.methodStep.title1);
	$(".lang-methodStep.title2").html(languagePack.methodStep.title2);
	$(".lang-common.saveChanges").html(languagePack.common.saveChanges);
	$(".lang-common.uploadChanges").html(languagePack.common.updateChanges);
});

function LoadLists() {
	processGUIDList	= [];
	processNameList = [];

	$.getJSON(ruIP + ruPort + planningDB + planningEN + "read/ref/MineProcess?where=\"IsActive = '1' ORDER BY DisplayName ASC\"", function( processData ) {
		
		for(var key in processData) {
			var dataObject = {};
			dataObject.id = processData[key].MineProcess_GUID;
			dataObject.title = processData[key].DisplayName;
			processNameList.push(dataObject.title);
			processGUIDList.push(dataObject.id);
		}
			
		LoadMethodsGrid(ruIP + ruPort + planningDB + planningEN + "read/dbo/v_ProcessMethodConfig");
		
	});
}

function loadOrdinalList(methodGUID){
	stepNameList = [];
	stepGUIDList = [];
	
	var jqxhrsteps = $.getJSON(ruIP + ruPort + planningDB + planningEN + "read/dbo/v_MethodStepConfig?where=\"Method_GUID = '"+methodGUID+"'\"", function() {
		var stepsData = jQuery.parseJSON(jqxhrsteps.responseText);
		
		for(var key in stepsData) {
			var dataObject = {};
			dataObject.id      = stepsData[key].Step_GUID;
			dataObject.title   = stepsData[key].StepOrdinal.toString();
			stepNameList.push(dataObject.title);
			stepGUIDList.push(dataObject.id);
		}

		LoadStepsGrid(ruIP + ruPort + planningDB + planningEN + "read/dbo/v_MethodStepConfig?where=\"Method_GUID = '" + methodGuid + "' AND Step_IsActive = '1' ORDER BY StepOrdinal ASC\"");
		
	});
	

}