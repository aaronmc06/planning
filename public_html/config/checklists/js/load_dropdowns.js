/*============================================================
	Property of:		MISOM TECHNOLOGIES
	Developer:			JORGE MURILLO & AARON MCCOLOUGH
	Application Name:	FARA_FRESNILLO
	Directory:			FARA_FRESNILLO/CONFIG/CHECKLISTS/JS
	File Name:			load_dropdowns.js
=============================================================*/

var inputTypeList = [];
var groupNameList = [];
var groupGUIDList = [];
var machineNameList = [];
var machineGUIDList = [];
var methodNameList	= [];
var methodGUIDList	= [];

LoadLists();

$(document).ready(function() {
	$(".lang-common.configuration").html(languagePack.common.configuration);
	$(".lang-checklists.checklistTypes").html(languagePack.checklists.checklistTypes);
	$(".lang-checklists.checklistQuestions").html(languagePack.checklists.checklistQuestions);
	$(".lang-common.saveChanges").html(languagePack.common.saveChanges);
	$(".lang-common.uploadChanges").html(languagePack.common.updateChanges);
});

function LoadLists() {
	inputTypeList = [];
	
	inputTypeList.push(" ");
	inputTypeList.push("Radio");
	inputTypeList.push("Textbox");
	inputTypeList.push("Number");
	inputTypeList.push("Checkbox");
	inputTypeList.push("Textarea");
	
	LoadGroupDropDown();
}

function LoadGroupDropDown() {
	groupNameList = [];
	groupGUIDList = [];
	
	var jqxhrgroups = $.getJSON(ruIP + ruPort + planningDB + planningEN + "read/cfg/ChecklistGroup?where=\"IsActive = '1' ORDER BY DisplayName ASC\"", function() {
		
		var groupsData = $.parseJSON(jqxhrgroups.responseText);
		
		for(var key in groupsData) {
			var dataObject = {};
			
			dataObject.id    = groupsData[key].ChecklistGroup_GUID;
			dataObject.title = groupsData[key].ChecklistGroupName;
			groupNameList.push(dataObject.title);
			groupGUIDList.push(dataObject.id);
		}
		
		LoadMachineTypeDropDown();
	});
}

function LoadMachineTypeDropDown() {
	machineGUIDList = [];
	machineNameList = [];
	
	var jqxhrmachine = $.getJSON(ruIP + ruPort + planningDB + planningEN + "read/eqmt/MachineType?where=\"IsActive = '1' ORDER BY DisplayName ASC\"", function() {
		
		var machinesData = $.parseJSON(jqxhrmachine.responseText);
		
		for(var key in machinesData) {
			var dataObject = {};
			
			dataObject.id    = machinesData[key].MachineType_GUID;
			dataObject.title = machinesData[key].DisplayName;
			machineNameList.push(dataObject.title);
			machineGUIDList.push(dataObject.id);
		}
		
		LoadMethodDropDown();
	});
}

function LoadMethodDropDown() {
	methodNameList = [];
	methodGUIDList = [];
	
	$.getJSON(ruIP + ruPort + planningDB + planningEN + "read/cfg/Method?where=\"IsActive = '1' ORDER BY DisplayName ASC\"", function( methodsData ) {
		
		for(var key in methodsData) {
			var dataObject = {};
			
			dataObject.id    = methodsData[key].Method_GUID;
			dataObject.title = methodsData[key].DisplayName;
			methodNameList.push(dataObject.title);
			methodGUIDList.push(dataObject.id);
		}
		
		LoadTypesGrid(ruIP + ruPort + planningDB + planningEN + "read/cfg/ChecklistType?where=\"IsActive = '1' AND IsConfigurable = '1' ORDER BY UsageType ASC\"");
	});
}









