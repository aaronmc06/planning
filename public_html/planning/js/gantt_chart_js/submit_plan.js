/*============================================================
	Property of:		MISOM TECHNOLOGIES
	Developer:			AARON MCCOLOUGH
	Application Name:	FARA_FRESNILLO
	Directory:			FARA_FRESNILLO/PLANNING/JS/GANTT_CHART_JS
	File Name:			submit_plan.js
=============================================================*/

function GeneratePlanWorkFlow() {
	
	var wkFlowObj       = {};
	var wkFlowDetailObj = {};
	var currStatusGuid  = "";
	
	var new_plan_wkflow_group_guid = CreateGUID();
	
	for(var key in wkflowStatusData) {
		if(wkflowStatusData[key].DisplayName == "Pending") {
			currStatusGuid = wkflowStatusData[key].WkFlow_StatusType_GUID;
		}
	}
	
	wkFlowObj.Plan_WkFlow_Group_GUID = new_plan_wkflow_group_guid;
	wkFlowObj.Area_GUID              = area_GF;
	wkFlowObj.Zone_GUID              = zone_GF;
	wkFlowObj.StartDate              = WeekBeginTime;
	wkFlowObj.EndDate                = WeekEndTime;
	wkFlowObj.IsActive               = true;
	wkFlowObj.Created                = moment().format("YYYY-MM-DDTHH:mm:ss.000z");
	wkFlowObj.Modified               = moment().format("YYYY-MM-DDTHH:mm:ss.000z");
	wkFlowObj.Obsolete               = moment().format("9999-12-31T00:00:00.000z");
	wkFlowObj.CreatedBy				 = UserData[0].PersonGUID;
	
	wkFlowDetailObj.Plan_WkFlow_Detail_GUID = CreateGUID();
	wkFlowDetailObj.Plan_WkFlow_Group_GUID  = new_plan_wkflow_group_guid;
	wkFlowDetailObj.WkFlow_StatusType_GUID  = currStatusGuid;
	wkFlowDetailObj.Status_BeginTime        = moment().format("YYYY-MM-DDTHH:mm:ss.000z");
	wkFlowDetailObj.Status_EndTime          = null;
	wkFlowDetailObj.IsCurrentStatus         = true;
	wkFlowDetailObj.CreatedBy               = UserData[0].PersonGUID;
	wkFlowDetailObj.AssignedTo              = superintendentData[0].PersonGUID;
	wkFlowDetailObj.ReviewedBy              = UserData[0].PersonGUID;
	wkFlowDetailObj.Comments                = null;
	wkFlowDetailObj.IsActive                = true;
	wkFlowDetailObj.Created                 = moment().format("YYYY-MM-DDTHH:mm:ss.000z");
	wkFlowDetailObj.Modified                = moment().format("YYYY-MM-DDTHH:mm:ss.000z");
	wkFlowDetailObj.Obsolete                = moment().format("9999-12-31T00:00:00.000z");
	wkFlowDetailObj.CreatedBy				= UserData[0].PersonGUID;
	
	SubmitToPlanWkFlow(wkFlowObj, wkFlowDetailObj);
}

function UpdatePlanWorkFlow() {
	
	var wkFlowDetailObj = {};
	var currStatusGuid  = "";
	
	for(var key in wkflowStatusData) {
		if(wkflowStatusData[key].DisplayName == "Pending") {
			currStatusGuid = wkflowStatusData[key].WkFlow_StatusType_GUID;
		}
	}
	
	wkFlowDetailObj.Plan_WkFlow_Detail_GUID = CreateGUID();
	wkFlowDetailObj.Plan_WkFlow_Group_GUID  = WkFlowData[0].Plan_WkFlow_Group_GUID;
	wkFlowDetailObj.WkFlow_StatusType_GUID  = currStatusGuid;
	wkFlowDetailObj.Status_BeginTime        = moment().format("YYYY-MM-DDTHH:mm:ss.000z");;
	wkFlowDetailObj.Status_EndTime          = null;
	wkFlowDetailObj.IsCurrentStatus         = true;
	wkFlowDetailObj.CreatedBy               = UserData[0].PersonGUID;
	wkFlowDetailObj.AssignedTo              = superintendentData[0].PersonGUID;
	wkFlowDetailObj.ReviewedBy              = UserData[0].PersonGUID;
	wkFlowDetailObj.Comments                = null;
	wkFlowDetailObj.IsActive                = true;
	wkFlowDetailObj.Created                 = moment().format("YYYY-MM-DDTHH:mm:ss.000z");
	wkFlowDetailObj.Modified                = moment().format("YYYY-MM-DDTHH:mm:ss.000z");
	wkFlowDetailObj.Obsolete                = moment().format("9999-12-31T00:00:00.000z");
	
	ArchiveWkFlow(wkFlowDetailObj);	
}

function ArchiveWkFlow(wkFlowDetailObj) {
	var dataObj = {};
	
	dataObj.Status_EndTime          = moment().format("YYYY-MM-DDTHH:mm:ss.000z");
	dataObj.IsCurrentStatus         = false;
	dataObj.ReviewedBy              = UserData[0].PersonGUID;
	dataObj.IsActive                = true;
	dataObj.Modified                = moment().format("YYYY-MM-DDTHH:mm:ss.000z");
	dataObj.Obsolete                = moment().format("YYYY-MM-DDTHH:mm:ss.000z");
	
	var jsonData = {
		 "key": { "Plan_WkFlow_Detail_GUID": WkFlowData[0].Plan_WkFlow_Detail_GUID },
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
			SubmitToPlanWkFlowDetail(wkFlowDetailObj);
		},
		error: function(){
			DisplayAlert(languagePack.message.error, languagePack.message.recordsNotUpdated);
		}
	});
}

function SubmitToPlanWkFlow(wkFlowObj, wkFlowDetailObj) {
	var jsonData = {
		 "fields": wkFlowObj
	};
	
	$.ajax ({
		headers: {
			"Content-Type": "application/json"
		},
		url: ruIP + ruPort + planningDB + planningEN + "create/trans/Plan_WkFlow",
		type: "POST",
		data: JSON.stringify(jsonData),
		success: function(){
			SubmitToPlanWkFlowDetail(wkFlowDetailObj);
		},
		error: function(){
			DisplayAlert(languagePack.message.error, languagePack.message.recordsNotUpdated);
		}
	});
}

function SubmitToPlanWkFlowDetail(wkFlowDetailObj) {
	var jsonData = {
		 "fields": wkFlowDetailObj
	};
	
	$.ajax ({
		headers: {
			"Content-Type": "application/json"
		},
		url: ruIP + ruPort + planningDB + planningEN + "create/trans/Plan_WkFlow_Detail",
		type: "POST",
		data: JSON.stringify(jsonData),
		success: function(){
			DisplayAlert(languagePack.message.success, languagePack.message.recordsStored);
			UpdatePlansWithWkFlow(wkFlowDetailObj);
		},
		error: function(){
			DisplayAlert(languagePack.message.error, languagePack.message.recordsNotUpdated);
		}
	});
}

function UpdatePlansWithWkFlow(wkFlowDetailObj) {
	var jsonData = {
		 "fields": { "Plan_WkFlow_Group_GUID":wkFlowDetailObj.Plan_WkFlow_Group_GUID, "Modified": new Date() },
		 "where": "Area_GUID = '" + area_GF + "' AND Zone_GUID = '" + zone_GF + "' AND Shiftdate >= '" + WeekBeginTime + "' AND Shiftdate <= '" + WeekEndTime + "'"
	};
	
	$.ajax ({
		headers: {
			"Content-Type": "application/json"
		},
		url: ruIP + ruPort + planningDB + planningEN + "nupdate/trans/Plan",
		type: "POST",
		data: JSON.stringify(jsonData),
		success: function(){
			DisplayAlert(languagePack.message.success, languagePack.message.recordsUpdated);
			FindPlanConfigs();
			LoadBadges();
		},
		error: function(){
			DisplayAlert(languagePack.message.error, languagePack.message.recordsNotUpdated);
		}
	});
}









