/*============================================================
	Property of:		MISOM TECHNOLOGIES
	Developer:			JORGE MURILLO
	Application Name:	FARA_FRESNILLO
	Directory:			FARA_FRESNILLO/PLANNING/JS/REVIEW_JS
	File Name:			load_dropdowns.js
=============================================================*/

LoadAreasDropDown();

$(document).ready(function() {
	
	$('#processDD').on('change', function() {
		var value = this.value;
		
		(value == 0) ? LoadMethodDropDown([]) : LoadMethodDropDown([value]);
	});
	
	$('#methodDD').on('change', function() {
		var value = this.value;
		
		(value == 0) ? LoadActivityDropDown([]) : LoadActivityDropDown([value]);
	});
	
	$('#activityDD').on('change', function() {
		var value = this.value;
		
		(value == 0) ? LoadMeasuresDropDown([]) : LoadMeasuresDropDown([value]);
	});
});

function LoadAreasDropDown() {
	
	$.getJSON(ruIP + ruPort + planningDB + planningEN + "read/geo/Area?where=\"IsActive = '1'\"", function( areaData ) {
		
		$("#areaDD").empty();
		$("#areaDD").append(new Option(languagePack.common.selectOption, "0"));
		
		for(var key in areaData) {
			$("#areaDD").append(new Option(areaData[key].DisplayName, areaData[key].Area_GUID));
		}
		
		LoadProcessDropDown();
	});
}

function LoadProcessDropDown() {
	
	$.getJSON(ruIP + ruPort + planningDB + planningEN + "read/ref/MineProcess?where=\"IsActive = '1'\"", function( processData ) {
		var processGuidArray = [];
		
		$("#processDD").empty();
		$("#processDD").append(new Option(languagePack.common.selectOption, "0"));
		
		for(var key in processData) {
			$("#processDD").append(new Option(processData[key].DisplayName, processData[key].MineProcess_GUID));
			processGuidArray.push(processData[key].MineProcess_GUID);
		}
		
		LoadMethodDropDown(processGuidArray);
	});	
}

function LoadMethodDropDown(filter) {
	var filterString = "";
			
	$("#methodDD").empty();
	$("#methodDD").append(new Option(languagePack.common.selectOption, "0"));
	
	if(filter.length > 0) {
		filterString += " AND MineProcess_GUID IN ("
		for(var key in filter) {
			filterString += "'"+filter[key];
			(parseInt(key) < (filter.length - 1)) ? filterString += "'," : filterString += "'";			
		}
		filterString += ")";
	
		$.getJSON(ruIP + ruPort + planningDB + planningEN + "read/cfg/Method?where=\"IsActive = '1'"+filterString+"\"", function( methodData ) {
			var methodGuidArray = [];
			
			for(var key in methodData) {
				$("#methodDD").append(new Option(methodData[key].DisplayName, methodData[key].Method_GUID));
				methodGuidArray.push(methodData[key].Method_GUID);
			}
			LoadActivityDropDown(methodGuidArray);
		});
	}
}

function LoadActivityDropDown(filter) {
	var filterString = "";
			
	$("#activityDD").empty();
	$("#activityDD").append(new Option(languagePack.common.selectOption, "0"));
	
	if(filter.length > 0) {
		filterString += " AND Method_GUID IN ("
		for(var key in filter) {
			filterString += "'"+filter[key];
			(parseInt(key) < (filter.length - 1)) ? filterString += "'," : filterString += "'";			
		}
		filterString += ")";
	
		$.getJSON(ruIP + ruPort + planningDB + planningEN + "read/cfg/Step?where=\"IsActive = '1'"+filterString+"\"", function( activityData ) {
			var stepGuidArray = [];
			
			for(var key in activityData) {
				$("#activityDD").append(new Option(activityData[key].DisplayName, activityData[key].Step_GUID));
				stepGuidArray.push(activityData[key].Step_GUID);
			}
			LoadMeasuresDropDown(stepGuidArray);
		});
	}
}

function LoadMeasuresDropDown(filter) {
	var filterString = "";
			
	$("#measureDD").empty();
	$("#measureDD").append(new Option(languagePack.common.selectOption, "0"));
	
	if(filter.length > 0) {
		filterString += " AND Step_GUID IN ("
		for(var key in filter) {
			filterString += "'"+filter[key];
			(parseInt(key) < (filter.length - 1)) ? filterString += "'," : filterString += "'";			
		}
		filterString += ")";
	
		$.getJSON(ruIP + ruPort + planningDB + planningEN + "read/dbo/v_StepMeasureConfig?where=\"StepMeasure_IsActive = '1'"+filterString+"\"", function( measureData ) {
			
			for(var key in measureData) {
				$("#measureDD").append(new Option(measureData[key].MeasureDisplayName, measureData[key].Measure_GUID));
			}
		});	
	}
}









