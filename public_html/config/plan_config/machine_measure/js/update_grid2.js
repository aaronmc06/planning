/*============================================================
	Property of:		MISOM TECHNOLOGIES
	Developer:			AARON MCCOLOUGH FT. JORGE MURILLO
	Application Name:	FARA_FRESNILLO
	Directory:			FARA_FRESNILLO/CONFIG/PLAN_CONFIG/MACHINE_MEASURE/JS
	File Name:			update_grid2.js
=============================================================*/

var createdMachineMeasuresArray = [];
var updatedMachineMeasuresArray = [];

function UpdateMeasureGrid() {
	createdMachineMeasuresArray = [];
	updatedMachineMeasuresArray = [];
	
	$("#jqxgrid2").jqxGrid('endrowedit', 0, false);
	var newGridData = ExportGridMeasureData();
	
	if(ValidateStepsRecords(newGridData)) {
		for(var key in newGridData) {
			if(newGridData[key].MachineTypeMeasure_GUID == -1) {
				var dataRowObj = {};
				
				dataRowObj.MachineTypeMeasure_GUID	= CreateGUID();
				dataRowObj.MachineType_GUID			= newGridData[key].MachineType_GUID;
				dataRowObj.Measure_GUID				= newGridData[key].Measure_GUID;
				dataRowObj.IsActive = 1;
				
				createdMachineMeasuresArray.push(dataRowObj);
			}
			if(newGridData[key].RowModified) {
				var dataRowObj	= {};
				var apiKeyObj	= {};
				
				apiKeyObj.MachineTypeMeasure_GUID	= newGridData[key].MachineTypeMeasure_GUID;
				dataRowObj.APIKEY					= apiKeyObj;
				
				dataRowObj.MachineType_GUID	= newGridData[key].MachineType_GUID;
				dataRowObj.Measure_GUID		= newGridData[key].Measure_GUID;
				
				updatedMachineMeasuresArray.push(dataRowObj);
			}
		}
		
		savedStateG1 = $("#jqxgrid").jqxGrid('savestate');		
		savedStateG2 = $("#jqxgrid2").jqxGrid('savestate');
		
		InsertIntoMeasureTable();
	}
}

function InsertIntoMeasureTable() {
	if(createdMachineMeasuresArray.length > 0) {
		var jsonData = {
			 "fields": createdMachineMeasuresArray
		};
		
		jQuery.ajax ({
			headers: {
				"Content-Type": "application/json"
			},
			url: ruIP + ruPort + planningDB + planningEN + "create/bulk/cfg/MachineType_Measure",
			type: "POST",
			data: JSON.stringify(jsonData),
			success: function(){
				UpdateMeasureTable(true);
			},
			error: function(){
				DisplayAlert(languagePack.message.error,languagePack.message.recordsNotStored);
			}
		});
	}
	else {
		UpdateMeasureTable(false);		
	}
}

function UpdateMeasureTable(created) {
	if(updatedMachineMeasuresArray.length > 0) {
		var jsonData = {
			 "fields": updatedMachineMeasuresArray
		};
		
		jQuery.ajax ({
			headers: {
				"Content-Type": "application/json"
			},
			url: ruIP + ruPort + planningDB + planningEN + "update/bulk/cfg/MachineType_Measure",
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

function RemoveMeasureRow(rowObj, rowIndex) {
	if(rowObj.MachineTypeMeasure_GUID != -1) {
	
		var jsonData = {
			 "key": { "MachineTypeMeasure_GUID": rowObj.MachineTypeMeasure_GUID },
			 "fields": { "IsActive": false, "Modified": moment().format("YYYY-MM-DDTHH:mm:ss.000z") }
		};
		
		jQuery.ajax ({
			headers: {
				"Content-Type": "application/json"
			},
			url: ruIP + ruPort + planningDB + planningEN + "update/cfg/MachineType_Measure",
			type: "POST",
			data: JSON.stringify(jsonData),
			success: function(){
				DisplayAlert(languagePack.message.success,languagePack.message.recordsDeleted)
				$('#jqxgrid2').jqxGrid('deleterow', rowIndex);
			}
		});
	}
	else {
		$('#jqxgrid2').jqxGrid('deleterow', rowIndex);
	}
}

function ExportGridMeasureData() {
	var gridRowArray = $("#jqxgrid2").jqxGrid('getrows');
	
	var newArray = [];
	
	for(var key in gridRowArray) {
		var newObj = {};

		newObj.MachineTypeMeasure_GUID	= gridRowArray[key].MachineTypeMeasure_GUID;
		newObj.MachineType_GUID			= gridRowArray[key].MachineType_GUID;
		newObj.Measure_GUID				= gridRowArray[key].Measure_GUID;
		
		if(gridRowArray[key].RowModified) {
			newObj.RowModified = gridRowArray[key].RowModified;
		}
		
		newArray.push(newObj);
	}
	
	return newArray;
}