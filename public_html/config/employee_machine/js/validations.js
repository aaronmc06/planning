/*============================================================
	Property of:		MISOM TECHNOLOGIES
	Developer:			AARON MCCOLOUGH FT. JORGE MURILLO
	Application Name:	FARA_FRESNILLO
	Directory:			FARA_FRESNILLO/CONFIG/EMPLOYEE_MACHINE/JS
	File Name:			validations.js
=============================================================*/

function ValidateStepsRecords(data) {
	for(var key in data) {
		if(data[key].Employee_GUID == null || data[key].Employee_GUID.trim() == '') {
			DisplayAlert(languagePack.message.error,languagePack.employeeMachine.invalidEmployee);
			return false;
		}
		if(data[key].Machine_GUID == null || data[key].Machine_GUID.trim() == '') {
			DisplayAlert(languagePack.message.error,languagePack.employeeMachine.invalidMachine);
			return false;
		}
		if(data[key].IsOperator == 0 && data[key].IsHelper == 0) {
			console.log(data[key]);
			DisplayAlert(languagePack.message.error,languagePack.employeeMachine.selectPositionFor+" "+data[key].EmployeeName);
			return false;
		}
	}
	return true;
}