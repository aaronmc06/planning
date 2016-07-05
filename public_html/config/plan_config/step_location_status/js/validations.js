/*============================================================
	Property of:		MISOM TECHNOLOGIES
	Developer:			AARON MCCOLOUGH FT. JORGE MURILLO
	Application Name:	FARA_FRESNILLO
	Directory:			FARA_FRESNILLO/CONFIG/PLAN_CONFIG/LOCATION_STATUSES/JS
	File Name:			validations.js
=============================================================*/

function ValidateStatusesRecords(data) {
	for(var key in data) {
		if(data[key].DisplayName == null || data[key].DisplayName.trim() == '') {
			DisplayAlert(languagePack.message.error,languagePack.stepLocationStatus.invalidDisplayName);
			return false;
		}
	}
	return true;
}

function ValidateActivitiesRecords(data) {
	for(var key in data) {
		if(data[key].Step_GUID == null) {
			DisplayAlert(languagePack.message.error,languagePack.stepLocationStatus.invalidStep);
			return false;
		}
	}
	return true;
}