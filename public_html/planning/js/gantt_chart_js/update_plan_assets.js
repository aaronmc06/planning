/*============================================================
	Property of:		MISOM TECHNOLOGIES
	Developer:			AARON MCCOLOUGH
	Application Name:	FARA_FRESNILLO
	Directory:			FARA_FRESNILLO/PLANNING/JS/GANTT_CHART_JS
	File Name:			update_plan_assets.js
=============================================================*/

var UpdateMetricsArray = [];

function UpdatePlanStep(element) {
	var oldPlanStepGuid = $(element).parent().attr("Plan_Step_GUID");
	
	DisplayConfirm(languagePack.message.confirm, languagePack.message.replaceStep,
		function() {	
	
			var jsonData = {
				 "key": { "PlanStep_GUID":oldPlanStepGuid },
				 "fields": { "IsActive":0, "LastUpdatedBy":UserData[0].Person_GUID, "Modified": moment().format("YYYY-MM-DDTHH:mm:ss.000z") }
			};
			
			$.ajax ({
				headers: {
					"Content-Type": "application/json"
				},
				url: ruIP + ruPort + planningDB + planningEN + "update/trans/Plan_StepDetail",
				type: "POST",
				data: JSON.stringify(jsonData),
				success: function(){
					DisplayAlert(languagePack.message.success, languagePack.message.recordsUpdated);
				},
				error: function(){
					DisplayAlert(languagePack.message.error, languagePack.message.recordsNotUpdated);
				}
			});
		}
	);	
}

function UpdatePlanStepDuration(element, planStep_guid) {
	var newDuration     = $(element).parent().prev().prev().val();
	
	for(var key in ganttSteps) {
		if(ganttSteps[key].PlanStep_GUID == planStep_guid) {
			ganttSteps[key].EstimatedDuration = newDuration;
		}
	}
	
	if(!$(element).hasClass("buttonInactive")) {
		DisplayConfirm(languagePack.message.confirm, languagePack.message.updateDurationStep,
			function() {	
		
				var jsonData = {
					 "key": { "PlanStep_GUID":planStep_guid },
					 "fields": { "LastUpdatedBy":UserData[0].Person_GUID, "Modified": moment().format("YYYY-MM-DDTHH:mm:ss.000z"), "EstimatedDuration": newDuration }
				};
				
				$.ajax ({
					headers: {
						"Content-Type": "application/json"
					},
					url: ruIP + ruPort + planningDB + planningEN + "update/trans/Plan_StepDetail",
					type: "POST",
					data: JSON.stringify(jsonData),
					success: function(){
						DisplayAlert(languagePack.message.success, languagePack.message.recordsUpdated);
						$(element).closest(".stepAsset").attr("Plan_Step_GUID", newDuration);
						$(element).addClass("buttonInactive");
					},
					error: function(){
						DisplayAlert(languagePack.message.error, languagePack.message.recordsNotUpdated);
					}
				});
			}
		);
	}
}

function InsertNewPlanStep(planStep_guid, step_guid) {
	var dataObj = {};
	
	for(var key in ganttSteps) {
		if(ganttSteps[key].PlanStep_GUID == planStep_guid) {
			dataObj.PlanStep_GUID     = CreateGUID();
			dataObj.Plan_GUID         = ganttSteps[key].Plan_GUID;
			dataObj.Step_GUID         = step_guid;
			dataObj.Ordinal           = ganttSteps[key].Ordinal;
			dataObj.EstimatedDuration = ganttSteps[key].EstimatedDuration;
			dataObj.StartTime         = ganttSteps[key].StartTime;
			dataObj.EndTime           = ganttSteps[key].EndTime;
			dataObj.LastUpdatedBy     = UserData[0].PersonGUID;
			dataObj.Created           = moment().format("YYYY-MM-DDTHH:mm:ss.000z");
			dataObj.Modified          = moment().format("YYYY-MM-DDTHH:mm:ss.000z");
			dataObj.Obsolete          = moment().format("9999-12-31T00:00:00.000z");
			dataObj.IsActive          = true;
			dataObj.CreatedBy         = UserData[0].PersonGUID;
		}
	}
	
	var jsonData = {
		 "fields": dataObj
	};
	
	$.ajax ({
		headers: {
			"Content-Type": "application/json"
		},
		url: ruIP + ruPort + planningDB + planningEN + "create/trans/Plan_StepDetail",
		type: "POST",
		data: JSON.stringify(jsonData),
		success: function(){
			DisplayAlert(languagePack.message.success, languagePack.message.recordsUpdated);
		},
		error: function(){
			DisplayAlert(languagePack.message.error, languagePack.message.recordsNotUpdated);
		}
	});	
}

function UpdateMeasures(element) {
	if(!$(element).hasClass("buttonInactive")) {
		UpdateMetricsArray = [];
		
		var metricsContainer = $(element).closest(".measureAssets");
		
		$(metricsContainer).find(".metricsTable").each(function(index) {
			var dataObj = {};		
			var apiKeyObj = {};
			
			apiKeyObj.Plan_StepMeasure_GUID = $(this).attr('PlanStepMeasureGUID');
			dataObj.APIKEY                  = apiKeyObj;
			
			dataObj.PlannedValue            = $(this).find(".metricPlannedValue").val();
			
			UpdateMetricsArray.push(dataObj);
		});
		
		SubmitNewValues(element);
	}
}

function SubmitNewValues(element) {
	if(UpdateMetricsArray.length > 0) {
		var jsonData = {
			 "fields": UpdateMetricsArray
		};
		
		$.ajax ({
			headers: {
				"Content-Type": "application/json"
			},
			url: ruIP + ruPort + planningDB + planningEN + "update/bulk/trans/Plan_StepMeasure",
			type: "POST",
			data: JSON.stringify(jsonData),
			success: function(){
				DisplayAlert(languagePack.message.success, languagePack.message.recordsUpdated);
				
				ResetGanttSteps(element);
				
			},
			error: function(){
				DisplayAlert(languagePack.message.error, languagePack.message.recordsNotStored);
			}
		});
	}	
}

function UpdateStepMachine(element, plan_stepMachine_guid, plan_step_guid) {
	var plan_guid    = $(element).closest("td").find(".tdCont").attr("PlanGUID");
	oldMachineValue  = $(element).parent().attr("MachineGUID");
	
	if(!$(element).hasClass("buttonInactive")) {
		if(newMachineValue != "" && newMachineValue != oldMachineValue) {
			DisplayConfirm(languagePack.message.confirm, languagePack.message.replaceMachine,
				function() {
					var jsonData = {
						 "key": { "Plan_StepMachine_GUID":plan_stepMachine_guid },
						 "fields": { "Machine_GUID":newMachineValue, "Modified": moment(new Date()).format("YYYY-MM-DDTHH:mm:ss.000z") }
					};
					
					$.ajax ({
						headers: {
							"Content-Type": "application/json"
						},
						url: ruIP + ruPort + planningDB + planningEN + "update/trans/Plan_StepMachine",
						type: "POST",
						data: JSON.stringify(jsonData),
						success: function(){
							UpdateStepAssets(element, plan_stepMachine_guid, plan_step_guid, plan_guid);
						},
						error: function(){
							DisplayAlert(languagePack.message.error, languagePack.message.recordsNotUpdated);
						}
					});
				}
			);
		}
		else {
			UpdateStepAssets(element, plan_step_guid, plan_guid);
		}
	}
}

function UpdateStepAssets(element, plan_step_guid, plan_guid) {
	var createdStepAssetArray = [];
	var updatedStepAssetArray = [];
	
	if(newMachineValue != "" && newMachineValue != oldMachineValue) {
		
		for(var key in ganttAssets) {
			var dataObj   = {};
			var apiKeyObj = {};
			apiKeyObj.PlanAsset_GUID = ganttAssets[key].PlanAsset_GUID;
			
			dataObj.APIKEY   = apiKeyObj;
			dataObj.IsActive = false;
			
			updatedStepAssetArray.push(dataObj);
		}
	}
	else if(ganttAssets.length > 0) {
		for(var j in ganttAssets) {
			if(ganttAssets[j].IsOperator) {
				if(newOperatorValue != "" && newOperatorValue != oldOperatorValue) {
					var dataObj   = {};
					var apiKeyObj = {};
					apiKeyObj.PlanAsset_GUID = ganttAssets[j].PlanAsset_GUID;
					
					dataObj.APIKEY   = apiKeyObj;
					dataObj.IsActive = false;
					
					updatedStepAssetArray.push(dataObj);			
				}
			}			
			if(ganttAssets[j].IsHelper) {
				if(newHelperValue != "" && newHelperValue != oldHelperValue) {
					var dataObj   = {};
					var apiKeyObj = {};
					apiKeyObj.PlanAsset_GUID = ganttAssets[j].PlanAsset_GUID;
					
					dataObj.APIKEY   = apiKeyObj;
					dataObj.IsActive = false;
					
					updatedStepAssetArray.push(dataObj);			
				}
			}
		}		
	}	

	if(newOperatorValue != "" && newOperatorValue != oldOperatorValue) {
		var dataObj   = {};
		
		dataObj.PlanAsset_GUID = CreateGUID();
		dataObj.Plan_GUID      = plan_guid;
		dataObj.PlanStep_GUID  = plan_step_guid;
		dataObj.Machine_GUID   = oldMachineValue;
		dataObj.Employee_GUID  = newOperatorValue;
		dataObj.IsOperator     = true;
		dataObj.IsHelper       = false;
		dataObj.IsActive       = true;
		dataObj.Created        = moment().format("YYYY-MM-DDTHH:mm:ss.000z");
		dataObj.Modified       = moment().format("YYYY-MM-DDTHH:mm:ss.000z");
		dataObj.Obsolete       = moment().format("9999-12-31T00:00:00.000z");
		
		if(newMachineValue != "") {			
			dataObj.Machine_GUID = newMachineValue;
		}
		
		createdStepAssetArray.push(dataObj);			
	}
	
	if(newHelperValue != "" && newHelperValue != oldHelperValue) {
		var dataObj   = {};
		
		dataObj.PlanAsset_GUID = CreateGUID();
		dataObj.Plan_GUID      = plan_guid;
		dataObj.PlanStep_GUID  = plan_step_guid;
		dataObj.Machine_GUID   = oldMachineValue;
		dataObj.Employee_GUID  = newHelperValue;
		dataObj.IsOperator     = false;
		dataObj.IsHelper       = true;
		dataObj.IsActive       = true;
		dataObj.Created        = moment().format("YYYY-MM-DDTHH:mm:ss.000z");
		dataObj.Modified       = moment().format("YYYY-MM-DDTHH:mm:ss.000z");
		dataObj.Obsolete       = moment().format("9999-12-31T00:00:00.000z");
		dataObj.CreatedBy      = UserData[0].PersonGUID
		
		if(newMachineValue != "") {			
			dataObj.Machine_GUID = newMachineValue;
		}
		
		createdStepAssetArray.push(dataObj);			
	}
	
	CreatePlanAssets(createdStepAssetArray, updatedStepAssetArray, element, plan_step_guid, plan_guid);
}

function CreatePlanAssets(createdStepAssetArray, updatedStepAssetArray, element, plan_step_guid, plan_guid) {
	if(createdStepAssetArray.length > 0) {
		var jsonData2 = {
			 "fields": createdStepAssetArray
		};
		
		$.ajax ({
			headers: {
				"Content-Type": "application/json"
			},
			url: ruIP + ruPort + planningDB + planningEN + "create/bulk/trans/Plan_Asset",
			type: "POST",
			data: JSON.stringify(jsonData2),
			success: function(){
				UpdatePlanAssets(updatedStepAssetArray, element, plan_step_guid, plan_guid);
				DisplayAlert(languagePack.message.success, languagePack.message.recordsStored);
			},
			error: function(){
				DisplayAlert(languagePack.message.error, languagePack.message.recordsUpdated);
			}
		});
	}
	else {
		UpdatePlanAssets(updatedStepAssetArray, element, plan_step_guid, plan_guid);
	}
}

function UpdatePlanAssets(updatedStepAssetArray, element, plan_step_guid, plan_guid) {
	if(updatedStepAssetArray.length > 0) {
		var jsonData = {
			 "fields": updatedStepAssetArray
		};

		$.ajax ({
			headers: {
				"Content-Type": "application/json"
			},
			url: ruIP + ruPort + planningDB + planningEN + "update/bulk/trans/Plan_Asset",
			type: "POST",
			data: JSON.stringify(jsonData),
			success: function(){
				UpdatePlanDelays(element, plan_step_guid, plan_guid);
			}
		});
	}
	else {		
		UpdatePlanDelays(element, plan_step_guid, plan_guid);
	}
}

function UpdatePlanDelays(element, plan_step_guid, plan_guid) {
	var newDelayObj = {};
	var oldDelayObj = {};
	var delayComments = $(element).prev().prev().val();

	if(newDelayHoursValue != "" && newDelayHoursValue != oldDelayHoursValue) {
		newDelayObj.PlanDelay_GUID = CreateGUID();
		newDelayObj.Plan_GUID      = plan_guid;
		newDelayObj.PlanStep_GUID  = plan_step_guid;
		newDelayObj.Machine_GUID   = oldMachineValue;
		newDelayObj.DelayType      = null;
		newDelayObj.DelayDuration  = newDelayHoursValue;
		newDelayObj.Comments       = delayComments;
		newDelayObj.IsActive       = true;
		newDelayObj.Created        = moment().format("YYYY-MM-DDTHH:mm:ss.000z");
		newDelayObj.Modified       = moment().format("YYYY-MM-DDTHH:mm:ss.000z");
		newDelayObj.Obsolete       = moment().format("9999-12-31T00:00:00.000z");
		newDelayObj.CreatedBy      = UserData[0].PersonGUID;
	}
	
	if(ganttDelays.length > 0) {
		oldDelayObj.PlanDelay_GUID = ganttDelays[0].PlanDelay_GUID;
		oldDelayObj.IsActive       = false;	
		oldDelayObj.Modified       = moment().format("YYYY-MM-DDTHH:mm:ss.000z");
	}
	
	if(oldDelayObj.PlanDelay_GUID) {
		
		var jsonData = {
			"key": { "PlanDelay_GUID":oldDelayObj.PlanDelay_GUID },
			"fields": { "IsActive": oldDelayObj.IsActive, "Modified": oldDelayObj.Modified }
		};

		$.ajax ({
			headers: {
				"Content-Type": "application/json"
			},
			url: ruIP + ruPort + planningDB + planningEN + "update/trans/Plan_Delay",
			type: "POST",
			data: JSON.stringify(jsonData),
			success: function(){
				CreateNewPlanDelay(newDelayObj, element);
			},
			error: function(){
				DisplayAlert(languagePack.message.error, languagePack.message.recordsNotUpdated);
			}
		});
	}
	else {
		CreateNewPlanDelay(newDelayObj, element);
	}
}

function CreateNewPlanDelay(newDelayObj, element) {
	if(newDelayObj.PlanDelay_GUID) {
		var jsonData2 = {
			 "fields": newDelayObj
		};

		$.ajax ({
			headers: {
				"Content-Type": "application/json"
			},
			url: ruIP + ruPort + planningDB + planningEN + "create/trans/Plan_Delay",
			type: "POST",
			data: JSON.stringify(jsonData2),
			success: function(){
				ResetGanttSteps(element);
				DisplayAlert(languagePack.message.success, languagePack.message.recordsStored);				
			},
			error: function(){
				DisplayAlert(languagePack.message.error, languagePack.message.recordsNotUpdated);
			}
		});
	}
	else {
		ResetGanttSteps(element);
	}
}

function ResetGanttSteps(element) {
	
	var stepButton = $(element).closest('td').find('.tdCont');
	
	stepButton.click();
	setTimeout(function() {
		stepButton.click();
	},200);
}

function RemovePlan(element) {
	
	DisplayConfirm(languagePack.message.confirm, languagePack.message.removeLocationPlan,
		function() {
			var planConfig_guid = $(element).prev().attr("PlanConfigGUID");
			var location_guid   = $(element).prev().attr("LocationGUID");			
			
			var dataObj = {};
			
			dataObj.PlanConfig_GUID = planConfig_guid;
			
			var params = {
				"params":["@PlanConfigGUID,string,PlanConfig_GUID"],
				"schema":"dbo",
				"procedure":"Deactivate_Plan_Elements"
			};
			
			var queryString = objectToQueryString(params);

			$.ajax ({
				headers: {
					"Content-Type": "application/json"
				},
				url: ruIP + ruPort + planningDB + planningEN + 'procedure/action/dbo/Deactivate_Plan_Elements?' + queryString,
				type: "POST",
				data: JSON.stringify(dataObj),
				success: function(){
					DisplayAlert(languagePack.message.success, languagePack.message.recordsUpdated);
					FindPlanConfigs();
				},
				error: function(){
					DisplayAlert(languagePack.message.error, languagePack.message.recordsNotUpdated);
				}
			});
		}
	);
}

function RemovePlanStep(element) {
	if(!$(element).hasClass("buttonInactive")) {
		DisplayConfirm(languagePack.message.confirm, languagePack.message.removeLocationPlan,
			function() {
				var planStep_guid = $(element).closest(".assetBox").attr("Plan_Step_GUID");			
				
				var dataObj = {};
				
				dataObj.PlanStep_GUID = planStep_guid;
				
				var params = {
					"params":["@PlanStep_GUID,string,PlanStep_GUID"],
					"schema":"dbo",
					"procedure":"Deactivate_Plan_Step"
				};
				
				var queryString = objectToQueryString(params);
				
				$.ajax ({
					headers: {
						"Content-Type": "application/json"
					},
					url: ruIP + ruPort + planningDB + planningEN + 'procedure/action/dbo/Deactivate_Plan_Step?' + queryString,
					type: "POST",
					data: JSON.stringify(dataObj),
					success: function(){
						DisplayAlert(languagePack.message.success, languagePack.message.recordsUpdated);
						FindPlanConfigs();
					},
					error: function(){
						DisplayAlert(languagePack.message.error, languagePack.message.recordsNotUpdated);
					}
				});
			}
		);
	}	
}

function RemovePlanMethod(element) {
	var successes = 0;
	var errors    = 0;
	
	if(!$(element).hasClass("buttonInactive")) {
		
		if($(element).prev().hasClass("expanded")) {
			$(element).prev().click();
			$(element).prev().click();
		}
		else {			
			$(element).prev().click();
		}
		
		DisplayConfirm(languagePack.message.confirm, languagePack.message.removeLocationPlan,
			function() {
				var count = 0;
				for(var key in ganttSteps) {
					var planStep_guid = ganttSteps[key].PlanStep_GUID;
					
					var dataObj = {};
					
					dataObj.PlanStep_GUID = planStep_guid;
					
					var params = {
						"params":["@PlanStep_GUID,string,PlanStep_GUID"],
						"schema":"dbo",
						"procedure":"Deactivate_Plan_Step"
					};
					
					var queryString = objectToQueryString(params);

					$.ajax ({
						headers: {
							"Content-Type": "application/json"
						},
						url: ruIP + ruPort + planningDB + planningEN + 'procedure/action/dbo/Deactivate_Plan_Step?' + queryString,
						type: "POST",
						data: JSON.stringify(dataObj),
						success: function(){
							successes++;
							count++;
							if(count >= ganttSteps.length) {
								FindPlanConfigs();
							}
						},
						error: function(){
							errors++;
							count++;
							if(count >= ganttSteps.length) {
								FindPlanConfigs();
							}
						}
					});
				}				
			}
		);
	}	
}













