/*============================================================
	Property of:		MISOM TECHNOLOGIES
	Developer:			AARON MCCOLOUGH FT. JORGE MURILLO
	Application Name:	FARA_FRESNILLO
	Directory:			FARA_FRESNILLO/CONFIG/METHOD_STEP/JS
	File Name:			validations.js
=============================================================*/

function ValidateAreasRecords(data) {
	for(var key in data) {
		if(data[key].Area_GUID == null) {
			DisplayAlert(languagePack.message.error,languagePack.personArea.invalidArea);
			return false;
		}
	}
	return true;
}