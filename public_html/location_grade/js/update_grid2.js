/*============================================================
	Property of:		MISOM TECHNOLOGIES
	Developer:			AARON MCCOLOUGH FT. JORGE MURILLO
	Application Name:	FARA_FRESNILLO
	Directory:			FARA_FRESNILLO/LOCATION_GRADE/JS
	File Name:			update_grid2.js
=============================================================*/

var createdLocationGradeArray = [];
var updatedLocationGradeArray = [];

function UpdateLocationGradeGrid() {
	
	createdLocationGradeArray = [];
	updatedLocationGradeArray = [];
	
	$("#jqxgrid").jqxGrid('endrowedit', 0, false);
	var newGridData = ExportGridLocationGradeData();
	
	if(ValidateLocationGradeRecords(newGridData)) {
		for(var key in newGridData) {
			if(newGridData[key].LocationGrade_GUID == -1) {
				var dataRowObj = {};
				
				dataRowObj.LocationGrade_GUID	= CreateGUID();
				dataRowObj.Location_GUID		= newGridData[key].Location_GUID;
				dataRowObj.Meters_Advanced		= newGridData[key].Meters_Advanced;
				dataRowObj.Mined_Width			= newGridData[key].Mined_Width;
				dataRowObj.Vein_Width			= newGridData[key].Vein_Width;
				dataRowObj.SilverGrade			= newGridData[key].SilverGrade;
				dataRowObj.GoldGrade			= newGridData[key].GoldGrade;
				dataRowObj.LeadGrade			= newGridData[key].LeadGrade;
				dataRowObj.ZincGrade			= newGridData[key].ZincGrade;
				dataRowObj.DateEffective		= newGridData[key].DateEffective;
				dataRowObj.Created				= moment(new Date()).format("YYYY-MM-DDTHH:mm:ss.000z");
				dataRowObj.IsActive				= 1;
				
				createdLocationGradeArray.push(dataRowObj);
			}
			if(newGridData[key].RowModified) {
				var dataRowObj	= {};
				var apiKeyObj	= {};
				
				apiKeyObj.LocationGrade_GUID	= newGridData[key].LocationGrade_GUID;
				dataRowObj.APIKEY				= apiKeyObj;
				
				dataRowObj.Location_GUID	= newGridData[key].Location_GUID;
				dataRowObj.Meters_Advanced	= newGridData[key].Meters_Advanced;
				dataRowObj.Mined_Width		= newGridData[key].Mined_Width;
				dataRowObj.Vein_Width		= newGridData[key].Vein_Width;
				dataRowObj.SilverGrade		= newGridData[key].SilverGrade;
				dataRowObj.GoldGrade		= newGridData[key].GoldGrade;
				dataRowObj.LeadGrade		= newGridData[key].LeadGrade;
				dataRowObj.ZincGrade		= newGridData[key].ZincGrade;
				dataRowObj.DateEffective	= newGridData[key].DateEffective;
				dataRowObj.Modified			= moment(new Date()).format("YYYY-MM-DDTHH:mm:ss.000z");
				
				updatedLocationGradeArray.push(dataRowObj);
			}
		}
		
		savedStateG1 = $("#jqxgrid").jqxGrid('savestate');	
		
		InsertIntoLocationGradeTable();
	}
}

function InsertIntoLocationGradeTable() {
	if(createdLocationGradeArray.length > 0) {
		var jsonData = {
			 "fields": createdLocationGradeArray
		};
		
		jQuery.ajax ({
			headers: {
				"Content-Type": "application/json"
			},
			url: ruIP + ruPort + planningDB + planningEN + "create/bulk/geo/Location_Grade",
			type: "POST",
			data: JSON.stringify(jsonData),
			success: function(){
				UpdateLocationGradeTable(true);
			},
			error: function(){
				DisplayAlert(languagePack.message.error,languagePack.message.recordsNotStored);
			}
		});
	}
	else {
		UpdateLocationGradeTable(false);
	}
}

function UpdateLocationGradeTable(created) {
	if(updatedLocationGradeArray.length > 0) {
		var jsonData = {
			 "fields": updatedLocationGradeArray
		};
		
		jQuery.ajax ({
			headers: {
				"Content-Type": "application/json"
			},
			url: ruIP + ruPort + planningDB + planningEN + "update/bulk/geo/Location_Grade",
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

function RemoveLocationGradeRow(rowObj, rowIndex) {
	if(rowObj.LocationGrade_GUID != -1) {
	
		var jsonData = {
			 "key": { "LocationGrade_GUID": rowObj.LocationGrade_GUID },
			 "fields": { "IsActive": false, "Obsolete": moment(new Date()).format("YYYY-MM-DDTHH:mm:ss.000z"), "Modified": moment(new Date()).format("YYYY-MM-DDTHH:mm:ss.000z") }
		};
		
		jQuery.ajax ({
			headers: {
				"Content-Type": "application/json"
			},
			url: ruIP + ruPort + planningDB + planningEN + "update/geo/Location_Grade",
			type: "POST",
			data: JSON.stringify(jsonData),
			success: function(){
				DisplayAlert(languagePack.message.success,languagePack.message.recordsDeleted);
				$('#jqxgrid').jqxGrid('deleterow', rowIndex);
			}
		});
	}
	else {
		$('#jqxgrid').jqxGrid('deleterow', rowIndex);
	}
}

function ExportGridLocationGradeData() {
	var gridRowArray = $("#jqxgrid").jqxGrid('getrows');
	
	var newArray = [];
	
	for(var key in gridRowArray) {
		var newObj = {};

		newObj.LocationGrade_GUID	= gridRowArray[key].LocationGrade_GUID;
		newObj.Location_GUID		= gridRowArray[key].Location_GUID;
		newObj.Meters_Advanced		= gridRowArray[key].Meters_Advanced;
		newObj.Mined_Width			= gridRowArray[key].Mined_Width;
		newObj.Vein_Width			= gridRowArray[key].Vein_Width;
		newObj.SilverGrade			= gridRowArray[key].SilverGrade;
		newObj.GoldGrade			= gridRowArray[key].GoldGrade;
		newObj.LeadGrade			= gridRowArray[key].LeadGrade;
		newObj.ZincGrade			= gridRowArray[key].ZincGrade;
		newObj.DateEffective		= gridRowArray[key].DateEffective;
		
		if(gridRowArray[key].RowModified) {
			newObj.RowModified = gridRowArray[key].RowModified;
		}
		
		newArray.push(newObj);
	}
	return newArray;
}









