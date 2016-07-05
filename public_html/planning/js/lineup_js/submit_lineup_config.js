/*============================================================
	Property of:		MISOM TECHNOLOGIES
	Developer:			AARON MCCOLOUGH
	Application Name:	FARA_FRESNILLO
	Directory:			FARA_FRESNILLO/PLANNING/JS/LINEUP_JS
	File Name:			submit_lineup_config.js
=============================================================*/

var LineupArray          = [];
var LineupPlan           = [];
var LineupStepArray      = [];
var LineupMeasuresArray  = [];
var lineupLocationStatus = [];
var numLineups           = 0;
var numSteps             = 0;

function GetLocationStatusForLineup() {
	
	var locationString = "";
	
	$(".lineupConfigLocation").each(function(index) {
		var dataObj      = {};
		var element      = $(this);
		var locationGuid = element.val();
		
		dataObj.Location_GUID = locationGuid;
		
		if(parseInt(index) > 0) {
			locationString += ',';
		}

		locationString += locationGuid;
	});
	
	var jqxhrLineupLocationStatus = $.getJSON(ruIP + ruPort + planningDB + planningEN + "read/geo/LocationCurrentStatus?where=\"IsActive = '1' AND Location_GUID IN ('"+locationString+"')\"", function() {
		lineupLocationStatus  = jQuery.parseJSON(jqxhrLineupLocationStatus.responseText);
		
		ValidateLineup();		
	});
}

function ValidateLineup() {
	var isValid = true;
	var message = '';
	
	//CHECKING ACTIVITIES
	$(".lineupConfigStep").each(function() {
		var element = $(this);
		var value = element.val();
		
		if(!(value && value != 0)) {
			isValid = false;
			message = languagePack.lineup.selectStep;
		}
	});
	
	if($(".lineupConfigStep").length <= 0) {
		isValid = false;
		message = languagePack.lineup.addNewStep;
	}
	
	//CHECKING METHODS
	$(".lineupConfigMethod").each(function() {
		var element = $(this);
		var value = element.val();
		
		if(!(value && value != 0)) {
			isValid = false;
			message = languagePack.lineup.selectMethod;
		}
	});
	
	if($(".lineupConfigMethod").length <= 0) {
		isValid = false;
		message = languagePack.lineup.addNewStep;
	}
	
	//CHECKING OPERATORS
	$(".lineupConfigOperator").each(function() {
		var element = $(this);
		var value = element.val();
		
		if(!(value && value != 0)) {
			isValid = false;
			message = languagePack.lineup.selectOperator;
		}
	});
	
	if($(".lineupConfigOperator").length <= 0) {
		isValid = false;
		message = languagePack.lineup.addNewLineup;
	}
	
	//CHECKING PROCESSES
	$(".lineupConfigProcess").each(function() {
		var element = $(this);
		var value = element.val();
		
		if(!(value && value != 0)) {
			isValid = false;
			message = languagePack.lineup.selectProcess;
		}
	});
	
	if($(".lineupConfigProcess").length <= 0) {
		isValid = false;
		message = languagePack.lineup.addNewLineup;
	}
	
	//CHECKING LOCATIONS	
	$(".lineupConfigLocation").each(function() {
		var element = $(this);
		var value = element.val();
		
		if(!(value && value != 0)) {
			isValid = false;
			message = languagePack.lineup.selectLocation;
		}
	});
	
	if($(".lineupConfigLocation").length <= 0) {
		isValid = false;
		message = languagePack.lineup.addNewLineup;
	}
	
	//CHECKING ZONES	
	$(".lineupConfigZone").each(function() {
		var element = $(this);
		var value = element.val();
		
		if(!(value && value != 0)) {
			isValid = false;
			message = 'Debe seleccionar un Zona.';
		}
	});
	
	if($(".lineupConfigZone").length <= 0) {
		isValid = false;
		message =languagePack.lineup.addNewLineup;
	}
	
	if(isValid) {
		PrepareLineUpStructure();
	}
	else {
		DisplayAlert(languagePack.message.error,message);
		ServiceComplete();		
	}
}

function PrepareLineUpStructure() {
	LockForService();
	LineupArray         = [];
	LineupPlan          = [];
	LineupStepArray     = [];
	LineupMeasuresArray = [];
	
	$(".eachLineupConfigContainer").each(function(lnup_index) {
			var lineupObj      = {};
			var lineupPlanObj  = {};
			numLineups         = 0;
			
			numSteps = 0;
			
			var lineupGuid     = CreateGUID();
			var zoneGuid       = $(this).find(".lineupConfigZone").val();
			var areaGuid       = $(this).find(".lineupConfigArea").val();
			var locationGuid   = $(this).find(".lineupConfigLocation").val();
			var processGuid    = $(this).find(".lineupConfigProcess").val();
			var operatorGuid   = $(this).find(".lineupConfigOperator").val();
			var helper_guid    = $(this).find(".lineupConfigHelper").val();
			var planGuid       = $(this).attr("PlanGUID");
			
			if(planGuid == "null") {
				planGuid = null;
			}
			
			lineupObj.Lineup_GUID              = lineupGuid;
			lineupObj.Zone_GUID                = zoneGuid;
			lineupObj.Area_GUID                = areaGuid;
			lineupObj.BeginLocationStatus_GUID = null;
			lineupObj.EndLocationStatus_GUID   = null;
			lineupObj.Location_GUID            = locationGuid;
			lineupObj.Process_GUID             = processGuid;
			lineupObj.ShiftDate                = moment(new Date(fixedDate)).format("YYYY-MM-DDTHH:mm:ss.000z");
			lineupObj.Shift                    = fixedShift;
			lineupObj.Operator_GUID            = operatorGuid;
			lineupObj.Helper_GUID              = helper_guid;
			lineupObj.Nivel                    = null;
			lineupObj.OperatorTimeArrival      = null;
			lineupObj.OperatorTimeLeft         = null;
			lineupObj.IsActive                 = true;
			lineupObj.Created                  = moment().format("YYYY-MM-DDTHH:mm:ss.000z");
			lineupObj.Modified                 = moment().format("YYYY-MM-DDTHH:mm:ss.000z");
			lineupObj.Obsolete                 = moment().format("9999-12-31T00:00:00.000z");
			lineupObj.CreatedBy                = UserData[0].PersonGUID;
			
			for(var key in lineupLocationStatus) {
				if(lineupLocationStatus[key].Location_GUID == locationGuid) {
					lineupObj.BeginLocationStatus_GUID = lineupLocationStatus[key].LocationStatus_GUID;
				}
			}
			
			lineupPlanObj.Lineup_Plan_GUID = CreateGUID();
			lineupPlanObj.Lineup_GUID      = lineupGuid;
			lineupPlanObj.Plan_GUID        = planGuid;
			lineupPlanObj.IsActive         = true;
			lineupPlanObj.ShiftDate		   = moment(new Date(fixedDate)).format("YYYY-MM-DDTHH:mm:ss.000z");
			lineupPlanObj.Created          = moment().format("YYYY-MM-DDTHH:mm:ss.000z");
			lineupPlanObj.Modified         = moment().format("YYYY-MM-DDTHH:mm:ss.000z");
			lineupPlanObj.Obsolete         = moment().format("9999-12-31T00:00:00.000z");
			lineupPlanObj.CreatedBy        = UserData[0].PersonGUID;
			
			$(this).find(".lineupStepContainer").each(function(step_index) {
				var lineupStepObj  = {};
				
				var lineupStepGuid = CreateGUID();
				var methodGuid     = $(this).find(".lineupConfigMethod").val();
				var stepGuid       = $(this).find(".lineupConfigStep").val();
				var machineGuid    = $(this).find(".lineupConfigMachine").val();
				var machLocGuid    = $(this).find(".lineupConfigMachineLocation").val();
				var machTypeGuid   = $(this).find(".lineupConfigMachine option:selected").attr("MachineTypeGUID");
				
				lineupStepObj.Lineup_Step_GUID        = lineupStepGuid;
				lineupStepObj.Lineup_GUID             = lineupGuid;
				lineupStepObj.Method_GUID             = methodGuid;
				lineupStepObj.Step_GUID               = stepGuid;
				lineupStepObj.Machine_GUID            = machineGuid;
				lineupStepObj.BeginShift_MachLocation = machLocGuid;
				lineupStepObj.EndShift_MachLocation   = null;
				lineupStepObj.IsActive                = true;
				lineupStepObj.ShiftDate               = moment(new Date(fixedDate)).format("YYYY-MM-DDTHH:mm:ss.000z");
				lineupStepObj.Created                 = moment().format("YYYY-MM-DDTHH:mm:ss.000z");
				lineupStepObj.Modified                = moment().format("YYYY-MM-DDTHH:mm:ss.000z");
				lineupStepObj.Obsolete                = moment().format("9999-12-31T00:00:00.000z");
				lineupStepObj.CreatedBy               = UserData[0].PersonGUID;
				
				LineupStepArray.push(lineupStepObj);			
				numSteps++;
				GetLineupProcessMeasures(lnup_index, step_index, lineupGuid, planGuid, stepGuid, machineGuid, machTypeGuid);
				
			});
			
			LineupPlan.push(lineupPlanObj);
			LineupArray.push(lineupObj);
			
			numLineups++;
	});
}

function GetLineupProcessMeasures(lnup_index, step_index, lineupGuid, planGuid, stepGuid, machineGuid, machTypeGuid) {
	//var jqxhrLineupProcessMeasures = $.getJSON(ruIP + ruPort + planningDB + planningEN + "read/dbo/v_StepMeasureConfig?where=\"StepMeasure_IsActive = '1' AND Step_GUID = '"+stepGuid+"' AND MeasureCategoryDisplayName = 'Proceso'\"", function() {
	var jqxhrLineupProcessMeasures = $.getJSON(ruIP + ruPort + planningDB + planningEN + "read/dbo/v_StepMeasureConfig?where=\"StepMeasure_IsActive = '1' AND Step_GUID = '"+stepGuid+"'\"", function() {
		var lineupMeasures  = jQuery.parseJSON(jqxhrLineupProcessMeasures.responseText);

		if(lineupMeasures.length <= 0) {
			var lineupMeasuresObj;
			
			GetProcessPlannedValues((lnup_index + 1), (step_index + 1), lineupMeasuresObj, lineupGuid, planGuid, stepGuid, machineGuid, machTypeGuid, null, 0, 0);
		}

		for(var key in lineupMeasures) {
			var lineupMeasuresObj = {};
			
			lineupMeasuresObj.Lineup_MeasureDetail_GUID = CreateGUID();
			lineupMeasuresObj.Lineup_GUID               = lineupGuid;
			lineupMeasuresObj.Plan_GUID                 = planGuid;
			lineupMeasuresObj.Step_GUID                 = stepGuid;
			lineupMeasuresObj.Machine_GUID              = machineGuid;
			lineupMeasuresObj.MeasureType               = lineupMeasures[key].MeasureCategoryDisplayName;
			lineupMeasuresObj.Measure_GUID              = lineupMeasures[key].Measure_GUID;
			lineupMeasuresObj.PlannedValue              = null;
			lineupMeasuresObj.ActualValue_1             = null;
			lineupMeasuresObj.ActualValue_2             = null;
			lineupMeasuresObj.ActualValue_3             = null;
			lineupMeasuresObj.IsActive                  = true;
			lineupMeasuresObj.ShiftDate                 = moment(new Date(fixedDate)).format("YYYY-MM-DDTHH:mm:ss.000z");
			lineupMeasuresObj.Created                   = moment().format("YYYY-MM-DDTHH:mm:ss.000z");
			lineupMeasuresObj.Modified                  = moment().format("YYYY-MM-DDTHH:mm:ss.000z");
			lineupMeasuresObj.Obsolete                  = moment().format("9999-12-31T00:00:00.000z");
			lineupMeasuresObj.CreatedBy                 = UserData[0].PersonGUID;
			
			GetProcessPlannedValues((lnup_index + 1), (step_index + 1), lineupMeasuresObj, lineupGuid, planGuid, stepGuid, machineGuid, machTypeGuid, lineupMeasures[key].Measure_GUID, (parseInt(key) + 1), lineupMeasures.length);
		}		
	});
}

function GetProcessPlannedValues(lnup_index, step_index, lineupMeasuresObj, lineupGuid, planGuid, stepGuid, machineGuid, machTypeGuid, lnupMeasureGuid, measureKey, measuresLength) {
	var jqxhrPlannedValues = $.getJSON(ruIP + ruPort + planningDB + planningEN + "read/dbo/v_PlanStepMeasure?where=\"Plan_GUID = '"+planGuid+"' AND Step_GUID = '"+stepGuid+"'\"", function() {
		var plannedValues = jQuery.parseJSON(jqxhrPlannedValues.responseText);

		for(var key2 in plannedValues) {
			if(lnupMeasureGuid == plannedValues[key2].Measure_GUID && stepGuid == plannedValues[key2].Step_GUID) {
				lineupMeasuresObj.PlannedValue = plannedValues[key2].PlannedValue;
			}
		}
	
		if(lineupMeasuresObj) {
			LineupMeasuresArray.push(lineupMeasuresObj);
		}

		if(step_index == numSteps && lnup_index == numLineups && measureKey == measuresLength) {
			//GetLineupMaterialMeasures((lnup_index - 1), (step_index - 1), lineupGuid, planGuid, stepGuid, machineGuid, machTypeGuid);
			CheckExistingLineup();
		}
		
	});
}

/* function GetLineupMaterialMeasures(lnup_index, step_index, lineupGuid, planGuid, stepGuid, machineGuid, machTypeGuid) {
	var jqxhrLineupMaterialMeasures = $.getJSON(ruIP + ruPort + planningDB + planningEN + "read/dbo/v_MachineTypeMeasure?where=\"MachineTypeMeasure_IsActive = '1' AND MachineType_GUID = '"+machTypeGuid+"'\"", function() {
		var lineupMeasures  = jQuery.parseJSON(jqxhrLineupMaterialMeasures.responseText);
		
		if(lineupMeasures.length <= 0) {
			var lineupMeasuresObj;
			
			GetMaterialPlannedValues((lnup_index + 1), (step_index + 1), lineupMeasuresObj, planGuid, stepGuid, machTypeGuid, null, 0, 0);
		}

		for(var key in lineupMeasures) {
			var lineupMeasuresObj = {};
			
			lineupMeasuresObj.Lineup_MeasureDetail_GUID = CreateGUID();
			lineupMeasuresObj.Lineup_GUID               = lineupGuid;
			lineupMeasuresObj.Plan_GUID                 = planGuid;
			lineupMeasuresObj.Step_GUID                 = stepGuid;
			lineupMeasuresObj.Machine_GUID              = machineGuid;
			lineupMeasuresObj.MeasureType               = lineupMeasures[key].MeasureCategoryDisplayName;
			lineupMeasuresObj.Measure_GUID              = lineupMeasures[key].Measure_GUID;
			lineupMeasuresObj.PlannedValue              = null;
			lineupMeasuresObj.ActualValue_1             = null;
			lineupMeasuresObj.ActualValue_2             = null;
			lineupMeasuresObj.ActualValue_3             = null;
			lineupMeasuresObj.IsActive                  = true;
			lineupMeasuresObj.ShiftDate                 = moment(new Date(fixedDate)).format("YYYY-MM-DDTHH:mm:ss.000z");
			lineupMeasuresObj.Created                   = moment().format("YYYY-MM-DDTHH:mm:ss.000z");
			lineupMeasuresObj.Modified                  = moment().format("YYYY-MM-DDTHH:mm:ss.000z");
			lineupMeasuresObj.Obsolete                  = moment().format("9999-12-31T00:00:00.000z");
			lineupMeasuresObj.CreatedBy                 = UserData[0].PersonGUID;
			
			GetMaterialPlannedValues((lnup_index + 1), (step_index + 1), lineupMeasuresObj, planGuid, stepGuid, machTypeGuid, lineupMeasures[key].Measure_GUID, (parseInt(key) + 1), lineupMeasures.length);
		}		
	});
}

function GetMaterialPlannedValues(lnup_index, step_index, lineupMeasuresObj, planGuid, stepGuid, machTypeGuid, lnupMeasureGuid, measureKey, measuresLength) {
	var jqxhrPlannedValues = $.getJSON(ruIP + ruPort + planningDB + planningEN + "read/dbo/v_PlanStepMeasure?where=\"Plan_GUID = '"+planGuid+"' AND MachineType_GUID = '"+machTypeGuid+"'\"", function() {
		var plannedValues = jQuery.parseJSON(jqxhrPlannedValues.responseText);

		for(var key2 in plannedValues) {
			if(lnupMeasureGuid == plannedValues[key2].Measure_GUID && stepGuid == plannedValues[key2].Step_GUID) {
				lineupMeasuresObj.PlannedValue = plannedValues[key2].PlannedValue;
			}
		}
	
		if(lineupMeasuresObj) {
			LineupMeasuresArray.push(lineupMeasuresObj);
		}

		if(step_index == numSteps && lnup_index == numLineups && measureKey == measuresLength) {
			CheckExistingLineup();
		}		
	});
} */

function CheckExistingLineup() {
	var jqxhrExistingLineups = $.getJSON(ruIP + ruPort + planningDB + planningEN + "read/trans/Lineup?where=\"IsActive = '1' AND Operator_GUID = '"+LineupArray[0].Operator_GUID+"' AND ShiftDate = '"+LineupArray[0].ShiftDate+"' AND Shift = '"+LineupArray[0].Shift+"' AND Location_GUID = '"+LineupArray[0].Location_GUID+"'\"", function() {
		var lineups  = jQuery.parseJSON(jqxhrExistingLineups.responseText);
		
		if(lineups.length > 0) {
			DisplayAlert(languagePack.message.error,languagePack.lineup.lineupExists);
			ServiceComplete();
		}
		else {
			SubmitToLineup();
		}
	});
}

function SubmitToLineup() {
	
	if(LineupArray.length > 0) {
		var jsonData = {
			 "fields": LineupArray
		};
		
		$.ajax ({
			headers: {
				"Content-Type": "application/json"
			},
			url: ruIP + ruPort + planningDB + planningEN + "create/bulk/trans/Lineup",
			type: "POST",
			data: JSON.stringify(jsonData),
			success: function(){
				SubmitToLineupStep();
			},
			error: function(){
				DisplayAlert(languagePack.message.error,languagePack.message.recordsNotStored);
			}
		});
	}
}

function SubmitToLineupStep() {
	if(LineupStepArray.length > 0) {
		var jsonData = {
			 "fields": LineupStepArray
		};
		
		$.ajax ({
			headers: {
				"Content-Type": "application/json"
			},
			url: ruIP + ruPort + planningDB + planningEN + "create/bulk/trans/Lineup_StepDetail",
			type: "POST",
			data: JSON.stringify(jsonData),
			success: function(){
				SubmitToLineupPlan();
			},
			error: function(){
				DisplayAlert(languagePack.message.error,languagePack.message.recordsNotStored);
			}
		});
	}
}

function SubmitToLineupPlan() {
	if(LineupPlan.length > 0) {
		var jsonData = {
			 "fields": LineupPlan
		};
		
		$.ajax ({
			headers: {
				"Content-Type": "application/json"
			},
			url: ruIP + ruPort + planningDB + planningEN + "create/bulk/trans/Lineup_Plan",
			type: "POST",
			data: JSON.stringify(jsonData),
			success: function(){
				SubmitToLineupMeasure();
			},
			error: function(){
				DisplayAlert(languagePack.message.error,languagePack.message.recordsNotStored);
			}
		});
	}
}

function SubmitToLineupMeasure() {
	if(LineupMeasuresArray.length > 0) {
		var jsonData = {
			 "fields": LineupMeasuresArray
		};
		
		$.ajax ({
			headers: {
				"Content-Type": "application/json"
			},
			url: ruIP + ruPort + planningDB + planningEN + "create/bulk/trans/Lineup_MeasureDetail",
			type: "POST",
			data: JSON.stringify(jsonData),
			success: function(){
				$("#lineup_toggle").removeClass("isinfocus");
				$("#lineup_toggle").click();
			},
			error: function(){
				DisplayAlert(languagePack.message.error,languagePack.message.recordsNotStored);
			}
		});
	}
	else {		
		$("#lineup_toggle").removeClass("isinfocus");
		$("#lineup_toggle").click();
	}
}











