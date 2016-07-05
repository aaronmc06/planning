/*============================================================
	Property of:		MISOM TECHNOLOGIES
	Developer:			AARON MCCOLOUGH FT. JORGE MURILLO
	Application Name:	FARA_FRESNILLO
	Directory:			FARA_FRESNILLO/LOCATIONS/JS
	File Name:			update_grid2.js
=============================================================*/

var createdLocationArray = [];
var updatedLocationArray = [];

function UpdateLocationGrid() {
	createdLocationArray = [];
	updatedLocationArray = [];
	
	$("#jqxgrid").jqxGrid('endrowedit', 0, false);
	var newGridData = ExportGridLocationData();
	
	if(ValidateStatusRecords(newGridData)) {
		for(var key in newGridData) {
			if(newGridData[key].LocationCurrentStatus_GUID == null) {
				var dataRowObj = {};
				
				dataRowObj.LocationCurrentStatus_GUID = CreateGUID();
				dataRowObj.Location_GUID              = newGridData[key].Location_GUID;
				dataRowObj.LocationStatus_GUID        = newGridData[key].LocationStatus_GUID;
				dataRowObj.IsActive                   = 1;
				dataRowObj.Created                    = moment().format("YYYY-MM-DDTHH:mm:ss.000z");
				dataRowObj.Modified                   = moment().format("YYYY-MM-DDTHH:mm:ss.000z");
				dataRowObj.LastUpdatedBy              = UserData[0].PersonGUID;
				
				createdLocationArray.push(dataRowObj);
			}
			else if(newGridData[key].RowModified) {
				var dataRowObj	= {};
				var apiKeyObj	= {};
				
				apiKeyObj.LocationCurrentStatus_GUID	= newGridData[key].LocationCurrentStatus_GUID;
				dataRowObj.APIKEY						= apiKeyObj;
				
				dataRowObj.Location_GUID		= newGridData[key].Location_GUID;
				dataRowObj.LocationStatus_GUID	= newGridData[key].LocationStatus_GUID;
				dataRowObj.Modified				= moment().format("YYYY-MM-DDTHH:mm:ss.000z");
				dataRowObj.LastUpdatedBy		= UserData[0].PersonGUID;
				
				updatedLocationArray.push(dataRowObj);
			}
		}
		
		savedStateG1 = $("#jqxgrid").jqxGrid('savestate');	
		
		InsertIntoLocationTable();
	}
}

function InsertIntoLocationTable() {
	if(createdLocationArray.length > 0) {
		var jsonData = {
			 "fields": createdLocationArray
		};
		
		jQuery.ajax ({
			headers: {
				"Content-Type": "application/json"
			},
			url: ruIP + ruPort + planningDB + planningEN + "create/bulk/geo/LocationCurrentStatus",
			type: "POST",
			data: JSON.stringify(jsonData),
			success: function(){
				UpdateLocationTable(true);
			},
			error: function(){
				DisplayAlert(languagePack.message.error,languagePack.message.recordsNotStored);
			}
		});
	}
	else {
		UpdateLocationTable(false);		
	}
}

function UpdateLocationTable(created) {
	if(updatedLocationArray.length > 0) {
		var jsonData = {
			 "fields": updatedLocationArray
		};
		
		jQuery.ajax ({
			headers: {
				"Content-Type": "application/json"
			},
			url: ruIP + ruPort + planningDB + planningEN + "update/bulk/geo/LocationCurrentStatus",
			type: "POST",
			data: JSON.stringify(jsonData),
			success: function(){
				DisplayAlert(languagePack.message.success,languagePack.message.recordsUpdated);
				LoadLists();
				DeactivateZeroStatus();
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

function DeactivateZeroStatus() {
	var dataRowObj	= {};
	var apiKeyObj	= {};
	
	apiKeyObj.LocationStatus_GUID	= null;
	
	dataRowObj.IsActive                   = 0;
	dataRowObj.Modified                   = moment().format("YYYY-MM-DDTHH:mm:ss.000z");
	
	var jsonData = {
		"key": apiKeyObj,
		"fields": dataRowObj
	};
	
	jQuery.ajax ({
		headers: {
			"Content-Type": "application/json"
		},
		url: ruIP + ruPort + planningDB + planningEN + "update/geo/LocationCurrentStatus",
		type: "POST",
		data: JSON.stringify(jsonData),
		success: function(){
		}
	});
}

function ExportGridLocationData() {
	var gridRowArray = $("#jqxgrid").jqxGrid('getrows');
	
	var newArray = [];
	
	for(var key in gridRowArray) {
		var newObj = {};
		
		if((gridRowArray[key].RowModified == true)){
			newObj.LocationCurrentStatus_GUID	= gridRowArray[key].LocationCurrentStatus_GUID;
			newObj.Location_GUID          		= gridRowArray[key].Location_GUID;
			newObj.LocationStatus_GUID       	= gridRowArray[key].LocationStatus_GUID;
			
			if(gridRowArray[key].RowModified) {
				newObj.RowModified = gridRowArray[key].RowModified;
			}
			
			newArray.push(newObj);
		}
	}
	
	return newArray;
}