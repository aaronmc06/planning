/*============================================================
	Property of:		MISOM TECHNOLOGIES
	Developer:			JORGE MURILLO & AARON MCCOLOUGH
	Application Name:	FARA_FRESNILLO
	Directory:			FARA_FRESNILLO/CONFIG/CHECKLISTS/JS
	File Name:			validations.js
=============================================================*/

function ValidateQuestionsRecords(data) {
	for(var key in data) {
		if(data[key].Question_Name == null || data[key].Question_Name.trim() == '') {
			DisplayAlert(languagePack.message.error,languagePack.checklists.noQuestionName);
			return false;
		}
		if(data[key].ChecklistGroup_GUID == null || data[key].ChecklistGroup_GUID.trim() == '') {
			DisplayAlert(languagePack.message.error,languagePack.checklists.noQuestionGroup);
			return false;
		}
		if(data[key].InputType_1 == null || data[key].InputType_1.trim() == '') {
			DisplayAlert(languagePack.message.error,languagePack.checklists.noInputType);
			return false;
		}
	}
	return true;
}

function ValidateTypesRecords(data) {
	for(var key in data) {
		if(data[key].DisplayName == null || data[key].DisplayName.trim() == '') {
			DisplayAlert(languagePack.message.error, "El Tipo de Checklist no puede estar vacío");
			return false;
		}
		if(data[key].UsageType == null || data[key].UsageType.trim() == '') {
			DisplayAlert(languagePack.message.error, "El Tipo de Uso no puede estar vacío");
			return false;
		}
	}
	return true;
}