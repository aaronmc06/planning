/*============================================================
	Property of:		MISOM TECHNOLOGIES
	Developer:			AARON MCCOLOUGH FT. JORGE MURILLO
	Application Name:	FARA_FRESNILLO
	Directory:			FARA_FRESNILLO/CONFIG/PLAN_CONFIG/METHOD_STEP/JS
	File Name:			validations.js
=============================================================*/

function ValidateStepsRecords(data) {
	for(var key in data) {
		if(data[key].StepName == null || data[key].StepName.trim() == '') {
			DisplayAlert(languagePack.message.error,languagePack.methodStep.invalidStep);
			return false;
		}
		if(data[key].DisplayName == null || data[key].DisplayName.trim() == '') {
			DisplayAlert(languagePack.message.error,languagePack.methodStep.invalidDisplayName);
			return false;
		}
	}
	return true;
}