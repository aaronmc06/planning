/*============================================================
	Property of:		MISOM TECHNOLOGIES
	Developer:			AARON MCCOLOUGH FT. JORGE MURILLO
	Application Name:	FARA_FRESNILLO
	Directory:			FARA_FRESNILLO/CONFIG/PLAN_CONFIG/MACHINE_MEASURE/JS
	File Name:			load_dropdowns.js
=============================================================*/

var inputMachineList = [];
var MeasureNameList = [];
var MeasureGUIDList = [];

LoadLists();

$(document).ready(function() {
	$(".lang-common.configuration").html(languagePack.common.configuration);
	$(".lang-machineMeasures.title1").html(languagePack.machineMeasures.title1);
	$(".lang-machineMeasures.title2").html(languagePack.machineMeasures.title2);
	$(".lang-common.saveChanges").html(languagePack.common.saveChanges);
	$(".lang-common.uploadChanges").html(languagePack.common.updateChanges);
});

function LoadLists() {
	inputMachineList = [];
	
	var dataObject = {};
	
	LoadMachineTypesGrid(ruIP + ruPort + planningDB + planningEN + "read/eqmt/v_MachineType");
}

function LoadMeasures(machinetypeGuid){
	LoadMeasureDropDown(machinetypeGuid);
}

function LoadMeasureDropDown(machinetypeGuid) {
	MeasureGUIDList = [];
	MeasureNameList	= [];
	
	var jqxhrmachines = $.getJSON(ruIP + ruPort + planningDB + planningEN + "read/dbo/v_MeasureConfig?where=\"MeasureCategoryDisplayName IN ('Material', 'Explosivo') AND Measure_IsActive = '1' ORDER BY MeasureDisplayName ASC\"", function() {
		
		var measuresData = $.parseJSON(jqxhrmachines.responseText);
		
		for(var key in measuresData) {
			var dataObject = {};
			
			dataObject.id    = measuresData[key].Measure_GUID;
			dataObject.title = measuresData[key].MeasureDisplayName;
			MeasureNameList.push(dataObject.title);
			MeasureGUIDList.push(dataObject.id);
		}
		LoadMeasuresGrid(ruIP + ruPort + planningDB + planningEN + "read/web/v_MachineType_Measure?where=\"MachineType_GUID = '" + machinetypeGuid + "' AND IsActive = '1'\"");
	});
}