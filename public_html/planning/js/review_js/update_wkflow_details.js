/*============================================================
	Property of:		MISOM TECHNOLOGIES
	Developer:			AARON MCCOLOUGH
	Application Name:	FARA_FRESNILLO
	Directory:			FARA_FRESNILLO/PLANNING/JS/REVIEW_JS
	File Name:			update_wkflow_details.js
=============================================================*/

function CreateWkFlowRecord(element, action) {
	var currStatusGuid  = "";
	
	for(var key in wkflowStatusData) {
		if(wkflowStatusData[key].DisplayName == action) {
			currStatusGuid = wkflowStatusData[key].WkFlow_StatusType_GUID;
		}
	}
	
	var dataObj = {};

	dataObj.Plan_WkFlow_Detail_GUID = CreateGUID();
	dataObj.Plan_WkFlow_Group_GUID  = element.closest('tr').prev().attr("PlanWkFlowGroupGUID");
	dataObj.Status_BeginTime        = moment().format("YYYY-MM-DDTHH:mm:ss.000z");
	dataObj.WkFlow_StatusType_GUID  = currStatusGuid;
	dataObj.Status_EndTime          = null;
	dataObj.IsCurrentStatus         = true;
	dataObj.CreatedBy               = element.closest('tr').prev().attr("CreatedBy");
	dataObj.AssignedTo              = UserData[0].PersonGUID;
	dataObj.ReviewedBy              = UserData[0].PersonGUID;
	dataObj.Comments                = element.parent().prev().val();
	dataObj.IsActive                = true;
	dataObj.Created                 = moment().format("YYYY-MM-DDTHH:mm:ss.000z");
	dataObj.Modified                = moment().format("YYYY-MM-DDTHH:mm:ss.000z");
	dataObj.Obsolete                = moment().format("9999-12-31T00:00:00.000z");
	
	var jsonData = {
		 "fields": dataObj
	};
	
	$.ajax ({
		headers: {
			"Content-Type": "application/json"
		},
		url: ruIP + ruPort + planningDB + planningEN + "create/trans/Plan_WkFlow_Detail",
		type: "POST",
		data: JSON.stringify(jsonData),
		success: function(){
			ArchiveWkFlow(element);
		},
		error: function(){
			DisplayAlert(languagePack.message.error, languagePack.message.recordsNotUpdated);
		}
	}); 
}

function ArchiveWkFlow(element) {
	var dataObj = {};
	
	dataObj.Status_EndTime          = moment().format("YYYY-MM-DDTHH:mm:ss.000z");
	dataObj.IsCurrentStatus         = false;
	dataObj.ReviewedBy              = UserData[0].PersonGUID;
	dataObj.IsActive                = true;
	dataObj.Modified                = moment().format("YYYY-MM-DDTHH:mm:ss.000z");
	dataObj.Obsolete                = moment().format("YYYY-MM-DDTHH:mm:ss.000z");
	
	var jsonData = {
		 "key": { "Plan_WkFlow_Detail_GUID": element.closest('tr').prev().attr("PlanWkFlowDetailGUID") },
		 "fields": dataObj
	};
	
	$.ajax ({
		headers: {
			"Content-Type": "application/json"
		},
		url: ruIP + ruPort + planningDB + planningEN + "update/trans/Plan_WkFlow_Detail",
		type: "POST",
		data: JSON.stringify(jsonData),
		success: function(){
			DisplayAlert(languagePack.message.success, languagePack.message.recordsUpdated);
			
				$("#review_window_cancel_btn").click();
				setTimeout(function() {
					var jqxhrwkflow = $.getJSON(ruIP + ruPort + planningDB + planningEN + "read/dbo/v_WkFlow_Detail?where=\"IsActive = '1' AND Area_GUID = '" + area_GF + "' AND Zone_GUID = '" + zone_GF + "' AND StartDate >= '" + WeekBeginTime + "' AND EndDate <= '" + WeekEndTime + "' AND IsCurrentStatus = '1'\"", function() {
						WkFlowData = jQuery.parseJSON(jqxhrwkflow.responseText);						
						
						CalculateWkFlowFilters();
						$("#review_menu").click();
						LoadBadges();
						CheckStatus();
					});
				},200);
			
		},
		error: function(){
			DisplayAlert(languagePack.message.error, languagePack.message.recordsNotUpdated);
		}
	});
}









