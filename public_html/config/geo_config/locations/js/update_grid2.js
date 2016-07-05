/*============================================================
	Property of:		MISOM TECHNOLOGIES
	Developer:			AARON MCCOLOUGH FT. JORGE MURILLO
	Application Name:	FARA_FRESNILLO
	Directory:			FARA_FRESNILLO/CONFIG/GEO_CONFIG/LOCATIONS/JS
	File Name:			update_grid2.js
=============================================================*/

var createdLocationArray = [];
var updatedLocationArray = [];

function UpdateLocationGrid() {
	createdLocationArray = [];
	updatedLocationArray = [];
	
	$("#jqxgrid").jqxGrid('endrowedit', 0, false);
	var newGridData = ExportGridLocationData();

	if(ValidateStepsRecords(newGridData)) {
		for(var key in newGridData) {
			if(newGridData[key].Location_GUID == -1) {
				var dataRowObj = {};
				
				dataRowObj.Location_GUID      = CreateGUID();
				dataRowObj.Area_GUID          = newGridData[key].Area_GUID;
				dataRowObj.LocationCode       = newGridData[key].LocationCode;
				dataRowObj.LocationName       = newGridData[key].LocationName;
				dataRowObj.DisplayName        = newGridData[key].DisplayName;
				dataRowObj.Obracode_GUID      = newGridData[key].Obracode_GUID;
				dataRowObj.Nivel              = newGridData[key].Nivel;
				dataRowObj.Orientacion_GUID   = newGridData[key].Orientacion_GUID;
				dataRowObj.VetaClave_GUID     = newGridData[key].VetaClave_GUID;
				dataRowObj.GeologyStatus_GUID = newGridData[key].GeologyStatus_GUID;
				dataRowObj.Minestatus_GUID    = newGridData[key].Minestatus_GUID;
				dataRowObj.ReferenceLine      = newGridData[key].ReferenceLine;
				dataRowObj.Elevation          = newGridData[key].Elevation;
				dataRowObj.BlockName          = newGridData[key].BlockName;
				dataRowObj.Length             = newGridData[key].Length;
				
				dataRowObj.IsActive = 1;
				dataRowObj.Created  = moment(new Date()).format("YYYY-MM-DDTHH:mm:ss.000z");
				dataRowObj.Modified = moment(new Date()).format("YYYY-MM-DDTHH:mm:ss.000z");
				
				createdLocationArray.push(dataRowObj);
			}
			if(newGridData[key].RowModified) {
				var dataRowObj = {};
				var apiKeyObj = {};
				
				apiKeyObj.Location_GUID = newGridData[key].Location_GUID;
				dataRowObj.APIKEY = apiKeyObj;
				
				dataRowObj.Area_GUID			= newGridData[key].Area_GUID;
				dataRowObj.LocationCode			= newGridData[key].LocationCode;
				dataRowObj.LocationName			= newGridData[key].LocationName;
				dataRowObj.DisplayName			= newGridData[key].DisplayName;
				dataRowObj.Obracode_GUID		= newGridData[key].Obracode_GUID;
				dataRowObj.Nivel				= newGridData[key].Nivel;
				dataRowObj.Orientacion_GUID		= newGridData[key].Orientacion_GUID;
				dataRowObj.VetaClave_GUID		= newGridData[key].VetaClave_GUID;
				dataRowObj.GeologyStatus_GUID	= newGridData[key].GeologyStatus_GUID;
				dataRowObj.Minestatus_GUID		= newGridData[key].Minestatus_GUID;
				dataRowObj.ReferenceLine		= newGridData[key].ReferenceLine;
				dataRowObj.Elevation			= newGridData[key].Elevation;
				dataRowObj.BlockName			= newGridData[key].BlockName;
				dataRowObj.Length				= newGridData[key].Length;				
				dataRowObj.Modified				= moment(new Date()).format("YYYY-MM-DDTHH:mm:ss.000z");
				
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
			url: ruIP + ruPort + planningDB + planningEN + "create/bulk/geo/Location",
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
		if(created) {
			DisplayAlert(languagePack.message.success,languagePack.message.recordsStored);
		}
		LoadLists();
	}
}

function RemoveLocationRow(rowObj, rowIndex) {
	if(rowObj.Location_GUID != -1) {
	
		var jsonData = {
			 "key": { "Location_GUID": rowObj.Location_GUID },
			 "fields": { "IsActive": false, "Modified": moment(new Date()).format("YYYY-MM-DDTHH:mm:ss.000z"), "Obsolete": moment(new Date()).format("YYYY-MM-DDTHH:mm:ss.000z") }
		};
		
		jQuery.ajax ({
			headers: {
				"Content-Type": "application/json"
			},
			url: ruIP + ruPort + planningDB + planningEN + "update/geo/Location",
			type: "POST",
			data: JSON.stringify(jsonData),
			success: function(){
				DisplayAlert(languagePack.message.success,languagePack.message.recordsDeleted)
				$('#jqxgrid').jqxGrid('deleterow', rowIndex);
			}
		});
	}
	else {
		$('#jqxgrid').jqxGrid('deleterow', rowIndex);
	}
}

function ExportGridLocationData() {
	var gridRowArray = $("#jqxgrid").jqxGrid('getrows');
	
	var newArray = [];
	
	for(var key in gridRowArray) {
		var newObj = {};
		
		if((gridRowArray[key].RowModified == true) || (gridRowArray[key].Location_GUID == -1)){
			newObj.Location_GUID      = gridRowArray[key].Location_GUID;
			newObj.Area_GUID          = gridRowArray[key].Area_GUID;
			newObj.LocationName       = gridRowArray[key].ObraDisplayName + "-" + gridRowArray[key].Nivel + "-" + gridRowArray[key].ReferenceLine + "-" + gridRowArray[key].OrientacionDisplayName + "-" + gridRowArray[key].VetaClaveDisplayName;
			newObj.LocationCode       = gridRowArray[key].LocationCode;
			newObj.DisplayName        = gridRowArray[key].LocationDisplayName;
			newObj.Obracode_GUID      = gridRowArray[key].Obracode_GUID;
			newObj.Nivel              = gridRowArray[key].Nivel;
			newObj.ReferenceLine      = gridRowArray[key].ReferenceLine;
			newObj.Orientacion_GUID   = gridRowArray[key].Orientacion_GUID;
			newObj.VetaClave_GUID     = gridRowArray[key].VetaClave_GUID;
			newObj.GeologyStatus_GUID = gridRowArray[key].GeologyStatus_GUID;
			newObj.Minestatus_GUID    = gridRowArray[key].Minestatus_GUID;
			newObj.Elevation          = gridRowArray[key].Elevation;
			newObj.BlockName          = gridRowArray[key].BlockName;
			newObj.Length             = gridRowArray[key].Length;
			
			if(gridRowArray[key].RowModified) {
				newObj.RowModified = gridRowArray[key].RowModified;
			}
			
			newArray.push(newObj);
		}
	}
	
	return newArray;
}