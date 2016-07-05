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

var planningDB	= "misom_planning/";
var planningEN	= "prod/";

var listsDB		= "misom_planning/";
var listEN		= "prod/";

$(document).ready(function () {	
	SetIndexLanguage();
});

function SetIndexLanguage() {
	$(".lang-index.title").html(languagePack.index.title);
	$(".lang-index.okay").html(languagePack.index.okay);
	$(".lang-index.accept").html(languagePack.index.accept);
	$(".lang-index.contin").html(languagePack.index.contin);
	$(".lang-index.username").attr("placeholder", languagePack.index.username);
	$(".lang-index.password").attr("placeholder", languagePack.index.password);
	$(".lang-index.login").val(languagePack.index.login);
	$(".lang-index.version").val(languagePack.index.version);
	$("#agreement_form_container").load("./eula_spanish.html");
}