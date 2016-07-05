/*============================================================
	Property of:		MISOM TECHNOLOGIES
	Developer:			AARON MCCOLOUGH
	Application Name:	FARA_FRESNILLO
	Directory:			FARA_FRESNILLO/CONFIG/JS
	File Name:			validations.js
=============================================================*/
var personData;

$.getJSON(ruIP + ruPort + planningDB + planningEN + "read/cfg/Person?where=\"SiteGUID = '" + UserData[0].SiteGUID + "'\"", function( data ) {
    personData = data;
});

function ValidateRecord(rowObject) {
    var tempRoleGUID = rowObject.RoleGUID;
    var tempAreaGUID = rowObject.Area_GUID;
    var valid = true;

    for (var key in personData) {
        if (!tempRoleGUID || tempRoleGUID == "" || tempRoleGUID == " ") {
            errorMessage = languagePack.users.invalidRole;
            DisplayAlert(languagePack.message.error, errorMessage);

            valid = false;
        }
        if (!tempAreaGUID || tempAreaGUID == "" || tempAreaGUID == " ") {
            errorMessage = "Usted debe de seleccionar un Área";
            DisplayAlert(languagePack.message.error, errorMessage);

            valid = false;
        }
        if (rowObject.IsUser == "true") {
            errorMessage = "El usuario ya existe para este empleado";
            DisplayAlert(languagePack.message.error, errorMessage);

            valid = false;
        }
    }
    return valid;
}