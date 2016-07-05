/*============================================================
	Property of:		MISOM TECHNOLOGIES
	Developer:			AARON MCCOLOUGH FT. JORGE MURILLO
	Application Name:	FARA_FRESNILLO
	Directory:			FARA_FRESNILLO/CONFIG/PLAN_CONFIG/MEASURES/JS
	File Name:			validations.js
=============================================================*/

function ValidateMeasuresRecords(data) {
	for(var key in data) {
		if(data[key].MeasureName == null || data[key].MeasureName.trim() == '') {
			console.log(data[key].MeasureDisplayName);
			DisplayAlert(languagePack.message.error,languagePack.measures.invalidMeasure);
			return false;
		}
		if(data[key].MeasureType_GUID == null || data[key].MeasureType_GUID.trim() == '') {
			console.log(data[key].MeasureTypeDisplayName);
			DisplayAlert(languagePack.message.error,languagePack.measures.invalidMeasureType);
			return false;
		}
	}
	return true;
}

function ValidateMeasureTypesRecords(data) {
	for(var key in data) {
		if(data[key].MeasureTypeName == null || data[key].MeasureTypeName.trim() == '') {
			DisplayAlert(languagePack.message.error,languagePack.measures.invalidMeasureType);
			return false;
		}
		if(data[key].DisplayName == null || data[key].DisplayName.trim() == '') {
			DisplayAlert(languagePack.message.error,languagePack.measures.invalidDisplayName);
			return false;
		}
	}
	return true;
}