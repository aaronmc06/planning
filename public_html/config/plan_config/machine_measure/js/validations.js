/*============================================================
	Property of:		MISOM TECHNOLOGIES
	Developer:			AARON MCCOLOUGH FT. JORGE MURILLO
	Application Name:	FARA_FRESNILLO
	Directory:			FARA_FRESNILLO/CONFIG/PLAN_CONFIG/MACHINE_MEASURE/JS
	File Name:			validations.js
=============================================================*/

function ValidateStepsRecords(data) {
	for(var key in data) {
		if(data[key].Measure_GUID == null || data[key].Measure_GUID.trim() == '') {
			DisplayAlert(languagePack.message.error,languagePack.machineMeasures.invalidMeasure);
			return false;
		}
	}
	return true;
}