/*============================================================
	Property of:		MISOM TECHNOLOGIES
	Developer:			AARON MCCOLOUGH
	Application Name:	FARA_FRESNILLO
	Directory:			FARA_FRESNILLO/PLANNING/JS/LINEUP_JS
	File Name:			load_plan_details.js
=============================================================*/

var LineupPlanDetail = [];

function GetPlanDetailsForLineup(initialLoad) {
	var shiftDate = $("#plan_lineup_date_field").val();
	var shift     = $("#plan_lineup_shift_field").val();
	
	var inputParams  = [];
	LineupPlanDetail = [];
	
	var param1 = {"paramName":"ShiftDate", "paramType":"varchar", "paramValue":shiftDate};
	var param2 = {"paramName":"Shift",     "paramType":"int",     "paramValue":shift};
	var param3 = {"paramName":"Area_GUID", "paramType":"varchar", "paramValue":area_GF};
	
	inputParams.push(param1);
	inputParams.push(param2);
	inputParams.push(param3);
	
	var inputParamsContainer         = {};
	inputParamsContainer.inputParams = inputParams;
	
	$.ajax ({
		headers: {
			"Content-Type": "application/json"
		},
		url: ruIP + ruPort + planningDB + planningEN + 'exec/procedureold/dbo.sp_PlansForLineup',
		type: "POST",
		data: JSON.stringify(inputParamsContainer),
		success: function(data){
			LineupPlanDetail = data[0];
			
			if(data.length > 0) {
				if(LineupPlanDetail.length > 0 || !initialLoad) {
					PopulatePlanLineupDetail();
				}
				else {
					GenerateLineUpConfig();
				}
			}
			else {
				GenerateLineUpConfig();
			}
		}
	});
}

function PopulatePlanLineupDetail() {
	var lineupPlanArray  = [];
	var lineupContainer  = $("#lineup_detail_container");
	var lineupDetailHtml = '<table id="wk_flow_table"><tr><th>'+languagePack.menu_index.area+'</th><th>'+languagePack.menu_index.zone+'</th><th>'+languagePack.common.location_s+'</th><th>'+languagePack.planning.operator+'</th><th>'+languagePack.planning.helper+'</th></tr>';
	
	if(LineupPlanDetail.length <= 0) {
		lineupDetailHtml += '<tr><td colspan="5">'+languagePack.planning.noPlansShiftDate+'</td></tr>';
	}
	
	for(var key in LineupPlanDetail) {
		var crewExists = false;
		
		if(key == 0) {
			var dataObj = {};
			
			dataObj.AreaDisplayName     = LineupPlanDetail[key].AreaDisplayName;
			dataObj.Area_GUID           = LineupPlanDetail[key].Area_GUID;
			dataObj.HelperGUID          = LineupPlanDetail[key].HelperGUID;
			dataObj.HelperName          = LineupPlanDetail[key].HelperName;
			dataObj.LocationDisplayName = LineupPlanDetail[key].LocationDisplayName;
			dataObj.Location_GUID       = LineupPlanDetail[key].Location_GUID;
			dataObj.MineProcess_GUID    = LineupPlanDetail[key].MineProcess_GUID;
			dataObj.OperatorGUID        = LineupPlanDetail[key].OperatorGUID;
			dataObj.OperatorName        = LineupPlanDetail[key].OperatorName;
			dataObj.Plan_GUID           = LineupPlanDetail[key].Plan_GUID;
			dataObj.Shift               = LineupPlanDetail[key].Shift;
			dataObj.Shiftdate           = LineupPlanDetail[key].Shiftdate;
			dataObj.ZoneDisplayName     = LineupPlanDetail[key].ZoneDisplayName;
			dataObj.Zone_GUID           = LineupPlanDetail[key].Zone_GUID;
			
			lineupPlanArray.push(dataObj);
		}
		else {
			var operatorExists = false;
			
			for(var key2 in lineupPlanArray) {
				if(LineupPlanDetail[key].OperatorGUID == lineupPlanArray[key2].OperatorGUID) {
					operatorExists = true;
					lineupPlanArray[key2].LocationDisplayName += ", " + LineupPlanDetail[key].LocationDisplayName;					
					lineupPlanArray[key2].Plan_GUID += "," + LineupPlanDetail[key].Plan_GUID;
				}
			}
			
			if(!operatorExists) {
				var dataObj = {};
			
				dataObj.AreaDisplayName     = LineupPlanDetail[key].AreaDisplayName;
				dataObj.Area_GUID           = LineupPlanDetail[key].Area_GUID;
				dataObj.HelperGUID          = LineupPlanDetail[key].HelperGUID;
				dataObj.HelperName          = LineupPlanDetail[key].HelperName;
				dataObj.LocationDisplayName = LineupPlanDetail[key].LocationDisplayName;
				dataObj.Location_GUID       = LineupPlanDetail[key].Location_GUID;
				dataObj.MineProcess_GUID    = LineupPlanDetail[key].MineProcess_GUID;
				dataObj.OperatorGUID        = LineupPlanDetail[key].OperatorGUID;
				dataObj.OperatorName        = LineupPlanDetail[key].OperatorName;
				dataObj.Plan_GUID           = LineupPlanDetail[key].Plan_GUID;
				dataObj.Shift               = LineupPlanDetail[key].Shift;
				dataObj.Shiftdate           = LineupPlanDetail[key].Shiftdate;
				dataObj.ZoneDisplayName     = LineupPlanDetail[key].ZoneDisplayName;
				dataObj.Zone_GUID           = LineupPlanDetail[key].Zone_GUID;
				
				lineupPlanArray.push(dataObj);				
			}
		}
	}
	
	for(var key in lineupPlanArray) {
		var tempOperator = languagePack.planning.empty;
		var tempHelper   = languagePack.planning.empty;

		if(lineupPlanArray[key].OperatorName != null) {
			tempOperator = lineupPlanArray[key].OperatorName;
		}

		if(lineupPlanArray[key].HelperName != null) {
			tempHelper = lineupPlanArray[key].HelperName;
		}
		
		lineupDetailHtml += '<tr class="eachLineupContainer" PlanGUID="'+lineupPlanArray[key].Plan_GUID+'" OperatorGUID="'+lineupPlanArray[key].OperatorGUID+'" HelperGUID="'+lineupPlanArray[key].HelperGUID+'" onclick="GenerateLineUpConfig(this)">';
		lineupDetailHtml += '<td>'+ lineupPlanArray[key].AreaDisplayName +'</td><td>'+ lineupPlanArray[key].ZoneDisplayName +'</td><td style="width: 164px">'+ lineupPlanArray[key].LocationDisplayName +'</td><td style="max-width: 125px">'+ tempOperator +'</td><td style="max-width: 125px">'+ tempHelper +'</td></tr>';
	}
	
	lineupDetailHtml += '</table>';
	
	lineupContainer.html("");
	lineupContainer.append(lineupDetailHtml);	
	
	$('#lineup_window').css("display", "block");
	$('#lineup_window').animate({"opacity":1}, 200);
}

function GenerateLineUpConfig(element) {
	
	LockForService();
	$("#lineup_window_cancel_btn").click();
	
	if(element) {
		
		var planGuid = $(element).attr("PlanGUID");
		
		if($(element).attr("OperatorGUID") != "null") {
			operatorGuid = $(element).attr("OperatorGUID");
		}

		if($(element).attr("HelperGUID") != "null") {
			helperGuid   = $(element).attr("HelperGUID");
		}
		
		PrepareLineupConfig(planGuid);
	}
	else {
		PrepareLineupConfig();
	}
}

function PrepareLineupConfig(tempPlanGuid) {
	var planArr;
	var planGuid = "";
	
	if(tempPlanGuid) {
		planArr = tempPlanGuid.split(",");
		for(var key in planArr) {
			planGuid += "'" + planArr[key] + "'";
			if(key < planArr.length-1) {
				planGuid += ",";
			}
		}
	
		var jqxhrLineupPlans = $.getJSON(ruIP + ruPort + planningDB + planningEN + "read/dbo/v_PlanLineupConfig?where=\"IsActive = '1' AND Plan_GUID IN ("+planGuid+") ORDER BY Plan_GUID\"", function() {				
			LineupPlanData = jQuery.parseJSON(jqxhrLineupPlans.responseText);
			
			var jqxhrLineupPlanSteps = $.getJSON(ruIP + ruPort + planningDB + planningEN + "read/dbo/v_PlanStepDetail?where=\"Plan_StepDetail_IsActive = '1' AND Step_IsLineup = '1' AND Plan_GUID IN ("+planGuid+") ORDER BY Plan_GUID, PlanStep_GUID\"", function() {				
				LineupPlanStepData = jQuery.parseJSON(jqxhrLineupPlanSteps.responseText);
				
				var jqxhrLineupPlanAssets = $.getJSON(ruIP + ruPort + planningDB + planningEN + "read/dbo/v_PlanAsset?where=\"IsActive = '1' AND Plan_GUID IN ("+planGuid+") AND Employee_GUID = '"+operatorGuid+"' ORDER BY Plan_GUID, PlanStep_GUID, FirstName\"", function() {				
					LineupPlanAssetData = jQuery.parseJSON(jqxhrLineupPlanAssets.responseText);
					LoadPlanHtml("lineup");
					from_plan = true;
				});
			});
		});
	}
	else {
		LoadPlanHtml("lineup");
		from_plan = false;
	}
}












