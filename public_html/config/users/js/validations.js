/*============================================================
	Property of:		MISOM TECHNOLOGIES
	Developer:			AARON MCCOLOUGH
	Application Name:	FARA_FRESNILLO
	Directory:			FARA_FRESNILLO/CONFIG/JS
	File Name:			validations.js
=============================================================*/

var personData;

var jqxhrPerson = $.getJSON(ruIP + ruPort + listsDB + listEN + "read/cfg/Person?where=\"SiteGUID = '"+ UserData[0].SiteGUID +"'\"", function() {	
	personData = jQuery.parseJSON(jqxhrPerson.responseText);
});

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