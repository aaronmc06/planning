/*============================================================
	Property of:		MISOM TECHNOLOGIES
	Developer:			AARON MCCOLOUGH FT. JORGE MURILLO
	Application Name:	FARA_FRESNILLO
	Directory:			FARA_FRESNILLO/CONFIG/PLAN_CONFIG/STEP_MEASURE/JS
	File Name:			update_grid2.js
=============================================================*/

var createdMeasuresArray = [];
var updatedMeasuresArray = [];

function UpdateMeasureGrid() {
	createdMeasuresArray = [];
	updatedMeasuresArray = [];
	
	$("#jqxgrid2").jqxGrid('endrowedit', 0, false);
	var newGridData = ExportGridMeasureData();
	
	if(ValidateMeasuresRecords(newGridData)) {
		for(var key in newGridData) {
			if(newGridData[key].Step_Measure_GUID == -1) {
				var dataRowObj = {};
				
				dataRowObj.Step_Measure_GUID	= CreateGUID();
				dataRowObj.Measure_GUID			= newGridData[key].Measure_GUID;
				dataRowObj.Step_GUID			= newGridData[key].Step_GUID;
				dataRowObj.IsActive				= 1;
				dataRowObj.Created				= moment().format("YYYY-MM-DDTHH:mm:ss.000z");
				dataRowObj.Modified				= moment().format("YYYY-MM-DDTHH:mm:ss.000z");
				
				createdMeasuresArray.push(dataRowObj);
			}
			if(newGridData[key].RowModified) {
				var dataRowObj	= {};
				var apiKeyObj	= {};
				
				apiKeyObj.Step_Measure_GUID	= newGridData[key].Step_Measure_GUID;
				dataRowObj.APIKEY			= apiKeyObj;
				
				dataRowObj.Measure_GUID	= newGridData[key].Measure_GUID;
				dataRowObj.Step_GUID	= newGridData[key].Step_GUID;
				dataRowObj.Modified		= moment().format("YYYY-MM-DDTHH:mm:ss.000z");
				
				updatedMeasuresArray.push(dataRowObj);
			}
		}
		
		savedStateG1 = $("#jqxgrid").jqxGrid('savestate');
		savedStateG2 = $("#jqxgrid2").jqxGrid('savestate');
		
		InsertIntoMeasureTable();
	}
}

function InsertIntoMeasureTable() {
	if(createdMeasuresArray.length > 0) {
		var jsonData = {
			 "fields": createdMeasuresArray
		};
		jQuery.ajax ({
			headers: {
				"Content-Type": "application/json"
			},
			url: ruIP + ruPort + planningDB + planningEN + "create/bulk/cfg/StepMeasure",
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
	if(updatedMeasuresArray.length > 0) {
		var jsonData = {
			 "fields": updatedMeasuresArray
		};
		jQuery.ajax ({
			headers: {
				"Content-Type": "application/json"
			},
			url: ruIP + ruPort + planningDB + planningEN + "update/bulk/cfg/StepMeasure",
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
	if(rowObj.Step_Measure_GUID != -1) {
		console.log(rowObj);
		var jsonData = {
			 "key": { "Step_Measure_GUID": rowObj.Step_Measure_GUID },
			 "fields": { "IsActive": false, "Modified": moment().format("YYYY-MM-DDTHH:mm:ss.000z") }
		};
		
		jQuery.ajax ({
			headers: {
				"Content-Type": "application/json"
			},
			url: ruIP + ruPort + planningDB + planningEN + "update/cfg/StepMeasure",
			type: "POST",
			data: JSON.stringify(jsonData),
			success: function(){
				DisplayAlert(languagePack.message.success,languagePack.message.recordsDeleted);
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

		newObj.Step_Measure_GUID	= gridRowArray[key].Step_Measure_GUID;
		newObj.Measure_GUID			= gridRowArray[key].Measure_GUID;
		newObj.Step_GUID 			= gridRowArray[key].Step_GUID;
		
		if(gridRowArray[key].RowModified) {
			newObj.RowModified = gridRowArray[key].RowModified;
		}		
		
		newArray.push(newObj);
	}
	
	return newArray;
}