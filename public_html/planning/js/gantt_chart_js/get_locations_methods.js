/*============================================================
	Property of:		MISOM TECHNOLOGIES
	Developer:			AARON MCCOLOUGH
	Application Name:	FARA_FRESNILLO
	Directory:			FARA_FRESNILLO/PLANNING/JS/GANTT_CHART_JS
	File Name:			get_locations_methods.js
=============================================================*/

var ganttLocations			= [];
var ganttLocationMethods	= [];
var ganttShifts				= [];
var shiftsFound             = false;

function FindShifts() {
	if(!shiftsFound) {
		ganttShifts = [];
		var startShift = moment(WeekBeginTime).add(7, 'hours');
		
		for(var i = 0; i < 20; i++) {
			ganttShifts.push(moment(startShift).add((i * 8), 'hours').format("YYYY-MM-DDTHH:00:00.000"));
		}
		
		FindPlanConfigs();
		shiftsFound = true;
	}
}

function FindPlanConfigs() {
	
	planStepConfigArray = [];
	stepConfigArray     = [];
	
	var jqxhrplanconfigs = $.getJSON(ruIP + ruPort + planningDB + planningEN + "read/trans/PlanConfig?where=\"IsActive = '1' And Area_GUID = '" + area_GF + "' And Zone_GUID = '" + zone_GF + "' And StartDate >= '" + WeekBeginTime + "' AND EndDate <= '" + WeekEndTime + "'\"", function() {
		var planConfigData = jQuery.parseJSON(jqxhrplanconfigs.responseText);		
		
		$("#location_select option").each(function() {
			$(this).attr("disabled", false);
		});
		
		for(var key in planConfigData) {
			$("#location_select option").each(function() {
				if($(this).val() == planConfigData[key].Location_GUID) {
					$(this).attr("disabled","disabled");
				}
			});
		}
	
		var jqxhrsuperintendents = $.getJSON(ruIP + ruPort + planningDB + planningEN + "read/dbo/v_PersonAreaRole?where=\"Person_IsActive = '1' AND RoleDisplayName = 'Superintendent' AND Area_GUID = '" + area_GF + "'\"", function() {
			superintendentData = jQuery.parseJSON(jqxhrsuperintendents.responseText);
			
			var jqxhrwkflow = $.getJSON(ruIP + ruPort + planningDB + planningEN + "read/dbo/v_WkFlow_Detail?where=\"IsActive = '1' AND Area_GUID = '" + area_GF + "' AND Zone_GUID = '" + zone_GF + "' AND StartDate >= '" + WeekBeginTime + "' AND EndDate <= '" + WeekEndTime + "' AND IsCurrentStatus = '1'\"", function() {
				WkFlowData = jQuery.parseJSON(jqxhrwkflow.responseText);
				UpdateLineUpReadyStatus();
			});
		});	
	});
}

function FindLocations() {
	ganttLocations = [];

	var jqxhrplan = $.getJSON(ruIP + ruPort + planningDB + planningEN + "read/dbo/v_Plan?where=\"Area_GUID = '" + area_GF + "' AND Zone_GUID = '" + zone_GF + "' AND IsActive = '1' AND Shiftdate >= '" + WeekBeginTime + "' AND Shiftdate <= '" + WeekEndTime + "' ORDER BY LocationDisplayName, ShiftDate ASC\"", function() {
		var planData = jQuery.parseJSON(jqxhrplan.responseText);
		
		if(planData.length > 0) {

			var temp_location_guid    = "";
			var temp_location_name    = "";
			var temp_location_length  = 0;
			var locationObj           = {};
			var temp_planStepGuid     = "";
			
			for(var key in planData) {
				
				// LOCATION CONDITIONS
				if(!(temp_location_guid == '' || planData[key].Location_GUID == temp_location_guid)) {
					locationObj.Location_GUID       = temp_location_guid;
					locationObj.LocationDisplayName = temp_location_name;
					locationObj.ShiftLength         = 20; //temp_location_length;
					locationObj.PlanConfig_GUID     = temp_planConfig_guid;
					ganttLocations.push(locationObj);

					locationObj = {};
					temp_location_length = 0;
				}				
				temp_location_length++;
				
				temp_planConfig_guid = planData[key].PlanConfig_GUID;
				temp_location_guid   = planData[key].Location_GUID;
				temp_location_name   = planData[key].LocationDisplayName;
			}
			
			//FINAL LOCATION ADDED TO ARRAY
			locationObj.Location_GUID       = temp_location_guid;
			locationObj.LocationDisplayName = temp_location_name;
			locationObj.ShiftLength         = 20; //temp_location_length;
			locationObj.PlanConfig_GUID     = temp_planConfig_guid;
			ganttLocations.push(locationObj);
			
			$('#calendar_location_select').html("<option>"+languagePack.common.selectOption+"</option>");
			var calendarLocationSelect = document.getElementById('calendar_location_select');			

			for(var key in ganttLocations) {
				calendarLocationSelect.options[calendarLocationSelect.options.length] = new Option(ganttLocations[key].LocationDisplayName, ganttLocations[key].Location_GUID);
			}
			
			AppendLocations();
		}
		else {
			$("#submit_rquest_btn").attr("canSubmit", false);
			$("#submit_rquest_btn").addClass("buttonInactive");
			
			$("#gantt_chart_container").html('<div id="gantt_no_data"><p>[ '+languagePack.planning.noCurrentPlans+' <span> ' + $("#zone_filter option:selected").text() + '</span>, '+languagePack.message.forTheWeekOf+' <span>' + moment(WeekBeginTime).add(7,'hours').format('Do MMMM YYYY') + ' </span> ]</p></div>');			
			shiftsFound = false;
			ServiceComplete();
		}
		
		GanttMachineDynamicList();
	});
}

function FindMethods(location_guid) {
	
	if($("#gantt_chart").find("[LocationGUID='" + location_guid + "']").hasClass("expanded")) {
		while($("#gantt_chart").find("[LocationGUID='" + location_guid + "']").parent().parent().next().hasClass("methodRow") || $("#gantt_chart").find("[LocationGUID='" + location_guid + "']").parent().parent().next().hasClass("stepRow")) {			
			$("#gantt_chart").find("[LocationGUID='" + location_guid + "']").parent().parent().next().remove();
		}
	}
	else {
		ganttLocationMethods = [];

		var jqxhrplan = $.getJSON(ruIP + ruPort + planningDB + planningEN + "read/dbo/v_Plan?where=\"Area_GUID = '" + area_GF + "' AND Zone_GUID = '" + zone_GF + "' AND Location_GUID = '" + location_guid + "' AND IsActive = '1' AND Shiftdate >= '" + WeekBeginTime + "' AND Shiftdate <= '" + WeekEndTime + "' ORDER BY LocationDisplayName, ShiftDate ASC\"", function() {
			var planData = jQuery.parseJSON(jqxhrplan.responseText);
			var tempPlanData = [];
			
			for(var i = 0; i < planData.length; i++) {
				if(i == 0) {
					var dataObj = {};
					dataObj.Plan_GUID           = planData[i].Plan_GUID;
					dataObj.Area_GUID           = planData[i].Area_GUID;
					dataObj.Zone_GUID           = planData[i].Zone_GUID;
					dataObj.Location_GUID       = planData[i].Location_GUID;
					dataObj.Method_GUID         = planData[i].Method_GUID;
					dataObj.MineProcess_GUID    = planData[i].MineProcess_GUID;
					dataObj.IsActive            = planData[i].IsActive;
					dataObj.LocationDisplayName = planData[i].LocationDisplayName;
					dataObj.MethodDisplayName   = planData[i].MethodDisplayName;
					dataObj.Shiftdate           = planData[i].Shiftdate;
					dataObj.Shift               = planData[i].Shift;
					dataObj.PlanStep_GUID       = planData[i].PlanStep_GUID;
					dataObj.PlanConfig_GUID     = planData[i].PlanConfig_GUID;
					tempPlanData.push(dataObj);
				}
				else {
					var methodExists = false;
					for(var j = 0; j < tempPlanData.length; j++) {
						if(tempPlanData[j].Method_GUID == planData[i].Method_GUID) {
							methodExists = true;
						}
					}
					if(!methodExists) {						
						var dataObj = {};
						dataObj.Plan_GUID           = planData[i].Plan_GUID;
						dataObj.Area_GUID           = planData[i].Area_GUID;
						dataObj.Zone_GUID           = planData[i].Zone_GUID;
						dataObj.Location_GUID       = planData[i].Location_GUID;
						dataObj.Method_GUID         = planData[i].Method_GUID;
						dataObj.MineProcess_GUID    = planData[i].MineProcess_GUID;
						dataObj.IsActive            = planData[i].IsActive;
						dataObj.LocationDisplayName = planData[i].LocationDisplayName;
						dataObj.MethodDisplayName   = planData[i].MethodDisplayName;
						dataObj.Shiftdate           = planData[i].Shiftdate;
						dataObj.Shift               = planData[i].Shift;
						dataObj.PlanStep_GUID       = planData[i].PlanStep_GUID;
						dataObj.PlanConfig_GUID     = planData[i].PlanConfig_GUID;
						tempPlanData.push(dataObj);
					}
				}
			}
			
			var temp_method_guid            = "";
			var temp_process_guid           = "";
			var temp_location_method_guid   = "";
			var temp_method_name            = "";
			var temp_method_length          = 0;
			var methodObj                   = {};
			
			for(var key in tempPlanData) {
				
				//METHOD CONDITIONS
				if(!(temp_method_guid == '' || tempPlanData[key].Method_GUID == temp_method_guid)) {
					methodObj.Method_GUID       = temp_method_guid;
					methodObj.MineProcess_GUID  = temp_process_guid;
					methodObj.Location_GUID     = temp_location_method_guid;
					methodObj.MethodDisplayName = temp_method_name;
					methodObj.ShiftLength       = 20; //temp_method_length;					
					ganttLocationMethods.push(methodObj);

					methodObj = {};
					temp_method_length = 0;
				}
				temp_method_length++;
			
				temp_method_guid          = tempPlanData[key].Method_GUID;
				temp_process_guid         = tempPlanData[key].MineProcess_GUID;
				temp_method_name          = tempPlanData[key].MethodDisplayName;
				temp_location_method_guid = tempPlanData[key].Location_GUID;
			}
			
			//FINAL METHOD ADDED TO ARRAY
			methodObj.Method_GUID       = temp_method_guid;
			methodObj.MineProcess_GUID  = temp_process_guid;
			methodObj.Location_GUID     = temp_location_method_guid;
			methodObj.MethodDisplayName = temp_method_name;
			methodObj.ShiftLength       = 20; //temp_method_length;			
			ganttLocationMethods.push(methodObj);
			ExpandLocation(location_guid);
		});
	}
	
	$("#gantt_chart").find("[LocationGUID='" + location_guid + "']").toggleClass("expanded");
}









