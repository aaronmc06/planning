/*============================================================
	Property of:		MISOM TECHNOLOGIES
	Developer:			AARON MCCOLOUGH
	Application Name:	FARA_FRESNILLO
	Directory:			FARA_FRESNILLO/PLANNING/JS/PLAN_CONFIG_JS
	File Name:			generate_plan_config_html.js
=============================================================*/

var stepIndex         = -1;
var newStepLocation   = "";
var newSingleStepArr  = [];
var newStepMethodArr  = [];
var newStepProcessArr = [];
var newStepShift      = "";
var newStepShiftDate  = "";
var configEditMode    = false;

function GeneratePlanConfigWindowHTML() {
	var stepContainer = $("#plan_config_step_container");
	var stepContainerHTML = "";
	stepIndex++;

	stepContainerHTML	+= '<div class="eachStepContainer" MethGuid="'+$("#method_select").val()+'" id="step_container_' + stepIndex + '">'
							+ '<div class="removeStep" id="remove_step_' + stepIndex + '">x</div>'
							+ '<div class="stepHeaderContainer">'
								+ '<table class="leftConfigTable">'
									+ '<tr class="leftConfigRow">'
										+ '<td><span class="leftConfigSpan">' + languagePack.planning.step + ' ' + (parseInt(stepIndex) + 1).toString() + ':</span></td>'
										+ '<td><select class="stepPlanConfigSelect" id="step_plan_config_select_' + stepIndex + '"></select></td>'
									+ '</tr>'
								+ '</table>'
								+ '<table class="middleConfigTable">'
									+ '<tr class="leftConfigRow">'
										+ '<td><span class="leftConfigSpan">'+languagePack.common.shift+':</span></td>'
										//+ '<td><select class="shiftPlanConfigSelect" id="shift_plan_config_select_' + stepIndex + '"></select></td>'
										+ '<td>'
											+ '<table class="stepShiftTable">'
												+ '<tr>'
													+ '<td shiftIndex="0" class="stepShiftCell stepShiftCell_'+stepIndex+' enabled" id="stepShiftCell_'+ stepIndex +'_0" calendarShift="1">1</td>'
													+ '<td shiftIndex="1" class="stepShiftCell stepShiftCell_'+stepIndex+' enabled" id="stepShiftCell_'+ stepIndex +'_1" calendarShift="2">2</td>'
													+ '<td shiftIndex="2" class="stepShiftCell stepShiftCell_'+stepIndex+' enabled" id="stepShiftCell_'+ stepIndex +'_2" calendarShift="3">3</td>'
												+ '</tr>'
											+ '</table>'
										+ '</td>'
									+ '</tr>'
								+ '</table>'
								+ '<table class="rightConfigTable stepsDurationTable">'
									+ '<tr class="rightConfigRow">'
										+ '<td><span class="rightConfigSpan">'+languagePack.datetime.duration+'</span></td>'
										+ '<td><input type="number" min="1" max="8" id="duration_plan_config_input_' + stepIndex + '" onkeypress="return event.charCode >= 48 && event.charCode <= 57"></td>'
									+ '</tr>'
								+ '</table>'
							+ '</div>'
							+ '<table class="stepDaysTable">'
								+ '<tr>'
									+ '<td class="stepDayLabelCell">'+languagePack.datetime.days+'</td>'
									+ '<td class="stepDayCell stepDayAll enabled" id="stepDayAll_'+ stepIndex +'">'+languagePack.planning.all+'</td>'
									+ '<td dayIndex="0" class="stepDayCell stepDayCell_'+stepIndex+' enabled" id="stepDayCell_'+ stepIndex +'_0" calendarDate="'+moment(WeekBeginTime).format("YYYY-MM-DDT00:00:00.000z")+'">'+languagePack.datetime.mon+'</td>'
									+ '<td dayIndex="1" class="stepDayCell stepDayCell_'+stepIndex+' enabled" id="stepDayCell_'+ stepIndex +'_1" calendarDate="'+moment(WeekBeginTime).add(1,"days").format("YYYY-MM-DDT00:00:00.000z")+'">'+languagePack.datetime.tue+'</td>'
									+ '<td dayIndex="2" class="stepDayCell stepDayCell_'+stepIndex+' enabled" id="stepDayCell_'+ stepIndex +'_2" calendarDate="'+moment(WeekBeginTime).add(2,"days").format("YYYY-MM-DDT00:00:00.000z")+'">'+languagePack.datetime.wed+'</td>'
									+ '<td dayIndex="3" class="stepDayCell stepDayCell_'+stepIndex+' enabled" id="stepDayCell_'+ stepIndex +'_3" calendarDate="'+moment(WeekBeginTime).add(3,"days").format("YYYY-MM-DDT00:00:00.000z")+'">'+languagePack.datetime.thu+'</td>'
									+ '<td dayIndex="4" class="stepDayCell stepDayCell_'+stepIndex+' enabled" id="stepDayCell_'+ stepIndex +'_4" calendarDate="'+moment(WeekBeginTime).add(4,"days").format("YYYY-MM-DDT00:00:00.000z")+'">'+languagePack.datetime.fri+'</td>'
									+ '<td dayIndex="5" class="stepDayCell stepDayCell_'+stepIndex+' enabled" id="stepDayCell_'+ stepIndex +'_5" calendarDate="'+moment(WeekBeginTime).add(5,"days").format("YYYY-MM-DDT00:00:00.000z")+'">'+languagePack.datetime.sat+'</td>'
									+ '<td dayIndex="6" class="stepDayCell stepDayCell_'+stepIndex+' enabled" id="stepDayCell_'+ stepIndex +'_6" calendarDate="'+moment(WeekBeginTime).add(6,"days").format("YYYY-MM-DDT00:00:00.000z")+'">'+languagePack.datetime.sun+'</td>'
								+ '</tr>'
							+ '</table>'
							+ '<table class="childTable materialChildTable">'
								+ '<tr>'
									+ '<td>'
										+ '<div style="display:block; text-align:right;">'
											+ '<label style="vertical-align: middle;">Mineral</label>'
											+ '<input type="radio" name="material_'+stepIndex+'" value="Mineral" checked style="vertical-align: middle; margin: 0px 8px;">'
										+ '</div>'
										+ '<div style="display:block; text-align:right;">'
											+ '<label style="vertical-align: middle;">Tepetate</label>'
											+ '<input type="radio" name="material_'+stepIndex+'" value="Tepetate" style="vertical-align: middle; margin: 0px 8px;">'
										+ '</div>'
									+ '</td>'
								+ '</tr>'
							+ '</table>'
							+ '<table class="childTable machineChildTable">'
								+ '<tr>'
									+ '<td><span class="machineSpan">'+languagePack.planning.machine+':</span></td>'
									+ '<td><select class="machinePlanConfigSelect" id="machine_plan_config_select_' + stepIndex + '"><option value="">'+languagePack.common.selectOption+'</option></select></td>'
								+ '</tr>'
							+ '</table>'
						+ '</div>';

	stepContainer.append(stepContainerHTML);
	
	setTimeout(function() {
		var stepSelect    = document.getElementById('step_plan_config_select_' + stepIndex);
		//var shiftSelect   = document.getElementById('shift_plan_config_select_' + stepIndex);
		var machineSelect = document.getElementById('machine_plan_config_select_' + stepIndex);
		
		for(var key in stepsArray) {
			stepSelect.options[stepSelect.options.length] = new Option(stepsArray[key].DisplayName, stepsArray[key].Step_GUID);
		}
		
		//for(var i = 0; i < 3; i++) {
			//shiftSelect.options[shiftSelect.options.length] = new Option(i + 1);
		//}

		for(var key in machineForStepList) {
			machineSelect.options[machineSelect.options.length] = new Option(machineForStepList[key].title, machineForStepList[key].id);
			machineSelect.options[machineSelect.options.length - 1].classList.add(machineForStepList[key].status);
		}
		
		//NEED TO MODIFY
		$("#step_plan_config_select_" + stepIndex).on("change", function() {
			var index        = $(this).attr("id").split("_")[4];
			var step_guid    = $(this).val();
			var machine_guid = $(this).closest(".stepHeaderContainer").next().next().find("#machine_plan_config_select_" + index).val();
			var shift        = parseInt($(this).closest(".stepHeaderContainer").find(".shiftPlanConfigSelect").val());
			
			StoreStepConfig(this, index, step_guid, machine_guid, "step");
		});
		
		$("#machine_plan_config_select_" + stepIndex).on('change', function() {
			var index        = $(this).attr('id').split("_")[4];
			var step_guid    = $(this).closest(".eachStepContainer").find(".leftConfigTable select").val();
			var machine_guid = $(this).val();
			var thisMachine  = this;

			if($("option:selected", this).text() != languagePack.common.selectOption) {
				stepConfigArray[index].Machine_GUID = $(this).val();
				stepConfigArray[index].Machine_Name = $("option:selected", this).text();
			}
			
			GanttEmployeeDynamicList(machine_guid, index);
			
			/* setTimeout(function() {			
				StoreStepConfig(thisMachine, index, step_guid, machine_guid, "machine");
			},500); */
		});
		
		$("#shift_plan_config_select_" + stepIndex).on('change', function() {
			var index        = $(this).attr('id').split("_")[4];
			var machine_guid = $(this).closest(".eachStepContainer").find(".machineChildTable .machinePlanConfigSelect").val();
			var shift        = parseInt($(this).val());
			var step_guid    = $(this).closest(".stepHeaderContainer").find(".stepPlanConfigSelect").val();
			
			stepConfigArray[index].Shift = shift;			
			
			$(this).closest(".eachStepContainer").find(".stepDaysTable td").each(function() {
				if($(this).attr("dayIndex") == 6) {
					if(shift == 3) {
						$(this).removeClass("enabled");
						$(this).removeClass("daySelected");
						$(this).addClass("disabled");
					}
					else if(!configEditMode) {
						$(this).removeClass("disabled");
						$(this).addClass("enabled");
					}
				}
			});
			
			GanttEmployeeDynamicList(machine_guid, index);
		});
		
		$("#duration_plan_config_input_" + stepIndex).bind('input', function() {
			if($(this).val() < 1) {
				$(this).val(1)
			}
			
			if($(this).val() > 8) {
				$(this).val(8)
			}
			
			var index = $(this).attr('id').split("_")[4];
			var hours = parseInt($(this).val());
			
			stepConfigArray[index].Duration = hours;
		});
		
		$("#duration_plan_config_input_" + stepIndex).on('change', function() {
			if($(this).val() < 1) {
				$(this).val(1)
			}
			
			if($(this).val() > 8) {
				$(this).val(8)
			}
			
			var index = $(this).attr('id').split("_")[4];
			var hours = parseInt($(this).val());
			
			stepConfigArray[index].Duration = hours;
		});
		
		for(var i = 0; i < 7; i++) {		
			$("#stepDayCell_" + stepIndex + "_" + i).on('click', function() {
				if($(this).hasClass("enabled")) {				
					$(this).toggleClass("daySelected");
				}
			});
		}
		
		for(var i = 0; i < 3; i++) {		
			$("#stepShiftCell_" + stepIndex + "_" + i).on('click', function() {
				if($(this).hasClass("enabled")) {				
					$(this).toggleClass("shiftSelected");
				}
			});
		}
		
		$("#stepDayAll_" + stepIndex).on('click', function() {
			if($(this).hasClass("enabled")) {				
				$(this).toggleClass("allSelected");
				
				if(!$(this).hasClass("allSelected")) {
					$(this).html("Todos");
					$(this).closest('tr').find('.stepDayCell').each(function(index) {
						if(index > 0 && $(this).hasClass('daySelected')) {
							$(this).click();
						}
					});
				}
				else {
					$(this).html("Ninguno");
					$(this).closest('tr').find('.stepDayCell').each(function(index) {
						if(index > 0 && (!$(this).hasClass('daySelected'))) {
							$(this).click();
						}
					});					
				}
			}
		});

		$("#remove_step_" + stepIndex).on('click', function() {
			RemoveStep($(this))
			stepIndex--;
		});
		
		$("#step_plan_config_select_" + stepIndex).change();
		$("#duration_plan_config_input_" + stepIndex).val(1);
		$("#duration_plan_config_input_" + stepIndex).change();
		//$("#shift_plan_config_select_" + stepIndex).change();

		if(configEditMode) {
			//$("#shift_plan_config_select_" + stepIndex).val(newStepShift);
			//$("#shift_plan_config_select_" + stepIndex).attr("disabled","disabled");
			$("#step_plan_config_select_" + stepIndex).find("option").each(function() {
				for(var k in newSingleStepArr) {
					if($(this).val() == newSingleStepArr[k]) {
						$(this).attr("disabled","disabled");					
						$(this).removeAttr("selected");
					}
				}
			});
			
			$("#step_container_" + stepIndex).find(".stepDayCell").each(function() {
				$(this).addClass("disabled");
				$(this).removeClass("enabled");
			});
			
			$("#step_container_" + stepIndex).find(".stepShiftCell").each(function() {
				$(this).addClass("disabled");
				$(this).removeClass("enabled");
			});

			$("#step_container_" + stepIndex).find(".stepDayCell[CalendarDate='"+newStepShiftDate+"']").addClass("daySelected");
			$("#step_container_" + stepIndex).find(".stepDayCell[CalendarDate='"+newStepShiftDate+"']").removeClass("disabled");
			$("#step_container_" + stepIndex).find(".stepDayCell[CalendarDate='"+newStepShiftDate+"']").addClass("disabled2");

			$("#step_container_" + stepIndex).find(".stepShiftCell[CalendarShift='"+newStepShift+"']").addClass("shiftSelected");
			$("#step_container_" + stepIndex).find(".stepShiftCell[CalendarShift='"+newStepShift+"']").removeClass("disabled");
			$("#step_container_" + stepIndex).find(".stepShiftCell[CalendarShift='"+newStepShift+"']").addClass("disabled2");
			
			//$("#shift_plan_config_select_" + stepIndex).change();
		}

		$("#plan_config_step_container").scrollTo("#step_container_" + stepIndex, {duration: 500, offsetTop : '50'});
		ServiceComplete();
	}, 250);
}

function GenerateEmployees(index) {
	var stepEmployeesHTML = '';
	
	$("#step_container_" + index).find(".planConfigHr").remove();	
	$("#step_container_" + index).find(".assetChildTable").remove();
	delete stepConfigArray[index].Operator_GUID;
	delete stepConfigArray[index].Operator_Name;
	delete stepConfigArray[index].Helper_GUID;
	delete stepConfigArray[index].Helper_Name;
	
	if(ganttEmployeeList.length > 0) {
	
		stepEmployeesHTML += '<table class="assetChildTable"><tr class="assetRow"><td style="width: 97px; text-align: right"><span>'+languagePack.planning.operator+':</span></td><td><select class="employeeSelect unLoaded" id="operator_select_' + index + '"><option value="-1">'+languagePack.common.selectEmployee+'</option></select></td>';
		stepEmployeesHTML += '<td style="width: 97px; text-align: right"><span>'+languagePack.planning.helper+':</span></td><td><select class="employeeSelect unLoaded" id="helper_select_' + index + '"><option value="-1">'+languagePack.common.selectEmployee+'</option></select></td></tr></table>';
		
		$("#plan_config_step_container").find("#step_container_" + index).find(".machineChildTable").after(stepEmployeesHTML);
		
		setTimeout(function() {
			var operatorSelect = document.getElementById('operator_select_' + index);
			var helperSelect   = document.getElementById('helper_select_' + index);

			
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
			
			$('#operator_select_' + index).on('change', function() {
				if($(this).val() == -1) {
					delete stepConfigArray[index].Operator_GUID;
					delete stepConfigArray[index].Operator_Name;
				}
				else {
					var Employee_GUID = $(this).val();
					var Employee_Name  = $("option:selected", this).text();
					
					
					stepConfigArray[index].Operator_GUID = Employee_GUID;
					stepConfigArray[index].Operator_Name = Employee_Name;
				}
			});
			
			$('#helper_select_' + index).on('change', function() {
				if($(this).val() == -1) {
					delete stepConfigArray[index].Helper_GUID;
					delete stepConfigArray[index].Helper_Name;					
				}
				else {
					var Employee_GUID = $(this).val();
					var Employee_Name  = $("option:selected", this).text();
					
					
					stepConfigArray[index].Helper_GUID = Employee_GUID;
					stepConfigArray[index].Helper_Name = Employee_Name;
				}
			});
			
		},250);
	}
}

function GenerateMeasures(element, index, step_guid, machine_guid, entity) {
	
	$(element).closest(".eachStepContainer").find(".measureChildTable").remove();
	
	var stepMeasuresHtml = '';
	stepMeasuresHtml += '<div class="childTable measureChildTable">';
	
	var measureIndex = 0;

	while (stepConfigArray[index]["Measure_" + measureIndex]) {
		stepMeasuresHtml += '<table class="componentTable"><tr><td><span class="measureSpan">' + stepConfigArray[index]["Measure_" + measureIndex] + ':</span></td></tr><tr><td><input id="measure_plan_config_input_' + index + '_' + measureIndex + '" type="number" min="0" step="0.1"></td></tr><tr><td colspan="2"></td></tr></table>';
		measureIndex++;
	}
	
	stepMeasuresHtml += '</div>';

	$(element).closest(".eachStepContainer").append(stepMeasuresHtml);
}

function RemoveStep(element) {
	var index = element.attr("id").split("_")[2];

	stepConfigArray.splice(index, 1);
	
	element.parent().css("display", "none");	
	ReorderSteps(element);
}

function ReorderSteps(element) {
	$(".eachStepContainer:visible").each(function(i){
		$(this).find(".leftConfigTable .leftConfigSpan").html(languagePack.planning.step + " " + (i + 1) + ":");
	});
	
	element.parent().remove();
}

function UpdateConfigStepOptions(index, step_guid, shift) {
	$(".eachStepContainer").each(function(key) {
		var element = $(this);
		if(index != key) {
			element.find(".stepPlanConfigSelect option[value='"+step_guid+"']").attr("disabled","disabled");
		}
	});
}

function UpdateConfigShiftOptions(index, step_guid, shift) {
	$(".eachStepContainer").each(function(key) {
		var element = $(this);
		if(index != key) {
			element.find(".shiftPlanConfigSelect option[value='"+shift+"']").attr("disabled","disabled");
		}
	});
}




















