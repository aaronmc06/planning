/*============================================================
	Property of:		MISOM TECHNOLOGIES
	Developer:			AARON MCCOLOUGH FT. JORGE MURILLO
	Application Name:	FARA_FRESNILLO
	Directory:			FARA_FRESNILLO/MAINT/LOCATIONS/JS
	File Name:			update_grid2.js
=============================================================*/

var createdDownCodeArray	= [];
var updatedDownCodeArray	= [];
var updateMachineStatus		= [];

function UpdateDownCodeGrid() {
	createdDownCodeArray	= [];
	updatedDownCodeArray	= [];
	updateMachineStatus		= [];
	
	$("#jqxgrid").jqxGrid('endrowedit', 0, false);
	var newGridData = ExportGridDownCodeData();
	
	if(ValidateDownCodeRecords(newGridData)) {
		for(var key in newGridData) {
			if(newGridData[key].RowModified) {
				var dataRowObj	= {};
				var apiKeyObj	= {};
				
				apiKeyObj.MachineDownEvent_GUID	= newGridData[key].MachineDownEvent_GUID;
				dataRowObj.APIKEY				= apiKeyObj;
				
				dataRowObj.IsCompleted	= true;
				dataRowObj.IsActive		= false;
				dataRowObj.Modified		= moment().format("YYYY-MM-DDTHH:mm:ss.000z");
				
				updatedDownCodeArray.push(dataRowObj);
				
				var dataRowObj2 = {};
				
				dataRowObj2.MachineDownEvent_GUID	= CreateGUID();
				dataRowObj2.Lineup_GUID				= newGridData[key].Lineup_GUID;
				dataRowObj2.ShiftDate       		= newGridData[key].ShiftDate;
				dataRowObj2.Shift       			= newGridData[key].Shift;
				dataRowObj2.Location_GUID        	= newGridData[key].Location_GUID;
				dataRowObj2.Operator_GUID      		= newGridData[key].Operator_GUID;
				dataRowObj2.Machine_GUID        	= newGridData[key].Machine_GUID;
				dataRowObj2.DownReasonCode_GUID		= newGridData[key].DownReasonCode_GUID;
				dataRowObj2.DownStartTime     		= newGridData[key].DownStartTime;
				dataRowObj2.MaintenanceArrivalTime 	= newGridData[key].MaintenanceArrivalTime;
				dataRowObj2.DownFinishTime    		= newGridData[key].DownFinishTime;
				dataRowObj2.Comment     			= newGridData[key].Comment;
				dataRowObj2.IsCompleted          	= newGridData[key].IsCompleted;
				dataRowObj2.CreatedBy          		= newGridData[key].CreatedBy;
				
				dataRowObj2.IsActive	= 1;
				dataRowObj2.Created		= moment().format("YYYY-MM-DDTHH:mm:ss.000z");
				dataRowObj2.Modified	= moment().format("YYYY-MM-DDTHH:mm:ss.000z");
				
				createdDownCodeArray.push(dataRowObj2);
				
				var dataRowObj3	= {};
				var apiKeyObj2	= {};

				apiKeyObj2.Machine_GUID		= newGridData[key].MachineDownEvent_GUID;
				dataRowObj3.APIKEY			= apiKeyObj2;
				dataRowObj3.MachineStatus	= newGridData[key].MachineStatus.toUpperCase();
				dataRowObj3.Modified		= moment().format("YYYY-MM-DDTHH:mm:ss.000z");
				
				updateMachineStatus.push(dataRowObj3);
			}
		}
		
		savedStateG1 = $("#jqxgrid").jqxGrid('savestate');	
		
		UpdateMachineTable();
	}
}

function UpdateMachineTable() {
	if(updateMachineStatus.length > 0) {
		var jsonData = {
			 "fields": updateMachineStatus
		};

		jQuery.ajax ({
			headers: {
				"Content-Type": "application/json"
			},
			url: ruIP + ruPort + planningDB + planningEN + "update/bulk/eqmt/tot_Machine",
			type: "POST",
			data: JSON.stringify(jsonData),
			success: function(){
				InsertIntoDownCodeTable();
			},
			error: function(){
				DisplayAlert(languagePack.message.error,languagePack.message.recordsNotStored);
			}
		});		
	}
	else {
		InsertIntoDownCodeTable();		
	}
}

function InsertIntoDownCodeTable() {
	if(createdDownCodeArray.length > 0) {
		var jsonData = {
			 "fields": createdDownCodeArray
		};

		jQuery.ajax ({
			headers: {
				"Content-Type": "application/json"
			},
			url: ruIP + ruPort + planningDB + planningEN + "create/bulk/trans/MachineDownEvent",
			type: "POST",
			data: JSON.stringify(jsonData),
			success: function(){
				UpdateDownCodeTable(true);
			},
			error: function(){
				DisplayAlert(languagePack.message.error,languagePack.message.recordsNotStored);
			}
		});
	}
	else {
		UpdateDownCodeTable(false);		
	}
}

function UpdateDownCodeTable(created) {
	if(updatedDownCodeArray.length > 0) {
		var jsonData = {
			 "fields": updatedDownCodeArray
		};
		
		jQuery.ajax ({
			headers: {
				"Content-Type": "application/json"
			},
			url: ruIP + ruPort + planningDB + planningEN + "update/bulk/trans/MachineDownEvent",
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

function RemoveDownCodeRow(rowObj, rowIndex) {
	if(rowObj.MachineDownEvent_GUID != -1) {
	
		var jsonData = {
			 "key": { "MachineDownEvent_GUID": rowObj.MachineDownEvent_GUID },
			 "fields": { "IsActive": false, "Modified": moment().format("YYYY-MM-DDTHH:mm:ss.000z") }
		};
		
		jQuery.ajax ({
			headers: {
				"Content-Type": "application/json"
			},
			url: ruIP + ruPort + planningDB + planningEN + "update/trans/MachineDownEvent",
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

function ExportGridDownCodeData() {
	var gridRowArray = $("#jqxgrid").jqxGrid('getrows');
	var newArray = [];
	
	for(var key in gridRowArray) {
		var newObj = {};
		
		if((gridRowArray[key].RowModified == true) || (gridRowArray[key].MachineDownEvent_GUID == -1)){
			newObj.MachineDownEvent_GUID	= gridRowArray[key].MachineDownEvent_GUID;
			newObj.Lineup_GUID          	= gridRowArray[key].Lineup_GUID;
			newObj.ShiftDate       			= gridRowArray[key].ShiftDate;
			newObj.Shift       				= gridRowArray[key].Shift;
			newObj.Location_GUID        	= gridRowArray[key].Location_GUID;
			newObj.Operator_GUID      		= gridRowArray[key].Operator_GUID;
			newObj.Machine_GUID				= gridRowArray[key].Machine_GUID;
			newObj.MachineStatus			= gridRowArray[key].MachineStatus;
			newObj.DownReasonCode_GUID		= gridRowArray[key].DownReasonCode_GUID;
			newObj.DownStartTime   			= gridRowArray[key].DownStartTime;
			newObj.MaintenanceArrivalTime	= gridRowArray[key].MaintenanceArrivalTime;
			newObj.DownFinishTime 			= gridRowArray[key].DownFinishTime;
			newObj.Comment    				= gridRowArray[key].Comment;
			newObj.IsCompleted          	= gridRowArray[key].IsCompleted;
			newObj.CreatedBy         		= gridRowArray[key].CreatedBy;
			
			if(gridRowArray[key].RowModified) {
				newObj.RowModified = gridRowArray[key].RowModified;
			}
			
			newArray.push(newObj);
		}
	}
	
	return newArray;
}