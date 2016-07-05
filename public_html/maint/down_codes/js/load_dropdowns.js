/*============================================================
	Property of:		MISOM TECHNOLOGIES
	Developer:			AARON MCCOLOUGH FT. JORGE MURILLO
	Application Name:	FARA_FRESNILLO
	Directory:			FARA_FRESNILLO/MAINT/LOCATION/JS
	File Name:			load_dropdowns.js
=============================================================*/

var inputLocationList	= [];
var DownCodesNameList	= [];
var DownCodesGUIDList	= [];
var MachineStatusList	= [];

LoadLists();

$(document).ready(function() {
	$(".lang-common.configuration").html(languagePack.common.configuration);
	$(".lang-downCodes.title").html(languagePack.downCodes.title);
	$(".lang-common.saveChanges").html(languagePack.common.saveChanges);
	$(".lang-common.uploadChanges").html(languagePack.common.updateChanges);
});

function LoadLists() {
	inputLocationList = [];
	
	var dataObject = {};
	
	LoadDownCodesDropDown();
}

function LoadDownCodesDropDown() {
	DownCodesGUIDList	= [];
	DownCodesNameList	= [];
	MachineStatusList	= [];
	
	var jqxhrdowncodes = $.getJSON(ruIP + ruPort + planningDB + planningEN + "read/cfg/DownReasonCode?where=\"IsActive = '1'\"", function() {
		
		var downcodeData = $.parseJSON(jqxhrdowncodes.responseText);
		
		for(var key in downcodeData) {
			var dataObject = {};
			
			dataObject.id    = downcodeData[key].DownReasonCode_GUID;
			dataObject.title = downcodeData[key].DisplayName;
			DownCodesNameList.push(dataObject.title);
			DownCodesGUIDList.push(dataObject.id);
		}
		
		MachineStatusList.push(languagePack.common.operating.toUpperCase());
		MachineStatusList.push(languagePack.common.down.toUpperCase());
	
		getDatasetGrid(ruIP + ruPort + planningDB + planningEN + "read/dbo/v_MachineDownEvent?where=\"IsActive = '1' ORDER BY DownFinishTime ASC\"");
	});
}