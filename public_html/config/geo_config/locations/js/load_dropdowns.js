/*============================================================
	Property of:		MISOM TECHNOLOGIES
	Developer:			AARON MCCOLOUGH FT. JORGE MURILLO
	Application Name:	FARA_FRESNILLO
	Directory:			FARA_FRESNILLO/CONFIG/GEO_CONFIG/LOCATION/JS
	File Name:			load_dropdowns.js
=============================================================*/

var inputLocationList = [];
var AreaNameList = [];
var AreaGUIDList = [];
var GeologyStatusGUIDList = [];
var GeologyStatusNameList = [];
var MinestatusGUIDList = [];
var MinestatusNameList = [];
var ObraCodeGUIDList = [];
var ObraCodeNameList = [];
var OrientacionGUIDList = [];
var OrientacionNameList = [];
var VetaClaveGUIDList = [];
var VetaClaveNameList = [];

LoadLists();

$(document).ready(function() {
	$(".lang-common.configuration").html(languagePack.common.configuration);
	$(".lang-locations.title").html(languagePack.locations.title);
	$(".lang-common.saveChanges").html(languagePack.common.saveChanges);
	$(".lang-common.uploadChanges").html(languagePack.common.updateChanges);
});

function LoadLists() {
	inputLocationList = [];
	
	var dataObject = {};
	
	LoadAreaDropDown();
}

function LoadAreaDropDown() {
	AreaGUIDList = [];
	AreaNameList = [];
	
	var jqxhrareas = $.getJSON(ruIP + ruPort + planningDB + planningEN + "read/geo/Area?where=\"IsActive = '1'\"", function() {
		
		var areasData = $.parseJSON(jqxhrareas.responseText);
		
		for(var key in areasData) {
			var dataObject = {};
			
			dataObject.id    = areasData[key].Area_GUID;
			dataObject.title = areasData[key].DisplayName;
			AreaNameList.push(dataObject.title);
			AreaGUIDList.push(dataObject.id);
		}
		LoadGeologyStatusDropDown();
	});
}

function LoadGeologyStatusDropDown(){
	GeologyStatusGUIDList = [];
	GeologyStatusNameList = [];
	
	var jqxhrgeologystatus = $.getJSON(ruIP + ruPort + planningDB + planningEN + "read/geo/v_GeologyStatus", function() {
		
		var geologystatusData = $.parseJSON(jqxhrgeologystatus.responseText);
		
		for(var key in geologystatusData) {
			var dataObject = {};
			
			dataObject.id    = geologystatusData[key].GeologyStatus_GUID;
			dataObject.title = geologystatusData[key].DisplayName;
			GeologyStatusNameList.push(dataObject.title);
			GeologyStatusGUIDList.push(dataObject.id);
		}
		LoadMinestatusDropDown();
	});
}

function LoadMinestatusDropDown(){
	MinestatusGUIDList = [];
	MinestatusNameList = [];
	
	var jqxhrminestatus = $.getJSON(ruIP + ruPort + planningDB + planningEN + "read/geo/v_Minestatus", function() {
		
		var minestatusData = $.parseJSON(jqxhrminestatus.responseText);
		
		for(var key in minestatusData) {
			var dataObject = {};
			
			dataObject.id    = minestatusData[key].Minestatus_GUID;
			dataObject.title = minestatusData[key].DisplayName;
			MinestatusNameList.push(dataObject.title);
			MinestatusGUIDList.push(dataObject.id);
		}
		LoadObraCodeDropDown();
	});
}

function LoadObraCodeDropDown(){
	ObraCodeGUIDList = [];
	ObraCodeNameList = [];
	
	var jqxhrobracode = $.getJSON(ruIP + ruPort + planningDB + planningEN + "read/geo/v_ObraCode", function() {
		
		var obraData = $.parseJSON(jqxhrobracode.responseText);
		
		for(var key in obraData) {
			var dataObject = {};
			
			dataObject.id    = obraData[key].Obracode_GUID;
			dataObject.title = obraData[key].DisplayName;
			ObraCodeNameList.push(dataObject.title);
			ObraCodeGUIDList.push(dataObject.id);
		}
		LoadOrientacionDropDown();
	});
}

function LoadOrientacionDropDown(){
	OrientacionGUIDList = [];
	OrientacionNameList = [];
	
	var jqxhrorientacion = $.getJSON(ruIP + ruPort + planningDB + planningEN + "read/geo/v_Orientacion", function() {
		
		var orientacionData = $.parseJSON(jqxhrorientacion.responseText);
		
		for(var key in orientacionData) {
			var dataObject = {};
			
			dataObject.id    = orientacionData[key].Orientacion_GUID;
			dataObject.title = orientacionData[key].DisplayName;
			OrientacionNameList.push(dataObject.title);
			OrientacionGUIDList.push(dataObject.id);
		}
		LoadVetaClaveDropDown();
	});
}

function LoadVetaClaveDropDown(){
	VetaClaveGUIDList = [];
	VetaClaveNameList = [];
	
	var jqxhrveta = $.getJSON(ruIP + ruPort + planningDB + planningEN + "read/geo/v_VetaClave", function() {
		
		var vetaData = $.parseJSON(jqxhrveta.responseText);
		
		for(var key in vetaData) {
			var dataObject = {};
			
			dataObject.id    = vetaData[key].VetaClave_GUID;
			dataObject.title = vetaData[key].DisplayName;
			VetaClaveNameList.push(dataObject.title);
			VetaClaveGUIDList.push(dataObject.id);
		}
	
		LoadLocationGrid(ruIP + ruPort + planningDB + planningEN + "read/dbo/v_AreaZoneLocation?where=\"IsActive = '1' ORDER BY Created ASC\"");
	});
}