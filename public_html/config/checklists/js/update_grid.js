/*============================================================
	Property of:		MISOM TECHNOLOGIES
	Developer:			JORGE MURILLO & AARON MCCOLOUGH
	Application Name:	FARA_FRESNILLO
	Directory:			FARA_FRESNILLO/CONFIG/CHECKLISTS/JS
	File Name:			update_grid2.js
=============================================================*/

var createdTypesArray = [];
var updatedTypesArray = [];

function UpdateTypeGrid() {
	createdTypesArray = [];
	updatedTypesArray = [];
	
	$("#jqxgrid").jqxGrid('endrowedit', 0, false);
	var newGridData = ExportGridTypesData();
	
	if(ValidateTypesRecords(newGridData)) {
		for(var key in newGridData) {
			if(newGridData[key].ChecklistType_GUID == -1) {
				var dataRowObj = {};
				
				dataRowObj.ChecklistType_GUID	= CreateGUID();
				dataRowObj.ChecklistType_Name	= newGridData[key].ChecklistType_Name;
				dataRowObj.Method_GUID			= newGridData[key].Method_GUID;
				dataRowObj.DisplayName			= newGridData[key].DisplayName;
				dataRowObj.UsageType			= newGridData[key].UsageType;
				dataRowObj.IsActive				= 1;
				dataRowObj.Created				= moment().format("YYYY-MM-DDTHH:mm:ss.000z");
				dataRowObj.Modified				= moment().format("YYYY-MM-DDTHH:mm:ss.000z");

				createdTypesArray.push(dataRowObj);
			}
			if(newGridData[key].RowModified) {
				var dataRowObj	= {};
				var apiKeyObj	= {};
				
				apiKeyObj.ChecklistType_GUID	= newGridData[key].ChecklistType_GUID;
				dataRowObj.APIKEY				= apiKeyObj;
				
				dataRowObj.ChecklistType_Name	= newGridData[key].ChecklistType_Name;
				dataRowObj.DisplayName			= newGridData[key].DisplayName;
				dataRowObj.UsageType			= newGridData[key].UsageType;
				dataRowObj.Modified				= moment().format("YYYY-MM-DDTHH:mm:ss.000z");
				
				updatedTypesArray.push(dataRowObj);
			}
		}
		
		savedStateG1 = $("#jqxgrid").jqxGrid('savestate');
		savedStateG2 = $("#jqxgrid").jqxGrid('savestate');
		
		InsertIntoTypeTable();
	}
}

function InsertIntoTypeTable() {
	if(createdTypesArray.length > 0) {
		var jsonData = {
			 "fields": createdTypesArray
		};
		$.ajax ({
			headers: {
				"Content-Type": "application/json"
			},
			url: ruIP + ruPort + planningDB + planningEN + "create/bulk/cfg/ChecklistType",
			type: "POST",
			data: JSON.stringify(jsonData),
			success: function(){
				UpdateTypeTable(true);
			},
			error: function(){
				DisplayAlert(languagePack.message.error,languagePack.message.recordsNotStored);
			}
		});
	}
	else {
		UpdateTypeTable(false);		
	}
}

function UpdateTypeTable(created) {
	if(updatedTypesArray.length > 0) {
		var jsonData = {
			 "fields": updatedTypesArray
		};

		$.ajax ({
			headers: {
				"Content-Type": "application/json"
			},
			url: ruIP + ruPort + planningDB + planningEN + "update/bulk/cfg/ChecklistType",
			type: "POST",
			data: JSON.stringify(jsonData),
			success: function(){
				DisplayAlert(languagePack.message.success,languagePack.message.recordsUpdated);
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

function RemoveTypeRow(rowObj, rowIndex) {
	if(rowObj.ChecklistType_GUID != -1) {
	
		var jsonData = {
			 "key": { "ChecklistType_GUID": rowObj.ChecklistType_GUID },
			 "fields": { "IsActive": false, "Modified": moment().format("YYYY-MM-DDTHH:mm:ss.000z") }
		};
		
		jQuery.ajax ({
			headers: {
				"Content-Type": "application/json"
			},
			url: ruIP + ruPort + planningDB + planningEN + "update/cfg/ChecklistType",
			type: "POST",
			data: JSON.stringify(jsonData),
			success: function(){
				DisplayAlert(languagePack.message.success,languagePack.message.recordDeleted);
				$('#jqxgrid').jqxGrid('deleterow', rowIndex);
			}
		});
	}
	else {
		$('#jqxgrid').jqxGrid('deleterow', rowIndex);
	}
}

function ExportGridTypesData() {
	var gridRowArray = $("#jqxgrid").jqxGrid('getrows');
	
	var newArray = [];
	
	for(var key in gridRowArray) {
		var newObj = {};
		
		newObj.ChecklistType_GUID	= gridRowArray[key].ChecklistType_GUID;
		newObj.ChecklistType_Name	= gridRowArray[key].DisplayName;
		newObj.Method_GUID			= gridRowArray[key].Method_GUID;
		newObj.DisplayName			= gridRowArray[key].DisplayName;
		newObj.UsageType			= gridRowArray[key].UsageType;
		
		if(gridRowArray[key].RowModified) {
			newObj.RowModified = gridRowArray[key].RowModified;
		}		
		
		newArray.push(newObj);
	}
	
	return newArray;
}