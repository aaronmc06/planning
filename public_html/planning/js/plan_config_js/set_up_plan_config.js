/*============================================================
	Property of:		MISOM TECHNOLOGIES
	Developer:			AARON MCCOLOUGH
	Application Name:	FARA_FRESNILLO
	Directory:			FARA_FRESNILLO/PLANNING/JS/PLAN_CONFIG_JS
	File Name:			set_up_plan_config.js
=============================================================*/

var stepsArray      = []; //Array with available steps associated to the method of the last added step
var stepConfigArray = []; //Array with current steps added in the config screen
var stepDaysArray   = [{"Mon":0,"Tue":0, "Wed":0, "Thu":0, "Fri":0, "Sat":0, "Sun":0},{"Mon":0,"Tue":0, "Wed":0, "Thu":0, "Fri":0, "Sat":0, "Sun":0},{"Mon":0,"Tue":0, "Wed":0, "Thu":0, "Fri":0, "Sat":0, "Sun":0}];

function PopulateConfigWindowSetup() {	
			
	var jqxhrprocesses = $.getJSON(ruIP + ruPort + planningDB + planningEN + "read/dbo/v_ObracodeProcess_Config?where=\"Obracode_GUID = '"+ obracodeComboGuid +"'\"", function() {
		var processData = jQuery.parseJSON(jqxhrprocesses.responseText);
		
		$('#process_select').html("<option>"+languagePack.common.selectOption+"</option>");
		var processSelect = document.getElementById('process_select');
		
		for(var key in processData) {
			processSelect.options[processSelect.options.length] = new Option(processData[key].MineProcessDisplayName, processData[key].MineProcess_GUID);
		}
		
		$("#plan_config_location").val(locationComboName);
		$("#plan_config_method").val(methodComboName);
		$("#plan_config_week_of").val(moment($('#plan_week_selector').val()).format("dddd, MMM Do"));
				
		if(newStepMethodArr[0] && configEditMode) {
			if($("#method_select").val(newStepMethodArr[0])) {
				$("#process_select").attr("disabled","disabled");
				$("#method_select").attr("disabled","disabled");
				$("#process_select").val(newStepProcessArr[0]);
				$("#process_select").change();
			}				
		}		
	});
}
 
function GetStepsFromCombination() {
	stepsArray = [];
	
	var jqxhrsteps = $.getJSON(ruIP + ruPort + planningDB + planningEN + "read/dbo/v_Step?where=\"IsActive = '1' And Method_GUID = '" + methodComboGuid + "' ORDER BY Ordinal ASC\"", function() {		
		var stepsData = jQuery.parseJSON(jqxhrsteps.responseText);

		for(var key in stepsData) {
			stepsArray.push(stepsData[key]);
		}
		GeneratePlanConfigWindowHTML();
	});
}

function StoreStepConfig(element, index, step_guid, machine_guid, entity) {
	
	for(var key in stepsArray) {
		if(stepsArray[key].Step_GUID == step_guid) {
			var dataObj = {};
			
			for(var key2 in stepConfigArray[index]) {
				dataObj[key2] = stepConfigArray[index][key2]
			}
			
			dataObj.DisplayName       = stepsArray[key].DisplayName;
			dataObj.IsActive          = stepsArray[key].IsActive;
			dataObj.Method_GUID       = stepsArray[key].Method_GUID;
			dataObj.MineProcess_GUID  = stepsArray[key].MineProcess_GUID;
			dataObj.Ordinal           = stepsArray[key].Ordinal;
			dataObj.StepName          = stepsArray[key].StepName;
			
			dataObj.Step_GUID         = stepsArray[key].Step_GUID;
			
			if(machine_guid) {
				dataObj.Machine_GUID = machine_guid;
			}
			
			stepConfigArray.splice(index, 1, dataObj);
		}
	}
	GetMeasures(element, index, step_guid, machine_guid, entity);
}

function GetMeasures(element, index, step_guid, machine_guid, entity) {

	var jqxhrstepmeasures = $.getJSON(ruIP + ruPort + planningDB + planningEN + "read/dbo/v_StepMeasureConfig?where=\"StepMeasure_IsActive = '1' AND Step_GUID = '" + step_guid + "' ORDER BY MeasureDisplayName ASC\"", function() {		
		var stepMeasureData = jQuery.parseJSON(jqxhrstepmeasures.responseText);
		
		var count = 0;
		
		while(stepConfigArray[index]["Measure_" + count]) {
			delete stepConfigArray[index]["Measure_" + count];
			delete stepConfigArray[index]["Measure_GUID" + count];
			count++;
		}
		
		count = 0;
		
		var stepMeasureString = "";
		
		for(var key in stepMeasureData) {
			stepConfigArray[index]["Measure_" + key]     = stepMeasureData[key].MeasureDisplayName;
			stepConfigArray[index]["Measure_GUID" + key] = stepMeasureData[key].Measure_GUID;
			count++;
			
			if(key == 0) {
				stepMeasureString += ' AND Measure_GUID NOT IN (';
			}
			
			stepMeasureString += "'" + stepMeasureData[key].Measure_GUID + "'";
			if(key < stepMeasureData.length-1) {
				stepMeasureString += ",";
			}
			else {
				stepMeasureString += ')';
			}
			
		}
		
		GenerateMeasures(element, index, step_guid, machine_guid, entity);

		/* var jqxhrmachinemeasures = $.getJSON(ruIP + ruPort + planningDB + planningEN + "read/dbo/v_MachineTypeMeasureConfig?where=\"MachineTypeMeasure_IsActive = '1' AND Machine_GUID = '" + machine_guid + "'"+stepMeasureString+"\"", function() {		
			var machineMeasureData = jQuery.parseJSON(jqxhrmachinemeasures.responseText);

			for(var key2 in machineMeasureData) {
				stepConfigArray[index]["Measure_" + (parseInt(key2) + count).toString()]     = machineMeasureData[key2].MeasureDisplayName;
				stepConfigArray[index]["Measure_GUID" + (parseInt(key2) + count).toString()] = machineMeasureData[key2].Measure_GUID;
			}
			
			GenerateMeasures(element, index, step_guid, machine_guid, entity);
		}); */
	});	
}