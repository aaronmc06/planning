/*============================================================
	Property of:		MISOM TECHNOLOGIES
	Developer:			AARON MCCOLOUGH FT. JORGE MURILLO
	Application Name:	FARA_FRESNILLO
	Directory:			FARA_FRESNILLO/CONFIG/PLAN_CONFIG/LOCATION_STATUSES/JS
	File Name:			update_grid2.js
=============================================================*/

var createdActivitiesArray = [];
var updatedActivitiesArray = [];

function UpdateActivityGrid() {
	createdActivitiesArray = [];
	updatedActivitiesArray = [];
	
	$("#jqxgrid2").jqxGrid('endrowedit', 0, false);
	var newGridData = ExportGridActivityData();
	
	if(ValidateActivitiesRecords(newGridData)) {
		for(var key in newGridData) {
			if(newGridData[key].LocationStatus_Step_GUID == -1) {
				var dataRowObj = {};
				
				dataRowObj.LocationStatus_Step_GUID = CreateGUID();
				dataRowObj.LocationStatus_GUID      = newGridData[key].LocationStatus_GUID;
				dataRowObj.MineProcess_GUID         = newGridData[key].MineProcess_GUID;
				dataRowObj.Method_GUID              = newGridData[key].Method_GUID;
				dataRowObj.Step_GUID                = newGridData[key].Step_GUID;
				dataRowObj.IsActive                 = 1;
				dataRowObj.Created                  = moment(new Date()).format("YYYY-MM-DDTHH:mm:ss.000z");
				dataRowObj.Modified                 = moment(new Date()).format("YYYY-MM-DDTHH:mm:ss.000z");
				dataRowObj.Obsolete                 = moment(new Date()).format("9999-12-31T00:00:00.000z");
				
				createdActivitiesArray.push(dataRowObj);
			}
			if(newGridData[key].RowModified) {
				var dataRowObj = {};
				var apiKeyObj = {};
				
				apiKeyObj.LocationStatus_Step_GUID = newGridData[key].LocationStatus_Step_GUID;
				dataRowObj.APIKEY = apiKeyObj;
				
				dataRowObj.LocationStatus_GUID = newGridData[key].LocationStatus_GUID;
				dataRowObj.MineProcess_GUID    = newGridData[key].MineProcess_GUID;
				dataRowObj.Method_GUID         = newGridData[key].Method_GUID;
				dataRowObj.Step_GUID           = newGridData[key].Step_GUID;
				dataRowObj.Modified            = moment(new Date()).format("YYYY-MM-DDTHH:mm:ss.000z");
				
				updatedActivitiesArray.push(dataRowObj);
			}
		}
		
		savedStateG1 = $("#jqxgrid").jqxGrid('savestate');
		savedStateG2 = $("#jqxgrid2").jqxGrid('savestate');
		
		InsertIntoActivityTable();
	}
}

function InsertIntoActivityTable() {
	if(createdActivitiesArray.length > 0) {
		var jsonData = {
			 "fields": createdActivitiesArray
		};
		
		jQuery.ajax ({
			headers: {
				"Content-Type": "application/json"
			},
			url: ruIP + ruPort + planningDB + planningEN + "create/bulk/geo/LocationStatus_Step",
			type: "POST",
			data: JSON.stringify(jsonData),
			success: function(){
				UpdateActivityTable(true);
			},
			error: function(){
				DisplayAlert(languagePack.message.error,languagePack.message.recordsNotStored);
			}
		});
	}
	else {
		UpdateActivityTable(true);
	}
}

function UpdateActivityTable(created) {
	if(updatedActivitiesArray.length > 0) {
		var jsonData = {
			 "fields": updatedActivitiesArray
		};
		
		jQuery.ajax ({
			headers: {
				"Content-Type": "application/json"
			},
			url: ruIP + ruPort + planningDB + planningEN + "update/bulk/geo/LocationStatus_Step",
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

function RemoveActivityRow(rowObj, rowIndex) {
	if(rowObj.LocationStatus_Step_GUID != -1) {
		
		var jsonData = {
			 "key": { "LocationStatus_Step_GUID": rowObj.LocationStatus_Step_GUID },
			 "fields": { "IsActive": false, "Modified": moment(new Date()).format("YYYY-MM-DDTHH:mm:ss.000z"), "Obsolete": moment(new Date()).format("YYYY-MM-DDTHH:mm:ss.000z") }
		};
		
		jQuery.ajax ({
			headers: {
				"Content-Type": "application/json"
			},
			url: ruIP + ruPort + planningDB + planningEN + "update/geo/LocationStatus_Step",
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

function ExportGridActivityData() {
	var gridRowArray = $("#jqxgrid2").jqxGrid('getrows');
	var newArray = [];
	
	for(var key in gridRowArray) {
		var newObj = {};

		newObj.LocationStatus_Step_GUID	= gridRowArray[key].LocationStatus_Step_GUID;
		newObj.LocationStatus_GUID		= gridRowArray[key].LocationStatus_GUID;
		newObj.MineProcess_GUID			= gridRowArray[key].MineProcess_GUID;
		newObj.Method_GUID				= gridRowArray[key].Method_GUID;
		newObj.Step_GUID				= gridRowArray[key].Step_GUID;
		
		if(gridRowArray[key].RowModified) {
			newObj.RowModified = gridRowArray[key].RowModified;
		}		
		
		newArray.push(newObj);
	}
	
	return newArray;
}