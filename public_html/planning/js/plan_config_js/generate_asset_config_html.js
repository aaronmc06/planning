/*============================================================
	Property of:		MISOM TECHNOLOGIES
	Developer:			AARON MCCOLOUGH
	Application Name:	FARA_FRESNILLO
	Directory:			FARA_FRESNILLO/PLANNING/JS/PLAN_CONFIG_JS
	File Name:			generate_asset_config_html.js
=============================================================*/

var ganttPlans = [];

function PopulateAssetConfigWindowSetup(element) {
	var currentRow    = $(element).closest(".stepRow");
	var planStep_guid = $(element).closest(".stepAssets").prev().attr("PlanStepGUID");
	var step_name     = $(element).closest(".stepAssets").prev().html();
	var locationRow;
	var methodRow;
	var location_guid;
	var location_name;
	var method_guid;
	var method_name;
	stepElement = element;
	
	asset_planstepguid = $(element).closest("td").find('.tdCont').attr("PlanStepGUID");
	
	while(!(currentRow.prev().hasClass("locationRow"))) {
		currentRow = currentRow.prev();
	}
	
	locationRow = currentRow.prev();
	currentRow  = $(element).closest(".stepRow");
	
	while(!(currentRow.prev().hasClass("methodRow"))) {
		currentRow = currentRow.prev();
	}
	
	methodRow = currentRow.prev();
	
	location_guid = locationRow.find(".tdCont").attr("LocationGUID");
	method_guid   = methodRow.find(".tdCont").attr("MethodGUID");
	
	location_name = locationRow.find(".tdCont").html();
	method_name   = methodRow.find(".tdCont").html();
	
	$("#asset_config_location").val(location_name);
	$("#asset_config_method").val(method_name);
	$("#asset_config_description").html(step_name);
	
	GenerateAssetConfigWindowHTML(planStep_guid);
}

function GetPlanDetail(planStep_guid) {
	ganttPlans = [];
	
	var jqxhrplans = $.getJSON(ruIP + ruPort + planningDB + planningEN + "read/dbo/v_Plan?where=\"PlanStep_GUID = '" + planStep_guid + "' AND IsActive = '1' Order By ShiftDate, Shift\"", function() {		
		ganttPlans = jQuery.parseJSON(jqxhrplans.responseText);
	});
}

function GenerateAssetConfigWindowHTML(planStep_guid) {
	var stepContainer = $("#asset_config_step_container");
	var planContainerHTML = "";	

	stepContainer.html('');
	
	for(var key in ganttPlans) {
		var shiftName = '';
		var date = moment(new Date(ganttPlans[key].Shiftdate)).add(7, 'h').format('Do MMM YYYY');
		
		switch(ganttPlans[key].Shift) {
			case 1:
				shiftName = languagePack.common.first;
				break;
			case 2:
				shiftName = languagePack.common.second;
				break;
			case 3:
				shiftName = languagePack.common.third;
				break;
			default:
				shiftName = ''
		}
		
		planContainerHTML += '<div PlanGUID="' + ganttPlans[key].Plan_GUID + '" class="eachStepContainer" id="plan_container_' + key + '"><div class="stepHeaderContainer"><table class="leftConfigTable"><tr class="leftConfigRow"><td><span class="leftConfigSpan">' + shiftName + ':</span></td></tr></table><table class="rightConfigTable"><tr class="rightConfigRow"><td><span class="rightConfigSpan">' + date + '</span></td></tr></table></div>';
		
		for(var key2 in ganttMachines) {
			var createRemoveButton = false;
			var i = 0;
			planContainerHTML += '<table MachineGUID="' + ganttMachines[key2].Machine_GUID + '" class="shiftChildTable">';
			planContainerHTML += '<tr><td class="shiftMachineHeaderCell ' + ganttMachines[key2].MachineStatus + '" colspan="2"><span class="leftConfigSpan">' + ganttMachines[key2].MachineDisplayName + '</span><span class="rightConfigTable">' + ganttMachines[key2].MachineTypeDisplayName + '</span></td></tr>';
			
			for(var key3 in ganttAssets) {
				if(ganttAssets[key3].Plan_GUID == ganttPlans[key].Plan_GUID && ganttAssets[key3].Machine_GUID == ganttMachines[key2].Machine_GUID) {
					i++;
					planContainerHTML += '<tr class="ganttAssetRow" PlanAssetGUID="' + ganttAssets[key3].PlanAsset_GUID + '"><td><select operator="' + ganttAssets[key3].IsOperator + '" helper="' + ganttAssets[key3].IsHelper + '" class="workerSelect positionSelect"><option>'+languagePack.common.selectEmployee+'</option></select></td><td><select EmployeeGUID="' + ganttAssets[key3].Employee_GUID + '" class="workerSelect employeeSelect"><option>'+languagePack.common.selectEmployee+'</option></select></td></tr>';
				}

				if(i > 1) {
					createRemoveButton = true;
				}
			}			
			
			if(i == 0) {
				planContainerHTML += '<tr class="ganttAssetRow"><td><select class="workerSelect positionSelect"><option>'+languagePack.common.selectPosition+'</option></select></td><td><select class="workerSelect employeeSelect"><option>'+languagePack.common.selectEmployee+'</option></select></td></tr>';
			}

			if(createRemoveButton) {
				planContainerHTML += '<tr><td colspan="2"><div class="shiftAssetButtonContainer"><div style="left:-2px" class="shiftAddPersonBtn" onclick="AddWorkerToConfig(this)">+</div><div class="shiftRemovePersonBtn" onclick="RemoveWorkerFromConfig(this)">_</div></div></td></tr>';
			}
			else {
				planContainerHTML += '<tr><td colspan="2"><div class="shiftAssetButtonContainer"><div class="shiftAddPersonBtn" onclick="AddWorkerToConfig(this)">+</div></div></td></tr>';
			}
						
			planContainerHTML += '</table>';
		}
		
		planContainerHTML += '</div>';
	}
	
	stepContainer.append(planContainerHTML);
	
	$(".positionSelect").each(function(index) {
		$(this).html("");
		$(this).append('<option>Elegir Posici&oacute;n</option>');
		for(var key in positionArray) {
			$(this).append('<option value="' + key + '">' + positionArray[key] + '</option>');
		}
		
		if($(this).attr('operator')) {
			var operatorValue = $(this).attr('operator');
			var helperValue = $(this).attr('helper');
			
			if(operatorValue == "true") {
				$(this).val(0);
			}
			else if(helperValue == "true") {
				$(this).val(1);
			}
			else {
				$(this).val(-1);
			}
		}
	});
	
	$(".employeeSelect").each(function() {
		$(this).html("");
		$(this).append('<option>'+languagePack.common.selectEmployee+'</option>');
		for(var key in employeeData) {
			$(this).append('<option value="' + employeeData[key].Employee_GUID + '">' + employeeData[key].EmployeeName + '</option>');
		}
		
		if($(this).attr('EmployeeGUID')) {
			$(this).val($(this).attr('EmployeeGUID'));
		}
	});
}

function AddWorkerToConfig(element) {
	$(element).closest('tr').before('<tr class="ganttAssetRow" ><td><select class="workerSelect positionSelect"><option>'+languagePack.common.selectPosition+'</option></select></td><td><select class="workerSelect employeeSelect"><option>'+languagePack.common.selectEmployee+'</option></select></td></tr>');
	
	if(!($(element).next()[0])) {
		$(element).after('<div class="shiftRemovePersonBtn" onclick="RemoveWorkerFromConfig(this)">_</div>');
	}
	
	$(element).css({"right":"","left":"-2px"});
	
	$(element).closest('tr').prev().find(".positionSelect").html("");
	$(element).closest('tr').prev().find(".positionSelect").append('<option>'+languagePack.common.selectPosition+'</option>');
	for(var key in positionArray) {
		$(element).closest('tr').prev().find(".positionSelect").append('<option value="' + key + '">' + positionArray[key] + '</option>');
	}	
	
	$(element).closest('tr').prev().find(".employeeSelect").html("");
	$(element).closest('tr').prev().find(".employeeSelect").append('<option>'+languagePack.common.selectEmployee+'</option>');
	for(var key in employeeData) {
		$(element).closest('tr').prev().find(".employeeSelect").append('<option value="' + employeeData[key].Employee_GUID + '">' + employeeData[key].EmployeeName + '</option>');
	}
}

function RemoveWorkerFromConfig(element) {
	if($(element).closest('tr').prev().attr("PlanAssetGUID")){
		var dataObj = {};
		var apiKeyObj = {};
		apiKeyObj.PlanAsset_GUID = $(element).closest('tr').prev().attr("PlanAssetGUID");
		dataObj.APIKEY           = apiKeyObj;
		dataObj.IsActive         = false;
		
		removedAssetArray.push(dataObj);
	}
	
	$(element).closest('tr').prev().remove();
	
	if(!($(element).closest('tr').prev().prev().hasClass("ganttAssetRow"))) {
		$(element).remove();
	}
}















