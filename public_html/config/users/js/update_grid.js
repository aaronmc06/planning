/*============================================================
	Property of:		MISOM TECHNOLOGIES
	Developer:			AARON MCCOLOUGH
	Application Name:	FARA_FRESNILLO
	Directory:			FARA_FRESNILLO/CONFIG/JS
	File Name:			update_grid.js
=============================================================*/

var createdRowArray = [];
var updatedRowArray = [];
var errorMessage    = "";
var recordsValid    = true;
		
var newRow = {};

function AddNewUserRow() {
	newRow = {};
	newRow.PersonGUID      = -1;
	newRow.AppPassword     = GeneratePassword();
	newRow.SiteGUID        = UserData[0].SiteGUID;
	newRow.SiteDisplayName = UserData[0].SiteDisplayName;
	newRow.IsActive        = true;
	$("#jqxgrid").jqxGrid('addrow', null, newRow);
	$('#jqxgrid').jqxGrid('ensurerowvisible', $('#jqxgrid').jqxGrid('getrows').length - 1);
}

function UpdateGrid() {
	$("#jqxgrid").jqxGrid('endrowedit', 0, false);
	var newGridData = ExportGridData();
	
	if(recordsValid) {

		createdRowArray = [];
		updatedRowArray = [];
		
		for(var key in newGridData) {
			if(newGridData[key].PersonGUID == -1) {
				delete newGridData[key].PersonGUID;
				newGridData[key].Created			= moment().format("YYYY-MM-DDTHH:mm:ss.000z");
				newGridData[key].Modified			= moment().format("YYYY-MM-DDTHH:mm:ss.000z");
				newGridData[key].IsLicenseAccepted	= 0;
				createdRowArray.push(newGridData[key]);
			}
			else {
				var PersonGUID				= newGridData[key].PersonGUID;
				var apiKeyObj				= {};
				apiKeyObj.PersonGUID		= PersonGUID;
				delete newGridData[key].PersonGUID;
				newGridData[key].Modified	= moment().format("YYYY-MM-DDTHH:mm:ss.000z");
				newGridData[key].APIKEY		= apiKeyObj;
				updatedRowArray.push(newGridData[key]);
			}
		}
		
		savedStateG1 = $("#jqxgrid").jqxGrid('savestate');
		InsertUsersTable();
	}
	else {
		DisplayAlert(languagePack.message.error,errorMessage);
	}
}

function InsertUsersTable() {
	if(createdRowArray.length > 0) {
		var jsonData1 = {
			 "fields": createdRowArray
		};
		
		$.ajax ({
			headers: {
				"Content-Type": "application/json"
			},
			url: ruIP + ruPort + listsDB + listEN + 'create/bulk/cfg/Person',
			type: "POST",
			data: JSON.stringify(jsonData1),
			success: function(){
				UpdateUsersTable(true);
			},
			error: function(){
				DisplayAlert(languagePack.message.error,languagePack.message.recordsNotStored);
			}
		});
	}
	else {
		UpdateUsersTable(false);
	}
}

function UpdateUsersTable(created) {
	if(updatedRowArray.length > 0) {
		var jsonData2 = {
			 "fields": updatedRowArray
		};
		
		$.ajax ({
			headers: {
				"Content-Type": "application/json"
			},
			url: ruIP + ruPort + listsDB + listEN + 'update/bulk/cfg/Person',
			type: "POST",
			data: JSON.stringify(jsonData2),
			success: function(){
				DisplayAlert(languagePack.message.success,languagePack.message.recordsUpdated);
				LoadSelects();
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
		LoadSelects();
	}
}

function ExportGridData() {
	var gridRowArray = $("#jqxgrid").jqxGrid('getrows');
	
	var newArray = [];
	
	for(var key in gridRowArray) {
		var newObj = {};
		newObj.PersonGUID  = gridRowArray[key].PersonGUID;
		newObj.SiteGUID    = gridRowArray[key].SiteGUID;
		newObj.RoleGUID    = gridRowArray[key].RoleGUID;
		newObj.Created     = gridRowArray[key].Created;
		newObj.Modified    = gridRowArray[key].Modified;
		newObj.Firstname   = gridRowArray[key].Firstname;
		newObj.MiddleName  = gridRowArray[key].MiddleName;
		newObj.LastName    = gridRowArray[key].LastName;
		newObj.DisplayName = gridRowArray[key].DisplayName;
		newObj.Email       = gridRowArray[key].Email;
		newObj.AppUserName = gridRowArray[key].AppUserName;
		newObj.AppPassword = gridRowArray[key].AppPassword;
		newObj.IsActive    = gridRowArray[key].IsActive;
		
		recordsValid = ValidateRecord(newObj);
		
		if(!recordsValid) {
			break;
		}
		
		newArray.push(newObj);
	}
	
	for(var key1 in gridRowArray) {
		for(var key2 in gridRowArray) {
			if(key1 != key2) {
				if(gridRowArray[key1].Email == gridRowArray[key2].Email) {
					recordsValid = false;
					errorMessage = languagePack.users.invalidEmail;
				}
			}			
		}
		
	}
	
	return newArray;
}

function ResetPassword(rowObj) {

	var jsonData3 = {
		 "key": { "PersonGUID": rowObj.PersonGUID },
		 "fields": { "AppPassword": GeneratePassword(), "Modified": moment().format("YYYY-MM-DDTHH:mm:ss.000z") }
	};
	
	$.ajax ({
		headers: {
			"Content-Type": "application/json"
		},
		url: ruIP + ruPort + listsDB + listEN + 'update/cfg/Person',
		type: "POST",
		data: JSON.stringify(jsonData3),
		success: function(){
		}
	});
}

function GeneratePassword() {
	var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
	var string_length = 24;
	var randomString = '';
	
	for(var i = 0; i < string_length; i++) {
		var rnum = Math.floor(Math.random() * chars.length);
		randomString += chars.substring(rnum, rnum+1);
	}
	//return randomString;
	return "Password@1";
}