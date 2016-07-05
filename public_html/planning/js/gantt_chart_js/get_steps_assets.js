/*============================================================
	Property of:		MISOM TECHNOLOGIES
	Developer:			AARON MCCOLOUGH
	Application Name:	FARA_FRESNILLO
	Directory:			FARA_FRESNILLO/PLANNING/JS/GANTT_CHART_JS
	File Name:			get_steps_assets.js
=============================================================*/

var ganttSteps     = [];
var ganttMachines  = [];
var ganttAssets    = [];
var ganttMeasures  = [];
var ganttDelays    = [];

function FindSteps(method_guid, location_guid) {
	
	$("#gantt_chart").find("[MethodGUID='" + method_guid + "']").each(function() {
		if($(this).attr("MethodLocationGUID") == location_guid) {
			if($(this).hasClass("expanded")) {
				while($(this).parent().parent().next().hasClass("stepRow") && $(this).parent().parent().next().val(0)) {
					$(this).parent().parent().next().remove();
				}
			}
			else {
				ganttSteps = [];
			
				var jqxhrstep = $.getJSON(ruIP + ruPort + planningDB + planningEN + "read/dbo/v_PlanStepDetail?where=\"Zone_GUID = '" + zone_GF + "' AND Location_GUID = '" + location_guid + "' AND Method_GUID = '" + method_guid + "' AND Plan_StepDetail_IsActive = '1' AND StartTime >= '" + WeekBeginTime + "' AND StartTime <= '" + WeekEndTime + "' ORDER BY PlanConfig_GUID, StartTime, Ordinal ASC\"", function() {		
					ganttSteps = jQuery.parseJSON(jqxhrstep.responseText);
					
					for(var key in ganttSteps) {
						ganttSteps[key].StartTime = ganttSteps[key].StartTime.split("Z")[0];						
					}

					ExpandMethod(method_guid, location_guid);
				});
			}			
			$(this).toggleClass("expanded");
		}		
	});
}

function FindAssets(method_guid, planStep_guid, planStep_name, duration, column, element) {
		
	GetPlanDetail(planStep_guid);
	GanttStepDynamicList(method_guid);
	if($("#gantt_chart").find("[PlanStepGUID='" + planStep_guid + "']").hasClass("expanded")) {
		$("#gantt_chart").find("[PlanStepGUID='" + planStep_guid + "']").next().remove();
	}
	else {
		LockForService();
		
		ganttMachines  = [];
		ganttAssets    = [];

		var jqxhrmachines = $.getJSON(ruIP + ruPort + planningDB + planningEN + "read/dbo/v_PlanStepMachine?where=\"PlanStep_GUID = '" + planStep_guid + "' AND Plan_StepMachine_IsActive = '1'\"", function() {		
			ganttMachines = jQuery.parseJSON(jqxhrmachines.responseText);

			var jqxhrassets = $.getJSON(ruIP + ruPort + planningDB + planningEN + "read/dbo/v_PlanAsset?where=\"PlanStep_GUID = '" + planStep_guid + "' AND IsActive = '1' ORDER BY Plan_GUID, Machine_GUID, IsHelper ASC\"", function() {		
				ganttAssets = jQuery.parseJSON(jqxhrassets.responseText);
				
				var jqxhrdelays = $.getJSON(ruIP + ruPort + planningDB + planningEN + "read/trans/Plan_Delay?where=\"PlanStep_GUID = '" + planStep_guid + "' AND IsActive = '1'\"", function() {		
					ganttDelays = jQuery.parseJSON(jqxhrdelays.responseText);

					FindMeasures(planStep_guid, planStep_name, duration, column, element);
				});
			});	
		});
	}
	$("#gantt_chart").find("[PlanStepGUID='" + planStep_guid + "']").toggleClass("expanded");
}

function FindMeasures(planStep_guid, planStep_name, duration, column, element) {
	ganttMeasures = [];
	
	var jqxhrmeasures = $.getJSON(ruIP + ruPort + planningDB + planningEN + "read/dbo/v_PlanStepMeasure?where=\"PlanStep_GUID = '" + planStep_guid + "' AND IsActive = '1' ORDER BY MeasureDisplayName ASC\"", function() {
		ganttMeasures = jQuery.parseJSON(jqxhrmeasures.responseText);

		ExpandStep(planStep_guid, planStep_name, duration, column, element);
	});
}

















