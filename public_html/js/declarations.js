/*============================================================
	Property of:		MISOM TECHNOLOGIES
	Developer:			AARON MCCOLOUGH
	Application Name:	FARA_FRESNILLO
	Directory:			FARA_FRESNILLO/JS
	File Name:			declarations.js
=============================================================*/

//var ruIP		= "https://dev.misom.com";
//var ruPort	= ":443/";

var ruIP		= "http://localhost";
var ruPort		= ":8080/";

var listsDB		= "misom_lists/";
var listEN		= "prod/";

var planningDB	= "misom_planning/";
var planningEN	= "prod/";

$(document).ready(function () {
	EraseCookies();
	
	
	$("#agreement_form_container").load("./eula_spanish.html");
	
	setTimeout(function() {
		SetIndexLanguage();
	},500);
	
	$("#username").val(getQueryVariable("username"));
	$("#password").val(getQueryVariable("password"));
	
	CanDisplayAlert();
});

function getQueryVariable(variable) {
	var query = window.location.search.substring(1);
	var vars = query.split("&");
	
	for (var i=0;i<vars.length;i++) {
		var pair = vars[i].split("=");
		
		if(pair[0] == variable){
			return pair[1];
		}
	}
	return("");
}

function SetIndexLanguage() {
	$(".lang-index.username").attr("placeholder", languagePack.index.username);
	$(".lang-index.password").attr("placeholder", languagePack.index.password);
	$(".lang-index.login").val(languagePack.index.login);
	$(".lang-index.version").val(languagePack.index.version);
	$(".lang-index.title").html(languagePack.index.title);
	$(".lang-index.okay").html(languagePack.index.okay);
	$(".lang-index.accept").html(languagePack.index.accept);
	$(".lang-index.contin").html(languagePack.index.contin);
}

function EraseCookies() {
	var cookies = document.cookie.split(";");
	
	for(var key in cookies) {
		SetCookieExpiration(cookies[key].split("=")[0], "", -1);
	}
}

function SetCookieExpiration(name, value, days) {
	if (days) {
		var date = new Date();
		date.setTime(date.getTime()+(days*24*60*60*1000));
		var expires = "; expires="+date.toGMTString();
	}
	else var expires = "";
	document.cookie = name+"="+value+expires+"; path=/";	
}