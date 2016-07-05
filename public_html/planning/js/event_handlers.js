/*============================================================
	Property of:		MISOM TECHNOLOGIES
	Developer:			AARON MCCOLOUGH
	Application Name:	FARA_FRESNILLO
	Directory:			FARA_FRESNILLO/PLANNING/JS
	File Name:			event_handlers.js
=============================================================*/

var locationComboGuid;
var locationComboName;
var obracodeComboGuid;
var processComboGuid;
var processComboName;
var methodComboGuid;
var methodComboName;
var location_LF;
var locationLocalFilter = "";
var planConfigGUID      = "";
var canSubmit           = false;
var from_plan          = false;
var hasChecklists       = false;  //this will be set to true once a plan has been approved
var lineupReady         = false;  //this will be set to true if all of the checklists are in ready status for atleast one shift during the week

$(document).ready(function() {
	
	$(".lang-common.submit").html(languagePack.common.submit);
	$(".lang-common.acceptChanges").html(languagePack.common.acceptChanges);
	$(".lang-common.loading").html(languagePack.common.loading);
	$(".lang-planning.header").html(languagePack.planning.header);
	$(".lang-planning.location").html(languagePack.planning.location);
	$(".lang-planning.process").html(languagePack.planning.process);
	$(".lang-planning.method").html(languagePack.planning.method);
	$(".lang-planning.addStep").html(languagePack.planning.addStep);
	$(".lang-planning.generatePlan").html(languagePack.planning.generatePlan);
	$(".lang-planning.configureSteps").html(languagePack.planning.configureSteps);
	$(".lang-planning.startDate").html(languagePack.planning.startDate);
	$(".lang-planning.endDate").html(languagePack.planning.endDate);
	$(".lang-planning.planningSystem").html(languagePack.planning.planningSystem);
	$(".lang-planning.planning").html(languagePack.planning.planning);
	$(".lang-planning.review").html(languagePack.planning.review);
	$(".lang-planning.checklists").html(languagePack.planning.checklists);
	$(".lang-planning.lineup").html(languagePack.planning.lineup);
	$(".lang-planning.addPlan").html(languagePack.planning.addPlan);
	$(".lang-planning.addLineup").html(languagePack.planning.addLineup);
	$(".lang-planning.generateLineup").html(languagePack.planning.generateLineup);
	$(".lang-datetime.weekof").html(languagePack.datetime.weekof);
	
	// LOCATION DROP DOWN CHANGE METHOD HANDLER
	$("#location_select").on("change", function() {
		locationComboGuid = $("#location_select").val();
		locationComboName = $("#location_select option:selected").text();
		obracodeComboGuid = $("#location_select option:selected").attr("ObracodeGUID");
		ClosePlanComponents();
		OpenPlanConfigWindow();
	});
	
	// PROCESS DROP DOWN CHANGE METHOD HANDLER
	$("#process_select").on("change", function() {
		processComboGuid = $("#process_select").val();
		processComboName = $("#process_select option:selected").text();
		
		PopulateMethodSelector();
	});
	
	// METHOD DROP DOWN CHANGE METHOD HANDLER
	$("#method_select").on("change", function() {
		methodComboGuid = $("#method_select").val();
		methodComboName = $("#method_select option:selected").text();
	});
	
	$("#plan_config_cancel_btn").on("click", function() {
		HidePlanConfigWindow();
		$("#plan_component_button").toggleClass('open');
	});
	
	$("#asset_config_cancel_btn").on("click", function() {
		HideAssetConfigWindow();
	});
	
	$("#calendar_component_cancel").on("click", function() {
		CloseCalendarFilter();
	});
	
	$("#plan_component_cancel").on("click", function() {
		ClosePlanComponents();
		$("#plan_component_button").toggleClass('open');
	});

	$("#plan_component_button").on("click", function() {		
		if(!$(this).hasClass("buttonInactive")) {
			OpenPlanComponents();
		}
	});
	
	$("#config_add_step_button").on("click", function() {
		if(!($("#process_select").val()) || $("#process_select").val() == languagePack.common.selectOption) {
			DisplayAlert(languagePack.message.alert,languagePack.message.selectProcess);
		}
		else if(!($("#method_select").val()) || $("#method_select").val() == languagePack.common.selectOption) {
			DisplayAlert(languagePack.message.alert,languagePack.message.selectMethod);
		}
		else {
			LockForService();
			GetStepsFromCombination();
		}
	});
	
	$("#plan_gantt_toggle").on("click", function() {
		if(!($("#plan_gantt_toggle").hasClass("isinfocus"))) {
			$("#plan_gantt_toggle").addClass("isinfocus");
			$("#plan_calendar_toggle").removeClass("isinfocus");
			$("#plan_review_toggle").removeClass("isinfocus");
			$("#lineup_toggle").removeClass("isinfocus");
			LoadPlanHtml("gantt");
		}
	});
	
	$("#plan_review_toggle").on("click", function() {
		if(!($("#plan_review_toggle").hasClass("isinfocus"))) {
			$("#plan_review_toggle").addClass("isinfocus");
			$("#plan_gantt_toggle").removeClass("isinfocus");
			$("#plan_calendar_toggle").removeClass("isinfocus");
			$("#lineup_toggle").removeClass("isinfocus");
			LoadPlanHtml("review");
		}
	});
	
	$("#lineup_toggle").on("click", function() {
		if(!($("#lineup_toggle").hasClass("isinfocus")) && !($("#lineup_toggle").hasClass("buttonInactive"))) {
			$("#lineup_toggle").addClass("isinfocus");
			$("#plan_gantt_toggle").removeClass("isinfocus");
			$("#plan_calendar_toggle").removeClass("isinfocus");
			$("#plan_review_toggle").removeClass("isinfocus");
			LoadPlanHtml("prelineup");
		}		
	});

	$("#plan_calendar_toggle").on("click", function() {
		if(!$(this).hasClass("buttonInactive")) {
			if(ganttLocations.length < 1) {
				DisplayAlert(languagePack.message.alert, languagePack.message.noPlansAssigned + " " + $("#zone_filter option:selected").text() + " " + languagePack.message.forTheWeekOf + " " + moment(WeekBeginTime).format('Do MMMM YYYY') + ".");
			}
			else {
				OpenCalendarFilter();
			}
		}
	});
	
	$("#calendar_location_select").on("change", function() {
		if(!($("#plan_calendar_toggle").hasClass("isinfocus"))) {
			$("#plan_calendar_toggle").addClass("isinfocus");
			$("#plan_gantt_toggle").removeClass("isinfocus");
			$("#plan_review_toggle").removeClass("isinfocus");
			$("#lineup_toggle").removeClass("isinfocus");
		}
		location_LF         = $("#calendar_location_select").val();
		locationLocalFilter = $("#calendar_location_select option:selected").text();
		CloseCalendarFilter();
		GetPlanConfigGUID("calendar");
	});
	
	$("#submit_rquest_btn").on("click", function() {
		if(!$(this).hasClass("buttonInactive")) {
			if(superintendentData.length > 0) {
				DisplayConfirm(languagePack.message.confirm, languagePack.message.submittingPlan,
					function() {
						if(WkFlowData.length <= 0) {
							GeneratePlanWorkFlow();
						}
						else {
							UpdatePlanWorkFlow();
						}					
					}
				);
			}
			else {
				DisplayAlert(languagePack.message.alert,languagePack.message.cannotSubmitPlan + " " + $("#area_filter option:selected").text() + ".");
			}
		}
	});
	
	$("#add_lineup_btn").on("click", function() {
		if(!$(this).hasClass("buttonInactive")) {
			AddCrewLineup();
		}
	});
	
	$("#submit_lineup_btn").on("click", function() {
		if(!$(this).hasClass("buttonInactive")) {
			DisplayConfirm(languagePack.message.confirm, languagePack.message.submittingPlan,
				function() {
					GetLocationStatusForLineup();
				}
			);
		}
	});
	
	ServiceComplete();
	
	$("#plan_gantt_toggle").click();
});

function LockForService() {
	OpenTopPopupWrapper();
}

function ServiceComplete() {
	CloseTopPopupWrapper();
}

function OpenCalendarFilter() {
	OpenPopupWrapper();
	$('#calendar_component_container').css("display", "block");
	$('#calendar_component_container').animate({"height":"72px"}, 200);
}

function CloseCalendarFilter() {
	ClosePopupWrapper();
	$('#calendar_component_container').css("display", "none");
	$('#calendar_component_container').css("height", "0px");	
	
}

function OpenLineUpForm() {
	OpenPopupWrapper();
	$('#lineup_popup_container').css("display", "block");
	$('#lineup_popup_container').animate({"opacity":1}, 200);
}

function CloseLineUpForm() {
	ClosePopupWrapper();
	$('#lineup_popup_container').css("display", "none");
	$('#lineup_popup_container').css("opacity", 0);
}

function OpenPlanComponents() {
	OpenPopupWrapper();
	$("#location_select").val($("#location_select option:first").val());
	$('#plan_component_container').css("display", "block");
	$('#plan_component_container').animate({"height":"72px"}, 200);
}

function ClosePlanComponents() {
	ClosePopupWrapper();
	$('#plan_component_container').css("display", "none");
	$('#plan_component_container').css("height", "0px");	
}

function OpenPlanConfigWindow() {
	OpenPopupWrapper();
	$('#plan_config_popup_container').css("display", "block");
	$('#plan_config_popup_container').animate({"opacity":1}, 200);
	
	PopulateConfigWindowSetup();
}

function HidePlanConfigWindow() {
	ClosePopupWrapper();
	$('#plan_config_popup_container').css("display", "none");
	$('#plan_config_popup_container').css("opacity", 0);
	$("#plan_config_step_container").html("");
	
	stepIndex         = -1;
	newStepLocation   = "";
	newSingleStepArr  = [];
	newStepMethodArr  = [];
	newStepProcessArr = [];
	newStepShift      = "";
	newStepShiftDate  = "";
	configEditMode    = false;
	
	$("#process_select").attr("disabled", false);
	$("#method_select").attr("disabled", false);
}

function OpenAssetConfigWindow(element) {
	OpenPopupWrapper();
	$('#asset_config_popup_container').css("display", "block");
	$('#asset_config_popup_container').animate({"opacity":1}, 200);
	
	PopulateAssetConfigWindowSetup(element);
}

function HideAssetConfigWindow() {
	ClosePopupWrapper();
	$('#asset_config_popup_container').css("display", "none");
	$('#asset_config_popup_container').css("opacity", 0);
	$("#asset_config_step_container").html("");
}

function GetPlanConfigGUID(page) {
	var jqxhrPlanConfigs = $.getJSON(ruIP + ruPort + planningDB + planningEN + "read/trans/PlanConfig?where=\"Area_GUID = '" + area_GF + "' AND Zone_GUID = '" + zone_GF + "' AND Location_GUID = '" + location_LF + "' AND IsActive = '1' AND StartDate >= '" + WeekBeginTime + "' AND StartDate <= '" + WeekEndTime + "'\"", function() {
		var planConfigData = jQuery.parseJSON(jqxhrPlanConfigs.responseText);
		
		if(planConfigData.length > 0) {
			planConfigGUID = planConfigData[0].PlanConfig_GUID;
			
			var jqxhrwkfl = $.getJSON(ruIP + ruPort + planningDB + planningEN + "read/dbo/v_WkFlow_Detail?where=\"IsActive = '1' AND Area_GUID = '" + area_GF + "' AND Zone_GUID = '" + zone_GF + "' AND StartDate >= '" + WeekBeginTime + "' AND EndDate <= '" + WeekEndTime + "' AND IsCurrentStatus = '1'\"", function() {
				var wkflData = jQuery.parseJSON(jqxhrwkfl.responseText);
				
				if(wkflData.length > 0) {
					if(wkflData[0].StatusDisplayName != "Rejected") {
						LoadPlanHtml(page);
					}
					else {
						DisplayAlert(languagePack.message.alert,languagePack.message.noPlans);
						$("#plan_gantt_toggle").click();
					}
				}
				else {
					DisplayAlert(languagePack.message.alert,languagePack.message.noPlans);
					$("#plan_gantt_toggle").click();
				}
			});			
		}
		else {			
			planConfigGUID = "";
			DisplayAlert(languagePack.message.alert,languagePack.message.noPlans);
			$("#plan_gantt_toggle").click();
		}
	});
}

function LoadPlanHtml(page) {
	LockForService();
	addingLineup = false;
	if(page == "gantt") {
		$("#submit_rquest_btn").css({"display":"inline-block"});
		$("#plan_status_label").css("display","inline-block");
		$("#plan_status_indicator").css("display","inline-block");
		$("#plan_component_button").css("visibility","visible");
	}
	else {
		$("#submit_rquest_btn").css({"display":"none"});
		$("#plan_status_label").css("display","none");
		$("#plan_status_indicator").css("display","none");	
		$("#plan_component_button").css("visibility","hidden");	
	}
	
	if(page == "lineup") {
		$("#add_lineup_btn").css("display","inline-block");
		$("#submit_lineup_btn").css("display","inline-block");
	}
	else {	
		$("#add_lineup_btn").css("display","none");
		$("#submit_lineup_btn").css("display","none");
		LineupPlanData      = [];
		LineupPlanStepData  = [];
		LineupPlanAssetData = [];
		operatorGuid        = "";
		helperGuid          = "";
	}
	
	$("#content_container .sectionForm").css("overflow-y","auto");
	
	$("#main_form").load('../planning/' + page + '.html');
}

function getURLBeforeLoad(sequence) {
	if(sequence == "aux") {
		LockForService();
		if($("#plan_week_selector").length > 0) {
			LoadPlanLists();
		}
	}
}