/*============================================================
	Property of:		MISOM TECHNOLOGIES
	Developer:			AARON MCCOLOUGH FT. JORGE MURILLO
	Application Name:	FARA_FRESNILLO
	Directory:			FARA_FRESNILLO/CONFIG/PLAN_CONFIG/LOCATION_STATUSES/JS
	File Name:			load_dropdowns.js
=============================================================*/

var inputStepList		= [];
var ProcessGUIDList		= [];
var ProcessNameList		= [];
var MethodGUIDList		= [];
var MethodNameList		= [];
var ActivityNameList	= [];
var ActivityGUIDList	= [];

LoadLists();

$(document).ready(function() {
	$(".lang-common.configuration").html(languagePack.common.configuration);
	$(".lang-stepLocationStatus.title1").html(languagePack.stepLocationStatus.title1);
	$(".lang-stepLocationStatus.title2").html(languagePack.stepLocationStatus.title2);
	$(".lang-common.saveChanges").html(languagePack.common.saveChanges);
	$(".lang-common.uploadChanges").html(languagePack.common.updateChanges);
});


function LoadLists() {
	inputStepList = [];
	
	var dataObject = {};

	LoadProcessDropDown();	
	LoadStatusesGrid(ruIP + ruPort + planningDB + planningEN + "read/geo/LocationStatus?where=\"IsActive = '1'\"");
}

function LoadProcessDropDown() {
	ProcessGUIDList = [];
	ProcessNameList	= [];
	
	var jqxhrprocess = $.getJSON(ruIP + ruPort + planningDB + planningEN + "read/ref/MineProcess?where=\"IsActive = '1' ORDER BY DisplayName ASC\"", function() {
		
		var processData = $.parseJSON(jqxhrprocess.responseText);
		
		for(var key in processData) {
			var dataObject = {};
			
			dataObject.id    = processData[key].MineProcess_GUID;
			dataObject.title = processData[key].DisplayName;
			ProcessNameList.push(dataObject.title);
			ProcessGUIDList.push(dataObject.id);
		}
		
		LoadMethodDropDown(0);
	});
}

function LoadMethodDropDown(processGuid) {
	MethodGUIDList = [];
	MethodNameList	= [];
	
	var jqxhrmethod = $.getJSON(ruIP + ruPort + planningDB + planningEN + "read/cfg/Method?where=\"IsActive = '1' AND MineProcess_GUID = '"+processGuid+"' ORDER BY DisplayName ASC\"", function() {
		
		var methodData = $.parseJSON(jqxhrmethod.responseText);
		
		for(var key in methodData) {
			var dataObject = {};
			
			dataObject.id    = methodData[key].Method_GUID;
			dataObject.title = methodData[key].DisplayName;
			MethodNameList.push(dataObject.title);
			MethodGUIDList.push(dataObject.id);
		}
		
		LoadActivityDropDown(0);
	});
}

function LoadActivityDropDown(methodGuid) {
	ActivityGUIDList = [];
	ActivityNameList	= [];
	
	var jqxhractivity = $.getJSON(ruIP + ruPort + planningDB + planningEN + "read/cfg/Step?where=\"IsActive = '1' AND Method_GUID = '"+methodGuid+"' ORDER BY DisplayName ASC\"", function() {
		
		var activityData = $.parseJSON(jqxhractivity.responseText);
		
		for(var key in activityData) {
			var dataObject = {};
			
			dataObject.id    = activityData[key].Step_GUID;
			dataObject.title = activityData[key].DisplayName;
			ActivityNameList.push(dataObject.title);
			ActivityGUIDList.push(dataObject.id);
		}
	});
}