/*============================================================
	Property of:		MISOM TECHNOLOGIES
	Developer:			AARON MCCOLOUGH
	Application Name:	FARA_FRESNILLO
	Directory:			FARA_FRESNILLO/PLANNING/JS
	File Name:			role_access.js
=============================================================*/

var proceed = true;

function CheckStatus() {
	proceed = true;

	if(WkFlowData.length > 0) {
		if(WkFlowData[0].StatusDisplayName != "Rejected") {
			proceed = false;
		}
	}
	
	$("#submit_rquest_btn").attr("canSubmit", false);
	$("#submit_rquest_btn").addClass("buttonInactive");
	
	$("#plan_calendar_toggle").attr("hasChecklists", false);
	$("#plan_calendar_toggle").addClass("buttonInactive");
	
	$("#plan_component_button").attr("canAdd", false);
	$("#plan_component_button").addClass("buttonInactive");
	
	$("#plan_status_label").html("");
	$("#plan_status_indicator").html("");

	if(WkFlowData.length > 0) {
		if(WkFlowData[0].StatusDisplayName == "Pending") {
			$("#submit_rquest_btn").attr("canSubmit", false);
			$("#submit_rquest_btn").addClass("buttonInactive");
			
			$("#plan_calendar_toggle").attr("hasChecklists", false);
			$("#plan_calendar_toggle").addClass("buttonInactive");
			
			$("#plan_component_button").attr("canAdd", false);
			$("#plan_component_button").addClass("buttonInactive");
			
			$("#plan_status_label").html(languagePack.planning.planStatus);
			$("#plan_status_indicator").html(languagePack.planning.pending);
			$("#plan_status_indicator").css("color","rgba(228,145,20,1)");
		}
		else if(WkFlowData[0].StatusDisplayName == "Approved") {
			$("#submit_rquest_btn").attr("canSubmit", false);
			$("#submit_rquest_btn").addClass("buttonInactive");
			
			$("#plan_calendar_toggle").attr("hasChecklists", true);
			$("#plan_calendar_toggle").removeClass("buttonInactive");
			
			$("#plan_component_button").attr("canAdd", false);
			$("#plan_component_button").addClass("buttonInactive");
			
			$("#plan_status_label").html(languagePack.planning.planStatus);
			$("#plan_status_indicator").html(languagePack.planning.approved);
			$("#plan_status_indicator").css("color","rgba(50,167,50,1)");
		}
		else if(WkFlowData[0].StatusDisplayName == "Rejected") {
			if(UserData[0].RoleDisplayName == "Planner" || UserData[0].RoleDisplayName == "Admin" || UserData[0].RoleDisplayName == "SuperAdmin") {
				$("#submit_rquest_btn").attr("canSubmit", true);
				$("#submit_rquest_btn").removeClass("buttonInactive");
			
				$("#plan_component_button").attr("canAdd", true);
				$("#plan_component_button").removeClass("buttonInactive");
			}
			
			$("#plan_calendar_toggle").attr("hasChecklists", false);
			$("#plan_calendar_toggle").addClass("buttonInactive");
			
			$("#plan_status_label").html(languagePack.planning.planStatus);
			$("#plan_status_indicator").html(languagePack.planning.rejected);
			$("#plan_status_indicator").css("color","rgba(190,80,80,1)");
		}
	}
	else {
		if(UserData[0].RoleDisplayName == "Planner" || UserData[0].RoleDisplayName == "Admin" || UserData[0].RoleDisplayName == "SuperAdmin") {
			$("#submit_rquest_btn").attr("canSubmit", true);
			$("#submit_rquest_btn").removeClass("buttonInactive");
			
			$("#plan_component_button").attr("canAdd", true);
			$("#plan_component_button").removeClass("buttonInactive");
		}
		
		$("#plan_calendar_toggle").attr("hasChecklists", false);
		$("#plan_calendar_toggle").addClass("buttonInactive");		
		
		$("#plan_status_label").html("");
		$("#plan_status_indicator").html("");		
	}

	FindLocations();
}