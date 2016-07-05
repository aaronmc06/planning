/*============================================================
	Property of:		MISOM TECHNOLOGIES
	Developer:			AARON MCCOLOUGH FT. JORGE MURILLO
	Application Name:	FARA_FRESNILLO
	Directory:			FARA_FRESNILLO/CONFIG/PLAN_CONFIG/MEASURES/JS
	File Name:			update_grid2.js
=============================================================*/

var createdMeasureTypesArray = [];
var updatedMeasureTypesArray = [];

function UpdateMeasureTypeGrid() {
	createdMeasureTypesArray = [];
	updatedMeasureTypesArray = [];
	
	$("#jqxgrid2").jqxGrid('endrowedit', 0, false);
	var newGridData = ExportGridData();
	
	if(ValidateMeasureTypesRecords(newGridData)) {
		for(var key in newGridData) {
			if(newGridData[key].MeasureType_GUID == -1) {
				var dataRowObj = {};
				
				dataRowObj.MeasureType_GUID   	= CreateGUID();
				dataRowObj.MeasureTypeName 		= newGridData[key].MeasureTypeName;
				dataRowObj.DisplayName 			= newGridData[key].DisplayName;
				dataRowObj.Description 			= newGridData[key].Description;
				dataRowObj.IsActive   			= 1;
				dataRowObj.Created     			= moment(new Date()).format("YYYY-MM-DDTHH:mm:ss.000z");
				dataRowObj.Modified    			= moment(new Date()).format("YYYY-MM-DDTHH:mm:ss.000z");

				createdMeasureTypesArray.push(dataRowObj);
			}
			if(newGridData[key].RowModified) {
				var dataRowObj	= {};
				var apiKeyObj	= {};
				
				console.log(newGridData[key].MeasureType_GUID);
				apiKeyObj.MeasureType_GUID	= newGridData[key].MeasureType_GUID;
				dataRowObj.APIKEY			= apiKeyObj;
				
				dataRowObj.MeasureTypeName	= newGridData[key].MeasureTypeName;
				dataRowObj.DisplayName		= newGridData[key].DisplayName;
				dataRowObj.Description		= newGridData[key].Description;
				dataRowObj.Modified			= moment(new Date()).format("YYYY-MM-DDTHH:mm:ss.000z");
				
				updatedMeasureTypesArray.push(dataRowObj);
			}
		}
		
		savedStateG1 = $("#jqxgrid").jqxGrid('savestate');
		savedStateG2 = $("#jqxgrid2").jqxGrid('savestate');
		
		InsertIntoMeasureTypeTable();
	}
}

function InsertIntoMeasureTypeTable() {
	if(createdMeasureTypesArray.length > 0) {
		var jsonData = {
			 "fields": createdMeasureTypesArray
		};
		
		jQuery.ajax ({
			headers: {
				"Content-Type": "application/json"
			},
			url: ruIP + ruPort + planningDB + planningEN + "create/bulk/ref/MeasureType",
			type: "POST",
			data: JSON.stringify(jsonData),
			success: function(){
				UpdateMeasureTypeTable(true);
			},
			error: function(){
				DisplayAlert(languagePack.message.error,languagePack.message.recordsNotStored);
			}
		});
	}
	else {
		UpdateMeasureTypeTable(false);		
	}
}

function UpdateMeasureTypeTable(created) {
	if(updatedMeasureTypesArray.length > 0) {
		var jsonData = {
			 "fields": updatedMeasureTypesArray
		};

		jQuery.ajax ({
			headers: {
				"Content-Type": "application/json"
			},
			url: ruIP + ruPort + planningDB + planningEN + "update/bulk/ref/MeasureType",
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

function RemoveMeasureTypeRow(rowObj, rowIndex) {
	if(rowObj.MeasureType_GUID != -1) {
	
		var jsonData = {
			 "key": { "MeasureType_GUID": rowObj.MeasureType_GUID },
			 "fields": { "IsActive": false, "Modified": moment(new Date()).format("YYYY-MM-DDTHH:mm:ss.000z") }
		};		
		
		jQuery.ajax ({
			headers: {
				"Content-Type": "application/json"
			},
			url: ruIP + ruPort + planningDB + planningEN + "update/ref/MeasureType",
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

function ExportGridData() {
	var gridRowArray = $("#jqxgrid2").jqxGrid('getrows');
	
	var newArray = [];
	
	for(var key in gridRowArray) {
		var newObj = {};

		newObj.MeasureType_GUID	= gridRowArray[key].MeasureType_GUID;
		newObj.MeasureTypeName	= gridRowArray[key].MeasureTypeName;
		newObj.DisplayName		= gridRowArray[key].DisplayName;
		newObj.Description		= gridRowArray[key].Description;
		
		if(gridRowArray[key].RowModified) {
			newObj.RowModified = gridRowArray[key].RowModified;
		}		
		
		newArray.push(newObj);
	}
	
	return newArray;
}