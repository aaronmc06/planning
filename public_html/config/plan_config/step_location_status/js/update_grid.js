/*============================================================
	Property of:		MISOM TECHNOLOGIES
	Developer:			AARON MCCOLOUGH FT. JORGE MURILLO
	Application Name:	FARA_FRESNILLO
	Directory:			FARA_FRESNILLO/CONFIG/PLAN_CONFIG/LOCATION_STATUSES/JS
	File Name:			update_grid.js
=============================================================*/

var createdStatusesArray = [];
var updatedStatusesArray = [];

function UpdateStatusGrid() {
	createdStatusesArray = [];
	updatedStatusesArray = [];
	
	$("#jqxgrid").jqxGrid('endrowedit', 0, false);
	var newGridData = ExportGridStatusData();
	
	if(ValidateStatusesRecords(newGridData)) {
		for(var key in newGridData) {
			if(newGridData[key].LocationStatus_GUID == -1) {
				var dataRowObj = {};
				
				dataRowObj.LocationStatus_GUID = CreateGUID();
				dataRowObj.LocationStatus      = newGridData[key].LocationStatus;
				dataRowObj.DisplayName         = newGridData[key].DisplayName;
				dataRowObj.IsActive            = 1;
				dataRowObj.Created             = moment(new Date()).format("YYYY-MM-DDTHH:mm:ss.000z");
				dataRowObj.Modified            = moment(new Date()).format("YYYY-MM-DDTHH:mm:ss.000z");
				dataRowObj.Obsolete            = moment(new Date()).format("9999-12-31T00:00:00.000z");
				
				createdStatusesArray.push(dataRowObj);
			}
			if(newGridData[key].RowModified) {
				var dataRowObj = {};
				var apiKeyObj = {};
				
				apiKeyObj.LocationStatus_GUID = newGridData[key].LocationStatus_GUID;
				dataRowObj.APIKEY = apiKeyObj;
				
				dataRowObj.LocationStatus = newGridData[key].LocationStatus;
				dataRowObj.DisplayName    = newGridData[key].DisplayName;
				dataRowObj.Modified       = moment(new Date()).format("YYYY-MM-DDTHH:mm:ss.000z");
				
				updatedStatusesArray.push(dataRowObj);
			}
		}
		
		savedStateG1 = $("#jqxgrid").jqxGrid('savestate');
		savedStateG2 = $("#jqxgrid2").jqxGrid('savestate');
		
		InsertIntoStatusTable();
	}
}

function InsertIntoStatusTable() {
	if(createdStatusesArray.length > 0) {
		var jsonData = {
			 "fields": createdStatusesArray
		};
		jQuery.ajax ({
			headers: {
				"Content-Type": "application/json"
			},
			url: ruIP + ruPort + planningDB + planningEN + "create/bulk/geo/LocationStatus",
			type: "POST",
			data: JSON.stringify(jsonData),
			success: function(){
				UpdateStatusTable(true);
			},
			error: function(){
				DisplayAlert(languagePack.message.error,languagePack.message.recordsNotStored);
			}
		});
	}
	else {
		UpdateStatusTable(false);
	}
}

function UpdateStatusTable(created) {
	if(updatedStatusesArray.length > 0) {
		var jsonData = {
			 "fields": updatedStatusesArray
		};
		jQuery.ajax ({
			headers: {
				"Content-Type": "application/json"
			},
			url: ruIP + ruPort + planningDB + planningEN + "update/bulk/geo/LocationStatus",
			type: "POST",
			data: JSON.stringify(jsonData),
			success: function(){
				DisplayAlert(languagePack.message.recordsUpdated);
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

function RemoveStatusRow(rowObj, rowIndex) {
	if(rowObj.LocationStatus_GUID != -1) {
		
		var jsonData = {
			 "key": { "LocationStatus_GUID": rowObj.LocationStatus_GUID },
			 "fields": { "IsActive": false, "Modified": moment(new Date()).format("YYYY-MM-DDTHH:mm:ss.000z"), "Obsolete": moment(new Date()).format("YYYY-MM-DDTHH:mm:ss.000z") }
		};
		
		jQuery.ajax ({
			headers: {
				"Content-Type": "application/json"
			},
			url: ruIP + ruPort + planningDB + planningEN + "update/geo/LocationStatus",
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

function ExportGridStatusData() {
	var gridRowArray = $("#jqxgrid").jqxGrid('getrows');
	
	var newArray = [];
	
	for(var key in gridRowArray) {
		var newObj = {};

		newObj.LocationStatus_GUID	= gridRowArray[key].LocationStatus_GUID;
		newObj.LocationStatus		= gridRowArray[key].DisplayName;
		newObj.DisplayName			= gridRowArray[key].DisplayName;
		
		if(gridRowArray[key].RowModified) {
			newObj.RowModified = gridRowArray[key].RowModified;
		}		
		
		newArray.push(newObj);
	}
	
	return newArray;
}