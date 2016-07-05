/*============================================================
	Property of:		MISOM TECHNOLOGIES
	Developer:			AARON MCCOLOUGH
	Application Name:	FARA_FRESNILLO
	Directory:			FARA_FRESNILLO/PLANNING/JS/GANTT_CHART_JS
	File Name:			generate_gantt_chart.js
=============================================================*/

var totalShifts        = 20;
var oldMachineValue    = "";
var newMachineValue    = "";
var oldOperatorValue   = "";
var newOperatorValue   = "";
var oldHelperValue     = "";
var newHelperValue     = "";
var oldDelayHoursValue = "";
var newDelayHoursValue = "";

$(document).ready(function() {
	LoadPlanLists();
	
	$("#content_container .sectionForm").css("overflow-y","hidden");
	
	var jqxhrview = $.getJSON(ruIP + ruPort + planningDB + planningEN + "read/ref/MineProcess?where=\"IsActive = '1'\"", function() {
		var processData = jQuery.parseJSON(jqxhrview.responseText);
		
		$('#process_select').html("<option>"+languagePack.common.selectOption+"</option>");
		var processSelect = document.getElementById('process_select');
		
		for(var key in processData) {
			processSelect.options[processSelect.options.length] = new Option(processData[key].DisplayName, processData[key].MineProcess_GUID);
		}
	});
});

function AppendLocations() {
		
	// FIRST, CONSTRUCT THE HEADER PORTION OF THE GANTT CHART
	// TO DISPLAY THE SHIFTS BY DAY, FOR A SELECTED WEEK
	var ganttChartHtml    = '<table id="gantt_chart" class="ganttChart" align="center" align="center"><tr class="ganttHeaderRow"><td colspan="20"><div class="tdCont ganttHeaderCell">' + currentWeek + '</div></td></tr><tr class="ganttHeaderRow"><td colspan="3"><div class="tdCont ganttHeaderCell">'+languagePack.datetime.monday+'</div></td><td colspan="3"><div class="tdCont ganttHeaderCell">'+languagePack.datetime.tuesday+'</div></td><td colspan="3"><div class="tdCont ganttHeaderCell">'+languagePack.datetime.wednesday+'</div></td><td colspan="3"><div class="tdCont ganttHeaderCell">'+languagePack.datetime.thursday+'</div></td><td colspan="3"><div class="tdCont ganttHeaderCell">'+languagePack.datetime.friday+'</div></td><td colspan="3"><div class="tdCont ganttHeaderCell">'+languagePack.datetime.saturday+'</div></td><td colspan="2"><div class="tdCont ganttHeaderCell">'+languagePack.datetime.sunday+'</div></td></tr><tr class="ganttHeaderRow"><td><div class="tdCont ganttHeaderCell">'+languagePack.datetime.firstShiftAbbr+'</div></td><td><div class="tdCont ganttHeaderCell">'+languagePack.datetime.secondShiftAbbr+'</div></td><td><div class="tdCont ganttHeaderCell">'+languagePack.datetime.thirdShiftAbbr+'</div></td><td><div class="tdCont ganttHeaderCell">'+languagePack.datetime.firstShiftAbbr+'</div></td><td><div class="tdCont ganttHeaderCell">'+languagePack.datetime.secondShiftAbbr+'</div></td><td><div class="tdCont ganttHeaderCell">'+languagePack.datetime.thirdShiftAbbr+'</div></td><td><div class="tdCont ganttHeaderCell">'+languagePack.datetime.firstShiftAbbr+'</div></td><td><div class="tdCont ganttHeaderCell">'+languagePack.datetime.secondShiftAbbr+'</div></td><td><div class="tdCont ganttHeaderCell">'+languagePack.datetime.thirdShiftAbbr+'</div></td><td><div class="tdCont ganttHeaderCell">'+languagePack.datetime.firstShiftAbbr+'</div></td><td><div class="tdCont ganttHeaderCell">'+languagePack.datetime.secondShiftAbbr+'</div></td><td><div class="tdCont ganttHeaderCell">'+languagePack.datetime.thirdShiftAbbr+'</div></td><td><div class="tdCont ganttHeaderCell">'+languagePack.datetime.firstShiftAbbr+'</div></td><td><div class="tdCont ganttHeaderCell">'+languagePack.datetime.secondShiftAbbr+'</div></td><td><div class="tdCont ganttHeaderCell">'+languagePack.datetime.thirdShiftAbbr+'</div></td><td><div class="tdCont ganttHeaderCell">'+languagePack.datetime.firstShiftAbbr+'</div></td><td><div class="tdCont ganttHeaderCell">'+languagePack.datetime.secondShiftAbbr+'</div></td><td><div class="tdCont ganttHeaderCell">'+languagePack.datetime.thirdShiftAbbr+'</div></td><td><div class="tdCont ganttHeaderCell">'+languagePack.datetime.firstShiftAbbr+'</div></td><td><div class="tdCont ganttHeaderCell">'+languagePack.datetime.secondShiftAbbr+'</div></td></tr>';
	var accumShifts       = 0;
	var stepDuration      = 0;
	ganttChartHtml     += '<tr><td colspan="20"><div class="ganttChartBody"><table class="ganttChartBodyTable">';
	
	// WITH THE LOCATIONS RETRIEVED FROM THE DATABASE, LOOP THROUGH
	// AND CONSTRUCT A NEW ROW TO DISPLAY IN THE GANTT CHART
	for(var key in ganttLocations) {
		ganttLocationGuid = ganttLocations[key].Location_GUID;
		
		ganttChartHtml += '<tr class="locationRow">';
		ganttChartHtml += '<td column="' + (accumShifts + 1) + '" colspan="' + ganttLocations[key].ShiftLength + '" class="no-border"><div class="tdCont tooltip" title="' + ganttLocations[key].LocationDisplayName + '" onclick="FindMethods(' + "'" + ganttLocations[key].Location_GUID + "'" + ')" LocationGUID="' + ganttLocations[key].Location_GUID + '" PlanConfigGUID="' + ganttLocations[key].PlanConfig_GUID + '" style="background:#000; color: #fff; cursor: pointer">' + ganttLocations[key].LocationDisplayName + '</div><div onclick="RemovePlan(this)" class="deleteLocationBtn">x</div></td>';
		
		accumShifts += ganttLocations[key].ShiftLength;
		
		for(var i = accumShifts; i < totalShifts; i++) {
			ganttChartHtml += '<td column="' + (i + 1) + '"></td>';
		}
		
		ganttChartHtml += "</tr>";
		accumShifts = 0;		
	}
	ganttChartHtml += "</table></div></td></tr></table>";
	$("#gantt_chart_container").html(ganttChartHtml);
	
	
	if(WkFlowData.length > 0) {
		if(WkFlowData[0].StatusDisplayName == "Approved" || WkFlowData[0].StatusDisplayName == "Pending") {
			$(".deleteLocationBtn").hide();
		}
	}
	
	if(UserData[0].RoleDisplayName == "Superintendent") {
		$(".deleteLocationBtn").hide();
	}
	
	OpenEachLocation();
	shiftsFound = false;
	ServiceComplete();	
	
	$(window).resize(function() {
		var height = $("#gantt_chart_container").height() - 66;
		$(".ganttChartBody").css({"max-height":height});
		$(".ganttChartBody").css({"height":height});
	});
	
	$(window).resize();
}

function ExpandLocation(location_guid) {
	
	var ganttMethodGuid = "";
	var accumShifts     = 0;
	var ganttChartHtml  = "";
	
	for(var key in ganttLocationMethods) {
		if(ganttLocationMethods[key].Location_GUID == location_guid) {
			ganttMethodGuid = ganttLocationMethods[key].Method_GUID;
			
			ganttChartHtml += '<tr class="methodRow">';
			ganttChartHtml += '<td column="' + (accumShifts + 1) + '" colspan="' + ganttLocationMethods[key].ShiftLength + '" class="no-border"><div class="tdCont tooltip" title="' + ganttLocationMethods[key].MethodDisplayName + '" onclick="FindSteps(' + "'" + ganttLocationMethods[key].Method_GUID + "','" + location_guid + "'" + ')" MethodGUID="' + ganttLocationMethods[key].Method_GUID + '" ProcessGUID="' + ganttLocationMethods[key].MineProcess_GUID + '" MethodLocationGUID="' + ganttLocationMethods[key].Location_GUID + '" style="background:#555; color: #fff; cursor: pointer">' + ganttLocationMethods[key].MethodDisplayName + '</div><div onclick="RemovePlanMethod(this)" class="deleteMethodBtn">x</div></td>';
			
			accumShifts += ganttLocationMethods[key].ShiftLength;
			
			for(var i = accumShifts; i < totalShifts; i++) {
				ganttChartHtml += '<td column="' + (i + 1) + '"></td>';
			}
			ganttChartHtml += "</tr>";
			accumShifts = 0;
			
			$("#gantt_chart").find("[LocationGUID='" + location_guid + "']").parent().parent().after(ganttChartHtml);
			ganttChartHtml  = "";
		}
	}	
	
	if(WkFlowData.length > 0) {
		if(WkFlowData[0].StatusDisplayName == "Approved" || WkFlowData[0].StatusDisplayName == "Pending") {
			$(".deleteMethodBtn").hide();
		}
	}
	
	if(UserData[0].RoleDisplayName == "Superintendent") {
		$(".deleteMethodBtn").hide();
	}
}

function ExpandMethod(method_guid, location_guid) {
	
	var ganttChartHtml = "";
	var step_guid      = "";
	var numRows        = [];
	var numColumns     = 0;
	var stepCellArray  = [];
	var stepColor      = "#6a99ce"; //BLUE
	var clStatus       = 0;
	
	if(WkFlowData.length > 0) {
		if(WkFlowData[0].StatusDisplayName == "Pending") {
			stepColor = "rgb(228,145,20)"; //ORANGE
		}
		if(WkFlowData[0].StatusDisplayName == "Approved") {
			stepColor = "#BE5050"; //RED
			//stepColor = "#50BE50"; //GREEN - USED WHEN THE CHECKLISTS ARE COMPLETED
		}
		if(WkFlowData[0].StatusDisplayName == "Rejected") {
			stepColor = "rgb(228,145,20)"; //ORANGE
		}
	}
	
	for(var key in ganttSteps) {
		if(step_guid == "") {
			numRows.push(ganttSteps[key].Step_GUID);
		}
		else {
			var stepExists = false;
			for(var key2 in numRows) {
				if(ganttSteps[key].Step_GUID == numRows[key2]) {
					stepExists = true;
				}
			}
			if(!stepExists) {
				numRows.push(ganttSteps[key].Step_GUID);
			}
		}
		step_guid = ganttSteps[key].Step_GUID;
	}
	
	var foundRow   = false;
	var foundShift = false;

	for(var key in numRows) {
		for(var key2 in ganttShifts) {
			for(var key3 in ganttSteps) {
				if(ganttSteps[key3].Step_GUID == numRows[key]) {
					foundRow = true;
					
					if(ganttSteps[key3].StartTime == ganttShifts[key2] && ganttSteps[key3].Method_GUID == method_guid && ganttSteps[key3].Location_GUID == location_guid) {
						foundShift = true;
						stepCellArray.push(ganttSteps[key3]);
					}
				}
			}
			
			if(foundRow && !foundShift) {
				var dataObj = {};
				dataObj.Step_GUID = "";
				dataObj.StartTime = ganttShifts[key];
				stepCellArray.push(dataObj);				
			}
			foundRow   = false;
			foundShift = false;
		}
	}
	
	var count   = 0;
	
	for(var key in stepCellArray) {
		if(WkFlowData.length > 0) {
			if(WkFlowData[0].StatusDisplayName == "Approved" && stepCellArray[key].PlanChecklist_Status == "Ready") {
				stepColor = "#50BE50"; //GREEN
				clStatus  = 1;
			}
		}
		
		if(count == 0) {
			ganttChartHtml += '<tr class="stepRow">';
		}
		if(stepCellArray[key].Step_GUID == "") {
			ganttChartHtml += '<td column="' + (count + 1) + '" ></td>';
			count++;			
		}
		else {
			ganttChartHtml += '<td column="' + (count + 1) + '" class="no-border"><div class="tdCont tooltip" title="' + stepCellArray[key].Step_DisplayName + '" onclick="FindAssets(' + "'" + stepCellArray[key].Method_GUID + "'" + ', ' + "'" + stepCellArray[key].PlanStep_GUID + "'" + ', ' + "'" + stepCellArray[key].Step_DisplayName + "'" + ', ' + stepCellArray[key].EstimatedDuration + ', ' + (count + 1) + ',this)" StepGUID="' + stepCellArray[key].Step_GUID + '" PlanStepGUID="' + stepCellArray[key].PlanStep_GUID + '" PlanGUID="' + stepCellArray[key].Plan_GUID + '" CLStatus="'+clStatus+'" style="background:'+stepColor+'; color: #fff; cursor: pointer">' + stepCellArray[key].Step_DisplayName + '</div></td>';
			count ++;
		}
		if(count >= 20) {
			ganttChartHtml += "</tr>";
			count = 0;
		}
		
		if(WkFlowData.length > 0) {
			if(WkFlowData[0].StatusDisplayName == "Approved") {			
				stepColor = "#BE5050"; //RED
				clStatus  = 0;
			}
		}
	}
	
	count = 0;
	
	if((UserData[0].RoleDisplayName == "Admin" || UserData[0].RoleDisplayName == "SuperAdmin" || UserData[0].RoleDisplayName == "Planner") && proceed) {
		
		ganttChartHtml += '<tr class="stepRow">';
		
		for(var i = 0; i < 20; i++) {
			ganttChartHtml += '<td class="addStepCell" column="' + (count + 1) + '" ><div class="tdCont2" onclick="AddNewStep(this)" style="cursor: pointer">A&ntilde;adir</div></td>';
			count++;		
		}
		
		ganttChartHtml += "</tr>";
	}
	
	$("#gantt_chart").find("[MethodGUID='" + method_guid + "']").each(function() {
		if($(this).attr("MethodLocationGUID") == location_guid) {
			$(this).parent().parent().after(ganttChartHtml);
		}
	});
}

function AddNewStep(element) {
	var location_guid = "";
	var location_name = "";
	var temp_loc_guid = "";
	configEditMode = true;
	
	$(element).closest(".stepRow").prevAll(".locationRow").each(function(index) {
		if(index == "0") {
			planConfigGuid = $(this).find(".tdCont").attr("PlanConfigGUID");
			location_guid  = $(this).find(".tdCont").attr("LocationGUID");
			location_name  = $(this).find(".tdCont").html();
		}
	});
	
	$("#location_select option").each(function() {
		var e = $(this);
		if(e.val() == location_guid) {
			obracodeComboGuid = e.attr("ObracodeGUID");
		}
	});
	
	var column        = $(element).parent().attr("column");
	var start_date    = ganttShifts[column - 1];
	var shiftHour     = parseInt(start_date.split("T")[1].split(":")[0]);	
	
	newStepShiftDate  = start_date.split("T")[0] + "T00:00:00.000";
	newStepLocation   = location_guid;
	locationComboName = location_name;
	
	switch(shiftHour) {
		case 7:
			newStepShift = 1;
			break;
		case 15:
			newStepShift = 2;
			break;
		case 23:
			newStepShift = 3;
			break;
	}
	
	$(element).closest(".stepRow").prevAll().find("td[column='"+column+"']").find(".tdCont").each(function() {
		var elem1 = $(this);
		$(this).closest(".stepRow").prevAll(".methodRow").each(function(index) {
			if(index == "0") {
				$(this).prevAll(".locationRow").each(function(index2) {
					if(index2 == "0") {
						temp_loc_guid = $(this).find(".tdCont").attr("LocationGUID");
					}
				});
				
				if(temp_loc_guid == location_guid) {
					newStepMethodArr.push($(this).find(".tdCont").attr("MethodGUID"));
					newStepProcessArr.push($(this).find(".tdCont").attr("ProcessGUID"));
					newSingleStepArr.push(elem1.attr("StepGUID"));
				}
			}			
		});
	});

	$(element).closest(".stepRow").nextAll().find("td[column='"+column+"']").find(".tdCont").each(function() {
		var elem1 = $(this);
		$(this).closest(".stepRow").prevAll(".methodRow").each(function(index) {
			if(index == "0") {
				$(this).prevAll(".locationRow").each(function(index2) {
					if(index2 == "0") {
						temp_loc_guid = $(this).find(".tdCont").attr("LocationGUID");
					}
				});
				
				if(temp_loc_guid == location_guid) {
					newStepMethodArr.push($(this).find(".tdCont").attr("MethodGUID"));
					newStepProcessArr.push($(this).find(".tdCont").attr("ProcessGUID"));
					newSingleStepArr.push(elem1.attr("StepGUID"));
				}
			}			
		});
	});
	
	OpenPlanConfigWindow();
}

function ExpandStep(planStep_guid, planStep_name, duration, column, element) {
	
	var stepAssetHtml = "";
	var positionClass = "";
	var stepColor     = "#6a99ce"; //BLUE
	
	if(WkFlowData.length > 0) {
		if(WkFlowData[0].StatusDisplayName == "Pending") {
			stepColor = "rgb(228,145,20)"; //ORANGE
		}
		if(WkFlowData[0].StatusDisplayName == "Approved") {
			if($(element).attr("CLStatus") == "1") {
				stepColor = "#50BE50"; //GREEN
			}
			else {
				stepColor = "#BE5050"; //RED
			}
			//stepColor = "#50BE50"; //GREEN - USED WHEN THE CHECKLISTS ARE COMPLETED
		}
		if(WkFlowData[0].StatusDisplayName == "Rejected") {
			stepColor = "rgb(228,145,20)"; //ORANGE
		}
	}
	
	if(column < 11) {
		positionClass = "positionLeft";
	}
	else {
		positionClass = "positionRight";
	}
	
	$(".stepAssets").removeClass('assetBoxFront');
	
	stepAssetHtml += '<div class="stepAssets assetBoxFront ' + positionClass + '" onclick="SetToActive(this)">';
	
	stepAssetHtml += '<div class="assetBox stepAsset" Plan_Step_GUID="'+planStep_guid+'" style="background-color:'+stepColor+'">';
	stepAssetHtml += '<div class="ceC collapseBtn" id="ceC_' + planStep_guid + '" style="margin-left: 10px; display: inline-block"><div class="tri_down triangle"></div><div class="expandedStepCancel" id="expanded_step_cancel_'+ planStep_guid +'">X</div>';
	stepAssetHtml += '<span style="display: inline-block; padding: 2px; text-align: left;">' + planStep_name + ':</span>';
	stepAssetHtml += '</div>';
	stepAssetHtml += '<input OldDuration="'+duration+'" id="plan_step_duration_'+planStep_guid+'" disabled class="planStepDuration" type="number" value="' + duration + '" min="0" step="0.1" style="display: inline-block; margin: 0px 2px 0px 2px; width: 50px; height: 22px; padding: 2px"><span style="margin-right: 20px">hrs</span>';
	stepAssetHtml += '<div style="display: block"><div class="editStepBtn buttonInactive" onclick="RemovePlanStep(this)">'+languagePack.common.del+'</div>';
	stepAssetHtml += '<div class="updateStepBtn buttonInactive" userRole="'+UserData[0].RoleDisplayName+'" onclick="UpdatePlanStepDuration(this, \''+ planStep_guid +'\')">'+languagePack.common.update+'</div></div>';
	stepAssetHtml += '</div>';
	
	for(var key in ganttMachines) {
		
		var delayClass = "";
		
		if(ganttDelays.length > 0) {
			if(ganttDelays[0].DelayDuration > 0) {
				delayClass = "machineDelay";
			}
		}
		
		stepAssetHtml += '<div class="assetBox machineAssets '+delayClass+' '+ ganttMachines[key].MachineStatus +'" Plan_StepMachine_GUID="' + ganttMachines[key].Plan_StepMachine_GUID + '" MachineGUID="' + ganttMachines[key].Machine_GUID + '">';
		stepAssetHtml += '<div class="ceA collapseBtn" id="ceA_' + ganttMachines[key].Plan_StepMachine_GUID + '" style="display: block; margin-bottom: 6px; margin-left: 10px"><div class="tri_down triangle"></div>';
		stepAssetHtml += '<span style="display: table-cell; padding: 2px; text-align: right;">' + ganttMachines[key].MachineTypeDisplayName + ':</span>';
		stepAssetHtml += '<span style="display: table-cell; padding: 2px">' + ganttMachines[key].MachineDisplayName + '</span>';
		stepAssetHtml += '</div>';
		stepAssetHtml += '<div style="display: block; margin-bottom: 4px;"><span style="display: inline-block; padding: 2px; text-align: right; margin-right: 4px; width: 139px;">'+languagePack.planning.operator+':</span>';
		stepAssetHtml += '<select disabled id="operator_select_' + ganttMachines[key].Plan_StepMachine_GUID + '" class="operatorSelect" style="display: inline-block; padding: 2px"></select></div>';
		stepAssetHtml += '<div style="display: block; margin-bottom: 12px;"><span style="display: inline-block; padding: 2px; text-align: right; margin-right: 4px; width: 139px;">'+languagePack.planning.helper+':</span>';
		stepAssetHtml += '<select disabled id="helper_select_' + ganttMachines[key].Plan_StepMachine_GUID + '" class="helperSelect" style="display: inline-block; padding: 2px"></select></div>';
		
		var initialDelay  = false;
		var delayComments = "";
		
		if(ganttDelays.length > 0) {
			if(ganttDelays[0].Machine_GUID == ganttMachines[key].Machine_GUID) {
				if(ganttDelays[0].Comments) {
					delayComments = ganttDelays[0].Comments;
				}
				initialDelay = true;
				stepAssetHtml += '<div style="display:block; margin-bottom: 4px;"><span style="display: inline-block; padding: 2px; text-align: right; margin-right: 4px; width: 120px;">'+languagePack.planning.delayHours+':</span><input disabled class="delayHours" id="delay_hours_'+ ganttMachines[key].Plan_StepMachine_GUID +'" type="number" value="' + ganttDelays[0].DelayDuration + '" min="0" max="8"></div>'; //Retraso hrs:
				oldDelayHoursValue = ganttDelays[0].DelayHours;
			}
		}
		
		if(!initialDelay) {
			stepAssetHtml += '<div style="display:block"><span style="display: inline-block; margin-bottom: 4px; padding: 2px; text-align: right; margin-right: 24px; width: 120px;">'+languagePack.planning.delayHours+':</span><input disabled class="delayHours" id="delay_hours_'+ ganttMachines[key].Plan_StepMachine_GUID +'" type="number" min="0" max="8"></div>';
			oldDelayHoursValue = -1;
		}
		
		stepAssetHtml += '<textarea style="display:block; width:100%; max-height:100px; height: 60px" class="delayComments" id="delay_comments_'+ganttMachines[key].Plan_StepMachine_GUID+'" placeholder="'+languagePack.planning.delayComments+':">'+delayComments+'</textarea>';
		
		stepAssetHtml += '<div class="editMachineBtn buttonInactive" onclick="DisplayMachineDropdown(this)">Editar</div>';
		stepAssetHtml += '<div class="updateMachineBtn buttonInactive" onclick="UpdateStepMachine(this, \''+ ganttMachines[key].Plan_StepMachine_GUID +'\', \''+ ganttMachines[key].PlanStep_GUID +'\')">Actualizar</div>';
		stepAssetHtml += '</div>';
	}
	
	var measureAssetClass = "";
	if(ganttMeasures.length < 1) {
		measureAssetClass = "noMeasures";
	}
		
	stepAssetHtml += '<div class="assetBox measureAssets '+ measureAssetClass +'">';
	stepAssetHtml += '<div class="measuresHeader ceB collapseBtn" id="ceB_' + planStep_guid + '">'+languagePack.planning.planningMeasures+':</div><div class="tri_down triangle"></div>';
	stepAssetHtml += '<div style="margin-top: 28px"><table style="width: 450px">';
	
	var mod = 0;	
	for(var key in ganttMeasures) {
		mod = parseInt(key) % 2;
		
		if(parseInt(key) % 2 == 0) {
			stepAssetHtml += '<tr>';
		}
		
		stepAssetHtml += '<td><table class="metricsTable" PlanStepMeasureGUID="'+ ganttMeasures[key].Plan_StepMeasure_GUID +'">';
		stepAssetHtml += '<tr><td><div>' + ganttMeasures[key].MeasureDisplayName + '</div></td></tr>';
		stepAssetHtml += '<tr><td><input disabled class="metricPlannedValue" type="number" value="' + ganttMeasures[key].PlannedValue + '" min="0" step="0.1"></td></tr>';
		stepAssetHtml += '</table></td>';
		
		if(parseInt(key) % 2 == 1) {
			stepAssetHtml += '</tr>';
		}
	}	
	if(mod == 0) {
		stepAssetHtml += '</tr>';
	}
	
	stepAssetHtml += '</table></div>';
	stepAssetHtml += '<div class="updateValues"><div class="updateMeasuresBtn" onclick="UpdateMeasures(this)">'+languagePack.common.update+'</div></div></div>';	
	stepAssetHtml += '</div>';
	
	$("#gantt_chart").find("[PlanStepGUID='" + planStep_guid + "']").parent().append(stepAssetHtml);
	
	if((UserData[0].RoleDisplayName == "Planner" || UserData[0].RoleDisplayName == "Admin" || UserData[0].RoleDisplayName == "SuperAdmin") && proceed) {
		$("#plan_step_duration_" + planStep_guid).attr("disabled", false);
		$(".editStepBtn").removeClass("buttonInactive");
		$(".editMachineBtn").removeClass("buttonInactive");
		$(".operatorSelect").attr("disabled", false);
		$(".helperSelect").attr("disabled", false);
		$(".metricPlannedValue").attr("disabled", false);
		$(".delayHours").attr("disabled", false);
		$(".metricActualValue").attr("disabled", true);
	}
	
	if(WkFlowData.length > 0) {
		if(WkFlowData[0].StatusDisplayName == "Approved") {
			$(".metricActualValue").attr("disabled", false);
		}
	}
	
	for(var key in ganttMachines) {
		var id_guid = ganttMachines[key].Plan_StepMachine_GUID;
		GanttEmployeeDynamicList(ganttMachines[key].Machine_GUID, -1);
		
		setTimeout(function() {
			var operatorSelect = document.getElementById('operator_select_' + id_guid);
			var helperSelect   = document.getElementById('helper_select_' + id_guid);
			
			$('#operator_select_' + id_guid).html("");
			$('#helper_select_' + id_guid).html("");
			
			operatorSelect.options[operatorSelect.options.length] = new Option(languagePack.common.selectEmployee, -1);
			helperSelect.options[helperSelect.options.length] = new Option(languagePack.common.selectEmployee, -1);
			
			for(var key in ganttEmployeeList) {
				if(ganttEmployeeList[key].isOperator) {
					operatorSelect.options[operatorSelect.options.length] = new Option(ganttEmployeeList[key].title, ganttEmployeeList[key].id);
				}
			}
			
			for(var key in ganttEmployeeList) {
				if(ganttEmployeeList[key].isHelper) {
					helperSelect.options[helperSelect.options.length] = new Option(ganttEmployeeList[key].title, ganttEmployeeList[key].id);
				}
			}
			
			for(var j in ganttAssets) {
				if(ganttAssets[j].IsOperator) {
					$('#operator_select_' + id_guid).val(ganttAssets[j].Employee_GUID);
					oldOperatorValue = ganttAssets[j].Employee_GUID;
				}
				if(ganttAssets[j].IsHelper) {
					$('#helper_select_' + id_guid).val(ganttAssets[j].Employee_GUID);
					oldHelperValue = ganttAssets[j].Employee_GUID;
				}
			}
			
			if(!(ganttAssets.length > 0)) {
				oldOperatorValue   = -1;
				oldHelperValue     = -1;
				oldDelayHoursValue = -1;
			}
			
			$('#operator_select_' + id_guid).on("change", function() {
				newOperatorValue = $(this).val();
				
				if(newOperatorValue != "" && newOperatorValue != oldOperatorValue && (UserData[0].RoleDisplayName == "Planner" || UserData[0].RoleDisplayName == "Admin" || UserData[0].RoleDisplayName == "SuperAdmin") && proceed) {
					$(this).parent().next().next().next().next().next().removeClass("buttonInactive");
				}
				else if((newDelayHoursValue == oldDelayHoursValue || newDelayHoursValue == "") && (newOperatorValue == oldOperatorValue || newOperatorValue == "") && (newHelperValue == oldHelperValue || newHelperValue == "") && (newMachineValue == oldMachineValue || newMachineValue == "")) {					
					$(this).parent().next().next().next().next().next().addClass("buttonInactive");
				}
			});
			
			$('#helper_select_' + id_guid).on("change", function() {
				newHelperValue = $(this).val();
				
				if(newHelperValue != "" && newHelperValue != oldHelperValue && (UserData[0].RoleDisplayName == "Planner" || UserData[0].RoleDisplayName == "Admin" || UserData[0].RoleDisplayName == "SuperAdmin") && proceed) {
					$(this).parent().next().next().next().next().removeClass("buttonInactive");
				}
				else if((newOperatorValue == oldOperatorValue || newOperatorValue == "") && (newHelperValue == oldHelperValue || newHelperValue == "") && (newMachineValue == oldMachineValue || newMachineValue == "")) {					
					$(this).parent().next().next().next().next().addClass("buttonInactive");
				}
			});
			
			$('#delay_hours_' + id_guid).on("change", function() {
				newDelayHoursValue = $(this).val();
				
				if(newDelayHoursValue != "" && newDelayHoursValue != oldDelayHoursValue && (UserData[0].RoleDisplayName == "Planner" || UserData[0].RoleDisplayName == "Admin" || UserData[0].RoleDisplayName == "SuperAdmin") && proceed) {
					$(this).parent().next().next().next().removeClass("buttonInactive");
				}
				else if((newDelayHoursValue == oldDelayHoursValue || newDelayHoursValue == "") && (newOperatorValue == oldOperatorValue || newOperatorValue == "") && (newDelayHoursValue == oldDelayHoursValue || newDelayHoursValue == "") && (newHelperValue == oldHelperValue || newHelperValue == "") && (newMachineValue == oldMachineValue || newMachineValue == "")) {					
					$(this).parent().next().next().next().addClass("buttonInactive");
				}
			});
		},500);
	}
	
	$("#expanded_step_cancel_" + planStep_guid).on("click", function() {
		$(this).closest("td").find(".tdCont").click();
	});
	
	$("#plan_step_duration_" + planStep_guid).bind('input', function() {
		if($(this).val() != $(this).attr("OldDuration") && (UserData[0].RoleDisplayName == "Planner" || UserData[0].RoleDisplayName == "Admin" || UserData[0].RoleDisplayName == "SuperAdmin") && proceed) {
			$(this).next().next().find(".updateStepBtn").removeClass("buttonInactive");
		}
		else {
			$(this).next().next().find(".updateStepBtn").addClass("buttonInactive");
		}
	});
	
	for(var key in ganttMachines) {
		$("#ceA_" + ganttMachines[key].Plan_StepMachine_GUID).on("click", function() {
			if($(this).hasClass("collapseBtn")) {
				$(this).removeClass("collapseBtn");
				$(this).addClass("expandBtn");
				$(this).parent().css({"height":"34px", "overflow-y":"hidden"});
				$(this).find(".triangle").addClass("tri_up");
				$(this).find(".triangle").removeClass("tri_down");
			}
			else {			
				$(this).addClass("collapseBtn");
				$(this).removeClass("expandBtn");
				$(this).parent().css({"height":"auto", "overflow-y":"auto"});
				$(this).find(".triangle").removeClass("tri_up");
				$(this).find(".triangle").addClass("tri_down");
			}
		});
	}	
	
	$("#ceB_" + planStep_guid).on("click", function() {
		if($(this).hasClass("collapseBtn")) {
			$(this).removeClass("collapseBtn");
			$(this).addClass("expandBtn");
			$(this).parent().css({"height":"36px", "overflow-y":"hidden"});
			$(this).next(".triangle").addClass("tri_up");
			$(this).next(".triangle").removeClass("tri_down");
		}
		else {			
			$(this).addClass("collapseBtn");
			$(this).removeClass("expandBtn");
			$(this).parent().css({"height":"auto", "overflow-y":"auto"});
			$(this).next(".triangle").removeClass("tri_up");
			$(this).next(".triangle").addClass("tri_down");
		}
	});

	$("#ceC_" + planStep_guid).on("click", function() {
		if($(this).hasClass("collapseBtn")) {
			$(this).removeClass("collapseBtn");
			$(this).addClass("expandBtn");
			$(this).parent().next().css({"display":"none"});
			$(this).parent().next().next().css({"display":"none"});
			$(this).parent().next().next().next().css({"display":"none"});
			$(this).parent().css({"border-bottom":"1px solid rgba(0,0,0,0.7)"});
			$(this).find(".triangle").addClass("tri_up");
			$(this).find(".triangle").removeClass("tri_down");
		}
		else {			
			$(this).addClass("collapseBtn");
			$(this).removeClass("expandBtn");
			$(this).parent().next().css({"display":"block"});
			$(this).parent().next().next().css({"display":"block"});
			$(this).parent().next().next().next().css({"display":"block"});
			$(this).parent().css({"border-bottom":"none"});
			$(this).find(".triangle").removeClass("tri_up");
			$(this).find(".triangle").addClass("tri_down");
		}
	});
	
	$(window).resize();
	ServiceComplete();
}

function OpenEachLocation() {
	$("#gantt_chart").find(".locationRow").each(function() {
		$(this).find(".tdCont").each(function () {
			$(this).click();
		});
	});
	
	setTimeout(function() {
		$("#gantt_chart").find(".methodRow").each(function() {
			$(this).find(".tdCont").each(function () {
				$(this).click();
			});
		});		
	},500);
}

function EditPlan(element) {
	var location       = $(element).prev().html();
	var location_guid = $(element).prev().attr("Location_GUID");
}

function SetToActive(element) {
	var planstep_guid = $(element).closest('td').find('.tdCont').attr('PlanStepGUID');
	$(".stepAssets").removeClass('assetBoxFront');
	$(element).addClass('assetBoxFront');
	GetPlanDetail(planstep_guid);
}

function DisplayStepDropdown(element) {
	$(element).parent().append('<select class="ganttStepEdit"><option>'+languagePack.common.selectOption+'</option></select><div onclick="RemoveStepDropDown(this)" class="stepSelectCancel">X</div>');
	
	for(var key in ganttStepList) {
		$(element).parent().find(".ganttStepEdit").append('<option value="' + ganttStepList[key].id + '">' + ganttStepList[key].title + '</option>');
	}
	
	$(element).parent().find(".ganttStepEdit").on("change", function() {
		UpdatePlanStep(element);
	});
}

function RemoveStepDropDown(element) {
	$(element).prev().remove();
	$(element).remove();	
}

function DisplayMachineDropdown(element) {
	if(!$(element).hasClass("buttonInactive")) {
		var column  = parseInt($(element).closest("td").attr("column"));
		var id_guid = $(element).closest(".machineAssets").attr("Plan_StepMachine_GUID");
		oldMachineValue = $(element).parent().attr("MachineGUID");
		
		$(element).parent().append('<select class="ganttMachineEdit"><option>'+languagePack.common.selectOption+'</option></select><div onclick="RemoveMachineDropDown(this)" class="machineSelectCancel">X</div>');	
		
		for(var key in machineForStepList) {
			$(element).parent().find(".ganttMachineEdit").append('<option class="' + machineForStepList[key].status + '" value="' + machineForStepList[key].id + '">' + machineForStepList[key].title + '</option>');
		}
		
		$(element).parent().find(".ganttMachineEdit").on("change", function() {
			var machine_guid = $(this).val();
			newMachineValue  = machine_guid;
					
			if(newMachineValue != "" && newMachineValue != oldMachineValue && (UserData[0].RoleDisplayName == "Planner" || UserData[0].RoleDisplayName == "Admin" || UserData[0].RoleDisplayName == "SuperAdmin") && proceed) {
				$(this).prev().removeClass("buttonInactive");
			}
			else if((newDelayHoursValue == oldDelayHoursValue || newDelayHoursValue == "") && (newOperatorValue == oldOperatorValue || newOperatorValue == "") && (newHelperValue == oldHelperValue || newHelperValue == "") && (newMachineValue == oldMachineValue || newMachineValue == "")) {					
				$(this).prev().addClass("buttonInactive");
			}
			
			GanttEmployeeDynamicList(machine_guid, -1);
			
			setTimeout(function() {
				var operatorSelect = document.getElementById('operator_select_' + id_guid);
				var helperSelect   = document.getElementById('helper_select_' + id_guid);
				
				$('#operator_select_' + id_guid).html("");
				$('#helper_select_' + id_guid).html("");
				
				operatorSelect.options[operatorSelect.options.length] = new Option(languagePack.common.selectEmployee, -1);
				helperSelect.options[helperSelect.options.length]     = new Option(languagePack.common.selectEmployee, -1);
				
				for(var key in ganttEmployeeList) {
					if(ganttEmployeeList[key].isOperator) {
						operatorSelect.options[operatorSelect.options.length] = new Option(ganttEmployeeList[key].title, ganttEmployeeList[key].id);
					}
				}
				
				for(var key in ganttEmployeeList) {
					if(ganttEmployeeList[key].isHelper) {
						helperSelect.options[helperSelect.options.length] = new Option(ganttEmployeeList[key].title, ganttEmployeeList[key].id);
					}
				}

				if(newMachineValue == oldMachineValue) {
					for(var j in ganttAssets) {
						if(ganttAssets[j].IsOperator) {
							$('#operator_select_' + id_guid).val(ganttAssets[j].Employee_GUID);
							oldOperatorValue = ganttAssets[j].Employee_GUID;
							newOperatorValue = "";
						}
						if(ganttAssets[j].IsHelper) {
							$('#helper_select_' + id_guid).val(ganttAssets[j].Employee_GUID);
							oldHelperValue = ganttAssets[j].Employee_GUID;
							newHelperValue = "";
						}
					}				
				}
			},500);
		});
	}
}

function RemoveMachineDropDown(element) {
	$(element).prev().remove();
	$(element).remove();	
}









