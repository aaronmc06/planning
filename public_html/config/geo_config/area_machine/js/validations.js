/*============================================================
	Property of:		MISOM TECHNOLOGIES
	Developer:			AARON MCCOLOUGH FT. JORGE MURILLO
	Application Name:	FARA_FRESNILLO
	Directory:			FARA_FRESNILLO/CONFIG/GEO_CONFIG/AREA_MACHINE/JS
	File Name:			validations.js
=============================================================*/

var locationMapped = "";

function ValidateMachineAreaRecords(data) {
	for(var key in data) {
		if(data[key].MachineType_GUID == null) {
			DisplayAlert(languagePack.message.error,languagePack.areaMachine.invalidMachineType);
			return false;
		}
		if(data[key].Machine_GUID == null) {
			DisplayAlert(languagePack.message.error,languagePack.areaMachine.invalidMachine);
			return false;
		}
	}
	return true;
}

function ValidateAreaRecords(data) {
	for(var key in data) {
		if(data[key].AreaName == null) {
			DisplayAlert(languagePack.message.error,languagePack.areaMachine.invalidMachineType);
			return false;
		}
		if(data[key].DisplayName == null) {
			DisplayAlert(languagePack.message.error,languagePack.areaMachine.invalidMachine);
			return false;
		}
	}
	return true;
}

function CheckForExistentMapping(machineName, gridIndex) {
	var machineGuid = machineGuidList[machineList.indexOf(machineName)];
	
	var jqxhrmappings = $.getJSON(ruIP + ruPort + planningDB + planningEN + "read/web/v_MachineAreaConfig?where=\" Machine_GUID = '"+ machineGuid +"' AND Area_GUID = '"+ areaGuid +"' AND IsActive = '1'\"", function() {
		
		var mappingData = jQuery.parseJSON(jqxhrmappings.responseText);
		
		if(mappingData.length > 0) {
			locationMapped = mappingData[0].AreaDisplayName;
			DisplayAlert(languagePack.message.alert,"<span>" + mappingData[0].MachineDisplayName + "</span> " + languagePack.areaMachine.areaAlreadyMapped);
			$("#jqxgrid2").jqxGrid('setcellvalue', gridIndex, "MachineDisplayName", "");
		}
		else {
			locationMapped = "";
			$("#jqxgrid2").jqxGrid('setcellvalue', gridIndex, "Machine_GUID", machineGuid);
		}
	});
}

function CheckForExistingArea(areaName, areaDisplay, gridIndex) {
  
  var jqxhrareaname = $.getJSON(ruIP + ruPort + planningDB + planningEN + "read/geo/Area?where=\" AreaName = '"+ areaName +"' AND IsActive = '1'\"", function() {
		
		var mappingData = $.parseJSON(jqxhrareaname.responseText);
		
		if(mappingData.length > 0) {
			locationMapped = mappingData[0].AreaName;
			DisplayAlert(languagePack.message.alert,"<span>" + mappingData[0].AreaName + "</span> " + "This Area Name already exists");
			$("#jqxgrid").jqxGrid('setcellvalue', gridIndex, "AreaName", "");
		}
		else {
			locationMapped = "";
			$("#jqxgrid").jqxGrid('setcellvalue', gridIndex, "AreaName", areaName);
		}
	});
  
  var jqxhrareadisplay = $.getJSON(ruIP + ruPort + planningDB + planningEN + "read/geo/Area?where=\" DisplayName = '"+ areaDisplay +"' AND IsActive = '1'\"", function() {
		
		var mappingData = $.parseJSON(jqxhrareadisplay.responseText);
		
		if(mappingData.length > 0) {
			locationMapped = mappingData[0].DisplayName;
			DisplayAlert(languagePack.message.alert,"<span>" + mappingData[0].DisplayName + "</span> " + "Area Display Name already exists");
			$("#jqxgrid").jqxGrid('setcellvalue', gridIndex, "DisplayName", "");
		}
		else {
			locationMapped = "";
			$("#jqxgrid").jqxGrid('setcellvalue', gridIndex, "DisplayName", areaName);
		}
	});
}