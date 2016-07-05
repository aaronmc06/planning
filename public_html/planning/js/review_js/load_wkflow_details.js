/*============================================================
	Property of:		MISOM TECHNOLOGIES
	Developer:			AARON MCCOLOUGH
	Application Name:	FARA_FRESNILLO
	Directory:			FARA_FRESNILLO/PLANNING/JS/REVIEW_JS
	File Name:			load_wkflow_details.js
=============================================================*/

var addFilterToQuery = "";
var WkFlowDetailData;

$(document).ready(function() {
	setTimeout(function() {
		if(alertBadges > 0) {
			$("#review_menu").click();
		}
	}, 500);
});

function CalculateWkFlowFilters() {
	addFilterToQuery = ""
	
	if(!$("#review_window #pending_filter_btn").hasClass("ison")) {
		addFilterToQuery += " AND StatusDisplayName != 'Pending'";
	}
	if(!$("#review_window #rejected_filter_btn").hasClass("ison")) {
		addFilterToQuery += " AND StatusDisplayName != 'Rejected'";
	}
	if(!$("#review_window #approved_filter_btn").hasClass("ison")) {
		addFilterToQuery += " AND StatusDisplayName != 'Approved'";
	}
	if(UserData[0].RoleDisplayName == "Superintendent") {
		addFilterToQuery += " AND AssignedTo = '"+UserData[0].PersonGUID+"'";
	}
	if(UserData[0].RoleDisplayName == "Planner") {
		addFilterToQuery += " AND CreatedBy = '"+UserData[0].PersonGUID+"'";
	}
	
	GetWkFlowDetail("StartDate","DESC");
}

function GetWkFlowDetail(col, dir) {
	var jqxhrwkflowdetail = $.getJSON(ruIP + ruPort + planningDB + planningEN + "read/dbo/v_WkFlow_Detail?where=\"IsCurrentStatus = '1' AND IsActive = '1'" + addFilterToQuery + " ORDER BY "+col+" "+dir+"\"", function() {				
		WkFlowDetailData = jQuery.parseJSON(jqxhrwkflowdetail.responseText);
		
		PopulateWkFlowDetail(col, dir);		
	});
}

function PopulateWkFlowDetail(col, dir) {
	var symbolcarrot = "";
	
	if(dir == "ASC") {
		symbolcarrot = " &blacktriangle;";
	}
	else if(dir == "DESC") {
		symbolcarrot = " &blacktriangledown;";
	}

	var wkflowContainer = $("#wk_flow_detail_container");
	var wkFlowDetailHtml =	'<table id="wk_flow_table">'+
								'<tr>'+
									'<th><div style="cursor:pointer" direction="'+((col=="StatusDisplayName")	? dir : false)+'" column="StatusDisplayName"	onclick="SortByColumn(this)">'+languagePack.common.status		+((col=="StatusDisplayName")	? symbolcarrot : "")+'</div></th>'+
									'<th><div style="cursor:pointer" direction="'+((col=="AreaDisplayName")		? dir : false)+'" column="AreaDisplayName"		onclick="SortByColumn(this)">'+languagePack.menu_index.area		+((col=="AreaDisplayName")		? symbolcarrot : "")+'</div></th>'+
									'<th><div style="cursor:pointer" direction="'+((col=="ZoneDisplayName")		? dir : false)+'" column="ZoneDisplayName"		onclick="SortByColumn(this)">'+languagePack.menu_index.zone		+((col=="ZoneDisplayName")		? symbolcarrot : "")+'</div></th>'+
									'<th><div style="cursor:pointer" direction="'+((col=="StartDate")			? dir : false)+'" column="StartDate"			onclick="SortByColumn(this)">'+languagePack.review.weekOf		+((col=="StartDate")			? symbolcarrot : "")+'</div></th>'+
									'<th><div style="cursor:pointer" direction="'+((col=="Status_BeginTime")	? dir : false)+'" column="Status_BeginTime"		onclick="SortByColumn(this)">'+languagePack.review.deliveryHour	+((col=="Status_BeginTime")		? symbolcarrot : "")+'</div></th>'+
									'<th></th></tr>';
	
	if(WkFlowDetailData.length <= 0) {
		wkFlowDetailHtml += '<tr><td colspan="6">'+ languagePack.review.noPlansReview +'.</td></tr>';
	}
	
	for(var key in WkFlowDetailData) {
		var isHidden = "";
		var commentValue = "";
		
		if(WkFlowDetailData[key].StatusDisplayName != "Pending" || (UserData[0].RoleDisplayName != "Admin" && UserData[0].RoleDisplayName != "SuperAdmin" && UserData[0].RoleDisplayName != "Superintendent")) {
			isHidden = "isHidden";
		}
		
		if(WkFlowDetailData[key].Comments != null) {
			commentValue = WkFlowDetailData[key].Comments
		}
		
		wkFlowDetailHtml += '<tr class="eachWkFlowContainer rowa_'+(parseInt(key)%2).toString()+'" PlanWkFlowGroupGUID="'+WkFlowDetailData[key].Plan_WkFlow_Group_GUID+'" PlanWkFlowDetailGUID="'+WkFlowDetailData[key].Plan_WkFlow_Detail_GUID+'" CreatedBy="'+WkFlowDetailData[key].CreatedBy+'">';
		wkFlowDetailHtml += '<td class="detailCell"><div class="tooltip statusCircle '+ WkFlowDetailData[key].StatusDisplayName.toLowerCase() +'Circle" title="'+WkFlowDetailData[key].StatusDisplayName+'"></div></td><td class="detailCell">'+ WkFlowDetailData[key].AreaDisplayName +'</td><td class="detailCell">'+ WkFlowDetailData[key].ZoneDisplayName +'</td><td class="detailCell">'+ moment(WkFlowDetailData[key].StartDate).add(7, 'hours').format("Do MMM YYYY") +'</td><td class="detailCell">'+ moment(WkFlowDetailData[key].Status_BeginTime.split("Z")[0]).format("YYYY-DD-MM HH:MM") +'</td><td><div class="tri_up triangle"></div></td>';
		wkFlowDetailHtml += '</tr><tr class="isHidden wkFlowDetailsRow rowb_'+(parseInt(key)%2).toString()+'" style="display:none"><td colspan="6"><div><textarea placeholder="'+languagePack.common.comments+':">'+commentValue+'</textarea><div class="detailBtnsContainer"><div class="goToGanttBtn">'+languagePack.common.planning+'</div><div class="rejectPendingBtn '+isHidden+'">'+languagePack.common.rejected+'</div><div class="approvePendingBtn '+isHidden+'">'+languagePack.common.approved+'</div></div></div></td></tr>';
	}
	
	
	wkflowContainer.html("");
	wkflowContainer.append(wkFlowDetailHtml);
	
	$(".eachWkFlowContainer .triangle").on("click", function() {
		
		$(this).toggleClass("tri_up");
		$(this).toggleClass("tri_down");
		
		if($(this).closest(".eachWkFlowContainer").next().hasClass("isHidden")) {
			$(this).closest(".eachWkFlowContainer").next().css("display","table-row");
			$(this).closest(".eachWkFlowContainer").next().removeClass("isHidden");
		}
		else {
			$(this).closest(".eachWkFlowContainer").next().css("display","none");
			$(this).closest(".eachWkFlowContainer").next().addClass("isHidden");
		}
	});
	
	$(".detailCell").on("click", function() {
		var triangle = $(this).parent().find(".triangle");
		
		triangle.click();
	});
	
	$(".goToGanttBtn").on("click", function() {
		var plan_wkflow_group_guid = $(this).closest("tr").prev().attr("PlanWkFlowGroupGUID");
		var area_guid;
		var zone_guid;
		var week_date;
		var week_count;
		
		for(var key in WkFlowDetailData) {
			if(plan_wkflow_group_guid == WkFlowDetailData[key].Plan_WkFlow_Group_GUID) {
				area_guid = WkFlowDetailData[key].Area_GUID;
				zone_guid = WkFlowDetailData[key].Zone_GUID;
				week_date = WkFlowDetailData[key].StartDate.split("Z")[0];
			}
		}
		
		$("#plan_week_selector").val(week_date);
		week_count = document.getElementById("plan_week_selector").selectedIndex;
		document.cookie = "areaFilter=" + area_guid + "; path=/";
		document.cookie = "zoneFilter=" + zone_guid + "; path=/";
		document.cookie = "weekFilter=" + week_count + "; path=/";
		
		location.reload();
	});
	
	$(".rejectPendingBtn").on("click", function() {
		var element = $(this);
		DisplayConfirm(languagePack.message.confirm, languagePack.message.rejectPlan,
			function() {
				CreateWkFlowRecord(element, "Rejected");
			}
		);
	});
	
	$(".approvePendingBtn").on("click", function() {
		var element = $(this);
		DisplayConfirm(languagePack.message.confirm, languagePack.message.approvePlan,
			function() {
				CreateWkFlowRecord(element, "Approved");
			}
		);
	});
}

function SortByColumn(element) {
	var col				= $(element).attr("column");
	var currDirection	= $(element).attr("direction");
	var dir				= "";
	
	(currDirection == "ASC") ? dir = "DESC" : dir = "ASC";
	console.log(col);
	console.log(dir);
	GetWkFlowDetail(col,dir);
}









