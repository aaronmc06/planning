/*============================================================
	Property of:		MISOM TECHNOLOGIES
	Developer:			AARON MCCOLOUGH FT. JORGE MURILLO
	Application Name:	FARA_FRESNILLO
	Directory:			FARA_FRESNILLO/CONFIG/PLAN_CONFIG/METHOD_STEP/JS
	File Name:			update_grid2.js
=============================================================*/

var createdStepsArray = [];
var updatedStepsArray = [];

function UpdateStepGrid() {
	createdStepsArray = [];
	updatedStepsArray = [];
	
	$("#jqxgrid2").jqxGrid('endrowedit', 0, false);
	var newGridData = ExportGridStepData();
		
	for(var key in newGridData) {
		newGridData[key].Ordinal = (parseInt(key) + 1);
		newGridData[key].RowModified = true;
	}
	
	if(ValidateStepsRecords(newGridData)) {
		for(var key in newGridData) {
			if(newGridData[key].Step_GUID == -1) {
				var dataRowObj = {};

				dataRowObj.Step_GUID   = CreateGUID();
				dataRowObj.Method_GUID = newGridData[key].Method_GUID;
				dataRowObj.StepName    = newGridData[key].StepName;
				dataRowObj.DisplayName = newGridData[key].DisplayName;
				dataRowObj.Ordinal     = newGridData[key].Ordinal;
				dataRowObj.IsLineup    = newGridData[key].IsLineup;
				dataRowObj.IsActive    = 1;
				
				createdStepsArray.push(dataRowObj);
			}
			else if(newGridData[key].RowModified) {
				var dataRowObj = {};
				var apiKeyObj = {};
				
				apiKeyObj.Step_GUID = newGridData[key].Step_GUID;
				dataRowObj.APIKEY = apiKeyObj;
				
				dataRowObj.Method_GUID = newGridData[key].Method_GUID;
				dataRowObj.StepName    = newGridData[key].StepName;
				dataRowObj.DisplayName = newGridData[key].DisplayName;
				dataRowObj.Ordinal     = newGridData[key].Ordinal;
				dataRowObj.IsLineup    = newGridData[key].IsLineup;
				
				updatedStepsArray.push(dataRowObj);
			}
		}
		
		savedStateG1 = $("#jqxgrid").jqxGrid('savestate');
		savedStateG2 = $("#jqxgrid2").jqxGrid('savestate');		

		InsertIntoStepTable();
	}
}

function InsertIntoStepTable() {
	if(createdStepsArray.length > 0) {
		var jsonData = {
			 "fields": createdStepsArray
		};
		
		jQuery.ajax ({
			headers: {
				"Content-Type": "application/json"
			},
			url: ruIP + ruPort + planningDB + planningEN + "create/bulk/cfg/Step",
			type: "POST",
			data: JSON.stringify(jsonData),
			success: function(){
				UpdateStepTable(true);
			},
			error: function(){
				DisplayAlert(languagePack.message.error,languagePack.message.recordsNotStored);
			}
		});
	}
	else {
		UpdateStepTable(true);		
	}
}

function UpdateStepTable(created) {
	if(updatedStepsArray.length > 0) {
		var jsonData = {
			 "fields": updatedStepsArray
		};
		
		jQuery.ajax ({
			headers: {
				"Content-Type": "application/json"
			},
			url: ruIP + ruPort + planningDB + planningEN + "update/bulk/cfg/Step",
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
			DisplayAlert(languagePack.message.success, languagePack.message.recordsStored);			
		}
		LoadLists();	
	}
}

function RemoveStepRow(rowObj, rowIndex) {
	if(rowObj.Step_GUID != -1) {
	
		var jsonData = {
			 "key": { "Step_GUID": rowObj.Step_GUID },
			 "fields": { "IsActive": false }
			 //"fields": { "IsActive": false, "Modified": moment(new Date()).format("YYYY-MM-DDTHH:mm:ss.000z") }
		};
		
		jQuery.ajax ({
			headers: {
				"Content-Type": "application/json"
			},
			url: ruIP + ruPort + planningDB + planningEN + "update/cfg/Step",
			type: "POST",
			data: JSON.stringify(jsonData),
			success: function(){
				DisplayAlert(languagePack.message.success,languagePack.message.recordsDeleted);
				var gridrows = $("#jqxgrid2").jqxGrid('getrows');
				
				for(var key in gridrows) {
					if(gridrows[key].StepOrdinal > rowObj.StepOrdinal){
						$("#jqxgrid2").jqxGrid('setcellvalue', gridrows[key].uid, 'StepOrdinal', gridrows[key].StepOrdinal - 1);
						gridrows[key].RowModified = true;
					}
				}
				$('#jqxgrid2').jqxGrid('deleterow', rowIndex);
				$('#jqxgrid2').jqxGrid('sortby','StepOrdinal', 'asc');
				
				UpdateStepGrid();
			}
		});
	}
	else {
    DisplayAlert(languagePack.message.error, "Por favor, guarde los cambios antes de borrar este registro.");
		//$('#jqxgrid2').jqxGrid('deleterow', rowIndex);
	}
}

function ExportGridStepData() {
	var gridRowArray = $("#jqxgrid2").jqxGrid('getrows');
	
	var newArray = [];
	
	for(var key in gridRowArray) {
		var newObj = {};

		newObj.Method_GUID = gridRowArray[key].Method_GUID;
		newObj.Step_GUID   = gridRowArray[key].Step_GUID;
		newObj.StepName    = gridRowArray[key].StepDisplayName;
		newObj.DisplayName = gridRowArray[key].StepDisplayName;
		newObj.Ordinal     = gridRowArray[key].StepOrdinal;
		newObj.IsLineup    = gridRowArray[key].IsLineup;
		
		if(gridRowArray[key].RowModified) {
			newObj.RowModified = gridRowArray[key].RowModified;
		}		
		
		newArray.push(newObj);
	}
	
	return newArray;
}