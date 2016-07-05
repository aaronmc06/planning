/*============================================================
	Property of:		MISOM TECHNOLOGIES
	Developer:			AARON MCCOLOUGH FT. JORGE MURILLO
	Application Name:	FARA_FRESNILLO
	Directory:			FARA_FRESNILLO/LOCATION_GRADE/JS
	File Name:			validations.js
=============================================================*/

function ValidateLocationGradeRecords(data) {
	for(var key in data) {
		if(data[key].Location_GUID == null) {
			DisplayAlert(languagePack.message.error,languagePack.locationGrade.invalidLocation);
			return false;
		}
		
		for(var key2 in data){
			if((data[key2].LocationGrade_GUID == -1) || (data[key2].RowModified == true)){
				if(data[key].LocationGrade_GUID != data[key2].LocationGrade_GUID){
					if(data[key].Location_GUID === data[key2].Location_GUID){
						if(moment(data[key].DateEffective).format() === moment(data[key2].DateEffective).format()){
							DisplayAlert(languagePack.message.error,languagePack.locationGrade.invalidDate);
							return false;
						}
					}
				}
			}
		}
	}
	return true;
}