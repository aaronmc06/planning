/*============================================================
	Property of:		MISOM TECHNOLOGIES
	Developer:			AARON MCCOLOUGH
	Application Name:	FARA_FRESNILLO
	Directory:			FARA_FRESNILLO/PLANNING/JS/LINEUP_JS
	File Name:			generate_lineup_html.js
=============================================================*/

var fixedAreaGuid = "";
var fixedAreaName = "";
var fixedDate     = "";
var fixedShift    = "";

function GenerateLineupHTML() {	
	var lineupConfigHtml      = "";
	var lineupConfigContainer = $("#lineup_config_container");
	
	addingLineup = true;
	$("#lineup_toggle").removeClass("isinfocus");

	for(var key in LineupPlanData) {
		var tempAreaGuid = LineupPlanData[key].Area_GUID;
		var tempDate     = moment(LineupPlanData[key].Shiftdate.split("Z")[0]).format("MM/DD/YYYY");
		
		if(fixedAreaGuid == "") {
			fixedAreaGuid = tempAreaGuid;
			fixedAreaName = LineupPlanData[key].AreaDisplayName;
		}
		else if(fixedAreaGuid != tempAreaGuid) {
			console.log("Area Changed...?");
		}
		
		if(fixedDate == "") {
			fixedDate = tempDate;
			fixedShift = LineupPlanData[key].Shift;
		}
		else if(fixedDate != tempDate) {
			console.log("Date Changed...?");
		}
		
		lineupConfigHtml += '<div id="lineup_config_cont_'+key+'" class="eachLineupConfigContainer" PlanGUID="'+LineupPlanData[key].Plan_GUID+'">';
		lineupConfigHtml += '<div class="lineupConfigHeader">';
		lineupConfigHtml += '<div onclick="RemoveCrewLineup(this)" class="lineupRemovebtn">X</div>';
		
		lineupConfigHtml += '<table class="lineupHeaderTable">';
		
		if(fixedShift == 2) {
			lineupConfigHtml += '<tr><td colspan="4"><div class="lineupConfigMainHeader" ><label style="float:left">'+languagePack.lineup.lineup+': '+(parseInt(key)+1).toString()+'</label><label style="float:right">'+languagePack.common.shift+' '+fixedShift+' '+languagePack.common.of2+' '+fixedDate+'</label></div></td></tr>';
		}
		else {
			lineupConfigHtml += '<tr><td colspan="4"><div class="lineupConfigMainHeader" ><label style="float:left">'+languagePack.lineup.lineup+': '+(parseInt(key)+1).toString()+'</label><label style="float:right">'+languagePack.common.shift+' '+fixedShift+' '+languagePack.common.of1+' '+fixedDate+'</label></div></td></tr>';
		}
		
		lineupConfigHtml += '<tr><td class="tableLabel">'+languagePack.menu_index.area+'</td><td><select class="lineupConfigArea" disabled><option value="'+LineupPlanData[key].Area_GUID+'">'+LineupPlanData[key].AreaDisplayName+'</option></select></td><td class="tableLabel">'+languagePack.menu_index.zone+'</td><td><select class="lineupConfigZone" disabled="'+from_plan+'" id="lineup_config_zone_'+key+'"><option value="0">'+languagePack.common.selectOption+'</option></select></td></tr>';
		lineupConfigHtml += '<tr><td class="tableLabel">'+languagePack.common.location+':</td><td><select disabled="'+from_plan+'" class="lineupConfigLocation" id="lineup_config_location_'+key+'"><option value="0">'+languagePack.common.selectOption+'</option></select></td><td class="tableLabel">'+languagePack.common.process+':</td><td><select class="lineupConfigProcess" disabled="'+from_plan+'" id="lineup_config_process_'+key+'"><option value="0">'+languagePack.common.selectOption+'</option></select></td></tr>';
		lineupConfigHtml += '</table>';
		lineupConfigHtml += '<table class="lineupHeaderTable">';
		lineupConfigHtml += '<tr><td class="tableLabel" style="width:150px">'+languagePack.planning.operator+':</td><td><select class="lineupConfigOperator longer" id="lineup_config_operator_'+key+'"><option value="0">'+languagePack.common.selectOption+'</option></select></td></tr><tr><td class="tableLabel" style="width:150px">'+languagePack.planning.helper+':</td><td><select class="lineupConfigHelper longer" id="lineup_config_helper_'+key+'"><option value="0">'+languagePack.common.selectOption+'</option></select></td></tr>';		
		lineupConfigHtml += '</table>';
		
		lineupConfigHtml += '<div class="lineupButtonContainer"><div class="lineupAddStepBtn" onclick="AddStepToLineup(this)" id="lineup_add_step_btn_'+key+'">'+languagePack.planning.addStep+'</div></div>';
		
		lineupConfigHtml += '</div>';
		
		var stepCount = 0;
		for(var key2 in LineupPlanStepData) {
			for(var key3 in LineupPlanAssetData) {
				if(LineupPlanData[key].Plan_GUID == LineupPlanStepData[key2].Plan_GUID && LineupPlanStepData[key2].PlanStep_GUID == LineupPlanAssetData[key3].PlanStep_GUID) {
					
					lineupConfigHtml += '<div class="lineupStepContainer" id="lineup_step_container_'+key+'_'+(stepCount+1)+'">';
					lineupConfigHtml += '<div onclick="RemoveStepFromLineup(this)" class="lineupRemovebtn">X</div>';
					lineupConfigHtml += '<table class="lineupStepTable">';
					lineupConfigHtml += '<tr><td colspan="2"><div class="lineupConfigBodyHeader" >'+languagePack.planning.step+': '+(stepCount+1)+'</div></td></tr>';
					lineupConfigHtml += '<tr><td>'+languagePack.planning.method+'</td><td><select class="lineupConfigMethod" id="lineup_config_method_'+key+'_'+stepCount+'"><option value="0">'+languagePack.common.selectOption+'</option></select></td></tr>';
					lineupConfigHtml += '<tr><td>'+languagePack.planning.step+':</td><td><select class="lineupConfigStep" id="lineup_config_step_'+key+'_'+stepCount+'"><option value="0">'+languagePack.common.selectOption+'</option></select></td></tr>';
					lineupConfigHtml += '<tr><td>'+languagePack.planning.machine+':</td><td><select class="lineupConfigMachine" id="lineup_config_machine_'+key+'_'+stepCount+'"><option value="0">'+languagePack.common.selectOption+'</option></select></td></tr>';
					lineupConfigHtml += '<tr><td class="tdDescription" colspan="2" style="padding:6px">'+languagePack.prelineup.startShiftLocation+'</td></tr>';
					lineupConfigHtml += '<tr><td></td><td><select class="lineupConfigMachineLocation" id="lineup_config_machine_location_'+key+'_'+stepCount+'"><option value="0">'+languagePack.common.selectOption+'</option></select></td></tr>';
					lineupConfigHtml += '</table>';
					lineupConfigHtml += '</div>';
					
					stepCount++;
				}
			}
		}
		
		lineupConfigHtml += '</div>';
		lineupConfigHtml += '<hr>';
	}

	if(LineupPlanData.length > 0) {
		$("#lineup_config_container").html("");
		
		lineupConfigContainer.append(lineupConfigHtml);
		

		LoadLineupConfigDropdowns();
	}
	else {
		fixedAreaGuid  = $("#area_filter").val();
		fixedAreaName  = $("#area_filter option:selected").text();
		fixedShift     = lineupShift;
		fixedDate      = lineupShiftDate;
		AddCrewLineup();
	}
}

function LoadLineupConfigDropdowns() {
	
	for(var key in LineupPlanData) {
		ZoneLineupLoad("lineup_config_zone_" + key, LineupPlanData[key].Area_GUID, LineupPlanData[key].Zone_GUID);
		LocationLineupLoad("lineup_config_location_" + key, LineupPlanData[key].Area_GUID, LineupPlanData[key].Zone_GUID, LineupPlanData[key].Location_GUID);
		ProcessLineupLoad("lineup_config_process_" + key, LineupPlanData[key].Obracode_GUID, LineupPlanData[key].MineProcess_GUID);
		
		$("#lineup_config_operator_" + key).html("<option value='0'>"+languagePack.common.selectOption+"</option>");
		var operatorSelect = document.getElementById("lineup_config_operator_" + key);
		
		var opGuid = "";
		for(var key2 in lineupOperators) {
			if(opGuid != lineupOperators[key2].Employee_GUID) {
				operatorSelect.options[operatorSelect.options.length] = new Option(lineupOperators[key2].EmployeeName, lineupOperators[key2].Employee_GUID);
				opGuid = lineupOperators[key2].Employee_GUID;
			}
		}
		
		$("#lineup_config_helper_" + key).html("<option value='0'>"+languagePack.common.selectOption+"</option>");
		var helperSelect = document.getElementById("lineup_config_helper_" + key);
		
		var heGuid = "";
		for(var key2 in lineupHelpers) {
			if(heGuid != lineupHelpers[key2].Employee_GUID) {
				helperSelect.options[helperSelect.options.length] = new Option(lineupHelpers[key2].EmployeeName, lineupHelpers[key2].Employee_GUID);
				heGuid = lineupHelpers[key2].Employee_GUID;
			}
		}
		
		if(operatorGuid != "") {
			operatorSelect.value = operatorGuid;
		}
		else {
			operatorSelect.value = 0;
		}

		if(helperGuid != "" ) {
			helperSelect.value = helperGuid;
		}
		else {
			helperSelect.value = 0;
		}

		var stepCount = 0;
		for(var key2 in LineupPlanStepData) {
			for(var key3 in LineupPlanAssetData) {
				if(LineupPlanData[key].Plan_GUID == LineupPlanStepData[key2].Plan_GUID && LineupPlanStepData[key2].PlanStep_GUID == LineupPlanAssetData[key3].PlanStep_GUID) {
					MethodLineupLoad("lineup_config_method_" + key + "_" + stepCount, LineupPlanData[key].MineProcess_GUID, LineupPlanData[key].Obracode_GUID, LineupPlanData[key].Method_GUID);
					StepLineupLoad("lineup_config_location_" + key, "lineup_config_step_" + key + "_" + stepCount, LineupPlanData[key].Method_GUID, LineupPlanStepData[key2].Step_GUID);
					
					$("#lineup_config_machine_" + key + "_" + stepCount).html("<option value='0'>"+languagePack.common.selectOption+"</option>");
					var machineSelect = document.getElementById("lineup_config_machine_" + key + "_" + stepCount);
					
					for(var key4 in lineupMachines) {
						machineSelect.options[machineSelect.options.length] = new Option(lineupMachines[key4].MachineDisplayName, lineupMachines[key4].Machine_GUID);
						machineSelect.options[machineSelect.options.length - 1].setAttribute("MachineTypeGUID", lineupMachines[key4].MachineType_GUID);
					}
					
					if(LineupPlanStepData[key2].Machine_GUID) {
						machineSelect.value = LineupPlanAssetData[key3].Machine_GUID;
					}
					else {
						machineSelect.value = 0;					
					}
					
					$("#lineup_config_machine_location_" + key + "_" + stepCount).html("<option value='0'>"+languagePack.common.selectOption+"</option>");
					var machineLocSelect = document.getElementById("lineup_config_machine_location_" + key + "_" + stepCount);
					
					for(var key4 in lineupMachineLocations) {
						machineLocSelect.options[machineLocSelect.options.length] = new Option(lineupMachineLocations[key4].DisplayName, lineupMachineLocations[key4].Location_GUID);
						machineLocSelect.options[machineLocSelect.options.length - 1].setAttribute("Nivel", lineupMachineLocations[key4].Nivel);
					}
					
					stepCount++;
				}
			}
		}
		LineupConfigBindEvents(LineupPlanData[key].Location_GUID);
	}
}

function LineupConfigBindEvents() {
	for(var key in LineupPlanData) {
		$("#lineup_config_zone_" + key).on("change", function() {
			console.log("CHANGE");
			var zoneGuid = $(this).val();
			var index    = $(this).attr("id").split("_")[3];
			
			LocationLineupLoad("lineup_config_location_" + index, LineupPlanData[index].Area_GUID, zoneGuid, LineupPlanData[index].Location_GUID);
			$("#lineup_config_location_" + index).change();
			$("#lineup_config_process_" + index).val(0);
			$("#lineup_config_process_" + index).change();
		});
		
 		$("#lineup_config_process_" + key).on("change", function() {
			var processGuid		= $(this).val();
			var index			= $(this).attr("id").split("_")[3];
			var obracodeGuid	= $(this).find("option:selected").attr("ObracodeGUID");
			
			$(this).closest(".eachLineupConfigContainer").find(".lineupStepContainer").each(function(stepCount) {
				MethodLineupLoad("lineup_config_method_" + index + "_" + stepCount, processGuid, obracodeGuid);						
				$("#lineup_config_method_" + index + "_" + stepCount).val(0);
				$("#lineup_config_method_" + index + "_" + stepCount).change();
			});	
		});
		
 		$("#lineup_config_location_" + key).on("change", function() {
			var element			= $(this).attr("id");
			var locationGuid 	= $(this).val();
			var obracodeGuid	= $(this).find("option:selected").attr("ObracodeGUID");
			var index			= $(this).attr("id").split("_")[3];
			
			ProcessLineupLoad("lineup_config_process_" + index, obracodeGuid, LineupPlanData[index].MineProcess_GUID);
			GetCurrentLocationStatus(element, locationGuid);
		});
		
		var stepCount = 0;
		for(var key2 in LineupPlanStepData) {
			for(var key3 in LineupPlanAssetData) {
				if(LineupPlanData[key].Plan_GUID == LineupPlanStepData[key2].Plan_GUID && LineupPlanStepData[key2].PlanStep_GUID == LineupPlanAssetData[key3].PlanStep_GUID) {
					
					 $("#lineup_config_method_" + key + "_" + stepCount).on("change", function() {
						var methodGuid = $(this).val();
						var keyIndex   = $(this).attr("id").split("_")[3];						
						var stepIndex  = $(this).attr("id").split("_")[4];
						
						StepLineupLoad("lineup_config_location_" + keyIndex, "lineup_config_step_" + keyIndex + "_" + stepIndex, methodGuid, $("#lineup_config_step_" + keyIndex + "_" + stepIndex).val());
					});
					stepCount++;
				}
			}
		}
	}
	
	if(LineupPlanData.length <= 0) {
		$("#submit_lineup_btn").addClass("buttonInactive");
	}
	else {
		$("#submit_lineup_btn").removeClass("buttonInactive");
	}
	$("#add_lineup_btn").removeClass("buttonInactive");
	
	ServiceComplete();
}

function AddCrewLineup() {
	LockForService();
	CloseLineupWindow();
	
	var key = "0";
	
	$(".eachLineupConfigContainer").each(function() {
		key = (parseInt(key) + 1).toString();
	});

	var lineupConfigHtml      = "";
	var lineupConfigContainer = $("#lineup_config_container");
	
	lineupConfigHtml += '<div id="lineup_config_cont_'+key+'" class="eachLineupConfigContainer" PlanGUID="null">';
	lineupConfigHtml += '<div class="lineupConfigHeader">';
	lineupConfigHtml += '<div onclick="RemoveCrewLineup(this)" class="lineupRemovebtn">X</div>';
	
	lineupConfigHtml += '<table class="lineupHeaderTable">';
	
	if(fixedShift == 2) {
		lineupConfigHtml += '<tr><td colspan="4"><div class="lineupConfigMainHeader" ><label style="float:left">'+languagePack.planning.lineup+': '+(parseInt(key)+1).toString()+'</label><label style="float:right">'+languagePack.common.shift+' '+fixedShift+' '+languagePack.common.of2+' '+fixedDate+'</label></div></td></tr>';
	}
	else {
		lineupConfigHtml += '<tr><td colspan="4"><div class="lineupConfigMainHeader" ><label style="float:left">'+languagePack.planning.lineup+': '+(parseInt(key)+1).toString()+'</label><label style="float:right">'+languagePack.common.shift+' '+fixedShift+' '+languagePack.common.of1+' '+fixedDate+'</label></div></td></tr>';
	}
	
	
	lineupConfigHtml += '<tr><td class="tableLabel">'+languagePack.menu_index.area+'</td><td><select class="lineupConfigArea" disabled><option value="'+fixedAreaGuid+'">'+fixedAreaName+'</option></select></td><td class="tableLabel">'+languagePack.menu_index.zone+'</td><td><select class="lineupConfigZone" id="lineup_config_zone_'+key+'"><option value="0">'+languagePack.common.selectOption+'</option></select></td></tr>';
	lineupConfigHtml += '<tr><td class="tableLabel">'+languagePack.common.location+':</td><td><select class="lineupConfigLocation" id="lineup_config_location_'+key+'"><option value="0">'+languagePack.common.selectOption+'</option></select></td><td class="tableLabel">'+languagePack.planning.process+'</td><td><select class="lineupConfigProcess" id="lineup_config_process_'+key+'"><option value="0">'+languagePack.common.selectOption+'</option></select></td></tr>';
	lineupConfigHtml += '</table>';
	lineupConfigHtml += '<table class="lineupHeaderTable">';
	lineupConfigHtml += '<tr><td class="tableLabel" style="width:150px">'+languagePack.planning.operator+':</td><td><select class="lineupConfigOperator longer" id="lineup_config_operator_'+key+'"><option value="0">'+languagePack.common.selectOption+'</option></select></td></tr><tr><td class="tableLabel" style="width:150px">'+languagePack.planning.helper+':</td><td><select class="lineupConfigHelper longer" id="lineup_config_helper_'+key+'"><option value="0">'+languagePack.common.selectOption+'</option></select></td></tr>';		
	lineupConfigHtml += '</table>';
	
	lineupConfigHtml += '<div class="lineupButtonContainer"><div class="lineupAddStepBtn" onclick="AddStepToLineup(this)" id="lineup_add_step_btn_'+key+'">'+languagePack.planning.addStep+'</div></div>';
	
	lineupConfigHtml += '</div>';
	
	lineupConfigHtml += '</div>';
	lineupConfigHtml += '<hr>';
	
	lineupConfigContainer.append(lineupConfigHtml);
	
	$("#lineup_config_container").scrollTo("#lineup_config_cont_" + key, {duration: 500, offsetTop : '50'});
	
	LoadNewLineupDropdowns(key);
}

function LoadNewLineupDropdowns(key) {
	ZoneLineupLoad("lineup_config_zone_" + key, fixedAreaGuid);
	
	$("#lineup_config_operator_" + key).html("<option value='0'>"+languagePack.common.selectOption+"</option>");
	var operatorSelect = document.getElementById("lineup_config_operator_" + key);

	var empGuid = "";
		for(var key2 in lineupOperators) {
			if(empGuid != lineupOperators[key2].Employee_GUID) {
				operatorSelect.options[operatorSelect.options.length] = new Option(lineupOperators[key2].EmployeeName, lineupOperators[key2].Employee_GUID);
				empGuid = lineupOperators[key2].Employee_GUID;
			}
		}
	
	$("#lineup_config_helper_" + key).html("<option value='0'>"+languagePack.common.selectOption+"</option>");
	var helperSelect = document.getElementById("lineup_config_helper_" + key);
	
	var empGuid = "";
		for(var key2 in lineupHelpers) {
			if(empGuid != lineupHelpers[key2].Employee_GUID) {
				helperSelect.options[helperSelect.options.length] = new Option(lineupHelpers[key2].EmployeeName, lineupHelpers[key2].Employee_GUID);
				empGuid = lineupHelpers[key2].Employee_GUID;
			}
		}
	
	NewLineupConfigBindEvents(key);
}

function NewLineupConfigBindEvents(key) {
	$("#lineup_config_zone_" + key).on("change", function() {
		var zoneGuid = $(this).val();
		var index    = $(this).attr("id").split("_")[3];
		
		LocationLineupLoad("lineup_config_location_" + index, fixedAreaGuid, zoneGuid);
		$("#lineup_config_location_" + index).val(0);
		$("#lineup_config_location_" + index).change();
		$("#lineup_config_process_" + index).val(0);
		$("#lineup_config_process_" + index).change();
	});
		
	$("#lineup_config_location_" + key).on("change", function() {
		var element = $(this).attr("id");
		var locationGuid = $(this).val();
		var obracodeGuid	= $(this).find("option:selected").attr("ObracodeGUID");
		var index			= $(this).attr("id").split("_")[3];
		
		ProcessLineupLoad("lineup_config_process_" + index, obracodeGuid);
		GetCurrentLocationStatus(element, locationGuid);
	});	
		
	$("#lineup_config_process_" + key).on("change", function() {
		var processGuid		= $(this).val();
		var index			= $(this).attr("id").split("_")[3];
		var obracodeGuid	= $(this).find("option:selected").attr("ObracodeGUID");
		
		$(this).closest(".eachLineupConfigContainer").find(".lineupStepContainer").each(function(stepCount) {
			MethodLineupLoad("lineup_config_method_" + index + "_" + stepCount, processGuid, obracodeGuid);
			$("#lineup_config_method_" + index + "_" + stepCount).val(0);
			$("#lineup_config_method_" + index + "_" + stepCount).change();
		});
	});	

	$("#submit_lineup_btn").addClass("buttonInactive");
	$("#add_lineup_btn").removeClass("buttonInactive");
	
	ServiceComplete();
}

function RemoveCrewLineup(element) {
	var step_index = 0;
	var lnup_index = 0;
	var activate   = true;
	$(element).closest(".eachLineupConfigContainer").next().remove();
	
	$(element).closest(".eachLineupConfigContainer").animate({"height":"0px", "opacity":"0.0"}, 250);
	
	setTimeout(function() {
		$(element).closest(".eachLineupConfigContainer").remove();
		
		$(".eachLineupConfigContainer").each(function(index) {
			step_index = 0;
			lnup_index++;
			$(this).attr("id", "lineup_config_cont_" + index);
			$(this).find(".lineupConfigMainHeader").html("");
			
			if(fixedShift == 2) {
				$(this).find(".lineupConfigMainHeader").append('<label style="float:left">Pueble: '+(parseInt(index)+1).toString()+'</label><label style="float:right">'+languagePack.common.shift+' '+fixedShift+' '+languagePack.common.of2+' '+fixedDate+'</label>');
			}
			else {
				$(this).find(".lineupConfigMainHeader").append('<label style="float:left">Pueble: '+(parseInt(index)+1).toString()+'</label><label style="float:right">'+languagePack.common.shift+' '+fixedShift+' '+languagePack.common.of1+' '+fixedDate+'</label>');
			}			
			
			$(this).find(".lineupConfigZone").attr("id","lineup_config_zone_" + index);
			$(this).find(".lineupConfigLocation").attr("id","lineup_config_location_" + index);
			$(this).find(".lineupConfigProcess").attr("id","lineup_config_process_" + index);
			$(this).find(".lineupConfigOperator").attr("id","lineup_config_operator_" + index);
			$(this).find(".lineupConfigHelper").attr("id","lineup_config_helper_" + index);
			
			$(this).find(".lineupStepContainer").each(function(stepCount) {
				$(this).attr("id", "lineup_step_container_" + index + "_" + (stepCount+1));
				$(this).find(".lineupConfigMethod").attr("id","lineup_config_method_" + index + "_" + stepCount);
				$(this).find(".lineupConfigStep").attr("id","lineup_config_step_" + index + "_" + stepCount);
				$(this).find(".lineupConfigMachine").attr("id","lineup_config_machine_" + index + "_" + stepCount);
				$(this).find(".lineupConfigMachineLocation").attr("id","lineup_config_machine_location_" + index + "_" + stepCount);
				step_index++;
			});

			if(step_index <= 0) {
				activate = false;
			}
		});

		if(lnup_index <= 0) {
			activate = false;			
		}
	
		if(activate) {
			$("#submit_lineup_btn").removeClass("buttonInactive");
		}
		else {
			$("#submit_lineup_btn").addClass("buttonInactive");
		}
	},250);
}

function AddStepToLineup(element) {
	LockForService();
	CloseLineupWindow();
	
	var newLineupStepHtml = "";
	var stepCount = 0;
	var key = $(element).attr("id").split("_")[4];
	
	$(element).closest(".eachLineupConfigContainer").find(".lineupStepTable").each(function() {
		stepCount++;
	});
	
	newLineupStepHtml += '<div class="lineupStepContainer" id="lineup_step_container_'+key+'_'+(stepCount+1)+'"><div onclick="RemoveStepFromLineup(this)" class="lineupRemovebtn">X</div>';
	newLineupStepHtml += '<table class="lineupStepTable">';
	newLineupStepHtml += '<tr><td colspan="2"><div class="lineupConfigBodyHeader" >'+languagePack.planning.step+': '+(stepCount+1)+'</div></td></tr>';
	newLineupStepHtml += '<tr><td>'+languagePack.planning.method+'</td><td><select class="lineupConfigMethod" id="lineup_config_method_'+key+'_'+stepCount+'"><option value="0">'+languagePack.common.selectOption+'</option></select></td></tr>';
	newLineupStepHtml += '<tr><td>'+languagePack.planning.step+':</td><td><select class="lineupConfigStep" id="lineup_config_step_'+key+'_'+stepCount+'"><option value="0">'+languagePack.common.selectOption+'</option></select></td></tr>';
	newLineupStepHtml += '<tr><td>'+languagePack.planning.machine+':</td><td><select class="lineupConfigMachine" id="lineup_config_machine_'+key+'_'+stepCount+'"><option value="0">'+languagePack.common.selectOption+'</option></select></td></tr>';
	newLineupStepHtml += '<tr><td class="tdDescription" colspan="2" style="padding:6px">'+languagePack.prelineup.startShiftLocation+'</td></tr>';
	newLineupStepHtml += '<tr><td></td><td><select class="lineupConfigMachineLocation" id="lineup_config_machine_location_'+key+'_'+stepCount+'"><option value="0">'+languagePack.common.selectOption+'</option></select></td></tr>';
	newLineupStepHtml += '</table>';
	newLineupStepHtml += '</div>';
	
	$(element).closest(".eachLineupConfigContainer").append(newLineupStepHtml);
	
	LoadNewStepDropdowns(element, key, stepCount);
}

function LoadNewStepDropdowns(element, key, stepCount) {
	var processGuid		= $("#lineup_config_process_" + key).val();
	var obracodeGuid	= $("#lineup_config_process_" + key).find("option:selected").attr("ObracodeGUID");
	
	MethodLineupLoad("lineup_config_method_" + key + "_" + stepCount, processGuid, obracodeGuid);
	
	$("#lineup_config_machine_" + key + "_" + stepCount).html("<option value='0'>"+languagePack.common.selectOption+"</option>");
	var machineSelect = document.getElementById("lineup_config_machine_" + key + "_" + stepCount);
	
	for(var key4 in lineupMachines) {
		machineSelect.options[machineSelect.options.length] = new Option(lineupMachines[key4].MachineDisplayName, lineupMachines[key4].Machine_GUID);
		machineSelect.options[machineSelect.options.length - 1].setAttribute("MachineTypeGUID", lineupMachines[key4].MachineType_GUID);
	}
	
	$("#lineup_config_machine_location_" + key + "_" + stepCount).html("<option value='0'>"+languagePack.common.selectOption+"</option>");
	var machineLocSelect = document.getElementById("lineup_config_machine_location_" + key + "_" + stepCount);
	
	for(var key4 in lineupMachineLocations) {
		machineLocSelect.options[machineLocSelect.options.length] = new Option(lineupMachineLocations[key4].DisplayName, lineupMachineLocations[key4].Location_GUID);
		machineLocSelect.options[machineLocSelect.options.length - 1].setAttribute("Nivel", lineupMachineLocations[key4].Nivel);
	}
	
	NewStepBindEvents(key, stepCount);	
}

function NewStepBindEvents(key, stepCount) {
	var step_index = 0;
	var activate   = true;
	$("#lineup_config_method_" + key + "_" + stepCount).on("change", function() {
		var methodGuid = $(this).val();
		var keyIndex   = $(this).attr("id").split("_")[3];						
		var stepIndex  = $(this).attr("id").split("_")[4];
		
		StepLineupLoad("lineup_config_location_" + keyIndex, "lineup_config_step_" + keyIndex + "_" + stepIndex, methodGuid, $("#lineup_config_step_" + keyIndex + "_" + stepIndex).val());
	});
	
	$(".eachLineupConfigContainer").each(function(index) {
		step_index = 0;
		$(this).attr("id", "lineup_config_cont_" + index);
		$(this).find(".lineupConfigMainHeader").html("");
		$(this).find(".lineupConfigMainHeader").append('<label style="float:left">Pueble: '+(parseInt(index)+1).toString()+'</label><label style="float:right">Turno '+fixedShift+'ra de '+fixedDate+'</label>');
		$(this).find(".lineupConfigZone").attr("id","lineup_config_zone_" + index);
		$(this).find(".lineupConfigLocation").attr("id","lineup_config_location_" + index);
		$(this).find(".lineupConfigProcess").attr("id","lineup_config_process_" + index);
		$(this).find(".lineupConfigOperator").attr("id","lineup_config_operator_" + index);
		$(this).find(".lineupConfigHelper").attr("id","lineup_config_helper_" + index);
		
		$(this).find(".lineupStepContainer").each(function(stepCount) {
			$(this).attr("id", "lineup_step_container_" + index + "_" + (stepCount+1));
			$(this).find(".lineupConfigMethod").attr("id","lineup_config_method_" + index + "_" + stepCount);
			$(this).find(".lineupConfigStep").attr("id","lineup_config_step_" + index + "_" + stepCount);
			$(this).find(".lineupConfigMachine").attr("id","lineup_config_machine_" + index + "_" + stepCount);
			$(this).find(".lineupConfigMachineLocation").attr("id","lineup_config_machine_location_" + index + "_" + stepCount);
			step_index++;
		});
		
		if(step_index <= 0) {
			activate = false;
		}
	});
	
	if(activate) {
		$("#submit_lineup_btn").removeClass("buttonInactive");
	}	
	
	ServiceComplete();
}

function RemoveStepFromLineup(element) {
	var lineupRecord = $(element).closest(".eachLineupConfigContainer").attr("id");
	var lnup_index   = $(element).closest(".eachLineupConfigContainer").attr("id").split("_")[3];
	var step_index   = 0;
	
	$(element).closest(".lineupStepContainer").animate({"width":"0px", "opacity":"0.0"}, 250);
	
	setTimeout(function() {		
		$(element).closest(".lineupStepContainer").remove();

		$("#"+lineupRecord).find(".lineupStepContainer").each(function(stepCount) {
			var stepNumber = languagePack.common.activity + ": " + (stepCount+1);
			
			$(this).find(".lineupConfigBodyHeader").html(stepNumber);
			$(this).attr("id", "lineup_step_container_" + lnup_index + "_" + (stepCount+1));
			$(this).find(".lineupConfigMethod").attr("id","lineup_config_method_" + lnup_index + "_" + stepCount);
			$(this).find(".lineupConfigStep").attr("id","lineup_config_step_" + lnup_index + "_" + stepCount);
			$(this).find(".lineupConfigMachine").attr("id","lineup_config_machine_" + lnup_index + "_" + stepCount);
			$(this).find(".lineupConfigMachineLocation").attr("id","lineup_config_machine_location_" + lnup_index + "_" + stepCount);
			step_index++;
		});

		if(step_index <= 0) {
			$("#submit_lineup_btn").addClass("buttonInactive");
		}
	},250);
}









