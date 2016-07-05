/*============================================================
	Property of:		MISOM TECHNOLOGIES
	Developer:			AARON MCCOLOUGH
	Application Name:	FARA_FRESNILLO
	Directory:			FARA_FRESNILLO/PLANNING/JS/LINEUP_JS
	File Name:			load_dropdowns.js
=============================================================*/

var lineupOperators        = [];
var lineupHelpers          = [];
var lineupMachines         = [];
var lineupMachineLocations = [];
var locationStatusObj      = [];

$(document).ready(function() {
	OperatorLineupLoad();
});

function ZoneLineupLoad(element, areaGuid, zoneGuid) {
	var jqxhrLineupZones = $.getJSON(ruIP + ruPort + planningDB + planningEN + "read/geo/Zone?where=\"IsActive = '1' AND Area_GUID = '"+areaGuid+"' ORDER BY DisplayName\"", function() {
		var lineupZones  = jQuery.parseJSON(jqxhrLineupZones.responseText);
		
		$("#" + element).html("<option value='0'>"+languagePack.common.selectOption+"</option>");
		var zoneSelect = document.getElementById(element);
		
		for(var key in lineupZones) {
			zoneSelect.options[zoneSelect.options.length] = new Option(lineupZones[key].DisplayName, lineupZones[key].Zone_GUID);
		}
		
		if(zoneGuid) {
			$("#" + element).val(zoneGuid);
		}
	});
}

function LocationLineupLoad(element, areaGuid, zoneGuid, locationGuid) {
	var jqxhrLineupLocations = $.getJSON(ruIP + ruPort + planningDB + planningEN + "read/geo/Location?where=\"IsActive = '1' AND Area_GUID = '"+areaGuid+"' AND Zone_GUID = '"+zoneGuid+"' ORDER BY DisplayName\"", function() {
		var lineupLocations  = jQuery.parseJSON(jqxhrLineupLocations.responseText);
		$("#" + element).html("<option value='0'>"+languagePack.common.selectOption+"</option>");
		var locationSelect = document.getElementById(element);
		
		for(var key in lineupLocations) {
			locationSelect.options[locationSelect.options.length] = new Option(lineupLocations[key].DisplayName, lineupLocations[key].Location_GUID);
			locationSelect.options[locationSelect.options.length - 1].setAttribute("Nivel", lineupLocations[key].Nivel);
			locationSelect.options[locationSelect.options.length - 1].setAttribute("ObracodeGUID", lineupLocations[key].Obracode_GUID);
		}
		
		if(locationGuid) {
			$("#" + element).val(locationGuid);
			GetCurrentLocationStatus(element, locationGuid);
		}
	});
}

function ProcessLineupLoad(element, obracodeGuid, processGuid) {
	var jqxhrLineupProcesses = $.getJSON(ruIP + ruPort + planningDB + planningEN + "read/dbo/v_ObracodeProcess_Config?where=\"Obracode_GUID = '"+ obracodeGuid +"' ORDER BY MineProcessDisplayName\"", function() {
		var lineupProcesses  = jQuery.parseJSON(jqxhrLineupProcesses.responseText);
		$("#" + element).html("<option value='0'>"+languagePack.common.selectOption+"</option>");
		var processSelect = document.getElementById(element);
		
		for(var key in lineupProcesses) {
			processSelect.options[processSelect.options.length] = new Option(lineupProcesses[key].MineProcessDisplayName, lineupProcesses[key].MineProcess_GUID);
			processSelect.options[processSelect.options.length - 1].setAttribute("ObracodeGUID", lineupProcesses[key].Obracode_GUID);
		}
		
		if(processGuid) {
			$("#" + element).val(processGuid);
		}
	});
}

function GetCurrentLocationStatus(element, locationGuid) {
	var locationElement = element;
	var locationName	= $("#" + locationElement + " option:selected").text();
	locationStatusData = [];
	$("#curr_loc_stat").remove();
	
	$.getJSON(ruIP + ruPort + planningDB + planningEN + "read/geo/LocationCurrentStatus?where=\"IsActive = '1' AND Location_GUID = '"+locationGuid+"'\"", function( loc_Stat_data ) {
		locationStatusData = loc_Stat_data;
		if(locationStatusData.length > 0) {
			$("#" + locationElement).attr("CurrentLocationStatus", locationStatusData[0].LocationStatus_GUID);			
		
			$.getJSON(ruIP + ruPort + planningDB + planningEN + "read/geo/LocationStatus?where=\"LocationStatus_GUID = '"+locationStatusData[0].LocationStatus_GUID+"'\"", function( statusData ) {
				$("#" + locationElement).parent().parent().after('<tr id="curr_loc_stat"><td colspan="4"><div style="color:#fff; background:#BE5050; padding: 4px; border: 1px solid #6C1E1E; font-size: 18px; border-width:1px 1px 3px; border-radius: 4px; text-align: center;">'+locationName+' es un '+statusData[0].DisplayName+'</div></td></tr>');
			});
		}
		else {
			$("#" + locationElement).attr("CurrentLocationStatus", null);
		}
		
		$(".lineupStepContainer").each(function() {
			var element = $(this);
			var methodGuid = element.find(".lineupConfigMethod").val();
			var stepGuid   = element.find(".lineupConfigStep").val();
			var stepDDId   = element.find(".lineupConfigStep").attr("id");
			
			StepLineupLoad(locationElement, stepDDId, methodGuid, stepGuid);
		});		
	});
}

function OperatorLineupLoad() {
	lineupOperators = [];
	
	var jqxhrLineupOperators = $.getJSON(ruIP + ruPort + planningDB + planningEN + "read/dbo/v_EmployeeMachineShift?where=\"IsActive = '1' AND IsOperator = '1' ORDER BY EmployeeName\"", function() {
		lineupOperators      = jQuery.parseJSON(jqxhrLineupOperators.responseText);
		
		HelperLineupLoad();
	});
}

function HelperLineupLoad() {
	lineupHelpers = [];
	
	var jqxhrLineupHelpers = $.getJSON(ruIP + ruPort + planningDB + planningEN + "read/dbo/v_EmployeeMachineShift?where=\"IsActive = '1' AND IsHelper = '1' ORDER BY EmployeeName\"", function() {
		lineupHelpers      = jQuery.parseJSON(jqxhrLineupHelpers.responseText);
		
		MachineLineupLoad();
	});
}

function MethodLineupLoad(element, processGuid, obracodeGuid, methodGuid) {
	var jqxhrLineupMethods = $.getJSON(ruIP + ruPort + planningDB + planningEN + "read/dbo/v_ObracodeProcessMethod_Config?where=\"Obracode_GUID = '"+ obracodeGuid +"' AND MineProcess_GUID = '"+processGuid+"' ORDER BY MethodDisplayName\"", function() {
		var lineupMethods  = jQuery.parseJSON(jqxhrLineupMethods.responseText);
		
		$("#" + element).html("<option value='0'>"+languagePack.common.selectOption+"</option>");
		var methodSelect = document.getElementById(element);
		
		for(var key in lineupMethods) {
			methodSelect.options[methodSelect.options.length] = new Option(lineupMethods[key].MethodDisplayName, lineupMethods[key].Method_GUID);
		}
		
		if(methodGuid) {
			$("#" + element).val(methodGuid);
		}
	});
}

function StepLineupLoad(locationElement, element, methodGuid, stepGuid) {
	var statusString = "";
	var url          = "";
	
	if($("#" + locationElement).attr("CurrentLocationStatus")) {
		var currentLocationStatus = $("#" + locationElement).attr("CurrentLocationStatus");
		
		if(currentLocationStatus == 0 || currentLocationStatus == null || currentLocationStatus == "") {
			url = "read/cfg/Step?where=\"IsActive = '1' AND Method_GUID = '"+methodGuid+"' And IsLineup = '1'";
		}
		else {		
			url = "read/dbo/v_LocationStatusStep?where=\"IsActive = '1' AND Method_GUID = '"+methodGuid+"' And IsLineup = '1'";
			statusString = " AND LocationStatus_GUID = '"+currentLocationStatus+"'";
		}
	}
	else {
		url = "read/cfg/Step?where=\"IsActive = '1' AND Method_GUID = '"+methodGuid+"' And IsLineup = '1'";
	}
	
	var jqxhrLineupSteps = $.getJSON(ruIP + ruPort + planningDB + planningEN + url + statusString + " ORDER BY DisplayName\"", function() {
		var lineupSteps  = jQuery.parseJSON(jqxhrLineupSteps.responseText);

		var valueExists  = false;
		
		$("#" + element).html("<option value='0'>"+languagePack.common.selectOption+"</option>");
		var stepSelect = document.getElementById(element);
		
		for(var key in lineupSteps) {
			if(lineupSteps[key].Step_GUID == stepGuid) {
				valueExists = true;
			}
			stepSelect.options[stepSelect.options.length] = new Option(lineupSteps[key].DisplayName, lineupSteps[key].Step_GUID);
		}

		if(stepGuid && valueExists) {
			$("#" + element).val(stepGuid);
		}
		else {
			$("#" + element).val(0);			
		}
	});
}

function MachineLineupLoad() {
	lineupMachines = [];
	
	var jqxhrLineupMachines = $.getJSON(ruIP + ruPort + planningDB + planningEN + "read/web/v_MachineAreaConfig?where=\"IsActive = '1' AND Area_GUID = '"+area_GF+"' ORDER BY MachineDisplayName\"", function() {
		lineupMachines      = jQuery.parseJSON(jqxhrLineupMachines.responseText);
		
		MachineLocationLineupLoad();
	});
}

function MachineLocationLineupLoad() {
	lineupMachineLocations = [];
	
	var jqxhrLineupMachineLocations = $.getJSON(ruIP + ruPort + planningDB + planningEN + "read/geo/Location?where=\"IsActive = '1' AND Area_GUID = '"+area_GF+"' ORDER BY DisplayName\"", function() {
		lineupMachineLocations      = jQuery.parseJSON(jqxhrLineupMachineLocations.responseText);
		
		GenerateLineupHTML();
	});
}







