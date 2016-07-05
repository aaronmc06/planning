/*============================================================
	Property of:		MISOM TECHNOLOGIES
	Developer:			AARON MCCOLOUGH
	Application Name:	FARA_FRESNILLO
	Directory:			FARA_FRESNILLO/MENU/FILTERS_JS
	File Name:			load_filters.js
=============================================================*/

var tempAreaFilter;
var tempZoneFilter;

function CanLoadFilters() {
	$("#area_filter").on('change', function() {
		document.cookie = "planning_initialFilters=false; path=/";
		tempZoneFilter = GetCookieValue("zoneFilter","string");
		document.cookie = "zoneFilter=0; path=/";
		LoadZones();		
	});
}

function LoadFilters() {
	var personAreaFilter = "";
	
	if(UserData[0].AreaArr && UserData[0].RoleDisplayName != "Admin" && UserData[0].RoleDisplayName != "SuperAdmin") {
		personAreaFilter += " AND Area_GUID IN ('";
		for(var key in UserData[0].AreaArr) {
			personAreaFilter += UserData[0].AreaArr[key].Area_GUID;
			
			if(parseInt(key) == UserData[0].AreaArr.length - 1) {
				personAreaFilter += "')";
			}
			else {
				personAreaFilter += "','";
			}
		}		
	}
	
	var jqxhrAreas = $.getJSON(ruIP + ruPort + planningDB + planningEN + "read/geo/Area?where=\"IsActive = '1'"+personAreaFilter+"\"", function() {
		var areaData = jQuery.parseJSON(jqxhrAreas.responseText);
		var tempAreaName;
		var area_guid;
		var select = document.getElementById('area_filter');
		
		for(var key in areaData) {
			tempAreaName = areaData[key].DisplayName;
			area_guid = areaData[key].Area_GUID;
			select.options[select.options.length] = new Option(tempAreaName, area_guid);
		}
		if(GetCookieValue("areaFilter", "string")) {
			$("#area_filter").val(GetCookieValue("areaFilter", "string"));
			LoadZones();
		}
		else {
			$("#area_filter").get(0).selectedIndex = 0;
			$("#area_filter").change();
		}
		
		tempAreaFilter = $("#area_filter").val();
	});
}

function LoadZones() {
	$('#zone_filter').html("<option value='0'>"+languagePack.common.selectOption+"</option>");
	
	$.getJSON(ruIP + ruPort + planningDB + planningEN + "read/geo/Zone?where=\"Area_GUID = '"+ $("#area_filter").val() +"' AND IsActive = '1'\"", function( zoneData ) {
		var tempZoneName;
		var zone_guid;
		var select = document.getElementById('zone_filter');
		
		for(var key in zoneData) {
			tempZoneName = zoneData[key].DisplayName;
			zone_guid = zoneData[key].Zone_GUID;
			select.options[select.options.length] = new Option(tempZoneName, zone_guid);
		}
		
		if((!GetCookieValue("zoneFilter", "string")) || GetCookieValue("zoneFilter", "string") == "null" || GetCookieValue("zoneFilter", "string") == "0") {
			$("#zone_filter").get(0).selectedIndex = 1;
		}
		else {
			$("#zone_filter").val(GetCookieValue("zoneFilter", "string"));
		}
		
		if($("#zone_filter").val() != 0) {		
			area_GF = tempAreaFilter
			document.cookie = "areaFilter=" + tempAreaFilter + "; path=/";
			
			zone_GF = $("#zone_filter").val();
			document.cookie = "zoneFilter=" + zone_GF + "; path=/";
		}
		else {
			zone_GF = tempZoneFilter;
			document.cookie = "zoneFilter=" + tempZoneFilter + "; path=/";			
		}
		
		setTimeout(function() {
			getURLBeforeLoad("initial");
		},500);
	});
}