/*============================================================
	Property of:		MISOM TECHNOLOGIES
	Developer:			AARON MCCOLOUGH
	Application Name:	FARA_FRESNILLO
	Directory:			FARA_FRESNILLO/CONFIG/GEO_CONFIG/ZONES/JS
	File Name:			load_dropdwons.js
=============================================================*/

var areaList         = [];
var areaGuidList     = [];
var zoneList         = [];
var zoneGuidList     = [];
var locationList     = [];
var locationGuidList = [];

LoadLists();

$(document).ready(function() {
	$(".lang-common.configuration").html(languagePack.common.configuration);
	$(".lang-zones.title1").html(languagePack.zones.title1);
	$(".lang-zones.title2").html(languagePack.zones.title2);
	$(".lang-common.saveChanges").html(languagePack.common.saveChanges);
	$(".lang-common.uploadChanges").html(languagePack.common.updateChanges);
});

function LoadLists() {
	
	areaList         = [];
	areaGuidList     = [];
	zoneList         = [];
	zoneGuidList     = [];
	locationList     = [];
	locationGuidList = [];

	var jqxhrareas = $.getJSON(ruIP + ruPort + planningDB + planningEN + "read/geo/Area?where=\"IsActive = '1' ORDER BY DisplayName ASC\"", function() {
			
		var areaData = jQuery.parseJSON(jqxhrareas.responseText);	
		
		for(var key in areaData) {
			var dataObject = {};
			dataObject.id = areaData[key].Area_GUID;
			dataObject.title = areaData[key].DisplayName;
			areaList.push(dataObject.title);
			areaGuidList.push(dataObject.id);
		}
		
		var jqxhrzones = $.getJSON(ruIP + ruPort + planningDB + planningEN + "read/geo/Zone?where=\"IsActive = '1' ORDER BY DisplayName ASC\"", function() {
			
			var zonesData = jQuery.parseJSON(jqxhrzones.responseText);
			
			for(var key in zonesData) {
				var dataObject = {};
				dataObject.id = zonesData[key].Zone_GUID;
				dataObject.title = zonesData[key].DisplayName;
				zoneList.push(dataObject.title);
				zoneGuidList.push(dataObject.id);
			}
		
			var jqxhrlocations = $.getJSON(ruIP + ruPort + planningDB + planningEN + "read/geo/Location?where=\"IsActive = '1' AND Zone_GUID is null ORDER BY DisplayName ASC\"", function() {
				
				var locationsData = jQuery.parseJSON(jqxhrlocations.responseText);
				
				for(var key in locationsData) {
					var dataObject = {};
					dataObject.id      = locationsData[key].Location_GUID;
					dataObject.title   = locationsData[key].DisplayName;
					locationList.push(dataObject.title);
					locationGuidList.push(dataObject.id);
				}
				grid1ChangesMade = false;
				grid2ChangesMade = false;
				LoadZonesGrid(ruIP + ruPort + planningDB + planningEN + "read/web/v_ZoneConfig?where=\"IsActive = '1' ORDER BY Created ASC\"");				
			});			
		});
	});
}

function LoadLocations(area_guid) {
	locationList = [];
	locationGuidList = [];
	
	var jqxhrlocations = $.getJSON(ruIP + ruPort + planningDB + planningEN + "read/geo/Location?where=\"IsActive = '1' AND Area_GUID = '" + area_guid + "' AND Zone_GUID is null ORDER BY DisplayName ASC\"", function() {
				
		var locationsData = jQuery.parseJSON(jqxhrlocations.responseText);
		
		for(var key in locationsData) {
			var dataObject = {};
			dataObject.id      = locationsData[key].Location_GUID;
			dataObject.title   = locationsData[key].DisplayName;
			locationList.push(dataObject.title);
			locationGuidList.push(dataObject.id);
		}
		LoadLocationsGrid(ruIP + ruPort + planningDB + planningEN + "read/web/v_LocationConfig?where=\"Zone_GUID = '" + zoneGuid + "' AND Location_IsActive = '1' ORDER BY Modified Asc\"");
		
	});
}