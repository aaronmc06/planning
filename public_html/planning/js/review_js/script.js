/*============================================================
	Property of:		MISOM TECHNOLOGIES
	Developer:			JORGE MURILLO
	Application Name:	FARA_FRESNILLO
	Directory:			FARA_FRESNILLO/PLANNING/JS/REVIEW_JS
	File Name:			script.js
=============================================================*/

var locationArray = [];
var employeeArray = [];
var machineArray = [];

$(document).ready(function() {
	
	$(".lang-common.apply").html(languagePack.common.apply);
	$(".lang-menu-index.area").html(languagePack.common.area);
	$(".lang-common.process").html(languagePack.common.process);
	$(".lang-common.method").html(languagePack.common.method);
	$(".lang-common.activity").html(languagePack.common.activity);
	$(".lang-common.measure").html(languagePack.common.measure);
	$(".lang-common.pending").html(languagePack.common.pending);
	$(".lang-common.rejected").html(languagePack.common.rejected);
	$(".lang-common.approved").html(languagePack.common.approved);	
	$(".lang-common.selectOption").html(languagePack.common.selectOption);
	$(".lang-review.reviewPlans").html(languagePack.review.reviewPlans);
	
	if(UserData[0].RoleDisplayName == "Planner") {
		$("#rejected_filter_btn").addClass("ison");
	}
	else if(UserData[0].RoleDisplayName == "Superintendent") {
		$("#pending_filter_btn").addClass("ison");		
	}
	else {
		$("#pending_filter_btn").addClass("ison");
		$("#rejected_filter_btn").addClass("ison");
		$("#approved_filter_btn").addClass("ison");		
	}
	
	$("#apply_button").click(function() {
		var areaFilter = "";
		var stepFilter = "";
		var measureFilter = "";
	
		($("#areaDD").val() != "0") ? areaFilter = " AND Area_GUID = '"+$("#areaDD").val()+"'" : false;
		
		if($("#activityDD").val() == "0") {
			var guidArray = [];
			$("#activityDD option").each(function() {
				var value = $(this).val();
				(value != "0") ? guidArray.push($(this).val()) : false;
			});
			
			
			stepFilter += " AND Step_GUID IN ("
			for(var key in guidArray) {
				stepFilter += "'"+guidArray[key];
				(parseInt(key) < (guidArray.length - 1)) ? stepFilter += "'," : stepFilter += "'";			
			}
			stepFilter += ")";			
		}
		else {
			stepFilter = " AND Step_GUID = '"+$("#activityDD").val()+"'";
		}
		
		if($("#measureDD").val() == "0") {
			var guidArray = [];
			$("#measureDD option").each(function() {
				var value = $(this).val();
				(value != "0") ? guidArray.push($(this).val()) : false;
			});
			
			
			measureFilter += " AND Measure_GUID IN ("
			for(var key in guidArray) {
				measureFilter += "'"+guidArray[key];
				(parseInt(key) < (guidArray.length - 1)) ? measureFilter += "'," : measureFilter += "'";			
			}
			measureFilter += ")";			
		}
		else {
			measureFilter = " AND Measure_GUID = '"+$("#measureDD").val()+"'";
		}
		
		getLocations(areaFilter, stepFilter, measureFilter);
		getEmployees(areaFilter, stepFilter, measureFilter);
		getMachines(areaFilter, stepFilter, measureFilter);
	});

	$("#review_menu").on("click", function() {
		OpenReviewWindow();
	});

	$('#review_window_cancel_btn').on("click", function(){
		CloseReviewWindow();
	});
	
	$(".reviewFilterBtn").on("click", function() {
		$(this).toggleClass("ison");
		CalculateWkFlowFilters();
	});
	
	ServiceComplete();
});



function OpenReviewWindow() {
	OpenPopupWrapper();
	$('#review_window').css("display", "block");
	$('#review_window').animate({"width":"650px"}, 200);
	
	CalculateWkFlowFilters();
}

function CloseReviewWindow() {
	ClosePopupWrapper();
	$('#review_window').css("display", "none");
	$('#review_window').css("width", "0px");	
}