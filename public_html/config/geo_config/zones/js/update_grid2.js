/*============================================================
	Property of:		MISOM TECHNOLOGIES
	Developer:			AARON MCCOLOUGH
	Application Name:	FARA_FRESNILLO
	Directory:			FARA_FRESNILLO/CONFIG/GEO_CONFIG/ZONES
	File Name:			update_grid2.js
=============================================================*/

var updatedLocationsArray = [];

function UpdateLocationsGrid() {
	updatedLocationsArray = [];
	
	$("#jqxgrid2").jqxGrid('endrowedit', 0, false);
	var newGridData = ExportLocationGridData();
	
	if(ValidateLocationRecords(newGridData)) {
		for(var key in newGridData) {
			if(newGridData[key].RowModified) {
				var dataRowObj	= {};
				var apiKeyObj	= {};
				apiKeyObj.Location_GUID	= newGridData[key].Location_GUID;
				dataRowObj.APIKEY		= apiKeyObj;
				
				dataRowObj.Zone_GUID	= newGridData[key].Zone_GUID;
				dataRowObj.Modified		= moment().format("YYYY-MM-DDTHH:mm:ss.000z");
				
				updatedLocationsArray.push(dataRowObj);
			}
		}
		
		savedStateG1 = $("#jqxgrid").jqxGrid('savestate');
		savedStateG2 = $("#jqxgrid2").jqxGrid('savestate');
		
		UpdateLocationTable();
	}
}

function UpdateLocationTable() {
	if(updatedLocationsArray.length > 0) {
		var jsonData = {
			 "fields": updatedLocationsArray
		};

		jQuery.ajax ({
			headers: {
				"Content-Type": "application/json"
			},
			url: ruIP + ruPort + planningDB + planningEN + "update/bulk/geo/Location",
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
		ServiceComplete();
	}
}

function RemoveLocationRow(rowObj, rowIndex) {
	if(rowObj.Location_GUID != -1) {
	
		var jsonData = {
			 "key": { "Location_GUID": rowObj.Location_GUID },
			 "fields": { "Zone_GUID": null }
		};
		
		jQuery.ajax ({
			headers: {
				"Content-Type": "application/json"
			},
			url: ruIP + ruPort + planningDB + planningEN + "update/geo/Location",
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

function ExportLocationGridData() {
	var gridRowArray = $("#jqxgrid2").jqxGrid('getrows');
	var newArray = [];
	
	for(var key in gridRowArray) {
		var newObj = {};

		newObj.Zone_GUID     = gridRowArray[key].Zone_GUID;
		newObj.Location_GUID = gridRowArray[key].Location_GUID;
		
		if(gridRowArray[key].RowModified) {
			newObj.RowModified = gridRowArray[key].RowModified;
		}
		newArray.push(newObj);
	}
	
	return newArray;
}