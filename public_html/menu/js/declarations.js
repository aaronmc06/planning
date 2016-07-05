/*============================================================
	Property of:		MISOM TECHNOLOGIES
	Developer:			AARON MCCOLOUGH
	Application Name:	FARA_FRESNILLO
	Directory:			FARA_FRESNILLO/MENU/JS
	File Name:			declarations.js
=============================================================*/

var ruIP;
var ruPort;
var listsDB;
var listEN;
var planningDB;
var planningEN;

//	This get called as soon as the current page has finished loading.
$(document).ready(function () {
	ruIP		= GetCookieValue("ruIP",	"string");
	ruPort		= GetCookieValue("ruPort",	"string");
	listsDB		= GetCookieValue("listsDB",	"string");
	listEN		= GetCookieValue("listEN",	"string");
	planningDB	= GetCookieValue("planningDB",	"string");
	planningEN	= GetCookieValue("planningEN",	"string");

	document.cookie = "planning_initialFilters=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
	
	//	Loads the language pack that is selected and stores the value in a cookie.
	if(GetCookieValue("webLanguage", "string") == "spanish") {
		moment.locale('es');
		loadjscssfile("../required_files/scripts/language_pack_spanish.js", "js");
		$("#language_filter").val(2);
		language_GF = "Spanish";
	}
	else if(GetCookieValue("webLanguage", "string") == "english") {
		moment.locale('en');
		loadjscssfile("../required_files/scripts/language_pack_english.js", "js");	
		$("#language_filter").val(1);
		language_GF = "English";
	}
	else if(GetCookieValue("webLanguage", "string") == 0){
		moment.locale('en');
		loadjscssfile("../required_files/scripts/language_pack_english.js", "js");	
		$("#language_filter").val(1);
		language_GF = "English";
	}
	
	setTimeout(function() {
		CanDisplayAlert();
		CanToggleFilters();
		CanLoadFilters();
		
		SetMenuIndexLanguage();
	},1000);
});

function SetMenuIndexLanguage() {
	$(".lang-menu-index.title").html(languagePack.menu_index.title);
	$(".lang-menu-index.globalFilters").html(languagePack.menu_index.globalFilters);
	$(".lang-menu-index.area").html(languagePack.menu_index.area);
	$(".lang-menu-index.zone").html(languagePack.menu_index.zone);
	$(".lang-menu-index.applyFilters").html(languagePack.menu_index.applyFilters);
	$(".lang-menu-index.okay").html(languagePack.menu_index.okay);
	$(".lang-menu-index.yes").html(languagePack.menu_index.yes);
	$(".lang-menu-index.no").html(languagePack.menu_index.no);
	$(".lang-menu-index.displayName").html(languagePack.menu_index.displayName);
	$(".lang-menu-index.oldPass").html(languagePack.menu_index.oldPass);
	$(".lang-menu-index.newPass").html(languagePack.menu_index.newPass);
	$(".lang-menu-index.language").html(languagePack.menu_index.language);
	$(".lang-menu-index.english").html(languagePack.menu_index.english);
	$(".lang-menu-index.spanish").html(languagePack.menu_index.spanish);
	$(".lang-common.configuration").html(languagePack.common.configuration);
	$(".lang-common.selectOption").html(languagePack.common.selectOption);
	$(".lang-common.updateButton").html(languagePack.common.update);
	
	var person_guid = GetCookieValue("PersonGUID",	"string");
	
	(document.cookie == "" || person_guid == 0) ? LogOut() : LoadUserInfo(person_guid);
}










