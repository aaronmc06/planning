/*============================================================
	Property of:		MISOM TECHNOLOGIES
	Developer:			AARON MCCOLOUGH
	Application Name:	FARA_FRESNILLO
	Directory:			FARA_FRESNILLO/PLANNING/JS/PLAN_CONFIG_JS
	File Name:			submit_new_step.js
=============================================================*/

function UpdatePlanConfiguration(plan_guid) {
	PlanMeasureArray = [];
	PlanAssetArray   = [];
	
	var stepObj         = {};
	var machineObj      = {};
	
	var newPlanStepGuid = CreateGUID();
	var shift_date      = planStepConfigArray[0].Shiftdate;
	var shift           = planStepConfigArray[0].Shift;
	var method_guid     = planStepConfigArray[0].Method_GUID;
	var process_guid    = planStepConfigArray[0].MineProcess_GUID;
	
	stepObj.PlanStep_GUID      = newPlanStepGuid;
	stepObj.Plan_GUID          = plan_guid
	stepObj.Step_GUID          = planStepConfigArray[0].Step_GUID;
	stepObj.Ordinal            = planStepConfigArray[0].Ordinal;
	stepObj.EstimatedDuration  = planStepConfigArray[0].Duration;
	stepObj.IsActive           = true;
	stepObj.StartTime          = planStepConfigArray[0].StartTime;
	stepObj.EndTime            = planStepConfigArray[0].EndTime;
	stepObj.CalculatedDuration = null;
	stepObj.LastUpdatedBy      = UserData[0].PersonGUID;
	stepObj.Created            = moment().format("YYYY-MM-DDTHH:mm:ss.000z");
	stepObj.Modified           = moment().format("YYYY-MM-DDTHH:mm:ss.000z");
	stepObj.Obsolete           = moment().format("9999-12-31T00:00:00.000z");
	stepObj.CreatedBy          = UserData[0].PersonGUID;

	
	if(planStepConfigArray[0].Machine_GUID) {
		
		machineObj.Plan_StepMachine_GUID = CreateGUID();
		machineObj.PlanStep_GUID         = newPlanStepGuid;
		machineObj.Plan_GUID             = plan_guid;
		machineObj.Machine_GUID          = planStepConfigArray[0].Machine_GUID;
		machineObj.LastUpdatedBy         = UserData[0].PersonGUID;
		machineObj.IsActive              = true;
		machineObj.Created               = moment().format("YYYY-MM-DDTHH:mm:ss.000z");
		machineObj.Modified              = moment().format("YYYY-MM-DDTHH:mm:ss.000z");
		machineObj.Obsolete              = moment().format("9999-12-31T00:00:00.000z");
		machineObj.CreatedBy			 = UserData[0].PersonGUID;
	}

	var measureIndex = 0;
	while (planStepConfigArray[0]["Measure_GUID" + measureIndex]) {
		if(planStepConfigArray[0]["Measure_GUID" + measureIndex] != "") {
			var dataObj = {};
			
			dataObj.Plan_StepMeasure_GUID = CreateGUID();
			dataObj.Plan_GUID             = plan_guid;
			dataObj.PlanStep_GUID         = newPlanStepGuid;
			dataObj.Machine_GUID          = planStepConfigArray[0].Machine_GUID;
			dataObj.Measure_GUID          = planStepConfigArray[0]["Measure_GUID" + measureIndex];
			dataObj.PlannedValue          = planStepConfigArray[0]["Planned_Value" + measureIndex];
			dataObj.LastUpdatedBy         = UserData[0].PersonGUID;
			dataObj.IsActive              = true;
			dataObj.Created               = moment().format("YYYY-MM-DDTHH:mm:ss.000z");
			dataObj.Modified              = moment().format("YYYY-MM-DDTHH:mm:ss.000z");
			dataObj.Obsolete              = moment().format("9999-12-31T00:00:00.000z");
			dataObj.CreatedBy			  = UserData[0].PersonGUID;
			
			if(planStepConfigArray[0].Machine_GUID) {
				dataObj.Machine_GUID = planStepConfigArray[0].Machine_GUID;
			}
			
			PlanMeasureArray.push(dataObj);
			measureIndex++;
		}
	}

	if(planStepConfigArray[0].Operator_GUID) {
		var dataObj = {};
		
		dataObj.PlanAsset_GUID  = CreateGUID();
		dataObj.Plan_GUID       = plan_guid;
		dataObj.PlanStep_GUID   = newPlanStepGuid;
		dataObj.Machine_GUID    = planStepConfigArray[0].Machine_GUID;
		dataObj.Employee_GUID   = planStepConfigArray[0].Operator_GUID;
		dataObj.IsOperator      = true;
		dataObj.IsHelper        = false;
		dataObj.IsActive        = true;
		dataObj.Created         = moment().format("YYYY-MM-DDTHH:mm:ss.000z");
		dataObj.Modified        = moment().format("YYYY-MM-DDTHH:mm:ss.000z");
		dataObj.CreatedBy		= UserData[0].PersonGUID;
		
		PlanAssetArray.push(dataObj);
	}

	if(planStepConfigArray[0].Helper_GUID) {
		var dataObj = {};
		
		dataObj.PlanAsset_GUID  = CreateGUID();
		dataObj.Plan_GUID       = plan_guid;
		dataObj.PlanStep_GUID   = newPlanStepGuid;
		dataObj.Machine_GUID    = planStepConfigArray[0].Machine_GUID;
		dataObj.Employee_GUID   = planStepConfigArray[0].Helper_GUID;
		dataObj.IsOperator      = false;
		dataObj.IsHelper        = true;
		dataObj.IsActive        = true;
		dataObj.Created         = moment().format("YYYY-MM-DDTHH:mm:ss.000z");
		dataObj.Modified        = moment().format("YYYY-MM-DDTHH:mm:ss.000z");
		dataObj.Obsolete        = moment().format("9999-12-31T00:00:00.000z");
		dataObj.CreatedBy		= UserData[0].PersonGUID;
		
		PlanAssetArray.push(dataObj);
	}
	
	var jsonData = {
		 "key": { "Plan_GUID":plan_guid },
		 "fields": { "Method_GUID":method_guid, "MineProcess_GUID":process_guid, "Modified": moment().format("YYYY-MM-DDTHH:mm:ss.000z") }
	};
	
	var jsonData2 = {
		 "fields": stepObj
	};
	
	var jsonData3 = {
		 "fields": machineObj
	};
	
	$.ajax ({
		headers: {
			"Content-Type": "application/json"
		},
		url: ruIP + ruPort + planningDB + planningEN + "update/trans/Plan",
		type: "POST",
		data: JSON.stringify(jsonData),
		success: function(){
			
			$.ajax ({
				headers: {
					"Content-Type": "application/json"
				},
				url: ruIP + ruPort + planningDB + planningEN + "create/trans/Plan_StepDetail",
				type: "POST",
				data: JSON.stringify(jsonData2),
				success: function(){
					
					if(machineObj.Plan_StepMachine_GUID) {
					
						$.ajax ({
							headers: {
								"Content-Type": "application/json"
							},
							url: ruIP + ruPort + planningDB + planningEN + "create/trans/Plan_StepMachine",
							type: "POST",
							data: JSON.stringify(jsonData3),
							success: function(){
								SubmitToPlanAsset();							
							},
							error: function(){
								DisplayAlert(languagePack.message.error,languagePack.message.recordsNotUpdated);
							}
						});
					}
					else {
						SubmitToPlanAsset();						
					}
					
				},
				error: function(){
					DisplayAlert(languagePack.message.error,languagePack.message.recordsNotUpdated);
				}
			});
			
		},
		error: function(){
			DisplayAlert(languagePack.message.error,languagePack.message.recordsNotUpdated);
		}
	});
}













