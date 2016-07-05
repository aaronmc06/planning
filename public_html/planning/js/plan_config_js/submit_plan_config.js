/*============================================================
	Property of:		MISOM TECHNOLOGIES
	Developer:			AARON MCCOLOUGH
	Application Name:	FARA_FRESNILLO
	Directory:			FARA_FRESNILLO/PLANNING/JS/PLAN_CONFIG_JS
	File Name:			submit_plan_config.js
=============================================================*/

var planStepConfigArray = [];
var planArray           = [];
var PlanStepArray       = [];
var PlanMachineArray    = [];
var PlanMeasureArray    = [];
var PlanAssetArray      = [];
var alertMessage        = "";
var planConfigGuid      = "";

$(document).ready(function() {
	$("#generate_plan_config_btn").on("click", function() {
		LockForService();
		SubmitPlanConfigData();
		$("#plan_component_button").toggleClass('open');
	});
});

function SubmitPlanConfigData() {
	
	if(InputValidations()) {
		
		for(var key in stepConfigArray) {			
			var measureIndex = 0;
			
			while (stepConfigArray[key]["Measure_" + measureIndex]) {
				stepConfigArray[key]["Planned_Value" + measureIndex] = $("#measure_plan_config_input_" + key + "_" + measureIndex).val();
				measureIndex++;
			}
		}
		
		setTimeout(function() {
			AdjustArray();
		},500);
	}
	else {
		DisplayAlert(languagePack.message.error, alertMessage);
		ServiceComplete();
	}
}

function InputValidations() {
	var isValid        = true;
	var daysSelected   = 0;
	var morningArray   = [{},{},{},{},{},{},{}];
	var afternoonArray = [{},{},{},{},{},{},{}];
	var nightArray     = [{},{},{},{},{},{},{}];
	var numSteps       = 0;
	var shiftStepArray = [];
	
	$(".eachStepContainer:visible").each(function() {
		numSteps++;
		var index			= $(this).attr("id").split("step_container_")[1];
		var shift			= $(this).find(".shiftPlanConfigSelect").val();
		var step_guid		= $(this).find(".stepPlanConfigSelect").val();
		var machine_guid	= $(this).find(".machinePlanConfigSelect").val();
		var operator_guid	= $(this).find(".employeeSelect").val();
		var meth_guid		= $(this).attr("methguid");
		var monday			= $("#stepDayCell_" + index + "_0").hasClass("daySelected");
		var tuesday			= $("#stepDayCell_" + index + "_1").hasClass("daySelected");
		var wednesday		= $("#stepDayCell_" + index + "_2").hasClass("daySelected");
		var thursday		= $("#stepDayCell_" + index + "_3").hasClass("daySelected");
		var friday			= $("#stepDayCell_" + index + "_4").hasClass("daySelected");
		var saturday		= $("#stepDayCell_" + index + "_5").hasClass("daySelected");
		var sunday			= $("#stepDayCell_" + index + "_6").hasClass("daySelected");
		var shiftOne		= $("#stepShiftCell_" + index + "_0").hasClass("shiftSelected");
		var shiftTwo		= $("#stepShiftCell_" + index + "_1").hasClass("shiftSelected");
		var shiftThree		= $("#stepShiftCell_" + index + "_2").hasClass("shiftSelected");
		
		var shiftStepObj = {};
		
		if(shiftOne) {
			shiftStepObj = {};
			
			shiftStepObj.StepGUID = step_guid;
			shiftStepObj.Shift    = "1";
			
			shiftStepObj.mon      = monday;
			shiftStepObj.tue      = tuesday;
			shiftStepObj.wed      = wednesday;
			shiftStepObj.thu      = thursday;
			shiftStepObj.fri      = friday;
			shiftStepObj.sat      = saturday;
			shiftStepObj.sun      = sunday;
			
			shiftStepArray.push(shiftStepObj);
		}
		
		if(shiftTwo) {
			shiftStepObj = {};
			
			shiftStepObj.StepGUID = step_guid;
			shiftStepObj.Shift    = "2";
			
			shiftStepObj.mon      = monday;
			shiftStepObj.tue      = tuesday;
			shiftStepObj.wed      = wednesday;
			shiftStepObj.thu      = thursday;
			shiftStepObj.fri      = friday;
			shiftStepObj.sat      = saturday;
			shiftStepObj.sun      = sunday;
			
			shiftStepArray.push(shiftStepObj);
		}
		
		if(shiftThree) {
			shiftStepObj = {};
			
			shiftStepObj.StepGUID = step_guid;
			shiftStepObj.Shift    = "3";
			
			shiftStepObj.mon      = monday;
			shiftStepObj.tue      = tuesday;
			shiftStepObj.wed      = wednesday;
			shiftStepObj.thu      = thursday;
			shiftStepObj.fri      = friday;
			shiftStepObj.sat      = saturday;
			shiftStepObj.sun      = sunday;
			
			shiftStepArray.push(shiftStepObj);
		}
		
		$(this).find(".stepDaysTable .daySelected").each(function() {
			var day = $(this).attr("dayIndex");
			
			if(shiftOne) {
				if(!(morningArray[day].Method_GUID)) {
					morningArray[day].Method_GUID = meth_guid;
				}
				else if(morningArray[day].Method_GUID != meth_guid) {						
					alertMessage = languagePack.message.noSameMethods;
					isValid = false;
				}
			}
			
			if(shiftTwo) {
				if(!(afternoonArray[day].Method_GUID)) {
					afternoonArray[day].Method_GUID = meth_guid;
				}
				else if(afternoonArray[day].Method_GUID != meth_guid) {						
					alertMessage = languagePack.message.noSameMethods;
					isValid = false;
				}
			}
			
			if(shiftThree) {
				if(!(nightArray[day].Method_GUID)) {
					nightArray[day].Method_GUID = meth_guid;
				}
				else if(nightArray[day].Method_GUID != meth_guid) {						
					alertMessage = languagePack.message.noSameMethods;
					isValid = false;
				}
			}
			
			daysSelected++;
		});

		if(machine_guid && operator_guid == -1 || machine_guid && !operator_guid) {
			isValid = false;
			alertMessage = languagePack.message.needOperator;
		}
	
		if(daysSelected <= 0) {
			alertMessage = languagePack.message.oneDayStep;
			isValid = false;
		}
	
		if(!(shiftOne || shiftTwo || shiftThree)) {
			alertMessage = 'You need to select at least one shift.';
			isValid = false;
		}
		
		daysSelected = 0;
	});

	for(var key in shiftStepArray) {
		for(var key2 in shiftStepArray) {
			if(key != key2) {
				if(shiftStepArray[key].StepGUID == shiftStepArray[key2].StepGUID && shiftStepArray[key].Shift == shiftStepArray[key2].Shift) {
					if((shiftStepArray[key].mon && shiftStepArray[key2].mon) || (shiftStepArray[key].tue && shiftStepArray[key2].tue) || (shiftStepArray[key].wed && shiftStepArray[key2].wed) || (shiftStepArray[key].thu && shiftStepArray[key2].thu) || (shiftStepArray[key].fri && shiftStepArray[key2].fri) || (shiftStepArray[key].sat && shiftStepArray[key2].sat) || (shiftStepArray[key].sun && shiftStepArray[key2].sun)) {
						alertMessage = languagePack.message.oneStepShift;
						isValid = false;
					}
				}
			}
		}
	}

	if(numSteps <= 0) {
		isValid = false;
		alertMessage = languagePack.message.needStep;
	}

	return isValid;
}

function AdjustArray() {
	var shift;
	var shift_date;
	
	planStepConfigArray = [];

	$(".eachStepContainer:visible").each(function(stepIndex){
		var stepOrdinal;
		var stepContainer = $(this);
		
		stepOrdinal = $(this).attr("id").split("_")[2];
		
		stepContainer.find(".stepDaysTable .daySelected").each(function() {
			var currentStepDay = $(this);
			
			stepContainer.find(".stepShiftTable .stepShiftCell").each(function() {
				var currentStepShift = $(this);
				
				if(currentStepShift.hasClass('shiftSelected')) {
					var dataObj    = {};
					shift          = parseInt(currentStepShift.attr('calendarshift'));
					shift_date     = currentStepDay.attr("calendarDate");
					
					dataObj.DisplayName      = stepConfigArray[stepIndex].DisplayName;
					dataObj.IsActive         = stepConfigArray[stepIndex].IsActive;
					dataObj.Method_GUID      = stepConfigArray[stepIndex].Method_GUID;
					dataObj.MineProcess_GUID = stepConfigArray[stepIndex].MineProcess_GUID;
					dataObj.Ordinal          = stepConfigArray[stepIndex].Ordinal; //stepOrdinal;
					dataObj.Material_Type	 = $("[name=material_"+stepIndex+"]:checked").val();
					dataObj.Duration         = stepConfigArray[stepIndex].Duration;
					dataObj.Shiftdate        = shift_date;
					dataObj.Shift            = parseInt(shift);
					dataObj.StepName         = stepConfigArray[stepIndex].StepName;
					dataObj.Step_GUID        = stepConfigArray[stepIndex].Step_GUID;
					dataObj.StartTime        = GetTime(shift, shift_date, 0);
					dataObj.EndTime          = GetTime(shift, shift_date, 8);
					
					var i = 0;
					
					while(stepConfigArray[stepIndex]["Measure_" + i]) {
						dataObj["Measure_" + i] = stepConfigArray[stepIndex]["Measure_" + i];
						i++;
					}
					
					i = 0;
					
					while(stepConfigArray[stepIndex]["Measure_GUID" + i]) {
						dataObj["Measure_GUID" + i] = stepConfigArray[stepIndex]["Measure_GUID" + i];
						i++;
					}
					
					i = 0;

					while(stepConfigArray[stepIndex]["Measure_" + i]) {
						if(stepConfigArray[stepIndex]["Planned_Value" + i]) {
							dataObj["Planned_Value" + i] = stepConfigArray[stepIndex]["Planned_Value" + i];
						}
						else {
							dataObj["Planned_Value" + i] = null;
						}
						i++;
					}
					
					if(stepConfigArray[stepIndex].Operator_GUID) {
						dataObj.Operator_GUID = stepConfigArray[stepIndex].Operator_GUID;
						dataObj.IsOperator    = true;
						dataObj.IsHelper      = false;
					}
					
					if(stepConfigArray[stepIndex].Helper_GUID) {
						dataObj.Helper_GUID = stepConfigArray[stepIndex].Helper_GUID;
						dataObj.IsHelper    = true;
						dataObj.IsOperator  = false;
					}
					
					if(stepConfigArray[stepIndex].Machine_GUID) {
						dataObj.Machine_GUID = stepConfigArray[stepIndex].Machine_GUID;
						dataObj.Machine_Name = stepConfigArray[stepIndex].Machine_Name;
					}

					planStepConfigArray.push(dataObj);
				}
			});
		});
	});
	
	if(configEditMode) {
		var plan_guid = "";
		
		var jqxhrplans = $.getJSON(ruIP + ruPort + planningDB + planningEN + "read/trans/Plan?where=\"IsActive = '1' And PlanConfig_GUID = '" + planConfigGuid + "' And Shiftdate = '" + shift_date + "' And Shift = '" + shift + "'\"", function() {		
			var planData = jQuery.parseJSON(jqxhrplans.responseText);
			
			plan_guid = planData[0].Plan_GUID;
			
			UpdatePlanConfiguration(plan_guid);
		});
	}
	else {
		DistributeNewPlanConfiguration();
	}
}

function GetTime(shift, date, addHours) {
	
	var dateTime = date.split("T")[0];
	var hours;
	
	switch(shift) {
		case 1:
			dateTime += "T07:00:00.000";
			break;
		case 2:
			dateTime += "T15:00:00.000";
			break;
		case 3:
			dateTime += "T23:00:00.000";
			break;
	}

	return(moment(dateTime).add(addHours, 'hours').format("YYYY-MM-DDTHH:mm:ss.000z"));
}

function DistributeNewPlanConfiguration() {
	planArray         = [];
	PlanStepArray     = [];
	PlanMachineArray  = [];
	PlanMeasureArray  = [];
	PlanAssetArray    = [];
	
	var newPlanConfigGuid = CreateGUID();
	planConfigGuid        = newPlanConfigGuid;
	
	var planConfigObj = {};
	
	planConfigObj.PlanConfig_GUID  = newPlanConfigGuid;
	planConfigObj.StartDate        = WeekBeginTime;
	planConfigObj.EndDate          = WeekEndTime;
	planConfigObj.Area_GUID        = area_GF;
	planConfigObj.Zone_GUID        = zone_GF;
	planConfigObj.Location_GUID    = locationComboGuid;
	planConfigObj.CreatedBy        = UserData[0].PersonGUID;
	planConfigObj.IsActive         = true;
	planConfigObj.Created          = moment().format("YYYY-MM-DDTHH:mm:ss.000z");
	planConfigObj.Modified         = moment().format("YYYY-MM-DDTHH:mm:ss.000z");
	planConfigObj.CreatedBy		   = UserData[0].PersonGUID;
	
	for(var i = 0; i < 7; i++) {
		for(var j = 0; j < 3; j++) {
			if(!(i == 6 && j == 2)) {
				var planObj = {};
				var newPlanGuid = CreateGUID();
				
				planObj.PlanConfig_GUID  = newPlanConfigGuid;
				planObj.Plan_GUID        = newPlanGuid;
				planObj.MineProcess_GUID = null;
				planObj.Method_GUID      = null;
				planObj.Material_Type	 = null;
				planObj.Area_GUID        = area_GF;
				planObj.Zone_GUID        = zone_GF;
				planObj.Location_GUID    = locationComboGuid;
				planObj.Shiftdate        = moment(WeekBeginTime).add(i,'days').format("YYYY-MM-DDTHH:mm:ss.000z");
				planObj.Shift            = j+1;
				planObj.IsActive         = true;
				planObj.Created          = moment().format("YYYY-MM-DDTHH:mm:ss.000z");
				planObj.Modified         = moment().format("YYYY-MM-DDTHH:mm:ss.000z");
				planObj.CreatedBy	     = UserData[0].PersonGUID;
				
				planArray.push(planObj);
			}
		}
	}
	
	for(var key in planStepConfigArray) {
		var stepObj         = {};
		var newPlanStepGuid = CreateGUID();
		var shift_date      = planStepConfigArray[key].Shiftdate;
		var shift           = planStepConfigArray[key].Shift;
		var method_guid     = planStepConfigArray[key].Method_GUID;
		var process_guid    = planStepConfigArray[key].MineProcess_GUID;
		var material_type	= planStepConfigArray[key].Material_Type;
		var newPlanGuid;
		
		for(var key2 in planArray) {
			if(planArray[key2].Shiftdate == shift_date && planArray[key2].Shift == shift) {				
				newPlanGuid = planArray[key2].Plan_GUID;
				planArray[key2].Method_GUID      = method_guid;
				planArray[key2].MineProcess_GUID = process_guid;
				planArray[key2].Material_Type	 = material_type;
			}
		}
		
		stepObj.PlanStep_GUID      = newPlanStepGuid;
		stepObj.Plan_GUID          = newPlanGuid
		stepObj.Step_GUID          = planStepConfigArray[key].Step_GUID;
		stepObj.Ordinal            = planStepConfigArray[key].Ordinal;
		stepObj.EstimatedDuration  = planStepConfigArray[key].Duration;
		stepObj.IsActive           = true;
		stepObj.StartTime          = planStepConfigArray[key].StartTime;
		stepObj.EndTime            = planStepConfigArray[key].EndTime;
		stepObj.CalculatedDuration = null;
		stepObj.LastUpdatedBy      = UserData[0].PersonGUID;
		stepObj.Created            = moment().format("YYYY-MM-DDTHH:mm:ss.000z");
		stepObj.Modified           = moment().format("YYYY-MM-DDTHH:mm:ss.000z");
		stepObj.Obsolete           = moment().format("9999-12-31T00:00:00.000z");
		stepObj.CreatedBy	       = UserData[0].PersonGUID;

		PlanStepArray.push(stepObj);
		
		if(planStepConfigArray[key].Machine_GUID) {
		
			var dataObj = {};
			
			dataObj.Plan_StepMachine_GUID = CreateGUID();
			dataObj.PlanStep_GUID         = newPlanStepGuid;
			dataObj.Plan_GUID             = newPlanGuid;
			dataObj.Machine_GUID          = planStepConfigArray[key].Machine_GUID;
			dataObj.LastUpdatedBy         = UserData[0].PersonGUID;
			dataObj.IsActive              = true;
			dataObj.Created               = moment().format("YYYY-MM-DDTHH:mm:ss.000z");
			dataObj.Modified              = moment().format("YYYY-MM-DDTHH:mm:ss.000z");
			dataObj.Obsolete              = moment().format("9999-12-31T00:00:00.000z");
			dataObj.CreatedBy	          = UserData[0].PersonGUID;

			PlanMachineArray.push(dataObj);
		}

		var measureIndex = 0;
		while (planStepConfigArray[key]["Measure_GUID" + measureIndex]) {
			if(planStepConfigArray[key]["Measure_GUID" + measureIndex] != "") {
				var dataObj = {};
				
				dataObj.Plan_StepMeasure_GUID = CreateGUID();
				dataObj.Plan_GUID             = newPlanGuid;
				dataObj.PlanStep_GUID         = newPlanStepGuid;
				dataObj.Machine_GUID          = planStepConfigArray[key].Machine_GUID;
				dataObj.Measure_GUID          = planStepConfigArray[key]["Measure_GUID" + measureIndex];
				dataObj.PlannedValue          = planStepConfigArray[key]["Planned_Value" + measureIndex];
				dataObj.LastUpdatedBy         = UserData[0].PersonGUID;
				dataObj.IsActive              = true;
				dataObj.Created               = moment().format("YYYY-MM-DDTHH:mm:ss.000z");
				dataObj.Modified              = moment().format("YYYY-MM-DDTHH:mm:ss.000z");
				dataObj.Obsolete              = moment().format("9999-12-31T00:00:00.000z");
				dataObj.CreatedBy	          = UserData[0].PersonGUID;
				
				if(planStepConfigArray[key].Machine_GUID) {
					dataObj.Machine_GUID = planStepConfigArray[key].Machine_GUID;
				}
				
				PlanMeasureArray.push(dataObj);
				measureIndex++;
			}
		}

		if(planStepConfigArray[key].Operator_GUID) {
			var dataObj = {};
			
			dataObj.PlanAsset_GUID  = CreateGUID();
			dataObj.Plan_GUID       = newPlanGuid;
			dataObj.PlanStep_GUID   = newPlanStepGuid;
			dataObj.Machine_GUID    = planStepConfigArray[key].Machine_GUID;
			dataObj.Employee_GUID   = planStepConfigArray[key].Operator_GUID;
			dataObj.IsOperator      = true;
			dataObj.IsHelper        = false;
			dataObj.IsActive        = true;
			dataObj.Created         = moment().format("YYYY-MM-DDTHH:mm:ss.000z");
			dataObj.Modified        = moment().format("YYYY-MM-DDTHH:mm:ss.000z");
			dataObj.Obsolete        = moment().format("9999-12-31T00:00:00.000z");
			dataObj.CreatedBy		= UserData[0].PersonGUID;
			
			PlanAssetArray.push(dataObj);
		}

		if(planStepConfigArray[key].Helper_GUID) {
			var dataObj = {};
			
			dataObj.PlanAsset_GUID  = CreateGUID();
			dataObj.Plan_GUID       = newPlanGuid;
			dataObj.PlanStep_GUID   = newPlanStepGuid;
			dataObj.Machine_GUID    = planStepConfigArray[key].Machine_GUID;
			dataObj.Employee_GUID   = planStepConfigArray[key].Helper_GUID;
			dataObj.IsOperator      = false;
			dataObj.IsHelper        = true;
			dataObj.IsActive        = true;
			dataObj.Created         = moment().format("YYYY-MM-DDTHH:mm:ss.000z");
			dataObj.Modified        = moment().format("YYYY-MM-DDTHH:mm:ss.000z");
			dataObj.Obsolete        = moment().format("9999-12-31T00:00:00.000z");
			dataObj.CreatedBy	    = UserData[0].PersonGUID;
			
			PlanAssetArray.push(dataObj);
		}
	}

	SubmitToPlanConfig(planConfigObj);
}

function SubmitToPlanConfig(planConfigObj) {

	var jsonData = {
		 "fields": planConfigObj
	};
	
	$.ajax ({
		headers: {
			"Content-Type": "application/json"
		},
		url: ruIP + ruPort + planningDB + planningEN + "create/trans/PlanConfig",
		type: "POST",
		data: JSON.stringify(jsonData),
		success: function(){
			SubmitToPlan();
		},
		error: function(){
			DisplayAlert(languagePack.message.error,languagePack.message.recordsNotStored);
		}
	});
}

function SubmitToPlan() {
	if(planArray.length > 0) {
		var jsonData = {
			 "fields": planArray
		};
		
		$.ajax ({
			headers: {
				"Content-Type": "application/json"
			},
			url: ruIP + ruPort + planningDB + planningEN + "create/bulk/trans/Plan",
			type: "POST",
			data: JSON.stringify(jsonData),
			success: function(){
				SubmitToPlanStepDetail();
			},
			error: function(){
				DisplayAlert(languagePack.message.error,languagePack.message.recordsNotStored);
			}
		});
	}
	else {
		SubmitToPlanStepDetail();
	}
}

function SubmitToPlanStepDetail() {
	if(PlanStepArray.length > 0) {
		var jsonData = {
			 "fields": PlanStepArray
		};
		
		$.ajax ({
			headers: {
				"Content-Type": "application/json"
			},
			url: ruIP + ruPort + planningDB + planningEN + "create/bulk/trans/Plan_StepDetail",
			type: "POST",
			data: JSON.stringify(jsonData),
			success: function(){
				SubmitToPlanStepMachine();
			},
			error: function(){
				DisplayAlert(languagePack.message.error,languagePack.message.recordsNotStored);
			}
		});
	}
	else {
		SubmitToPlanStepMachine();
	}
}

function SubmitToPlanStepMachine() {
	if(PlanMachineArray.length > 0) {
		var jsonData = {
			 "fields": PlanMachineArray
		};
		
		$.ajax ({
			headers: {
				"Content-Type": "application/json"
			},
			url: ruIP + ruPort + planningDB + planningEN + "create/bulk/trans/Plan_StepMachine",
			type: "POST",
			data: JSON.stringify(jsonData),
			success: function(){
				SubmitToPlanAsset();
			},
			error: function(){
				DisplayAlert(languagePack.message.error,languagePack.message.recordsNotStored);
			}
		});
	}
	else {
		SubmitToPlanAsset();
	}
}

function SubmitToPlanAsset() {
	if(PlanAssetArray.length > 0) {
		var jsonData = {
			 "fields": PlanAssetArray
		};
		
		$.ajax ({
			headers: {
				"Content-Type": "application/json"
			},
			url: ruIP + ruPort + planningDB + planningEN + "create/bulk/trans/Plan_Asset",
			type: "POST",
			data: JSON.stringify(jsonData),
			success: function(){
				SubmitToPlanStepMeasure();
			},
			error: function(){
				DisplayAlert(languagePack.message.error,languagePack.message.recordsNotStored);
			}
		});
	}
	else {
		SubmitToPlanStepMeasure();
	}
}

function SubmitToPlanStepMeasure() {	
	if(PlanMeasureArray.length > 0) {
		var jsonData = {
			 "fields": PlanMeasureArray
		};
		
		$.ajax ({
			headers: {
				"Content-Type": "application/json"
			},
			url: ruIP + ruPort + planningDB + planningEN + "create/bulk/trans/Plan_StepMeasure",
			type: "POST",
			data: JSON.stringify(jsonData),
			success: function(){
				DisplayAlert(languagePack.message.success,languagePack.message.recordsStored);
				FindPlanConfigs();
			},
			error: function(){
				DisplayAlert(languagePack.message.error,languagePack.message.recordsNotStored);
			}
		});
	}
	else {
		DisplayAlert(languagePack.message.success,languagePack.message.recordsStored);
		FindPlanConfigs();
	}
	
	HidePlanConfigWindow();
}



















