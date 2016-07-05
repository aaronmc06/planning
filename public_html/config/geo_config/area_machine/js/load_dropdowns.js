/*============================================================
	Property of:		MISOM TECHNOLOGIES
	Developer:			AARON MCCOLOUGH FT. JORGE MURILLO
	Application Name:	FARA_FRESNILLO
	Directory:			FARA_FRESNILLO/CONFIG/GEO_CONFIG/AREA_MACHINE/JS
	File Name:			load_dropdowns.js
=============================================================*/

var machineTypeList     = [];
var machineTypeGuidList = [];
var machineList         = [];
var machineGuidList     = [];

LoadLists();

$(document).ready(function() {
	$(".lang-common.configuration").html(languagePack.common.configuration);
	$(".lang-areaMachine.title1").html(languagePack.areaMachine.title1);
	$(".lang-areaMachine.title2").html(languagePack.areaMachine.title2);
	$(".lang-common.saveChanges").html(languagePack.common.saveChanges);
	$(".lang-common.uploadChanges").html(languagePack.common.updateChanges);
});

function LoadLists() {
	
	machineTypeList     = [];
	machineTypeGuidList = [];
		
	var jqxhrmachinetypes = $.getJSON(ruIP + ruPort + planningDB + planningEN + "read/eqmt/v_MachineType?where=\"1 = 1 ORDER BY DisplayName Asc\"", function() {
		
		var machineTypesData = jQuery.parseJSON(jqxhrmachinetypes.responseText);
		
		for(var key in machineTypesData) {
			var dataObject = {};
			dataObject.id    = machineTypesData[key].MachineType_GUID;
			dataObject.title = machineTypesData[key].DisplayName;
			machineTypeList.push(dataObject.title);
			machineTypeGuidList.push(dataObject.id);
		}
		LoadMachinesDropDown(0);
		LoadAreasGrid(ruIP + ruPort + planningDB + planningEN + "read/geo/Area?where=\"IsActive = '1' ORDER BY DisplayName Asc\"");
	});
}

function LoadMachinesDropDown(machineTypeGuid) {
	machineList         = [];
	machineGuidList     = [];
	
	var jqxhrmachines = $.getJSON(ruIP + ruPort + planningDB + planningEN + "read/eqmt/v_Machine?where=\"MachineType_GUID = '" + machineTypeGuid + "' ORDER BY DisplayName Asc\"", function() {
		
		var machinesData = jQuery.parseJSON(jqxhrmachines.responseText);
		
		for(var key in machinesData) {
			var dataObject = {};
			dataObject.id    = machinesData[key].Machine_GUID;
			dataObject.title = machinesData[key].DisplayName;
			machineList.push(dataObject.title);
			machineGuidList.push(dataObject.id);
		}
	});
}