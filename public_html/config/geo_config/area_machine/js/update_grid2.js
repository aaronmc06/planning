/*============================================================
	Property of:		MISOM TECHNOLOGIES
	Developer:			AARON MCCOLOUGH FT. JORGE MURILLO
	Application Name:	FARA_FRESNILLO
	Directory:			FARA_FRESNILLO/CONFIG/GEO_CONFIG/AREA_MACHINE/JS
	File Name:			update_grid2.js
=============================================================*/

var createdMachineAreaArray = [];
var updatedMachineAreaArray = [];

function UpdateAreasGrid() {
	createdMachineAreaArray = [];
	updatedMachineAreaArray = [];
	
	$("#jqxgrid2").jqxGrid('endrowedit', 0, false);
	var newGridData = ExportMachineAreaGridData();
	
	if(ValidateMachineAreaRecords(newGridData)) {
		for(var key in newGridData) {
			if(newGridData[key].Machine_Area_GUID == -1) {
				var dataRowObj = {};

				dataRowObj.Machine_Area_GUID = CreateGUID();
				dataRowObj.Area_GUID         = newGridData[key].Area_GUID;
				dataRowObj.Machine_GUID      = newGridData[key].Machine_GUID;
				dataRowObj.IsActive 		 = 1;
				dataRowObj.Created 			 = moment().format("YYYY-MM-DDTHH:mm:ss.000z");
				dataRowObj.Modified 		 = moment().format("YYYY-MM-DDTHH:mm:ss.000z");
				
				createdMachineAreaArray.push(dataRowObj);
			}
			else if(newGridData[key].RowModified) {
				var dataRowObj = {};
				var apiKeyObj = {};
				
				apiKeyObj.Machine_Area_GUID = newGridData[key].Machine_Area_GUID;
				dataRowObj.APIKEY           = apiKeyObj;
				
				dataRowObj.Area_GUID    = newGridData[key].Area_GUID;
				dataRowObj.Machine_GUID = newGridData[key].Machine_GUID;
				dataRowObj.Modified     = moment().format("YYYY-MM-DDTHH:mm:ss.000z");
				
				updatedMachineAreaArray.push(dataRowObj);
			}
		}
		
		savedStateG1 = $("#jqxgrid").jqxGrid('savestate');
		savedStateG2 = $("#jqxgrid2").jqxGrid('savestate');
		
		InsertIntoMachineAreaTable();
	}
}

function InsertIntoMachineAreaTable() {
	if(createdMachineAreaArray.length > 0) {
		var jsonData = {
			 "fields": createdMachineAreaArray
		};
		
		jQuery.ajax ({
			headers: {
				"Content-Type": "application/json"
			},
			url: ruIP + ruPort + planningDB + planningEN + "create/bulk/eqmt/Machine_Area",
			type: "POST",
			data: JSON.stringify(jsonData),
			success: function(){
				UpdateMachineAreaTable(true);
			},
			error: function(){
				DisplayAlert(languagePack.message.error,languagePack.message.recordsNotStored);
			}
		});
	}
	else {
		UpdateMachineAreaTable(false);		
	}
}

function UpdateMachineAreaTable(created) {
	if(updatedMachineAreaArray.length > 0) {
		var jsonData = {
			 "fields": updatedMachineAreaArray
		};

		jQuery.ajax ({
			headers: {
				"Content-Type": "application/json"
			},
			url: ruIP + ruPort + planningDB + planningEN + "update/bulk/eqmt/Machine_Area",
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

function RemoveMachineAreaRow(rowObj, rowIndex) {
	if(rowObj.Machine_Area_GUID != -1) {	
		var jsonData = {
			 "key": { "Machine_Area_GUID": rowObj.Machine_Area_GUID },
			 "fields": { "IsActive": false, "Modified": moment().format("YYYY-MM-DDTHH:mm:ss.000z"), "Obsolete": moment().format("YYYY-MM-DDTHH:mm:ss.000z") }
		};
		
		jQuery.ajax ({
			headers: {
				"Content-Type": "application/json"
			},
			url: ruIP + ruPort + planningDB + planningEN + "update/eqmt/Machine_Area",
			type: "POST",
			data: JSON.stringify(jsonData),
			success: function(){
				$('#jqxgrid2').jqxGrid('deleterow', rowIndex);
				DisplayAlert(languagePack.message.success,languagePack.message.recordsDeleted);
			}
		});
	}
	else {
		$('#jqxgrid2').jqxGrid('deleterow', rowIndex);
	}
}

function ExportMachineAreaGridData() {
	var gridRowArray = $("#jqxgrid2").jqxGrid('getrows');
	
	var newArray = [];
	
	for(var key in gridRowArray) {
		var newObj = {};
		
		newObj.Machine_Area_GUID	= gridRowArray[key].Machine_Area_GUID;
		newObj.MachineType_GUID		= gridRowArray[key].MachineType_GUID;
		newObj.Machine_GUID			= gridRowArray[key].Machine_GUID;
		newObj.Area_GUID			= areaGuid;

		if(gridRowArray[key].RowModified) {
			newObj.RowModified = gridRowArray[key].RowModified;
		}		
		
		newArray.push(newObj);
	}
	
	return newArray;
}