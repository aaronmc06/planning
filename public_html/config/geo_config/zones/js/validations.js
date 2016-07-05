/*============================================================
	Property of:		MISOM TECHNOLOGIES
	Developer:			AARON MCCOLOUGH
	Application Name:	FARA_FRESNILLO
	Directory:			FARA_FRESNILLO/CONFIG/GEO_CONFIG/ZONES/JS
	File Name:			validations.js
=============================================================*/

function ValidateZoneRecords(data) {
	for(var key in data) {
		if(data[key].ZoneName == null || data[key].ZoneName.trim() == '') {
			DisplayAlert(languagePack.message.error,languagePack.zones.invalidZone);
			return false;
		}
		if(data[key].DisplayName == null || data[key].DisplayName.trim() == '') {
			DisplayAlert(languagePack.message.error,languagePack.zones.invalidDisplayName);
			return false;
		}
		if(data[key].Area_GUID == null) {
			DisplayAlert(languagePack.message.error,languagePack.zones.invalidArea);
			return false;
		}
	}
	return true;
}

function ValidateLocationRecords(data) {
	for(var key in data) {
		if(data[key].Location_GUID == null) {
			DisplayAlert(languagePack.message.error,languagePack.zones.invalidLocation);
			return false;
		}
	}
	return true;
}