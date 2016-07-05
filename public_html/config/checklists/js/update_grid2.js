/*============================================================
	Property of:		MISOM TECHNOLOGIES
	Developer:			JORGE MURILLO & AARON MCCOLOUGH
	Application Name:	FARA_FRESNILLO
	Directory:			FARA_FRESNILLO/CONFIG/CHECKLISTS/JS
	File Name:			update_grid2.js
=============================================================*/

var createdQuestionsArray = [];
var updatedQuestionsArray = [];

function UpdateQuestionGrid() {
	createdQuestionsArray = [];
	updatedQuestionsArray = [];
	
	$("#jqxgrid2").jqxGrid('endrowedit', 0, false);
	var newGridData = ExportGridQuestionsData();
	
	if(ValidateQuestionsRecords(newGridData)) {
		for(var key in newGridData) {
			if(newGridData[key].ChecklistQuestion_GUID == -1) {
				var dataRowObj = {};
				
				dataRowObj.ChecklistType_GUID	= newGridData[key].ChecklistType_GUID;
				dataRowObj.Question_Name		= newGridData[key].Question_Name;
				dataRowObj.ChecklistGroup_GUID	= newGridData[key].ChecklistGroup_GUID;
				dataRowObj.MachineType_GUID		= newGridData[key].MachineType_GUID;
				dataRowObj.InputType_1			= newGridData[key].InputType_1;
				dataRowObj.InputType_2			= newGridData[key].InputType_2;
				dataRowObj.InputType_3			= newGridData[key].InputType_3;
				dataRowObj.IsCommentReqd		= newGridData[key].IsCommentReqd;
				dataRowObj.IsManadatory			= newGridData[key].IsManadatory;
				dataRowObj.IsActive				= 1;
				dataRowObj.Created				= moment().format("YYYY-MM-DDTHH:mm:ss.000z");
				dataRowObj.Modified				= moment().format("YYYY-MM-DDTHH:mm:ss.000z");

				createdQuestionsArray.push(dataRowObj);
			}
			if(newGridData[key].RowModified) {
				var dataRowObj	= {};
				var apiKeyObj	= {};
				
				apiKeyObj.ChecklistQuestion_GUID	= newGridData[key].ChecklistQuestion_GUID;
				dataRowObj.APIKEY					= apiKeyObj;
				
				dataRowObj.ChecklistType_GUID	= newGridData[key].ChecklistType_GUID;
				dataRowObj.Question_Name		= newGridData[key].Question_Name;
				dataRowObj.ChecklistGroup_GUID	= newGridData[key].ChecklistGroup_GUID;
				dataRowObj.MachineType_GUID		= newGridData[key].MachineType_GUID;
				dataRowObj.InputType_1			= newGridData[key].InputType_1;
				dataRowObj.InputType_2			= newGridData[key].InputType_2;
				dataRowObj.InputType_3			= newGridData[key].InputType_3;
				dataRowObj.IsCommentReqd		= newGridData[key].IsCommentReqd;
				dataRowObj.IsManadatory			= newGridData[key].IsManadatory;
				dataRowObj.Modified				= moment().format("YYYY-MM-DDTHH:mm:ss.000z");
				
				updatedQuestionsArray.push(dataRowObj);
			}
		}
		
		savedStateG1 = $("#jqxgrid").jqxGrid('savestate');
		savedStateG2 = $("#jqxgrid2").jqxGrid('savestate');
		
		InsertIntoQuestionTable();
	}
}

function InsertIntoQuestionTable() {
	if(createdQuestionsArray.length > 0) {
		var jsonData = {
			 "fields": createdQuestionsArray
		};
		jQuery.ajax ({
			headers: {
				"Content-Type": "application/json"
			},
			url: ruIP + ruPort + planningDB + planningEN + "create/bulk/cfg/checklistQuestion",
			type: "POST",
			data: JSON.stringify(jsonData),
			success: function(){
				UpdateQuestionTable(true);
			},
			error: function(){
				DisplayAlert(languagePack.message.error,languagePack.message.recordsNotStored);
			}
		});
	}
	else {
		UpdateQuestionTable(false);		
	}
}

function UpdateQuestionTable(created) {
	if(updatedQuestionsArray.length > 0) {
		var jsonData = {
			 "fields": updatedQuestionsArray
		};

		jQuery.ajax ({
			headers: {
				"Content-Type": "application/json"
			},
			url: ruIP + ruPort + planningDB + planningEN + "update/bulk/cfg/checklistQuestion",
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

function RemoveQuestionRow(rowObj, rowIndex) {
	if(rowObj.ChecklistQuestion_GUID != -1) {
	
		var jsonData = {
			 "key": { "ChecklistQuestion_GUID": rowObj.ChecklistQuestion_GUID },
			 "fields": { "IsActive": false, "Modified": moment().format("YYYY-MM-DDTHH:mm:ss.000z") }
		};
		
		jQuery.ajax ({
			headers: {
				"Content-Type": "application/json"
			},
			url: ruIP + ruPort + planningDB + planningEN + "update/cfg/checklistQuestion",
			type: "POST",
			data: JSON.stringify(jsonData),
			success: function(){
				DisplayAlert(languagePack.message.success,languagePack.message.recordDeleted);
				$('#jqxgrid2').jqxGrid('deleterow', rowIndex);
			}
		});
	}
	else {
		$('#jqxgrid2').jqxGrid('deleterow', rowIndex);
	}
}

function ExportGridQuestionsData() {
	var gridRowArray = $("#jqxgrid2").jqxGrid('getrows');
	
	var newArray = [];
	
	for(var key in gridRowArray) {
		var newObj = {};
		
		newObj.ChecklistType_GUID     = gridRowArray[key].ChecklistType_GUID;
		newObj.ChecklistQuestion_GUID = gridRowArray[key].ChecklistQuestion_GUID;
		newObj.Question_Name          = gridRowArray[key].Question_Name;
		newObj.ChecklistGroup_GUID    = gridRowArray[key].ChecklistGroup_GUID;
		newObj.MachineType_GUID       = gridRowArray[key].MachineType_GUID;
		newObj.InputType_1            = gridRowArray[key].InputType_1;
		newObj.InputType_2            = gridRowArray[key].InputType_2;
		newObj.InputType_3            = gridRowArray[key].InputType_3;
		newObj.IsCommentReqd 		  = gridRowArray[key].IsCommentReqd;
		newObj.IsManadatory           = gridRowArray[key].IsManadatory;
		
		if(gridRowArray[key].RowModified) {
			newObj.RowModified = gridRowArray[key].RowModified;
		}		
		
		newArray.push(newObj);
	}
	
	return newArray;
}