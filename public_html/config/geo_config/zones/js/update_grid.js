/*============================================================
	Property of:		MISOM TECHNOLOGIES
	Developer:			AARON MCCOLOUGH
	Application Name:	FARA_FRESNILLO
	Directory:			FARA_FRESNILLO/CONFIG/GEO_CONFIG/ZONES
	File Name:			update_grid.js
=============================================================*/

var createdZonesArray = [];
var updatedZonesArray = [];

function UpdateZonesGrid() {
	createdZonesArray = [];
	updatedZonesArray = [];
	
	$("#jqxgrid").jqxGrid('endrowedit', 0, false);
	var newGridData = ExportZoneGridData();
	
	if(ValidateZoneRecords(newGridData)) {
	
		for(var key in newGridData) {
	
			if(newGridData[key].Zone_GUID == -1) {
				var dataRowObj = {};
				
				dataRowObj.Zone_GUID	= CreateGUID();
				dataRowObj.Area_GUID	= newGridData[key].Area_GUID;
				dataRowObj.ZoneName		= newGridData[key].ZoneName;
				dataRowObj.DisplayName	= newGridData[key].DisplayName;
				dataRowObj.IsActive		= 1;
				dataRowObj.Created		= moment().format("YYYY-MM-DDTHH:mm:ss.000z");
				dataRowObj.Modified		= moment().format("YYYY-MM-DDTHH:mm:ss.000z");
				
				createdZonesArray.push(dataRowObj);
			}
			else if(newGridData[key].RowModified) {
				var dataRowObj	= {};
				var apiKeyObj	= {};
				
				apiKeyObj.Zone_GUID	= newGridData[key].Zone_GUID;
				dataRowObj.APIKEY	= apiKeyObj;
				
				dataRowObj.Area_GUID	= newGridData[key].Area_GUID;
				dataRowObj.ZoneName		= newGridData[key].ZoneName;
				dataRowObj.DisplayName	= newGridData[key].DisplayName;
				dataRowObj.Modified		= moment().format("YYYY-MM-DDTHH:mm:ss.000z");
				
				updatedZonesArray.push(dataRowObj);
			}
		}
		
		savedStateG1 = $("#jqxgrid").jqxGrid('savestate');
		savedStateG2 = $("#jqxgrid2").jqxGrid('savestate');

		InsertIntoZoneTable();
	}
}

function InsertIntoZoneTable() {
	if(createdZonesArray.length > 0) {
		var jsonData = {
			 "fields": createdZonesArray
		};
		
		jQuery.ajax ({
			headers: {
				"Content-Type": "application/json"
			},
			url: ruIP + ruPort + planningDB + planningEN + "create/bulk/geo/Zone",
			type: "POST",
			data: JSON.stringify(jsonData),
			success: function(){
				UpdateZoneTable(true);
			},
			error: function(){
				DisplayAlert(languagePack.message.error,languagePack.message.recordsNotStored);
			}
		});
	}
	else {
		UpdateZoneTable(false);		
	}
}

function UpdateZoneTable(created) {
	if(updatedZonesArray.length > 0) {
		var jsonData = {
			 "fields": updatedZonesArray
		};
		
		jQuery.ajax ({
			headers: {
				"Content-Type": "application/json"
			},
			url: ruIP + ruPort + planningDB + planningEN + "update/bulk/geo/Zone",
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

function RemoveZoneRow(rowObj, rowIndex) {
	if(rowObj.Zone_GUID != -1) {
	
		var jsonData = {
			 "key": { "Zone_GUID": rowObj.Zone_GUID },
			 "fields": { "IsActive": false, "Modified": moment().format("YYYY-MM-DDTHH:mm:ss.000z") }
		};
		
		jQuery.ajax ({
			headers: {
				"Content-Type": "application/json"
			},
			url: ruIP + ruPort + planningDB + planningEN + "update/geo/Zone",
			type: "POST",
			data: JSON.stringify(jsonData),
			success: function(){
				$('#jqxgrid').jqxGrid('deleterow', rowIndex);
			}
		});
	}
	else {
		$('#jqxgrid').jqxGrid('deleterow', rowIndex);
	}
}

function ExportZoneGridData() {
	var gridRowArray = $("#jqxgrid").jqxGrid('getrows');
	var newArray = [];
	
	for(var key in gridRowArray) {
		var newObj = {};

		newObj.Zone_GUID   = gridRowArray[key].Zone_GUID;
		newObj.Area_GUID   = gridRowArray[key].Area_GUID;
		newObj.ZoneName    = gridRowArray[key].DisplayName;
		newObj.DisplayName = gridRowArray[key].DisplayName;
		
		if(gridRowArray[key].RowModified) {
			newObj.RowModified = gridRowArray[key].RowModified;
		}		
		
		newArray.push(newObj);
	}
	
	return newArray;
}