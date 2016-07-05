/*============================================================
	Property of:		MISOM TECHNOLOGIES
	Developer:			AARON MCCOLOUGH
	Application Name:	FARA_FRESNILLO
	Directory:			FARA_FRESNILLO/PLANNING/JS
	File Name:			load_dropdowns.js
=============================================================*/

var week_LF;
var weeksData          = [];
var WeekBeginTime      = "";
var WeekEndTime        = "";
var currentWeek        = "";
var alertBadges        = 0
var positionArray      = ["Operator", "Helper"];
var loadSequence       = "initial";
var machineForStepList = [];
var ganttStepList      = [];
var ganttEmployeeList  = [];
var employeeData;
var wkflowStatusData;
var superintendentData;
var WkFlowData;
var StepStatusData;

var LineupPlanData      = [];
var LineupPlanStepData  = [];
var LineupPlanAssetData = [];
var operatorGuid		= "";
var helperGuid			= "";

var lineupShiftDate		= "";
var lineupShift			= "";
var addingLineup		= false;

LoadBadges();

function LoadPlanLists() {
	PopulateWeekSelector();
	
	setTimeout(function() {
		var jqxhrlocations = $.getJSON(ruIP + ruPort + planningDB + planningEN + "read/web/v_LocationConfig?where=\"Location_IsActive = '1' AND Zone_GUID = '"+ zone_GF +"'\"", function() {
			var locationsData = jQuery.parseJSON(jqxhrlocations.responseText);
						
			$('#location_select').html("<option>"+languagePack.common.selectOption+"</option>");
			var locationSelect = document.getElementById('location_select');			
			
			for(var key in locationsData) {
				locationSelect.options[locationSelect.options.length] = new Option(locationsData[key].LocationDisplayName, locationsData[key].Location_GUID);
				locationSelect.options[locationSelect.options.length - 1].setAttribute("ObracodeGUID", locationsData[key].Obracode_GUID);
			}
			
			var jqxhrwkflowstatus = $.getJSON(ruIP + ruPort + planningDB + planningEN + "read/ref/WkFlow_StatusType?where=\"IsActive = '1'\"", function() {
				wkflowStatusData = jQuery.parseJSON(jqxhrwkflowstatus.responseText);			
			});
		});
		
		var jqxhremployees = $.getJSON(ruIP + ruPort + planningDB + planningEN + "read/ext/Employee?where=\"IsActive = '1' Order By EmployeeName Asc\"", function() {
			employeeData = jQuery.parseJSON(jqxhremployees.responseText);
		});
	}, 500);
}

function PopulateMethodSelector() {
	var jqxhrmethods = $.getJSON(ruIP + ruPort + planningDB + planningEN + "read/dbo/v_ObracodeProcessMethod_Config?where=\"Obracode_GUID = '"+ obracodeComboGuid +"' And MineProcess_GUID = '" + processComboGuid + "' AND Method_GUID is not null\"", function() {		
		var methodsData = jQuery.parseJSON(jqxhrmethods.responseText);
		
		$('#method_select').html("<option>"+languagePack.common.selectOption+"</option>");
		var methodSelect = document.getElementById('method_select');
		
		for(var key in methodsData) {
			methodSelect.options[methodSelect.options.length] = new Option(methodsData[key].MethodDisplayName, methodsData[key].Method_GUID);
		}
		
		if(newStepMethodArr[0] != "" && configEditMode) {
			$('#method_select').val(newStepMethodArr[0]);
			$('#method_select').change();
		}
	});	
}

function PopulateWeekSelector() {
	weeksData = [];
	
	var date = new Date();
	var day = date.getDay();
	var days = (day - 1);
	
	for(var i = 52; i > 0; i--) {
		var timeObj = {};
		var removeDays = i * 7;
		
		timeObj.begin = moment().subtract((days + removeDays), 'days').format("YYYY-MM-DDT00:00:00.000z");
		timeObj.weekofdate = moment().subtract((days + removeDays), 'days').format("Do MMM YYYY");

		weeksData.push(timeObj);
	}
	
	for(var i = 0; i < 52; i++) {
		var timeObj = {};
		var addDays = i * 7;
		
		timeObj.begin = moment().subtract((days - addDays), 'days').format("YYYY-MM-DDT00:00:00.000z");
		timeObj.weekofdate = moment().subtract((days - addDays), 'days').format("Do MMM YYYY");
		
		if(i == 0) {
			timeObj.current = true;
		}

		weeksData.push(timeObj);
	}
		
	var weeksPast = 0;
	var currentYear = moment().year();
	
	while(moment().subtract((weeksPast * 7), 'days').year() == currentYear) {
		weeksPast ++;
	}
	
	weeksPast = weeksPast - 1;
	
	for(var key in weeksData) {
		weeksData[key].week = languagePack.common.week + " " + moment(weeksData[key].begin).week();
	}
		
	$('#plan_week_selector').remove();

	if($("#plan_week_selector").length == 0) {
		$("#main_sub_header").append('<select id="plan_week_selector"></select>');
	}
	
	setTimeout(function() {
		$('#plan_week_selector').html("");
		var weekSelect = document.getElementById('plan_week_selector');
		
		for(var key in weeksData) {
			weekSelect.options[weekSelect.options.length] = new Option(weeksData[key].weekofdate, weeksData[key].begin);
			if(weeksData[key].current) {
				$(weekSelect.options[weekSelect.options.length - 1]).addClass("currentWeek");
				$(weekSelect.options[weekSelect.options.length - 1]).prop("selected", true);
				currentWeek = weeksData[key].week;
			}
		}
		
		WeekBeginTime = moment(new Date(weeksData[$("#plan_week_selector")[0].selectedIndex].begin)).add(7,'hours').format("YYYY-MM-DDT00:00:00.000z");
		WeekEndTime   = moment(WeekBeginTime).add(6,'days').add(7,'hours').format("YYYY-MM-DDT23:00:00.000z");
		
		if(GetCookieValue("weekFilter", "string")) {
			document.getElementById("plan_week_selector").selectedIndex = GetCookieValue("weekFilter", "int");
			loadSequence = "aux";			 
			$('#plan_week_selector').change();
		}
		if(loadSequence == "initial" && $("#plan_gantt_toggle").hasClass("isinfocus")) {
			FindShifts();
		}
		else if(addingLineup) {
			LoadPlanHtml("prelineup");
		}
		else {
			FindShifts();
		}
	},1000);
	
	$('#plan_week_selector').on('change', function() {
		LockForService();
		WeekBeginTime = moment(new Date(weeksData[$("#plan_week_selector")[0].selectedIndex].begin)).add(7,'hours').format("YYYY-MM-DDT00:00:00.000z");
		WeekEndTime   = moment(WeekBeginTime).add(6,'days').add(7,'hours').format("YYYY-MM-DDT23:00:00.000z");
		
		document.cookie = "weekFilter=" + document.getElementById("plan_week_selector").selectedIndex + "; path=/";

		week_LF = $('#plan_week_selector').val();
		
		for(var key in weeksData) {
			if(week_LF == weeksData[key].begin) {
				currentWeek = weeksData[key].week;
			}
		}
		
		if($("#plan_calendar_toggle").hasClass("isinfocus")) {
			GetPlanConfigGUID("calendar");
		}
		else if($("#plan_gantt_toggle").hasClass("isinfocus")) {
			FindShifts();
		}
		else if($("#lineup_toggle").hasClass("isinfocus")) {
			LoadPlanHtml("prelineup");
		}
		else {
			LoadPlanHtml("prelineup");
		}
	});	
}

function GanttMachineDynamicList() {
	machineForStepList = [];
	
	var jqxhrmachines = $.getJSON(ruIP + ruPort + planningDB + planningEN + "read/web/v_MachineAreaConfig?where=\"IsActive = '1' AND Area_GUID = '" + area_GF + "' ORDER BY MachineDisplayName ASC\"", function() {		
		var machinesData = jQuery.parseJSON(jqxhrmachines.responseText);
		
		for(var key in machinesData) {
			var obj = {};
			obj.id     = machinesData[key].Machine_GUID;
			obj.title  = machinesData[key].MachineDisplayName;
			obj.status = machinesData[key].MachineStatus;
			machineForStepList.push(obj);
		}
	});
}

function GanttStepDynamicList(method_guid) {
	ganttStepList = [];
	
	var jqxhrdynamicsteps = $.getJSON(ruIP + ruPort + planningDB + planningEN + "read/cfg/Step?where=\"IsActive = '1' AND Method_GUID = '"+ method_guid +"' ORDER BY Ordinal ASC\"", function() {		
		var stepsData = jQuery.parseJSON(jqxhrdynamicsteps.responseText);
		
		for(var key in stepsData) {
			var obj = {};
			obj.id     = stepsData[key].Step_GUID;
			obj.title  = stepsData[key].DisplayName;
			ganttStepList.push(obj);
		}
	});
}

function GanttEmployeeDynamicList(machine_guid, index) {
	ganttEmployeeList = [];
	
	var jqxhrdynamicemployees = $.getJSON(ruIP + ruPort + planningDB + planningEN + "read/dbo/v_EmployeeMachineShift?where=\"IsActive = '1' AND Machine_GUID = '"+ machine_guid +"' ORDER BY EmployeeName ASC\"", function() {		
		var employeeData = jQuery.parseJSON(jqxhrdynamicemployees.responseText);
		
		for(var key in employeeData) {
			var obj = {};
			obj.id         = employeeData[key].Employee_GUID;
			obj.title      = employeeData[key].EmployeeName;
			obj.isOperator = employeeData[key].IsOperator;
			obj.isHelper   = employeeData[key].IsHelper;
			ganttEmployeeList.push(obj);
		}
		
		if(index != -1) {		
			GenerateEmployees(index);
		}
	});
}

function LoadBadges() {
	var addFilterToQuery = "";
	var status = "";
	
	if(UserData[0].RoleDisplayName == "Superintendent") {
		addFilterToQuery += " AND AssignedTo = '"+UserData[0].PersonGUID+"'";
		addFilterToQuery += " AND StatusDisplayName = 'Pending'";
		status = "Pending";
	}
	if(UserData[0].RoleDisplayName == "Planner") {
		addFilterToQuery += " AND CreatedBy = '"+UserData[0].PersonGUID+"'";
		addFilterToQuery += " AND StatusDisplayName = 'Rejected'";
		status = "Rejected";
	}
	
	if(addFilterToQuery != "") {	
		var jqxhrwkflowdetails = $.getJSON(ruIP + ruPort + planningDB + planningEN + "read/dbo/v_WkFlow_Detail?where=\"IsCurrentStatus = '1' AND IsActive = '1'" + addFilterToQuery + "\"", function() {				
			var WkFlowBadgesData = jQuery.parseJSON(jqxhrwkflowdetails.responseText);
			
			alertBadges = WkFlowBadgesData.length;
			
			if(WkFlowBadgesData.length > 0) {
				$("#review_badges").css("display","block");
				$("#review_badges").html(WkFlowBadgesData.length);
				
				if(WkFlowBadgesData.length == 1) {
					$("#review_badges").attr("title", languagePack.message.youHave + " " + WkFlowBadgesData.length + " " + status + " " + languagePack.message.plansToReview);
				}
				else {				
					$("#review_badges").attr("title", languagePack.message.youHave + " " + WkFlowBadgesData.length + " " + status + " " + languagePack.message.plansToReview);
				}
			}
			else {
				$("#review_badges").css("display","none");
			}
			
		});
	}
}

function UpdateLineUpReadyStatus() {
	var jqxhrstepstatus = $.getJSON(ruIP + ruPort + planningDB + planningEN + "read/dbo/v_PlanStepDetail?where=\"Zone_GUID = '" + zone_GF + "'AND Plan_StepDetail_IsActive = '1' AND StartTime >= '" + WeekBeginTime + "' AND StartTime <= '" + WeekEndTime + "' ORDER BY PlanConfig_GUID, StartTime, Ordinal ASC\"", function() {		
		StepStatusData = jQuery.parseJSON(jqxhrstepstatus.responseText);
		
		lineupReady = false;
		
		for(var key in StepStatusData) {
			if(StepStatusData[key].PlanChecklist_Status == "Ready") {
				lineupReady = true;
			}
		}
		CheckStatus();
	});
}






