/*============================================================
	Property of:		MISOM TECHNOLOGIES
	Developer:			AARON MCCOLOUGH FT. JORGE MURILLO
	Application Name:	FARA_FRESNILLO
	Directory:			FARA_FRESNILLO/CONFIG/EMPLOYEE_MACHINE/JS
	File Name:			load_dropdowns.js
=============================================================*/

var inputMachineList = [];
var EmployeeNameList = [];
var EmployeeGUIDList = [];
var MachineNameList = [];
var MachineGUIDList = [];

LoadLists();

$(document).ready(function() {
	$(".lang-common.configuration").html(languagePack.common.configuration);
	$(".lang-employeeMachine.title").html(languagePack.employeeMachine.title);
	$(".lang-common.saveChanges").html(languagePack.common.saveChanges);
	$(".lang-common.uploadChanges").html(languagePack.common.updateChanges);
});

function LoadLists() {
	inputMachineList = [];
	EmployeeGUIDList = [];
	EmployeeNameList = [];
	MachineGUIDList  = [];
	MachineNameList  = [];
	
	var jqxhremployees = $.getJSON(ruIP + ruPort + planningDB + planningEN + "read/ext/Employee?where=\"IsActive = '1' ORDER BY EmployeeName ASC\"", function() {
		
		var employeesData = $.parseJSON(jqxhremployees.responseText);
		
		for(var key in employeesData) {
			var dataObject = {};
			
			dataObject.id    = employeesData[key].Employee_GUID;
			dataObject.title = employeesData[key].EmployeeName + " " + employeesData[key].LastName;
			EmployeeNameList.push(dataObject.title);
			EmployeeGUIDList.push(dataObject.id);
		}
		
		var jqxhrmachines = $.getJSON(ruIP + ruPort + planningDB + planningEN + "read/eqmt/v_Machine?where=\"1 = '1' ORDER BY DisplayName ASC\"", function() {
	
			var machinesData = $.parseJSON(jqxhrmachines.responseText);
			
			for(var key in machinesData) {
				var dataObject = {};
				
				dataObject.id    = machinesData[key].Machine_GUID;
				dataObject.title = machinesData[key].DisplayName;
				MachineNameList.push(dataObject.title);
				MachineGUIDList.push(dataObject.id);
			}
				
			LoadEmployeeMachGrid(ruIP + ruPort + planningDB + planningEN + "read/dbo/v_EmployeeMachineShift?where=\"IsActive = '1' ORDER BY Created ASC\"");
			
		});		
	});	
}