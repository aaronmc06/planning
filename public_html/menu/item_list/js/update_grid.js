/*============================================================
	Property of:		MISOM TECHNOLOGIES
	Developer:			AARON MCCOLOUGH
	Application Name:	FARA_FRESNILLO
	Directory:			FARA_FRESNILLO/MENU/ITEM_LIST/JS
	File Name:			update_grid.js
=============================================================*/

var createdMenuItemsArray = [];
var updatedMenuItemsArray = [];

function UpdateItemListGrid() {
	createdMenuItemsArray = [];
	updatedMenuItemsArray = [];
	
	$("#jqxgrid").jqxGrid('endrowedit', 0, false);
	var newGridData = ExportGridMeasureData();
	
	if(ValidateItemListRecords(newGridData)) {
		for(var key in newGridData) {
			if(newGridData[key].MenuItemGUID == -1) {
				var dataRowObj = {};
	
				dataRowObj.MenuItemGUID		= CreateGUID();
				dataRowObj.MenuGroupId		= newGridData[key].MenuGroupId;
				dataRowObj.MenuItemName		= newGridData[key].MenuItemName;
				dataRowObj.DisplayName		= newGridData[key].DisplayName;
				dataRowObj.SpanishName		= newGridData[key].SpanishName;
				dataRowObj.RoleGUID			= newGridData[key].RoleGUID;
				dataRowObj.Ordinal			= newGridData[key].Ordinal;
				dataRowObj.MenuItemURL		= newGridData[key].MenuItemURL;
				dataRowObj.ParentMenuItemId	= newGridData[key].ParentMenuItemId;
				dataRowObj.IsActive			= 1;
				
				createdMenuItemsArray.push(dataRowObj);
			}
			else if(newGridData[key].RowModified) {
				var dataRowObj = {};
				var apiKeyObj = {};
				
				apiKeyObj.MenuItemGUID = newGridData[key].MenuItemGUID;
				dataRowObj.APIKEY      = apiKeyObj;
				
				dataRowObj.MenuGroupId      = newGridData[key].MenuGroupId;
				dataRowObj.MenuItemName     = newGridData[key].MenuItemName;
				dataRowObj.DisplayName      = newGridData[key].DisplayName;
				dataRowObj.SpanishName      = newGridData[key].SpanishName;
				dataRowObj.RoleGUID         = newGridData[key].RoleGUID;
				dataRowObj.Ordinal          = newGridData[key].Ordinal;
				dataRowObj.MenuItemURL      = newGridData[key].MenuItemURL;
				dataRowObj.ParentMenuItemId = newGridData[key].ParentMenuItemId;
				
				updatedMenuItemsArray.push(dataRowObj);
			}
		}
		
		savedStateG1 = $("#jqxgrid").jqxGrid('savestate');
		InsertIntoMenuItemsTable();
	}
}

function InsertIntoMenuItemsTable() {
	if(createdMenuItemsArray.length > 0) {
		var jsonData = {
			 "fields": createdMenuItemsArray
		};
		
		jQuery.ajax ({
			headers: {
				"Content-Type": "application/json"
			},
			url: ruIP + ruPort + listsDB + listEN + "create/bulk/web/MenuItems",
			type: "POST",
			data: JSON.stringify(jsonData),
			success: function(){
				console.log("Success...");
				UpdateMenuItemsTable();
			},
			error: function(){
				DisplayAlert("Error!","Los registros no fueron creados.");
			}
		});
	}
	else {
		UpdateMenuItemsTable();
	}
}

function UpdateMenuItemsTable() {
	if(updatedMenuItemsArray.length > 0) {
		var jsonData = {
			 "fields": updatedMenuItemsArray
		};

		jQuery.ajax ({
			headers: {
				"Content-Type": "application/json"
			},
			url: ruIP + ruPort + listsDB + listEN + "update/bulk/web/MenuItems",
			type: "POST",
			data: JSON.stringify(jsonData),
			success: function(){
				LoadLists();
			},
			error: function(){
				DisplayAlert("Error!","Los registros no fueron actualizados.");
			}
		});
	}
	else {
		LoadLists();
	}
}

function RemoveItemListRow(rowObj, rowIndex) {
	if(rowObj.MenuItemGUID != -1) {
	
		var jsonData = {
			 "key": { "MenuItemGUID": rowObj.MenuItemGUID },
			 "fields": { "IsActive": false }
		};
		
		jQuery.ajax ({
			headers: {
				"Content-Type": "application/json"
			},
			url: ruIP + ruPort + listsDB + listEN + "update/web/MenuItems",
			type: "POST",
			data: JSON.stringify(jsonData),
			success: function(){
				$('#jqxgrid').jqxGrid('deleterow', rowIndex);
			}
		});
	}
	else {
		$('#jqxgrid').jqxGrid('deleterow', rowIndex);
	}
}

function ExportGridMeasureData() {
	var gridRowArray = $("#jqxgrid").jqxGrid('getrows');
	
	var newArray = [];
	
	for(var key in gridRowArray) {
		var newObj = {};

		newObj.MenuItemGUID     = gridRowArray[key].MenuItemGUID;
		newObj.MenuGroupId      = gridRowArray[key].MenuGroupId;
		newObj.MenuItemName     = gridRowArray[key].MenuItemName;
		newObj.DisplayName      = gridRowArray[key].DisplayName;
		newObj.SpanishName      = gridRowArray[key].SpanishName;
		newObj.RoleGUID         = gridRowArray[key].RoleGUID;
		newObj.ParentMenuItemId = gridRowArray[key].ParentMenuItemId;
		newObj.MenuItemURL      = gridRowArray[key].MenuItemURL;
		newObj.Ordinal          = gridRowArray[key].Ordinal;
		
		if(gridRowArray[key].RowModified) {
			newObj.RowModified = gridRowArray[key].RowModified;
		}
		
		newArray.push(newObj);
	}
	
	return newArray;
}