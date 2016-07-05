/*============================================================
	Property of:		MISOM TECHNOLOGIES
	Developer:			JORGE MURILLO & AARON MCCOLOUGH
	Application Name:	FARA_FRESNILLO
	Directory:			FARA_FRESNILLO/PLANNING/JS/PRELINEUP_JS
	File Name:			script.js
 =============================================================*/
 
var preLineupMachineLocations	= [];
var preLineupLocationStatuses	= [];
var lnup_dataQ					= [];
var lnup_statusData				= [];
var lnup_answerdata				= [];
var lnup_LineupDetail			= [];
var planData					= [];
var planChecklistStatus			= [];
var lineupChecklistTypes		= [];
var planningChecklistTypes		= [];
var downCodesData				= [];
var UserData					= [];
var insertedQuestions			= [];
var updatedQuestions			= [];
var allMachineTypesGuid			= "";
var jumboMachineTypesGuid		= "";
var simbaMachineTypesGuid		= "";
var scoopMachineTypesGuid		= "";
var materials_checklist			= "";
var process_checklist			= "";
var explosives_checklist		= "";
var haulage_checklist			= "";
var machineDownEvents			= "";
var machineDetails				= "";
var activitiesCheckList			= "";
var locationConditions			= "";
var lnup_checkListLength		= 0;
var waitForLoadCount			= 0;
var waitForRequestCount			= 0;
var submissionRequest			= false;
var loadCountComplete			= false;
var isDesktop					= true;
var closingCL					= false;
var lnup_planGUID;
var plan_GUID;
var planConfig_GUID;
var lnup_checklistType;
var lnup_plandata;
var lnup_checkEdit;
var lnup_dayCheck;
var currentChecklist;
var globalBridge;
var WeekBeginTime;
var WeekEndTime;
var area_GF;
var task_GF;
var areaName;
var currentelement;

//======================= WEB GAP =====================================

function SendForRequestInfo(requestObj, loadCount) {
    (loadCount) ? waitForRequestCount++ : false;

    if(isDesktop) {
		switch (requestObj.requestType) {
			case 'metaData':
				$.getJSON(requestObj.data.url, function(data) {
					ReceiveMetaData(data);
				});
			break;

			case 'tableData':
				if(requestObj.data.url != "na") {
					$.getJSON(requestObj.data.url, function(data) {
						ReceiveTableData(data, requestObj.data.receiver, requestObj.data.param1, requestObj.data.param2, requestObj.data.param3, requestObj.data.param4, requestObj.data.param5, requestObj.data.param6, requestObj.data.param7, requestObj.data.param8);
					});
				}
				else {
					var data = [];
					ReceiveTableData(data, requestObj.data.receiver, requestObj.data.param1, requestObj.data.param2, requestObj.data.param3, requestObj.data.param4, requestObj.data.param5, requestObj.data.param6, requestObj.data.param7, requestObj.data.param8);
				}
			break;
			
			case 'post':
			
				if(requestObj.data.url != "na") {
					$.ajax ({
						headers: {
							"Content-Type": "application/json"
						},
						url: requestObj.data.url,
						type: "POST",
						data: atob(requestObj.data.data),
						success: function(){
							var dataSet = {};
							ReceivePostCallback(dataSet, requestObj.data.receiver);
						}
					});
				}
				else {
					var dataSet = {};
					ReceivePostCallback(dataSet, requestObj.data.receiver);					
				}
				
			break;
			
			case 'post1'://temp1 for post
				var jsonData = {};
				jsonData.SubmissionGUID	= requestObj.data.param1;
				jsonData.data			= atob(requestObj.data.data);
				jsonData.url			= requestObj.data.url;

				$.ajax ({
					headers: {
						"Content-Type": "application/json"
					},
					url: ruIP + ruPort + planningDB + planningEN + "distributeData/dbo/MobileSubmissions",
					type: "POST",
					data: JSON.stringify(jsonData),
					success: function(){
						var dataSet = {};
						ReceivePostCallback(dataSet, requestObj.receiver);
					}
				});
			break;
			
			case 'post2'://temp2 for post
				var jsonData	= [];
				var dataObj		= {};
				
				dataObj.data			= atob(requestObj.data.data);
				dataObj.url				= requestObj.data.url;
				dataObj.SubmissionGUID	= requestObj.data.param1;
				
				jsonData.push(dataObj);

				$.ajax ({
					headers: {
						"Content-Type": "application/json"
					},
					url: ruIP + ruPort + planningDB + planningEN + "distributeData/dbo/MobileSubmissions",
					type: "POST",
					data: JSON.stringify(jsonData),
					success: function(data){
						var dataSet = {};
						ReceivePostCallback(dataSet, requestObj.receiver);
					}
				});
			break;
        }
    }
	else {
        globalBridge.send(requestObj);
    }
}

function connectWebViewJavascriptBridge(callback) {
    if (window.WebViewJavascriptBridge) {
        callback(WebViewJavascriptBridge)
    } else {
        document.addEventListener('WebViewJavascriptBridgeReady', function() {
            callback(WebViewJavascriptBridge)
        }, false);
    }
}

connectWebViewJavascriptBridge(function(bridge) {

    bridge.init(function(message, responseCallback) {});

    globalBridge = bridge;

    bridge.registerHandler("ReceiveMetaData", function(data) {
        var personGuid = data;
        ReceiveMetaData(personGuid);
        //ReceiveMetaData(data);
    });

    bridge.registerHandler("ReceiveTableData", function(data) {
        var dataSet = data.dataSet;
        var receiver = data.receiver;
        var param1 = data.param1;
        var param2 = data.param2;
        var param3 = data.param3;
        var param4 = data.param4;
        var param5 = data.param5;
        var param6 = data.param6;
        var param7 = data.param7;
        var param8 = data.param8;

        ReceiveTableData(dataSet, receiver, param1, param2, param3, param4, param5, param6, param7, param8);
    });

    bridge.registerHandler("ReceivePostCallback", function(data) {
        var dataSet = data.dataSet;
        var receiver = data.receiver;
		
        ReceivePostCallback(dataSet, receiver);
    });
});

//======================= END WEB GAP =====================================

$(document).ready(function() {
    $(".lang-common.print").html(languagePack.common.print);
    $(".lang-common.accept").html(languagePack.common.accept);
    $(".lang-common.cancel").html(languagePack.common.cancel);
    $(".lang-common.date").html(languagePack.common.date);
    $(".lang-common.shift").html(languagePack.common.shift);
    $(".lang-common.first").html(languagePack.common.first);
    $(".lang-common.second").html(languagePack.common.second);
    $(".lang-common.third").html(languagePack.common.third);
    $(".lang-prelineup.plansForLineup").html(languagePack.prelineup.plansForLineup);
    $(".lang-prelineup.newLineup").html(languagePack.prelineup.newLineup);

    lineupChecklistTypes = [];
	
	$("#task_container_ddl").dropdown();

    $('td').hover(function() {
        $(this).parents('table').find('col:eq(' + $(this).index() + ')').toggleClass('hover');
    });

    setTimeout(function() {
        RequestInitialUserData();
    }, 500);
});

function ExitPlanningSystem() {
    var objectToSend = {};
    var dataObj = {};

    objectToSend.Type = "Request";
    objectToSend.requestType = "exit";
    objectToSend.data = dataObj;

    SendForRequestInfo(objectToSend, false);
}

function RequestInitialUserData() {
    var objectToSend = {};
    var dataObj = {};
	
	var testPersonGUID = 'D1AA70A0-C19D-41E5-8F2E-4D9C527C2DB8';	//ART
	//var testPersonGUID = 'F20EE86E-9BDF-45BE-8581-FB6A342D175D';	//ABEL
	
	dataObj.receiver = "UserData";
    dataObj.query = "SELECT * FROM v_Person WHERE PersonGUID = '" + testPersonGUID + "'";	
    dataObj.url = ruIP + ruPort + listsDB + listEN + "read/web/v_Person?where=\"PersonGUID = '"+testPersonGUID+"' \"";
    dataObj.param1 = "na";
    dataObj.param2 = "na";
    dataObj.param3 = "na";
    dataObj.param4 = "na";
    dataObj.param5 = "na";
    dataObj.param6 = "na";
    dataObj.param7 = "na";
    dataObj.param8 = "na";

    objectToSend.Type = "Request";
    objectToSend.requestType = "tableData";
    objectToSend.data = dataObj;

    SendForRequestInfo(objectToSend, false);
}

function ReceiveMetaData(userData) {
	UserData = userData;
	
    if(isDesktop) {
        WeekBeginTime = moment().subtract(100, 'days').format("YYYY-MM-DDT00:00:00.000");
        WeekEndTime = moment().add(7, 'days').format("YYYY-MM-DDT00:00:00.000");
    }
	else {
        WeekBeginTime = moment(moment().subtract(7, 'days').format("YYYY-MM-DDT00:00:00.000")).unix();
        WeekEndTime = moment(moment().add(7, 'days').format("YYYY-MM-DDT00:00:00.000")).unix();
    }

    RequestAreaInfo();
}

function RequestAreaInfo() {

    var objectToSend = {};
    var dataObj = {};

    dataObj.receiver = "AreaGUID";
    dataObj.query = "SELECT * FROM v_PersonArea WHERE PersonGUID = '" + UserData[0].PersonGUID + "' AND IsActive = '1'";
    dataObj.url = ruIP + ruPort + planningDB + planningEN + "read/dbo/v_PersonArea?where=\"PersonGUID = '" + UserData[0].PersonGUID + "' AND IsActive = '1'\"";
    dataObj.param1 = "na";
    dataObj.param2 = "na";
    dataObj.param3 = "na";
    dataObj.param4 = "na";
    dataObj.param5 = "na";
    dataObj.param6 = "na";
    dataObj.param7 = "na";
    dataObj.param8 = "na";

    objectToSend.Type = "Request";
    objectToSend.requestType = "tableData";
    objectToSend.data = dataObj;

    SendForRequestInfo(objectToSend, false);
}

function SetAreaPersonInfo(data) {

    $("#areas_dropdown").html("");
	
    for (var key in data) {
        $("#areas_dropdown").append('<li><a onclick="UpdateAreaGuid(\'' + data[key].Area_GUID + '\', \'' + data[key].AreaDisplayName + '\')">' + data[key].AreaDisplayName + '</a></li>');
    }

    $("#areas_container_ddl").dropdown();

    area_GF		= data[0].Area_GUID;
    areaName	= data[0].AreaDisplayName;

    if(area_GF) {
		SwitchTask("planning");
    }
	else {
        EmptyList();
    }
}

function GoToSwitch() {
	SwitchTask(task_GF);
}

function SwitchTask(task) {
	task_GF = task;
	EmptyList();
	
	switch(task) {
		case "planning":
		default:
			GetPlanningChecklistTypes();
		break;
		
		case "lineup":
			GetMachineDownList();
			LocationStatusPreLineupLoad();
			MachineLocationPreLineupLoad();
			GetMachineType("ALL", "allMachineTypesGuid");
			GetMachineType("ST", "scoopMachineTypesGuid");
			GetMachineType("JUBL", "simbaMachineTypesGuid");
			GetMachineType("JU", "jumboMachineTypesGuid");
			GetLineupChecklistTypes();
		break
	}
}

function UpdateAreaGuid(area_guid, area_name) {
	
	area_GF = area_guid;
	areaName = area_name;
	
	switch(task_GF) {
		case "planning":
			GetPlanningChecklistTypes();
		break;
		
		case "lineup":
			area_GF = area_guid;
			areaName = area_name;

			if(area_GF) {
				MachineLocationPreLineupLoad();
				GetLineupDetails();
			}
			else {
				EmptyList();
			}
			break;
	}
}

function GetPlans() {

    var objectToSend = {};
    var dataObj = {};

    dataObj.receiver = "receivePlans";
    dataObj.query = "SELECT * FROM v_Plan WHERE Area_GUID = '" + area_GF + "' AND IsActive = '1' AND CAST(ShiftDateSeconds AS INT) >= CAST('" + WeekBeginTime + "' AS INT) AND CAST(ShiftDateSeconds AS INT) <= CAST('" + WeekEndTime + "' AS INT) ORDER BY ShiftDateSeconds ASC";
    dataObj.url = ruIP + ruPort + planningDB + planningEN + "read/dbo/v_Plan?where=\"IsActive = '1' AND ShiftDate >= '" + WeekBeginTime + "' AND ShiftDate <= '" + WeekEndTime + "' AND Area_GUID = '" + area_GF + "' ORDER BY ShiftDate ASC\"";
	
    dataObj.param1 = "na";
    dataObj.param2 = "na";
    dataObj.param3 = "na";
    dataObj.param4 = "na";
    dataObj.param5 = "na";
    dataObj.param6 = "na";
    dataObj.param7 = "na";
    dataObj.param8 = "na";

    objectToSend.Type = "Request";
    objectToSend.requestType = "tableData";
    objectToSend.data = dataObj;

    SendForRequestInfo(objectToSend, false);	
}

function ReceiveTableData(data, receiver, param1, param2, param3, param4, param5, param6, param7, param8) {
	(param1 == "wait") ? waitForRequestCount-- : false;

	if(receiver) {
		switch (receiver) {
			case "UserData":
				//UserData = data;
				
				if(isDesktop) {
					WeekBeginTime = moment().subtract(7, 'days').format("YYYY-MM-DDT00:00:00.000");
					WeekEndTime = moment().add(7, 'days').format("YYYY-MM-DDT00:00:00.000");
				}
				else {
					WeekBeginTime = moment(moment().subtract(7, 'days').format("YYYY-MM-DDT00:00:00.000")).unix();
					WeekEndTime = moment(moment().add(7, 'days').format("YYYY-MM-DDT00:00:00.000")).unix();
				}
				UserData = data;

				RequestAreaInfo();			
				break;
				
			case "preLineupLocationStatuses":
				preLineupLocationStatuses = data;
				waitForLoadCount++;
				break;

			case "preLineupMachineLocations":
				preLineupMachineLocations = data;
				waitForLoadCount++;
				break;

			case "downCodesData":
				downCodesData = data;
				waitForLoadCount++;
				break;

			case "allMachineTypesGuid":
				allMachineTypesGuid = data[0].MachineType_GUID;
				waitForLoadCount++;
				break;

			case "scoopMachineTypesGuid":
				scoopMachineTypesGuid = data[0].MachineType_GUID;
				waitForLoadCount++;
				break;

			case "simbaMachineTypesGuid":
				simbaMachineTypesGuid = data[0].MachineType_GUID;
				waitForLoadCount++;
				break;

			case "jumboMachineTypesGuid":
				jumboMachineTypesGuid = data[0].MachineType_GUID;
				waitForLoadCount++;
				break;

			case "lineupChecklistTypes":
				lineupChecklistTypes = data;
				waitForLoadCount++;

				for (var key in lineupChecklistTypes) {				
					switch(lineupChecklistTypes[key].ChecklistType_Name) {
						case "Materiales":
							materials_checklist = lineupChecklistTypes[key].DisplayName;
							break;
						case "Proceso":
							process_checklist = lineupChecklistTypes[key].DisplayName;
							break;
						case "Explosivos":
							explosives_checklist = lineupChecklistTypes[key].DisplayName;
							break;
						case "Acarreo":
							haulage_checklist = lineupChecklistTypes[key].DisplayName;
							break;
						case "Paros de Equipo":
							machineDownEvents = lineupChecklistTypes[key].DisplayName;
							break;
						case "Datos de Operacion":
							machineDetails = lineupChecklistTypes[key].DisplayName;
							break;
						case "Actividades":
							activitiesCheckList = lineupChecklistTypes[key].DisplayName;
							break;
						case "Condiciones del Lugar":
							locationConditions = lineupChecklistTypes[key].DisplayName;
							break;
					}
				}
				break;

			case "lnup_LineupDetail":
				lnup_LineupDetail = data;

				if(lnup_LineupDetail.length <= 0) {
					LineupListLoad();
				}

				for(var key in lnup_LineupDetail) {
					FindLineupDetailMachines(parseInt(key), lnup_LineupDetail[key].Lineup_GUID);
				}
				break;

			case "LineupMachineData":
				var LineupMachineData = data;

				lnup_LineupDetail[param1].MachineTypeGUIDS = "";
				lnup_LineupDetail[param1].MachineGUIDS = "";
				lnup_LineupDetail[param1].Machines = "";
				lnup_LineupDetail[param1].LineupStepGUIDS = "";

				for (var key in LineupMachineData) {
					lnup_LineupDetail[param1].MachineTypeGUIDS += LineupMachineData[key].MachineType_GUID;
					lnup_LineupDetail[param1].MachineGUIDS += LineupMachineData[key].Machine_GUID;
					lnup_LineupDetail[param1].Machines += LineupMachineData[key].MachineDisplayName;
					lnup_LineupDetail[param1].LineupStepGUIDS += LineupMachineData[key].Lineup_Step_GUID;

					if ((parseInt(key) + 1) < LineupMachineData.length) {
						lnup_LineupDetail[param1].MachineTypeGUIDS += "_";
						lnup_LineupDetail[param1].MachineGUIDS += "_";
						lnup_LineupDetail[param1].Machines += "_";
						lnup_LineupDetail[param1].LineupStepGUIDS += "_";
					}
				}

				if ((param1 + 1) == lnup_LineupDetail.length) {
					setTimeout(function() {
						LineupListLoad();
					}, 100);
				}
				break;
				
			case "receivePlans":
				planData = data;
				PlanningListLoad();
				break;
				
			case "planChecklistStatus":
				planChecklistStatus = data;
				plan_checklist_ready_with_data();
				break;
				
			case "planningChecklistTypes":
				planningChecklistTypes = data;
				GetPlans();
				
				break;

			case "lnup_statusData":
				lnup_statusData = data;
				checklist_ready_with_data();
				break;

			case "LoadHaulageDetails":
				LoadHaulageDetails(data);
				break;

			case "LoadDownEvents":
				LoadDownEvents(data);
				break;

			case "explosives_insert_with_data":
				explosives_insert_with_data(data, param1, param2, param3, param4);
				break;

			case "materials_insert_with_data":
				materials_insert_with_data(data, param1, param2, param3, param4);
				break;

			case "process_insert_with_data":
				process_insert_with_data(data, param1, param2, param3, param4);
				break;

			case "checklist_insert_with_data":
				checklist_insert_with_data(data, param1, param2, param3, param4, param5, param6, param7, param8);
				break;

			case "plan_checklist_insert_with_data":
				plan_checklist_insert_with_data(data, param1, param2, param3, param4);
				break;

			case "LoadLineups":
				LoadLineups(data);
				break;

			case "LoadLineupSteps":
				LoadLineupSteps(data);
				break;

			case "LoadLineupsWithLocationStatus":
				LoadLineupsWithLocationStatus(data);
				break;

			case "LoadMachines":
				LoadMachines(data);
				break;

			case "LoadMachineDetails":
				LoadMachineDetails(data);
				break;

			case "LoadPlanAnswerData":
				LoadPlanAnswerData(data);
				break;

			case "LoadLineupAnswerData":
				LoadLineupAnswerData(data);
				break;

			case "LoadLineupsWithInfo":
				LoadLineupsWithInfo(data, param1);
				break;

			case "FindLineUpInfo":
				FindLineUpInfo(data, param1, param2);
				break;

			case "AreaGUID":
				SetAreaPersonInfo(data);
				break;

			case "inject_checklist_data":
				var tempData = [];
				
				if(data.length > 0) {
					if(data[0].FormData) {
						inject_checklist_data(JSON.parse(atob(data[0].FormData)));
					}
					else {
						inject_checklist_data(tempData);
					}
				}
				else {
					inject_checklist_data(tempData);
				}
				break;

			default:
				eval(receiver) = data;
		}

		if(waitForLoadCount >= 8 && !loadCountComplete) {
			loadCountComplete = true;
			GetLineupDetails();
		}
	}
}
    //POSTING
function ReceivePostCallback(data, receiver) {

	if (receiver) {
		switch (receiver) {
			case "CloseChecklist":
				CloseChecklist();
			break;
			
			case "ClosePlanChecklist":
				ClosePlanChecklist();
			break;
			
			case "checklist_populate":
				checklist_populate();
			break;
			
			case "plan_checklist_populate":
				plan_checklist_populate();
			break;

			default:
				CloseChecklist();
		}
	}
	else {
		CloseChecklist();
	}
}

function LocationStatusPreLineupLoad() {

    var objectToSend = {};
    var dataObj = {};

    dataObj.receiver = "preLineupLocationStatuses";
    dataObj.query = "SELECT * FROM LocationStatus WHERE IsActive = '1' ORDER BY DisplayName";
    dataObj.url = ruIP + ruPort + planningDB + planningEN + "read/geo/LocationStatus?where=\"IsActive = '1' ORDER BY DisplayName\"";
    dataObj.param1 = "na";
    dataObj.param2 = "na";
    dataObj.param3 = "na";
    dataObj.param4 = "na";
    dataObj.param5 = "na";
    dataObj.param6 = "na";
    dataObj.param7 = "na";
    dataObj.param8 = "na";

    objectToSend.Type = "Request";
    objectToSend.requestType = "tableData";
    objectToSend.data = dataObj;

    SendForRequestInfo(objectToSend, false);
}

function MachineLocationPreLineupLoad() {

    var objectToSend = {};
    var dataObj = {};

    dataObj.receiver = "preLineupMachineLocations";
    dataObj.query = "SELECT * FROM Tunnel_Location WHERE IsActive = '1' AND Area_GUID = '" + area_GF + "' ORDER BY DisplayName";
    dataObj.url = ruIP + ruPort + planningDB + planningEN + "read/geo/Location?where=\"IsActive = '1' AND Area_GUID = '" + area_GF + "' ORDER BY DisplayName\"";
    dataObj.param1 = "na";
    dataObj.param2 = "na";
    dataObj.param3 = "na";
    dataObj.param4 = "na";
    dataObj.param5 = "na";
    dataObj.param6 = "na";
    dataObj.param7 = "na";
    dataObj.param8 = "na";

    objectToSend.Type = "Request";
    objectToSend.requestType = "tableData";
    objectToSend.data = dataObj;

    SendForRequestInfo(objectToSend, false);
}

function GetMachineType(code, receiver) {

    var objectToSend = {};
    var dataObj = {};

    dataObj.receiver = receiver;
    dataObj.query = "SELECT * FROM MachineType WHERE MachineTypeCode = '" + code + "'";
    dataObj.url = ruIP + ruPort + planningDB + planningEN + "read/eqmt/MachineType?where=\"MachineTypeCode = '" + code + "'\"";
    dataObj.param1 = "na";
    dataObj.param2 = "na";
    dataObj.param3 = "na";
    dataObj.param4 = "na";
    dataObj.param5 = "na";
    dataObj.param6 = "na";
    dataObj.param7 = "na";
    dataObj.param8 = "na";

    objectToSend.Type = "Request";
    objectToSend.requestType = "tableData";
    objectToSend.data = dataObj;

    SendForRequestInfo(objectToSend, false);
}

function GetPlanningChecklistTypes() {
    var objectToSend = {};
    var dataObj = {};

    dataObj.receiver = "planningChecklistTypes";
    dataObj.query = "SELECT * FROM ChecklistType WHERE IsActive = '1' AND UsageType = 'Planning' ORDER BY Created ASC";
    dataObj.url = ruIP + ruPort + planningDB + planningEN + "read/cfg/ChecklistType?where=\"IsActive = '1' AND UsageType = 'Planning' ORDER BY Created ASC\"";
    dataObj.param1 = "na";
    dataObj.param2 = "na";
    dataObj.param3 = "na";
    dataObj.param4 = "na";
    dataObj.param5 = "na";
    dataObj.param6 = "na";
    dataObj.param7 = "na";
    dataObj.param8 = "na";

    objectToSend.Type = "Request";
    objectToSend.requestType = "tableData";
    objectToSend.data = dataObj;

    SendForRequestInfo(objectToSend, false);
}

function GetLineupChecklistTypes() {

    var objectToSend = {};
    var dataObj = {};

    dataObj.receiver = "lineupChecklistTypes";
    dataObj.query = "SELECT * FROM ChecklistType WHERE IsActive = '1' AND UsageType = 'Lineup' ORDER BY Created ASC";
    dataObj.url = ruIP + ruPort + planningDB + planningEN + "read/cfg/ChecklistType?where=\"IsActive = '1' AND UsageType = 'Lineup' ORDER BY Created ASC\"";
    dataObj.param1 = "na";
    dataObj.param2 = "na";
    dataObj.param3 = "na";
    dataObj.param4 = "na";
    dataObj.param5 = "na";
    dataObj.param6 = "na";
    dataObj.param7 = "na";
    dataObj.param8 = "na";

    objectToSend.Type = "Request";
    objectToSend.requestType = "tableData";
    objectToSend.data = dataObj;

    SendForRequestInfo(objectToSend, false);
}

function GetMachineDownList() {
    downCodesData = [];

    var objectToSend = {};
    var dataObj = {};

    dataObj.receiver = "downCodesData";
    dataObj.query = "SELECT * FROM DownReasonCode WHERE IsActive = '1' ORDER BY Ordinal ASC";
    dataObj.url = ruIP + ruPort + planningDB + planningEN + "read/cfg/DownReasonCode?where=\"IsActive = '1' ORDER BY Ordinal ASC\"";
    dataObj.param1 = "na";
    dataObj.param2 = "na";
    dataObj.param3 = "na";
    dataObj.param4 = "na";
    dataObj.param5 = "na";
    dataObj.param6 = "na";
    dataObj.param7 = "na";
    dataObj.param8 = "na";

    objectToSend.Type = "Request";
    objectToSend.requestType = "tableData";
    objectToSend.data = dataObj;

    SendForRequestInfo(objectToSend, false);
}

function GetLineupDetails() {
    var objectToSend = {};
    var dataObj = {};

    dataObj.receiver = "lnup_LineupDetail";

    dataObj.query = "SELECT * FROM v_Calendar_Lineup WHERE Area_GUID = '" + area_GF + "' AND IsActive = '1' AND Operator_GUID = '" + UserData[0].PersonGUID + "' AND CAST(ShiftDateSeconds AS INT) >= CAST('" + WeekBeginTime + "' AS INT) AND CAST(ShiftDateSeconds AS INT) <= CAST('" + WeekEndTime + "' AS INT) ORDER BY ShiftDateSeconds ASC";
    dataObj.url = ruIP + ruPort + planningDB + planningEN + "read/dbo/v_Calendar_Lineup?where=\"IsActive = '1' AND ShiftDate >= '" + WeekBeginTime + "' AND ShiftDate <= '" + WeekEndTime + "' AND Area_GUID = '" + area_GF + "' AND Operator_GUID = '" + UserData[0].PersonGUID + "' ORDER BY ShiftDate ASC\"";
    dataObj.param1 = "na";
    dataObj.param2 = "na";
    dataObj.param3 = "na";
    dataObj.param4 = "na";
    dataObj.param5 = "na";
    dataObj.param6 = "na";
    dataObj.param7 = "na";
    dataObj.param8 = "na";

    objectToSend.Type = "Request";
    objectToSend.requestType = "tableData";
    objectToSend.data = dataObj;

    SendForRequestInfo(objectToSend, false);
}

function FindLineupDetailMachines(index, lnupGuid) {

    var objectToSend = {};
    var dataObj = {};

    dataObj.receiver = "LineupMachineData";
    dataObj.query = "SELECT * FROM v_LineupStepDetail WHERE IsActive = '1' AND Lineup_GUID = '" + lnupGuid + "'";
    dataObj.url = ruIP + ruPort + planningDB + planningEN + "read/dbo/v_LineupStepDetail?where=\"IsActive = '1' AND Lineup_GUID = '" + lnupGuid + "'\"";
    dataObj.param1 = index;
    dataObj.param2 = "na";
    dataObj.param3 = "na";
    dataObj.param4 = "na";
    dataObj.param5 = "na";
    dataObj.param6 = "na";
    dataObj.param7 = "na";
    dataObj.param8 = "na";

    objectToSend.Type = "Request";
    objectToSend.requestType = "tableData";
    objectToSend.data = dataObj;

    SendForRequestInfo(objectToSend, false);
}

function PlanningListLoad() {
    var planningListHTML = '';

    planningListHTML += '<div class="collection grey darken-4" style="border-color:#424242;">';

   for(var key in planData) {
        planningListHTML += '<a class="collection-item grey darken-4" style="border-color:#424242;" onclick="PlanningChecklistLoad($(this))" PlanConfig_GUID="' + planData[key].PlanConfig_GUID + '" PlanGUID="' + planData[key].Plan_GUID + '" ZoneGUID="' + planData[key].Zone_GUID + '" LocationName="' + planData[key].LocationDisplayName + '" LocationGUID="' + planData[key].Location_GUID + '" ShiftDate="' + planData[key].Shiftdate + '" Shift="' + planData[key].Shift + '" >' + '<span class="title">' + moment(planData[key].Shiftdate.split("Z")[0]).format("DD/MM/YYYY") + ' Turno: ' + planData[key].Shift + '</span><BR>' + '<span class="title">Zone: ' + planData[key].ZoneDisplayName + '</span><BR><span class="title">Location: ' + planData[key].LocationDisplayName + '</span></a>';
    }

    planningListHTML += '</div>';

    $("#lineup_card_header").html("PLANEACION");
    $("#list_item_back").css({
        "display": "none"
    });
	
    $("#generated_list").html(planningListHTML);
	
	if(planData.length <= 0) {
		EmptyList('planning');
	}
}

function LineupListLoad() {
    var linuepListHTML = '';

    linuepListHTML += '<div class="collection grey darken-4" style="border-color:#424242;">';

    for(var key in lnup_LineupDetail) {

        linuepListHTML += '<a class="collection-item grey darken-4" style="border-color:#424242;" onclick="ChecklistLoad($(this))" LineupGUID="' + lnup_LineupDetail[key].Lineup_GUID + '" ZoneGUID="' + lnup_LineupDetail[key].Zone_GUID + '" LocationName="' + lnup_LineupDetail[key].LocationDisplayName + '" LocationGUID="' + lnup_LineupDetail[key].Location_GUID + '" OperatorGUID="' + lnup_LineupDetail[key].Operator_GUID + '" ShiftDate="' + lnup_LineupDetail[key].ShiftDate + '" Shift="' + lnup_LineupDetail[key].Shift + '" MachineTypeGUIDS="' + lnup_LineupDetail[key].MachineTypeGUIDS + '" MachineGUIDS="' + lnup_LineupDetail[key].MachineGUIDS + '" Machines="' + lnup_LineupDetail[key].Machines + '" LineupStepGUIDS="' + lnup_LineupDetail[key].LineupStepGUIDS + '">' + '<span class="title">' + moment(lnup_LineupDetail[key].ShiftDate.split("Z")[0]).format("DD/MM/YYYY") + ' Turno: ' + lnup_LineupDetail[key].Shift + '</span><BR>' + '<span class="title">Zone: ' + lnup_LineupDetail[key].ZoneDisplayName + '</span><BR><span class="title">Location: ' + lnup_LineupDetail[key].LocationDisplayName + '</span>' + '<p>Operator: ' + lnup_LineupDetail[key].OperatorName;

        if (lnup_LineupDetail[key].HelperName) {
            linuepListHTML += '<BR>Helper: ' + lnup_LineupDetail[key].HelperName;
        }

        linuepListHTML += '</p></a>';
    }

    linuepListHTML += '</div>';

    $("#lineup_card_header").html("PUEBLE");
    $("#list_item_back").css({
        "display": "none"
    });
	
    $("#generated_list").html(linuepListHTML);
	
	if(lnup_LineupDetail.length <= 0) {
		EmptyList('lineup');
	}
}

function EmptyList() {
	var task_text	= "plans";
	var task_header	= "PLANEACION";
	
	if(task_GF == "lineup") {
		task_text	= "lineups";
		task_header	= "PUEBLE";
	}
	
	waitForLoadCount	= 0;
	loadCountComplete	= false;
    var linuepListHTML = '';

    linuepListHTML += '<div class="collection grey darken-4" style="border-color:#424242;">';

    linuepListHTML += '<a class="collection-item grey darken-4" style="border-color:#424242;">' + '<span class="title">There are currently no '+task_text+' available for ' + areaName + '</span>' + '</a>';

    linuepListHTML += '</div>';

    $("#lineup_card_header").html(task_header);
    $("#list_item_back").css({
        "display": "none"
    });
    $("#generated_list").html(linuepListHTML);
}

function PlanningChecklistLoad(element) {
    currentelement = element;
    var plan_guid = element.attr("PlanGUID");
    var planConfig_guid = element.attr("PlanConfig_GUID");
    var zone_guid = element.attr("ZoneGUID");
    var location_guid = element.attr("LocationGUID");
    var location_name = element.attr("LocationName");
    var shift_date = element.attr("ShiftDate");
    var shift = element.attr("Shift");
	
	var planningChecklistsHTML = '';

    planningChecklistsHTML += '<div class="collection grey darken-4" style="border-color:#424242;">';

    for (var key2 in planningChecklistTypes) {
		planningChecklistsHTML += '<a class="collection-item avatar grey darken-4" style="border-color:#424242;" onclick="plan_checklist_click($(this))" LocationGUID="' + location_guid + '" LocationName="' + location_name + '" PlanConfig_GUID="' + planConfig_guid + '" PlanGUID="' + plan_guid + '" ShiftDate="' + shift_date + '" Shift="' + shift + '" ChecklistTypeGUID="' + planningChecklistTypes[key2].ChecklistType_GUID + '" ChecklistType="' + planningChecklistTypes[key2].DisplayName + '">' + '<i class="material-icons circle red"></i>' + '<span class="title">' + planningChecklistTypes[key2].DisplayName + '</span>' + '<p>Not Ready</p>' + '</a>';
    }

    planningChecklistsHTML += '</div>';

    $("#lineup_card_header").html("CHECKLISTS");
    $("#list_item_back").html('<a style="font-size: 1.4rem" href="#" onclick="PlanningListLoad()">Back</a>');
    $("#list_item_back").css({
        "display": "block"
    });
    $("#generated_list").html(planningChecklistsHTML);
    GetPlanChecklistStatus();
}

function ChecklistLoad(element) {
    currentelement = element;
    var lnup_guid = element.attr("LineupGUID");
    var machineType_guids = element.attr("MachineTypeGUIDS");
    var machine_guids = element.attr("MachineGUIDS");
    var machines = element.attr("Machines");
    var lnup_step_guids = element.attr("LineupStepGUIDS");
    var location_guid = element.attr("LocationGUID");
    var location_name = element.attr("LocationName");
    var shift_date = element.attr("ShiftDate");
    var shift = element.attr("Shift");
    var operator_guid = element.attr("OperatorGUID");

    var MachineTypeArr;
    var jumboExists = false;
    var scoopExists = false;

    lnup_dayCheck = moment(shift_date.split("Z")[0]).format("DD/MM/YYYY") + " - Turno " + shift;

    if(machineType_guids) {
        MachineTypeArr = machineType_guids.split("_");

		if(MachineTypeArr.length > 0) {
			if(!(MachineTypeArr.indexOf(jumboMachineTypesGuid) == -1 && MachineTypeArr.indexOf(simbaMachineTypesGuid) == -1)) {
				jumboExists = true;
			}

			if(MachineTypeArr.indexOf(scoopMachineTypesGuid) != -1) {
				scoopExists = true;
			}
		}
	}

    var linuepChecklistsHTML = '';

    linuepChecklistsHTML += '<div class="collection grey darken-4" style="border-color:#424242;">';

    for (var key2 in lineupChecklistTypes) {
        if (!((lineupChecklistTypes[key2].DisplayName == explosives_checklist && !jumboExists) || (lineupChecklistTypes[key2].DisplayName == haulage_checklist && !scoopExists))) {
            if (!(lineupChecklistTypes[key2].DisplayName == process_checklist && scoopExists)) {
                linuepChecklistsHTML += '<a class="collection-item avatar grey darken-4" style="border-color:#424242;" onclick="checklist_Click($(this))" LocationGUID="' + location_guid + '" OperatorGUID="' + operator_guid + '" LocationName="' + location_name + '" LineupGUID="' + lnup_guid + '" ShiftDate="' + shift_date + '" Shift="' + shift + '" ChecklistTypeGUID="' + lineupChecklistTypes[key2].ChecklistType_GUID + '" ChecklistType="' + lineupChecklistTypes[key2].DisplayName + '" MachineTypeGUIDS="' + machineType_guids + '" MachineGUIDS="' + machine_guids + '" Machines="' + machines + '" LineupStepGUIDS="' + lnup_step_guids + '">' + '<i class="material-icons circle red"></i>' + '<span class="title">' + lineupChecklistTypes[key2].DisplayName + '</span>' + '<p>Not Ready</p>' + '</a>';
            }
        }
    }

    linuepChecklistsHTML += '</div>';

    $("#lineup_card_header").html("CHECKLISTS");
    $("#list_item_back").html('<a style="font-size: 1.4rem" href="#" onclick="LineupListLoad()">Back</a>');
    $("#list_item_back").css({
        "display": "block"
    });
    $("#generated_list").html(linuepChecklistsHTML);
    checklist_ready();
}

function GotoLineupGeneration(element) {
    var shiftDate = $(element).closest("td").attr("ShiftDate");
    var shift = $(element).closest("td").attr("Shift");

    OpenLineupWindow(shiftDate, shift);
}

function ExpandCrewBox(element) {
    if ($(element).find(".triangle").hasClass("tri_up")) {
        $(element).find(".triangle").removeClass("tri_up");
        $(element).find(".triangle").addClass("tri_down");

        $(element).parent().find(".lineupLocationChecklistBox").each(function() {
            $(this).css("display", "block");
        });
    } else if ($(element).find(".triangle").hasClass("tri_down")) {
        $(element).find(".triangle").removeClass("tri_down");
        $(element).find(".triangle").addClass("tri_up");

        $(element).parent().find(".lineupLocationChecklistBox").each(function() {
            $(this).css("display", "none");
        });
    }
}

function ExpandLocationChecklistBox(element) {
    if ($(element).closest("table").prev().hasClass("tri_up")) {
        $(element).closest("table").prev().removeClass("tri_up");
        $(element).closest("table").prev().addClass("tri_down");

        $(element).closest(".lineupLocationChecklistBox").find(".lineupChecklistTypeTable").each(function() {
            $(this).css("display", "block");
        });
    } else if ($(element).closest("table").prev().hasClass("tri_down")) {
        $(element).closest("table").prev().removeClass("tri_down");
        $(element).closest("table").prev().addClass("tri_up");

        $(element).closest(".lineupLocationChecklistBox").find(".lineupChecklistTypeTable").each(function() {
            $(this).css("display", "none");
        });
    }
}

function GetPlanChecklistStatus() {

    var objectToSend = {};
    var dataObj = {};

    dataObj.receiver = "planChecklistStatus";

    dataObj.query = "SELECT * FROM Plan_ChecklistStatus WHERE Area_GUID = '" + area_GF + "' AND IsActive = '1' AND CAST(ShiftDateSeconds AS INT) >= CAST('" + WeekBeginTime + "' AS INT) AND CAST(ShiftDateSeconds AS INT) <= CAST('" + WeekEndTime + "' AS INT) ORDER BY ShiftDateSeconds ASC";
    dataObj.url = ruIP + ruPort + planningDB + planningEN + "read/bi/Plan_ChecklistStatus?where=\"Shiftdate >= '" + WeekBeginTime + "' AND Shiftdate <= '" + WeekEndTime + "' AND Area_GUID = '" + area_GF + "' ORDER BY ShiftDate ASC\"";
    dataObj.param1 = "na";
    dataObj.param2 = "na";
    dataObj.param3 = "na";
    dataObj.param4 = "na";
    dataObj.param5 = "na";
    dataObj.param6 = "na";
    dataObj.param7 = "na";
    dataObj.param8 = "na";

    objectToSend.Type = "Request";
    objectToSend.requestType = "tableData";
    objectToSend.data = dataObj;

    SendForRequestInfo(objectToSend, false);
}

function plan_checklist_ready_with_data() {

    $(".collection-item").each(function() {
        var element = $(this);
        var plan_Guid = element.attr("PlanGUID");
        var checklistsTypeGuid = element.attr("ChecklistTypeGUID");

        for (var key in planChecklistStatus) {
            if (planChecklistStatus[key].ChecklistType_GUID == checklistsTypeGuid && planChecklistStatus[key].Plan_GUID == plan_Guid) {
                if (planChecklistStatus[key].Status == "Ready") {
                    element.find('i').removeClass("red");
                    element.find('i').addClass("green");
                    element.find('p').html("Ready");
                } else if (planChecklistStatus[key].Status == "NotReady") {
                    element.find('i').removeClass("green");
                    element.find('i').addClass("red");
                    element.find('p').html("Not Ready");
                }
            }
        }
    });
}

function checklist_ready() {

    var objectToSend = {};
    var dataObj = {};

    dataObj.receiver = "lnup_statusData";
    dataObj.query = "SELECT * FROM Lineup_FormStatus WHERE CAST(ShiftDateSeconds AS INT) >= CAST('" + WeekBeginTime + "' AS INT) AND CAST(ShiftDateSeconds AS INT) <= CAST('" + WeekEndTime + "' AS INT) AND Area_GUID = '" + area_GF + "'";
    dataObj.url = ruIP + ruPort + planningDB + planningEN + "read/bi/Lineup_FormStatus?where=\"ShiftDate >= '" + WeekBeginTime + "' AND ShiftDate <= '" + WeekEndTime + "' AND Area_GUID = '" + area_GF + "'\"";
    dataObj.param1 = "na";
    dataObj.param2 = "na";
    dataObj.param3 = "na";
    dataObj.param4 = "na";
    dataObj.param5 = "na";
    dataObj.param6 = "na";
    dataObj.param7 = "na";
    dataObj.param8 = "na";

    objectToSend.Type = "Request";
    objectToSend.requestType = "tableData";
    objectToSend.data = dataObj;

    SendForRequestInfo(objectToSend, false);
}

function checklist_ready_with_data() {

    $(".collection-item").each(function() {
        var element = $(this);
        var lnupGuid = element.attr("LineupGUID");
        var checklistsTypeGuid = element.attr("ChecklistTypeGUID");

        for (var key in lnup_statusData) {
            if (lnup_statusData[key].ChecklistType_GUID == checklistsTypeGuid && lnup_statusData[key].Lineup_GUID == lnupGuid) {
                if (lnup_statusData[key].Status == "Ready") {
                    element.find('i').removeClass("red");
                    element.find('i').addClass("green");
                    element.find('p').html("Ready");
                } else if (lnup_statusData[key].Status == "NotReady") {
                    element.find('i').removeClass("green");
                    element.find('i').addClass("red");
                    element.find('p').html("Not Ready");
                }
            }
        }
    });
}

function plan_checklist_click(element) {
    var checklistGUID	= element.attr("ChecklistTypeGUID");
    var checklistName	= element.attr("ChecklistType");
    var locationGuid	= element.attr("LocationGUID");
    var locationName	= element.attr("LocationName");
    var shiftDate		= element.attr("ShiftDate");
    var shift			= element.attr("Shift");
	
	plan_GUID = element.attr("PlanGUID");
	planConfig_GUID = element.attr("PlanConfig_GUID");
    currentChecklist = element;
	
	closingCL = false;	
	submissionRequest = false;

    var checklistTableHTML = '';

    checklistTableHTML += '<div id="lineup_checklist_form" class="modal-box">' + '<header>' + '<h5 id="lineup_checklist_title" class="center" style="height:27px"></h5>' + '</header>' + '<div id="lineup_checklist_body" class="modal-body"></div>' + '<footer class="center">' + '<a style="margin-right:2px" href="#" onclick="prepare_plan_checklist_data()" class="btn btn-submit btn-small lang-common accept">' + languagePack.common.accept + '</a>' + '<a style="margin-left:2px" href="#" id="plan_checklist_close" class="btn btn-small js-modal-close lang-common cancel">' + languagePack.common.cancel + '</a>' + '</footer>' + '</div>';

    $("#list_item_back").html('<a style="font-size: 1.4rem" href=#" id="plan_checklist_back_btn">Back</a>');
    $("#list_item_back").css({
        "display": "block"
    });
    $("#generated_list").html(checklistTableHTML);

    $("#plan_checklist_close").click(function() {
        PlanningChecklistLoad(currentelement);
    });

    $("#plan_checklist_back_btn").unbind('click');
    $("#plan_checklist_back_btn").click(function() {
		PlanningChecklistLoad(currentelement);
    });

    setTimeout(function() {
        $("#lineup_card_header").html(checklistName);
        $("#lineup_checklist_title").html(lnup_dayCheck);
        $("#lineup_checklist_title").closest("#lineup_checklist_form").attr("CheckListType", checklistName);
		
		plan_checklist_insert(checklistGUID, checklistName, plan_GUID, shiftDate);
    }, 500);
	
}

function checklist_Click(element) {
    var checklistGUID = element.attr("ChecklistTypeGUID");
    var checklistName = element.attr("ChecklistType");
    var MachineTypeGUIDS = element.attr("MachineTypeGUIDS");
    var MachineGUIDS = element.attr("MachineGUIDS");
    var Machines = element.attr("Machines");
    var LineupStepGUIDS = element.attr("LineupStepGUIDS");
    var locationGuid = element.attr("LocationGUID");
    var locationName = element.attr("LocationName");
    var shiftDate = element.attr("ShiftDate");
    var shift = element.attr("Shift");
    var operatorGuid = element.attr("OperatorGUID");
	
	closingCL = false;	
	submissionRequest = false;
	
    lnup_planGUID = element.attr("LineupGUID");
    currentChecklist = element;

    var checklistTableHTML = '';

    checklistTableHTML += '<div id="lineup_checklist_form" class="modal-box">' + '<header>' + '<h5 id="lineup_checklist_title" class="center" style="height:27px"></h5>' + '</header>' + '<div id="lineup_checklist_body" class="modal-body"></div>' + '<footer class="center">' + '<a style="margin-right:2px" href="#" onclick="prepare_checklist_data()" class="btn btn-submit btn-small lang-common accept">' + languagePack.common.accept + '</a>' + '<a style="margin-left:2px" href="#" id="checklist_close" class="btn btn-small js-modal-close lang-common cancel">' + languagePack.common.cancel + '</a>' + '</footer>' + '</div>';

    $("#list_item_back").html('<a style="font-size: 1.4rem" href=#" id="checklist_back_btn">Back</a>');
    $("#list_item_back").css({
        "display": "block"
    });
    $("#generated_list").html(checklistTableHTML);

    $("#checklist_close").click(function() {
        ChecklistLoad(currentelement);
    });

    $("#checklist_back_btn").unbind('click');
    $("#checklist_back_btn").click(function() {
        ChecklistLoad(currentelement);
    });

    setTimeout(function() {
        $("#lineup_card_header").html(checklistName);
        $("#lineup_checklist_title").html(lnup_dayCheck);
        $("#lineup_checklist_title").closest("#lineup_checklist_form").attr("CheckListType", checklistName);
		
		switch(checklistName) {
			case materials_checklist:
				materials_insert(checklistGUID, checklistName, lnup_planGUID, shiftDate);
				break;
				
			case process_checklist:
				process_insert(checklistGUID, checklistName, lnup_planGUID, shiftDate);
				break;
			
			case explosives_checklist:
				explosives_insert(checklistGUID, checklistName, lnup_planGUID, shiftDate);
				break;
			
			case haulage_checklist:
				haulage_insert(checklistGUID, checklistName, lnup_planGUID, locationName, locationGuid, shiftDate);
				break;
			
			case machineDownEvents:
				down_events_insert(lnup_planGUID, shiftDate, shift, locationGuid, operatorGuid, MachineGUIDS, Machines);
				break;
				
			default:
				checklist_insert(checklistGUID, checklistName, lnup_planGUID, MachineTypeGUIDS, MachineGUIDS, Machines, LineupStepGUIDS, shiftDate);
		}
    }, 500);
}

function haulage_insert(checklistGUID, checklistName, pGUID, locationName, locationGuid, shiftDate) {
    lnup_planGUID = pGUID;

    var index = 0;

    var checkTables = '<table LineupGUID="' + lnup_planGUID + '" HaulageLocationGUID="' + locationGuid + '" HaulageLocationName="' + locationName + '" id="haulage-table" class="checklist-table" ShiftDate="' + shiftDate + '"><col width="50"><thead></thead><tbody></tbody></table>';
    $("#lineup_checklist_body").append(checkTables);
    var trTitleHead = '<tr><th class="main-header" colspan="7">' + languagePack.prelineup.haulage + '</th></tr>';
    $('#haulage-table thead').append(trTitleHead);
    var trHead = '<tr><th>' + languagePack.common.location + '</th><th>' + languagePack.prelineup.scaling + '</th><th>' + languagePack.prelineup.mineral + '</th><th>' + languagePack.prelineup.waste + '</th><th>' + languagePack.prelineup.fromLocation + '</th><th>' + languagePack.prelineup.numLoads + '</th><th>' + languagePack.prelineup.toLocation + '</th></tr>';
    $('#haulage-table thead').append(trHead);

    var trBody = '';

    trBody += '<tr index="' + index + '" id="haulage_row_' + index + '" class="checkrow haulageRow">';
    trBody += '<td style="width:225px" class="HaulageLocationCell" HaulageLocationGUID="' + locationGuid + '">' + locationName + '</td>';
    trBody += '<td><input type="checkbox" class="checkBoxes formElement" elementType="checkbox" id="haulage_is_scaling_' + index + '" /><label for="haulage_is_scaling_' + index + '"></label></td>';
    trBody += '<td><input type="radio" class="btn-radio formElement" elementType="radiogroup" id="haulage_mineral_' + index + '" name="haulage_mineral_waste_' + index + '" value="1" /><label for="haulage_mineral_' + index + '"></label></td>';
    trBody += '<td><input type="radio" class="btn-radio formElement" elementType="radiogroup" id="haulage_waste_' + index + '" name="haulage_mineral_waste_' + index + '" value="0" /><label for="haulage_waste_' + index + '"></label></td>';
    trBody += '<td><select  style="width:225px"class="locationDropOff formElement" id="haulage_planned_location_' + index + '" elementType="select"></select></td>';
    trBody += '<td><input type="number" class="numberLoads formElement" id="haulage_number_loads_' + index + '" elementType="number" min="0" onkeypress="return event.charCode >= 48 && event.charCode <= 57" /><label for="haulage_number_loads_' + index + '"></label></td>';
    trBody += '<td><select style="width:225px" class="locationDropOff formElement" id="haulage_actual_location_' + index + '" elementType="select"></select></td>';
    trBody += '</tr>';
    $('#haulage-table tbody').append(trBody);
    $('#haulage-table tbody').append('<tr id="haulage_button_row"><td colspan="7" style="text-align:right"><button id="haulage_add_row" onclick="HaulageAddRow(this)" class="btn btn-small btn-addrow" >' + languagePack.common.addRow + '</button></td><tr>');

    $(".locationDropOff").each(function() {
        var thisId = $(this).attr("id");
        $(this).html("<option value='0'>" + languagePack.common.selectOption + "</option>");

        var locationDropOff = document.getElementById(thisId);

        for (var key in preLineupMachineLocations) {
            locationDropOff.options[locationDropOff.options.length] = new Option(preLineupMachineLocations[key].DisplayName, preLineupMachineLocations[key].Location_GUID);
        }

        $(this).material_select();
    });

    var objectToSend = {};
    var dataObj = {};

    dataObj.receiver = "LoadHaulageDetails";
    dataObj.query = "SELECT * FROM Lineup_HaulageDetail WHERE Lineup_GUID = '" + lnup_planGUID + "' AND IsActive = '1'";
    dataObj.url = ruIP + ruPort + planningDB + planningEN + "read/trans/Lineup_HaulageDetail?where=\"Lineup_GUID = '" + lnup_planGUID + "' AND IsActive = '1'\"";
    dataObj.param1 = "na";
    dataObj.param2 = "na";
    dataObj.param3 = "na";
    dataObj.param4 = "na";
    dataObj.param5 = "na";
    dataObj.param6 = "na";
    dataObj.param7 = "na";
    dataObj.param8 = "na";

    objectToSend.Type = "Request";
    objectToSend.requestType = "tableData";
    objectToSend.data = dataObj;

    SendForRequestInfo(objectToSend, false);
}

function LoadHaulageDetails(data) {
    var haulageDetails = data

    for (var key in haulageDetails) {
        (parseInt(key) > 0) ? $("#haulage_add_row").click() : false;
    }

    setTimeout(function() {
        for (var key in haulageDetails) {
            $("#haulage_row_" + key).attr("LineupHaulageDetailGUID", haulageDetails[key].Lineup_HaulageDetail_GUID);
            $("#haulage_is_scaling_" + key).prop("checked", (haulageDetails[key].IsScaling == 1) ? true : false);

			(haulageDetails[key].Mineral_Waste != null) ? $('input[name="haulage_mineral_waste_' + key + '"]').val([(haulageDetails[key].Mineral_Waste) ? 1 : 0]) : false;

            $("#haulage_planned_location_" + key).val(haulageDetails[key].PlannedLocation_GUID);
            $("#haulage_actual_location_" + key).val(haulageDetails[key].ActualLocation_GUID);
            $("#haulage_number_loads_" + key).val(haulageDetails[key].Loads);
			
			$("#haulage_planned_location_" + key).material_select();
			$("#haulage_actual_location_" + key).material_select();
        }
		
		getDataForInjection();
    }, 500);
}

function HaulageAddRow(element) {
	var locationGuid = $(element).closest('.checklist-table').attr("HaulageLocationGUID");
	var locationName = $(element).closest('.checklist-table').attr('HaulageLocationName');
	
	var rowIndex = 0;
	
	$(element).closest('.checklist-table').find(".haulageRow").each(function(index) {
		$(this).attr("index", index);
		rowIndex++;
	});

	if(rowIndex >= 1 && $("#haulage_remove_row").length <= 0) {
		$("#haulage_add_row").after('<button style="margin-left:4px;" id="haulage_remove_row" onclick="HaulageRemoveRow(this)" class="btn btn-small btn-removerow">Eliminar fila</button>');
	}

	var trBody   = '';
	
	trBody += '<tr index="' + rowIndex + '" id="haulage_row_' + rowIndex + '" class="checkrow haulageRow">';
    trBody += '<td style="width:225px" class="HaulageLocationCell" HaulageLocationGUID="' + locationGuid + '">' + locationName + '</td>';
    trBody += '<td><input type="checkbox" class="checkBoxes formElement" elementType="checkbox" id="haulage_is_scaling_' + rowIndex + '" /><label for="haulage_is_scaling_' + rowIndex + '"></label></td>';
    trBody += '<td><input type="radio" class="btn-radio formElement" elementType="radiogroup" id="haulage_mineral_' + rowIndex + '" name="haulage_mineral_waste_' + rowIndex + '" value="1" /><label for="haulage_mineral_' + rowIndex + '"></label></td>';
    trBody += '<td><input type="radio" class="btn-radio formElement" elementType="radiogroup" id="haulage_waste_' + rowIndex + '" name="haulage_mineral_waste_' + rowIndex + '" value="0" /><label for="haulage_waste_' + rowIndex + '"></label></td>';
    trBody += '<td><select  style="width:225px"class="locationDropOff formElement" id="haulage_planned_location_' + rowIndex + '" elementType="select"></select></td>';
    trBody += '<td><input type="number" class="numberLoads formElement" id="haulage_number_loads_' + rowIndex + '" elementType="number" min="0" onkeypress="return event.charCode >= 48 && event.charCode <= 57" /><label for="haulage_number_loads_' + rowIndex + '"></label></td>';
    trBody += '<td><select style="width:225px" class="locationDropOff formElement" id="haulage_actual_location_' + rowIndex + '" elementType="select"></select></td>';
    trBody += '</tr>';
	
	$("#haulage_button_row").before(trBody);	
	
	var thisId = $("#haulage_planned_location_" + rowIndex).attr("id");
	$("#haulage_planned_location_" + rowIndex).html("<option value='0'>"+languagePack.common.selectOption+"</option>");
	
	var locationDropOff = document.getElementById(thisId);
	
	for(var key in preLineupMachineLocations) {
		locationDropOff.options[locationDropOff.options.length] = new Option(preLineupMachineLocations[key].DisplayName, preLineupMachineLocations[key].Location_GUID);
	}
	
	var thisId = $("#haulage_actual_location_" + rowIndex).attr("id");
	$("#haulage_actual_location_" + rowIndex).html("<option value='0'>"+languagePack.common.selectOption+"</option>");
	
	var locationDropOff = document.getElementById(thisId);
	
	for(var key in preLineupMachineLocations) {
		locationDropOff.options[locationDropOff.options.length] = new Option(preLineupMachineLocations[key].DisplayName, preLineupMachineLocations[key].Location_GUID);
	}

    $("#haulage_planned_location_" + rowIndex).material_select();
    $("#haulage_actual_location_" + rowIndex).material_select();
}

function HaulageRemoveRow(element) {
	
	var rowIndex = 0;
	var removeE;
	
	$(element).closest('.checklist-table').find(".haulageRow").each(function(index) {
		$(this).attr("index", index);
		rowIndex++;
	});
	
	$(element).closest('.checklist-table').find(".haulageRow").each(function(index) {
		var e = $(this);
		if(e.attr("index") == (rowIndex - 1)) {
			removeE = e;
		}
	});
	
	removeE.remove();
	rowIndex--;
	
	if(rowIndex <= 1) {
		$("#haulage_remove_row").remove();
	}
	
}

function down_events_insert(pGUID, shiftDate, shift, locationGuid, operatorGuid, MachineGUIDS, MachineList) {
    lnup_planGUID = pGUID;

    var index = 0;

    var checkTables = '<table id="downs-table" class="checklist-table" LineupGUID="' + pGUID + '" ShiftDate="' + shiftDate + '" Shift="' + shift + '" LocationGUID="' + locationGuid + '" OperatorGUID="' + operatorGuid + '" MachineGUIDS="' + MachineGUIDS + '" MachineList="' + MachineList + '"><col width="50"><thead></thead><tbody></tbody></table>';
    $("#lineup_checklist_body").append(checkTables);
    var trTitleHead = '<tr><th class="main-header" colspan="5">' + languagePack.prelineup.machineDownEvent + '</th></tr>';
    $('#downs-table thead').append(trTitleHead);
    var trHead = '<tr><th style="min-width:175px">' + languagePack.prelineup.downCode + '</th><th>' + languagePack.prelineup.startDownTime + '</th><th>' + languagePack.prelineup.responseTime + '</th><th>' + languagePack.prelineup.endDownTime + '</th><th>' + languagePack.prelineup.observations + '</th></tr>';
    $('#downs-table thead').append(trHead);

    var trBody = '';

    trBody += '<tr index="' + index + '" id="downs_row_' + index + '" class="checkrow downsRow">';
    trBody += '<td valign="top"><select class="formElement downCodeSelect" elementType="select" id="down_code_select_' + index + '"></select></td>';
    trBody += '<td valign="top"><input class="preLineupDate formElement downCodeBeginTime" type="text" id="down_code_begin_time_' + index + '" elementtype="date" /><label for="down_code_begin_time_' + index + '"></laebl></td>';
    trBody += '<td valign="top"><input class="preLineupDate formElement downCodeArrivalTime" type="text" id="down_code_arrival_time_' + index + '" elementtype="date" /><label for="down_code_arrival_time_' + index + '"></laebl></td>';
    trBody += '<td valign="top"><input class="preLineupDate formElement downCodeEndTime" type="text" id="down_code_end_time_' + index + '" elementtype="date" /><label for="down_code_end_time_' + index + '"></laebl></td>';
    trBody += '<td valign="top"><textarea class="formElement downCodeComments materialize-textarea" id="down_code_comments_' + index + '" elementType="textarea"></textarea><label for="down_code_comments_' + index + '"></label></td>';
    trBody += '</tr>';

    $('#downs-table tbody').append(trBody);

    $('#downs-table tbody').append('<tr id="downs_button_row"><td colspan="5" style="text-align:right"><button id="down_add_row" onclick="DownsAddRow(this)" class="btn btn-small btn-addrow" >' + languagePack.common.addRow + '</button></td><tr>');

    var codesTable = '';

    (downCodesData.length > 0) ? codesTable += '<table class="checklist-table reasonCode-table">' : false;

    for (var key in downCodesData) {
        (parseInt(key) % 3 == 0) ? codesTable += '<tr>' : false;
		
        codesTable += '<td>' + downCodesData[key].ReasonCode + '</td><td>' + downCodesData[key].ReasonCodeDesc + '</td>';
		
        (parseInt(key) % 3 == 2) ? codesTable += '</tr>' : false;
    }

    (downCodesData.length > 0) ? codesTable += '</table>' : false;

    $("#lineup_checklist_body").append(codesTable);

    $(".downCodeSelect").each(function() {
        var thisId = $(this).attr("id");
        $(this).html("<option value='0'>" + languagePack.common.selectOption + "</option>");

        var machineDownCodes = document.getElementById(thisId);

        for (var key in downCodesData) {
            machineDownCodes.options[machineDownCodes.options.length] = new Option(downCodesData[key].ReasonCode, downCodesData[key].DownReasonCode_GUID);
        }

        $(this).material_select();
    });

    setTimeout(function() {
        $(".preLineupDate").datetimepicker({
            timepicker: true,
            hours12: false,
            format: 'm/d/Y H:i',
            mask: true
        });
    }, 50);

    var objectToSend = {};
    var dataObj = {};

    dataObj.receiver = "LoadDownEvents";
    dataObj.query = "SELECT * FROM MachineDownEvent WHERE Lineup_GUID = '" + lnup_planGUID + "' AND IsActive = '1' ORDER BY Created ASC";
    dataObj.url = ruIP + ruPort + planningDB + planningEN + "read/trans/MachineDownEvent?where=\"Lineup_GUID = '" + lnup_planGUID + "' AND IsActive = '1' Order By Created ASC\"";
    dataObj.param1 = "na";
    dataObj.param2 = "na";
    dataObj.param3 = "na";
    dataObj.param4 = "na";
    dataObj.param5 = "na";
    dataObj.param6 = "na";
    dataObj.param7 = "na";
    dataObj.param8 = "na";

    objectToSend.Type = "Request";
    objectToSend.requestType = "tableData";
    objectToSend.data = dataObj;

    SendForRequestInfo(objectToSend, false);
}

function LoadDownEvents(data) {
    var downEvents = data

    for (var key in downEvents) {
        (parseInt(key) > 0) ? $("#down_add_row").click() : false;
    }

    setTimeout(function() {
        for (var key in downEvents) {
            $("#downs_row_" + key).attr("MachineDownEventGUID", downEvents[key].MachineDownEvent_GUID);
			if(downEvents[key].DownReasonCode_GUID) {
				$("#down_code_select_" + key).val(downEvents[key].DownReasonCode_GUID);
				$("#down_code_select_" + key).attr("disabled", true);
				$("#down_code_select_" + key).material_select();
			}
			
			if(downEvents[key].DownStartTime) {
				$("#down_code_begin_time_" + key).val(moment(downEvents[key].DownStartTime.split("Z")[0]).format("MM/DD/YYYY HH:mm"));
				$("#down_code_begin_time_" + key).attr("disabled", "disabled");
			}
			
			if(downEvents[key].MaintenanceArrivalTime) {
				$("#down_code_arrival_time_" + key).val(moment(downEvents[key].MaintenanceArrivalTime.split("Z")[0]).format("MM/DD/YYYY HH:mm"));
				$("#down_code_arrival_time_" + key).attr("disabled", "disabled");
			}
			
			if(downEvents[key].DownFinishTime) {
				$("#down_code_end_time_" + key).val(moment(downEvents[key].DownFinishTime.split("Z")[0]).format("MM/DD/YYYY HH:mm"));
				$("#down_code_end_time_" + key).attr("disabled", "disabled");
			}
			
			if(downEvents[key].Comment) {
				$("#down_code_comments_" + key).val(downEvents[key].Comment);
				$("#down_code_comments_" + key).attr("disabled", "disabled");
			}
        }
		
		getDataForInjection();
    }, 500);
}

function DownsAddRow(element) {

    var rowIndex = 0;

    $(element).closest('.checklist-table').find(".downsRow").each(function(index) {
        $(this).attr("index", index);
        rowIndex++;
    });

	if(rowIndex >= 1 && $("#down_remove_row").length <= 0) {
		$("#down_add_row").after('<button style="margin-left:4px;" id="down_remove_row" onclick="DownsRemoveRow(this)" class="btn btn-small btn-removerow">Eliminar fila</button>');
	}

    var trBody = '';

    trBody += '<tr index="' + rowIndex + '" id="downs_row_' + rowIndex + '" class="checkrow downsRow">';
    trBody += '<td valign="top"><select class="formElement downCodeSelect" elementType="select" id="down_code_select_' + rowIndex + '"></select></td>';
    trBody += '<td valign="top"><input class="preLineupDate formElement downCodeBeginTime" type="text" id="down_code_begin_time_' + rowIndex + '" elementtype="date" /><label for="down_code_begin_time_' + rowIndex + '"></label></td>';
    trBody += '<td valign="top"><input class="preLineupDate formElement downCodeArrivalTime" type="text" id="down_code_arrival_time_' + rowIndex + '" elementtype="date" /><label for="down_code_arrival_time_' + rowIndex + '"></label></td>';
    trBody += '<td valign="top"><input class="preLineupDate formElement downCodeEndTime" type="text" id="down_code_end_time_' + rowIndex + '" elementtype="date" /><label for="down_code_end_time_' + rowIndex + '"></label></td>';
    trBody += '<td valign="top"><textarea class="formElement downCodeComments materialize-textarea" id="down_code_comments_' + rowIndex + '" elementType="textarea"></textarea><label for="down_code_comments_' + rowIndex + '"></label></td>';
    trBody += '</tr>';

    $("#downs_button_row").before(trBody);

    setTimeout(function() {
		$("#down_code_begin_time_" + rowIndex).datetimepicker({ timepicker:true, hours12:false, format:'m/d/Y H:i', mask:true });
		$("#down_code_arrival_time_" + rowIndex).datetimepicker({ timepicker:true, hours12:false, format:'m/d/Y H:i', mask:true });
		$("#down_code_end_time_" + rowIndex).datetimepicker({ timepicker:true, hours12:false, format:'m/d/Y H:i', mask:true });
	},50);

    var thisId = $("#down_code_select_" + rowIndex).attr("id");
    $("#down_code_select_" + rowIndex).html("<option value='0'>" + languagePack.common.selectOption + "</option>");

    var machineDownCodes = document.getElementById(thisId);

    for (var key in downCodesData) {
        machineDownCodes.options[machineDownCodes.options.length] = new Option(downCodesData[key].ReasonCode, downCodesData[key].DownReasonCode_GUID);
    }

    $("#down_code_select_" + rowIndex).material_select();
}

function DownsRemoveRow(element) {
	
	var rowIndex = 0;
	var removeE;
	
	$(element).closest('.checklist-table').find(".downsRow").each(function(index) {
		$(this).attr("index", index);
		rowIndex++;
	});
	
	$(element).closest('.checklist-table').find(".downsRow").each(function(index) {
		var e = $(this);
		if(e.attr("index") == (rowIndex - 1)) {
			removeE = e;
		}
	});
	
	removeE.remove();
	rowIndex--;
	
	if(rowIndex <= 1) {
		$("#down_remove_row").remove();
	}
	
}

function explosives_insert(checklistGUID, checklistName, pGUID, shiftDate) {

    var objectToSend = {};
    var dataObj = {};

    dataObj.receiver = "explosives_insert_with_data";
    dataObj.query = "SELECT * FROM v_LineupMeasureDetail WHERE Lineup_GUID = '" + pGUID + "' AND MeasureType = 'Explosivo' AND IsActive = '1' ORDER BY MeasureDisplayName ASC";
    dataObj.url = ruIP + ruPort + planningDB + planningEN + "read/dbo/v_LineupMeasureDetail?where=\"Lineup_GUID = '" + pGUID + "' AND MeasureType = 'Explosivo' AND IsActive = '1' ORDER BY MeasureDisplayName ASC\"";
    dataObj.param1 = checklistGUID;
    dataObj.param2 = checklistName;
    dataObj.param3 = pGUID;
    dataObj.param4 = shiftDate;
    dataObj.param5 = "na";
    dataObj.param6 = "na";
    dataObj.param7 = "na";
    dataObj.param8 = "na";

    objectToSend.Type = "Request";
    objectToSend.requestType = "tableData";
    objectToSend.data = dataObj;

    SendForRequestInfo(objectToSend, false);
}

function explosives_insert_with_data(data, checklistGUID, checklistName, pGUID, shiftDate) {

    lnup_dataQ = [];
    lnup_planGUID = pGUID;

    lnup_dataQ = data
    lnup_checklistType = checklistGUID;
    lnup_checkEdit = false;

    var checkTables = '<table id="explosives-table" class="checklist-table" ShiftDate="' + shiftDate + '"><col width="50"><thead></thead><tbody></tbody></table>';
    $("#lineup_checklist_body").append(checkTables);
    var trTitleHead = '<tr><th class="main-header" colspan="7">' + languagePack.prelineup.explosive + '</th></tr>';
    $('#explosives-table thead').append(trTitleHead);
    var trHead = '<tr><th>' + languagePack.common.num + '</th><th>' + languagePack.common.activity + '</th><th>' + languagePack.common.machine + '</th><th>' + languagePack.prelineup.explosive + '</th><th>' + languagePack.planning.plan + '</th><th>' + languagePack.prelineup.real + '</th><th>' + languagePack.prelineup.surplus + '</th></tr>';
    $('#explosives-table thead').append(trHead);

    $.each(lnup_dataQ, function(i, item) {
        var trBody = '';
        var num = i + 1;

        trBody += '<tr class="checkrow" checklistquestion="' + item.Lineup_MeasureDetail_GUID + '">';
        trBody += '<td>' + num + '</td>';
        trBody += '<td>' + item.StepDisplayName + '</td>';
        trBody += '<td>' + item.MachineDisplayName + '</td>';
        trBody += '<td>' + item.MeasureDisplayName + '</td>';
        trBody += '<td>' + ((item.PlannedValue == null) ? " " : item.PlannedValue) + '</td>';
        trBody += '<td><input class="formElement" elementType="textbox" type="number" id="Real-' + item.Lineup_MeasureDetail_GUID + '"></input></td>';
        trBody += '<td><input class="formElement" elementType="textbox" type="number" id="Sobrante-' + item.Lineup_MeasureDetail_GUID + '"></input></td>';
        trBody += '</tr>';
        $('#explosives-table tbody').append(trBody);

		(item.ActualValue_1) ? $('#Real-' + item.Lineup_MeasureDetail_GUID).val(item.ActualValue_1) : false;
		
		(item.ActualValue_2) ? $('#Sobrante-' + item.Lineup_MeasureDetail_GUID).val(item.ActualValue_2) : false;
    });
	
	getDataForInjection();
}

function materials_insert(checklistGUID, checklistName, pGUID, shiftDate) {

    var objectToSend = {};
    var dataObj = {};

    dataObj.receiver = "materials_insert_with_data";
    dataObj.query = "SELECT * FROM v_LineupMeasureDetail WHERE Lineup_GUID = '" + pGUID + "' AND MeasureType = 'Material' AND IsActive = '1' ORDER BY MeasureDisplayName ASC";
    dataObj.url = ruIP + ruPort + planningDB + planningEN + "read/dbo/v_LineupMeasureDetail?where=\"Lineup_GUID = '" + pGUID + "' AND MeasureType = 'Material' AND IsActive = '1' ORDER BY MeasureDisplayName ASC\"";
    dataObj.param1 = checklistGUID;
    dataObj.param2 = checklistName;
    dataObj.param3 = pGUID;
    dataObj.param4 = shiftDate;
    dataObj.param5 = "na";
    dataObj.param6 = "na";
    dataObj.param7 = "na";
    dataObj.param8 = "na";

    objectToSend.Type = "Request";
    objectToSend.requestType = "tableData";
    objectToSend.data = dataObj;

    SendForRequestInfo(objectToSend, false);
}

function materials_insert_with_data(data, checklistGUID, checklistName, pGUID, shiftDate) {
    lnup_dataQ = [];
    lnup_planGUID = pGUID;

    lnup_dataQ = data
    lnup_checklistType = checklistGUID;
    lnup_checkEdit = false;

    var checkTables = '<table id="materials-table" class="checklist-table" ShiftDate="' + shiftDate + '"><col width="50"><thead></thead><tbody></tbody></table>';
    $("#lineup_checklist_body").append(checkTables);
    var trTitleHead = '<tr><th class="main-header" colspan="7">' + languagePack.prelineup.material + '</th></tr>';
    $('#materials-table thead').append(trTitleHead);
    var trHead = '<tr><th>' + languagePack.common.num + '</th><th>' + languagePack.common.activity + '</th><th>' + languagePack.common.machine + '</th><th>' + languagePack.prelineup.material + '</th><th>' + languagePack.planning.plan + '</th><th>' + languagePack.prelineup.real + '</th></tr>';
    $('#materials-table thead').append(trHead);

    $.each(lnup_dataQ, function(i, item) {
        var trBody = '';
        var num = i + 1;

        trBody += '<tr class="checkrow" checklistquestion="' + item.Lineup_MeasureDetail_GUID + '"><td>' + num + '</td><td>' + item.StepDisplayName + '</td><td>' + item.MachineDisplayName + '</td><td>' + item.MeasureDisplayName + '</td><td>' + ((item.PlannedValue == null) ? " " : item.PlannedValue) + '</td>';
        trBody += '<td><input class="formElement" elementType="textbox" type="number" id="Real-' + item.Lineup_MeasureDetail_GUID + '" /><label for="Real-' + item.Lineup_MeasureDetail_GUID + '"></label></td></tr>';
        $('#materials-table tbody').append(trBody);

		(item.ActualValue_1) ? $('#Real-' + item.Lineup_MeasureDetail_GUID).val(item.ActualValue_1) : false;
    });
	
	getDataForInjection();
}

function process_insert(checklistGUID, checklistName, pGUID, shiftDate) {

    var objectToSend = {};
    var dataObj = {};

    dataObj.receiver = "process_insert_with_data";
    dataObj.query = "SELECT * FROM v_LineupMeasureDetail WHERE Lineup_GUID = '" + pGUID + "' AND MeasureType = 'Proceso' AND IsActive = '1' ORDER BY MeasureDisplayName ASC";
    dataObj.url = ruIP + ruPort + planningDB + planningEN + "read/dbo/v_LineupMeasureDetail?where=\"Lineup_GUID = '" + pGUID + "' AND MeasureType = 'Proceso' AND IsActive = '1' ORDER BY MeasureDisplayName ASC\"";
    dataObj.param1 = checklistGUID;
    dataObj.param2 = checklistName;
    dataObj.param3 = pGUID;
    dataObj.param4 = shiftDate;
    dataObj.param5 = "na";
    dataObj.param6 = "na";
    dataObj.param7 = "na";
    dataObj.param8 = "na";

    objectToSend.Type = "Request";
    objectToSend.requestType = "tableData";
    objectToSend.data = dataObj;

    SendForRequestInfo(objectToSend, false);
}

function process_insert_with_data(data, checklistGUID, checklistName, pGUID, shiftDate) {
    lnup_dataQ = [];
    lnup_planGUID = pGUID;

    lnup_dataQ = data;
    lnup_checklistType = checklistGUID;
    lnup_checkEdit = false;

    var checkTables = '<table id="process-table" class="checklist-table" ShiftDate="' + shiftDate + '"><col width="50"><thead></thead><tbody></tbody></table>';
    $("#lineup_checklist_body").append(checkTables);
    var trTitleHead = '<tr><th class="main-header" colspan="7">' + languagePack.planning.process + '</th></tr>';
    $('#process-table thead').append(trTitleHead);
    var trHead = '<tr><th>' + languagePack.common.num + '</th><th>' + languagePack.common.activity + '</th><th>' + languagePack.planning.process + '</th><th>' + languagePack.prelineup.top + '</th><th>' + languagePack.prelineup.niche + '</th><th style="width: 170px; text-align:left">' + languagePack.prelineup.overflow1 + '</th><th>' + languagePack.prelineup.overflow2 + '</th></tr>';
    $('#process-table thead').append(trHead);
	
	
	var len = lnup_dataQ.length;

    $.each(lnup_dataQ, function(i, item) {
        var trBody = '';
        var num = i + 1;

        trBody += '<tr class="checkrow" checklistquestion="' + item.Lineup_MeasureDetail_GUID + '"><td>' + num + '</td><td>' + item.StepDisplayName + '</td><td>' + item.MeasureDisplayName + '</td>';
        trBody += '<td><input class="formElement" elementType="textbox" type="number" min="0" step="0.1" id="tope-' + item.Lineup_MeasureDetail_GUID + '"></input></td>';
        trBody += '<td><input class="formElement" elementType="textbox" type="number" min="0" step="0.1" id="nicho-' + item.Lineup_MeasureDetail_GUID + '"></input></td>';
        trBody += '<td><input class="formElement" elementType="textbox" type="number" min="0" step="0.1" id="desborde-' + item.Lineup_MeasureDetail_GUID + '"></input></td>';
        trBody += '<td><input class="formElement" elementType="textbox" type="number" min="0" step="0.1" id="descostre-' + item.Lineup_MeasureDetail_GUID + '"></input></td></tr>';
        $('#process-table tbody').append(trBody);

		(item.ActualValue_1) ? $('#tope-'		+ item.Lineup_MeasureDetail_GUID).val(item.ActualValue_1) : false;
		(item.ActualValue_2) ? $('#nicho-'		+ item.Lineup_MeasureDetail_GUID).val(item.ActualValue_2) : false;
		(item.ActualValue_3) ? $('#desborde-'	+ item.Lineup_MeasureDetail_GUID).val(item.ActualValue_3) : false;
		(item.ActualValue_4) ? $('#descostre-'	+ item.Lineup_MeasureDetail_GUID).val(item.ActualValue_4) : false;
		
		if(num >= len) {
			getDataForInjection();
		}		
    });
}

function checklist_insert(checklistGUID, checklistName, pGUID, MachineTypeGUIDS, MachineGUIDS, Machines, LineupStepGUIDS, shiftDate) {
    var MachineTypeArr = MachineTypeGUIDS.split("_");
    var machineTypeGuidString = "";

    for (var key in MachineTypeArr) {
        machineTypeGuidString += "'" + MachineTypeArr[key] + "',";
    }

    machineTypeGuidString += "'" + allMachineTypesGuid + "'";

    lnup_dataQ = [];
    lnup_planGUID = pGUID;

    var objectToSend = {};
    var dataObj = {};

    dataObj.receiver = "checklist_insert_with_data";
    dataObj.query = "SELECT * FROM v_ChecklistQuestion WHERE ChecklistType_GUID = '" + checklistGUID + "' AND IsActive = '1' AND MachineType_GUID IN (" + machineTypeGuidString + ") ORDER By Question_Name ASC";
    dataObj.url = ruIP + ruPort + planningDB + planningEN + "read/web/v_ChecklistQuestion?where=\"ChecklistType_GUID = '" + checklistGUID + "' AND IsActive = '1' AND MachineType_GUID IN (" + machineTypeGuidString + ") ORDER By Question_Name ASC\"";
    dataObj.param1 = checklistGUID;
    dataObj.param2 = checklistName;
    dataObj.param3 = pGUID;
    dataObj.param4 = shiftDate;
    dataObj.param5 = MachineTypeGUIDS;
    dataObj.param6 = MachineGUIDS;
    dataObj.param7 = Machines;
    dataObj.param8 = LineupStepGUIDS;

    objectToSend.Type = "Request";
    objectToSend.requestType = "tableData";
    objectToSend.data = dataObj;

    SendForRequestInfo(objectToSend, false);
}

function plan_checklist_insert(checklistGUID, checklistName, pGUID, shiftDate) {

    var objectToSend = {};
    var dataObj = {};

    dataObj.receiver = "plan_checklist_insert_with_data";
    dataObj.query = "SELECT * FROM v_ChecklistQuestion WHERE ChecklistType_GUID = '" + checklistGUID + "' AND IsActive = '1' ORDER By Question_Name ASC";
    dataObj.url = ruIP + ruPort + planningDB + planningEN + "read/web/v_ChecklistQuestion?where=\"ChecklistType_GUID = '" + checklistGUID + "' AND IsActive = '1' ORDER By Question_Name ASC\"";
    dataObj.param1 = checklistGUID;
    dataObj.param2 = checklistName;
    dataObj.param3 = pGUID;
    dataObj.param4 = shiftDate;
    dataObj.param5 = "na";
    dataObj.param6 = "na";
    dataObj.param7 = "na";
    dataObj.param8 = "na";

    objectToSend.Type = "Request";
    objectToSend.requestType = "tableData";
    objectToSend.data = dataObj;

    SendForRequestInfo(objectToSend, false);
}

function plan_checklist_insert_with_data(data, checklistGUID, checklistName, pGUID, shiftDate) {
	lnup_dataQ = data
    lnup_checklistType = checklistGUID;
    lnup_checkEdit = false;
	
	var commonFieldsGroup = ''; $.each(lnup_dataQ, function(i, item) {
        var checkTables = '';
        var trTitleHead = '';
        var trHead = '';
        var trBody = '';
        var num = i + 1;

        if($("#" + item.ChecklistGroup_GUID).length) {
            trBody += '<tr class="checkrow" checklistquestion="' + item.ChecklistQuestion_GUID + '"><td>' + num + '</td><td>' + item.Question_Name + '</td>';

            if(item.InputType_1 == 'Radio') {
                trBody += '<td valign="top"><input type="radio" class="btn-radio formElement" elementType="radiogroup" id="Answer1a-' + item.ChecklistQuestion_GUID + '" name="Answer1-' + item.ChecklistQuestion_GUID + '" value="1" /><label for="Answer1a-' + item.ChecklistQuestion_GUID + '"></label></td><td valign="top"><input type="radio" class="btn-radio formElement" elementType="radiogroup" id="Answer1b-' + item.ChecklistQuestion_GUID + '" name="Answer1-' + item.ChecklistQuestion_GUID + '" value="0" /><label for="Answer1b-' + item.ChecklistQuestion_GUID + '"></label></td>';
            }
			else if(item.InputType_1 == 'Textbox') {
                trBody += '<td valign="top"><input type="text" id="Input-' + item.ChecklistQuestion_GUID + '" class="formElement" elementType="textbox" /><label for="Input-' + item.ChecklistQuestion_GUID + '"></label></td>';
            }
			else if(item.InputType_1 == 'Checkbox') {
                trBody += '<td valign="top"><input type="checkbox" class="checkBoxes formElement" elementType="checkbox" id="Input-' + item.ChecklistQuestion_GUID + '" /><label for="Input-' + item.ChecklistQuestion_GUID + '"></label></td>';
            }
			else if(item.InputType_1 == 'Textarea') {
                trBody += '<td valign="top" style="width:75%"><textarea id="Input-' + item.ChecklistQuestion_GUID + '" class="formElement materialize-textarea" elementType="textarea" rows="5" cols="20"></textarea><label for="Input-' + item.ChecklistQuestion_GUID + '"></label></td>';
            }
			
            if(item.InputType_2 == 'Textbox') {
                trBody += '<td valign="top"><input type="text" id="Input2-' + item.ChecklistQuestion_GUID + '"  class="formElement" elementType="textbox" /><label for="Input2-' + item.ChecklistQuestion_GUID + '"></label></td>';
            }
			else if(item.InputType_2 == 'Radio') {
                trBody += '<td valign="top"><input type="radio" class="btn-radio formElement" elementType="radiogroup" id="Answer2a-' + item.ChecklistQuestion_GUID + '" name="Answer2-' + item.ChecklistQuestion_GUID + '" value="1" /><label for="Answer2a-' + item.ChecklistQuestion_GUID + '"></label></td><td valign="top"><input type="radio" class="btn-radio formElement" elementType="radiogroup" id="Answer2b-' + item.ChecklistQuestion_GUID + '" name="Answer2-' + item.ChecklistQuestion_GUID + '" value="0" /><label for="Answer2b-' + item.ChecklistQuestion_GUID + '"></label></td>';
            }
			else if(item.InputType_2 == 'Checkbox') {
                trBody += '<td valign="top"><input type="checkbox" class="checkBoxes formElement" elementType="checkbox" id="Input2-' + item.ChecklistQuestion_GUID + '" /><label for="Input2-' + item.ChecklistQuestion_GUID + '"></label></td>';
            }
			else if(item.InputType_2 == 'Textarea') {
                trBody += '<td valign="top"><textarea id="Input2-' + item.ChecklistQuestion_GUID + '" class="formElement materialize-textarea" elementType="textarea" rows="5" cols="20"></textarea><label for="Input2-' + item.ChecklistQuestion_GUID + '"></label></td>';
            }
			
            if(item.InputType_3 == 'Textbox') {
                trBody += '<td valign="top"><input type="text" id="Input3-' + item.ChecklistQuestion_GUID + '" class="formElement" elementType="textbox" /><label for="Input3-' + item.ChecklistQuestion_GUID + '"></label></td>';
            }
			else if(item.InputType_3 == 'Radio') {
                trBody += '<td valign="top"><input type="radio" class="btn-radio formElement" elementType="radiogroup" id="Answer3a-' + item.ChecklistQuestion_GUID + '" name="Answer3-' + item.ChecklistQuestion_GUID + '" value="1"><label for="Answer3a-' + item.ChecklistQuestion_GUID + '"></label></td><td valign="top"><input type="radio" class="btn-radio formElement" elementType="radiogroup" id="Answer3b-' + item.ChecklistQuestion_GUID + '" name="Answer3-' + item.ChecklistQuestion_GUID + '" value="0"><label for="Answer3b-' + item.ChecklistQuestion_GUID + '"></label></td>';
            }
			else if(item.InputType_3 == 'Checkbox') {
                trBody += '<td valign="top"><input type="checkbox" class="checkBoxes formElement" elementType="checkbox" id="Input3-' + item.ChecklistQuestion_GUID + '" /><label for="Input3-' + item.ChecklistQuestion_GUID + '"></label></td>';
            }
			else if(item.InputType_3 == 'Textarea') {
                trBody += '<td valign="top"><textarea id="Input3-' + item.ChecklistQuestion_GUID + '" class="formElement materialize-textarea" elementType="textarea" rows="5" cols="20"></textarea><label for="Input3-' + item.ChecklistQuestion_GUID + '"></td>';
            }
            if(item.IsCommentReqd == true) {
                trBody += '<td valign="top"><textarea id="Comments-' + item.ChecklistQuestion_GUID + '" class="formElement materialize-textarea" elementType="textarea" rows="2" cols="50"></textarea><label for="Comments-' + item.ChecklistQuestion_GUID + '"></td>';
            }

            trBody += '</tr>';

            $('#' + item.ChecklistGroup_GUID + ' tbody').append(trBody);
        }
		else {
            checkTables += '<table id="' + item.ChecklistGroup_GUID + '" class="checklist-table" ShiftDate="' + shiftDate + '">';
            checkTables += '<col width="50"><thead></thead><tbody></tbody></table>';

            $("#lineup_checklist_body").append(checkTables);

            trTitleHead += '<tr><th class="main-header" colspan="7">' + item.ChecklistGroupName + '</th></tr>';
            $('#' + item.ChecklistGroup_GUID + ' thead').append(trTitleHead);

            if (checklistName == 'Pre Op Mantenimiento') {
                trHead += '<tr><th></th><th></th><th colspan="2">' + languagePack.prelineup.startOfShift + '</th><th colspan="2">' + languagePack.prelineup.endOfShift + '</th><th></th></tr>';
            }

            trHead += '<tr><th>' + languagePack.common.num + '</th><th>' + languagePack.calendar.questionName + '</th>';
            if(item.InputType_1 == 'Radio') {
                trHead += '<th>' + languagePack.common.yes + '</th><th>' + languagePack.common.no + '</th>';
            }
			else if(item.InputType_1 == 'Textbox') {
                if(item.ChecklistGroupName == 'Explosivo') {
                    trHead += '<th>' + languagePack.planning.plan + '</th>'
                }
				else if(item.ChecklistGroupName === 'Actividades de Revisión e Inspección' || 'Presión de Trabajo') {
                    trHead += '<th>' + languagePack.prelineup.startOfShift + '</th>'
                }
				else if(item.ChecklistGroupName == 'Actividad Básica') {
                    trHead += '<th>' + languagePack.prelineup.activitiesPerformed + '</th>'
                }
				else {
                    trHead += '<th>Campo</th>';
                }
            }
			else if(item.InputType_1 == 'Checkbox') {
                if(item.ChecklistGroupName == 'Actividades') {
                    trHead += '<th>' + languagePack.planning.plan + '</th>'
                }
				else {
                    trHead += '<th>' + languagePack.common.checkbox + '</th>';
                }
            }
			else if(item.InputType_1 == 'Textarea') {
                if(item.ChecklistGroupName == 'Analisis Seguro del Trabajo') {
                    trHead += '<th>' + languagePack.prelineup.response + '</th>'
                }
				else {
                    trHead += '<th>' + languagePack.common.textarea + '</th>';
                }
            }
            if(item.InputType_2 == 'Radio') {
                trHead += '<th>' + languagePack.common.yes + '</th><th>' + languagePack.common.no + '</th>';
            }
			else if(item.InputType_2 == 'Textbox') {
                if(item.ChecklistGroupName == 'Explosivo') {
                    trHead += '<th>' + languagePack.prelineup.real + '</th>';
                }
				else if(item.ChecklistGroupName === 'Actividades de Revisión e Inspección' || 'Presión de Trabajo') {
                    trHead += '<th>' + languagePack.prelineup.endOfShift + '</th>'
                }
				else if(item.ChecklistGroupName == 'Actividad Básica') {
                    trHead += '<th>' + languagePack.prelineup.activitiesNotPerformed + '</th>'
                }
				else {
                    trHead += '<th>' + languagePack.common.field + '</th>';
                }
            }
			else if(item.InputType_2 == 'Checkbox') {
                trHead += '<th>' + languagePack.common.checkbox + '</th>';
            }
			else if(item.InputType_2 == 'Textarea') {
                if(item.ChecklistGroupName == 'Analisis Seguro del Trabajo') {
                    trHead += '<th>Riesgos asociados a cada paso</th>'
                }
				else {
                    trHead += '<th>' + languagePack.common.textarea + '</th>';
                }
            }
            if(item.InputType_3 == 'Radio') {
                trHead += '<th>' + languagePack.common.yes + '</th><th>' + languagePack.common.no + '</th>';
            }
			else if(item.InputType_3 == 'Textbox') {
                if(item.ChecklistGroupName === 'Explosivo') {
                    trHead += '<th>' + languagePack.prelineup.surplus + '</th>';
                }
				else {
                    trHead += '<th>' + languagePack.common.field + '</th>';
                }
            }
			else if(item.InputType_3 == 'Checkbox') {
                trHead += '<th>' + languagePack.common.checkbox + '</th>';
            }
			else if(item.InputType_3 == 'Textarea') {
                if(item.ChecklistGroupName == 'Analisis Seguro del Trabajo') {
                    trHead += '<th>' + languagePack.prelineup.measurePerStep + '</th>'
                }
				else {
                    trHead += '<th>' + languagePack.common.textarea + '</th>';
                }
            }
            if(item.IsCommentReqd == true) {
                trHead += '<th>' + languagePack.common.comments + '</th>';
            }
            trHead += '</tr>';
            $('#' + item.ChecklistGroup_GUID + ' thead').append(trHead);

            trBody += '<tr class="checkrow" checklistquestion="' + item.ChecklistQuestion_GUID + '" checkrequired="' + item.isManadatory + '"><td>' + num + '</td><td>' + item.Question_Name + '</td>';

            if(item.InputType_1 == 'Radio') {
                trBody += '<td valign="top"><input type="radio" class="btn-radio formElement" elementType="radiogroup" id="Answer1a-' + item.ChecklistQuestion_GUID + '" name="Answer1-' + item.ChecklistQuestion_GUID + '" value="1"><label for="Answer1a-' + item.ChecklistQuestion_GUID + '"></label></td><td valign="top"><input type="radio" class="btn-radio formElement" elementType="radiogroup" id="Answer1b-' + item.ChecklistQuestion_GUID + '" name="Answer1-' + item.ChecklistQuestion_GUID + '" value="0"><label for="Answer1b-' + item.ChecklistQuestion_GUID + '"></label></td>';
            }
			else if(item.InputType_1 == 'Textbox') {
                trBody += '<td valign="top"><input type="text" class="formElement" elementType="textbox" id="Input-' + item.ChecklistQuestion_GUID + '" /><label for="Input-' + item.ChecklistQuestion_GUID + '"></label></td>';
            }
			else if(item.InputType_1 == 'Checkbox') {
                trBody += '<td valign="top"><input type="checkbox" class="checkBoxes formElement" elementType="checkbox" id="Input-' + item.ChecklistQuestion_GUID + '" /><label for="Input-' + item.ChecklistQuestion_GUID + '"></label></td>';
            }
			else if(item.InputType_1 == 'Textarea') {
                trBody += '<td valign="top" style="75%"><textarea id="Input-' + item.ChecklistQuestion_GUID + '" class="formElement materialize-textarea" elementType="textarea" rows="5" cols="20"></textarea><label for="Input-' + item.ChecklistQuestion_GUID + '"></td>';
            }
            if(item.InputType_2 == 'Textbox') {
                trBody += '<td valign="top"><input type="text" class="formElement" elementType="textbox" id="Input2-' + item.ChecklistQuestion_GUID + '" /><label for="Input2-' + item.ChecklistQuestion_GUID + '"></label></td>';
            }
			else if(item.InputType_2 == 'Radio') {
                trBody += '<td valign="top"><input type="radio" class="btn-radio formElement" elementType="radiogroup" id="Answer2a-' + item.ChecklistQuestion_GUID + '" name="Answer2-' + item.ChecklistQuestion_GUID + '" value="1"><label for="Answer2a-' + item.ChecklistQuestion_GUID + '"></label></td><td valign="top"><input type="radio" class="btn-radio formElement" elementType="radiogroup" id="Answer2b-' + item.ChecklistQuestion_GUID + '" name="Answer2-' + item.ChecklistQuestion_GUID + '" value="0"><label for="Answer2b-' + item.ChecklistQuestion_GUID + '"></label></td>';
            }
			else if(item.InputType_2 == 'Checkbox') {
                trBody += '<td valign="top"><input type="checkbox" class="checkBoxes formElement" elementType="checkbox" id="Input2-' + item.ChecklistQuestion_GUID + '" /><label for="Input2-' + item.ChecklistQuestion_GUID + '"></label></td>';
            }
			else if(item.InputType_2 == 'Textarea') {
                trBody += '<td valign="top"><textarea id="Input2-' + item.ChecklistQuestion_GUID + '" class="formElement materialize-textarea" elementType="textarea" rows="5" cols="20"></textarea><label for="Input2-' + item.ChecklistQuestion_GUID + '"></td>';
            }
            if(item.InputType_3 == 'Textbox') {
                trBody += '<td valign="top"><input type="text" class="formElement" elementType="textbox" id="Input3-' + item.ChecklistQuestion_GUID + '" /><label for="Input3-' + item.ChecklistQuestion_GUID + '"></label></td>';
            }
			else if(item.InputType_3 == 'Radio') {
                trBody += '<td valign="top"><input type="radio" class="btn-radio formElement" elementType="radiogroup" id="Answer3a-' + item.ChecklistQuestion_GUID + '" name="Answer3-' + item.ChecklistQuestion_GUID + '" value="1"><label for="Answer3a-' + item.ChecklistQuestion_GUID + '"></label></td><td valign="top"><input type="radio" class="btn-radio formElement" elementType="radiogroup" id="Answer3b-' + item.ChecklistQuestion_GUID + '" name="Answer3-' + item.ChecklistQuestion_GUID + '" value="0"><label for="Answer3b-' + item.ChecklistQuestion_GUID + '"></label></td>';
            }
			else if(item.InputType_3 == 'Checkbox') {
                trBody += '<td valign="top"><input type="checkbox" class="checkBoxes formElement" elementType="checkbox" id="Input3-' + item.ChecklistQuestion_GUID + '" /><label for="Input3-' + item.ChecklistQuestion_GUID + '"></label></td>';
            }
			else if(item.InputType_3 == 'Textarea') {
                trBody += '<td valign="top"><textarea id="Input3-' + item.ChecklistQuestion_GUID + '" class="formElement materialize-textarea" elementType="textarea" rows="5" cols="20"></textarea><label for="Input3-' + item.ChecklistQuestion_GUID + '"></td>';
            }
            if(item.IsCommentReqd == true) {
                trBody += '<td valign="top"><textarea id="Comments-' + item.ChecklistQuestion_GUID + '" class="formElement materialize-textarea" elementType="textarea" rows="2" cols="50"></textarea><label for="Comments-' + item.ChecklistQuestion_GUID + '"></td>';
            }

            trBody += '</tr>';
            $('#' + item.ChecklistGroup_GUID + ' tbody').append(trBody);
        }
    });
	
	for (var i = 0; i < planChecklistStatus.length; i++) {
        if ((planChecklistStatus[i].Lineup_GUID == lnup_planGUID) && (planChecklistStatus[i].ChecklistType_GUID == lnup_checklistType)) {

            var objectToSend = {};
            var dataObj = {};

            dataObj.receiver = "LoadPlanAnswerData";
            dataObj.query = "SELECT * FROM v_Plan_FormDetail WHERE Plan_GUID = '" + plan_GUID + "' AND ChecklistType_GUID = '" + lnup_checklistType + "' AND IsActive = '1'";
            dataObj.url = ruIP + ruPort + planningDB + planningEN + "read/dbo/v_Plan_FormDetail?where=\"Plan_GUID = '" + plan_GUID + "' AND ChecklistType_GUID = '" + lnup_checklistType + "' AND IsActive = '1'\"";
            dataObj.param1 = "wait";
            dataObj.param2 = "na";
            dataObj.param3 = "na";
            dataObj.param4 = "na";
            dataObj.param5 = "na";
            dataObj.param6 = "na";
            dataObj.param7 = "na";
            dataObj.param8 = "na";

            objectToSend.Type = "Request";
            objectToSend.requestType = "tableData";
            objectToSend.data = dataObj;

            SendForRequestInfo(objectToSend, true);
        }
    }

	(waitForRequestCount <= 0 && !submissionRequest) ? getDataForInjection() : false;
}

function checklist_insert_with_data(data, checklistGUID, checklistName, pGUID, shiftDate, MachineTypeGUIDS, MachineGUIDS, Machines, LineupStepGUIDS) {
    var MachineTypeArr = MachineTypeGUIDS.split("_");
    var machineGuidArr = MachineGUIDS.split("_");
    var machineArr = Machines.split("_");
    var lineupStepGuidArr = LineupStepGUIDS.split("_");

    lnup_dataQ = data
    lnup_checklistType = checklistGUID;
    lnup_checkEdit = false;

    var commonFieldsGroup = '';

    if (checklistName == locationConditions) {
        commonFieldsGroup += '<table id="checklist_table" class="checklist-table" ShiftDate="' + shiftDate + '"><col width="50">';
        commonFieldsGroup += '<thead>';
        commonFieldsGroup += '<tr><th class="main-header" colspan="4">' + languagePack.common.commonFields + '</th></tr>';
        commonFieldsGroup += '</thead>';
        commonFieldsGroup += '<tr class="operatorTimes" LineupGUID="' + lnup_planGUID + '"><td valign="top" style="width:25%; text-align:left">' + languagePack.prelineup.operatorTimeIn + '</td><td valign="top" style="width:25%; text-align:center"><input class="preLineupDate operatorTimeIn formElement" type="text" id="operator_time_in" elementType="date" /><label for="operator_time_in"></label></td><td valign="top" style="width:25%; text-align:left">' + languagePack.prelineup.operatorTimeOut + '</td><td valign="top" style="width:25%; text-align:center"><input class="preLineupDate operatorTimeOut formElement" type="text" id="operator_time_out" elementType="date" /><label for="operator_time_out"></label></td></tr>';

        for (var key in machineGuidArr) {
            commonFieldsGroup += '<tr class="machineLocations" LineupStepGUID="' + lineupStepGuidArr[key] + '"><td valign="top" style="width:25%; text-align:left">' + languagePack.prelineup.endShiftLocation + ' - ' + machineArr[key] + '</td><td valign="top" style="width:25%; text-align:center"><select class="machineBeginLocation formElement" id="machine_begin_location_' + machineGuidArr[key] + '" elementType="select"></select></td><td valign="top" style="width:25%; text-align:left">' + languagePack.prelineup.endShiftLocation + ' - ' + machineArr[key] + '</td><td valign="top" style="width:25%; text-align:center"><select class="machineEndLocation formElement" id="machine_end_location_' + machineGuidArr[key] + '" elementType="select"></select></td></tr>';
        }

        commonFieldsGroup += '</table>';

        $("#lineup_checklist_body").append(commonFieldsGroup);

        $(".preLineupDate").datetimepicker({
            timepicker: true,
            hours12: false,
            format: 'm/d/Y H:i',
            mask: true
        });

        $(".machineBeginLocation").each(function() {
            var thisId = $(this).attr("id");
            $(this).html("<option value='0'>" + languagePack.common.selectOption + "</option>");

            var machBeginLoc = document.getElementById(thisId);

            for (var key in preLineupMachineLocations) {
                machBeginLoc.options[machBeginLoc.options.length] = new Option(preLineupMachineLocations[key].DisplayName, preLineupMachineLocations[key].Location_GUID);
            }

            $(this).material_select();
        });

        $(".machineEndLocation").each(function() {
            var thisId = $(this).attr("id");
            $(this).html("<option value='0'>" + languagePack.common.selectOption + "</option>");

            var machBeginLoc = document.getElementById(thisId);

            for (var key in preLineupMachineLocations) {
                machBeginLoc.options[machBeginLoc.options.length] = new Option(preLineupMachineLocations[key].DisplayName, preLineupMachineLocations[key].Location_GUID);
            }

            $(this).material_select();
        });

        var objectToSend = {};
        var dataObj = {};

        dataObj.receiver = "LoadLineups";
        dataObj.query = "SELECT * FROM Lineup WHERE Lineup_GUID = '" + lnup_planGUID + "'";
        dataObj.url = ruIP + ruPort + planningDB + planningEN + "read/trans/Lineup?where=\"Lineup_GUID = '" + lnup_planGUID + "'\"";
        dataObj.param1 = "wait";
        dataObj.param2 = "na";
        dataObj.param3 = "na";
        dataObj.param4 = "na";
        dataObj.param5 = "na";
        dataObj.param6 = "na";
        dataObj.param7 = "na";
        dataObj.param8 = "na";

        objectToSend.Type = "Request";
        objectToSend.requestType = "tableData";
        objectToSend.data = dataObj;

        SendForRequestInfo(objectToSend, true);

        var objectToSend = {};
        var dataObj = {};

        dataObj.receiver = "LoadLineupSteps";
        dataObj.query = "SELECT * FROM Lineup_StepDetail WHERE Lineup_GUID = '" + lnup_planGUID + "'";
        dataObj.url = ruIP + ruPort + planningDB + planningEN + "read/trans/Lineup_StepDetail?where=\"Lineup_GUID = '" + lnup_planGUID + "'\"";
        dataObj.param1 = "wait";
        dataObj.param2 = "na";
        dataObj.param3 = "na";
        dataObj.param4 = "na";
        dataObj.param5 = "na";
        dataObj.param6 = "na";
        dataObj.param7 = "na";
        dataObj.param8 = "na";

        objectToSend.Type = "Request";
        objectToSend.requestType = "tableData";
        objectToSend.data = dataObj;

        SendForRequestInfo(objectToSend, true);
    }

    $.each(lnup_dataQ, function(i, item) {
        var checkTables = '';
        var trTitleHead = '';
        var trHead = '';
        var trBody = '';
        var num = i + 1;

        if ($("#" + item.ChecklistGroup_GUID).length) {
            trBody += '<tr class="checkrow" checklistquestion="' + item.ChecklistQuestion_GUID + '"><td>' + num + '</td><td>' + item.Question_Name + '</td>';

            if(item.InputType_1 == 'Radio') {
                trBody += '<td valign="top"><input type="radio" class="btn-radio formElement" elementType="radiogroup" id="Answer1a-' + item.ChecklistQuestion_GUID + '" name="Answer1-' + item.ChecklistQuestion_GUID + '" value="1" /><label for="Answer1a-' + item.ChecklistQuestion_GUID + '"></label></td><td valign="top"><input type="radio" class="btn-radio formElement" elementType="radiogroup" id="Answer1b-' + item.ChecklistQuestion_GUID + '" name="Answer1-' + item.ChecklistQuestion_GUID + '" value="0" /><label for="Answer1b-' + item.ChecklistQuestion_GUID + '"></label></td>';
            }
			else if(item.InputType_1 == 'Textbox') {
                trBody += '<td valign="top"><input type="text" id="Input-' + item.ChecklistQuestion_GUID + '" class="formElement" elementType="textbox" /><label for="Input-' + item.ChecklistQuestion_GUID + '"></label></td>';
            }
			else if(item.InputType_1 == 'Checkbox') {
                trBody += '<td valign="top"><input type="checkbox" class="checkBoxes formElement" elementType="checkbox" id="Input-' + item.ChecklistQuestion_GUID + '" /><label for="Input-' + item.ChecklistQuestion_GUID + '"></label></td>';
            }
			else if(item.InputType_1 == 'Textarea') {
                trBody += '<td valign="top" style="width:75%"><textarea id="Input-' + item.ChecklistQuestion_GUID + '" class="formElement materialize-textarea" elementType="textarea" rows="5" cols="20"></textarea><label for="Input-' + item.ChecklistQuestion_GUID + '"></label></td>';
            }
			
            if(item.InputType_2 == 'Textbox') {
                trBody += '<td valign="top"><input type="text" id="Input2-' + item.ChecklistQuestion_GUID + '"  class="formElement" elementType="textbox" /><label for="Input2-' + item.ChecklistQuestion_GUID + '"></label></td>';
            }
			else if(item.InputType_2 == 'Radio') {
                trBody += '<td valign="top"><input type="radio" class="btn-radio formElement" elementType="radiogroup" id="Answer2a-' + item.ChecklistQuestion_GUID + '" name="Answer2-' + item.ChecklistQuestion_GUID + '" value="1" /><label for="Answer2a-' + item.ChecklistQuestion_GUID + '"></label></td><td valign="top"><input type="radio" class="btn-radio formElement" elementType="radiogroup" id="Answer2b-' + item.ChecklistQuestion_GUID + '" name="Answer2-' + item.ChecklistQuestion_GUID + '" value="0" /><label for="Answer2b-' + item.ChecklistQuestion_GUID + '"></label></td>';
            }
			else if(item.InputType_2 == 'Checkbox') {
                trBody += '<td valign="top"><input type="checkbox" class="checkBoxes formElement" elementType="checkbox" id="Input2-' + item.ChecklistQuestion_GUID + '" /><label for="Input2-' + item.ChecklistQuestion_GUID + '"></label></td>';
            }
			else if(item.InputType_2 == 'Textarea') {
                trBody += '<td valign="top"><textarea id="Input2-' + item.ChecklistQuestion_GUID + '" class="formElement materialize-textarea" elementType="textarea" rows="5" cols="20"></textarea><label for="Input2-' + item.ChecklistQuestion_GUID + '"></label></td>';
            }
			
            if(item.InputType_3 == 'Textbox') {
                trBody += '<td valign="top"><input type="text" id="Input3-' + item.ChecklistQuestion_GUID + '" class="formElement" elementType="textbox" /><label for="Input3-' + item.ChecklistQuestion_GUID + '"></label></td>';
            }
			else if(item.InputType_3 == 'Radio') {
                trBody += '<td valign="top"><input type="radio" class="btn-radio formElement" elementType="radiogroup" id="Answer3a-' + item.ChecklistQuestion_GUID + '" name="Answer3-' + item.ChecklistQuestion_GUID + '" value="1"><label for="Answer3a-' + item.ChecklistQuestion_GUID + '"></label></td><td valign="top"><input type="radio" class="btn-radio formElement" elementType="radiogroup" id="Answer3b-' + item.ChecklistQuestion_GUID + '" name="Answer3-' + item.ChecklistQuestion_GUID + '" value="0"><label for="Answer3b-' + item.ChecklistQuestion_GUID + '"></label></td>';
            }
			else if(item.InputType_3 == 'Checkbox') {
                trBody += '<td valign="top"><input type="checkbox" class="checkBoxes formElement" elementType="checkbox" id="Input3-' + item.ChecklistQuestion_GUID + '" /><label for="Input3-' + item.ChecklistQuestion_GUID + '"></label></td>';
            }
			else if(item.InputType_3 == 'Textarea') {
                trBody += '<td valign="top"><textarea id="Input3-' + item.ChecklistQuestion_GUID + '" class="formElement materialize-textarea" elementType="textarea" rows="5" cols="20"></textarea><label for="Input3-' + item.ChecklistQuestion_GUID + '"></td>';
            }
            if(item.IsCommentReqd == true) {
                trBody += '<td valign="top"><textarea id="Comments-' + item.ChecklistQuestion_GUID + '" class="formElement materialize-textarea" elementType="textarea" rows="2" cols="50"></textarea><label for="Comments-' + item.ChecklistQuestion_GUID + '"></td>';
            }

            trBody += '</tr>';

            $('#' + item.ChecklistGroup_GUID + ' tbody').append(trBody);
        }
		else {
            checkTables += '<table id="' + item.ChecklistGroup_GUID + '" class="checklist-table" ShiftDate="' + shiftDate + '">';
            checkTables += '<col width="50"><thead></thead><tbody></tbody></table>';

            $("#lineup_checklist_body").append(checkTables);

            trTitleHead += '<tr><th class="main-header" colspan="7">' + item.ChecklistGroupName + '</th></tr>';
            $('#' + item.ChecklistGroup_GUID + ' thead').append(trTitleHead);

            if (checklistName == 'Pre Op Mantenimiento') {
                trHead += '<tr><th></th><th></th><th colspan="2">' + languagePack.prelineup.startOfShift + '</th><th colspan="2">' + languagePack.prelineup.endOfShift + '</th><th></th></tr>';
            }

            trHead += '<tr><th>' + languagePack.common.num + '</th><th>' + languagePack.calendar.questionName + '</th>';
            if(item.InputType_1 == 'Radio') {
                trHead += '<th>' + languagePack.common.yes + '</th><th>' + languagePack.common.no + '</th>';
            }
			else if(item.InputType_1 == 'Textbox') {
                if(item.ChecklistGroupName == 'Explosivo') {
                    trHead += '<th>' + languagePack.planning.plan + '</th>'
                }
				else if(item.ChecklistGroupName === 'Actividades de Revisión e Inspección' || 'Presión de Trabajo') {
                    trHead += '<th>' + languagePack.prelineup.startOfShift + '</th>'
                }
				else if(item.ChecklistGroupName == 'Actividad Básica') {
                    trHead += '<th>' + languagePack.prelineup.activitiesPerformed + '</th>'
                }
				else {
                    trHead += '<th>Campo</th>';
                }
            }
			else if(item.InputType_1 == 'Checkbox') {
                if(item.ChecklistGroupName == 'Actividades') {
                    trHead += '<th>' + languagePack.planning.plan + '</th>'
                }
				else {
                    trHead += '<th>' + languagePack.common.checkbox + '</th>';
                }
            }
			else if(item.InputType_1 == 'Textarea') {
                if(item.ChecklistGroupName == 'Analisis Seguro del Trabajo') {
                    trHead += '<th>' + languagePack.prelineup.response + '</th>'
                }
				else {
                    trHead += '<th>' + languagePack.common.textarea + '</th>';
                }
            }
            if(item.InputType_2 == 'Radio') {
                trHead += '<th>' + languagePack.common.yes + '</th><th>' + languagePack.common.no + '</th>';
            }
			else if(item.InputType_2 == 'Textbox') {
                if(item.ChecklistGroupName == 'Explosivo') {
                    trHead += '<th>' + languagePack.prelineup.real + '</th>';
                }
				else if(item.ChecklistGroupName === 'Actividades de Revisión e Inspección' || 'Presión de Trabajo') {
                    trHead += '<th>' + languagePack.prelineup.endOfShift + '</th>'
                }
				else if(item.ChecklistGroupName == 'Actividad Básica') {
                    trHead += '<th>' + languagePack.prelineup.activitiesNotPerformed + '</th>'
                }
				else {
                    trHead += '<th>' + languagePack.common.field + '</th>';
                }
            }
			else if(item.InputType_2 == 'Checkbox') {
                trHead += '<th>' + languagePack.common.checkbox + '</th>';
            }
			else if(item.InputType_2 == 'Textarea') {
                if(item.ChecklistGroupName == 'Analisis Seguro del Trabajo') {
                    trHead += '<th>Riesgos asociados a cada paso</th>'
                }
				else {
                    trHead += '<th>' + languagePack.common.textarea + '</th>';
                }
            }
            if(item.InputType_3 == 'Radio') {
                trHead += '<th>' + languagePack.common.yes + '</th><th>' + languagePack.common.no + '</th>';
            }
			else if(item.InputType_3 == 'Textbox') {
                if(item.ChecklistGroupName === 'Explosivo') {
                    trHead += '<th>' + languagePack.prelineup.surplus + '</th>';
                }
				else {
                    trHead += '<th>' + languagePack.common.field + '</th>';
                }
            }
			else if(item.InputType_3 == 'Checkbox') {
                trHead += '<th>' + languagePack.common.checkbox + '</th>';
            }
			else if(item.InputType_3 == 'Textarea') {
                if(item.ChecklistGroupName == 'Analisis Seguro del Trabajo') {
                    trHead += '<th>' + languagePack.prelineup.measurePerStep + '</th>'
                }
				else {
                    trHead += '<th>' + languagePack.common.textarea + '</th>';
                }
            }
            if(item.IsCommentReqd == true) {
                trHead += '<th>' + languagePack.common.comments + '</th>';
            }
            trHead += '</tr>';
            $('#' + item.ChecklistGroup_GUID + ' thead').append(trHead);

            trBody += '<tr class="checkrow" checklistquestion="' + item.ChecklistQuestion_GUID + '" checkrequired="' + item.isManadatory + '"><td>' + num + '</td><td>' + item.Question_Name + '</td>';

            if(item.InputType_1 == 'Radio') {
                trBody += '<td valign="top"><input type="radio" class="btn-radio formElement" elementType="radiogroup" id="Answer1a-' + item.ChecklistQuestion_GUID + '" name="Answer1-' + item.ChecklistQuestion_GUID + '" value="1"><label for="Answer1a-' + item.ChecklistQuestion_GUID + '"></label></td><td valign="top"><input type="radio" class="btn-radio formElement" elementType="radiogroup" id="Answer1b-' + item.ChecklistQuestion_GUID + '" name="Answer1-' + item.ChecklistQuestion_GUID + '" value="0"><label for="Answer1b-' + item.ChecklistQuestion_GUID + '"></label></td>';
            }
			else if(item.InputType_1 == 'Textbox') {
                trBody += '<td valign="top"><input type="text" class="formElement" elementType="textbox" id="Input-' + item.ChecklistQuestion_GUID + '" /><label for="Input-' + item.ChecklistQuestion_GUID + '"></label></td>';
            }
			else if(item.InputType_1 == 'Checkbox') {
                trBody += '<td valign="top"><input type="checkbox" class="checkBoxes formElement" elementType="checkbox" id="Input-' + item.ChecklistQuestion_GUID + '" /><label for="Input-' + item.ChecklistQuestion_GUID + '"></label></td>';
            }
			else if(item.InputType_1 == 'Textarea') {
                trBody += '<td valign="top" style="75%"><textarea id="Input-' + item.ChecklistQuestion_GUID + '" class="formElement materialize-textarea" elementType="textarea" rows="5" cols="20"></textarea><label for="Input-' + item.ChecklistQuestion_GUID + '"></td>';
            }
            if(item.InputType_2 == 'Textbox') {
                trBody += '<td valign="top"><input type="text" class="formElement" elementType="textbox" id="Input2-' + item.ChecklistQuestion_GUID + '" /><label for="Input2-' + item.ChecklistQuestion_GUID + '"></label></td>';
            }
			else if(item.InputType_2 == 'Radio') {
                trBody += '<td valign="top"><input type="radio" class="btn-radio formElement" elementType="radiogroup" id="Answer2a-' + item.ChecklistQuestion_GUID + '" name="Answer2-' + item.ChecklistQuestion_GUID + '" value="1"><label for="Answer2a-' + item.ChecklistQuestion_GUID + '"></label></td><td valign="top"><input type="radio" class="btn-radio formElement" elementType="radiogroup" id="Answer2b-' + item.ChecklistQuestion_GUID + '" name="Answer2-' + item.ChecklistQuestion_GUID + '" value="0"><label for="Answer2b-' + item.ChecklistQuestion_GUID + '"></label></td>';
            }
			else if(item.InputType_2 == 'Checkbox') {
                trBody += '<td valign="top"><input type="checkbox" class="checkBoxes formElement" elementType="checkbox" id="Input2-' + item.ChecklistQuestion_GUID + '" /><label for="Input2-' + item.ChecklistQuestion_GUID + '"></label></td>';
            }
			else if(item.InputType_2 == 'Textarea') {
                trBody += '<td valign="top"><textarea id="Input2-' + item.ChecklistQuestion_GUID + '" class="formElement materialize-textarea" elementType="textarea" rows="5" cols="20"></textarea><label for="Input2-' + item.ChecklistQuestion_GUID + '"></td>';
            }
            if(item.InputType_3 == 'Textbox') {
                trBody += '<td valign="top"><input type="text" class="formElement" elementType="textbox" id="Input3-' + item.ChecklistQuestion_GUID + '" /><label for="Input3-' + item.ChecklistQuestion_GUID + '"></label></td>';
            }
			else if(item.InputType_3 == 'Radio') {
                trBody += '<td valign="top"><input type="radio" class="btn-radio formElement" elementType="radiogroup" id="Answer3a-' + item.ChecklistQuestion_GUID + '" name="Answer3-' + item.ChecklistQuestion_GUID + '" value="1"><label for="Answer3a-' + item.ChecklistQuestion_GUID + '"></label></td><td valign="top"><input type="radio" class="btn-radio formElement" elementType="radiogroup" id="Answer3b-' + item.ChecklistQuestion_GUID + '" name="Answer3-' + item.ChecklistQuestion_GUID + '" value="0"><label for="Answer3b-' + item.ChecklistQuestion_GUID + '"></label></td>';
            }
			else if(item.InputType_3 == 'Checkbox') {
                trBody += '<td valign="top"><input type="checkbox" class="checkBoxes formElement" elementType="checkbox" id="Input3-' + item.ChecklistQuestion_GUID + '" /><label for="Input3-' + item.ChecklistQuestion_GUID + '"></label></td>';
            }
			else if(item.InputType_3 == 'Textarea') {
                trBody += '<td valign="top"><textarea id="Input3-' + item.ChecklistQuestion_GUID + '" class="formElement materialize-textarea" elementType="textarea" rows="5" cols="20"></textarea><label for="Input3-' + item.ChecklistQuestion_GUID + '"></td>';
            }
            if(item.IsCommentReqd == true) {
                trBody += '<td valign="top"><textarea id="Comments-' + item.ChecklistQuestion_GUID + '" class="formElement materialize-textarea" elementType="textarea" rows="2" cols="50"></textarea><label for="Comments-' + item.ChecklistQuestion_GUID + '"></td>';
            }

            trBody += '</tr>';
            $('#' + item.ChecklistGroup_GUID + ' tbody').append(trBody);
        }
    });
	
    if(checklistName == activitiesCheckList) {
        commonFieldsGroup += '<table class="checklist-table" ShiftDate="' + shiftDate + '"><col width="50">';
        commonFieldsGroup += '<thead>';
        commonFieldsGroup += '<tr><th class="main-header" colspan="2">' + languagePack.prelineup.locationStatus + '</th></tr>';
        commonFieldsGroup += '</thead>';
        commonFieldsGroup += '<tr class="LocationStatusRow" LineupGUID="' + lnup_planGUID + '"><td style="width:50%; text-align:left">' + languagePack.prelineup.endingLocationStatus + '</td><td style="width:50%; text-align:center"><select class="endingLocationStatus formElement" id="ending_location_status" elementType="select"></select></td></tr>';

        commonFieldsGroup += '</table>';

        commonFieldsGroup += '<table class="checklist-table" ShiftDate="' + shiftDate + '"><col width="50">';
        commonFieldsGroup += '<thead>';
        commonFieldsGroup += '<tr><th class="main-header" colspan="3">' + languagePack.prelineup.machineStatus + '</th></tr>';
        commonFieldsGroup += '</thead>';

        for (var key in machineGuidArr) {
            commonFieldsGroup += '<tr class="MachineStatusRow" MachineGUID="' + machineGuidArr[key] + '"><td style="width:30%" text-align:left">' + languagePack.prelineup.endingMachineStatus + '</td><td text-align:left">' + machineArr[key] + '</td><td text-align:center"><select class="endingMachineStatus formElement" id="ending_machine_status_' + key + '" elementType="select"></select></td></tr>';
        }

        commonFieldsGroup += '</table>';

        $("#lineup_checklist_body").append(commonFieldsGroup);

        var thisId = "ending_location_status";
        $("#ending_location_status").html("<option value='0'>" + languagePack.common.selectOption + "</option>");

        var locationStatuses = document.getElementById(thisId);

        for (var key in preLineupLocationStatuses) {
            locationStatuses.options[locationStatuses.options.length] = new Option(preLineupLocationStatuses[key].DisplayName, preLineupLocationStatuses[key].LocationStatus_GUID);
        }

        var machineGuidList = "(";

        for (var key in machineGuidArr) {
            var thisId = ("ending_machine_status_" + key);
            $("#ending_machine_status_" + key).html("<option value='0'>" + languagePack.common.selectOption + "</option>");

            var machineStatuses = document.getElementById(thisId);

            machineStatuses.options[machineStatuses.options.length] = new Option(languagePack.common.operating, 1);
            machineStatuses.options[machineStatuses.options.length] = new Option(languagePack.common.down, 2);

            machineGuidList += "'" + machineGuidArr[key] + "'";

            if (key < (machineGuidArr.length - 1)) {
                machineGuidList += ",";
            }

            $("#ending_machine_status_" + key).material_select();
        }

        $("#ending_location_status").material_select();

        machineGuidList += ")";

        var objectToSend = {};
        var dataObj = {};

        dataObj.receiver = "LoadLineupsWithLocationStatus";
        dataObj.query = "SELECT * FROM Lineup WHERE Lineup_GUID = '" + lnup_planGUID + "'";
        dataObj.url = ruIP + ruPort + planningDB + planningEN + "read/trans/Lineup?where=\"Lineup_GUID = '" + lnup_planGUID + "'\"";
        dataObj.param1 = "wait";
        dataObj.param2 = "na";
        dataObj.param3 = "na";
        dataObj.param4 = "na";
        dataObj.param5 = "na";
        dataObj.param6 = "na";
        dataObj.param7 = "na";
        dataObj.param8 = "na";

        objectToSend.Type = "Request";
        objectToSend.requestType = "tableData";
        objectToSend.data = dataObj;

        SendForRequestInfo(objectToSend, true);

        var objectToSend = {};
        var dataObj = {};

        dataObj.receiver = "LoadMachines";
        dataObj.query = "SELECT * FROM Machine WHERE Machine_GUID IN " + machineGuidList + "";
        dataObj.url = ruIP + ruPort + planningDB + planningEN + "read/eqmt/Machine?where=\"Machine_GUID IN " + machineGuidList + "\"";
        dataObj.param1 = "wait";
        dataObj.param2 = "na";
        dataObj.param3 = "na";
        dataObj.param4 = "na";
        dataObj.param5 = "na";
        dataObj.param6 = "na";
        dataObj.param7 = "na";
        dataObj.param8 = "na";

        objectToSend.Type = "Request";
        objectToSend.requestType = "tableData";
        objectToSend.data = dataObj;

        SendForRequestInfo(objectToSend, true);
    }

    if(checklistName == machineDetails) {

        var jumboExists = false;
        var displayString = 'style="display:none"';

        if (!(MachineTypeArr.indexOf(jumboMachineTypesGuid) == -1 && MachineTypeArr.indexOf(simbaMachineTypesGuid) == -1)) {
            jumboExists = true;
            displayString = '';
        }
		
		commonFieldsGroup	+=	'<div class="gauges-table">';
		
		for (var key in machineGuidArr) {
			commonFieldsGroup += '<div class="machineDetailsRow row" id="machine_details_row_' + key + '" LineupGUID="' + lnup_planGUID + '" MachineGUID="' + machineGuidArr[key] + '" ShiftDate="' + shiftDate + '">' +

									'<div class="gauge-td col s12 m6 l4" style="margin-bottom:40px;">' +
										'<div class="row">' +
											'<div class="col s12">' + languagePack.prelineup.hydraulicOil + '</div>' +
											'<div class="col s12">' + languagePack.common.startOfShift + '</div>' +
										'</div>' +
										'<div class="gaugeWidget" id="gaugeWidget1_' + key + '">' +
											'<div id="start_shift_hydraulic_gauge_' + key + '" style="margin-left:24px" class="formElement" elementType="gauge"></div>' +
											'<div id="start_shift_hydraulic_slider_' + key + '" class="formElement" elementType="slider"></div>' +
										'</div>' +
									'</div>' +
									
									'<div class="gauge-td col s12 m6 l4" style="margin-bottom:40px;">' +
										'<div class="row">' +
											'<div class="col s12">' + languagePack.prelineup.hydraulicOil + '</div>' +
											'<div class="col s12">' + languagePack.common.endOfShift + '</div>' +
										'</div>' +
										'<div class="gaugeWidget" id="gaugeWidget2_' + key + '">' +
											'<div id="end_shift_hydraulic_gauge_' + key + '" style="margin-left:24px" class="formElement" elementType="gauge"></div>' +
											'<div id="end_shift_hydraulic_slider_' + key + '" class="formElement" elementType="slider"></div>' +
										'</div>' +
									'</div>' +
									
									'<div class="gauge-td col s12 m6 l4 lmargin" style="margin-bottom:40px;">' +
										'<div class="row">' +
											'<div class="col s12">' + languagePack.prelineup.fuelLevel + '</div>' +
										'</div>' +
										'<div class="gaugeWidget" id="gaugeWidget3_' + key + '">' +
											'<div id="fuel_gauge_' + key + '" class="formElement" elementType="gauge"></div>' +
											'<div id="fuel_slider_' + key + '" class="formElement" elementType="slider"></div>' +
										'</div>' +
									'</div>' +
									
									'<div class="gauge-td col s12 m6 l4" ' + displayString + '>' +
										'<div class="row">' +
											'<div class="col s12">' + languagePack.prelineup.electricalSource + '</div>' +
										'</div>' +
										'<div class="gaugeWidget" id="gaugeWidget4_' + key + '">' +
											'<div id="electric_source_distance_gauge_' + key + '" style="margin-left:24px" class="formElement" elementType="gauge"></div>' +
											'<div id="electric_source_distance_slider_' + key + '" class="formElement" elementType="slider"></div>' +
									'</div>' +
								'</div>';
		}
		
		commonFieldsGroup += '</div>';

        $("#lineup_checklist_body").append(commonFieldsGroup);

        for (var i = 0; i < machineGuidArr.length; i++) {
            InitializeGauges(i);
        }

        setTimeout(function() {
            $(".gauges-table td").css({
                "padding": "0px"
            });
        }, 500);

        var objectToSend = {};
        var dataObj = {};

        dataObj.receiver = "LoadMachineDetails";
        dataObj.query = "SELECT * FROM Lineup_MachineDetail WHERE Lineup_GUID = '" + lnup_planGUID + "'";
        dataObj.url = ruIP + ruPort + planningDB + planningEN + "read/trans/Lineup_MachineDetail?where=\"Lineup_GUID = '" + lnup_planGUID + "'\"";
        dataObj.param1 = "wait";
        dataObj.param2 = "na";
        dataObj.param3 = "na";
        dataObj.param4 = "na";
        dataObj.param5 = "na";
        dataObj.param6 = "na";
        dataObj.param7 = "na";
        dataObj.param8 = "na";

        objectToSend.Type = "Request";
        objectToSend.requestType = "tableData";
        objectToSend.data = dataObj;

        SendForRequestInfo(objectToSend, true);
    }

    for (var i = 0; i < lnup_statusData.length; i++) {
        if ((lnup_statusData[i].Lineup_GUID == lnup_planGUID) && (lnup_statusData[i].ChecklistType_GUID == lnup_checklistType)) {

            var objectToSend = {};
            var dataObj = {};

            dataObj.receiver = "LoadLineupAnswerData";
            dataObj.query = "SELECT * FROM v_Lineup_FormDetail WHERE Lineup_GUID = '" + lnup_planGUID + "' AND ChecklistType_GUID = '" + lnup_checklistType + "' AND IsActive = '1'";
            dataObj.url = ruIP + ruPort + planningDB + planningEN + "read/dbo/v_Lineup_FormDetail?where=\"Lineup_GUID = '" + lnup_planGUID + "' AND ChecklistType_GUID = '" + lnup_checklistType + "' AND IsActive = '1'\"";
            dataObj.param1 = "wait";
            dataObj.param2 = "na";
            dataObj.param3 = "na";
            dataObj.param4 = "na";
            dataObj.param5 = "na";
            dataObj.param6 = "na";
            dataObj.param7 = "na";
            dataObj.param8 = "na";

            objectToSend.Type = "Request";
            objectToSend.requestType = "tableData";
            objectToSend.data = dataObj;

            SendForRequestInfo(objectToSend, true);
        }
    }

	(waitForRequestCount <= 0 && !submissionRequest) ? getDataForInjection() : false;
}

function LoadLineups(data) {
    var lineups;

    if (data.length > 0) {
        lineups = data;
        (lineups[0].OperatorTimeArrival) ? $("#operator_time_in").val(moment(lineups[0].OperatorTimeArrival.split("Z")[0]).format("MM/DD/YYYY HH:mm")) : false;
        (lineups[0].OperatorTimeLeft) ? $("#operator_time_out").val(moment(lineups[0].OperatorTimeLeft.split("Z")[0]).format("MM/DD/YYYY HH:mm")) : false;
    }

	(waitForRequestCount <= 0) ? getDataForInjection() : false;
}

function LoadLineupSteps(data) {
    var lineupSteps = data;

    for (var key in lineupSteps) {
        if(lineupSteps[key].BeginShift_MachLocation) {
            $("#machine_begin_location_" + lineupSteps[key].Machine_GUID).val(lineupSteps[key].BeginShift_MachLocation);
			$("#machine_begin_location_" + lineupSteps[key].Machine_GUID).material_select();
        }
        if(lineupSteps[key].EndShift_MachLocation) {
            $("#machine_end_location_" + lineupSteps[key].Machine_GUID).val(lineupSteps[key].EndShift_MachLocation);			
			$("#machine_end_location_" + lineupSteps[key].Machine_GUID).material_select();
        }
    }

	(waitForRequestCount <= 0) ? getDataForInjection() : false;
}

function LoadLineupsWithLocationStatus(data) {
    var lineups = data;

    for (var key in lineups) {
        if(lineups[key].EndLocationStatus_GUID) {
            $("#ending_location_status").val(lineups[key].EndLocationStatus_GUID);
            $("#ending_location_status").material_select();
        }
    }
	
	(waitForRequestCount <= 0) ? getDataForInjection() : false;
}

function LoadMachines(data) {
    var machines = data;

    for (var key in machines) {
		switch(machines[key].MachineStatus.toUpperCase()) {
			case "OPERATIVO":
				$("#ending_machine_status_" + key).val(1);
				break;
				
			case "FUERASER":
				$("#ending_machine_status_" + key).val(2);
				break;
				
			default:
				$("#ending_machine_status_" + key).val(1);
		}
        $("#ending_machine_status_" + key).material_select();
    }

	(waitForRequestCount <= 0) ? getDataForInjection() : false;
}

function LoadMachineDetails(data) {
    var lineups = data;

    for (var key in lineups) {
        (lineups[key].Lineup_MachineDetail_GUID) ? $("#machine_details_row_" + key).attr("LineupMachineDetailGUID", lineups[key].Lineup_MachineDetail_GUID) : false;
		
        if(lineups[key].Begin_Hydraulic_Level) {
            $("#start_shift_hydraulic_gauge_" + key).val(lineups[key].Begin_Hydraulic_Level);
            $("#start_shift_hydraulic_slider_" + key).val(lineups[key].Begin_Hydraulic_Level);
        }
        if(lineups[key].End_Hydraulic_Level) {
            $("#end_shift_hydraulic_gauge_" + key).val(lineups[key].End_Hydraulic_Level);
            $("#end_shift_hydraulic_slider_" + key).val(lineups[key].End_Hydraulic_Level);
        }
        if(lineups[key].Begin_Hydraulic_Level) {
            $("#fuel_gauge_" + key).val(lineups[key].End_Fuel_Level);
            $("#fuel_slider_" + key).val(lineups[key].End_Fuel_Level);
        }
        if(lineups[key].Begin_Hydraulic_Level) {
            $("#electric_source_distance_gauge_" + key).val(lineups[key].End_Electrical_Distance);
            $("#electric_source_distance_slider_" + key).val(lineups[key].End_Electrical_Distance);
        }
    }

	(waitForRequestCount <= 0) ? getDataForInjection() : false;
}

function LoadPlanAnswerData(data) {
    lnup_answerdata = data;
    $.each(lnup_answerdata, function(i, item) {
		
		switch(item.InputType_1) {
			case "Radio":
				$('input[name="Answer1-' + item.ChecklistQuestion_GUID + '"]').val([item.Value_1]);
				break;
				
			case "Textbox":
				$('#Input-' + item.ChecklistQuestion_GUID).val(item.Value_1);
				break;
				
			case "Checkbox":
				$('#Input-' + item.ChecklistQuestion_GUID).prop('checked', (item.Value_1 == 1) ? true : false);
				break;
			
			case "Textarea":
				$('#Input-' + item.ChecklistQuestion_GUID).val(item.Value_1);
				break;
        }

        switch(item.InputType_2) {
			case "Radio":
				$('input[name="Answer2-' + item.ChecklistQuestion_GUID + '"]').val([item.Value_2]);
				break;
			
			case "Textbox":
				$('#Input2-' + item.ChecklistQuestion_GUID).val(item.Value_2);
				break;
				
			case "Checkbox":
				$('#Input2-' + item.ChecklistQuestion_GUID).prop('checked', (item.Value_2 == 1) ? true : false);
				break;
				
			case "Textarea":
				$('#Input2-' + item.ChecklistQuestion_GUID).val(item.Value_2);
				break;
        }

         switch(item.InputType_3) {
			case "Radio":
				$('input[name="Answer3-' + item.ChecklistQuestion_GUID + '"]').val([item.Value_3]);
				break;
				
			case "Textbox":
				$('#Input3-' + item.ChecklistQuestion_GUID).val(item.Value_3);
				break;
				
			case "Checkbox":
				$('#Input3-' + item.ChecklistQuestion_GUID).prop('checked', (item.Value_3 == 1) ? true : false);
				break;
				
			case "Textarea":
				$('#Input3-' + item.ChecklistQuestion_GUID).val(item.Value_3);
				break;
        }
		
        (item.Comment) ? $('#Comments-' + item.ChecklistQuestion_GUID).val(item.Comment) :false;
    });
    lnup_checkEdit = true;

	(waitForRequestCount <= 0) ? getDataForInjection() : false;
}

function LoadLineupAnswerData(data) {
    lnup_answerdata = data;
    $.each(lnup_answerdata, function(i, item) {
		
		switch(item.InputType_1) {
			case "Radio":
				$('input[name="Answer1-' + item.ChecklistQuestion_GUID + '"]').val([item.Value_1]);
				break;
				
			case "Textbox":
				$('#Input-' + item.ChecklistQuestion_GUID).val(item.Value_1);
				break;
				
			case "Checkbox":
				$('#Input-' + item.ChecklistQuestion_GUID).prop('checked', (item.Value_1 == 1) ? true : false);
				break;
			
			case "Textarea":
				$('#Input-' + item.ChecklistQuestion_GUID).val(item.Value_1);
				break;
        }

        switch(item.InputType_2) {
			case "Radio":
				$('input[name="Answer2-' + item.ChecklistQuestion_GUID + '"]').val([item.Value_2]);
				break;
			
			case "Textbox":
				$('#Input2-' + item.ChecklistQuestion_GUID).val(item.Value_2);
				break;
				
			case "Checkbox":
				$('#Input2-' + item.ChecklistQuestion_GUID).prop('checked', (item.Value_2 == 1) ? true : false);
				break;
				
			case "Textarea":
				$('#Input2-' + item.ChecklistQuestion_GUID).val(item.Value_2);
				break;
        }

         switch(item.InputType_3) {
			case "Radio":
				$('input[name="Answer3-' + item.ChecklistQuestion_GUID + '"]').val([item.Value_3]);
				break;
				
			case "Textbox":
				$('#Input3-' + item.ChecklistQuestion_GUID).val(item.Value_3);
				break;
				
			case "Checkbox":
				$('#Input3-' + item.ChecklistQuestion_GUID).prop('checked', (item.Value_3 == 1) ? true : false);
				break;
				
			case "Textarea":
				$('#Input3-' + item.ChecklistQuestion_GUID).val(item.Value_3);
				break;
        }
		
        (item.Comment) ? $('#Comments-' + item.ChecklistQuestion_GUID).val(item.Comment) :false;
    });
    lnup_checkEdit = true;

	(waitForRequestCount <= 0) ? getDataForInjection() : false;
}

function plan_checklist_export() {
    var newArray = [];

    $.each(lnup_dataQ, function(i, item) {
        var newObj = {};

        newObj.Plan_GUID = plan_GUID;
        newObj.PlanConfig_GUID = planConfig_GUID;
        newObj.ChecklistType_GUID = lnup_checklistType;
        newObj.Question_Name = item.Question_Name;
        newObj.ChecklistQuestion_GUID = item.ChecklistQuestion_GUID;

        if (lnup_answerdata.length > 0) {
            for (var j = 0; j < lnup_answerdata.length; j++) {
                if (item.ChecklistQuestion_GUID == lnup_answerdata[j].ChecklistQuestion_GUID) {
                    newObj.Plan_ChecklistDetail_GUID = lnup_answerdata[j].Plan_ChecklistDetail_GUID;
                }
            }
        }

        if (item.InputType_1 == 'Radio') {
            newObj.Value_1 = $('input[name="Answer1-' + item.ChecklistQuestion_GUID + '"]:checked').val();
        } else if (item.InputType_1 == 'Textbox') {
            if ($('#Input-' + item.ChecklistQuestion_GUID).val() == "") {
                newObj.Value_1 = null;
            } else {
                newObj.Value_1 = $('#Input-' + item.ChecklistQuestion_GUID).val();
            }
        } else if (item.InputType_1 == 'Checkbox') {
            newObj.Value_1 = $('#Input-' + item.ChecklistQuestion_GUID).prop('checked');
        } else if (item.InputType_1 == 'Textarea') {
            if ($('#Input-' + item.ChecklistQuestion_GUID).val() == "") {
                newObj.Value_1 = null;
            } else {
                newObj.Value_1 = $('#Input-' + item.ChecklistQuestion_GUID).val();
            }
        }

        if (item.InputType_2 == 'Textbox') {
            if ($('#Input2-' + item.ChecklistQuestion_GUID).val() == "") {
                newObj.Value_2 = null;
            } else {
                newObj.Value_2 = $('#Input2-' + item.ChecklistQuestion_GUID).val();
            }
        } else if (item.InputType_2 == 'Radio') {
            newObj.Value_2 = $('input[name="Answer2-' + item.ChecklistQuestion_GUID + '"]:checked').val();
        } else if (item.InputType_2 == 'Checkbox') {
            newObj.Value_2 = $('#Input2-' + item.ChecklistQuestion_GUID).prop('checked');
        } else if (item.InputType_2 == 'Textarea') {
            if ($('#Input2-' + item.ChecklistQuestion_GUID).val() == "") {
                newObj.Value_2 = null;
            } else {
                newObj.Value_2 = $('#Input2-' + item.ChecklistQuestion_GUID).val();
            }
        } else {
            newObj.Value_2 = null;
        }

        if (item.InputType_3 == 'Textbox') {
            if ($('#Input3-' + item.ChecklistQuestion_GUID).val() == "") {
                newObj.Value_3 = null;
            } else {
                newObj.Value_3 = $('#Input3-' + item.ChecklistQuestion_GUID).val();
            }
        } else if (item.InputType_3 == 'Radio') {
            newObj.Value_3 = $('input[name="Answer3-' + item.ChecklistQuestion_GUID + '"]:checked').val();
        } else if (item.InputType_3 == 'Checkbox') {
            newObj.Value_3 = $('#Input3-' + item.ChecklistQuestion_GUID).prop('checked');
        } else if (item.InputType_3 == 'Textarea') {
            if ($('#Input3-' + item.ChecklistQuestion_GUID).val() == "") {
                newObj.Value_3 = null;
            } else {
                newObj.Value_3 = $('#Input3-' + item.ChecklistQuestion_GUID).val();
            }
        } else {
            newObj.Value_3 = null;
        }

        if (item.IsCommentReqd == true) {
            if ($('#Comments-' + item.ChecklistQuestion_GUID).val() == "") {
                newObj.Comment = null;
            } else {
                newObj.Comment = $('#Comments-' + item.ChecklistQuestion_GUID).val();
            }
        }

        newObj.IsManadatory = item.IsManadatory;

        newArray.push(newObj);
    });

    return newArray;
}

function checklist_export() {
    var newArray = [];

    $.each(lnup_dataQ, function(i, item) {
        var newObj = {};

        newObj.Lineup_GUID = lnup_planGUID;
        newObj.ChecklistType_GUID = lnup_checklistType;
        newObj.Question_Name = item.Question_Name;
        newObj.ChecklistQuestion_GUID = item.ChecklistQuestion_GUID;

        if (lnup_answerdata.length > 0) {
            for (var j = 0; j < lnup_answerdata.length; j++) {
                if (item.ChecklistQuestion_GUID == lnup_answerdata[j].ChecklistQuestion_GUID) {
                    newObj.Lineup_ChecklistDetail_GUID = lnup_answerdata[j].Lineup_ChecklistDetail_GUID;
                }
            }
        }

        if (item.InputType_1 == 'Radio') {
            newObj.Value_1 = $('input[name="Answer1-' + item.ChecklistQuestion_GUID + '"]:checked').val();
        } else if (item.InputType_1 == 'Textbox') {
            if ($('#Input-' + item.ChecklistQuestion_GUID).val() == "") {
                newObj.Value_1 = null;
            } else {
                newObj.Value_1 = $('#Input-' + item.ChecklistQuestion_GUID).val();
            }
        } else if (item.InputType_1 == 'Checkbox') {
            newObj.Value_1 = $('#Input-' + item.ChecklistQuestion_GUID).prop('checked');
        } else if (item.InputType_1 == 'Textarea') {
            if ($('#Input-' + item.ChecklistQuestion_GUID).val() == "") {
                newObj.Value_1 = null;
            } else {
                newObj.Value_1 = $('#Input-' + item.ChecklistQuestion_GUID).val();
            }
        }

        if (item.InputType_2 == 'Textbox') {
            if ($('#Input2-' + item.ChecklistQuestion_GUID).val() == "") {
                newObj.Value_2 = null;
            } else {
                newObj.Value_2 = $('#Input2-' + item.ChecklistQuestion_GUID).val();
            }
        } else if (item.InputType_2 == 'Radio') {
            newObj.Value_2 = $('input[name="Answer2-' + item.ChecklistQuestion_GUID + '"]:checked').val();
        } else if (item.InputType_2 == 'Checkbox') {
            newObj.Value_2 = $('#Input2-' + item.ChecklistQuestion_GUID).prop('checked');
        } else if (item.InputType_2 == 'Textarea') {
            if ($('#Input2-' + item.ChecklistQuestion_GUID).val() == "") {
                newObj.Value_2 = null;
            } else {
                newObj.Value_2 = $('#Input2-' + item.ChecklistQuestion_GUID).val();
            }
        } else {
            newObj.Value_2 = null;
        }

        if (item.InputType_3 == 'Textbox') {
            if ($('#Input3-' + item.ChecklistQuestion_GUID).val() == "") {
                newObj.Value_3 = null;
            } else {
                newObj.Value_3 = $('#Input3-' + item.ChecklistQuestion_GUID).val();
            }
        } else if (item.InputType_3 == 'Radio') {
            newObj.Value_3 = $('input[name="Answer3-' + item.ChecklistQuestion_GUID + '"]:checked').val();
        } else if (item.InputType_3 == 'Checkbox') {
            newObj.Value_3 = $('#Input3-' + item.ChecklistQuestion_GUID).prop('checked');
        } else if (item.InputType_3 == 'Textarea') {
            if ($('#Input3-' + item.ChecklistQuestion_GUID).val() == "") {
                newObj.Value_3 = null;
            } else {
                newObj.Value_3 = $('#Input3-' + item.ChecklistQuestion_GUID).val();
            }
        } else {
            newObj.Value_3 = null;
        }

        if (item.IsCommentReqd == true) {
            if ($('#Comments-' + item.ChecklistQuestion_GUID).val() == "") {
                newObj.Comment = null;
            } else {
                newObj.Comment = $('#Comments-' + item.ChecklistQuestion_GUID).val();
            }
        }

        newObj.IsManadatory = item.IsManadatory;

        newArray.push(newObj);
    });

    return newArray;
}

function getDataForInjection() {
	submissionRequest = true;
	var objectToSend = {};
	var dataObj = {};

	dataObj.receiver = "inject_checklist_data";
	dataObj.query = "SELECT * FROM flags.SavedFormData WHERE LineupGUID = '" + lnup_planGUID + "' AND ChecklistTypeGUID = '" + lnup_checklistType + "'";
	dataObj.url = "na";
	dataObj.param1 = "na";
	dataObj.param2 = "na";
	dataObj.param3 = "na";
	dataObj.param4 = "na";
	dataObj.param5 = "na";
	dataObj.param6 = "na";
	dataObj.param7 = "na";
	dataObj.param8 = "na";

	objectToSend.Type = "Request";
	objectToSend.requestType = "tableData";
	objectToSend.data = dataObj;

	SendForRequestInfo(objectToSend, false);
}

function inject_checklist_data(data) {
	for(var key in data) {
		var type	= data[key].type;
		var id		= data[key].id;
		var value	= data[key].value;
		
		switch(type) {
			case 'select':				
				$("#" + id).val(value);
				$("#" + id).material_select();
			break;
			
			case 'date':
			case 'textbox':
			case 'textarea':
			case 'gauge':
			case 'slider':
				$("#" + id).val(value);
			break;
			
			case 'checkbox':
			case 'radiogroup':
				$("#" + id).prop('checked',value);
			break;
		}
	}
}

function extract_checklist_data() {
	
	var formElementArray = [];
	
	$(".formElement").each(function() {
		var element = $(this);
		var type	= element.attr('elementtype');
		
		
		switch(type) {
			case 'select':
			case 'date':
			case 'textbox':
			case 'textarea':
			case 'gauge':
			case 'slider':
				var elementObj = {};
				
				elementObj.id		= element.attr('id');
				elementObj.value	= element.val();
				elementObj.type		= type;
				
				formElementArray.push(elementObj);
			break;
			
			case 'checkbox':
				var elementObj = {};
				
				elementObj.id		= element.attr('id');
				elementObj.value	= element.prop('checked');
				elementObj.type		= type;
				
				formElementArray.push(elementObj);
			break;
			
			case 'radiogroup':
				var elementObj = {};
				
				elementObj.id		= element.attr('id');
				elementObj.value	= element.prop('checked');
				elementObj.type		= type;
				
				elementObj.value ? formElementArray.push(elementObj) : false;
			break;
		}
	});
	
	return formElementArray;
}

function prepare_plan_checklist_data() {
	//-POST
	var query = [];
	var querystr = "";
	
	querystr = "DELETE FROM  flags.SavedFormData WHERE LineupGUID = '"+plan_GUID+"' AND ChecklistTypeGUID = '"+lnup_checklistType+"'";
	query.push(querystr);
	querystr = "INSERT INTO flags.SavedFormData (LineupGUID, ChecklistTypeGUID, FormData) VALUES ('"+plan_GUID+"','"+lnup_checklistType+"','"+btoa(JSON.stringify(extract_checklist_data()))+"')";
	query.push(querystr);

	var objectToSend = {};
	var dataObj = {};

	dataObj.receiver = "plan_checklist_populate";
	dataObj.query = query;
	dataObj.url = "na";
	dataObj.data = "na";
	dataObj.param1 = "na";

	objectToSend.Type = "Request";
	objectToSend.requestType = "post";
	objectToSend.data = dataObj;
	SendForRequestInfo(objectToSend, false);
}

function prepare_checklist_data() {
	//-POST
	var query = [];
	var querystr = "";
	
	querystr = "DELETE FROM  flags.SavedFormData WHERE LineupGUID = '"+lnup_planGUID+"' AND ChecklistTypeGUID = '"+lnup_checklistType+"'";
	query.push(querystr);
	querystr = "INSERT INTO flags.SavedFormData (LineupGUID, ChecklistTypeGUID, FormData) VALUES ('"+lnup_planGUID+"','"+lnup_checklistType+"','"+btoa(JSON.stringify(extract_checklist_data()))+"')";
	query.push(querystr);

	var objectToSend = {};
	var dataObj = {};

	dataObj.receiver = "checklist_populate";
	dataObj.query = query;
	dataObj.url = "na";
	dataObj.data = "na";
	dataObj.param1 = "na";

	objectToSend.Type = "Request";
	objectToSend.requestType = "post";
	objectToSend.data = dataObj;
	SendForRequestInfo(objectToSend, false);
}

function plan_checklist_populate() {
	
	insertedQuestions = [];
	updatedQuestions = [];
	
	var newData = plan_checklist_export();
	
	if(plan_checklist_validate(newData)) {
		for(var key in newData) {
			if(lnup_checkEdit){
				var qRowObj = {};
				var apiKeyObj = {};
				
				apiKeyObj.Plan_ChecklistDetail_GUID = newData[key].Plan_ChecklistDetail_GUID;
				qRowObj.APIKEY = apiKeyObj;
				
				qRowObj.PlanConfig_GUID 		= newData[key].PlanConfig_GUID;
				qRowObj.Plan_GUID     		  	= newData[key].Plan_GUID;
				qRowObj.ChecklistType_GUID 	  	= newData[key].ChecklistType_GUID;
				qRowObj.ChecklistQuestion_GUID 	= newData[key].ChecklistQuestion_GUID;
				qRowObj.Value_1 				= newData[key].Value_1;
				qRowObj.Value_2 				= newData[key].Value_2;
				qRowObj.Comment 				= newData[key].Comment;
				qRowObj.Modified                = moment().format("YYYY-MM-DDTHH:mm:ss.000z");
				
				updatedQuestions.push(qRowObj);
			}
			else{
				var qRowObj = {};
				qRowObj.PlanConfig_GUID 		= newData[key].PlanConfig_GUID;
				qRowObj.Plan_GUID     		  	= newData[key].Plan_GUID;
				qRowObj.ChecklistType_GUID 	  	= newData[key].ChecklistType_GUID;
				qRowObj.ChecklistQuestion_GUID 	= newData[key].ChecklistQuestion_GUID;
				qRowObj.Value_1 				= newData[key].Value_1;
				qRowObj.Value_2 				= newData[key].Value_2;
				qRowObj.Comment 				= newData[key].Comment;
				qRowObj.IsActive                = 1;
				qRowObj.Created                 = moment().format("YYYY-MM-DDTHH:mm:ss.000z");
				qRowObj.Modified                = moment().format("YYYY-MM-DDTHH:mm:ss.000z");
				
				insertedQuestions.push(qRowObj);
			}
		}
		plan_checklist_submit(insertedQuestions, updatedQuestions);
	}
}

function plan_checklist_validate(data) {
	for(var key in data) {
		if((data[key].Value_1 == undefined) && data[key].IsManadatory == true) {
            Materialize.toast(languagePack.message.error + ': "' + data[key].Question_Name + '" ' + languagePack.message.requiredQuestion, 1000);
			return false;
		}
		if(data[key].Value_2 != null){
			if((data[key].Value_2 == undefined) && data[key].IsManadatory == true) {			
                Materialize.toast(languagePack.message.error + ': "' + data[key].Question_Name + '" ' + languagePack.message.requiredQuestion, 1000);
				return false;
			}
		}
	}
	return true;
}

function plan_checklist_submit(lnup_insertedQuestions, lnup_updatedQuestions) {
    //-POST5

    if (lnup_insertedQuestions.length > 0) {
        var jsonData = {
            "fields": lnup_insertedQuestions
        };
		
		var query = [];
		var querystr = "INSERT INTO Plan_ChecklistDetail (PlanConfig_GUID, Plan_GUID, ChecklistType_GUID, ChecklistQuestion_GUID, Value_1, Value_2, Comment, IsActive, Created, Modified) VALUES ";
		
		for(var key in lnup_insertedQuestions) {
			querystr	+= "('"+lnup_insertedQuestions[key].PlanConfig_GUID+"','"+lnup_insertedQuestions[key].Plan_GUID+"','"+lnup_insertedQuestions[key].ChecklistType_GUID+"','"+lnup_insertedQuestions[key].ChecklistQuestion_GUID+"','"+lnup_insertedQuestions[key].Value_1+"','"+lnup_insertedQuestions[key].Value_2+"','"+lnup_insertedQuestions[key].Comment+"','"+lnup_insertedQuestions[key].IsActive+"','"+lnup_insertedQuestions[key].Created+"','"+lnup_insertedQuestions[key].Modified+"')";
					
			if(key < lnup_insertedQuestions.length - 1) {
				querystr += ',';
			}
		}
		
		query.push(querystr);

        var objectToSend = {};
        var dataObj = {};

        dataObj.receiver = "ClosePlanChecklist";
        dataObj.query = query;
        dataObj.url = ruIP + ruPort + planningDB + planningEN + "create/bulk/trans/Plan_ChecklistDetail";
        dataObj.data = btoa(JSON.stringify(jsonData));
        dataObj.param1 = CreateGUID();

        objectToSend.Type = "Request";
        objectToSend.requestType = "post";
        objectToSend.data = dataObj;

        SendForRequestInfo(objectToSend, false);
    }
	
    //-POST4
    if (lnup_updatedQuestions.length > 0) {
        var jsonData = {
            "fields": lnup_updatedQuestions
        };
		
		var query = [];

		for(var key in lnup_updatedQuestions) {
			query.push("UPDATE Plan_ChecklistDetail SET ChecklistQuestion_GUID = '"+lnup_updatedQuestions[key].ChecklistQuestion_GUID+"', ChecklistType_GUID = '"+lnup_updatedQuestions[key].ChecklistType_GUID+"', Comment = '"+lnup_updatedQuestions[key].Comment+"', Plan_GUID = '"+lnup_updatedQuestions[key].Plan_GUID+"', PlanConfig_GUID= '"+lnup_updatedQuestions[key].PlanConfig_GUID+"' Modified = '"+lnup_updatedQuestions[key].Modified+"', Value_1 = '"+lnup_updatedQuestions[key].Value_1+"', Value_2 = '"+lnup_updatedQuestions[key].Value_2+"' WHERE Plan_ChecklistDetail_GUID = '"+lnup_updatedQuestions[key].APIKEY.Plan_ChecklistDetail_GUID+"'");
		}

        var objectToSend = {};
        var dataObj = {};

        dataObj.receiver = "ClosePlanChecklist";
        dataObj.query = query;
        dataObj.url = ruIP + ruPort + planningDB + planningEN + "update/bulk/trans/Plan_ChecklistDetail";
        dataObj.data = btoa(JSON.stringify(jsonData));
        dataObj.param1 = CreateGUID();

        objectToSend.Type = "Request";
        objectToSend.requestType = "post";
        objectToSend.data = dataObj;

        SendForRequestInfo(objectToSend, false);
    } else {
        CloseChecklist();
    }
}

function checklist_populate() {

    var newData;
    var checklistType = $('#lineup_checklist_form').attr('ChecklistType');

    var operatorTimesArray = [];
    var machineLocationsArray = [];
    var machineStatusArray = [];
    var createdMachineDetailsArray = [];
    var updatedMachineDetailsArray = [];
    var lnup_insertedQuestions = [];
    var lnup_updatedQuestions = [];
    var createdHaulageDetailsArray = [];
    var updatedHaulageDetailsArray = [];

    if (checklistType == locationConditions) {

        $(".operatorTimes").each(function() {
            var dataObj = {};
            var apiKeyObj = {};
            var element = $(this);

            apiKeyObj.Lineup_GUID = element.attr("LineupGUID");
            dataObj.APIKEY = apiKeyObj;

            if (element.find(".operatorTimeIn").val() && element.find(".operatorTimeIn").val() != "__/__/____ __:__") {
                dataObj.OperatorTimeArrival = element.find(".operatorTimeIn").val();
            }

            if (element.find(".operatorTimeOut").val() && element.find(".operatorTimeOut").val() != "__/__/____ __:__") {
                dataObj.OperatorTimeLeft = element.find(".operatorTimeOut").val();
            }

            operatorTimesArray.push(dataObj);
        });

        $(".machineLocations").each(function() {
            var dataObj = {};
            var apiKeyObj = {};
            var element = $(this);

            apiKeyObj.Lineup_Step_GUID = element.attr("LineupStepGUID");
            dataObj.APIKEY = apiKeyObj;

            if(element.find(".machineBeginLocation select.machineBeginLocation.initialized").val()) {
                dataObj.BeginShift_MachLocation = element.find(".machineBeginLocation select.machineBeginLocation.initialized").val();
            }

            if(element.find(".machineEndLocation select.machineEndLocation.initialized").val()) {
                dataObj.EndShift_MachLocation = element.find(".machineEndLocation select.machineEndLocation.initialized").val();
            }

            machineLocationsArray.push(dataObj);
        });
    }

    if(checklistType == activitiesCheckList) {

        $(".MachineStatusRow").each(function() {
            var element = $(this);
            var machineObj = {};
            var apiKeyObj = {};

            apiKeyObj.Machine_GUID = element.attr("MachineGUID");
            machineObj.APIKEY = apiKeyObj;

            if(element.find(".endingMachineStatus select.endingMachineStatus.initialized").val()) {
                machineObj.MachineStatus = element.find(".endingMachineStatus select.endingMachineStatus.initialized").val();
            }

            machineStatusArray.push(machineObj);
        });

        MachineStatusUpdate(machineStatusArray);

        var dataObj = {};
        var apiKeyObj = {};
        var element = $(".LocationStatusRow");

        apiKeyObj.Lineup_GUID = element.attr("LineupGUID");
        dataObj.APIKEY = apiKeyObj;

		if(element.find(".endingLocationStatus select.endingLocationStatus.initialized").val()) {
			dataObj.MachineStatus = element.find(".endingLocationStatus select.endingLocationStatus.initialized").val();
		}

        operatorTimesArray.push(dataObj);

        GrabStatusLocationInfo(apiKeyObj.Lineup_GUID, dataObj.EndLocationStatus_GUID);
    }

    if(checklistType == machineDetails) {

        $(".MachineDetailsRow").each(function(index) {
            var element = $(this);

            if (element.attr("LineupMachineDetailGUID")) {

                var machineObj = {};
                var apiKeyObj = {};

                apiKeyObj.Lineup_MachineDetail_GUID = element.attr("LineupMachineDetailGUID");
                machineObj.APIKEY = apiKeyObj;
                machineObj.Begin_Hydraulic_Level = $("#start_shift_hydraulic_slider_" + index).val().toString();
                machineObj.End_Hydraulic_Level = $("#end_shift_hydraulic_slider_" + index).val().toString();
                machineObj.End_Fuel_Level = $("#fuel_slider_" + index).val().toString();
                machineObj.End_Electrical_Distance = $("#electric_source_distance_slider_" + index).val().toString();
                machineObj.Modified = moment().format("YYYY-MM-DDTHH:mm:ss.000z");

                updatedMachineDetailsArray.push(machineObj);
            }
			else {
                var machineObj = {};

                machineObj.Lineup_MachineDetail_GUID = CreateGUID();
                machineObj.Lineup_GUID = element.attr("LineupGUID");
                machineObj.Machine_GUID = element.attr("MachineGUID");
                machineObj.Begin_Hydraulic_Level = $("#start_shift_hydraulic_gauge_" + index).val().toString();
                machineObj.End_Hydraulic_Level = $("#end_shift_hydraulic_gauge_" + index).val().toString();
                machineObj.End_Fuel_Level = $("#fuel_gauge_" + index).val().toString();
                machineObj.End_Electrical_Distance = $("#electric_source_distance_gauge_" + index).val().toString();
                machineObj.ShiftDate = moment(element.attr("ShiftDate").split("Z")[0]).format("YYYY-MM-DDTHH:mm:ss.000z");
                machineObj.IsActive = true;
                machineObj.Created = moment().format("YYYY-MM-DDTHH:mm:ss.000z");
                machineObj.Modified = moment().format("YYYY-MM-DDTHH:mm:ss.000z");
                machineObj.Obsolete = moment().format("9999-12-31T00:00:00.000z");

                createdMachineDetailsArray.push(machineObj);
            }
        });
    }

    if(checklistType == materials_checklist) {
        newData = materials_export();

        if (materials_validate(newData)) {
            for (var key in newData) {
                var qRowObj = {};
                var apiKeyObj = {};

                apiKeyObj.Lineup_MeasureDetail_GUID = newData[key].Lineup_MeasureDetail_GUID;
                qRowObj.APIKEY = apiKeyObj;

                qRowObj.Lineup_GUID = newData[key].Lineup_GUID;
                qRowObj.ChecklistType_GUID = newData[key].ChecklistType_GUID;
                qRowObj.ActualValue_1 = newData[key].ActualValue_1;
                qRowObj.ActualValue_2 = newData[key].ActualValue_2;
                qRowObj.ActualValue_3 = newData[key].ActualValue_3;
                qRowObj.Modified = moment().format("YYYY-MM-DDTHH:mm:ss.000z");

                lnup_updatedQuestions.push(qRowObj);
            }

            materials_submit(lnup_updatedQuestions);
        }
    }
	else if (checklistType == explosives_checklist) {
        newData = materials_export();

        if (materials_validate(newData)) {
            for (var key in newData) {
                var qRowObj = {};
                var apiKeyObj = {};

                apiKeyObj.Lineup_MeasureDetail_GUID = newData[key].Lineup_MeasureDetail_GUID;
                qRowObj.APIKEY = apiKeyObj;

                qRowObj.Lineup_GUID = newData[key].Lineup_GUID;
                qRowObj.ChecklistType_GUID = newData[key].ChecklistType_GUID;
                qRowObj.ActualValue_1 = newData[key].ActualValue_1;
                qRowObj.ActualValue_2 = newData[key].ActualValue_2;
                qRowObj.ActualValue_3 = newData[key].ActualValue_3;
                qRowObj.Modified = moment().format("YYYY-MM-DDTHH:mm:ss.000z");

                lnup_updatedQuestions.push(qRowObj);
            }

            materials_submit(lnup_updatedQuestions);
        }
    }
	else if (checklistType == process_checklist) {
        newData = materials_export();

        if (materials_validate(newData)) {
            for (var key in newData) {
                var qRowObj = {};
                var apiKeyObj = {};

                apiKeyObj.Lineup_MeasureDetail_GUID = newData[key].Lineup_MeasureDetail_GUID;
                qRowObj.APIKEY = apiKeyObj;

                qRowObj.Lineup_GUID = newData[key].Lineup_GUID;
                qRowObj.ChecklistType_GUID = newData[key].ChecklistType_GUID;
                qRowObj.ActualValue_1 = newData[key].ActualValue_1;
                qRowObj.ActualValue_2 = newData[key].ActualValue_2;
                qRowObj.ActualValue_3 = newData[key].ActualValue_3;
                qRowObj.ActualValue_4 = newData[key].ActualValue_4;
                qRowObj.Modified = moment().format("YYYY-MM-DDTHH:mm:ss.000z");

                lnup_updatedQuestions.push(qRowObj);
            }

            materials_submit(lnup_updatedQuestions);
        }
    }
	else if (checklistType == haulage_checklist) {

        $(".haulageRow").each(function(index) {
            var element = $(this);
            var recordExists = false;

            var newHaulageGuid;

            if (element.attr("LineupHaulageDetailGUID")) {
                newHaulageGuid = element.attr("LineupHaulageDetailGUID");
                recordExists = true;
            } else {
                newHaulageGuid = CreateGUID();
                recordExists = false;
            }

            var lineupGuid = element.closest("#haulage-table").attr("LineupGUID");
            var shiftDate = element.closest("#haulage-table").attr("ShiftDate");
            var isScaling = element.find("#haulage_is_scaling_" + index).is(":Checked");
            var mineral = element.find("#haulage_mineral_" + index).is(":Checked");
            var waste = element.find("#haulage_waste_" + index).is(":Checked");
            var mineralWaste = 0;
            var plannedLocal = element.find("#haulage_planned_location_" + index).val();
            var actualLocal = element.find("#haulage_actual_location_" + index).val();
            var numLoads = element.find("#haulage_number_loads_" + index).val();

            if (mineral) {
                mineralWaste = true;
            } else {
                mineralWaste = false;
            }

            if (recordExists) {
                var dataObj = {};
                var apiKeyObj = {};

                apiKeyObj.Lineup_HaulageDetail_GUID = newHaulageGuid;

                dataObj.APIKEY = apiKeyObj;
                dataObj.IsScaling = isScaling;
                dataObj.Mineral_Waste = mineralWaste;
                dataObj.PlannedLocation_GUID = plannedLocal;
                dataObj.ActualLocation_GUID = actualLocal;
                dataObj.Loads = numLoads;
                dataObj.Modified = moment().format("YYYY-MM-DDTHH:mm:ss.000z");

                updatedHaulageDetailsArray.push(dataObj);
            }
			else {
                var dataObj = {};

                dataObj.Lineup_HaulageDetail_GUID = newHaulageGuid;
                dataObj.Lineup_GUID = lineupGuid;
                dataObj.IsScaling = isScaling;
                dataObj.Mineral_Waste = mineralWaste;
                dataObj.PlannedLocation_GUID = plannedLocal;
                dataObj.ActualLocation_GUID = actualLocal;
                dataObj.Loads = numLoads;
                dataObj.ShiftDate = shiftDate;
                dataObj.IsActive = true;
                dataObj.Created = moment().format("YYYY-MM-DDTHH:mm:ss.000z");
                dataObj.Modified = moment().format("YYYY-MM-DDTHH:mm:ss.000z");
                dataObj.Obsolete = moment().format("9999-12-31T00:00:00.000z");

                createdHaulageDetailsArray.push(dataObj);
            }
        });

        CreateHaulageDetails(createdHaulageDetailsArray, updatedHaulageDetailsArray);
    }
	else if (checklistType == machineDownEvents) {
        var lineupGuid = $("#downs-table").attr("LineupGUID");
        var shiftDate = $("#downs-table").attr("ShiftDate");
        var shift = $("#downs-table").attr("Shift");
        var locationGuid = $("#downs-table").attr("LocationGUID");
        var operatorGuid = $("#downs-table").attr("OperatorGUID");
        var machineGuids = $("#downs-table").attr("MachineGUIDS").split("_");
        var machineList = $("#downs-table").attr("MachineList").split("_");

        var createdDownEventsArray = [];

        $(".downsRow").each(function() {
            var element = $(this);
            if (!(element.attr("MachineDownEventGUID"))) {
                var dataObj = {};
                var downStartTime = element.find(".downCodeBeginTime").val();
                var downArrivalTime = element.find(".downCodeArrivalTime").val();
                var downEndTime = element.find(".downCodeEndTime").val();

                dataObj.MachineDownEvent_GUID = CreateGUID();
                dataObj.Lineup_GUID = lineupGuid;
                dataObj.ShiftDate = shiftDate;
                dataObj.Shift = shift;
                dataObj.Location_GUID = locationGuid;
                dataObj.Operator_GUID = operatorGuid;
                dataObj.Machine_GUID = machineGuids[0];
                dataObj.DownReasonCode_GUID = element.find(".downCodeSelect.initialized").val();
                dataObj.Comment = element.find(".downCodeComments").val();

                if (downStartTime && downStartTime != "__/__/____ __:__") {
                    dataObj.DownStartTime = downStartTime;
                }

                if (downArrivalTime && downArrivalTime != "__/__/____ __:__") {
                    dataObj.MaintenanceArrivalTime = downArrivalTime;
                }

                if (downEndTime && downEndTime != "__/__/____ __:__") {
                    dataObj.DownFinishTime = downEndTime;
                }

                dataObj.IsCompleted = false;
                dataObj.CreatedBy = UserData[0].PersonGUID;
                dataObj.IsActive = true;
                dataObj.Created = moment().format("YYYY-MM-DDTHH:mm:ss.000z");
                dataObj.Modified = moment().format("YYYY-MM-DDTHH:mm:ss.000z");
                dataObj.Obsolete = moment().format("9999-12-31T00:00:00.000z");

                createdDownEventsArray.push(dataObj);
            }
        });

        PrepareMachineDownEvents(createdDownEventsArray, machineGuids, machineList);
    }
	else {
        newData = checklist_export();
        var shiftDate = $("#checklist_table").attr("ShiftDate");

        if (checklist_validate(newData)) {
            for (var key in newData) {
                if (lnup_checkEdit) {
                    var qRowObj = {};
                    var apiKeyObj = {};

                    apiKeyObj.Lineup_ChecklistDetail_GUID = newData[key].Lineup_ChecklistDetail_GUID;
                    qRowObj.APIKEY = apiKeyObj;

                    qRowObj.Lineup_GUID = newData[key].Lineup_GUID;
                    qRowObj.ChecklistType_GUID = newData[key].ChecklistType_GUID;
                    qRowObj.ChecklistQuestion_GUID = newData[key].ChecklistQuestion_GUID;
                    qRowObj.Value_1 = newData[key].Value_1;
                    qRowObj.Value_2 = newData[key].Value_2;
                    qRowObj.Value_3 = newData[key].Value_3;
                    qRowObj.Comment = newData[key].Comment;
                    qRowObj.Modified = moment().format("YYYY-MM-DDTHH:mm:ss.000z");

                    lnup_updatedQuestions.push(qRowObj);
                }
				else {
                    var qRowObj = {};
                    qRowObj.Lineup_GUID = newData[key].Lineup_GUID;
                    qRowObj.ChecklistType_GUID = newData[key].ChecklistType_GUID;
                    qRowObj.ChecklistQuestion_GUID = newData[key].ChecklistQuestion_GUID;
                    qRowObj.Value_1 = newData[key].Value_1;
                    qRowObj.Value_2 = newData[key].Value_2;
                    qRowObj.Value_3 = newData[key].Value_3;
                    qRowObj.Comment = newData[key].Comment;
                    qRowObj.ShiftDate = shiftDate;
                    qRowObj.IsActive = 1;
                    qRowObj.Created = moment().format("YYYY-MM-DDTHH:mm:ss.000z");
                    qRowObj.Modified = moment().format("YYYY-MM-DDTHH:mm:ss.000z");

                    lnup_insertedQuestions.push(qRowObj);
                }
            }
            UpdateMachineDetails(createdMachineDetailsArray, updatedMachineDetailsArray);
            UpdateCommonFields(operatorTimesArray, machineLocationsArray, lnup_insertedQuestions, lnup_updatedQuestions);
        }
    }
}

function PrepareMachineDownEvents(createdDownEventsArray, machineGuids, machineList) {
    var machineStatusArray = [];
    var confirmMessage = languagePack.message.confirmUpdateMachine1;

    if(machineGuids.length > 0) {
        for (var key in machineGuids) {
            var machineObj = {};
            var apiKeyObj = {};

            apiKeyObj.Machine_GUID = machineGuids[key];
            machineObj.APIKEY = apiKeyObj;

            machineObj.MachineStatus = languagePack.common.down.toUpperCase();

            machineStatusArray.push(machineObj);

            if (key >= machineGuids.length - 1) {
                confirmMessage += " " + machineList[key] + "."
            } else {
                confirmMessage += " " + machineList[key] + ","
            }
        };
		
		
		MachineStatusUpdate(machineStatusArray);
		CreateMachineDownEvent(createdDownEventsArray);


    } else {
        CreateMachineDownEvent(createdDownEventsArray);
    }
}

function MachineStatusUpdate(machineStatusArray) {
    if (machineStatusArray.length > 0) {
        //-POST13
        var jsonData = {
            "fields": machineStatusArray
        };
		
		var query = [];
		
		for(var key in machineStatusArray) {
			query.push("UPDATE Plan_Machine SET MachineStatus = '"+machineStatusArray[key].MachineStatus+"' WHERE Machine_GUID = '"+machineStatusArray[key].APIKEY.Machine_GUID+"'");
		}

        var objectToSend = {};
        var dataObj = {};

        dataObj.receiver = "na";
        dataObj.query = query;
        dataObj.url = ruIP + ruPort + planningDB + planningEN + "update/bulk/eqmt/Machine";
        dataObj.data = btoa(JSON.stringify(jsonData));
        dataObj.param1 = CreateGUID();

        objectToSend.Type = "Request";
        objectToSend.requestType = "post";
        objectToSend.data = dataObj;

        SendForRequestInfo(objectToSend, false);
    }
}

function CreateMachineDownEvent(createdDownEventsArray) {

    if (createdDownEventsArray.length > 0) {
        //-POST12
        var jsonData = {
            "fields": createdDownEventsArray
        };
		
		var query = [];
		var querystr = "INSERT INTO MachineDownEvent (Comment, Created, CreatedBy, DownFinishTime, DownFinishTimeSeconds, DownReasonCode_GUID, DownStartTime, DownStartTimeSeconds, IsActive, IsCompleted, Lineup_GUID, Location_GUID, MachineDownEvent_GUID, Machine_GUID, MaintenanceArrivalTime, MaintenanceArrivalTimeSeconds, Modified, Obsolete, Operator_GUID, Shift, ShiftDate, ShiftDateSeconds) VALUES ";
		
		for(var key in createdDownEventsArray) {
			querystr	+= "('"+createdDownEventsArray[key].Comment+"','"+createdDownEventsArray[key].Created+"','"+createdDownEventsArray[key].CreatedBy+"','"+createdDownEventsArray[key].DownFinishTime+"','"+moment(createdDownEventsArray[key].DownFinishTime).unix()+"','"+createdDownEventsArray[key].DownReasonCode_GUID+"','"+createdDownEventsArray[key].DownStartTime+"','"+moment(createdDownEventsArray[key].DownStartTime).unix()+"','"+createdDownEventsArray[key].IsActive+"','"+createdDownEventsArray[key].IsCompleted+"','"+createdDownEventsArray[key].Lineup_GUID+"','"+createdDownEventsArray[key].Location_GUID+"','"+createdDownEventsArray[key].MachineDownEvent_GUID+"','"+createdDownEventsArray[key].Machine_GUID+"','"+createdDownEventsArray[key].MaintenanceArrivalTime+"','"+moment(createdDownEventsArray[key].MaintenanceArrivalTime).unix()+"','"+createdDownEventsArray[key].Modified+"','"+createdDownEventsArray[key].Obsolete+"','"+createdDownEventsArray[key].Operator_GUID+"','"+createdDownEventsArray[key].Shift+"','"+createdDownEventsArray[key].ShiftDate+"','"+moment(createdDownEventsArray[key].ShiftDate).unix()+"')";
			
			if(key < createdDownEventsArray.length - 1) {
				querystr += ',';
			}
		}
		
		query.push(querystr);

        var objectToSend = {};
        var dataObj = {};

        dataObj.receiver = "CloseChecklist";
        dataObj.query = query;
        dataObj.url = ruIP + ruPort + planningDB + planningEN + "create/bulk/trans/MachineDownEvent";
        dataObj.data = btoa(JSON.stringify(jsonData));
        dataObj.param1 = CreateGUID();

        objectToSend.Type = "Request";
        objectToSend.requestType = "post";
        objectToSend.data = dataObj;

        SendForRequestInfo(objectToSend, false);
    } else {
        CloseChecklist();
    }
}

function UpdateMachineDetails(createdMachineDetailsArray, updatedMachineDetailsArray) {

    if (createdMachineDetailsArray.length > 0) {
        //-POST11
        var jsonData = {
            "fields": createdMachineDetailsArray
        };
		
		var query = [];
		var querystr = "INSERT INTO Lineup_MachineDetail (Lineup_MachineDetail_GUID,Lineup_GUID,Machine_GUID,Begin_Hydraulic_Level,End_Hydraulic_Level,End_Fuel_Level,End_Electrical_Distance,ShiftDate, ShiftDateSeconds,IsActive,Created,Modified,Obsolete) VALUES ";
		
		for(var key in createdMachineDetailsArray) {
			querystr	+= "('"+createdMachineDetailsArray[key].Lineup_MachineDetail_GUID+"','"+createdMachineDetailsArray[key].Lineup_GUID+"','"+createdMachineDetailsArray[key].Machine_GUID+"','"+createdMachineDetailsArray[key].Begin_Hydraulic_Level+"','"+createdMachineDetailsArray[key].End_Hydraulic_Level+"','"+createdMachineDetailsArray[key].End_Fuel_Level+"','"+createdMachineDetailsArray[key].End_Electrical_Distance+"','"+createdMachineDetailsArray[key].ShiftDate+"','"+moment(createdMachineDetailsArray[key].ShiftDate).unix()+"','"+createdMachineDetailsArray[key].IsActive+"','"+createdMachineDetailsArray[key].Created+"','"+createdMachineDetailsArray[key].Modified+"','"+createdMachineDetailsArray[key].Obsolete+"')";
					
			if(key < createdMachineDetailsArray.length - 1) {
				querystr += ',';
			}
		}
		
		query.push(querystr);

        var objectToSend = {};
        var dataObj = {};

        dataObj.receiver = "na";
        dataObj.query = query;
        dataObj.url = ruIP + ruPort + planningDB + planningEN + "create/bulk/trans/Lineup_MachineDetail";
        dataObj.data = btoa(JSON.stringify(jsonData));
        dataObj.param1 = CreateGUID();

        objectToSend.Type = "Request";
        objectToSend.requestType = "post";
        objectToSend.data = dataObj;

        SendForRequestInfo(objectToSend, false);
    }

    if (updatedMachineDetailsArray.length > 0) {
        //-POST10

        var jsonData = {
            "fields": updatedMachineDetailsArray
        };
		
		var query = [];
		
		for(var key in updatedMachineDetailsArray) {
			query.push("UPDATE Lineup_MachineDetail SET Begin_Hydraulic_Level = '"+updatedMachineDetailsArray[key].Begin_Hydraulic_Level+"', End_Hydraulic_Level = '"+updatedMachineDetailsArray[key].End_Hydraulic_Level+"', End_Fuel_Level = '"+updatedMachineDetailsArray[key].End_Fuel_Level+"',End_Electrical_Distance = '"+updatedMachineDetailsArray[key].End_Electrical_Distance+"',Modified = '"+updatedMachineDetailsArray[key].Modified+"'");
		}

        var objectToSend = {};
        var dataObj = {};

        dataObj.receiver = "na";
        dataObj.query = query;
        dataObj.url = ruIP + ruPort + planningDB + planningEN + "update/bulk/trans/Lineup_MachineDetail";
        dataObj.data = btoa(JSON.stringify(jsonData));
        dataObj.param1 = CreateGUID();

        objectToSend.Type = "Request";
        objectToSend.requestType = "post";
        objectToSend.data = dataObj;

        SendForRequestInfo(objectToSend, false);
    }
}

function UpdateCommonFields(operatorTimesArray, machineLocationsArray, lnup_insertedQuestions, lnup_updatedQuestions) {
    checklist_submit(lnup_insertedQuestions, lnup_updatedQuestions);

    if (operatorTimesArray.length > 0) {
        //-POST9

        var jsonData = {
            "fields": operatorTimesArray
        };
		
		var query = [];
		
		for(var key in operatorTimesArray) {
			query.push("UPDATE Lineup SET OperatorTimeArrival = '"+operatorTimesArray[key].OperatorTimeArrival+"', OperatorTimeArrivalSeconds = '"+moment(operatorTimesArray[key].OperatorTimeArrival).unix()+"', OperatorTimeLeft = '"+operatorTimesArray[key].OperatorTimeLeft+"', OperatorTimeLeftSeconds = '"+moment(operatorTimesArray[key].OperatorTimeLeft).unix()+"' WHERE Lineup_GUID = '"+operatorTimesArray[key].APIKEY.Lineup_GUID+"'");
		}

        var objectToSend = {};
        var dataObj = {};

        dataObj.receiver = "na";
        dataObj.query = query;
        dataObj.url = ruIP + ruPort + planningDB + planningEN + "update/bulk/trans/Lineup";
        dataObj.data = btoa(JSON.stringify(jsonData));
        dataObj.param1 = CreateGUID();

        objectToSend.Type = "Request";
        objectToSend.requestType = "post";
        objectToSend.data = dataObj;

        SendForRequestInfo(objectToSend, false);
    }

    if (machineLocationsArray.length > 0) {
        //-POST8

        var jsonData = {
            "fields": machineLocationsArray
        };
		
		var query = [];
		
		for(var key in machineLocationsArray) {
			query.push("UPDATE Lineup_StepDetail SET BeginShift_MachLocation = '"+machineLocationsArray[key].BeginShift_MachLocation+"', EndShift_MachLocation = '"+machineLocationsArray[key].EndShift_MachLocation+"' WHERE Lineup_Step_GUID = '"+machineLocationsArray[key].APIKEY.Lineup_Step_GUID+"'");
		}

        var objectToSend = {};
        var dataObj = {};

        dataObj.receiver = "na";
        dataObj.query = query;
        dataObj.url = ruIP + ruPort + planningDB + planningEN + "update/bulk/trans/Lineup_StepDetail";
        dataObj.data = btoa(JSON.stringify(jsonData));
        dataObj.param1 = CreateGUID();

        objectToSend.Type = "Request";
        objectToSend.requestType = "post";
        objectToSend.data = dataObj;

        SendForRequestInfo(objectToSend, false);
    }
}

function CreateHaulageDetails(createdHaulageDetailsArray, updatedHaulageDetailsArray) {
    if (createdHaulageDetailsArray.length > 0) {
        //-POST7

        var jsonData = {
            "fields": createdHaulageDetailsArray
        };
		
		var query = [];
		var querystr = "INSERT INTO Lineup_HaulageDetail (ActualLocation_GUID, Created, IsActive, IsScaling, Lineup_GUID, Lineup_HaulageDetail_GUID, Loads, Mineral_Waste, Modified, Obsolete, PlannedLocation_GUID, ShiftDate, ShiftDateSeconds) VALUES ";
		
		for(var key in createdHaulageDetailsArray) {
			querystr	+= "('"+createdHaulageDetailsArray[key].ActualLocation_GUID+"','"+createdHaulageDetailsArray[key].Created+"','"+createdHaulageDetailsArray[key].IsActive+"','"+createdHaulageDetailsArray[key].IsScaling+"','"+createdHaulageDetailsArray[key].Lineup_GUID+"','"+createdHaulageDetailsArray[key].Lineup_HaulageDetail_GUID+"','"+createdHaulageDetailsArray[key].Loads+"','"+createdHaulageDetailsArray[key].Mineral_Waste+"','"+createdHaulageDetailsArray[key].Modified+"','"+createdHaulageDetailsArray[key].Obsolete+"','"+createdHaulageDetailsArray[key].PlannedLocation_GUID+"','"+createdHaulageDetailsArray[key].ShiftDate+"','"+moment(createdHaulageDetailsArray[key].ShiftDate).unix()+"')";
					
			if(key < createdHaulageDetailsArray.length - 1) {
				querystr += ',';
			}
		}
		
		query.push(querystr);

        var objectToSend = {};
        var dataObj = {};

        dataObj.receiver = "CloseChecklist";
        dataObj.query = query;
        dataObj.url = ruIP + ruPort + planningDB + planningEN + "create/bulk/trans/Lineup_HaulageDetail";
        dataObj.data = btoa(JSON.stringify(jsonData));
        dataObj.param1 = CreateGUID();

        objectToSend.Type = "Request";
        objectToSend.requestType = "post";
        objectToSend.data = dataObj;

        SendForRequestInfo(objectToSend, false);
    }
	
    if (updatedHaulageDetailsArray.length > 0) {
        //-POST6

        var jsonData = {
            "fields": updatedHaulageDetailsArray
        };
		
		var query = [];
		
		for(var key in updatedHaulageDetailsArray) {
			query.push("UPDATE Lineup_HaulageDetail SET PlannedLocation_GUID = '"+updatedHaulageDetailsArray[key].PlannedLocation_GUID+"', Modified = '"+updatedHaulageDetailsArray[key].Modified+"', Mineral_Waste = '"+updatedHaulageDetailsArray[key].Mineral_Waste+"', Loads = '"+updatedHaulageDetailsArray[key].Loads+"', IsScaling = '"+updatedHaulageDetailsArray[key].IsScaling+"', ActualLocation_GUID = '"+updatedHaulageDetailsArray[key].ActualLocation_GUID+"' WHERE Lineup_HaulageDetail_GUID = '"+updatedHaulageDetailsArray[key].APIKEY.Lineup_HaulageDetail_GUID+"'");
		}

        var objectToSend = {};
        var dataObj = {};

        dataObj.receiver = "CloseChecklist";
        dataObj.query = query;
        dataObj.url = ruIP + ruPort + planningDB + planningEN + "update/bulk/trans/Lineup_HaulageDetail";
        dataObj.data = btoa(JSON.stringify(jsonData));
        dataObj.param1 = CreateGUID();

        objectToSend.Type = "Request";
        objectToSend.requestType = "post";
        objectToSend.data = dataObj;

        SendForRequestInfo(objectToSend, false);
    } else {
        CloseChecklist();
    }
}

function checklist_validate(data) {
    for (var key in data) {
        if ((data[key].Value_1 == undefined) && data[key].IsManadatory == true) {
            Materialize.toast(languagePack.message.error + ': "' + data[key].Question_Name + '" ' + languagePack.message.requiredQuestion, 1000);
            return false;
        }
        if (data[key].Value_2 != null) {
            if ((data[key].Value_2 == undefined) && data[key].IsManadatory == true) {
                Materialize.toast(languagePack.message.error + ': "' + data[key].Question_Name + '" ' + languagePack.message.requiredQuestion, 1000);
                return false;
            }
        }
    }
    return true;
}

function checklist_submit(lnup_insertedQuestions, lnup_updatedQuestions) {
    //-POST5

    if (lnup_insertedQuestions.length > 0) {
        var jsonData = {
            "fields": lnup_insertedQuestions
        };
		
		var query = [];
		var querystr = "INSERT INTO Lineup_FormDetail (ChecklistQuestion_GUID, ChecklistType_GUID, Comment, Created, IsActive, Lineup_GUID, Modified, ShiftDate, ShiftDateSeconds, Value_1, Value_2, Value_3) VALUES ";
		
		for(var key in lnup_insertedQuestions) {
			querystr	+= "('"+lnup_insertedQuestions[key].ChecklistQuestion_GUID+"','"+lnup_insertedQuestions[key].ChecklistType_GUID+"','"+lnup_insertedQuestions[key].Comment+"','"+lnup_insertedQuestions[key].Created+"','"+lnup_insertedQuestions[key].IsActive+"','"+lnup_insertedQuestions[key].Lineup_GUID+"','"+lnup_insertedQuestions[key].Modified+"','"+lnup_insertedQuestions[key].ShiftDate+"','"+moment(lnup_insertedQuestions[key].ShiftDate).unix()+"','"+lnup_insertedQuestions[key].Value_1+"','"+lnup_insertedQuestions[key].Value_2+"','"+lnup_insertedQuestions[key].Value_3+"')";
					
			if(key < lnup_insertedQuestions.length - 1) {
				querystr += ',';
			}
		}
		
		query.push(querystr);

        var objectToSend = {};
        var dataObj = {};

        dataObj.receiver = "CloseChecklist";
        dataObj.query = query;
        dataObj.url = ruIP + ruPort + planningDB + planningEN + "create/bulk/trans/Lineup_FormDetail";
        dataObj.data = btoa(JSON.stringify(jsonData));
        dataObj.param1 = CreateGUID();

        objectToSend.Type = "Request";
        objectToSend.requestType = "post";
        objectToSend.data = dataObj;

        SendForRequestInfo(objectToSend, false);
    }
	
    //-POST4
    if (lnup_updatedQuestions.length > 0) {
        var jsonData = {
            "fields": lnup_updatedQuestions
        };
		
		var query = [];
		
		for(var key in lnup_updatedQuestions) {
			query.push("UPDATE Lineup_FormDetail SET ChecklistQuestion_GUID = '"+lnup_updatedQuestions[key].ChecklistQuestion_GUID+"', ChecklistType_GUID = '"+lnup_updatedQuestions[key].ChecklistType_GUID+"', Comment = '"+lnup_updatedQuestions[key].Comment+"', Lineup_GUID = '"+lnup_updatedQuestions[key].Lineup_GUID+"', Modified = '"+lnup_updatedQuestions[key].Modified+"', Value_1 = '"+lnup_updatedQuestions[key].Value_1+"', Value_2 = '"+lnup_updatedQuestions[key].Value_2+"', Value_3 = '"+lnup_updatedQuestions[key].Value_3+"' WHERE Lineup_ChecklistDetail_GUID = '"+lnup_updatedQuestions[key].APIKEY.Lineup_ChecklistDetail_GUID+"'");
		}

        var objectToSend = {};
        var dataObj = {};

        dataObj.receiver = "CloseChecklist";
        dataObj.query = query;
        dataObj.url = ruIP + ruPort + planningDB + planningEN + "update/bulk/trans/Lineup_FormDetail";
        dataObj.data = btoa(JSON.stringify(jsonData));
        dataObj.param1 = CreateGUID();

        objectToSend.Type = "Request";
        objectToSend.requestType = "post";
        objectToSend.data = dataObj;

        SendForRequestInfo(objectToSend, false);
    } else {
        CloseChecklist();
    }
}

function materials_export() {
    var newArray = [];
    $.each(lnup_dataQ, function(i, item) {
        var newObj = {};

        newObj.Lineup_GUID = lnup_planGUID;
        newObj.Lineup_MeasureDetail_GUID = item.Lineup_MeasureDetail_GUID;

        if ($('#Real-' + item.Lineup_MeasureDetail_GUID).val()) {
            if ($('#Real-' + item.Lineup_MeasureDetail_GUID).val() == "") {
                newObj.ActualValue_1 = null;
            } else {
                newObj.ActualValue_1 = $('#Real-' + item.Lineup_MeasureDetail_GUID).val();
            }
        }

        if ($('#Sobrante-' + item.Lineup_MeasureDetail_GUID).val()) {
            if ($('#Sobrante-' + item.Lineup_MeasureDetail_GUID).val() == "") {
                newObj.ActualValue_2 = null;
            } else {
                newObj.ActualValue_2 = $('#Sobrante-' + item.Lineup_MeasureDetail_GUID).val();
            }
        }

        if ($('#tope-' + item.Lineup_MeasureDetail_GUID).val()) {
            if ($('#tope-' + item.Lineup_MeasureDetail_GUID).val() == "") {
                newObj.ActualValue_1 = null;
            } else {
                newObj.ActualValue_1 = $('#tope-' + item.Lineup_MeasureDetail_GUID).val();
            }
        }

        if ($('#nicho-' + item.Lineup_MeasureDetail_GUID).val()) {
            if ($('#nicho-' + item.Lineup_MeasureDetail_GUID).val() == "") {
                newObj.ActualValue_2 = null;
            } else {
                newObj.ActualValue_2 = $('#nicho-' + item.Lineup_MeasureDetail_GUID).val();
            }
        }

        if ($('#desborde-' + item.Lineup_MeasureDetail_GUID)) {
            if ($('#desborde-' + item.Lineup_MeasureDetail_GUID).val() == "") {
                newObj.ActualValue_3 = null;
            } else {
                newObj.ActualValue_3 = $('#desborde-' + item.Lineup_MeasureDetail_GUID).val();
            }
        }

        if ($('#descostre-' + item.Lineup_MeasureDetail_GUID)) {
            if ($('#descostre-' + item.Lineup_MeasureDetail_GUID).val() == "") {
                newObj.ActualValue_4 = null;
            } else {
                newObj.ActualValue_4 = $('#descostre-' + item.Lineup_MeasureDetail_GUID).val();
            }
        }

        newArray.push(newObj);
    });

    return newArray;
}

function materials_validate(data) {
    for (var key in data) {
        if (data[key].ActualValue_1 == undefined && data[key].IsManadatory == true) {
            Materialize.toast(languagePack.message.error + ': "' + data[key].MeasureDisplayName + '" ' + languagePack.message.required, 1000);
            return false;
        }
    }
    return true;
}

function materials_submit(lnup_updatedQuestions) {
    //-POST3
    if (lnup_updatedQuestions.length > 0) {
        var jsonData = {
            "fields": lnup_updatedQuestions
        };
		
		var query = [];
		
		for(var key in lnup_updatedQuestions) {
			query.push("UPDATE Lineup_MeasureDetail SET ActualValue_1 = '"+lnup_updatedQuestions[key].ActualValue_1+"', ActualValue_2 = '"+lnup_updatedQuestions[key].ActualValue_2+"', ActualValue_3 = '"+lnup_updatedQuestions[key].ActualValue_3+"', Lineup_GUID = '"+lnup_updatedQuestions[key].Lineup_GUID+"', Modified = '"+lnup_updatedQuestions[key].Modified+"' WHERE Lineup_MeasureDetail_GUID = '"+lnup_updatedQuestions[key].APIKEY.Lineup_MeasureDetail_GUID+"'");
		}

        var objectToSend = {};
        var dataObj = {};

        dataObj.receiver = "CloseChecklist";
        dataObj.query = query;
        dataObj.url = ruIP + ruPort + planningDB + planningEN + "update/bulk/trans/Lineup_MeasureDetail";
        dataObj.data = btoa(JSON.stringify(jsonData));
        dataObj.param1 = CreateGUID();

        objectToSend.Type = "Request";
        objectToSend.requestType = "post";
        objectToSend.data = dataObj;

        SendForRequestInfo(objectToSend, false);
    } else {
        CloseChecklist();
    }
}

function GrabStatusLocationInfo(lineupGuid, locationStatusGuid) {

    var objectToSend = {};
    var dataObj = {};

    dataObj.receiver = "LoadLineupsWithInfo";
    dataObj.query = "SELECT * FROM Lineup WHERE Lineup_GUID = '" + lineupGuid + "'";
    dataObj.url = ruIP + ruPort + planningDB + planningEN + "read/trans/Lineup?where=\"Lineup_GUID = '" + lineupGuid + "'\"";
    dataObj.param1 = locationStatusGuid;
    dataObj.param2 = "na";
    dataObj.param3 = "na";
    dataObj.param4 = "na";
    dataObj.param5 = "na";
    dataObj.param6 = "na";
    dataObj.param7 = "na";
    dataObj.param8 = "na";

    objectToSend.Type = "Request";
    objectToSend.requestType = "tableData";
    objectToSend.data = dataObj;

    SendForRequestInfo(objectToSend, false);
}

function LoadLineupsWithInfo(data, locationStatusGuid) {
    var lineup = data

    var locationGuid = "";

    if (lineup.length > 0) {
        locationGuid = lineup[0].Location_GUID;
    }

    var objectToSend = {};
    var dataObj = {};

    dataObj.receiver = "FindLineUpInfo";
    dataObj.query = "SELECT * FROM LocationCurrentStatus WHERE Location_GUID = '" + locationGuid + "'";
    dataObj.url = ruIP + ruPort + planningDB + planningEN + "read/geo/LocationCurrentStatus?where=\"Location_GUID = '" + locationGuid + "'\"";
    dataObj.param1 = locationStatusGuid;
    dataObj.param2 = locationGuid;
    dataObj.param3 = "na";
    dataObj.param4 = "na";
    dataObj.param5 = "na";
    dataObj.param6 = "na";
    dataObj.param7 = "na";
    dataObj.param8 = "na";

    objectToSend.Type = "Request";
    objectToSend.requestType = "tableData";
    objectToSend.data = dataObj;

    SendForRequestInfo(objectToSend, false);
}

function FindLineUpInfo(data, locationStatusGuid, locationGuid) {
    var currentStatus = data;

    var locationCurrentStatusGuid = "";
    var dataObj = {};
    var apiKeyObj = {};
    var existingStatus = false;

    dataObj.LocationCurrentStatus_GUID = CreateGUID();
    dataObj.Location_GUID = locationGuid;
    dataObj.LocationStatus_GUID = locationStatusGuid;
    dataObj.IsActive = true;
    dataObj.Modified = moment().format("YYYY-MM-DDTHH:mm:ss.000z");
    dataObj.Obsolete = moment().format("9999-12-31T00:00:00.000z");
    dataObj.LastUpdatedBy = UserData[0].PersonGUID;

    if (currentStatus.length > 0) {
        if (currentStatus[0].LocationCurrentStatus_GUID) {
            locationCurrentStatusGuid = currentStatus[0].LocationCurrentStatus_GUID;
            apiKeyObj.LocationCurrentStatus_GUID = locationCurrentStatusGuid;
            dataObj.APIKEY = apiKeyObj;
            existingStatus = true;
        }
    }

    if (existingStatus) {
        UpdateCurrentLocationStatus(locationCurrentStatusGuid, locationStatusGuid);
    } else {
        dataObj.Created = moment().format("YYYY-MM-DDTHH:mm:ss.000z");
        if (dataObj.LocationStatus_GUID != 0) {
            CreateCurrentLocationStatus(dataObj);
        }
    }
}

function CreateCurrentLocationStatus(dataObj) {
    //-POST2
    var jsonData = {
        "fields": dataObj
    };
	
	var query = [];
	var querystr = "";
	
	querystr	+= "INSERT INTO LocationCurrentStatus (Created, IsActive, LastUpdatedBy, LocationCurrentStatus_GUID, LocationStatus_GUID, Location_GUID, Modified, Obsolete)"
				+ "VALUES('"+dataObj.Created+"','"+dataObj.IsActive+"','"+dataObj.LastUpdatedBy+"','"+dataObj.LocationCurrentStatus_GUID+"','"+dataObj.LocationStatus_GUID+"','"+dataObj.Location_GUID+"','"+dataObj.Modified+"','"+dataObj.Obsolete+"')";
				
	query.push(querystr);

    var objectToSend = {};
    var dataObj = {};

    dataObj.receiver = "na";
    dataObj.query = query;
    dataObj.url = ruIP + ruPort + planningDB + planningEN + "create/geo/LocationCurrentStatus";
    dataObj.data = btoa(JSON.stringify(jsonData));
    dataObj.param1 = CreateGUID();

    objectToSend.Type = "Request";
    objectToSend.requestType = "post";
    objectToSend.data = dataObj;

    SendForRequestInfo(objectToSend, false);
}

function UpdateCurrentLocationStatus(recordGuid, newStatus) {
    //-POST1
	var currentDate = moment().format("YYYY-MM-DDTHH:mm:ss.000z");
    var jsonData = {
        "key": {
            "LocationCurrentStatus_GUID": recordGuid
        },
        "fields": {
            "LocationStatus_GUID": newStatus,
            "Modified": currentDate
        }
    };
		
	var query = [];

	query.push("UPDATE LocationCurrentStatus SET LocationStatus_GUID = '"+newStatus+"', Modified = currentDate WHERE LocationCurrentStatus_GUID = '"+recordGuid+"'");

    var objectToSend = {};
    var dataObj = {};

    dataObj.receiver = "na";
    dataObj.query = query;
    dataObj.url = ruIP + ruPort + planningDB + planningEN + "update/geo/LocationCurrentStatus";
    dataObj.data = btoa(JSON.stringify(jsonData));
    dataObj.param1 = CreateGUID();

    objectToSend.Type = "Request";
	objectToSend.requestType = "post";
    objectToSend.data = dataObj;

    SendForRequestInfo(objectToSend, false);
}

function CloseForm() {
    $("#checklist_close").click();
    currentChecklist.click();
}

function ClosePlanChecklist() {
	if(!closingCL) {
		closingCL = true;
		$(".modal-box, .modal-overlay").fadeOut(500, function() {
			$(".modal-overlay").remove();
		});

		$("#lineup_checklist_body").html(" ");
		$('#lineup_calendar_view thead > tr').remove();
		$('#lineup_calendar_view tbody > tr').remove();
		lnup_answerdata = [];
		PlanningChecklistLoad(currentelement);
	}
}

function CloseChecklist() {
	if(!closingCL) {
		closingCL = true;
		$(".modal-box, .modal-overlay").fadeOut(500, function() {
			$(".modal-overlay").remove();
		});

		$("#lineup_checklist_body").html(" ");
		$('#lineup_calendar_view thead > tr').remove();
		$('#lineup_calendar_view tbody > tr').remove();
		lnup_answerdata = [];
		ChecklistLoad(currentelement);
	}
}

function InitializeGauges(index) {
    //DESTROY AND RE-INITIALIZE START SHIFT HYDRAULIC GAUGE AND SLIDER

    $('#start_shift_hydraulic_gauge_' + index).jqxLinearGauge('destroy');

    if ($("#start_shift_hydraulic_gauge_" + index).length == 0) {
        $("#gaugeWidget1_" + index).append('<div id="start_shift_hydraulic_gauge_' + index + '" style="margin-left:calc(50% - 75px)" class="formElement" elementType="linearGauge" databaseColumn="StartShiftHydraulicGauge_' + index + '"></div>');
    }

    $('#start_shift_hydraulic_gauge_' + index).jqxLinearGauge({
        orientation: 'vertical',
        labels: {
            interval: .25
        },
        ticksMajor: {
            size: '10%',
            interval: .25
        },
        ticksMinor: {
            size: '5%',
            interval: .125,
            style: {
                'stroke-width': 1,
                stroke: '#aaaaaa'
            }
        },
        max: 1,
        min: 0,
        value: 0,
        width: 150,
        pointer: {
            size: '6%'
        },
        colorScheme: 'scheme05',
        animationDuration: 500
    });

    $('#start_shift_hydraulic_slider_' + index).jqxSlider('destroy');

    if ($("#start_shift_hydraulic_slider_" + index).length == 0) {
        $("#gaugeWidget1_" + index).append('<div id="start_shift_hydraulic_slider_' + index + '" class="formElement" elementType="linearGaugeSlider" databaseColumn="StartShiftHydraulicSlider_' + index + '"></div>');
    }

    $('#start_shift_hydraulic_slider_' + index).jqxSlider({
        min: 0,
        max: 1,
        mode: 'fixed',
        ticksFrequency: .125,
        width: 200,
        value: 0,
        showButtons: true,
        step: .125
    });
    $('#start_shift_hydraulic_slider_' + index).on("change", function() {
        $('#start_shift_hydraulic_gauge_' + index).jqxLinearGauge('value', $('#start_shift_hydraulic_slider_' + index).jqxSlider('value'));
    });
    $('#start_shift_hydraulic_gauge_' + index).jqxLinearGauge('value', 0);




    //DESTROY AND RE-INITIALIZE END SHIFT HYDRAULIC GAUGE AND SLIDER

    $('#end_shift_hydraulic_gauge_' + index).jqxLinearGauge('destroy');

    if ($("#end_shift_hydraulic_gauge_" + index).length == 0) {
        $("#gaugeWidget2_" + index).append('<div id="end_shift_hydraulic_gauge_' + index + '" style="margin-left:calc(50% - 75px)" class="formElement" elementType="linearGauge" databaseColumn="EndShiftHydraulicGauge_' + index + '"></div>');
    }

    $('#end_shift_hydraulic_gauge_' + index).jqxLinearGauge({
        orientation: 'vertical',
        labels: {
            interval: .25
        },
        ticksMajor: {
            size: '10%',
            interval: .25
        },
        ticksMinor: {
            size: '5%',
            interval: .125,
            style: {
                'stroke-width': 1,
                stroke: '#aaaaaa'
            }
        },
        max: 1,
        min: 0,
        value: 0,
        width: 150,
        pointer: {
            size: '6%'
        },
        colorScheme: 'scheme05',
        animationDuration: 500
    });

    $('#end_shift_hydraulic_slider_' + index).jqxSlider('destroy');

    if ($("#end_shift_hydraulic_slider_" + index).length == 0) {
        $("#gaugeWidget2_" + index).append('<div id="end_shift_hydraulic_slider_' + index + '" class="formElement" elementType="linearGaugeSlider" databaseColumn="EndShiftHydraulicSlider_' + index + '"></div>');
    }

    $('#end_shift_hydraulic_slider_' + index).jqxSlider({
        min: 0,
        max: 1,
        mode: 'fixed',
        ticksFrequency: .125,
        width: 200,
        value: 0,
        showButtons: true,
        step: .125
    });
    $('#end_shift_hydraulic_slider_' + index).on("change", function() {
        $('#end_shift_hydraulic_gauge_' + index).jqxLinearGauge('value', $('#end_shift_hydraulic_slider_' + index).jqxSlider('value'));
    });
    $('#end_shift_hydraulic_gauge_' + index).jqxLinearGauge('value', 0);




    //DESTROY AND RE-INITIALIZE FUEL GAUGE AND SLIDER

    $('#fuel_gauge_' + index).jqxGauge('destroy');

    if ($("#fuel_gauge_" + index).length == 0) {
        $("#gaugeWidget3_" + index).append('<div id="fuel_gauge_' + index + '" class="formElement" elementType="linearGauge" databaseColumn="FuelGauge_' + index + '"></div>');
    }

    $('#fuel_gauge_' + index).jqxGauge({
        ranges: [{
            startValue: 0,
            endValue: .125,
            style: {
                fill: '#e53d37',
                stroke: '#e53d37'
            },
            startDistance: 0,
            endDistance: 0
        }, {
            startValue: .125,
            endValue: .5,
            style: {
                fill: '#fad00b',
                stroke: '#fad00b'
            },
            startDistance: 0,
            endDistance: 0
        }, {
            startValue: .5,
            endValue: 1,
            style: {
                fill: '#4cb848',
                stroke: '#4cb848'
            },
            startDistance: 0,
            endDistance: 0
        }],
        cap: {
            size: '5%',
            style: {
                fill: '#2e79bb',
                stroke: '#2e79bb'
            }
        },
        border: {
            style: {
                fill: '#8e9495',
                stroke: '#7b8384',
                'stroke-width': 1
            }
        },
        ticksMinor: {
            interval: .125,
            size: '5%'
        },
        ticksMajor: {
            interval: .25,
            size: '10%'
        },
        max: 1,
        min: 0,
        value: 0,
        labels: {
            position: 'outside',
            interval: .25
        },
        pointer: {
            style: {
                fill: '#2e79bb'
            },
            width: 5
        },
        animationDuration: 500
    });

    $('#fuel_slider_' + index).jqxSlider('destroy');

    if ($("#fuel_slider_" + index).length == 0) {
        $("#gaugeWidget3_" + index).append('<div id="fuel_slider_' + index + '" class="formElement" elementType="linearGaugeSlider" databaseColumn="FuelSlider_' + index + '"></div>');
    }

    $('#fuel_slider_' + index).jqxSlider({
        min: 0,
        max: 1,
        mode: 'fixed',
        ticksFrequency: .125,
        width: 350,
        value: 0,
        showButtons: true,
        step: .125
    });
    $('#fuel_slider_' + index).on("change", function() {
        $('#fuel_gauge_' + index).jqxGauge('value', $('#fuel_slider_' + index).jqxSlider('value'));
    });
    $('#fuel_gauge_' + index).jqxGauge('value', 0);




    //DESTROY AND RE-INITIALIZE ELECTRIC SOURCE DISTANCE GAUGE AND SLIDER

    $('#electric_source_distance_gauge_' + index).jqxLinearGauge('destroy');

    if ($("#electric_source_distance_gauge_" + index).length == 0) {
        $("#gaugeWidget4_" + index).append('<div id="electric_source_distance_gauge_' + index + '" style="margin-left:calc(50% - 75px)" class="formElement" elementType="linearGauge" databaseColumn="ElectricSourceDistanceGauge_' + index + '"></div>');
    }

    $('#electric_source_distance_gauge_' + index).jqxLinearGauge({
        orientation: 'vertical',
        labels: {
            interval: 25
        },
        ticksMajor: {
            size: '10%',
            interval: 12.5
        },
        ticksMinor: {
            size: '5%',
            interval: 6.25,
            style: {
                'stroke-width': 1,
                stroke: '#aaaaaa'
            }
        },
        max: 50,
        min: 0,
        value: 0,
        width: 150,
        pointer: {
            size: '6%'
        },
        colorScheme: 'scheme05',
        animationDuration: 500
    });

    $('#electric_source_distance_slider_' + index).jqxSlider('destroy');

    if ($("#electric_source_distance_slider_" + index).length == 0) {
        $("#gaugeWidget4_" + index).append('<div id="electric_source_distance_slider_' + index + '" class="formElement" elementType="linearGaugeSlider" databaseColumn="ElectricSourceDistanceSlider_' + index + '"></div>');
    }

    $('#electric_source_distance_slider_' + index).jqxSlider({
        min: 0,
        max: 50,
        mode: 'fixed',
        ticksFrequency: 6.25,
        width: 200,
        value: 0,
        showButtons: true,
        step: 6.25
    });
    $('#electric_source_distance_slider_' + index).on("change", function() {
        $('#electric_source_distance_gauge_' + index).jqxLinearGauge('value', $('#electric_source_distance_slider_' + index).jqxSlider('value'));
    });
    $('#electric_source_distance_gauge_' + index).jqxLinearGauge('value', 0);
}

function CreateGUID() {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x3|0x8)).toString(16);
    });
    return uuid.toUpperCase();
}


