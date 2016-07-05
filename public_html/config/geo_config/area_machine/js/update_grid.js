/*============================================================
	Property of:		MISOM TECHNOLOGIES
	Developer:			AARON MCCOLOUGH FT. JORGE MURILLO
	Application Name:	FARA_FRESNILLO
	Directory:			FARA_FRESNILLO/CONFIG/GEO_CONFIG/AREA_MACHINE/JS
	File Name:			update_grid.js
=============================================================*/

var createdAreaArray = [];
var updatedAreaArray = [];

function UpdateAreas2Grid() {
	createdAreaArray = [];
	updatedAreaArray = [];
	
	$("#jqxgrid").jqxGrid('endrowedit', 0, false);
	var newGridData = ExportAreaGridData();
	
	if(ValidateAreaRecords(newGridData)) {
		for(var key in newGridData) {
			if(newGridData[key].Area_GUID == -1) {
				var dataRowObj = {};
        
				dataRowObj.Area_GUID	= CreateGUID();
				dataRowObj.AreaName		= newGridData[key].AreaName;
				dataRowObj.DisplayName	= newGridData[key].DisplayName;
				dataRowObj.IsActive 		 = 1;
				
				createdAreaArray.push(dataRowObj);
			}
			else if(newGridData[key].RowModified) {
				var dataRowObj = {};
				var apiKeyObj = {};
				
				apiKeyObj.Area_GUID = newGridData[key].Area_GUID;
				dataRowObj.APIKEY           = apiKeyObj;
				
				dataRowObj.AreaName    = newGridData[key].AreaName;
				dataRowObj.DisplayName = newGridData[key].DisplayName;
				
				updatedAreaArray.push(dataRowObj);
			}
		}
		
		savedStateG1 = $("#jqxgrid").jqxGrid('savestate');
		savedStateG2 = $("#jqxgrid").jqxGrid('savestate');
		
		InsertIntoAreaTable();
	}
}

function InsertIntoAreaTable() {
  
	if(createdAreaArray.length > 0) {
		var jsonData = {
			 "fields": createdAreaArray
		};
		
		jQuery.ajax ({
			headers: {
				"Content-Type": "application/json"
			},
			url: ruIP + ruPort + planningDB + planningEN + "create/bulk/geo/Area",
			type: "POST",
			data: JSON.stringify(jsonData),
			success: function(){
				UpdateAreaTable(true);
			},
			error: function(){
				DisplayAlert(languagePack.message.error,languagePack.message.recordsNotStored);
			}
		});
	}
	else {
		UpdateAreaTable(false);		
	}
}

function UpdateAreaTable(created) {
  console.log(createdAreaArray);
	if(updatedAreaArray.length > 0) {
		var jsonData = {
			 "fields": updatedAreaArray
		};

		jQuery.ajax ({
			headers: {
				"Content-Type": "application/json"
			},
			url: ruIP + ruPort + planningDB + planningEN + "update/bulk/geo/Area",
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

function RemoveAreaRow(rowObj, rowIndex) {
	if(rowObj.Area_GUID != -1) {
		var jsonData = {
			 "key": { "Area_GUID": rowObj.Area_GUID },
			 "fields": { "IsActive": false, "Modified": moment().format("YYYY-MM-DDTHH:mm:ss.000z"), "Obsolete": moment().format("YYYY-MM-DDTHH:mm:ss.000z") }
		};
		
		jQuery.ajax ({
			headers: {
				"Content-Type": "application/json"
			},
			url: ruIP + ruPort + planningDB + planningEN + "update/geo/Area",
			type: "POST",
			data: JSON.stringify(jsonData),
			success: function(){
				$('#jqxgrid').jqxGrid('deleterow', rowIndex);
				DisplayAlert(languagePack.message.success,languagePack.message.recordsDeleted);
			}
		});
	}
	else {
		$('#jqxgrid').jqxGrid('deleterow', rowIndex);
	}
}

function ExportAreaGridData() {
	var gridRowArray = $("#jqxgrid").jqxGrid('getrows');
	
	var newArray = [];
	
	for(var key in gridRowArray) {
		var newObj = {};
		
		newObj.Area_GUID	= gridRowArray[key].Area_GUID;
		newObj.AreaName		= gridRowArray[key].AreaName;
		newObj.DisplayName			= gridRowArray[key].DisplayName;

		if(gridRowArray[key].RowModified) {
			newObj.RowModified = gridRowArray[key].RowModified;
		}		
		
		newArray.push(newObj);
	}
  
	return newArray;
}