/*============================================================
	Property of:		MISOM TECHNOLOGIES
	Developer:			JORGE MURILLO & AARON MCCOLOUGH
	Application Name:	FARA_FRESNILLO
	Directory:			FARA_FRESNILLO/PLANNING/JS/PRELINEUP_JS
	File Name:			script.js
=============================================================*/

var lnup_checklistType;
var lnup_dataQ				= [];
var lnup_planGUID;
var lnup_statusData			= [];
var lnup_answerdata			= [];
var lnup_LineupDetail		= [];
var lineupChecklistTypes	= [];
var lnup_checkListLength	= 0;
var lnup_plandata;
var lnup_checkEdit;
var lnup_dayCheck;
var allMachineTypesGuid		= "";
var jumboMachineTypesGuid	= "";
var simbaMachineTypesGuid	= "";
var scoopMachineTypesGuid	= [];
var currentChecklist;
var downCodesDDLData		= [];
var downCodesChartData		= [];
var materials_checklist		= "";
var process_checklist		= "";
var explosives_checklist	= "";
var haulage_checklist		= "";
var machineDownEvents		= "";
var machineDetails			= "";
var activitiesCheckList		= "";
var locationConditions		= "";
var currentChecklistIcon;

GetMachineDownList();

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
	
	$('td').hover(function() {
		$(this).parents('table').find('col:eq('+$(this).index()+')').toggleClass('hover');
	});	
	
	var jqxhrAllMachineTypes = $.getJSON(ruIP + ruPort + planningDB + planningEN + "read/eqmt/v_MachineType?where=\"MachineTypeCode = 'All'\"", function() {
		var allMachType = jQuery.parseJSON(jqxhrAllMachineTypes.responseText);
		
		allMachineTypesGuid = allMachType[0].MachineType_GUID;
		
		var jqxhrScoopMachineTypes = $.getJSON(ruIP + ruPort + planningDB + planningEN + "read/eqmt/v_MachineType?where=\"MachineTypeCode IN ('ST','CV')\"", function() {
			var scoopMachType = jQuery.parseJSON(jqxhrScoopMachineTypes.responseText);
		
			scoopMachineTypesGuid = scoopMachType;
			
			var jqxhrSimbaMachineTypes = $.getJSON(ruIP + ruPort + planningDB + planningEN + "read/eqmt/v_MachineType?where=\"MachineTypeCode = 'JUBL'\"", function() {
				var simbaMachType = jQuery.parseJSON(jqxhrSimbaMachineTypes.responseText);
			
				simbaMachineTypesGuid = simbaMachType[0].MachineType_GUID;
			
				var jqxhrJumboMachineTypes = $.getJSON(ruIP + ruPort + planningDB + planningEN + "read/eqmt/v_MachineType?where=\"MachineTypeCode = 'JU'\"", function() {
					var jumboMachType = jQuery.parseJSON(jqxhrJumboMachineTypes.responseText);
			
					jumboMachineTypesGuid = jumboMachType[0].MachineType_GUID;
			
					var jqxhrlnupchecklisttypes = $.getJSON(ruIP + ruPort + planningDB + planningEN + "read/cfg/ChecklistType?where=\"IsActive = '1' AND UsageType = 'Lineup' ORDER BY Created ASC\"", function() {
						lineupChecklistTypes    = jQuery.parseJSON(jqxhrlnupchecklisttypes.responseText);
						
						for(var key in lineupChecklistTypes) {
							if(lineupChecklistTypes[key].ChecklistType_Name == "Materiales") {
								materials_checklist = lineupChecklistTypes[key].DisplayName;
							}						
							if(lineupChecklistTypes[key].ChecklistType_Name == "Proceso") {
								process_checklist = lineupChecklistTypes[key].DisplayName;
							}
							if(lineupChecklistTypes[key].ChecklistType_Name == "Explosivos") {
								explosives_checklist = lineupChecklistTypes[key].DisplayName;
							}
							if(lineupChecklistTypes[key].ChecklistType_Name == "Acarreo") {
								haulage_checklist = lineupChecklistTypes[key].DisplayName;
							}
							if(lineupChecklistTypes[key].ChecklistType_Name == "Paros de Equipo") {
								machineDownEvents = lineupChecklistTypes[key].DisplayName;
							}
							if(lineupChecklistTypes[key].ChecklistType_Name == "Datos de Operacion") {
								machineDetails = lineupChecklistTypes[key].DisplayName;
							}
							if(lineupChecklistTypes[key].ChecklistType_Name == "Actividades") {
								activitiesCheckList = lineupChecklistTypes[key].DisplayName;
							}
							if(lineupChecklistTypes[key].ChecklistType_Name == "Condiciones del Lugar") {
								locationConditions = lineupChecklistTypes[key].DisplayName;
							}
						}
						GetLineupDetails();
					});
				});
			});
		});
	});
});

function GetMachineDownList() {
	downCodesChartData	= [];
	downCodesDDLData	= [];
	
	$.getJSON(ruIP + ruPort + planningDB + planningEN + "read/cfg/DownReasonCode?where=\"IsActive = '1' ORDER BY Ordinal ASC\"", function( data ) {
		downCodesChartData = data;
	});
	
	$.getJSON(ruIP + ruPort + planningDB + planningEN + "read/cfg/DownReasonCode?where=\"IsActive = '1' ORDER BY DisplayName ASC\"", function( data ) {
		downCodesDDLData = data;
	});
}

function GetLineupDetails() {
	var shiftDate = $("#plan_lineup_date_field").val();
	var shift     = $("#plan_lineup_shift_field").val();
	
	var inputParams  = [];
	LineupPlanDetail = [];
	
	var param1 = {"paramName":"BeginShiftDate", "paramType":"varchar", "paramValue":WeekBeginTime};
	var param2 = {"paramName":"EndShiftDate",   "paramType":"varchar", "paramValue":WeekEndTime};
	var param3 = {"paramName":"Area_GUID",      "paramType":"varchar", "paramValue":area_GF};
	
	inputParams.push(param1);
	inputParams.push(param2);
	inputParams.push(param3);
	
	var inputParamsContainer         = {};
	inputParamsContainer.inputParams = inputParams;
	
	$.ajax ({
		headers: {
			"Content-Type": "application/json"
		},
		url: ruIP + ruPort + planningDB + planningEN + 'exec/procedureold/dbo.sp_Calendar_Lineup',
		type: "POST",
		data: JSON.stringify(inputParamsContainer),
		success: function(data) {
			var lnup_length;
			var data_length;
			lnup_LineupDetail = data[0];
			
			if(data.length > 0) {
				if(lnup_LineupDetail.length > 0) {
					lnup_length = lnup_LineupDetail.length;
					data_length = data.length;
					
					for(var key in lnup_LineupDetail) {
						GetPlanGUIDForPreLineupView(parseInt(key), lnup_length, data_length, lnup_LineupDetail[key]);
					}
				}
				else {
					LineupCalendarLoad();
				}
			}
			else {
				LineupCalendarLoad();
			}
		}
	});
}

function GetPlanGUIDForPreLineupView(key, lnup_length, data_length, lnupObj) {
	$.getJSON(ruIP + ruPort + planningDB + planningEN + "read/trans/Lineup_Plan?where=\"Lineup_GUID = '"+lnupObj.Lineup_GUID+"'\"", function( pdata ) {
		var tempPGUID = pdata[0].Plan_GUID;
		(pdata.length >= 0) ? lnupObj.Plan_GUID = tempPGUID : lnupObj.Plan_GUID = "";
		
		if(lnup_length == key + 1) {
			if(data_length > 0) {
				if(lnup_length <= 0) {
					LineupCalendarLoad();
				}
			}
			
			for(var key2 in lnup_LineupDetail) {
				FindLineupDetailMachines(parseInt(key2), lnup_LineupDetail[key2].Lineup_GUID);
			}
		}
	});	
}

function FindLineupDetailMachines(index, lnupGuid) {
	var jqxhrLineupMachines = $.getJSON(ruIP + ruPort + planningDB + planningEN + "read/dbo/v_LineupStepDetail?where=\"IsActive = '1' AND Lineup_GUID = '"+lnupGuid+"'\"", function() {
		var LineupMachineData = jQuery.parseJSON(jqxhrLineupMachines.responseText);
		
		lnup_LineupDetail[index].MachineTypeGUIDS = "";
		lnup_LineupDetail[index].MachineGUIDS     = "";
		lnup_LineupDetail[index].Machines         = "";
		lnup_LineupDetail[index].LineupStepGUIDS  = "";
		lnup_LineupDetail[index].Capacities		  = "";
		
		for(var key in LineupMachineData) {
			lnup_LineupDetail[index].MachineTypeGUIDS += LineupMachineData[key].MachineType_GUID;
			lnup_LineupDetail[index].MachineGUIDS     += LineupMachineData[key].Machine_GUID;
			lnup_LineupDetail[index].Machines         += LineupMachineData[key].MachineDisplayName;
			lnup_LineupDetail[index].LineupStepGUIDS  += LineupMachineData[key].Lineup_Step_GUID;
			(LineupMachineData[key].load_capacity_kg) ? lnup_LineupDetail[index].Capacities += LineupMachineData[key].load_capacity_kg : lnup_LineupDetail[index].Capacities += "0";
			
			if((parseInt(key) + 1) < LineupMachineData.length) {
				lnup_LineupDetail[index].MachineTypeGUIDS += "_";
				lnup_LineupDetail[index].MachineGUIDS     += "_";
				lnup_LineupDetail[index].Machines         += "_";
				lnup_LineupDetail[index].LineupStepGUIDS  += "_";
				lnup_LineupDetail[index].Capacities 	  += "_";
			}
		}

		if((index + 1) == lnup_LineupDetail.length) {
			setTimeout(function() {
				LineupCalendarLoad();
			},100);
		}
	});
}

function LineupCalendarLoad() {
	var planindex  = 0;
	var trHead     = '';
	var trBody     = '';
	var beginDate  = $('#plan_week_selector').val();
	
	trHead += '<tr><th class="main-header" colspan="8">'+currentWeek+'</th></tr>';
	trHead += '<tr><th class="day-header"></th>';
	
	for(var i = 0; i < 7; i++){
		var firstDWeek = $('#plan_week_selector').val();
		var date = moment(firstDWeek).add(i,'days').format("dddd, Do MMM");
		trHead += '<th class="day-header">'+date+'</th>';
	}
	
	trHead += '</tr>';
	
	$("#lineup_calendar_view thead").append(trHead);
	
	for(var i = 0; i < 3; i++) {
		
		if(i == 0) {
			trBody += '<tr><th class="time-header">'+languagePack.common.first+'</th>';
		}
		else if(i == 1) {
			trBody += '<tr><th class="time-header">'+languagePack.common.second+'</th>';
		}
		else {
			trBody += '<tr><th class="time-header">'+languagePack.common.third+'</th>';
		}
		
		var opGuid = "";
		var heGuid = "";
		var loGuid = "";
		
		for (var j = 0; j < 7; j++){
			var date = moment(beginDate).add(j,'days').format("MM/DD/YYYY");
			trBody += '<td ShiftDate="'+date+'" Shift="'+(i+1)+'" class="example-td';
			
			var rowClassSet = false;

			for(var key in lnup_LineupDetail) {
				var MachineTypeArr;
				var jumboExists = false;
				var scoopExists = false;
				var lineupCrewBoxColor = "#5084B3";
				
				(!lnup_LineupDetail[key].Plan_GUID || lnup_LineupDetail[key].Plan_GUID == "null" || lnup_LineupDetail[key].Plan_GUID == "") ? lineupCrewBoxColor = "#A5ADB5" : lineupCrewBoxColor = "#5084B3";
				
				if(lnup_LineupDetail[key].MachineTypeGUIDS) {
					MachineTypeArr = lnup_LineupDetail[key].MachineTypeGUIDS.split("_");
				}
				
				if(!(MachineTypeArr.indexOf(jumboMachineTypesGuid) == -1 && MachineTypeArr.indexOf(simbaMachineTypesGuid) == -1)) {
					jumboExists = true;
				}
				
				if(!(MachineTypeArr.indexOf(scoopMachineTypesGuid[0].MachineType_GUID) == -1 && MachineTypeArr.indexOf(scoopMachineTypesGuid[1].MachineType_GUID) == -1)) {
					scoopExists = true;
				}
				
				if(moment(lnup_LineupDetail[key].ShiftDate.split("Z")[0]).format("MM/DD/YYYY") == date && lnup_LineupDetail[key].Shift == (i+1)) {
					
					
					if(!rowClassSet) {
						trBody += ' lineup-row">';
						rowClassSet = true;
					}					
					
					if(opGuid == "" || opGuid != lnup_LineupDetail[key].Operator_GUID) {
						if(opGuid != lnup_LineupDetail[key].Operator_GUID && opGuid != "") {
							trBody += '</div>';
						}
						trBody += '<div class="lineupOuterBox" style="margin-bottom:4px; border: 1px solid rgba(0,0,0,0.3); position:relative;">';
						(UserData[0].RoleDisplayName == 'SuperAdmin' || UserData[0].RoleDisplayName == 'Admin') ? trBody += '<div onclick="RemoveLineup(\''+lnup_LineupDetail[key].Lineup_GUID+'\')" class="lineupDeleteBtn">x</div>' : false;
						trBody += '<div class="lineupCrewBox" onclick="ExpandCrewBox(this)" style="background: '+lineupCrewBoxColor+'">';
						trBody += '<div class="triangle tri_up"></div>';
						trBody += '<table>';
						trBody += '<tr><td style="text-align:right">'+languagePack.planning.op+':</td><td class="operatorCrewCell" OperatorGUID="'+lnup_LineupDetail[key].Operator_GUID+'">'+lnup_LineupDetail[key].OperatorName+'</td></tr>';
						
						if(lnup_LineupDetail[key].HelperName) {
							trBody += '<tr><td style="text-align:right">'+languagePack.planning.he+':</td><td class="helperCrewCell" HelperGUID="'+lnup_LineupDetail[key].Helper_GUID+'">'+lnup_LineupDetail[key].HelperName+'</td></tr>';
						}
						
						trBody += '</table>';
						trBody += '</div>';
						
						trBody += '<div class="lineupLocationChecklistBox">';
						trBody += '<div class="triangle tri_up"></div>';
						trBody += '<table>';
						trBody += '<tr><td class="checklistLocation" ChecklistLocationGUID="'+lnup_LineupDetail[key].Location_GUID+'" onclick="ExpandLocationChecklistBox(this)" style="width:250px; cursor:pointer">'+lnup_LineupDetail[key].LocationDisplayName+'</td></tr>';
						trBody += '</table>';
						
						for(var key2 in lineupChecklistTypes) {
							if(!((lineupChecklistTypes[key2].DisplayName == explosives_checklist && !jumboExists) || (lineupChecklistTypes[key2].DisplayName == haulage_checklist && !scoopExists))) {
								if(!(lineupChecklistTypes[key2].DisplayName == process_checklist && scoopExists)) {
									trBody += '<table class="lineupChecklistTypeTable">';
									trBody += '<tr><td><div class="qsection"><div class="checklist-cnotready" id="'+lnup_LineupDetail[key].Lineup_GUID + lineupChecklistTypes[key2].ChecklistType_GUID+'" onclick="checklist_Click(this,' + "'" + lineupChecklistTypes[key2].ChecklistType_GUID + "','" + lineupChecklistTypes[key2].DisplayName + "','" + lnup_LineupDetail[key].Lineup_GUID + "','" + lnup_LineupDetail[key].MachineTypeGUIDS + "','" + lnup_LineupDetail[key].MachineGUIDS + "','" + lnup_LineupDetail[key].Machines + "','" + lnup_LineupDetail[key].Capacities + "','" + lnup_LineupDetail[key].LineupStepGUIDS + "'" + ')"></div><span class="checklist-row"><a href="#" onclick="checklist_Click(this, ' + "'" + lineupChecklistTypes[key2].ChecklistType_GUID + "','" + lineupChecklistTypes[key2].DisplayName + "','" + lnup_LineupDetail[key].Lineup_GUID + "','" + lnup_LineupDetail[key].MachineTypeGUIDS + "','" + lnup_LineupDetail[key].MachineGUIDS + "','" + lnup_LineupDetail[key].Machines + "','" + lnup_LineupDetail[key].Capacities + "','" + lnup_LineupDetail[key].LineupStepGUIDS + "'" + ')">'+lineupChecklistTypes[key2].DisplayName+'</a></span></div></td></tr>';
									trBody += '</table>';
								}
							}
						}
						
						trBody += '</div>';
					}
					else {
						trBody += '<div class="lineupLocationChecklistBox">';
						trBody += '<div class="triangle tri_up"></div>';
						trBody += '<table>';
						trBody += '<tr><td onclick="ExpandLocationChecklistBox(this)" style="width:250px; cursor:pointer">'+lnup_LineupDetail[key].LocationDisplayName+'</td></tr>';
						trBody += '</table>';
						
						for(var key2 in lineupChecklistTypes) {
							if(!((lineupChecklistTypes[key2].DisplayName == explosives_checklist && !jumboExists) || (lineupChecklistTypes[key2].DisplayName == haulage_checklist && !scoopExists))) {
								if(!(lineupChecklistTypes[key2].DisplayName == process_checklist && scoopExists)) {
									trBody += '<table class="lineupChecklistTypeTable">';
									trBody += '<tr><td><div class="qsection"><div class="checklist-cnotready" id="'+lnup_LineupDetail[key].Lineup_GUID + lineupChecklistTypes[key2].ChecklistType_GUID+'" onclick="checklist_Click(this,' + "'" + lineupChecklistTypes[key2].ChecklistType_GUID + "','" + lineupChecklistTypes[key2].DisplayName + "','" + lnup_LineupDetail[key].Lineup_GUID + "','" + lnup_LineupDetail[key].MachineTypeGUIDS + "','" + lnup_LineupDetail[key].MachineGUIDS + "','" + lnup_LineupDetail[key].Machines + "','" + lnup_LineupDetail[key].Capacities + "','" + lnup_LineupDetail[key].LineupStepGUIDS + "'" + ')"></div><span class="checklist-row"><a href="#" onclick="checklist_Click(this, ' + "'" + lineupChecklistTypes[key2].ChecklistType_GUID + "','" + lineupChecklistTypes[key2].DisplayName + "','" + lnup_LineupDetail[key].Lineup_GUID + "','" + lnup_LineupDetail[key].MachineTypeGUIDS + "','" + lnup_LineupDetail[key].MachineGUIDS + "','" + lnup_LineupDetail[key].Machines + "','" + lnup_LineupDetail[key].Capacities + "','" + lnup_LineupDetail[key].LineupStepGUIDS + "'" + ')">'+lineupChecklistTypes[key2].DisplayName+'</a></span></div></td></tr>';
									trBody += '</table>';
								}
							}
						}
						
						trBody += '</div>';
					}
					opGuid = lnup_LineupDetail[key].Operator_GUID;
					heGuid = lnup_LineupDetail[key].Helper_GUID;
					loGuid = lnup_LineupDetail[key].Location_GUID;
				}
			}
			
			if(opGuid == "" && !rowClassSet) {
				trBody += ' lineup-row-empty"><span class="title-row-empty">'+languagePack.prelineup.noLineupsAvailable+'</span>';
			}
			else {
				trBody += '</div>';
			}
			
			opGuid = "";
			heGuid = "";
			loGuid = "";

			planindex++;
			
			trBody += '<div class="addNewLineupContainer"><div class="addNewLineupBtn" onclick="GotoLineupGeneration(this)">'+languagePack.planning.addLineup+'</div></div>';
			
			trBody += '</td>';				
		}
		
		trBody += '</tr>';
	}
	
	$("#lineup_calendar_view tbody").append(trBody);
	
	ServiceComplete();
	checklist_ready();
}

$(window).resize(function() {
    $(".modal-box").css({
        "top": "40px",
		"left": "15%",
		"position": "fixed",
		"height": "calc(100% - 55px)",
		"overflow-y": "auto",
		"width": "70%"
    });
});
	 
$(window).resize();

$('#lineup_calendar_view').on('click', '.lineup-row', function () {
	var th = $('#lineup_calendar_view th').eq($(this).index() + 1);
	lnup_dayCheck = th.text();
});

function GotoLineupGeneration(element) {
	var shiftDate = $(element).closest("td").attr("ShiftDate");
	var shift     = $(element).closest("td").attr("Shift");
	
	var validDate1 = moment(shiftDate).isSame(moment().format('MM/DD/YYYY'));
	var validDate2 = (moment().valueOf() - moment(shiftDate).valueOf()) >= 0;

	
	if(validDate1 || validDate2 || UserData[0].RoleDisplayName == 'SuperAdmin' || UserData[0].RoleDisplayName == 'Admin') {
		OpenLineupWindow(shiftDate, shift);
	}
	else {
		DisplayAlert(languagePack.message.alert,languagePack.prelineup.createLateLinuep);
	}
}

function ExpandCrewBox(element) {
	if($(element).find(".triangle").hasClass("tri_up")) {
		$(element).find(".triangle").removeClass("tri_up");
		$(element).find(".triangle").addClass("tri_down");
		
		$(element).parent().find(".lineupLocationChecklistBox").each(function() {
			$(this).css("display","block");
		});
	}
	else if($(element).find(".triangle").hasClass("tri_down")) {
		$(element).find(".triangle").removeClass("tri_down");
		$(element).find(".triangle").addClass("tri_up");
		
		$(element).parent().find(".lineupLocationChecklistBox").each(function() {
			$(this).css("display","none");
		});
	}
}
	
function ExpandLocationChecklistBox(element) {
	if($(element).closest("table").prev().hasClass("tri_up")) {
		$(element).closest("table").prev().removeClass("tri_up");
		$(element).closest("table").prev().addClass("tri_down");
		
		$(element).closest(".lineupLocationChecklistBox").find(".lineupChecklistTypeTable").each(function() {
			$(this).css("display","block");
		});
	}
	else if($(element).closest("table").prev().hasClass("tri_down")) {
		$(element).closest("table").prev().removeClass("tri_down");
		$(element).closest("table").prev().addClass("tri_up");
		
		$(element).closest(".lineupLocationChecklistBox").find(".lineupChecklistTypeTable").each(function() {
			$(this).css("display","none");
		});
	}
}

function checklist_ready() {
	var planindex2 = 0;
	var jqxhrStatus = $.getJSON(ruIP + ruPort + planningDB + planningEN + "read/bi/Lineup_FormStatus?where=\"ShiftDate >= '"+WeekBeginTime+"' AND ShiftDate <= '"+WeekEndTime+"' AND Area_GUID = '"+area_GF+"'\"", function() {
		lnup_statusData = $.parseJSON(jqxhrStatus.responseText);
		var clCount = 0;
		
		$(".example-td").each(function(index) {
			var currentCell = $(this);
			for(var key in lnup_statusData) {
				
				if(lnup_statusData[key].Status == "Ready"){
					$("#"+lnup_statusData[key].Lineup_GUID+lnup_statusData[key].ChecklistType_GUID).removeClass().addClass("checklist-cready");
				}
				else if(lnup_statusData[key].Status == "NotReady"){
					$("#"+lnup_statusData[key].Lineup_GUID+lnup_statusData[key].ChecklistType_GUID).removeClass().addClass("checklist-cnotready");
				}
			}
		});
		
		
		$(".lineup-row").each(function() {
			var cell = $(this);
			var numberReady = 0;
			$(".checklist-cready", this).each(function() {
				numberReady++;
			});
			
			if(numberReady == lnup_checkListLength) {
				cell.find(".generateLineupBtn").removeClass("buttonInactive");
			}
		});
		
		UpdateLineUpReadyStatus();
		
	});
}

function checklist_Click(element, checklistGUID, checklistName, pGUID, MachineTypeGUIDS, MachineGUIDS, Machines, capacities, LineupStepGUIDS) {
		var qsection = $(element).closest(".qsection").find("div:first-child");
		
		if(!qsection.hasClass('checklist-cpending')) {
			currentChecklistIcon = $(element).parent().prev();
			
			var locationGuid = $(element).closest(".lineupLocationChecklistBox").find(".checklistLocation").attr("ChecklistLocationGUID");
			var locationName = $(element).closest(".lineupLocationChecklistBox").find(".checklistLocation").html();
			var shiftDate    = $(element).closest(".lineup-row").attr("ShiftDate");
			var shift        = $(element).closest(".lineup-row").attr("Shift");
			var operatorGuid = $(element).closest(".lineupOuterBox").find(".operatorCrewCell").attr("OperatorGUID");
			currentChecklist = $(element);
			
			lnup_planGUID = pGUID;
			var appendthis =  ("<div class='modal-overlay js-modal-close'></div>");
			
			$("body").append(appendthis);
			OpenPopupWrapper();
			  
			$(".modal-overlay").fadeTo(500, 0.7);
			$('#lineup_checklist_form').fadeIn($(this).data());
			
			$("#checklist_close").click(function() {
				ClosePopupWrapper();
				$(".modal-box, .modal-overlay").fadeOut(500, function() {
					$(".modal-overlay").remove();
				});

				$("#lineup_checklist_body").html(" ");
			});
			
			setTimeout(function() {
				$("#lineup_checklist_title").html(checklistName + " - " + lnup_dayCheck);		
				$("#lineup_checklist_title").closest("#lineup_checklist_form").attr("CheckListType", checklistName);
			}, 500);
			
			if(checklistName == materials_checklist) {
				materials_insert(checklistGUID, checklistName, pGUID, shiftDate);
			}
			else if(checklistName == process_checklist) {		
				process_insert(checklistGUID, checklistName, pGUID, shiftDate);
			}
			else if(checklistName == explosives_checklist) {
				explosives_insert(checklistGUID, checklistName, pGUID, shiftDate);
			}
			else if(checklistName == haulage_checklist) {		
				haulage_insert(checklistGUID, checklistName, pGUID, locationName, locationGuid, shiftDate, capacities);
			}
			else if(checklistName == machineDownEvents) {
				down_events_insert(pGUID, shiftDate, shift, locationGuid, operatorGuid, MachineGUIDS, Machines);
			}
			else {
				checklist_insert(checklistGUID, checklistName, pGUID, MachineTypeGUIDS, MachineGUIDS, Machines, LineupStepGUIDS, shiftDate);
			}
		}
		else {
			DisplayAlert(languagePack.common.pending,languagePack.prelineup.pendingChecklist);
		}
}

function haulage_insert(checklistGUID, checklistName, pGUID, locationName, locationGuid, shiftDate, capacities) {
	lnup_planGUID = pGUID;
	
	var index = 0;
	var capacity = 0;
	(capacities != "null") ? capacity = parseInt(capacities) / 1000 : false;
	
	var checkTables = '<table LineupGUID="'+lnup_planGUID+'" HaulageLocationGUID="'+locationGuid+'" HaulageLocationName="'+locationName+'" Capacity="'+capacity+'" id="haulage-table" class="checklist-table" ShiftDate="'+shiftDate+'"><col width="50"><thead></thead><tbody></tbody></table>';
	$("#lineup_checklist_body").append(checkTables);
	var trTitleHead = '<tr><th class="main-header" colspan="7">'+languagePack.prelineup.haulage+'</th></tr>';
	$('#haulage-table thead').append(trTitleHead);
	var trHead = '<tr><th>'+languagePack.common.location+'</th><th>'+languagePack.prelineup.production+'</th><th>'+languagePack.prelineup.rehandle+'</th><th>'+languagePack.prelineup.numLoads+'</th><th>'+languagePack.prelineup.tons+'</th><th>'+languagePack.prelineup.toLocation+'</th></tr>';
	$('#haulage-table thead').append(trHead);

	var trBody   = '';
	
	trBody += '<tr index="'+index+'" id="haulage_row_'+index+'" class="checkrow haulageRow">';
	trBody += '<td style="width:225px" class="HaulageLocationCell" HaulageLocationGUID="'+locationGuid+'">'+locationName+'</td>';
	trBody += '<td><input type="radio" class="btn-radio formElement" elementType="radiogroup" id="haulage_mineral_'+index+'" name="haulage_mineral_waste_'+index+'" value="1"></td>';
	trBody += '<td><input type="radio" class="btn-radio formElement" elementType="radiogroup" id="haulage_waste_'+index+'" name="haulage_mineral_waste_'+index+'" value="1"></td>';
	trBody += '<td><input type="number" class="numberLoads formElement" id="haulage_number_loads_'+index+'" elementType="number" min="0" onkeypress="return event.charCode >= 48 && event.charCode <= 57"></td>';
	trBody += '<td><input disabled type="number" class="numberLoads formElement" id="haulage_tons_'+index+'" elementType="number" min="0" onkeypress="return event.charCode >= 48 && event.charCode <= 57" value="0"></td>';
	trBody += '<td><select style="width:225px" class="locationDropOff formElement" id="haulage_actual_location_'+index+'" elementType="select"></select></td>';
	trBody += '</tr>';
	$('#haulage-table tbody').append(trBody);
	$('#haulage-table tbody').append('<tr id="haulage_button_row"><td colspan="7" style="text-align:right"><button id="haulage_add_row" onclick="HaulageAddRow(this)" class="btn btn-small btn-addrow" >'+languagePack.common.addRow+'</button></td><tr>');
	
	$(".locationDropOff").each(function() {
		var thisId = $(this).attr("id");
		$(this).html("<option value='0'>"+languagePack.common.selectOption+"</option>");
		
		var locationDropOff = document.getElementById(thisId);
		
		for(var key in preLineupMachineLocations) {
			locationDropOff.options[locationDropOff.options.length] = new Option(preLineupMachineLocations[key].DisplayName, preLineupMachineLocations[key].Location_GUID);
		}
	});
	
	$("#haulage_number_loads_"+index).on("change", function () {
		var value = $(this).val();
		$("#haulage_tons_"+index).val(capacity * value);
	});
	
	$("#haulage_number_loads_"+index).on("keydown", function () {
		var value = $(this).val();
		console.log(value);
		$("#haulage_tons_"+index).val(capacity * value);
	});
	
	var jqxhrHaulageDetails = $.getJSON(ruIP + ruPort + planningDB + planningEN + "read/trans/Lineup_HaulageDetail?where=\"Lineup_GUID = '"+ lnup_planGUID +"' AND IsActive = '1'\"", function() {
		var haulageDetails = $.parseJSON(jqxhrHaulageDetails.responseText);
		
		for(var key in haulageDetails) {
			if(parseInt(key) > 0) {
				$("#haulage_add_row").click();
			}
		}
		
		setTimeout(function() {
			for(var key in haulageDetails) {
				$("#haulage_row_" + key).attr("LineupHaulageDetailGUID", haulageDetails[key].Lineup_HaulageDetail_GUID);
				
				if(haulageDetails[key].Prod_Rehandle) {
					$("#haulage_mineral_" + key).prop("checked", true);
				}
				else {
					$("#haulage_waste_" + key).prop("checked", true);					
				}

				$("#haulage_actual_location_" + key).val(haulageDetails[key].ActualLocation_GUID);
				$("#haulage_number_loads_" + key).val(haulageDetails[key].Loads);
				$("#haulage_tons_"+key).val(capacity * haulageDetails[key].Loads);
			}
		},500);
	});
}
//HERE
function HaulageAddRow(element) {
	var locationGuid = $(element).closest('.checklist-table').attr("HaulageLocationGUID");
	var locationName = $(element).closest('.checklist-table').attr('HaulageLocationName');
	var capacity	 = $(element).closest('.checklist-table').attr('Capacity');
	
	var rowIndex = 0;
	
	$(element).closest('.checklist-table').find(".haulageRow").each(function(index) {
		$(this).attr("index", index);
		rowIndex++;
	});

	if(rowIndex >= 1 && $("#haulage_remove_row").length <= 0) {
		$("#haulage_add_row").after('<button style="margin-left:4px;" id="haulage_remove_row" onclick="HaulageRemoveRow(this)" class="btn btn-small btn-removerow">Eliminar fila</button>');
	}

	var trBody   = '';
	
	trBody += '<tr index="'+rowIndex+'" id="haulage_row_'+rowIndex+'" class="checkrow haulageRow">';
	trBody += '<td style="width:225px" class="HaulageLocationCell" HaulageLocationGUID="'+locationGuid+'">'+locationName+'</td>';
	trBody += '<td><input type="radio" class="btn-radio formElement" elementType="radiogroup" id="haulage_mineral_'+rowIndex+'" name="haulage_mineral_waste_'+rowIndex+'" value="1"></td>';
	trBody += '<td><input type="radio" class="btn-radio formElement" elementType="radiogroup" id="haulage_waste_'+rowIndex+'" name="haulage_mineral_waste_'+rowIndex+'" value="1"></td>';
	trBody += '<td><input type="number" class="numberLoads formElement" id="haulage_number_loads_'+rowIndex+'" elementType="number" min="0" onkeypress="return event.charCode >= 48 && event.charCode <= 57"></td>';
	trBody += '<td><input disabled type="number" class="numberLoads formElement" id="haulage_tons_'+rowIndex+'" elementType="number" min="0" onkeypress="return event.charCode >= 48 && event.charCode <= 57" value="0"></td>';
	trBody += '<td><select style="width:225px" class="locationDropOff formElement" id="haulage_actual_location_'+rowIndex+'" elementType="select"></select></td>';
	trBody += '</tr>';
	
	$("#haulage_button_row").before(trBody);
	
	var thisId = $("#haulage_actual_location_" + rowIndex).attr("id");
	$("#haulage_actual_location_" + rowIndex).html("<option value='0'>"+languagePack.common.selectOption+"</option>");
	
	var locationDropOff = document.getElementById(thisId);
	
	for(var key in preLineupMachineLocations) {
		locationDropOff.options[locationDropOff.options.length] = new Option(preLineupMachineLocations[key].DisplayName, preLineupMachineLocations[key].Location_GUID);
	}
	
	$("#haulage_number_loads_"+rowIndex).on("change", function () {
		var value = $(this).val();
		$("#haulage_tons_"+rowIndex).val(capacity * value);
	});
	
	$("#haulage_number_loads_"+rowIndex).on("keydown", function () {
		var value = $(this).val();
		console.log(value);
		$("#haulage_tons_"+rowIndex).val(capacity * value);
	});
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
	
	var checkTables = '<table id="downs-table" class="checklist-table" LineupGUID="'+pGUID+'" ShiftDate="'+shiftDate+'" Shift="'+shift+'" LocationGUID="'+locationGuid+'" OperatorGUID="'+operatorGuid+'" MachineGUIDS="'+MachineGUIDS+'" MachineList="'+MachineList+'"><col width="50"><thead></thead><tbody></tbody></table>';
	$("#lineup_checklist_body").append(checkTables);
	var trTitleHead = '<tr><th class="main-header" colspan="5">'+languagePack.prelineup.machineDownEvent+'</th></tr>';
	$('#downs-table thead').append(trTitleHead);
	var trHead = '<tr><th>'+languagePack.prelineup.downCode+'</th><th>'+languagePack.prelineup.startDownTime+'</th><th>'+languagePack.prelineup.responseTime+'</th><th>'+languagePack.prelineup.endDownTime+'</th><th>'+languagePack.prelineup.observations+'</th></tr>';
	$('#downs-table thead').append(trHead);
	
	var trBody = '';
	
	trBody += '<tr index="'+index+'" id="downs_row_'+index+'" class="checkrow downsRow">';
	trBody += '<td valign="top"><select style="width:180px !important" class="formElement downCodeSelect" elementType="select" id="down_code_select_'+index+'"></select></td>';
	trBody += '<td valign="top"><input style="width:190px !important" class="preLineupDate formElement downCodeBeginTime" type="text" id="down_code_begin_time_'+index+'" elementtype="date"></td>';
	trBody += '<td valign="top"><input style="width:190px !important" class="preLineupDate formElement downCodeArrivalTime" type="text" id="down_code_arrival_time_'+index+'" elementtype="date"></td>';
	trBody += '<td valign="top"><input style="width:190px !important" class="preLineupDate formElement downCodeEndTime" type="text" id="down_code_end_time_'+index+'" elementtype="date"></td>';
	trBody += '<td valign="top"><textarea style="width:340px; max-width:350px; height:75px" class="formElement downCodeComments" id="down_code_comments_'+index+'" elementType="textarea"></textarea></td>';
	trBody += '</tr>';
	
	$('#downs-table tbody').append(trBody);
	
	$('#downs-table tbody').append('<tr id="downs_button_row"><td colspan="5" style="text-align:right"><button id="down_add_row" onclick="DownsAddRow(this)" class="btn btn-small btn-addrow" >'+languagePack.common.addRow+'</button></td><tr>');
	
	var codesTable = '';
	
	if(downCodesChartData.length > 0) {
		codesTable += '<table class="checklist-table reasonCode-table">';
	}
	
	for(var key in downCodesChartData) {
		if(parseInt(key) % 3 == 0) {
			codesTable += '<tr>';
		}
		codesTable += '<td>'+downCodesChartData[key].ReasonCode+'</td><td>'+downCodesChartData[key].ReasonCodeDesc+'</td>';
		if(parseInt(key) % 3 == 2) {
			codesTable += '</tr>';
		}
	}
	
	if(downCodesChartData.length > 0) {
		codesTable += '</table>';
	}
	
	$("#lineup_checklist_body").append(codesTable);
	
	$(".downCodeSelect").each(function() {
		var thisId = $(this).attr("id");
		$(this).html("<option value='0'>"+languagePack.common.selectOption+"</option>");
		
		var machineDownCodes = document.getElementById(thisId);
		
		for(var key in downCodesDDLData) {
			machineDownCodes.options[machineDownCodes.options.length] = new Option(downCodesDDLData[key].ReasonCode, downCodesDDLData[key].DownReasonCode_GUID);
		}
	});
	
	setTimeout(function() {
		$(".preLineupDate").datetimepicker({ minDate:'-1970/01/02', maxDate:'+1970/01/02', datepicker:true, timepicker:true, hours12:false, format:'d/m/Y H:i' });
	},50);
	
	var jqxhrDownEvents = $.getJSON(ruIP + ruPort + planningDB + planningEN + "read/trans/MachineDownEvent?where=\"Lineup_GUID = '"+ lnup_planGUID +"' AND IsActive = '1' Order By Created ASC\"", function() {
		var downEvents = $.parseJSON(jqxhrDownEvents.responseText);
		
		for(var key in downEvents) {
			if(parseInt(key) > 0) {
				$("#down_add_row").click();
			}
		}
		
		setTimeout(function() {
			for(var key in downEvents) {
				var beginTime	= "";
				var arrivalTime	= "";
				var endTime		= "";

				if(downEvents[key].DownStartTime) {
					(!(downEvents[key].DownStartTime == "" || downEvents[key].DownStartTime < moment("01/01/1999").format())) ? beginTime = moment(downEvents[key].DownStartTime.split("Z")[0]).format("DD/MM/YYYY HH:mm") : false;
				}
				
				if(downEvents[key].MaintenanceArrivalTime) {
					(!(downEvents[key].MaintenanceArrivalTime == "" || downEvents[key].MaintenanceArrivalTime < moment("01/01/1999").format())) ? arrivalTime = moment(downEvents[key].MaintenanceArrivalTime.split("Z")[0]).format("DD/MM/YYYY HH:mm") : false;
				}
				
				if(downEvents[key].DownFinishTime) {
					(!(downEvents[key].DownFinishTime == "" || downEvents[key].DownFinishTime < moment("01/01/1999").format())) ? endTime = moment(downEvents[key].DownFinishTime.split("Z")[0]).format("DD/MM/YYYY HH:mm") : false;
				}
				
				
				$("#downs_row_" + key).attr("MachineDownEventGUID", (downEvents[key].MachineDownEvent_GUID) ? downEvents[key].MachineDownEvent_GUID : "");
				$("#down_code_select_" + key).val((downEvents[key].DownReasonCode_GUID) ? downEvents[key].DownReasonCode_GUID : "");
				$("#down_code_begin_time_" + key).val(beginTime);
				$("#down_code_arrival_time_" + key).val(arrivalTime);
				$("#down_code_end_time_" + key).val(endTime);
				$("#down_code_comments_" + key).val((downEvents[key].Comment) ? downEvents[key].Comment : "");
			}
		},500);
	});
}
//HERE
function DownsAddRow(element) {
	
	var rowIndex = 0;
	
	$(element).closest('.checklist-table').find(".downsRow").each(function(index) {
		$(this).attr("index", index);
		rowIndex++;
	});

	if(rowIndex >= 1 && $("#down_remove_row").length <= 0) {
		$("#down_add_row").after('<button style="margin-left:4px;" id="down_remove_row" onclick="DownsRemoveRow(this)" class="btn btn-small btn-removerow">Eliminar fila</button>');
	}

	var trBody   = '';
	
	trBody += '<tr index="'+rowIndex+'" id="downs_row_'+rowIndex+'" class="checkrow downsRow">';
	trBody += '<td valign="top"><select style="width:180px !important" class="formElement downCodeSelect" elementType="select" id="down_code_select_'+rowIndex+'"></select></td>';
	trBody += '<td valign="top"><input style="width:190px !important" class="preLineupDate formElement downCodeBeginTime" type="text" id="down_code_begin_time_'+rowIndex+'" elementtype="date"></td>';
	trBody += '<td valign="top"><input style="width:190px !important" class="preLineupDate formElement downCodeArrivalTime" type="text" id="down_code_arrival_time_'+rowIndex+'" elementtype="date"></td>';
	trBody += '<td valign="top"><input style="width:190px !important" class="preLineupDate formElement downCodeEndTime" type="text" id="down_code_end_time_'+rowIndex+'" elementtype="date"></td>';
	trBody += '<td valign="top"><textarea style="width:340px; max-width:350px; height:75px" class="formElement downCodeComments" id="down_code_comments_'+rowIndex+'" elementType="textarea"></textarea></td>';
	trBody += '</tr>';
	
	$("#downs_button_row").before(trBody);
	
	setTimeout(function() {
		$("#down_code_begin_time_" + rowIndex).datetimepicker({ minDate:'-1970/01/02', maxDate:'+1970/01/02', datepicker:true, timepicker:true, hours12:false, format:'d/m/Y H:i' });
		$("#down_code_arrival_time_" + rowIndex).datetimepicker({ minDate:'-1970/01/02', maxDate:'+1970/01/02', datepicker:true, timepicker:true, hours12:false, format:'d/m/Y H:i' });
		$("#down_code_end_time_" + rowIndex).datetimepicker({ minDate:'-1970/01/02', maxDate:'+1970/01/02', datepicker:true, timepicker:true, hours12:false, format:'d/m/Y H:i' });
	},50);
	
	var thisId = $("#down_code_select_" + rowIndex).attr("id");
	$("#down_code_select_" + rowIndex).html("<option value='0'>"+languagePack.common.selectOption+"</option>");
	
	var machineDownCodes = document.getElementById(thisId);
	
	for(var key in downCodesDDLData) {
		machineDownCodes.options[machineDownCodes.options.length] = new Option(downCodesDDLData[key].ReasonCode, downCodesDDLData[key].DownReasonCode_GUID);
	}
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
	lnup_dataQ = [];
	lnup_planGUID = pGUID;
	var jqxhrArr2 = $.getJSON(ruIP + ruPort + planningDB + planningEN + "read/dbo/v_LineupMeasureDetail?where=\"Lineup_GUID = '"+ lnup_planGUID +"' AND MeasureType = 'Explosivo' AND IsActive = '1' ORDER BY MeasureDisplayName ASC\"", function() {
		lnup_dataQ = $.parseJSON(jqxhrArr2.responseText);
		lnup_checklistType = checklistGUID;
		lnup_checkEdit = false;
		
		var checkTables = '<table id="explosives-table" class="checklist-table" ShiftDate="'+shiftDate+'"><col width="50"><thead></thead><tbody></tbody></table>';
		$("#lineup_checklist_body").append(checkTables);
		var trTitleHead = '<tr><th class="main-header" colspan="7">'+languagePack.prelineup.explosive+'</th></tr>';
		$('#explosives-table thead').append(trTitleHead);
		var trHead = '<tr><th>'+languagePack.common.num+'</th><th>'+languagePack.common.activity+'</th><th>'+languagePack.common.machine+'</th><th>'+languagePack.prelineup.explosive+'</th><th>'+languagePack.planning.plan+'</th><th>'+languagePack.prelineup.real+'</th><th>'+languagePack.prelineup.surplus+'</th></tr>';
		$('#explosives-table thead').append(trHead);
		
		$.each(lnup_dataQ, function (i, item) {
			var trBody = '';
			var num = i+1;
			
			trBody += '<tr class="checkrow" checklistquestion="'+item.Lineup_MeasureDetail_GUID+'">';
			trBody += '<td>'+ num +'</td>';
			trBody += '<td>' + item.StepDisplayName + '</td>';
			trBody += '<td>' + item.MachineDisplayName + '</td>';
			trBody += '<td>' + item.MeasureDisplayName + '</td>';
			trBody += '<td>' + ((item.PlannedValue == null) ? " " : item.PlannedValue) + '</td>';
			trBody += '<td><input class="formElement" elementType="textbox" type="text" id="Real-'+item.Lineup_MeasureDetail_GUID+'"></input></td>';
			trBody += '<td><input class="formElement" elementType="textbox" type="text" id="Sobrante-'+item.Lineup_MeasureDetail_GUID+'"></input></td>';
			trBody += '</tr>';
			$('#explosives-table tbody').append(trBody);
			
			$('#Real-'+item.Lineup_MeasureDetail_GUID).val(item.ActualValue_1);
			$('#Sobrante-'+item.Lineup_MeasureDetail_GUID).val(item.ActualValue_2);
		});
	});
}

function materials_insert(checklistGUID, checklistName, pGUID, shiftDate) {
	lnup_dataQ = [];
	lnup_planGUID = pGUID;
	var jqxhrArr2 = $.getJSON(ruIP + ruPort + planningDB + planningEN + "read/dbo/v_LineupMeasureDetail?where=\"Lineup_GUID = '"+ lnup_planGUID +"' AND MeasureType = 'Material' AND IsActive = '1' ORDER BY MeasureDisplayName ASC\"", function() {
		lnup_dataQ = $.parseJSON(jqxhrArr2.responseText);
		lnup_checklistType = checklistGUID;
		lnup_checkEdit = false;
		
		var checkTables = '<table id="materials-table" class="checklist-table" ShiftDate="'+shiftDate+'"><col width="50"><thead></thead><tbody></tbody></table>';
		$("#lineup_checklist_body").append(checkTables);
		var trTitleHead = '<tr><th class="main-header" colspan="7">'+languagePack.prelineup.material+'</th></tr>';
		$('#materials-table thead').append(trTitleHead);
		var trHead = '<tr><th>'+languagePack.common.num+'</th><th>'+languagePack.common.activity+'</th><th>'+languagePack.common.machine+'</th><th>'+languagePack.prelineup.material+'</th><th>'+languagePack.planning.plan+'</th><th>'+languagePack.prelineup.real+'</th></tr>';
		$('#materials-table thead').append(trHead);
		
		$.each(lnup_dataQ, function (i, item) {
			var trBody = '';
			var num = i+1;
			
			trBody += '<tr class="checkrow" checklistquestion="'+item.Lineup_MeasureDetail_GUID+'"><td>'+ num +'</td><td>' + item.StepDisplayName + '</td><td>' + item.MachineDisplayName + '</td><td>' + item.MeasureDisplayName + '</td><td>' + ((item.PlannedValue == null) ? " " : item.PlannedValue) + '</td>';
			trBody += '<td><input class="formElement" elementType="textbox" type="text" id="Real-'+item.Lineup_MeasureDetail_GUID+'"></input></td></tr>';
			$('#materials-table tbody').append(trBody);
			
			$('#Real-'+item.Lineup_MeasureDetail_GUID).val(item.ActualValue_1);
		});
	});
}

function process_insert(checklistGUID, checklistName, pGUID, shiftDate) {
	lnup_dataQ = [];
	lnup_planGUID = pGUID;
	var jqxhrArr2 = $.getJSON(ruIP + ruPort + planningDB + planningEN + "read/dbo/v_LineupMeasureDetail?where=\"Lineup_GUID = '"+ lnup_planGUID +"' AND MeasureType = 'Proceso' AND IsActive = '1' ORDER BY MeasureDisplayName ASC\"", function() {
		lnup_dataQ = $.parseJSON(jqxhrArr2.responseText);
		lnup_checklistType = checklistGUID;
		lnup_checkEdit = false;
		
		var checkTables = '<table id="process-table" class="checklist-table" ShiftDate="'+shiftDate+'"><col width="50"><thead></thead><tbody></tbody></table>';
		$("#lineup_checklist_body").append(checkTables);
		var trTitleHead = '<tr><th class="main-header" colspan="7">'+languagePack.planning.process+'</th></tr>';
		$('#process-table thead').append(trTitleHead);
		var trHead = '<tr><th>'+languagePack.common.num+'</th><th>'+languagePack.common.activity+'</th><th>'+languagePack.planning.process+'</th><th>'+languagePack.prelineup.top+'</th><th>'+languagePack.prelineup.niche+'</th><th style="width: 170px; text-align:left">'+languagePack.prelineup.overflow1+'</th><th>'+languagePack.prelineup.overflow2+'</th></tr>';
		$('#process-table thead').append(trHead);
		
		$.each(lnup_dataQ, function (i, item) {
			var trBody = '';
			var num = i+1;
			
			trBody += '<tr class="checkrow" checklistquestion="'+item.Lineup_MeasureDetail_GUID+'"><td>'+ num +'</td><td>' + item.StepDisplayName + '</td><td>' + item.MeasureDisplayName + '</td>';
			trBody += '<td><input class="formElement" elementType="textbox" type="number" min="0" step="0.1" id="tope-'+item.Lineup_MeasureDetail_GUID+'"></input></td>';
			trBody += '<td><input class="formElement" elementType="textbox" type="number" min="0" step="0.1" id="nicho-'+item.Lineup_MeasureDetail_GUID+'"></input></td>';
			trBody += '<td><input class="formElement" elementType="textbox" type="number" min="0" step="0.1" id="desborde-'+item.Lineup_MeasureDetail_GUID+'"></input></td>';
			trBody += '<td><input class="formElement" elementType="textbox" type="number" min="0" step="0.1" id="descostre-'+item.Lineup_MeasureDetail_GUID+'"></input></td></tr>';
			$('#process-table tbody').append(trBody);
			
			$('#tope-'+item.Lineup_MeasureDetail_GUID).val(item.ActualValue_1);
			$('#nicho-'+item.Lineup_MeasureDetail_GUID).val(item.ActualValue_2);
			$('#desborde-'+item.Lineup_MeasureDetail_GUID).val(item.ActualValue_3);
			$('#descostre-'+item.Lineup_MeasureDetail_GUID).val(item.ActualValue_4);
		});
	});
}

function checklist_insert(checklistGUID, checklistName, pGUID, MachineTypeGUIDS, MachineGUIDS, Machines, LineupStepGUIDS, shiftDate) {
	var MachineTypeArr        = MachineTypeGUIDS.split("_");
	var machineGuidArr        = MachineGUIDS.split("_");
	var machineArr            = Machines.split("_");
	var lineupStepGuidArr     = LineupStepGUIDS.split("_");
	var machineTypeGuidString = "";
	
	for(var key in MachineTypeArr) {
		machineTypeGuidString += "'" + MachineTypeArr[key] + "',";
	}
	
	machineTypeGuidString += "'" + allMachineTypesGuid + "'";
	
	lnup_dataQ = [];
	lnup_planGUID = pGUID;
	var jqxhrArr2 = $.getJSON(ruIP + ruPort + planningDB + planningEN + "read/web/v_ChecklistQuestion?where=\"ChecklistType_GUID = '"+ checklistGUID +"' AND IsActive = '1' AND MachineType_GUID IN ("+machineTypeGuidString+") ORDER By Question_Name ASC\"", function() {
		lnup_dataQ = $.parseJSON(jqxhrArr2.responseText);
		lnup_checklistType = checklistGUID;
		lnup_checkEdit = false;
		
		var commonFieldsGroup = '';		
		
		if(checklistName == locationConditions) {
			commonFieldsGroup += '<table id="checklist_table" class="checklist-table" ShiftDate="'+shiftDate+'"><col width="50">';
			commonFieldsGroup += '<thead>';
			commonFieldsGroup += '<tr><th class="main-header" colspan="4">'+languagePack.common.commonFields+'</th></tr>';
			commonFieldsGroup += '</thead>';
			commonFieldsGroup += '<tr class="operatorTimes" LineupGUID="'+lnup_planGUID+'"><td valign="top" style="width:25%; text-align:left">'+languagePack.prelineup.operatorTimeIn+'</td><td valign="top" style="width:25%; text-align:center"><input class="preLineupDate operatorTimeIn formElement" type="text" id="operator_time_in" elementType="date"></input></td><td valign="top" style="width:25%; text-align:left">'+languagePack.prelineup.operatorTimeOut+'</td><td valign="top" style="width:25%; text-align:center"><input class="preLineupDate operatorTimeOut formElement" type="text" id="operator_time_out" elementType="date"></input></td></tr>';
			
			for(var key in machineGuidArr) {
				commonFieldsGroup += '<tr class="machineLocations" LineupStepGUID="'+lineupStepGuidArr[key]+'"><td valign="top" style="width:25%; text-align:left">'+ languagePack.prelineup.startShiftLocation +' - '+machineArr[key]+'</td><td valign="top" style="width:25%; text-align:center"><select class="machineBeginLocation formElement" id="machine_begin_location_'+machineGuidArr[key]+'" elementType="select"></select></td><td valign="top" style="width:25%; text-align:left">'+ languagePack.prelineup.endShiftLocation +' - '+machineArr[key]+'</td><td valign="top" style="width:25%; text-align:center"><select class="machineEndLocation formElement" id="machine_end_location_'+machineGuidArr[key]+'" elementType="select"></select></td></tr>';
			}
			
			commonFieldsGroup += '</table>';
			
			$("#lineup_checklist_body").append(commonFieldsGroup);
			
			$(".preLineupDate").datetimepicker({ minDate:'-1970/01/02', maxDate:'+1970/01/02', timepicker:true, hours12:false, format:'d/m/Y H:i', mask:true });
			
			$(".machineBeginLocation").each(function() {
				var thisId = $(this).attr("id");
				$(this).html("<option value='0'>"+languagePack.common.selectOption+"</option>");
				
				var machBeginLoc = document.getElementById(thisId);
				
				for(var key in preLineupMachineLocations) {
					machBeginLoc.options[machBeginLoc.options.length] = new Option(preLineupMachineLocations[key].DisplayName, preLineupMachineLocations[key].Location_GUID);
				}
			});
			
			$(".machineEndLocation").each(function() {
				var thisId = $(this).attr("id");
				$(this).html("<option value='0'>"+languagePack.common.selectOption+"</option>");
				
				var machBeginLoc = document.getElementById(thisId);
				
				for(var key in preLineupMachineLocations) {
					machBeginLoc.options[machBeginLoc.options.length] = new Option(preLineupMachineLocations[key].DisplayName, preLineupMachineLocations[key].Location_GUID);
				}
			});
			
			var jqxhrLineupCommon = $.getJSON(ruIP + ruPort + planningDB + planningEN + "read/trans/Lineup?where=\"Lineup_GUID = '"+lnup_planGUID+"'\"", function() {
				var lineups       = jQuery.parseJSON(jqxhrLineupCommon.responseText);
				
				if(lineups[0].OperatorTimeArrival) {
					var timearr = lineups[0].OperatorTimeArrival.split("T");
					var timeString = timearr[0] + " " + timearr[1].split("Z");
					$("#operator_time_in").val(moment(new Date(timeString)).format("DD/MM/YYYY HH:mm"));
				}
				if(lineups[0].OperatorTimeLeft) {
					var timearr = lineups[0].OperatorTimeLeft.split("T");
					var timeString = timearr[0] + " " + timearr[1].split("Z");
					$("#operator_time_out").val(moment(new Date(timeString)).format("DD/MM/YYYY HH:mm"));
				}
			});
			
			var jqxhrLineupStepCommon = $.getJSON(ruIP + ruPort + planningDB + planningEN + "read/trans/Lineup_StepDetail?where=\"Lineup_GUID = '"+lnup_planGUID+"'\"", function() {
				var lineupSteps       = jQuery.parseJSON(jqxhrLineupStepCommon.responseText);
				
				for(var key in lineupSteps) {
					if(lineupSteps[key].BeginShift_MachLocation) {
						$("#machine_begin_location_" + lineupSteps[key].Machine_GUID).val(lineupSteps[key].BeginShift_MachLocation);
					}
					if(lineupSteps[key].EndShift_MachLocation) {
						$("#machine_end_location_" + lineupSteps[key].Machine_GUID).val(lineupSteps[key].EndShift_MachLocation);
					}
				}
			});		
		}
		
		$.each(lnup_dataQ, function (i, item) {
			var checkTables = '';
			var trTitleHead = '';
			var trHead = '';
			var trBody = '';
			var num = i+1;			

			if($("#"+item.ChecklistGroup_GUID).length){
		        trBody += '<tr class="checkrow" checklistquestion="'+item.ChecklistQuestion_GUID+'"><td>'+ num +'</td><td>' + item.Question_Name + '</td>';
		        
		        if (item.InputType_1 == 'Radio'){
		            trBody += '<td valign="top"><input type="radio" class="btn-radio formElement" elementType="radiogroup" name="Answer1-'+item.ChecklistQuestion_GUID+'" value="1"></td><td valign="top"><input type="radio" class="btn-radio formElement" elementType="radiogroup" name="Answer1-'+item.ChecklistQuestion_GUID+'" value="0"></td>';
		        }
		        else if(item.InputType_1 == 'Textbox') {
		            trBody += '<td valign="top"><input type="text" id="Input-'+item.ChecklistQuestion_GUID+'" class="formElement" elementType="textbox"></input></td>';
		        }
		        else if(item.InputType_1 == 'Number') {
		            trBody += '<td valign="top"><input type="number" id="Input-'+item.ChecklistQuestion_GUID+'" class="formElement" elementType="number" min="0" step="0.1"></input></td>';
		        }
				else if(item.InputType_1 == 'Checkbox') {
		            trBody += '<td valign="top"><input type="checkbox" class="checkBoxes formElement" elementType="checkbox" id="Input-'+item.ChecklistQuestion_GUID+'"></input></td>';
		        }
				else if(item.InputType_1 == 'Textarea') {
		            trBody += '<td valign="top"><textarea id="Input-'+item.ChecklistQuestion_GUID+'" style="width:340px; max-width:350px; height:75px" class="formElement" elementType="textarea" rows="5" cols="20"></textarea></td>';
		        }
		        if(item.InputType_2 == 'Textbox'){
		            trBody += '<td valign="top"><input type="text" id="Input2-'+item.ChecklistQuestion_GUID+'"  class="formElement" elementType="textbox"></input></td>';
		        }
		        else if(item.InputType_2 == 'Number'){
		            trBody += '<td valign="top"><input type="number" id="Input2-'+item.ChecklistQuestion_GUID+'"  class="formElement" elementType="number" min="0" step="0.1"></input></td>';
		        }
		        else if(item.InputType_2 == 'Radio'){
		            trBody += '<td valign="top"><input type="radio" class="btn-radio formElement" elementType="radiogroup" name="Answer2-'+item.ChecklistQuestion_GUID+'" value="1"></td><td valign="top"><input type="radio" class="btn-radio formElement" elementType="radiogroup" name="Answer2-'+item.ChecklistQuestion_GUID+'" value="0"></td>';
		        }
				else if(item.InputType_2 == 'Checkbox'){
		            trBody += '<td valign="top"><input type="checkbox" class="checkBoxes formElement" elementType="checkbox" id="Input2-'+item.ChecklistQuestion_GUID+'"></input></td>';
		        }
				else if(item.InputType_2 == 'Textarea') {
		            trBody += '<td valign="top"><textarea id="Input2-'+item.ChecklistQuestion_GUID+'" style="width:340px; max-width:350px; height:75px" class="formElement" elementType="textarea" rows="5" cols="20"></textarea></td>';
		        }
				if(item.InputType_3 == 'Textbox'){
		            trBody += '<td valign="top"><input type="text" id="Input3-'+item.ChecklistQuestion_GUID+'" class="formElement" elementType="textbox"></input></td>';
		        }
				else if(item.InputType_3 == 'Number'){
		            trBody += '<td valign="top"><input type="number" id="Input3-'+item.ChecklistQuestion_GUID+'" class="formElement" elementType="number" min="0" step="0.1"></input></td>';
		        }
		        else if(item.InputType_3 == 'Radio'){
		            trBody += '<td valign="top"><input type="radio" class="btn-radio formElement" elementType="radiogroup" name="Answer3-'+item.ChecklistQuestion_GUID+'" value="1"></td><td valign="top"><input type="radio" class="btn-radio formElement" elementType="radiogroup" name="Answer3-'+item.ChecklistQuestion_GUID+'" value="0"></td>';
		        }
				else if(item.InputType_3 == 'Checkbox'){
		            trBody += '<td valign="top"><input type="checkbox" class="checkBoxes formElement" elementType="checkbox" id="Input3-'+item.ChecklistQuestion_GUID+'"></input></td>';
		        }
				else if(item.InputType_3 == 'Textarea') {
		            trBody += '<td valign="top"><textarea id="Input3-'+item.ChecklistQuestion_GUID+'" style="width:340px; max-width:350px; height:75px" class="formElement" elementType="textarea" rows="5" cols="20"></textarea></td>';
		        }
		        if(item.IsCommentReqd == true){
		            trBody += '<td valign="top"><textarea id="Comments-'+item.ChecklistQuestion_GUID+'" style="width:340px; max-width:350px; height:75px" class="formElement" elementType="textarea" rows="2" cols="50"></textarea></td>';
		        }
		        
		        trBody += '</tr>';
				
				$('#'+item.ChecklistGroup_GUID+' tbody').append(trBody);
			}
			else{
				checkTables += '<table id="'+item.ChecklistGroup_GUID+'" class="checklist-table" ShiftDate="'+shiftDate+'">';
				checkTables += '<col width="50"><thead></thead><tbody></tbody></table>';
				
				$("#lineup_checklist_body").append(checkTables);
			    
			    trTitleHead += '<tr><th class="main-header" colspan="7">'+item.ChecklistGroupName+'</th></tr>';
			    $('#'+item.ChecklistGroup_GUID+' thead').append(trTitleHead);
			    
				if(checklistName == 'Pre Op Mantenimiento') {
					trHead += '<tr><th></th><th></th><th colspan="2">'+languagePack.prelineup.startOfShift+'</th><th colspan="2">'+languagePack.prelineup.endOfShift+'</th><th></th></tr>';
				}
				
			    trHead += '<tr><th>'+languagePack.common.num+'</th><th>'+languagePack.calendar.questionName+'</th>';
			    if(item.InputType_1 == 'Radio'){
			        trHead += '<th>'+languagePack.common.yes+'</th><th>'+languagePack.common.no+'</th>';
			    }
			    else if(item.InputType_1 == 'Textbox' || item.InputType_1 == 'Number'){
					if(item.ChecklistGroupName == 'Explosivo'){
						trHead += '<th>'+languagePack.planning.plan+'</th>'
					} else if(item.ChecklistGroupName === 'Actividades de Revisión e Inspección' || 'Presión de Trabajo'){
						trHead += '<th>'+languagePack.prelineup.startOfShift+'</th>'
					} else if(item.ChecklistGroupName == 'Actividad Básica'){
						trHead += '<th>'+languagePack.prelineup.activitiesPerformed+'</th>'
					}
					else{
						trHead += '<th>Campo</th>';
					}
			    }
				else if(item.InputType_1 == 'Checkbox'){
					if(item.ChecklistGroupName == 'Actividades'){
						trHead += '<th>'+languagePack.planning.plan+'</th>'
					}else{
						trHead += '<th>'+languagePack.common.checkbox+'</th>';
					}
			    }
				else if(item.InputType_1 == 'Textarea'){
					if(item.ChecklistGroupName == 'Analisis Seguro del Trabajo'){
						trHead += '<th>'+languagePack.prelineup.response+'</th>'
					}else{
						trHead += '<th>'+languagePack.common.textarea+'</th>';
					}
				}
			    if(item.InputType_2 == 'Radio'){
			        trHead += '<th>'+languagePack.common.yes+'</th><th>'+languagePack.common.no+'</th>';
			    }
			    else if(item.InputType_2 == 'Textbox' || item.InputType_2 == 'Number'){
						if(item.ChecklistGroupName == 'Explosivo'){
							trHead += '<th>'+languagePack.prelineup.real+'</th>';
						}else if(item.ChecklistGroupName === 'Actividades de Revisión e Inspección' || 'Presión de Trabajo'){
							trHead += '<th>'+languagePack.prelineup.endOfShift+'</th>'
						}else if(item.ChecklistGroupName == 'Actividad Básica'){
							trHead += '<th>'+languagePack.prelineup.activitiesNotPerformed+'</th>'
						}
						else{
							trHead += '<th>'+languagePack.common.field+'</th>';
						}
			    }
				else if(item.InputType_2 == 'Checkbox'){
			        trHead += '<th>'+languagePack.common.checkbox+'</th>';
			    }
				else if(item.InputType_2 == 'Textarea'){
					if(item.ChecklistGroupName == 'Analisis Seguro del Trabajo'){
						trHead += '<th>Riesgos asociados a cada paso</th>'
					}else{
						trHead += '<th>'+languagePack.common.textarea+'</th>';
					}
				}
				if(item.InputType_3 == 'Radio'){
				trHead += '<th>'+languagePack.common.yes+'</th><th>'+languagePack.common.no+'</th>';
			    }
			    else if(item.InputType_3 == 'Textbox' || item.InputType_3 == 'Number'){
			      if(item.ChecklistGroupName === 'Explosivo'){
							trHead += '<th>'+languagePack.prelineup.surplus+'</th>';
						}
						else{
			        trHead += '<th>'+languagePack.common.field+'</th>';
						}
			    }
				else if(item.InputType_3 == 'Checkbox'){
			        trHead += '<th>'+languagePack.common.checkbox+'</th>';
			    }
					else if(item.InputType_3 == 'Textarea'){
						if(item.ChecklistGroupName == 'Analisis Seguro del Trabajo'){
							trHead += '<th>'+languagePack.prelineup.measurePerStep+'</th>'
						}else{
							trHead += '<th>'+languagePack.common.textarea+'</th>';
						}
					}
			    if(item.IsCommentReqd == true){
			        trHead += '<th>'+languagePack.common.comments+'</th>';
			    }
			    trHead += '</tr>';
			    $('#'+item.ChecklistGroup_GUID+' thead').append(trHead);
        		
		        trBody += '<tr class="checkrow" checklistquestion="'+item.ChecklistQuestion_GUID+'" checkrequired="'+item.isManadatory+'"><td>'+ num +'</td><td>' + item.Question_Name + '</td>';
		        
		        if (item.InputType_1 == 'Radio'){
		            trBody += '<td valign="top"><input type="radio" class="btn-radio formElement" elementType="radiogroup" name="Answer1-'+item.ChecklistQuestion_GUID+'" value="1"></td><td valign="top"><input type="radio" class="btn-radio formElement" elementType="radiogroup" name="Answer1-'+item.ChecklistQuestion_GUID+'" value="0"></td>';
		        }
		        else if(item.InputType_1 == 'Textbox') {
		            trBody += '<td valign="top"><input type="text" class="formElement" elementType="textbox" id="Input-'+item.ChecklistQuestion_GUID+'"></input></td>';
		        }
		        else if(item.InputType_1 == 'Number') {
		            trBody += '<td valign="top"><input type="number" class="formElement" elementType="number" id="Input-'+item.ChecklistQuestion_GUID+'" min="0" step="0.1"></input></td>';
		        }
				else if(item.InputType_1 == 'Checkbox') {
		            trBody += '<td valign="top"><input type="checkbox" class="checkBoxes formElement" elementType="checkbox" id="Input-'+item.ChecklistQuestion_GUID+'"></input></td>';
		        }
				else if(item.InputType_1 == 'Textarea') {
		            trBody += '<td valign="top"><textarea id="Input-'+item.ChecklistQuestion_GUID+'" style="width:340px; max-width:350px; height:75px" class="formElement" elementType="textarea" rows="5" cols="20"></textarea></td>';
				}
		        if(item.InputType_2 == 'Textbox'){
		            trBody += '<td valign="top"><input type="text" class="formElement" elementType="textbox" id="Input2-'+item.ChecklistQuestion_GUID+'"></input></td>';
		        }
		        else if(item.InputType_2 == 'Number'){
		            trBody += '<td valign="top"><input type="number" class="formElement" elementType="number" id="Input2-'+item.ChecklistQuestion_GUID+'" min="0" step="0.1"></input></td>';
		        }
		        else if(item.InputType_2 == 'Radio'){
		            trBody += '<td valign="top"><input type="radio" class="btn-radio formElement" elementType="radiogroup" name="Answer2-'+item.ChecklistQuestion_GUID+'" value="1"></td><td valign="top"><input type="radio" class="btn-radio formElement" elementType="radiogroup" name="Answer2-'+item.ChecklistQuestion_GUID+'" value="0"></td>';
		        }
				else if(item.InputType_2 == 'Checkbox'){
		            trBody += '<td valign="top"><input type="checkbox" class="checkBoxes formElement" elementType="checkbox" id="Input2-'+item.ChecklistQuestion_GUID+'"></input></td>';
		        }
				else if(item.InputType_2 == 'Textarea') {
		            trBody += '<td valign="top"><textarea id="Input2-'+item.ChecklistQuestion_GUID+'" style="width:340px; max-width:350px; height:75px" class="formElement" elementType="textarea" rows="5" cols="20"></textarea></td>';
				}
				if(item.InputType_3 == 'Textbox'){
		            trBody += '<td valign="top"><input type="text" class="formElement" elementType="textbox" id="Input3-'+item.ChecklistQuestion_GUID+'"></input></td>';
		        }
				if(item.InputType_3 == 'Number'){
		            trBody += '<td valign="top"><input type="number" class="formElement" elementType="number" id="Input3-'+item.ChecklistQuestion_GUID+'" min="0" step="0.1"></input></td>';
		        }
		        else if(item.InputType_3 == 'Radio'){
		            trBody += '<td valign="top"><input type="radio" class="btn-radio formElement" elementType="radiogroup" name="Answer3-'+item.ChecklistQuestion_GUID+'" value="1"></td><td valign="top"><input type="radio" class="btn-radio formElement" elementType="radiogroup" name="Answer3-'+item.ChecklistQuestion_GUID+'" value="0"></td>';
		        }
				else if(item.InputType_3 == 'Checkbox'){
		            trBody += '<td valign="top"><input type="checkbox" class="checkBoxes formElement" elementType="checkbox" id="Input3-'+item.ChecklistQuestion_GUID+'"></input></td>';
		        }
				else if(item.InputType_3 == 'Textarea') {
		            trBody += '<td valign="top"><textarea id="Input3-'+item.ChecklistQuestion_GUID+'" style="width:340px; max-width:350px; height:75px" class="formElement" elementType="textarea" rows="5" cols="20"></textarea></td>';
				}
		        if(item.IsCommentReqd == true){
		            trBody += '<td valign="top"><textarea id="Comments-'+item.ChecklistQuestion_GUID+'" style="width:340px; max-width:350px; height:75px" class="formElement" elementType="textarea" rows="2" cols="50"></textarea></td>';
		        }
		        
		        trBody += '</tr>';
				$('#'+item.ChecklistGroup_GUID+' tbody').append(trBody);
			}			
		});
		
		if(checklistName == activitiesCheckList) {
			commonFieldsGroup += '<table class="checklist-table" ShiftDate="'+shiftDate+'"><col width="50">';
			commonFieldsGroup += '<thead>';
			commonFieldsGroup += '<tr><th class="main-header" colspan="2">'+languagePack.prelineup.materialType+'</th></tr>';
			commonFieldsGroup += '</thead>';
			commonFieldsGroup += '<tr class="MaterialTypeRow" LineupGUID="'+lnup_planGUID+'"><td style="width:50%; text-align:left">'+languagePack.prelineup.materialType+'</td><td style="width:50%; text-align:center"><select class="endingLocationStatus formElement" id="material_type" elementType="select"><option>Mineral</option><option>Tepetate</option></select></td></tr>';
			
			commonFieldsGroup += '</table>';
			
			commonFieldsGroup += '<table class="checklist-table" ShiftDate="'+shiftDate+'"><col width="50">';
			commonFieldsGroup += '<thead>';
			commonFieldsGroup += '<tr><th class="main-header" colspan="2">'+languagePack.prelineup.locationStatus+'</th></tr>';
			commonFieldsGroup += '</thead>';
			commonFieldsGroup += '<tr class="LocationStatusRow" LineupGUID="'+lnup_planGUID+'"><td style="width:50%; text-align:left">'+languagePack.prelineup.locationStatus+'</td><td style="width:50%; text-align:center"><select class="endingLocationStatus formElement" id="ending_location_status" elementType="select"></select></td></tr>';
			
			commonFieldsGroup += '</table>';
			
			commonFieldsGroup += '<table class="checklist-table" ShiftDate="'+shiftDate+'"><col width="50">';
			commonFieldsGroup += '<thead>';
			commonFieldsGroup += '<tr><th class="main-header" colspan="3">'+languagePack.prelineup.machineStatus+'</th></tr>';
			commonFieldsGroup += '</thead>';
			
			for(var key in machineGuidArr) {
				commonFieldsGroup += '<tr class="MachineStatusRow" MachineGUID="'+machineGuidArr[key]+'"><td style="width:30%" text-align:left">'+languagePack.prelineup.endingMachineStatus+'</td><td text-align:left">'+machineArr[key]+'</td><td text-align:center"><select class="endingMachineStatus formElement" id="ending_machine_status_'+key+'" elementType="select"></select></td></tr>';
			}
			
			commonFieldsGroup += '</table>';
			
			$("#lineup_checklist_body").append(commonFieldsGroup);
			
			var thisId = "ending_location_status";
			$("#ending_location_status").html("<option value='0'>"+languagePack.common.selectOption+"</option>");
			
			var locationStatuses = document.getElementById(thisId);

			for(var key in preLineupLocationStatuses) {
				locationStatuses.options[locationStatuses.options.length] = new Option(preLineupLocationStatuses[key].DisplayName, preLineupLocationStatuses[key].LocationStatus_GUID);
			}
			
			var machineGuidList = "(";
			
			for(var key in machineGuidArr) {
				var thisId = ("ending_machine_status_" + key);
				$("#ending_machine_status_" + key).html("<option value='0'>"+languagePack.common.selectOption+"</option>");
				
				var machineStatuses = document.getElementById(thisId);
				
				machineStatuses.options[machineStatuses.options.length] = new Option(languagePack.common.operating, 1);
				machineStatuses.options[machineStatuses.options.length] = new Option(languagePack.common.down, 2);
				
				machineGuidList += "'" + machineGuidArr[key] + "'";
				
				if(key < (machineGuidArr.length - 1)) {
					machineGuidList += ",";
				}
			}
			machineGuidList += ")";
			
			var jqxhrLineupCommon = $.getJSON(ruIP + ruPort + planningDB + planningEN + "read/trans/Lineup?where=\"Lineup_GUID = '"+lnup_planGUID+"'\"", function() {
				var lineups       = jQuery.parseJSON(jqxhrLineupCommon.responseText);
				
				for(var key in lineups) {
					if(lineups[key].Material_Type) {
						$("#material_type").val(lineups[key].Material_Type);
					}
					if(lineups[key].EndLocationStatus_GUID) {
						$("#ending_location_status").val(lineups[key].EndLocationStatus_GUID);
					}
				}
			});
			
			var jqxhrLineupMachines = $.getJSON(ruIP + ruPort + planningDB + planningEN + "read/eqmt/v_Machine?where=\"Machine_GUID IN "+machineGuidList+"\"", function() {
				var machines		= jQuery.parseJSON(jqxhrLineupMachines.responseText);
				
				for(var key in machines) {
					if(machines[key].MachineStatus.toUpperCase() == "OPERATIVO") {
						$("#ending_machine_status_" + key).val(1);
					}
					else if(machines[key].MachineStatus.toUpperCase() == "FUERASER") {
						$("#ending_machine_status_" + key).val(2);
					}
					else {
						$("#ending_machine_status_" + key).val(1);						
					}
				}
			});	
		}
		
		if(checklistName == machineDetails) {
			
			var jumboExists = false;
			var displayString = 'style="display:none"';
			
			if(!(MachineTypeArr.indexOf(jumboMachineTypesGuid) == -1 && MachineTypeArr.indexOf(simbaMachineTypesGuid) == -1)) {
				jumboExists = true;
				displayString = '';
			}
			
			commonFieldsGroup += '<table class="gauges-table">';
			commonFieldsGroup += '<thead>';
			commonFieldsGroup += '<tr><th class="main-header" colspan="2">'+languagePack.prelineup.hydraulicOil+'</th><th class="main-header">'+languagePack.prelineup.fuelLevel+'</th><th class="main-header" '+displayString+'>'+languagePack.prelineup.electricalSource+'</th></tr>';
			commonFieldsGroup += '<tr><th class="main-header">'+languagePack.common.startOfShift+'</th><th class="main-header">'+languagePack.common.endOfShift+'</th><th class="main-header"></th><th class="main-header" '+displayString+'></th></tr>';
			commonFieldsGroup += '</thead>';
			
			for(var key in machineGuidArr) {
				commonFieldsGroup += '<tr class="MachineDetailsRow" id="machine_details_row_'+key+'" LineupGUID="'+lnup_planGUID+'" MachineGUID="'+machineGuidArr[key]+'" ShiftDate="'+shiftDate+'">';
				commonFieldsGroup += '<td class="gauge-td">';
				commonFieldsGroup += '<div class="gaugeWidget" id="gaugeWidget1_'+key+'">';
				commonFieldsGroup += '<div id="start_shift_hydraulic_gauge_'+key+'" style="margin-left:calc(50% - 75px)" class="formElement" elementType="gauge"></div>';			
				commonFieldsGroup += '<div id="start_shift_hydraulic_slider_'+key+'" class="formElement" elementType="slider"></div>';
				commonFieldsGroup += '</div>';
				commonFieldsGroup += '</td>';
				
				commonFieldsGroup += '<td class="gauge-td">';
				commonFieldsGroup += '<div class="gaugeWidget" id="gaugeWidget2_'+key+'">';
				commonFieldsGroup += '<div id="end_shift_hydraulic_gauge_'+key+'" style="margin-left:calc(50% - 75px)" class="formElement" elementType="gauge"></div>';
				commonFieldsGroup += '<div id="end_shift_hydraulic_slider_'+key+'" class="formElement" elementType="slider"></div>';
				commonFieldsGroup += '</div>';	
				commonFieldsGroup += '</td>';		
				
				commonFieldsGroup += '<td class="gauge-td">';
				commonFieldsGroup += '<div class="gaugeWidget" id="gaugeWidget3_'+key+'">';
				commonFieldsGroup += '<div id="fuel_gauge_'+key+'" class="formElement" elementType="gauge"></div>';
				commonFieldsGroup += '<div id="fuel_slider_'+key+'" class="formElement" elementType="slider"></div>';
				commonFieldsGroup += '</div>';
				commonFieldsGroup += '</td>';
				
				commonFieldsGroup += '<td class="gauge-td" '+displayString+'>';
				commonFieldsGroup += '<div class="gaugeWidget" id="gaugeWidget4_'+key+'">';
				commonFieldsGroup += '<div id="electric_source_distance_gauge_'+key+'" style="margin-left:calc(50% - 75px)" class="formElement" elementType="gauge"></div>';
				commonFieldsGroup += '<div id="electric_source_distance_slider_'+key+'" class="formElement" elementType="slider"></div>';
				commonFieldsGroup += '</div>';
				commonFieldsGroup += '</td>';
				commonFieldsGroup += '</tr>';
			}
			
						
			commonFieldsGroup += '</table>';
			
			$("#lineup_checklist_body").append(commonFieldsGroup);
			
			for(var i = 0; i < machineGuidArr.length; i++) {
				InitializeGauges(i);
			}
			
			var jqxhrLineupCommon = $.getJSON(ruIP + ruPort + planningDB + planningEN + "read/trans/Lineup_MachineDetail?where=\"Lineup_GUID = '"+lnup_planGUID+"'\"", function() {
				var lineups       = jQuery.parseJSON(jqxhrLineupCommon.responseText);
				
				for(var key in lineups) {
					if(lineups[key].Lineup_MachineDetail_GUID) {
						$("#machine_details_row_"+key).attr("LineupMachineDetailGUID", lineups[key].Lineup_MachineDetail_GUID);
					}					
					if(lineups[key].Begin_Hydraulic_Level) {
						$("#start_shift_hydraulic_gauge_"+key).val(lineups[key].Begin_Hydraulic_Level);
						$("#start_shift_hydraulic_slider_"+key).val(lineups[key].Begin_Hydraulic_Level);
					}
					if(lineups[key].End_Hydraulic_Level) {
						$("#end_shift_hydraulic_gauge_"+key).val(lineups[key].End_Hydraulic_Level);
						$("#end_shift_hydraulic_slider_"+key).val(lineups[key].End_Hydraulic_Level);
					}
					if(lineups[key].Begin_Hydraulic_Level) {
						$("#fuel_gauge_"+key).val(lineups[key].End_Fuel_Level);
						$("#fuel_slider_"+key).val(lineups[key].End_Fuel_Level);
					}
					if(lineups[key].Begin_Hydraulic_Level) {
						$("#electric_source_distance_gauge_"+key).val(lineups[key].End_Electrical_Distance);
						$("#electric_source_distance_slider_"+key).val(lineups[key].End_Electrical_Distance);
					}
				}
			});
		}

		for(var i = 0; i < lnup_statusData.length; i++) {
			if((lnup_statusData[i].Lineup_GUID == lnup_planGUID) && (lnup_statusData[i].ChecklistType_GUID == lnup_checklistType)) {
				
				var jqxhrQuestions = $.getJSON(ruIP + ruPort + planningDB + planningEN + "read/dbo/v_Lineup_FormDetail?where=\"Lineup_GUID = '"+ lnup_planGUID +"' AND ChecklistType_GUID = '"+ lnup_checklistType +"' AND IsActive = '1'\"", function() {
					lnup_answerdata = $.parseJSON(jqxhrQuestions.responseText);
					
					$.each(lnup_answerdata, function (count, item) {
						if(item.InputType_1 == "Radio"){
							$('input[name="Answer1-' + item.ChecklistQuestion_GUID+ '"]').val([item.Value_1]);
						}
						else if(item.InputType_1 == "Textbox" || item.InputType_1 == "Number"){
							$('#Input-' + item.ChecklistQuestion_GUID).val(item.Value_1);
						}
						else if(item.InputType_1 == "Checkbox"){
							$('#Input-' + item.ChecklistQuestion_GUID).prop('checked', (item.Value_1 == 1) ? true : false);
						}
						else if(item.InputType_1 == "Textarea"){
							$('#Input-' + item.ChecklistQuestion_GUID).val(item.Value_1);
						}
						
					 	if(item.InputType_2 == "Radio"){
							$('input[name="Answer2-' + item.ChecklistQuestion_GUID+ '"]').val([item.Value_2]);
						}
						else if(item.InputType_2 == "Textbox" || item.InputType_2 == "Number"){
							$('#Input2-' + item.ChecklistQuestion_GUID).val(item.Value_2);
						}
						else if(item.InputType_2 == "Checkbox"){
							$('#Input2-' + item.ChecklistQuestion_GUID).prop('checked', (item.Value_2 == 1) ? true : false);
						}
						else if(item.InputType_2 == "Textarea"){
							$('#Input2-' + item.ChecklistQuestion_GUID).val(item.Value_2);
						}
						
						if(item.InputType_3 == "Radio"){
							$('input[name="Answer3-' + item.ChecklistQuestion_GUID+ '"]').val([item.Value_3]);
						}
						else if(item.InputType_3 == "Textbox" || item.InputType_3 == "Number"){
							$('#Input3-' + item.ChecklistQuestion_GUID).val(item.Value_3);
						}
						else if(item.InputType_3 == "Checkbox"){
							$('#Input3-' + item.ChecklistQuestion_GUID).prop('checked', (item.Value_3 == 1) ? true : false);
						}
						else if(item.InputType_3 == "Textarea"){
							$('#Input3-' + item.ChecklistQuestion_GUID).val(item.Value_3);
						}
						
					 	if((item.Comment != null) || (item.Comment != undefined)){
							$('#Comments-' + item.ChecklistQuestion_GUID).val(item.Comment);
					 	}
					});
					lnup_checkEdit = true;
				});
			}
		}
		
	});
}

function checklist_export() {
	var newArray = [];
	
 		$.each(lnup_dataQ, function (i, item) {
			var newObj = {};
			
			newObj.Lineup_GUID     		  = lnup_planGUID;
			newObj.ChecklistType_GUID 	  = lnup_checklistType;
			newObj.Question_Name          = item.Question_Name;
			newObj.ChecklistQuestion_GUID = item.ChecklistQuestion_GUID;
			
			if(lnup_answerdata.length > 0){
				for(var j=0; j < lnup_answerdata.length; j++){
					if(item.ChecklistQuestion_GUID == lnup_answerdata[j].ChecklistQuestion_GUID){
						newObj.Lineup_ChecklistDetail_GUID = lnup_answerdata[j].Lineup_ChecklistDetail_GUID;
					}
				}
			}
			
			if (item.InputType_1 == 'Radio'){
				newObj.Value_1 = $('input[name="Answer1-'+item.ChecklistQuestion_GUID+'"]:checked').val();
			}
			else if(item.InputType_1 == 'Textbox' || item.InputType_1 == 'Number') {
				if($('#Input-'+item.ChecklistQuestion_GUID).val() == "") {
					newObj.Value_1 = null;
				}
				else {
					newObj.Value_1 = $('#Input-'+item.ChecklistQuestion_GUID).val();
				}
			}
			else if(item.InputType_1 == 'Checkbox'){
				newObj.Value_1 = $('#Input-'+item.ChecklistQuestion_GUID).prop('checked');
			}
			else if(item.InputType_1 == 'Textarea') {
				if($('#Input-'+item.ChecklistQuestion_GUID).val() == "") {
					newObj.Value_1 = null;
				}
				else {
					newObj.Value_1 = $('#Input-'+item.ChecklistQuestion_GUID).val();
				}
			}
			
			if(item.InputType_2 == 'Textbox' || item.InputType_2 == 'Number'){
				if($('#Input2-'+item.ChecklistQuestion_GUID).val() == "") {
					newObj.Value_2 = null;
				}
				else {
					newObj.Value_2 = $('#Input2-'+item.ChecklistQuestion_GUID).val();
				}
			}
			else if(item.InputType_2 == 'Radio'){
				newObj.Value_2 = $('input[name="Answer2-'+item.ChecklistQuestion_GUID+'"]:checked').val();
			}
			else if(item.InputType_2 == 'Checkbox'){
				newObj.Value_2 = $('#Input2-'+item.ChecklistQuestion_GUID).prop('checked');
			}
			else if(item.InputType_2 == 'Textarea') {
				if($('#Input2-'+item.ChecklistQuestion_GUID).val() == "") {
					newObj.Value_2 = null;
				}
				else {
					newObj.Value_2 = $('#Input2-'+item.ChecklistQuestion_GUID).val();
				}
			}
			else{
				newObj.Value_2 = null;
			}
			
			if(item.InputType_3 == 'Textbox' || item.InputType_3 == 'Number'){
				if($('#Input3-'+item.ChecklistQuestion_GUID).val() == "") {
					newObj.Value_3 = null;
				}
				else {
					newObj.Value_3 = $('#Input3-'+item.ChecklistQuestion_GUID).val();
				}
			}
			else if(item.InputType_3 == 'Radio'){
				newObj.Value_3 = $('input[name="Answer3-'+item.ChecklistQuestion_GUID+'"]:checked').val();
			}
			else if(item.InputType_3 == 'Checkbox'){
				newObj.Value_3 = $('#Input3-'+item.ChecklistQuestion_GUID).prop('checked');
			}
			else if(item.InputType_3 == 'Textarea'){
				if($('#Input3-'+item.ChecklistQuestion_GUID).val() == "") {
					newObj.Value_3 = null;
				}
				else {
					newObj.Value_3 = $('#Input3-'+item.ChecklistQuestion_GUID).val();
				}
			}
			else{
				newObj.Value_3 = null;
			}
			
			if(item.IsCommentReqd == true){
				if($('#Comments-'+item.ChecklistQuestion_GUID).val() == "") {
					newObj.Comment = null;
				}
				else {
					newObj.Comment = $('#Comments-'+item.ChecklistQuestion_GUID).val();
				}
			}
			
			newObj.IsManadatory = item.IsManadatory;

			newArray.push(newObj);
		});

	return newArray;
}

function checklist_populate(element) {
	var newData;
	var checklistType = $(element).closest('#lineup_checklist_form').attr('ChecklistType');

	LockForService();
	
	var operatorTimesArray			= [];
	var machineLocationsArray		= [];
	var machineStatusArray			= [];
	var createdMachineDetailsArray	= [];
	var updatedMachineDetailsArray	= [];
	var lnup_insertedQuestions		= [];
	var lnup_updatedQuestions		= [];
	var createdHaulageDetailsArray	= [];
	var updatedHaulageDetailsArray	= [];

	if(checklistType == locationConditions) {
		
		$(".operatorTimes").each(function() {
			var dataObj   = {};
			var apiKeyObj = {};
			var element   = $(this);
			
			apiKeyObj.Lineup_GUID = element.attr("LineupGUID");
			dataObj.APIKEY        = apiKeyObj;
			
			if(element.find(".operatorTimeIn").val() && element.find(".operatorTimeIn").val() != "__/__/____ __:__") {
				dataObj.OperatorTimeArrival = FormatEUDate(element.find(".operatorTimeIn").val());
			}
			
			if(element.find(".operatorTimeOut").val() && element.find(".operatorTimeOut").val() != "__/__/____ __:__") {
				dataObj.OperatorTimeLeft = FormatEUDate(element.find(".operatorTimeOut").val());
			}
			
			operatorTimesArray.push(dataObj);
		});		
		
		$(".machineLocations").each(function() {
			var dataObj   = {};
			var apiKeyObj = {};
			var element   = $(this);
			
			apiKeyObj.Lineup_Step_GUID = element.attr("LineupStepGUID");
			dataObj.APIKEY             = apiKeyObj;
			
			if(element.find(".machineBeginLocation").val()) {
				dataObj.BeginShift_MachLocation = element.find(".machineBeginLocation").val();
			}
			
			if($(this).find(".machineEndLocation").val()) {
				dataObj.EndShift_MachLocation = element.find(".machineEndLocation").val();
			}
			
			machineLocationsArray.push(dataObj);
		});
	}

	if(checklistType == activitiesCheckList) {
		$(".MachineStatusRow").each(function() {
			var element		= $(this);
			var machineObj	= {};
			var ddValue		= 0;
			
			machineObj.TableRecordGUID = element.attr("MachineGUID");			
			machineObj.MachineStatus = element.find(".endingMachineStatus").find("option:selected").text().toUpperCase();
			
			ddValue = element.find(".endingMachineStatus").val();
			
			(ddValue != 0) ? machineStatusArray.push(machineObj) : false;
		});
		
		MachineStatusUpdate(machineStatusArray);
		
		var dataObj   = {};
		var apiKeyObj = {};
		var element   = $(".LocationStatusRow");
		
		apiKeyObj.Lineup_GUID = element.attr("LineupGUID");
		dataObj.APIKEY        = apiKeyObj;
		
		dataObj.EndLocationStatus_GUID	= $("#ending_location_status").val();
		dataObj.Material_Type			= $("#material_type").val();
		
		operatorTimesArray.push(dataObj);
		
		GrabStatusLocationInfo(apiKeyObj.Lineup_GUID, dataObj.EndLocationStatus_GUID);
	}

	if(checklistType == machineDetails) {
		
		$(".MachineDetailsRow").each(function(index) {
			var element = $(this);
			
			if(element.attr("LineupMachineDetailGUID")) {
			
				var machineObj	= {};
				var apiKeyObj = {};
				
				apiKeyObj.Lineup_MachineDetail_GUID		= element.attr("LineupMachineDetailGUID");
				machineObj.APIKEY						= apiKeyObj;
				machineObj.Begin_Hydraulic_Level		= $("#start_shift_hydraulic_slider_"+index).val().toString();
				machineObj.End_Hydraulic_Level			= $("#end_shift_hydraulic_slider_"+index).val().toString();
				machineObj.End_Fuel_Level				= $("#fuel_slider_"+index).val().toString();
				machineObj.End_Electrical_Distance		= $("#electric_source_distance_slider_"+index).val().toString();
				machineObj.Modified						= moment().format("YYYY-MM-DDTHH:mm:ss.000z");
				
				updatedMachineDetailsArray.push(machineObj);
			}
			else {
				var machineObj	= {};
				
				machineObj.Lineup_MachineDetail_GUID	= CreateGUID();
				machineObj.Lineup_GUID					= element.attr("LineupGUID");
				machineObj.Machine_GUID					= element.attr("MachineGUID");
				machineObj.Begin_Hydraulic_Level		= $("#start_shift_hydraulic_gauge_"+index).val().toString();
				machineObj.End_Hydraulic_Level			= $("#end_shift_hydraulic_gauge_"+index).val().toString();
				machineObj.End_Fuel_Level				= $("#fuel_gauge_"+index).val().toString();
				machineObj.End_Electrical_Distance		= $("#electric_source_distance_gauge_"+index).val().toString();
				machineObj.ShiftDate					= moment(element.attr("ShiftDate").split("Z")[0]).format("YYYY-MM-DDTHH:mm:ss.000z");
				machineObj.IsActive						= true;
				machineObj.Created						= moment().format("YYYY-MM-DDTHH:mm:ss.000z");
				machineObj.Modified						= moment().format("YYYY-MM-DDTHH:mm:ss.000z");
				machineObj.Obsolete						= moment().format("9999-12-31T00:00:00.000z");
				
				createdMachineDetailsArray.push(machineObj);
			}
		});
		
	}

	if(checklistType == materials_checklist) {
		newData = materials_export();
		
		if(materials_validate(newData)) {
			for(var key in newData) {
				var qRowObj   = {};
				var apiKeyObj = {};
				
				apiKeyObj.Lineup_MeasureDetail_GUID = newData[key].Lineup_MeasureDetail_GUID;
				qRowObj.APIKEY = apiKeyObj;
				
				qRowObj.Lineup_GUID        = newData[key].Lineup_GUID;
				qRowObj.ChecklistType_GUID = newData[key].ChecklistType_GUID;
				qRowObj.ActualValue_1      = newData[key].ActualValue_1;
				qRowObj.ActualValue_2      = newData[key].ActualValue_2;
				qRowObj.ActualValue_3      = newData[key].ActualValue_3;
				qRowObj.Modified           = moment().format("YYYY-MM-DDTHH:mm:ss.000z");
				
				lnup_updatedQuestions.push(qRowObj);
			}
			
			materials_submit(lnup_updatedQuestions);
		}
	}
	else if(checklistType == explosives_checklist) {
		newData = materials_export();
		
		if(materials_validate(newData)) {
			for(var key in newData) {
				var qRowObj   = {};
				var apiKeyObj = {};
				
				apiKeyObj.Lineup_MeasureDetail_GUID = newData[key].Lineup_MeasureDetail_GUID;
				qRowObj.APIKEY = apiKeyObj;
				
				qRowObj.Lineup_GUID        = newData[key].Lineup_GUID;
				qRowObj.ChecklistType_GUID = newData[key].ChecklistType_GUID;
				qRowObj.ActualValue_1      = newData[key].ActualValue_1;
				qRowObj.ActualValue_2      = newData[key].ActualValue_2;
				qRowObj.ActualValue_3      = newData[key].ActualValue_3;
				qRowObj.Modified           = moment().format("YYYY-MM-DDTHH:mm:ss.000z");
				
				lnup_updatedQuestions.push(qRowObj);
			}
			
			materials_submit(lnup_updatedQuestions);
		}		
	}
	else if(checklistType == process_checklist) {
		newData = materials_export();
		
		if(materials_validate(newData)) {
			for(var key in newData) {
				var qRowObj   = {};
				var apiKeyObj = {};
				
				apiKeyObj.Lineup_MeasureDetail_GUID = newData[key].Lineup_MeasureDetail_GUID;
				qRowObj.APIKEY = apiKeyObj;
				
				qRowObj.Lineup_GUID        = newData[key].Lineup_GUID;
				qRowObj.ChecklistType_GUID = newData[key].ChecklistType_GUID;
				qRowObj.ActualValue_1      = newData[key].ActualValue_1;
				qRowObj.ActualValue_2      = newData[key].ActualValue_2;
				qRowObj.ActualValue_3      = newData[key].ActualValue_3;
				qRowObj.ActualValue_4      = newData[key].ActualValue_4;
				qRowObj.Modified           = moment().format("YYYY-MM-DDTHH:mm:ss.000z");
				
				lnup_updatedQuestions.push(qRowObj);
			}
			
			materials_submit(lnup_updatedQuestions);
		}
	}
	else if(checklistType == haulage_checklist) {
		
		$(".haulageRow").each(function(index) {
			var element      = $(this);
			var recordExists = false;
			
			var newHaulageGuid;
			
			if(element.attr("LineupHaulageDetailGUID")) {
				newHaulageGuid = element.attr("LineupHaulageDetailGUID");
				recordExists = true;
			}
			else {
				newHaulageGuid = CreateGUID();
				recordExists = false;
			}
			
			var lineupGuid     = element.closest("#haulage-table").attr("LineupGUID");
			var shiftDate      = element.closest("#haulage-table").attr("ShiftDate");
			var mineral        = element.find("#haulage_mineral_" + index).is(":Checked");
			var waste          = element.find("#haulage_waste_" + index).is(":Checked");
			var mineralWaste   = 0;
			var plannedLocal   = element.find("#haulage_planned_location_" + index).val();
			var actualLocal    = element.find("#haulage_actual_location_" + index).val();
			var numLoads       = element.find("#haulage_number_loads_" + index).val();
			
			if(mineral) {
				mineralWaste = "Tolva";
			}
			else {
				mineralWaste = "M. Interno";			
			}			
			
			if(recordExists) {
				var dataObj = {};
				var apiKeyObj = {};
				
				apiKeyObj.Lineup_HaulageDetail_GUID = newHaulageGuid;

				dataObj.APIKEY               = apiKeyObj;
				dataObj.Prod_Rehandle        = mineralWaste;
				dataObj.PlannedLocation_GUID = plannedLocal;
				dataObj.ActualLocation_GUID  = actualLocal;
				dataObj.Loads                = numLoads;
				dataObj.Modified             = moment().format("YYYY-MM-DDTHH:mm:ss.000z");
				
				updatedHaulageDetailsArray.push(dataObj);
			}
			else {
				var dataObj = {};
			
				dataObj.Lineup_HaulageDetail_GUID = newHaulageGuid;
				dataObj.Lineup_GUID               = lineupGuid;
				dataObj.Prod_Rehandle             = mineralWaste;
				dataObj.PlannedLocation_GUID      = plannedLocal;
				dataObj.ActualLocation_GUID       = actualLocal;
				dataObj.Loads                     = numLoads;
				dataObj.ShiftDate				  = shiftDate;
				dataObj.IsActive                  = true;
				dataObj.Created                   = moment().format("YYYY-MM-DDTHH:mm:ss.000z");
				dataObj.Modified                  = moment().format("YYYY-MM-DDTHH:mm:ss.000z");
				dataObj.Obsolete                  = moment().format("9999-12-31T00:00:00.000z");
				
				createdHaulageDetailsArray.push(dataObj);
			}
		});
		
		CreateHaulageDetails(createdHaulageDetailsArray, updatedHaulageDetailsArray);
	}
	else if(checklistType == machineDownEvents) {
		var lineupGuid		= $("#downs-table").attr("LineupGUID");
		var shiftDate		= $("#downs-table").attr("ShiftDate");
		var shift			= $("#downs-table").attr("Shift");
		var locationGuid	= $("#downs-table").attr("LocationGUID");
		var operatorGuid	= $("#downs-table").attr("OperatorGUID");
		var machineGuids	= $("#downs-table").attr("MachineGUIDS").split("_");
		var machineList		= $("#downs-table").attr("MachineList").split("_");
		var validTimes		= true;
		var message			= '';
		
		var hrs = (shift == "1") ? 7 : (shift == "2") ? 15 : 23;
		
		var minTime = moment($("#downs-table").attr("ShiftDate")).add(hrs,"hours").format("YYYY-MM-DDTHH:mm:ss.000z");
		var maxTime = moment(minTime).add(8,"hours").format("YYYY-MM-DDTHH:mm:ss.000z");
		
		var createdDownEventsArray	= [];
		var modifiedDownEventsArray	= [];
		
		$(".downsRow").each(function() {
			var element = $(this);
			var dataObj = {};
			
			var downStartTime	= FormatEUDate(element.find(".downCodeBeginTime").val());
			var downArrivalTime	= FormatEUDate(element.find(".downCodeArrivalTime").val());
			var downEndTime		= FormatEUDate(element.find(".downCodeEndTime").val());
			
			dataObj.Lineup_GUID				= lineupGuid;
			dataObj.ShiftDate				= shiftDate;
			dataObj.Shift					= shift;
			dataObj.Location_GUID			= locationGuid;
			dataObj.Operator_GUID			= operatorGuid;
			dataObj.Machine_GUID			= machineGuids[0];
			dataObj.DownReasonCode_GUID		= element.find(".downCodeSelect").val();
			dataObj.Comment					= element.find(".downCodeComments").val();				
			dataObj.DownStartTime			= downStartTime;
			dataObj.MaintenanceArrivalTime	= (downArrivalTime == "") ? NULL : downArrivalTime;
			dataObj.DownFinishTime			= downEndTime;
			
			dataObj.IsCompleted            = false;
			dataObj.CreatedBy              = UserData[0].PersonGUID;
			dataObj.IsActive               = true;
			dataObj.Modified               = moment().format("YYYY-MM-DDTHH:mm:ss.000z");
			dataObj.Obsolete               = moment().format("9999-12-31T00:00:00.000z");
			
			if(dataObj.DownReasonCode_GUID != "0") {
				if(!(element.attr("MachineDownEventGUID"))) {
					dataObj.MachineDownEvent_GUID	= CreateGUID();					
					dataObj.Created					= moment().format("YYYY-MM-DDTHH:mm:ss.000z");
					createdDownEventsArray.push(dataObj);
				}
				else {
					var apiKeyObj = {};
					
					apiKeyObj.MachineDownEvent_GUID	= element.attr("MachineDownEventGUID");
					dataObj.APIKEY					= apiKeyObj;
					modifiedDownEventsArray.push(dataObj);
				}
			}
			else {
				validTimes	= false;
				message		= languagePack.message.mdm1;
			}
		});
		
		for(var key in createdDownEventsArray) {
			if(createdDownEventsArray[key].MaintenanceArrivalTime) {
				if(createdDownEventsArray[key].DownStartTime > createdDownEventsArray[key].MaintenanceArrivalTime) {
					validTimes	= false;
					message		= languagePack.message.mdm2;
				}
			}
			
			
			if(createdDownEventsArray[key].DownStartTime > createdDownEventsArray[key].DownFinishTime) {
				validTimes	= false;
				message		= languagePack.message.mdm3;
			}
			
			if(createdDownEventsArray[key].MaintenanceArrivalTime) {
				if(createdDownEventsArray[key].MaintenanceArrivalTime > createdDownEventsArray[key].DownFinishTime) {
					validTimes	= false;
					message		= languagePack.message.mdm4;
				}
			}
			
			if(createdDownEventsArray[key].DownStartTime == "")	{
				validTimes	= false;
				message		= languagePack.message.mdm5;
			}
			
			if(createdDownEventsArray[key].DownFinishTime == "") {
				validTimes	= false;
				message		= languagePack.message.mdm6;
			}
			
			if(createdDownEventsArray[key].DownStartTime < minTime || createdDownEventsArray[key].DownStartTime > maxTime) {
				validTimes	= false;
				message		= languagePack.message.mdm7;
			}
			
			if(createdDownEventsArray[key].DownFinishTime < minTime || createdDownEventsArray[key].DownFinishTime > maxTime) {
				validTimes	= false;
				message		= languagePack.message.mdm8;
			}
		}
		
		for(var key in modifiedDownEventsArray) {
			if(modifiedDownEventsArray[key].MaintenanceArrivalTime) {
				if(modifiedDownEventsArray[key].DownStartTime > modifiedDownEventsArray[key].MaintenanceArrivalTime) {
					validTimes	= false;
					message		= languagePack.message.mdm2;
				}
			}
			
			if(modifiedDownEventsArray[key].DownStartTime > modifiedDownEventsArray[key].DownFinishTime) {
				validTimes	= false;
				message		= languagePack.message.mdm3;
			}
			
			if(modifiedDownEventsArray[key].MaintenanceArrivalTime) {
				if(modifiedDownEventsArray[key].MaintenanceArrivalTime > modifiedDownEventsArray[key].DownFinishTime) {
					validTimes	= false;
					message		= languagePack.message.mdm4;
				}
			}
			
			if(modifiedDownEventsArray[key].DownStartTime == "")	{
				validTimes	= false;
				message		= languagePack.message.mdm5;
			}
			
			if(modifiedDownEventsArray[key].DownFinishTime == "") {
				validTimes	= false;
				message		= languagePack.message.mdm6;
			}
			
			if(modifiedDownEventsArray[key].DownStartTime < minTime || modifiedDownEventsArray[key].DownStartTime > maxTime) {
				validTimes	= false;
				message		= languagePack.message.mdm7;
			}
			
			if(modifiedDownEventsArray[key].DownFinishTime < minTime || modifiedDownEventsArray[key].DownFinishTime > maxTime) {
				validTimes	= false;
				message		= languagePack.message.mdm8;
			}
		}

		if(validTimes) {
			CreateMachineDownEvent(createdDownEventsArray, modifiedDownEventsArray);
		}
		else {
			DisplayAlert(languagePack.message.alert,message);
			ServiceComplete();
		}
	}
	else {
		newData = checklist_export();		
		var shiftDate		= $("#checklist_table").attr("ShiftDate");
		
		if(checklist_validate(newData)) {
			for(var key in newData) {
				if(lnup_checkEdit){
					var qRowObj = {};
					var apiKeyObj = {};
					
					apiKeyObj.Lineup_ChecklistDetail_GUID = newData[key].Lineup_ChecklistDetail_GUID;
					qRowObj.APIKEY = apiKeyObj;
					
					qRowObj.Lineup_GUID 		    = newData[key].Lineup_GUID;
					qRowObj.ChecklistType_GUID 	  	= newData[key].ChecklistType_GUID;
					qRowObj.ChecklistQuestion_GUID 	= newData[key].ChecklistQuestion_GUID;
					qRowObj.Value_1 				= newData[key].Value_1;
					qRowObj.Value_2 				= newData[key].Value_2;
					qRowObj.Value_3 				= newData[key].Value_3;
					qRowObj.Comment 				= newData[key].Comment;
					qRowObj.Modified                = moment().format("YYYY-MM-DDTHH:mm:ss.000z");
					
					lnup_updatedQuestions.push(qRowObj);
				}
				else{
					var qRowObj = {};
					qRowObj.Lineup_GUID 		    = newData[key].Lineup_GUID;
					qRowObj.ChecklistType_GUID 	  	= newData[key].ChecklistType_GUID;
					qRowObj.ChecklistQuestion_GUID 	= newData[key].ChecklistQuestion_GUID;
					qRowObj.Value_1 				= newData[key].Value_1;
					qRowObj.Value_2 				= newData[key].Value_2;
					qRowObj.Value_3 				= newData[key].Value_3;
					qRowObj.Comment 				= newData[key].Comment;
					qRowObj.ShiftDate 				= shiftDate;
					qRowObj.IsActive                = 1;
					qRowObj.Created                 = moment().format("YYYY-MM-DDTHH:mm:ss.000z");
					qRowObj.Modified                = moment().format("YYYY-MM-DDTHH:mm:ss.000z");
					qRowObj.CreatedBy               = UserData[0].PersonGUID;
					
					lnup_insertedQuestions.push(qRowObj);
				}
			}
			UpdateMachineDetails(createdMachineDetailsArray, updatedMachineDetailsArray);
			UpdateCommonFields(operatorTimesArray, machineLocationsArray, lnup_insertedQuestions, lnup_updatedQuestions);
		}
	}
}

function MachineStatusUpdate(machineStatusArray) {
	if(machineStatusArray.length > 0) {
		var jsonData = {
			 "fields": machineStatusArray
		};
		
		$.ajax ({
			headers: {
				"Content-Type": "application/json"
			},
			url: ruIP + ruPort + listsDB + listEN + "update/bulk/virtual/"+UserData[0].SiteGUID+"/EquipmentByMachineType",
			type: "POST",
			data: JSON.stringify(jsonData),
			success: function(){
				$.getJSON(ruIP + ruPort + listsDB + listEN + "read/dbo/MatchupTables?where=\"SiteGUID = '" + UserData[0].SiteGUID + "' AND MatchupTableName = 'EquipmentByMachineType' AND IsActive = '1'\"", function( data ) {
					var tableName		= data[0].MatchupTableName;
					var targetSchema	= data[0].TargetSchema;
					var targetTable		= data[0].TargetTable;
					var targetDB		= data[0].TargetDB;
					var targetTableGUID = data[0].MatchupTableGUID;
					
					MaterializeTable(tableName, targetSchema, targetTable, targetDB, targetTableGUID);
				});
			},
			error: function(){
				DisplayAlert(languagePack.message.error,languagePack.message.recordsNotUpdated);
			}
		});
	}
}

function CreateMachineDownEvent(createdDownEventsArray, modifiedDownEventsArray) {
	
	if(createdDownEventsArray.length > 0) {
		var jsonData = {
			 "fields": createdDownEventsArray
		};
		
		$.ajax ({
			headers: {
				"Content-Type": "application/json"
			},
			url: ruIP + ruPort + planningDB + planningEN + "create/bulk/trans/MachineDownEvent",
			type: "POST",
			data: JSON.stringify(jsonData),
			success: function(){
				ModifyMachineDownEvent(modifiedDownEventsArray);
			},
			error: function(){
				DisplayAlert(languagePack.message.error,languagePack.message.recordsNotUpdated);
				ModifyMachineDownEvent(modifiedDownEventsArray);
			}
		});
	}
	else {		
		ModifyMachineDownEvent(modifiedDownEventsArray);
	}
}

function ModifyMachineDownEvent(modifiedDownEventsArray) {
	
	if(modifiedDownEventsArray.length > 0) {
		var jsonData = {
			 "fields": modifiedDownEventsArray
		};
		
		$.ajax ({
			headers: {
				"Content-Type": "application/json"
			},
			url: ruIP + ruPort + planningDB + planningEN + "update/bulk/trans/MachineDownEvent",
			type: "POST",
			data: JSON.stringify(jsonData),
			success: function(){
				CloseChecklist();
			},
			error: function(){
				DisplayAlert(languagePack.message.error,languagePack.message.recordsNotUpdated);
				CloseChecklist();
			}
		});
	}
	else {		
		CloseChecklist();
	}
}

function UpdateMachineDetails(createdMachineDetailsArray, updatedMachineDetailsArray) {
	
	if(createdMachineDetailsArray.length > 0) {
		
		var jsonData = {
			 "fields": createdMachineDetailsArray
		};
		
		$.ajax ({
			headers: {
				"Content-Type": "application/json"
			},
			url: ruIP + ruPort + planningDB + planningEN + "create/bulk/trans/Lineup_MachineDetail",
			type: "POST",
			data: JSON.stringify(jsonData),
			success: function(){
			},
			error: function(){
				DisplayAlert(languagePack.message.error,languagePack.message.recordsNotUpdated);
			}
		});
	}
	
	if(updatedMachineDetailsArray.length > 0) {
		
		var jsonData = {
			 "fields": updatedMachineDetailsArray
		};
		
		$.ajax ({
			headers: {
				"Content-Type": "application/json"
			},
			url: ruIP + ruPort + planningDB + planningEN + "update/bulk/trans/Lineup_MachineDetail",
			type: "POST",
			data: JSON.stringify(jsonData),
			success: function(){
			},
			error: function(){
				DisplayAlert(languagePack.message.error,languagePack.message.recordsNotUpdated);
			}
		});
	}
}

function UpdateCommonFields(operatorTimesArray, machineLocationsArray, lnup_insertedQuestions, lnup_updatedQuestions) {

	checklist_submit(lnup_insertedQuestions, lnup_updatedQuestions);
	
	if(operatorTimesArray.length > 0) {
		
		var jsonData = {
			 "fields": operatorTimesArray
		};
		
		$.ajax ({
			headers: {
				"Content-Type": "application/json"
			},
			url: ruIP + ruPort + planningDB + planningEN + "update/bulk/trans/Lineup",
			type: "POST",
			data: JSON.stringify(jsonData),
			success: function(){
			},
			error: function(){
				DisplayAlert(languagePack.message.error,languagePack.message.recordsNotUpdated);
			}
		});
	}
	
	if(machineLocationsArray.length > 0) {
		
		var jsonData = {
			 "fields": machineLocationsArray
		};
		
		$.ajax ({
			headers: {
				"Content-Type": "application/json"
			},
			url: ruIP + ruPort + planningDB + planningEN + "update/bulk/trans/Lineup_StepDetail",
			type: "POST",
			data: JSON.stringify(jsonData),
			success: function(){
			},
			error: function(){
				DisplayAlert(languagePack.message.error,languagePack.message.recordsNotUpdated);
			}
		});
	}
}

function CreateHaulageDetails(createdHaulageDetailsArray, updatedHaulageDetailsArray) {
	if(createdHaulageDetailsArray.length > 0) {
		
		var jsonData = {
			 "fields": createdHaulageDetailsArray
		};
		
		$.ajax ({
			headers: {
				"Content-Type": "application/json"
			},
			url: ruIP + ruPort + planningDB + planningEN + "create/bulk/trans/Lineup_HaulageDetail",
			type: "POST",
			data: JSON.stringify(jsonData),
			success: function(){				
				UpdateHaulageDetails(updatedHaulageDetailsArray);
			},
			error: function(){
				DisplayAlert(languagePack.message.error,languagePack.message.recordsNotUpdated);
			}
		});
	}
	else {
		UpdateHaulageDetails(updatedHaulageDetailsArray);
	}
}

function UpdateHaulageDetails(updatedHaulageDetailsArray) {
	if(updatedHaulageDetailsArray.length > 0) {
		
		var jsonData = {
			 "fields": updatedHaulageDetailsArray
		};
		
		$.ajax ({
			headers: {
				"Content-Type": "application/json"
			},
			url: ruIP + ruPort + planningDB + planningEN + "update/bulk/trans/Lineup_HaulageDetail",
			type: "POST",
			data: JSON.stringify(jsonData),
			success: function(){
				CloseChecklist();
			},
			error: function(){
				DisplayAlert(languagePack.message.error,languagePack.message.recordsNotUpdated);
				CloseChecklist();
			}
		});
	}
	else {
		CloseChecklist();
	}
}

function checklist_validate(data) {	
	var checklistType = $('#lineup_checklist_form').attr('ChecklistType');
	for(var key in data) {
		
		if(checklistType == machineDetails) {
			if(!(data[key].Value_2 > data[key].Value_1)) {
				DisplayAlert(languagePack.message.error,'"'+data[key].Question_Name+'" '+ "the end value must be greater than the begin value.");//languagePack.message.requiredQuestion);
				ServiceComplete();
				return false;
			}
			if((data[key].Value_2 - 8) >= data[key].Value_1) {
				DisplayAlert(languagePack.message.error,'"'+data[key].Question_Name+'" '+ "the end value must be with in 8 hours of the begin value.");//languagePack.message.requiredQuestion);
				ServiceComplete();
				return false;
			}
		}
		
		if((data[key].Value_1 == undefined) && data[key].IsManadatory == true) {
			DisplayAlert(languagePack.message.error,'"'+data[key].Question_Name+'" '+ languagePack.message.requiredQuestion);
			ServiceComplete();
			return false;
		}
		if(data[key].Value_2 != null){
			if((data[key].Value_2 == undefined) && data[key].IsManadatory == true) {
				DisplayAlert(languagePack.message.error,'"'+data[key].Question_Name+'" '+ languagePack.message.requiredQuestion);
				ServiceComplete();
				return false;
			}
		}
	}
	return true;
}

function checklist_submit(lnup_insertedQuestions, lnup_updatedQuestions) {
	
	if(lnup_insertedQuestions.length > 0) {
		var jsonData = {
			 "fields": lnup_insertedQuestions
		};
		
		$.ajax ({
			headers: {
				"Content-Type": "application/json"
			},
			url: ruIP + ruPort + planningDB + planningEN + "create/bulk/trans/Lineup_FormDetail",
			type: "POST",
			data: JSON.stringify(jsonData),
			success: function(){				
				checklist_update(lnup_updatedQuestions);
			},
			error: function(){
				DisplayAlert(languagePack.message.error,languagePack.message.recordsNotUpdated);
			}
		});
	}
	else {
		checklist_update(lnup_updatedQuestions);
	}
}

function checklist_update(lnup_updatedQuestions) {
	if(lnup_updatedQuestions.length > 0) {
		var jsonData = {
			 "fields": lnup_updatedQuestions
		};
		
		$.ajax ({
			headers: {
				"Content-Type": "application/json"
			},
			url: ruIP + ruPort + planningDB + planningEN + "update/bulk/trans/Lineup_FormDetail",
			type: "POST",
			data: JSON.stringify(jsonData),
			success: function(){
				CloseChecklist();
			},
			error: function(){
				DisplayAlert(languagePack.message.error,languagePack.message.recordsNotUpdated);
				CloseChecklist();
			}
		});
	}
	else {
		CloseChecklist();
	}
}

function materials_export() {
	var newArray = [];
	$.each(lnup_dataQ, function (i, item) {
		var newObj = {};
		
		newObj.Lineup_GUID     		     = lnup_planGUID;
		newObj.Lineup_MeasureDetail_GUID = item.Lineup_MeasureDetail_GUID;
		
		if($('#Real-'+item.Lineup_MeasureDetail_GUID).val()) {
			if($('#Real-'+item.Lineup_MeasureDetail_GUID).val() == "") {
				newObj.ActualValue_1 = null;
			}
			else {
				newObj.ActualValue_1 = $('#Real-'+item.Lineup_MeasureDetail_GUID).val();
			}
		}
		
		if($('#Sobrante-'+item.Lineup_MeasureDetail_GUID).val()) {
			if($('#Sobrante-'+item.Lineup_MeasureDetail_GUID).val() == "") {
				newObj.ActualValue_2 = null;
			}
			else {
				newObj.ActualValue_2 = $('#Sobrante-'+item.Lineup_MeasureDetail_GUID).val();
			}
		}
		
		if($('#tope-'+item.Lineup_MeasureDetail_GUID).val()) {
			if($('#tope-'+item.Lineup_MeasureDetail_GUID).val() == "") {
				newObj.ActualValue_1 = null;
			}
			else {
				newObj.ActualValue_1 = $('#tope-'+item.Lineup_MeasureDetail_GUID).val();
			}
		}
		
		if($('#nicho-'+item.Lineup_MeasureDetail_GUID).val()) {
			if($('#nicho-'+item.Lineup_MeasureDetail_GUID).val() == "") {
				newObj.ActualValue_2 = null;
			}
			else {
				newObj.ActualValue_2 = $('#nicho-'+item.Lineup_MeasureDetail_GUID).val();
			}
		}
		
		if($('#desborde-'+item.Lineup_MeasureDetail_GUID)) {
			if($('#desborde-'+item.Lineup_MeasureDetail_GUID).val() == "") {
				newObj.ActualValue_3 = null;
			}
			else {
				newObj.ActualValue_3 = $('#desborde-'+item.Lineup_MeasureDetail_GUID).val();
			}
		}
		
		if($('#descostre-'+item.Lineup_MeasureDetail_GUID)) {
			if($('#descostre-'+item.Lineup_MeasureDetail_GUID).val() == "") {
				newObj.ActualValue_4 = null;
			}
			else {
				newObj.ActualValue_4 = $('#descostre-'+item.Lineup_MeasureDetail_GUID).val();
			}
		}
		
		newArray.push(newObj);
	});
	
	return newArray;
}

function materials_validate(data) {
	for(var key in data) {
		if(data[key].ActualValue_1 == undefined && data[key].IsManadatory == true) {
			DisplayAlert(languagePack.message.error,'"' + data[key].MeasureDisplayName + '" ' + languagePack.message.required);
			ServiceComplete();
			return false;
		}
	}
	return true;
}

function materials_submit(lnup_updatedQuestions) {
	if(lnup_updatedQuestions.length > 0) {
		var jsonData = {
			 "fields": lnup_updatedQuestions
		};

		$.ajax ({
			headers: {
				"Content-Type": "application/json"
			},
			url: ruIP + ruPort + planningDB + planningEN + "update/bulk/trans/Lineup_MeasureDetail",
			type: "POST",
			data: JSON.stringify(jsonData),
			success: function(){
				CloseChecklist();
			},
			error: function(){
				DisplayAlert(languagePack.message.error,languagePack.message.recordsNotUpdated);
				CloseChecklist();
			}
		});
	}
	else {
		CloseChecklist();
	}
}

function GrabStatusLocationInfo(lineupGuid, locationStatusGuid) {
		
	var jqxhrLocationFromLineup = $.getJSON(ruIP + ruPort + planningDB + planningEN + "read/trans/Lineup?where=\"Lineup_GUID = '"+lineupGuid+"'\"", function() {
		var lineup              = jQuery.parseJSON(jqxhrLocationFromLineup.responseText);
		
		var locationGuid = "";
		
		if(lineup.length > 0) {
			locationGuid = lineup[0].Location_GUID;
		}
			
		var jqxhrLocationCurrentStatus = $.getJSON(ruIP + ruPort + planningDB + planningEN + "read/geo/LocationCurrentStatus?where=\"Location_GUID = '"+locationGuid+"' Order By Created Desc\"", function() {
			var currentStatus          = jQuery.parseJSON(jqxhrLocationCurrentStatus.responseText);
			
			var locationCurrentStatusGuid = "";
			var dataObj        = {};
			var apiKeyObj      = {};
			var existingStatus = false;
			
			dataObj.LocationCurrentStatus_GUID = CreateGUID();
			dataObj.Location_GUID              = locationGuid;
			dataObj.LocationStatus_GUID        = locationStatusGuid;
			dataObj.IsActive                   = true;
			dataObj.Modified                   = moment().format("YYYY-MM-DDTHH:mm:ss.000z");
			dataObj.Obsolete                   = moment().format("9999-12-31T00:00:00.000z");
			dataObj.LastUpdatedBy              = UserData[0].PersonGUID;
			
			if(currentStatus.length > 0) {
				if(currentStatus[0].LocationCurrentStatus_GUID) {
					locationCurrentStatusGuid = currentStatus[0].LocationCurrentStatus_GUID;
					apiKeyObj.LocationCurrentStatus_GUID = locationCurrentStatusGuid;
					dataObj.APIKEY = apiKeyObj;
					existingStatus = true;
				}
			}

			if(existingStatus) {
				UpdateCurrentLocationStatus(locationCurrentStatusGuid, locationStatusGuid);
			}
			else {
				dataObj.Created = moment().format("YYYY-MM-DDTHH:mm:ss.000z");
				dataObj.CreatedBy = UserData[0].PersonGUID;
				if(dataObj.LocationStatus_GUID != "0") {
					CreateCurrentLocationStatus(dataObj);
				}
			}			
		});			
	});
}

function CreateCurrentLocationStatus(dataObj) {
	var jsonData = {
		 "fields": dataObj
	};

	$.ajax ({
		headers: {
			"Content-Type": "application/json"
		},
		url: ruIP + ruPort + planningDB + planningEN + "create/geo/LocationCurrentStatus",
		type: "POST",
		data: JSON.stringify(jsonData),
		success: function(){
		},
		error: function(){
			DisplayAlert(languagePack.message.error,languagePack.message.recordsNotUpdated);
		}
	});	
}

function UpdateCurrentLocationStatus(recordGuid, newStatus) {
	var jsonData = {
		 "key": { "LocationCurrentStatus_GUID":recordGuid },
		 "fields": { "LocationStatus_GUID": newStatus, "Modified": moment().format("YYYY-MM-DDTHH:mm:ss.000z") }
	};

	$.ajax ({
		headers: {
			"Content-Type": "application/json"
		},
		url: ruIP + ruPort + planningDB + planningEN + "update/geo/LocationCurrentStatus",
		type: "POST",
		data: JSON.stringify(jsonData),
		success: function(){
		},
		error: function(){
			DisplayAlert(languagePack.message.error,languagePack.message.recordsNotUpdated);
		}
	});
}

function CloseForm() {
	$("#checklist_close").click();
	currentChecklist.click();
}

function CloseChecklist() {
	
	ClosePopupWrapper();
	$(".modal-box, .modal-overlay").fadeOut(500, function() {
		$(".modal-overlay").remove();
	});
	
	currentChecklistIcon.removeClass("checklist-cready");
	currentChecklistIcon.removeClass("checklist-cnotready");
	currentChecklistIcon.addClass("checklist-cpending");
	$("#lineup_checklist_body").html(" ");
	//$('#lineup_calendar_view thead > tr').remove();
	//$('#lineup_calendar_view tbody > tr').remove();
	lnup_answerdata = [];
	//GetLineupDetails();
	ServiceComplete();
}

function InitializeGauges(index) {
	//DESTROY AND RE-INITIALIZE START SHIFT HYDRAULIC GAUGE AND SLIDER
		
	$('#start_shift_hydraulic_gauge_'+index).jqxLinearGauge('destroy');

	if($("#start_shift_hydraulic_gauge_"+index).length == 0) {
		$("#gaugeWidget1_"+index).append('<div id="start_shift_hydraulic_gauge_'+index+'" style="margin-left:calc(50% - 75px)" class="formElement" elementType="linearGauge" databaseColumn="StartShiftHydraulicGauge_'+index+'"></div>');
	}
	
	 $('#start_shift_hydraulic_gauge_'+index).jqxLinearGauge({
		orientation: 'vertical',
		labels: { interval: .25 },
		ticksMajor: { size: '10%', interval: .25 },
		ticksMinor: { size: '5%', interval: .125, style: { 'stroke-width': 1, stroke: '#aaaaaa'} },
		max: 1,
		min: 0,
		value: 0,
		width: 150,
		pointer: { size: '6%' },
		colorScheme: 'scheme05',
		animationDuration: 500
	});
	
	$('#start_shift_hydraulic_slider_'+index).jqxSlider('destroy');

	if($("#start_shift_hydraulic_slider_"+index).length == 0) {
		$("#gaugeWidget1_"+index).append('<div id="start_shift_hydraulic_slider_'+index+'" class="formElement" elementType="linearGaugeSlider" databaseColumn="StartShiftHydraulicSlider_'+index+'"></div>');
	}
	
	$('#start_shift_hydraulic_slider_'+index).jqxSlider({ min: 0, max: 1, mode: 'fixed', ticksFrequency: .125, width: 200, value: 0,  showButtons: true, step: .125 });
	$('#start_shift_hydraulic_slider_'+index).on("change", function () {
		$('#start_shift_hydraulic_gauge_'+index).jqxLinearGauge('value', $('#start_shift_hydraulic_slider_'+index).jqxSlider('value'));
	});
	$('#start_shift_hydraulic_gauge_'+index).jqxLinearGauge('value', 0);
	
	
	
	
	//DESTROY AND RE-INITIALIZE END SHIFT HYDRAULIC GAUGE AND SLIDER
	
	$('#end_shift_hydraulic_gauge_'+index).jqxLinearGauge('destroy');

	if($("#end_shift_hydraulic_gauge_"+index).length == 0) {
		$("#gaugeWidget2_"+index).append('<div id="end_shift_hydraulic_gauge_'+index+'" style="margin-left:calc(50% - 75px)" class="formElement" elementType="linearGauge" databaseColumn="EndShiftHydraulicGauge_'+index+'"></div>');
	}
	
	$('#end_shift_hydraulic_gauge_'+index).jqxLinearGauge({
		orientation: 'vertical',
		labels: { interval: .25 },
		ticksMajor: { size: '10%', interval: .25 },
		ticksMinor: { size: '5%', interval: .125, style: { 'stroke-width': 1, stroke: '#aaaaaa'} },
		max: 1,
		min: 0,
		value: 0,
		width: 150,
		pointer: { size: '6%' },
		colorScheme: 'scheme05',
		animationDuration: 500
	});
	
	$('#end_shift_hydraulic_slider_'+index).jqxSlider('destroy');

	if($("#end_shift_hydraulic_slider_"+index).length == 0) {
		$("#gaugeWidget2_"+index).append('<div id="end_shift_hydraulic_slider_'+index+'" class="formElement" elementType="linearGaugeSlider" databaseColumn="EndShiftHydraulicSlider_'+index+'"></div>');
	}
	
	$('#end_shift_hydraulic_slider_'+index).jqxSlider({ min: 0, max: 1, mode: 'fixed', ticksFrequency: .125, width: 200, value: 0,  showButtons: true, step: .125 });
	$('#end_shift_hydraulic_slider_'+index).on("change", function () {
		$('#end_shift_hydraulic_gauge_'+index).jqxLinearGauge('value', $('#end_shift_hydraulic_slider_'+index).jqxSlider('value'));
	});
	$('#end_shift_hydraulic_gauge_'+index).jqxLinearGauge('value', 0);
	
	
	
	
	//DESTROY AND RE-INITIALIZE FUEL GAUGE AND SLIDER
	
	$('#fuel_gauge_'+index).jqxGauge('destroy');

	if($("#fuel_gauge_"+index).length == 0) {
		$("#gaugeWidget3_"+index).append('<div id="fuel_gauge_'+index+'" class="formElement" elementType="linearGauge" databaseColumn="FuelGauge_'+index+'"></div>');
	}
	
	$('#fuel_gauge_'+index).jqxGauge({
		ranges: [{ startValue: 0, endValue: .125, style: { fill: '#e53d37', stroke: '#e53d37' }, startDistance: 0, endDistance: 0 },
				 { startValue: .125, endValue: .5, style: { fill: '#fad00b', stroke: '#fad00b' }, startDistance: 0, endDistance: 0 },
				 { startValue: .5, endValue: 1, style: { fill: '#4cb848', stroke: '#4cb848' }, startDistance: 0, endDistance: 0}],
		cap: { size: '5%', style: { fill: '#2e79bb', stroke: '#2e79bb'} },
		border: { style: { fill: '#8e9495', stroke: '#7b8384', 'stroke-width': 1 } },
		ticksMinor: { interval: .125, size: '5%' },
		ticksMajor: { interval: .25, size: '10%' },
		max: 1,
		min: 0,
		value: 0,      
		labels: { position: 'outside', interval: .25 },
		pointer: { style: { fill: '#2e79bb' }, width: 5 },
		animationDuration: 500
	});
	
	$('#fuel_slider_'+index).jqxSlider('destroy');

	if($("#fuel_slider_"+index).length == 0) {
		$("#gaugeWidget3_"+index).append('<div id="fuel_slider_'+index+'" class="formElement" elementType="linearGaugeSlider" databaseColumn="FuelSlider_'+index+'"></div>');
	}
	
	$('#fuel_slider_'+index).jqxSlider({ min: 0, max: 1, mode: 'fixed', ticksFrequency: .125, width: 350, value: 0,  showButtons: true, step: .125 });
	$('#fuel_slider_'+index).on("change", function () {
		$('#fuel_gauge_'+index).jqxGauge('value', $('#fuel_slider_'+index).jqxSlider('value'));
	});
	$('#fuel_gauge_'+index).jqxGauge('value', 0);
	
	
	
	
	//DESTROY AND RE-INITIALIZE ELECTRIC SOURCE DISTANCE GAUGE AND SLIDER
	
	$('#electric_source_distance_gauge_'+index).jqxLinearGauge('destroy');

	if($("#electric_source_distance_gauge_"+index).length == 0) {
		$("#gaugeWidget4_"+index).append('<div id="electric_source_distance_gauge_'+index+'" style="margin-left:calc(50% - 75px)" class="formElement" elementType="linearGauge" databaseColumn="ElectricSourceDistanceGauge_'+index+'"></div>');
	}
	
	 $('#electric_source_distance_gauge_'+index).jqxLinearGauge({
		orientation: 'vertical',
		labels: { interval: 25 },
		ticksMajor: { size: '10%', interval: 12.5 },
		ticksMinor: { size: '5%', interval: 6.25, style: { 'stroke-width': 1, stroke: '#aaaaaa'} },
		max: 50,
		min: 0,
		value: 0,
		width: 150,
		pointer: { size: '6%' },
		colorScheme: 'scheme05',
		animationDuration: 500
	});
	
	$('#electric_source_distance_slider_'+index).jqxSlider('destroy');

	if($("#electric_source_distance_slider_"+index).length == 0) {
		$("#gaugeWidget4_"+index).append('<div id="electric_source_distance_slider_'+index+'" class="formElement" elementType="linearGaugeSlider" databaseColumn="ElectricSourceDistanceSlider_'+index+'"></div>');
	}
	
	$('#electric_source_distance_slider_'+index).jqxSlider({ min: 0, max: 50, mode: 'fixed', ticksFrequency: 6.25, width: 200, value: 0,  showButtons: true, step: 6.25 });
	$('#electric_source_distance_slider_'+index).on("change", function () {
		$('#electric_source_distance_gauge_'+index).jqxLinearGauge('value', $('#electric_source_distance_slider_'+index).jqxSlider('value'));
	});
	$('#electric_source_distance_gauge_'+index).jqxLinearGauge('value', 0);
}

function FormatEUDate(dateTime) {
	(!dateTime) ? dateTime = "" : false;

	if(dateTime == "") {
		return "";
	}
	else {
		var euDateTime		= dateTime;
		var euDateTimeArr	= euDateTime.split(" ");
		var euDate			= euDateTimeArr[0];
		var euTime			= euDateTimeArr[1];
		var euDateArr		= euDate.split("/");
		var euDay			= euDateArr[0];
		var euMonth			= euDateArr[1];
		var euYear			= euDateArr[2];
		var naDate			= euYear + "-" + euMonth + "-" + euDay + " " + euTime;

		return moment(naDate).format("YYYY-MM-DDTHH:mm:ss.000z");
	}
}

function RemoveLineup(lineup_guid) {
	DisplayConfirm(languagePack.message.confirm,languagePack.prelineup.deleteLinuepConfirm,
		function() {
		
			var inputParams  = [];
			
			var param1 = {"paramName":"Lineup_GUID", "paramType":"varchar", "paramValue":lineup_guid};
			
			inputParams.push(param1);
			
			var inputParamsContainer         = {};
			inputParamsContainer.inputParams = inputParams;
			
			$.ajax ({
				headers: {
					"Content-Type": "application/json"
				},
				url: ruIP + ruPort + planningDB + planningEN + 'exec/procedureold/dbo.Deactivate_Lineup',
				type: "POST",
				data: JSON.stringify(inputParamsContainer),
				success: function(data) {
					$("#lineup_toggle").removeClass("isinfocus");
					$("#lineup_toggle").click();
				}
			});
		}
	);
}

function MaterializeTable(tableName, targetSchema, targetTable, targetDB, targetTableGUID) {
	
	var inputParams  = [];
	
	var param1 = {"paramName":"TableGUID",			"paramType":"varchar", "paramValue":targetTableGUID};
	var param2 = {"paramName":"TargetTableName",	"paramType":"varchar", "paramValue":targetTable};
	var param3 = {"paramName":"TableSchema",		"paramType":"varchar", "paramValue":targetSchema};
	var param4 = {"paramName":"TargetDB",			"paramType":"varchar", "paramValue":targetDB};
	
	inputParams.push(param1);
	inputParams.push(param2);
	inputParams.push(param3);
	inputParams.push(param4);
	
	var inputParamsContainer         = {};
	inputParamsContainer.inputParams = inputParams;
	
	$.ajax ({
		headers: {
			"Content-Type": "application/json"
		},
		url: ruIP + ruPort + listsDB + listEN + 'exec/procedureold/dbo.TOT_DROP_CREATE_TARGET_DB',
		type: "POST",
		data: JSON.stringify(inputParamsContainer),
		success: function(data) {
		}
	});
}







