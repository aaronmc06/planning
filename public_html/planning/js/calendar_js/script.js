/*============================================================
	Property of:		MISOM TECHNOLOGIES
	Developer:			JORGE MURILLO
	Application Name:	FARA_FRESNILLO
	Directory:			FARA_FRESNILLO/PLANNING/JS/CALENDAR_JS
	File Name:			script.js
=============================================================*/

var checklistType;
var dataQ;
var planGUID;
var insertedQuestions = [];
var updatedQuestions = [];
var statusData = [];
var plandata;
var answerdata = [];
var checkEdit;
var dayCheck;
var checkListLength = 0;
var currentChecklist;

$(document).ready(function(){	
	$(".lang-common.accept").html(languagePack.common.accept);
	$(".lang-common.cancel").html(languagePack.common.cancel);
	$(".lang-common.print").html(languagePack.common.print);
	
	$('td').hover(function() {
		$(this).parents('table').find('col:eq('+$(this).index()+')').toggleClass('hover');
	});
	
	$('#calendar_location_select option')[0].selected = true;
	
	calendar_load();
});

function calendar_load(){
	var jqxhrPlan = $.getJSON(ruIP + ruPort + planningDB + planningEN + "read/trans/Plan?where=\"PlanConfig_GUID = '"+planConfigGUID+"' AND IsActive = '1' ORDER BY Shift, ShiftDate ASC\"", function() {
		plandata = $.parseJSON(jqxhrPlan.responseText);
		var planindex = 0;
		
		var jqxhrSteps = $.getJSON(ruIP + ruPort + planningDB + planningEN + "read/dbo/v_PlanStepDetail?where=\"PlanConfig_GUID = '"+planConfigGUID+"' AND Plan_StepDetail_IsActive = '1'\"", function() {
			var psData = $.parseJSON(jqxhrSteps.responseText);
			
			var jqxhrStepMachines = $.getJSON(ruIP + ruPort + planningDB + planningEN + "read/dbo/v_PlanStepMachine?where=\"PlanConfig_GUID = '"+planConfigGUID+"' AND Plan_StepMachine_IsActive = '1'\"", function() {
				var psmData = $.parseJSON(jqxhrSteps.responseText)
		
				var jqxhrArr = $.getJSON(ruIP + ruPort + planningDB + planningEN + "read/cfg/ChecklistType?where=\"IsActive = '1' AND UsageType = 'Planning'\"", function() {
					var data = $.parseJSON(jqxhrArr.responseText);
					checkListLength = data.length;
					var trHead = '';
					var trBody = '';
					
					trHead += '<tr><th class="main-header" colspan="8">'+currentWeek + " " + languagePack.calendar.forLocation + ": " + locationLocalFilter+'</th></tr>';
					trHead += '<tr><th class="day-header"></th>';
					
					for(var i = 0; i < 7; i++){
						var firstDWeek = $('#plan_week_selector').val();
						var date = moment(firstDWeek).add(i,'days').format("dddd, Do MMM");
						trHead += '<th class="day-header">'+date+'</th>';
					}
					
					trHead += '</tr>';
					
					$("#calendar-view thead").append(trHead);
					
					for(var i = 0; i < 3; i++){
						if(i == 0){
							trBody += '<tr><th class="time-header">'+languagePack.datetime.firstShift+'</th>';
						}
						else if(i == 1){
							trBody += '<tr><th class="time-header">'+languagePack.datetime.secondShift+'</th>';
						}
						else{
							trBody += '<tr><th class="time-header">'+languagePack.datetime.thirdShift+'</th>';
						}
						
						for (var j = 0; j < 7; j++){
							var trBodyTemp    = "";
							var hasChecklist = false;
							
							if(planindex < 20){
								
								$.each(data, function (l, item) {
									var executed = false;
									
									for(var key in psData) {
										if(psData[key].Plan_GUID == plandata[planindex].Plan_GUID && !executed) {
											executed     = true;
											hasChecklist = true;
											trBodyTemp += '<div class="qsection"><div class="checklist-cnotready" id="'+ plandata[planindex].Plan_GUID + item.ChecklistType_GUID+'" onclick="checklist_Click(this,\''+item.ChecklistType_GUID+'\', \''+item.ChecklistType_Name+'\', \''+plandata[planindex].Plan_GUID+'\')"></div><span class="checklist-row"><a href="#" onclick="checklist_Click(this,\''+item.ChecklistType_GUID+'\', \''+item.ChecklistType_Name+'\', \''+plandata[planindex].Plan_GUID+'\')">'+item.ChecklistType_Name+'</a></span></div>';
											
											if(l >= data.length - 1) {
												for(var key2 in psmData) {
													if(psmData[key2].Plan_GUID == psData[key].Plan_GUID) {
														var readyornot = "cready";
													
														if(psmData[key2].MachineStatus == languagePack.common.down.toUpperCase()) {
															readyornot = "cnotready";
														}
														
														(psmData[key2].Machine_GUID) ? trBodyTemp += '<div class="qsection"><div class="checklist-'+readyornot+'" id="'+ psmData[key2].Plan_GUID + psmData[key2].Machine_GUID+'"></div><span class="checklist-row"><div>'+psmData[key2].MachineDisplayName+'</div></span></div>' : false;
													}
												}
											}
										}
										
									}
								});
								
								if(hasChecklist) {
									trBody += '<td planguid="'+ plandata[planindex].Plan_GUID +'" class="plan-row"><span class="title-row">'+languagePack.calendar.planPreparation+'</span><hr>';
									trBody += trBodyTemp;
								}
								else {
									trBody += '<td planguid="'+ plandata[planindex].Plan_GUID +'" class="plan-row-empty"><span class="title-row-empty">'+languagePack.calendar.noActivitiesAvailable+'</span>';								
								}
								
								planindex++;
								trBody += '</td>';
							}
							else{
								trBody += '<td class="plan-row-empty"><span class="title-row-empty">'+languagePack.calendar.noActivitiesAvailable+'</span></td>';
							}						
						}
						
						trBody += '</tr>';
					}
					$("#calendar-view tbody").append(trBody);
					checklist_ready();
				});
			});
		});
	});
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

$('#calendar-view').on('click', '.plan-row', function () {
	var th = $('#calendar-view th').eq($(this).index() + 1);
	dayCheck = th.text();
});

function checklist_ready(){
	var planindex2 = 0;
	var jqxhrStatus = $.getJSON(ruIP + ruPort + planningDB + planningEN + "read/bi/Plan_ChecklistStatus?where=\"PlanConfig_GUID = '"+planConfigGUID+"'\"", function() {
		statusData = $.parseJSON(jqxhrStatus.responseText);
		var clCount = 0;
		
		for(var i = 0; i < 3; i++){
			for (var j = 0; j < 7; j++){
				if(planindex2 < 20){
					for(var k = 0; k < statusData.length; k++)
					{
						if((statusData[k].Plan_GUID == plandata[planindex2].Plan_GUID))
						{
							if(statusData[k].Status == "Ready"){
								$("#"+plandata[planindex2].Plan_GUID+statusData[k].ChecklistType_GUID).removeClass().addClass("checklist-cready");
							}
							else if(statusData[k].Status == "NotReady"){
								$("#"+plandata[planindex2].Plan_GUID+statusData[k].ChecklistType_GUID).removeClass().addClass("checklist-cnotready");
							}
						}
					}
					planindex2++;
				}
			}
		}
		
		$(".plan-row").each(function() {
			var cell = $(this);
			var numberReady = 0;
			$(".checklist-cready", this).each(function() {
				numberReady++;
			});
			
			if(numberReady == checkListLength) {
				cell.find(".generateLineupBtn").removeClass("buttonInactive");
			}
		});
		
		UpdateLineUpReadyStatus();
		
	});
}

function checklist_Click(element, checklistGUID, checklistName, pGUID) {
	currentChecklist = $(element);
	planGUID = pGUID;
	var appendthis =  ("<div class='modal-overlay js-modal-close'></div>");
	
    $("body").append(appendthis);
	OpenPopupWrapper();
	  
    $(".modal-overlay").fadeTo(500, 0.7);
	$('#checklist-form').fadeIn($(this).data());
 	
	$(".js-modal-close, .modal-overlay").click(function() {
		ClosePopupWrapper();
	    $(".modal-box, .modal-overlay").fadeOut(500, function() {
	        $(".modal-overlay").remove();
	    });
		$("#checklist-head").html(" ");
		$("#checklist-body").html(" ");
	});
	
	setTimeout(function() {
		$("#checklist-title").html(checklistName + " - " + dayCheck);
	}, 500);
	
	var jqxhrArr2 = $.getJSON(ruIP + ruPort + planningDB + planningEN + "read/web/v_ChecklistQuestion?where=\"ChecklistType_GUID = '"+ checklistGUID +"' AND IsActive = '1'\"", function() {
	    dataQ = $.parseJSON(jqxhrArr2.responseText);
		checklistType = checklistGUID;
		checkEdit = false;
		
		$.each(dataQ, function (i, item) {
			var checkTables = '';
			var trTitleHead = '';
			var trHead = '';
			var trBody = '';
			var num = i+1;

			if($("#"+item.ChecklistGroup_GUID).length){
		        trBody += '<tr class="checkrow" checklistquestion="'+item.ChecklistQuestion_GUID+'"><td>'+ num +'</td><td>' + item.Question_Name + '</td>';
		        
		        if (item.InputType_1 == 'Radio'){
		            trBody += '<td><input type="radio" class="btn-radio formElement" elementType="radiogroup" name="Answer1-'+item.ChecklistQuestion_GUID+'" value="1"></td><td><input type="radio" class="btn-radio formElement" elementType="radiogroup" name="Answer1-'+item.ChecklistQuestion_GUID+'" value="0"></td>';
		        }
		        else if(item.InputType_1 == 'Textbox') {
		            trBody += '<td><input class="formElement" elementType="textbox" type="text" id="Input-'+item.ChecklistQuestion_GUID+'"></input></td>';
		        }
		        if(item.InputType_2 == 'Textbox'){
		            trBody += '<td><input class="formElement" elementType="textbox" type="text" id="Input2-'+item.ChecklistQuestion_GUID+'"></input></td>';
		        }
		        else if(item.InputType_2 == 'Radio'){
		            trBody += '<td><input type="radio" class="btn-radio formElement" elementType="radiogroup" name="Answer2-'+item.ChecklistQuestion_GUID+'" value="1"></td><td><input type="radio" class="btn-radio formElement" elementType="radiogroup" name="Answer2-'+item.ChecklistQuestion_GUID+'" value="0"></td>';
		        }
		        if(item.IsCommentReqd == true){
		            trBody += '<td><textarea class="formElement" elementType="textarea" id="Comments-'+item.ChecklistQuestion_GUID+'" rows="2" cols="50"></textarea></td>';
		        }
		        
		        trBody += '</tr>';
				
				$('#'+item.ChecklistGroup_GUID+' tbody').append(trBody);
			}
			else{
				checkTables += '<table id="'+item.ChecklistGroup_GUID+'" class="checklist-table">';
				checkTables += '<col width="50"><thead></thead><tbody></tbody></table>';
				
				$("#checklist-body").append(checkTables);
			    
			    trTitleHead += '<tr><th class="main-header" colspan="7">'+item.ChecklistGroupName+'</th></tr>';
			    $('#'+item.ChecklistGroup_GUID+' thead').append(trTitleHead);
			    
			    trHead += '<tr><th>'+languagePack.common.num+'</th><th>'+languagePack.calendar.questionName+'</th>';
			    if(item.InputType_1 == 'Radio'){
			        trHead += '<th>'+languagePack.common.yes+'</th><th>'+languagePack.common.no+'</th>';
			    }
			    else if(item.InputType_1 == 'Textbox'){
			        trHead += '<th>'+languagePack.calendar.howMany+'</th>';
			    }
			    if(item.InputType_2 == 'Radio'){
			        trHead += '<th>'+languagePack.common.yes+'</th><th>'+languagePack.common.no+'</th>';
			    }
			    else if(item.InputType_2 == 'Textbox'){
			        trHead += '<th>'+languagePack.calendar.variety+'</th>';
			    }
			    if(item.IsCommentReqd == true){
			        trHead += '<th>'+languagePack.common.comments+'</th>';
			    }
			    trHead += '</tr>';
			    $('#'+item.ChecklistGroup_GUID+' thead').append(trHead);
        		
		        trBody += '<tr class="checkrow" checklistquestion="'+item.ChecklistQuestion_GUID+'" checkrequired="'+item.isManadatory+'"><td>'+ num +'</td><td>' + item.Question_Name + '</td>';
		        
		        if (item.InputType_1 == 'Radio'){
		            trBody += '<td><input type="radio" class="btn-radio formElement" elementType="radiogroup" name="Answer1-'+item.ChecklistQuestion_GUID+'" value="1"></td><td><input type="radio" class="btn-radio formElement" elementType="radiogroup" name="Answer1-'+item.ChecklistQuestion_GUID+'" value="0"></td>';
		        }
		        else if(item.InputType_1 == 'Textbox') {
		            trBody += '<td><input class="formElement" elementType="textbox" type="text" id="Input-'+item.ChecklistQuestion_GUID+'"></input></td>';
		        }
		        if(item.InputType_2 == 'Textbox'){
		            trBody += '<td><input class="formElement" elementType="textbox" type="text" id="Input2-'+item.ChecklistQuestion_GUID+'"></input></td>';
		        }
		        else if(item.InputType_2 == 'Radio'){
		            trBody += '<td><input type="radio" class="btn-radio formElement" elementType="radiogroup" name="Answer2-'+item.ChecklistQuestion_GUID+'" value="1"></td><td><input type="radio" class="btn-radio formElement" elementType="radiogroup" name="Answer2-'+item.ChecklistQuestion_GUID+'" value="0"></td>';
		        }
		        if(item.IsCommentReqd == true){
		            trBody += '<td><textarea class="formElement" elementType="textarea" id="Comments-'+item.ChecklistQuestion_GUID+'" rows="2" cols="50"></textarea></td>';
		        }
		        
		        trBody += '</tr>';
				$('#'+item.ChecklistGroup_GUID+' tbody').append(trBody);
			}
			
		});
		
		for(var i = 0; i < statusData.length; i++)
		{
			if((statusData[i].Plan_GUID == planGUID) && (statusData[i].ChecklistType_GUID == checklistType))
			{
				var jqxhrQuestions = $.getJSON(ruIP + ruPort + planningDB + planningEN + "read/trans/Plan_ChecklistDetail?where=\"Plan_GUID = '"+ planGUID +"' AND ChecklistType_GUID = '"+ checklistType +"' AND IsActive = '1'\"", function() {
					answerdata = $.parseJSON(jqxhrQuestions.responseText);
					$.each(answerdata, function (i, item) {
						if((item.Value_1 == 0) || (item.Value_1 == 1)){
							$('input[name="Answer1-' + item.ChecklistQuestion_GUID+ '"]').val([item.Value_1]);
					    }
						else{
							$('#Input-' + item.ChecklistQuestion_GUID).val(item.Value_1);
						}
						
					    if((item.Value_2 == 0) || (item.Value_2 == 1)){
							$('input[name="Answer2-' + item.ChecklistQuestion_GUID+ '"]').val([item.Value_2]);
						}
						else{
							$('#Input2-' + item.ChecklistQuestion_GUID).val(item.Value_2);
						}
						
					    if((item.Comment != null) || (item.Comment != undefined)){
							$('#Comments-' + item.ChecklistQuestion_GUID).val(item.Comment);
					    }
					});
					checkEdit = true;
				});
			}
		}		
	});
}

function checklist_export() {
	var newArray = [];

 		$.each(dataQ, function (i, item) {
			var newObj = {};
			
			newObj.PlanConfig_GUID 		  = planConfigGUID;
			newObj.Plan_GUID     		  = planGUID;
			newObj.ChecklistType_GUID 	  = checklistType;
			newObj.Question_Name          = item.Question_Name;
			newObj.ChecklistQuestion_GUID = item.ChecklistQuestion_GUID;
			
			if(answerdata.length > 0){
				for(var j=0; j < answerdata.length; j++){
					if(item.ChecklistQuestion_GUID == answerdata[j].ChecklistQuestion_GUID){
						newObj.Plan_ChecklistDetail_GUID = answerdata[j].Plan_ChecklistDetail_GUID;
					}
				}
			}
			
			if (item.InputType_1 == 'Radio'){
				newObj.Value_1 = $('input[name="Answer1-'+item.ChecklistQuestion_GUID+'"]:checked').val();
	        }
	        else if(item.InputType_1 == 'Textbox') {
				if($('#Input-'+item.ChecklistQuestion_GUID).val() == "") {
					newObj.Value_1 = null;
				}
				else {
					newObj.Value_1 = $('#Input-'+item.ChecklistQuestion_GUID).val();
				}
	        }
	        if(item.InputType_2 == 'Textbox'){
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
			else{
				newObj.Value_2 = null;
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

function checklist_populate() {
	LockForService();
	
	insertedQuestions = [];
	updatedQuestions = [];
	
	var newData = checklist_export();
	
	if(checklist_validate(newData)) {
		for(var key in newData) {
			if(checkEdit){
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
				qRowObj.CreatedBy               = UserData[0].PersonGUID;
				
				insertedQuestions.push(qRowObj);
			}
		}
		if(insertedQuestions.length > 0) {
			checklist_submit();
		}
		else if (updatedQuestions.length > 0){
			checklist_update();
		}
	}
}

function checklist_validate(data){
	for(var key in data) {
		if((data[key].Value_1 == undefined) && data[key].IsManadatory == true) {
			DisplayAlert(languagePack.message.error,"\""+data[key].Question_Name+"\"" + languagePack.message.requiredQuestion);
			ServiceComplete();
			return false;
		}
		if(data[key].Value_2 != null){
			if((data[key].Value_2 == undefined) && data[key].IsManadatory == true) {
				DisplayAlert(languagePack.message.error,"\""+data[key].Question_Name+"\"" + languagePack.message.requiredQuestion);
				ServiceComplete();
				return false;
			}
		}
	}
	return true;
}

function checklist_submit(){
	var jsonData = {
		 "fields": insertedQuestions
	};
	
	$.ajax ({
		headers: {
			"Content-Type": "application/json"
		},
		url: ruIP + ruPort + planningDB + planningEN + "create/bulk/trans/Plan_ChecklistDetail",
		type: "POST",
		data: JSON.stringify(jsonData),
		success: function(){
			DisplayAlert(languagePack.message.success, languagePack.message.recordsStored);
			
			ClosePopupWrapper();
			$(".modal-box, .modal-overlay").fadeOut(500, function() {
				$(".modal-overlay").remove();
		    });
			
			$("#checklist-head").html(" ");
			$("#checklist-body").html(" ");
			$('#calendar-view thead > tr').remove();
			$('#calendar-view tbody > tr').remove();
			answerdata = [];
			calendar_load();
		},
		error: function(){
			DisplayAlert(languagePack.message.error, languagePack.message.recordsNotStored);
		}
	});
}

function checklist_update(){
	var jsonData = {
		 "fields": updatedQuestions
	};
	
	$.ajax ({
		headers: {
			"Content-Type": "application/json"
		},
		url: ruIP + ruPort + planningDB + planningEN + "update/bulk/trans/Plan_ChecklistDetail",
		type: "POST",
		data: JSON.stringify(jsonData),
		success: function(){
			DisplayAlert(languagePack.message.success, languagePack.message.recordsUpdated);
			
			ClosePopupWrapper();
			$(".modal-box, .modal-overlay").fadeOut(500, function() {
				$(".modal-overlay").remove();
		    });
			
			$("#checklist-head").html(" ");
			$("#checklist-body").html(" ");
			$('#calendar-view thead > tr').remove();
			$('#calendar-view tbody > tr').remove();
			answerdata = [];
			calendar_load();
		},
		error: function(){
			DisplayAlert(languagePack.message.error, languagePack.message.recordsNotUpdated);
		}
	});
}

function CloseForm() {
	$("#checklist_close").click();
	currentChecklist.click();
}









