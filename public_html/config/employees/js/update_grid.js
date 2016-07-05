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

function ConvertUser(rowObj) {

    if(ValidateRecord(rowObj)) {
        var newObj	= {};
        var newObj2	= {};
		
        newObj.PersonGUID			= rowObj.Employee_GUID;
        newObj.SiteGUID				= UserData[0].SiteGUID;
        newObj.RoleGUID				= rowObj.RoleGUID;
        newObj.Firstname			= rowObj.FirstName;
        newObj.MiddleName			= rowObj.MiddleName;
        newObj.LastName				= rowObj.LastName;
        newObj.DisplayName			= rowObj.EmployeeName;
        newObj.Email				= (rowObj.FirstName).replace(/\s/g, '') + "_" + (rowObj.MiddleName).replace(/\s/g, '');
        newObj.AppUserName			= (rowObj.FirstName).replace(/\s/g, '') + "_" + (rowObj.MiddleName).replace(/\s/g, '');
        newObj.AppPassword			= GeneratePassword();
        newObj.WebUser				= rowObj.WebUser;
        newObj.iOSUser				= rowObj.iOSUser;
        newObj.IsLDAPUser			= 0;
        newObj.IsLicenseAccepted	= 0;
        newObj.IsActive				= 1;
        newObj.Created				= moment().format("YYYY-MM-DDTHH:mm:ss.000z");
        newObj.Modified				= moment().format("YYYY-MM-DDTHH:mm:ss.000z");

        newObj2.PersonArea_GUID		= CreateGUID();
        newObj2.PersonGUID			= rowObj.Employee_GUID;
        newObj2.Area_GUID			= rowObj.Area_GUID;
        newObj2.IsActive			= 1;
        newObj2.Created				= moment().format("YYYY-MM-DDTHH:mm:ss.000z");
        newObj2.Modified			= moment().format("YYYY-MM-DDTHH:mm:ss.000z");

        var jsonData	= { "fields": newObj };
        var jsonData2	= { "fields": newObj2 };

		$.ajax({
			headers: {
				"Content-Type": "application/json"
			},
			url: ruIP + ruPort + planningDB + planningEN + 'create/cfg/Person_Area',
			type: "POST",
			data: JSON.stringify(jsonData2),
			success: function() {
				
				$.ajax({
					headers: {
						"Content-Type": "application/json"
					},
					url: ruIP + ruPort + listsDB + listEN + 'create/cfg/Person',
					type: "POST",
					data: JSON.stringify(jsonData),
					success: function() {
						DisplayAlert(languagePack.message.success, "Usuario creado para " + rowObj.EmployeeName);
						LoadSelects();
					},
					error: function() {
						DisplayAlert(languagePack.message.error, languagePack.message.recordsNotStored);
					}
				});
			}
		});
    }
}

function UpdateGrid() {
	$("#jqxgrid").jqxGrid('endrowedit', 0, false);
	var newGridData = ExportGridData();
	
	if(recordsValid) {

		createdRowArray = [];
		updatedRowArray = [];
		
		for(var key in newGridData) {
			if(newGridData[key].Employee_GUID == -1) {
				delete newGridData[key].Employee_GUID;
				newGridData[key].Created			= moment().format("YYYY-MM-DDTHH:mm:ss.000z");
				newGridData[key].Modified			= moment().format("YYYY-MM-DDTHH:mm:ss.000z");
				createdRowArray.push(newGridData[key]);
			}
			else {
				var Employee_GUID		= newGridData[key].Employee_GUID;
				var apiKeyObj			= {};
				apiKeyObj.Employee_GUID	= Employee_GUID;
				delete newGridData[key].Employee_GUID;
				newGridData[key].Modified	= moment().format("YYYY-MM-DDTHH:mm:ss.000z");
				newGridData[key].APIKEY		= apiKeyObj;
				updatedRowArray.push(newGridData[key]);
			}
		}
		
		savedStateG1 = $("#jqxgrid").jqxGrid('savestate');
		InsertEmployeesTable();
	}
	else {
		DisplayAlert(languagePack.message.error,errorMessage);
	}
}

function InsertEmployeesTable() {
	if(createdRowArray.length > 0) {
		var jsonData1 = {
			 "fields": createdRowArray
		};
		
		$.ajax ({
			headers: {
				"Content-Type": "application/json"
			},
			url: ruIP + ruPort + planningDB + planningEN + 'create/bulk/ext/Employee',
			type: "POST",
			data: JSON.stringify(jsonData1),
			success: function(){
				UpdateEmployeesTable(true);
			},
			error: function(){
				DisplayAlert(languagePack.message.error,languagePack.message.recordsNotStored);
			}
		});
	}
	else {
		UpdateEmployeesTable(false);
	}
}

function UpdateEmployeesTable(created) {
	if(updatedRowArray.length > 0) {
		var jsonData2 = {
			 "fields": updatedRowArray
		};
		
		$.ajax ({
			headers: {
				"Content-Type": "application/json"
			},
			url: ruIP + ruPort + planningDB + planningEN + 'update/bulk/ext/Employee',
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
		newObj.Employee_GUID	= gridRowArray[key].Employee_GUID;
		newObj.CorporateEmpId	= gridRowArray[key].CorporateEmpId;
		newObj.EmployeeName		= gridRowArray[key].EmployeeName;
		newObj.FirstName		= gridRowArray[key].FirstName;
		newObj.MiddleName		= gridRowArray[key].MiddleName;
		newObj.LastName			= gridRowArray[key].LastName;
		newObj.Department		= gridRowArray[key].Department;
		newObj.Crew				= gridRowArray[key].Crew;
		newObj.EmployeePosition	= gridRowArray[key].EmployeePosition;
		newObj.IsActive			= true;
		
		recordsValid = true;//ValidateRecord(newObj);
		
		if(!recordsValid) {
			break;
		}
		
		newArray.push(newObj);
	}
	
	return newArray;
}

function ValidateRecord(rowObject) {
	var tempEmail		= rowObject.Email;
	var tempPersonGUID	= rowObject.PersonGUID;
	var tempSiteGUID	= rowObject.SiteGUID;
	var tempDisplayName	= rowObject.DisplayName;
	var valid			= true;

	for(var key in personData) {
		if(tempEmail == personData[key].Email && tempPersonGUID != personData[key].PersonGUID) {
			errorMessage = languagePack.users.emailInUse + " (regarding - " + tempDisplayName + ")";
			valid = false;
		}
		if(!tempSiteGUID || tempSiteGUID == "" || tempSiteGUID == " ") {
			errorMessage = languagePack.users.invalidSite + " (regarding - " + tempDisplayName + ")";
			valid = false;			
		}
		if(!tempEmail || tempEmail == "" || tempEmail == " ") {
			errorMessage = languagePack.users.invalidEmail + " (regarding - " + tempDisplayName + ")";
			valid = false;
		}
	}
	return valid;
}

function GeneratePassword() {
    var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    var string_length = 24;
    var randomString = '';

    for (var i = 0; i < string_length; i++) {
        var rnum = Math.floor(Math.random() * chars.length);
        randomString += chars.substring(rnum, rnum + 1);
    }
    return randomString;
}