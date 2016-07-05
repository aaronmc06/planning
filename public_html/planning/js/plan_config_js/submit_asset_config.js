/*============================================================
	Property of:		MISOM TECHNOLOGIES
	Developer:			AARON MCCOLOUGH
	Application Name:	FARA_FRESNILLO
	Directory:			FARA_FRESNILLO/PLANNING/JS/PLAN_CONFIG_JS
	File Name:			submit_asset_config.js
=============================================================*/

var asset_planstepguid = "";
var createdAssetArray  = [];
var updatedAssetArray  = [];
var removedAssetArray  = [];
var stepElement;

$(document).ready(function() {
	$("#generate_asset_config_btn").on("click", SubmitAssetConfigData);
});

function SubmitAssetConfigData() {
	createdAssetArray = [];
	updatedAssetArray  = [];
	
	$(".shiftChildTable").each(function() {
		
		var plan_guid    = $(this).closest('.eachStepContainer').attr("PlanGUID");
		var machine_guid = $(this).attr("MachineGUID");
		
		$(this).find('.ganttAssetRow').each(function() {
			if(!($(this).find('.employeeSelect').val() == languagePack.common.selectEmployee || $(this).find('.positionSelect').val() == languagePack.common.selectPosition)) {
			
				if($(this).attr('PlanAssetGUID')) {
					
					var dataObj = {};
					
					var apiKeyObj = {};
					apiKeyObj.PlanAsset_GUID = $(this).attr('PlanAssetGUID');
					dataObj.APIKEY           = apiKeyObj;
					
					dataObj.Plan_GUID     = plan_guid;
					dataObj.PlanStep_GUID = asset_planstepguid;
					dataObj.Machine_GUID  = machine_guid;
					dataObj.Employee_GUID = $(this).find('.employeeSelect').val();
					dataObj.IsActive      = true;
					dataObj.Modified      = moment().format("YYYY-MM-DDTHH:mm:ss.000z");
					
					if($(this).find('.positionSelect').val() == 0) {
						dataObj.IsOperator    = true;
						dataObj.IsHelper      = false;
					}
					else if($(this).find('.positionSelect').val() == 1) {
						dataObj.IsOperator    = false;
						dataObj.IsHelper      = true;
					}

					updatedAssetArray.push(dataObj);
				}
				else {
					var dataObj = {};
					
					dataObj.PlanAsset_GUID = CreateGUID();
					dataObj.Plan_GUID      = plan_guid;
					dataObj.PlanStep_GUID  = asset_planstepguid;
					dataObj.Machine_GUID   = machine_guid;
					dataObj.Employee_GUID  = $(this).find('.employeeSelect').val();
					dataObj.IsActive       = true;
					dataObj.Created        = moment().format("YYYY-MM-DDTHH:mm:ss.000z");
					dataObj.Modified       = moment().format("YYYY-MM-DDTHH:mm:ss.000z");
					dataObj.CreatedBy      = UserData[0].PersonGUID;					
					
					if($(this).find('.positionSelect').val() == 0) {
						dataObj.IsOperator    = true;
						dataObj.IsHelper      = false;
					}
					else if($(this).find('.positionSelect').val() == 1) {
						dataObj.IsOperator    = false;
						dataObj.IsHelper      = true;
					}
					
					createdAssetArray.push(dataObj);				
				}
			}
		});		
	});
	
	InsertNewAssets();
}

function InsertNewAssets() {
	if(createdAssetArray.length > 0) {
		var jsonData = {
			 "fields": createdAssetArray
		};
		
		$.ajax ({
			headers: {
				"Content-Type": "application/json"
			},
			url: ruIP + ruPort + planningDB + planningEN + "create/bulk/trans/Plan_Asset",
			type: "POST",
			data: JSON.stringify(jsonData),
			success: function(){
				DisplayAlert(languagePack.message.success,languagePack.message.recordsStored);
				UpdateAssets();
			},
			error: function(){
				DisplayAlert(languagePack.message.error,languagePack.message.recordsNotStored);
			}
		});
	}
	else {
		UpdateAssets();
	}
}

function UpdateAssets() {
	if(updatedAssetArray.length > 0) {
		var jsonData = {
			 "fields": updatedAssetArray
		};
		
		$.ajax ({
			headers: {
				"Content-Type": "application/json"
			},
			url: ruIP + ruPort + planningDB + planningEN + "update/bulk/trans/Plan_Asset",
			type: "POST",
			data: JSON.stringify(jsonData),
			success: function(){
				DisplayAlert(languagePack.message.success,languagePack.message.recordsUpdated);
				RemoveAssets();
			},
			error: function(){
				DisplayAlert(languagePack.message.error,languagePack.message.recordsNotUpdated);
			}
		});
	}
	else {
		RemoveAssets();
	}	
}

function RemoveAssets() {
	if(removedAssetArray.length > 0){
		var jsonData = {
			 "fields": removedAssetArray
		};
		
		$.ajax ({
			headers: {
				"Content-Type": "application/json"
			},
			url: ruIP + ruPort + planningDB + planningEN + "update/bulk/trans/Plan_Asset",
			type: "POST",
			data: JSON.stringify(jsonData),
			success: function(){
				DisplayAlert(languagePack.message.success,languagePack.message.recordsUpdated);
				HideAssetConfigWindow();
				removedAssetArray = [];
			},
			error: function(){
				DisplayAlert(languagePack.message.error,languagePack.message.recordsNotUpdated);
			}
		});
	}
	else {
		HideAssetConfigWindow();
	}
	
	var stepButton = $(stepElement).closest('td').find('.tdCont');
	
	stepButton.click();
	setTimeout(function() {
		stepButton.click();
	},200);
}


















