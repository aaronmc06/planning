/*============================================================
	Property of:		MISOM TECHNOLOGIES
	Developer:			AARON MCCOLOUGH FT. JORGE MURILLO
	Application Name:	FARA_FRESNILLO
	Directory:			FARA_FRESNILLO/CONFIG/GEO_CONFIG/LOCATIONS/JS
	File Name:			validations.js
=============================================================*/

function ValidateStepsRecords(data) {

	for(var key in data) {
		if(data[key].LocationName == null || data[key].LocationName.trim() == '') {
			DisplayAlert(languagePack.message.error,languagePack.locations.invalidLocation);
			return false;
		}
		if(data[key].DisplayName == null || data[key].DisplayName.trim() == '') {
			DisplayAlert(languagePack.message.error,languagePack.locations.invalidCommonName);
			return false;
		}
		if(data[key].LocationCode == null) {
			DisplayAlert(languagePack.message.error,languagePack.locations.invalidLocationCode);
			return false;
		}
		if(data[key].Area_GUID == null || data[key].Area_GUID.trim() == '') {
			DisplayAlert(languagePack.message.error,languagePack.locations.invalidArea);
			return false;
		}
		if(data[key].Obracode_GUID == null || data[key].Obracode_GUID.trim() == '') {
			DisplayAlert(languagePack.message.error,languagePack.locations.invalidWorkCode);
			return false;
		}
		if(data[key].Nivel == null) {
			DisplayAlert(languagePack.message.error,languagePack.locations.invalidLevel);
			return false;
		}
		if(data[key].Orientacion_GUID == null || data[key].Orientacion_GUID.trim() == '') {
			DisplayAlert(languagePack.message.error,languagePack.locations.invalidOrientation);
			return false;
		}
		if(data[key].VetaClave_GUID == null || data[key].VetaClave_GUID.trim() == '') {
			DisplayAlert(languagePack.message.error,languagePack.locations.invalidKeyVein);
			return false;
		}
		if(data[key].ReferenceLine == null || data[key].ReferenceLine.trim() == '') {
			DisplayAlert(languagePack.message.error,languagePack.locations.invalidReferenceLine);
			return false;
		}
	}
	return true;
}