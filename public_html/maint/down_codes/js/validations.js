/*============================================================
	Property of:		MISOM TECHNOLOGIES
	Developer:			AARON MCCOLOUGH FT. JORGE MURILLO
	Application Name:	FARA_FRESNILLO
	Directory:			FARA_FRESNILLO/MAINT/LOCATIONS/JS
	File Name:			validations.js
=============================================================*/

function ValidateDownCodeRecords(data) {

	for(var key in data) {
		if(data[key].DownReasonCode_GUID == null) {
			DisplayAlert(languagePack.message.error,languagePack.downCodes.invalidReasonCode);
			return false;
		}
		if(data[key].DownStartTime == null) {
			DisplayAlert(languagePack.message.error,languagePack.downCodes.invalidStartTime);
			return false;
		}
		if(data[key].MaintenanceArrivalTime == null) {
			DisplayAlert(languagePack.message.error,languagePack.downCodes.invalidArrivalTime);
			return false;
		}
		if(data[key].DownFinishTime == null) {
			DisplayAlert(languagePack.message.error,languagePack.downCodes.invalidfinishTime);
			return false;
		}
	}
	return true;
}