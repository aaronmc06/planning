/*============================================================
	Property of:		MISOM TECHNOLOGIES
	Developer:			AARON MCCOLOUGH FT. JORGE MURILLO
	Application Name:	FARA_FRESNILLO
	Directory:			FARA_FRESNILLO/CONFIG/PLAN_CONFIG/MEASURES/JS
	File Name:			update_grid.js
=============================================================*/

var createdMeasuresArray = [];
var updatedMeasuresArray = [];

function UpdateMeasuresGrid() {
	createdMeasuresArray = [];
	updatedMeasuresArray = [];
	
	$("#jqxgrid").jqxGrid('endrowedit', 0, false);
	var newGridData = ExportGridMeasureData();
	
	if(ValidateMeasuresRecords(newGridData)) {
		for(var key in newGridData) {
			if(newGridData[key].Measure_GUID == -1) {
				var dataRowObj = {};
	
				dataRowObj.Measure_GUID			= CreateGUID();
				dataRowObj.MeasureType_GUID   	= newGridData[key].MeasureType_GUID;
				dataRowObj.MeasureCategory_GUID = newGridData[key].MeasureCategory_GUID;
				dataRowObj.MeasureName   		= newGridData[key].MeasureName;
				dataRowObj.DisplayName   		= newGridData[key].MeasureName;
				dataRowObj.IsLineupMeasure		= newGridData[key].IsLineupMeasure;
				dataRowObj.IsActive   			= 1;
				dataRowObj.Created     			= moment(new Date()).format("YYYY-MM-DDTHH:mm:ss.000z");
				dataRowObj.Modified    			= moment(new Date()).format("YYYY-MM-DDTHH:mm:ss.000z");
				
				createdMeasuresArray.push(dataRowObj);
			}
			else if(newGridData[key].RowModified) {
				var dataRowObj	= {};
				var apiKeyObj	= {};
				
				apiKeyObj.Measure_GUID	= newGridData[key].Measure_GUID;
				dataRowObj.APIKEY		= apiKeyObj;
				
				dataRowObj.MeasureType_GUID		= newGridData[key].MeasureType_GUID;
				dataRowObj.MeasureCategory_GUID = newGridData[key].MeasureCategory_GUID;
				dataRowObj.MeasureName			= newGridData[key].MeasureName;
				dataRowObj.DisplayName			= newGridData[key].MeasureName;
				dataRowObj.IsLineupMeasure		= newGridData[key].IsLineupMeasure;
				dataRowObj.Modified				= moment(new Date()).format("YYYY-MM-DDTHH:mm:ss.000z");
				
				updatedMeasuresArray.push(dataRowObj);
			}
		}
		
		savedStateG1 = $("#jqxgrid").jqxGrid('savestate');
		
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
			url: ruIP + ruPort + planningDB + planningEN + "create/bulk/cfg/Measure",
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
			url: ruIP + ruPort + planningDB + planningEN + "update/bulk/cfg/Measure",
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
	if(rowObj.Measure_GUID != -1) {
	
		var jsonData = {
			 "key": { "Measure_GUID": rowObj.Measure_GUID },
			 "fields": { "IsActive": false, "Modified": moment(new Date()).format("YYYY-MM-DDTHH:mm:ss.000z") }
		};
		
		jQuery.ajax ({
			headers: {
				"Content-Type": "application/json"
			},
			url: ruIP + ruPort + planningDB + planningEN + "update/cfg/Measure",
			type: "POST",
			data: JSON.stringify(jsonData),
			success: function(){
				DisplayAlert(languagePack.message.success,languagePack.message.recordsDeleted);
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

		newObj.Measure_GUID			= gridRowArray[key].Measure_GUID;
		newObj.MeasureType_GUID		= gridRowArray[key].MeasureType_GUID;
		newObj.MeasureCategory_GUID = gridRowArray[key].MeasureCategory_GUID;
		newObj.MeasureName			= gridRowArray[key].MeasureDisplayName;
		newObj.IsLineupMeasure		= gridRowArray[key].IsLineupMeasure;
		
		if(gridRowArray[key].RowModified) {
			newObj.RowModified = gridRowArray[key].RowModified;
		}
		
		newArray.push(newObj);
	}
	
	return newArray;
}