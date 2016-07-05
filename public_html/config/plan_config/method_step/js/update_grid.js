/*============================================================
	Property of:		MISOM TECHNOLOGIES
	Developer:			AARON MCCOLOUGH FT. JORGE MURILLO
	Application Name:	FARA_FRESNILLO
	Directory:			FARA_FRESNILLO/CONFIG/PLAN_CONFIG/METHOD_STEP/JS
	File Name:			update_grid.js
=============================================================*/

var createdMethodsArray = [];
var updatedMethodsArray = [];

function UpdateMethodsGrid() {
	createdMethodsArray = [];
	updatedMethodsArray = [];
	
	$("#jqxgrid").jqxGrid('endrowedit', 0, false);
	var newGridData = ExportGridData();
	
	for(var key in newGridData) {

		if(newGridData[key].Method_GUID == -1) {
			var dataRowObj = {};
			
			dataRowObj.Method_GUID   		= CreateGUID();
			dataRowObj.MineProcess_GUID   	= newGridData[key].MineProcess_GUID;
			dataRowObj.Method_Name   		= newGridData[key].Method_Name;
			dataRowObj.DisplayName    		= newGridData[key].DisplayName;
			dataRowObj.IsActive   			= 1;
			dataRowObj.Created     			= moment().format("YYYY-MM-DDTHH:mm:ss.000z");
			dataRowObj.Modified    			= moment().format("YYYY-MM-DDTHH:mm:ss.000z");
			
			createdMethodsArray.push(dataRowObj);
		}
		else if(newGridData[key].RowModified) {
			var dataRowObj = {};
			var apiKeyObj = {};
			
			apiKeyObj.Method_GUID	= newGridData[key].Method_GUID;
			dataRowObj.APIKEY		= apiKeyObj;
			
			apiKeyObj.MineProcess_GUID	= newGridData[key].MineProcess_GUID;
			dataRowObj.Method_Name		= newGridData[key].Method_Name;
			dataRowObj.DisplayName		= newGridData[key].DisplayName;
			dataRowObj.Modified			= moment().format("YYYY-MM-DDTHH:mm:ss.000z");
			
			updatedMethodsArray.push(dataRowObj);
		}
	}
		
	savedStateG1 = $("#jqxgrid").jqxGrid('savestate');
	savedStateG2 = $("#jqxgrid2").jqxGrid('savestate');

	InsertIntoMethodTable();
}

function InsertIntoMethodTable() {
	if(createdMethodsArray.length > 0) {
		var jsonData = {
			 "fields": createdMethodsArray
		};
		
		jQuery.ajax ({
			headers: {
				"Content-Type": "application/json"
			},
			url: ruIP + ruPort + planningDB + planningEN + "create/bulk/cfg/Method",
			type: "POST",
			data: JSON.stringify(jsonData),
			success: function(){
				UpdateMethodTable(true);
			},
			error: function(){
				DisplayAlert(languagePack.message.error,languagePack.message.recordsNotStored);
			}
		});
	}
	else {
		UpdateMethodTable(false);		
	}
}

function UpdateMethodTable(create) {
	if(updatedMethodsArray.length > 0) {
		var jsonData = {
			 "fields": updatedMethodsArray
		};

		jQuery.ajax ({
			headers: {
				"Content-Type": "application/json"
			},
			url: ruIP + ruPort + planningDB + planningEN + "update/bulk/cfg/Method",
			type: "POST",
			data: JSON.stringify(jsonData),
			success: function(){
				LoadLists();
				DisplayAlert(languagePack.message.success, languagePack.message.recordsUpdated);
			},
			error: function(){
				DisplayAlert(languagePack.message.error, languagePack.message.recordsNotUpdated);
			}
		});
	}
	else {
		if(create) {
			DisplayAlert(languagePack.message.success, languagePack.message.recordsStored);			
		}
		LoadLists();
	}
}

function RemoveMethodRow(rowObj, rowIndex) {
	if(rowObj.Method_GUID != -1) {
	
		var jsonData = {
			 "key": { "Method_GUID": rowObj.Method_GUID },
			 "fields": { "IsActive": false, "Modified": moment().format("YYYY-MM-DDTHH:mm:ss.000z") }
		};
		
		jQuery.ajax ({
			headers: {
				"Content-Type": "application/json"
			},
			url: ruIP + ruPort + planningDB + planningEN + "update/cfg/Method",
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

function ExportGridData() {
	var gridRowArray = $("#jqxgrid").jqxGrid('getrows');
	
	var newArray = [];
	
	for(var key in gridRowArray) {
		var newObj = {};

		newObj.Method_GUID   	= gridRowArray[key].Method_GUID;
		newObj.MineProcess_GUID = gridRowArray[key].MineProcess_GUID;
		newObj.Method_Name    	= gridRowArray[key].MethodDisplayName;
		newObj.DisplayName 		= gridRowArray[key].MethodDisplayName;
		
		if(gridRowArray[key].RowModified) {
			newObj.RowModified = gridRowArray[key].RowModified;
		}
		
		newArray.push(newObj);
	}
	
	return newArray;
}