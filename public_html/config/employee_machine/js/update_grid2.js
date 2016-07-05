/*============================================================
	Property of:		MISOM TECHNOLOGIES
	Developer:			AARON MCCOLOUGH FT. JORGE MURILLO
	Application Name:	FARA_FRESNILLO
	Directory:			FARA_FRESNILLO/CONFIG/EMPLOYEE_MACHINE/JS
	File Name:			update_grid2.js
=============================================================*/

var createdEmployeeMachineArray = [];
var updatedEmployeeMachineArray = [];

function UpdateEmployeeGrid() {
	
	createdEmployeeMachineArray = [];
	updatedEmployeeMachineArray = [];
	
	$("#jqxgrid").jqxGrid('endrowedit', 0, false);
	var newGridData = ExportGridMeasureData();
	
	if(ValidateStepsRecords(newGridData)) {
		for(var key in newGridData) {
			if(newGridData[key].EmployeeMachShift_GUID == -1) {
				var dataRowObj = {};
				
				dataRowObj.EmployeeMachShift_GUID	= CreateGUID();
				dataRowObj.Employee_GUID			= newGridData[key].Employee_GUID;
				dataRowObj.Machine_GUID				= newGridData[key].Machine_GUID;
				dataRowObj.IsOperator				= newGridData[key].IsOperator;
				dataRowObj.IsHelper					= newGridData[key].IsHelper;
				dataRowObj.IsActive					= 1;
				dataRowObj.Created					= moment().format("YYYY-MM-DDTHH:mm:ss.000z");
				dataRowObj.Modified					= moment().format("YYYY-MM-DDTHH:mm:ss.000z");
				
				createdEmployeeMachineArray.push(dataRowObj);
			}
			if(newGridData[key].RowModified) {
				var dataRowObj	= {};
				var apiKeyObj	= {};
				
				apiKeyObj.EmployeeMachShift_GUID	= newGridData[key].EmployeeMachShift_GUID;
				dataRowObj.APIKEY					= apiKeyObj;
				
				dataRowObj.Employee_GUID			= newGridData[key].Employee_GUID;
				dataRowObj.Machine_GUID				= newGridData[key].Machine_GUID;
				dataRowObj.IsOperator				= newGridData[key].IsOperator;
				dataRowObj.IsHelper					= newGridData[key].IsHelper;
				dataRowObj.Modified					= moment().format("YYYY-MM-DDTHH:mm:ss.000z");
				
				updatedEmployeeMachineArray.push(dataRowObj);
			}
		}
		
		savedStateG1 = $("#jqxgrid").jqxGrid('savestate');	
		InsertIntoEmployeeTable();
	}
}

function InsertIntoEmployeeTable() {
	if(createdEmployeeMachineArray.length > 0) {
		var jsonData = {
			 "fields": createdEmployeeMachineArray
		};
		
		jQuery.ajax ({
			headers: {
				"Content-Type": "application/json"
			},
			url: ruIP + ruPort + planningDB + planningEN + "create/bulk/cfg/Employee_Machine_Shift",
			type: "POST",
			data: JSON.stringify(jsonData),
			success: function(){
				UpdateEmployeeTable(true);
			},
			error: function(){
				DisplayAlert(languagePack.message.error,languagePack.message.recordsNotStored);
			}
		});
	}
	else {
		UpdateEmployeeTable(false);		
	}
}

function UpdateEmployeeTable(created) {
	if(updatedEmployeeMachineArray.length > 0) {
		var jsonData = {
			 "fields": updatedEmployeeMachineArray
		};
		
		jQuery.ajax ({
			headers: {
				"Content-Type": "application/json"
			},
			url: ruIP + ruPort + planningDB + planningEN + "update/bulk/cfg/Employee_Machine_Shift",
			type: "POST",
			data: JSON.stringify(jsonData),
			success: function(){
				DisplayAlert(languagePack.message.success,languagePack.message.recordsUpdated	);
				LoadLists();
			},
			error: function(){
				DisplayAlert(languagePack.message.error,languagePack.message.recordsNotUpdated);
			}
		});
	}
	else {
		if(created) {
			DisplayAlert(languagePack.message.success,languagePack.message.recordsStored);
		}
		LoadLists();
	}
}

function RemoveEmployeeRow(rowObj, rowIndex) {
	if(rowObj.EmployeeMachShift_GUID != -1) {
	
		var jsonData = {
			 "key": { "EmployeeMachShift_GUID": rowObj.EmployeeMachShift_GUID },
			 "fields": { "IsActive": false, "Modified": moment().format("YYYY-MM-DDTHH:mm:ss.000z"), "Obsolete": moment(new Date()).format("YYYY-MM-DDTHH:mm:ss.000z") }
		};
		
		jQuery.ajax ({
			headers: {
				"Content-Type": "application/json"
			},
			url: ruIP + ruPort + planningDB + planningEN + "update/cfg/Employee_Machine_Shift",
			type: "POST",
			data: JSON.stringify(jsonData),
			success: function(){
				DisplayAlert(languagePack.message.success,languagePack.message.recordsDeleted)
				$('#jqxgrid').jqxGrid('deleterow', rowIndex);
			}
		});
	}
	else {
		$('#jqxgrid').jqxGrid('deleterow', rowIndex);
	}
}

function ExportGridMeasureData() {
	var gridRowArray = $("#jqxgrid").jqxGrid('getrows');
	
	var newArray = [];
	
	for(var key in gridRowArray) {
		var newObj = {};

		newObj.EmployeeMachShift_GUID	= gridRowArray[key].EmployeeMachShift_GUID;
		newObj.Employee_GUID			= gridRowArray[key].Employee_GUID;
		newObj.EmployeeName				= gridRowArray[key].EmployeeName;
		newObj.Machine_GUID				= gridRowArray[key].Machine_GUID;
		newObj.IsOperator				= gridRowArray[key].IsOperator;
		newObj.IsHelper					= gridRowArray[key].IsHelper;
		
		if(gridRowArray[key].RowModified) {
			newObj.RowModified = gridRowArray[key].RowModified;
		}
		
		newArray.push(newObj);
	}
	
	return newArray;
}