/*============================================================
	Property of:		MISOM TECHNOLOGIES
	Developer:			AARON MCCOLOUGH FT. JORGE MURILLO
	Application Name:	FARA_FRESNILLO
	Directory:			FARA_FRESNILLO/CONFIG/METHOD_STEP/JS
	File Name:			update_grid2.js
=============================================================*/

var createdAreasArray = [];
var updatedAreasArray = [];

function UpdateAreaGrid() {
	createdAreasArray = [];
	updatedAreasArray = [];
	
	$("#jqxgrid2").jqxGrid('endrowedit', 0, false);
	var newGridData = ExportGridAreaData();
	
	if(ValidateAreasRecords(newGridData)) {
		for(var key in newGridData) {
			if(newGridData[key].PersonArea_GUID == -1) {
				var dataRowObj = {};

				dataRowObj.PersonArea_GUID	= CreateGUID();
				dataRowObj.PersonGUID		= newGridData[key].PersonGUID;
				dataRowObj.Area_GUID		= newGridData[key].Area_GUID;
				dataRowObj.IsActive			= 1;
				dataRowObj.Created			= moment(new Date()).format("YYYY-MM-DDTHH:mm:ss.000z");
				dataRowObj.Modified			= moment(new Date()).format("YYYY-MM-DDTHH:mm:ss.000z");
				
				createdAreasArray.push(dataRowObj);
			}
			else if(newGridData[key].RowModified) {
				var dataRowObj	= {};
				var apiKeyObj	= {};
				
				apiKeyObj.PersonArea_GUID	= newGridData[key].PersonArea_GUID;
				dataRowObj.APIKEY			= apiKeyObj;
				
				dataRowObj.PersonGUID	= newGridData[key].PersonGUID;
				dataRowObj.Area_GUID	= newGridData[key].Area_GUID;
				dataRowObj.IsActive		= 1;
				dataRowObj.Modified		= moment(new Date()).format("YYYY-MM-DDTHH:mm:ss.000z");
				
				updatedAreasArray.push(dataRowObj);
			}
		}
		
		savedStateG1 = $("#jqxgrid").jqxGrid('savestate');
		savedStateG2 = $("#jqxgrid2").jqxGrid('savestate');
		
		InsertIntoAreaTable();
	}
}

function InsertIntoAreaTable() {
	if(createdAreasArray.length > 0) {
		var jsonData = {
			 "fields": createdAreasArray
		};
		
		jQuery.ajax ({
			headers: {
				"Content-Type": "application/json"
			},
			url: ruIP + ruPort + planningDB + planningEN + "create/bulk/cfg/Person_Area",
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
	if(updatedAreasArray.length > 0) {
		var jsonData = {
			 "fields": updatedAreasArray
		};
		
		jQuery.ajax ({
			headers: {
				"Content-Type": "application/json"
			},
			url: ruIP + ruPort + planningDB + planningEN + "update/bulk/cfg/Person_Area",
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
	if(rowObj.PersonArea_GUID != -1) {
	
		var jsonData = {
			 "key": { "PersonArea_GUID": rowObj.PersonArea_GUID },
			 "fields": { "IsActive": false, "Modified": moment(new Date()).format("YYYY-MM-DDTHH:mm:ss.000z"), "Obsolete": moment(new Date()).format("YYYY-MM-DDTHH:mm:ss.000z") }
		};
		
		jQuery.ajax ({
			headers: {
				"Content-Type": "application/json"
			},
			url: ruIP + ruPort + planningDB + planningEN + "update/cfg/Person_Area",
			type: "POST",
			data: JSON.stringify(jsonData),
			success: function(){
				DisplayAlert("&Eacute;xito!","El registro fue eliminado!");
				
				$('#jqxgrid2').jqxGrid('deleterow', rowIndex);
				
				UpdateAreaGrid();
			}
		});
	}
	else {
		$('#jqxgrid2').jqxGrid('deleterow', rowIndex);
	}
}

function ExportGridAreaData() {
	var gridRowArray = $("#jqxgrid2").jqxGrid('getrows');
	
	var newArray = [];
	
	for(var key in gridRowArray) {
		var newObj = {};

		newObj.PersonArea_GUID	= gridRowArray[key].PersonArea_GUID;
		newObj.PersonGUID		= gridRowArray[key].PersonGUID;
		newObj.Area_GUID		= gridRowArray[key].Area_GUID;
		
		if(gridRowArray[key].RowModified) {
			newObj.RowModified = gridRowArray[key].RowModified;
		}		
		
		newArray.push(newObj);
	}
	
	return newArray;
}