/*============================================================
	Property of:		MISOM TECHNOLOGIES
	Developer:			AARON MCCOLOUGH
	Application Name:	FARA_FRESNILLO
	Directory:			FARA_FRESNILLO/JS
	File Name:			submit_login.js
=============================================================*/

var personData;
var agreementAccepted;
var personGUID;

var jqxhrPerson = $.getJSON(ruIP + ruPort + listsDB + listEN + "read/cfg/Person", function() {	  	
	personData = jQuery.parseJSON(jqxhrPerson.responseText);  		
});

function DocumentReady() {
	$(document).keypress(function(event){
		var keycode = (event.keyCode ? event.keyCode : event.which);
		if(keycode == '13'){
			$("#login_button").click();
		}	 
	});
	
	$("#login_button").on("click", function( event ) {
		event.preventDefault();
		
		if(ValidateLogin()) {
			if(agreementAccepted == 0){
				DisplayUserAgreement();
			}
			else {
				EnterWC();
			}
		}
		else {
			DisplayAlert(languagePack.message.error, languagePack.message.incorrectLogin);
		}
	});
	
	setTimeout(function() {
		$("#acceptAgreement_cb").on("change", function() {
			$("#agreement_btn").prop('disabled', function (_, val) { return ! val; });
		});
		
		$("#agreement_btn").on("click", function() {
			PushLicenseAcceptance();
		});
	
	}, 3000);
	
}

function ValidateLogin() {
	var userName = $("#username").val();
	var userPass = $("#password").val();
	var isValid = false;
	
	for(var key in personData) {
		if(userName == personData[key].AppUserName && userPass == personData[key].AppPassword && personData[key].WebUser) {
			isValid = true;
			agreementAccepted = personData[key].IsLicenseAccepted;
			personGUID = personData[key].PersonGUID;
		}
	}
	return isValid;
}

function DisplayUserAgreement() {
	$("#agreement_container").css("display", "block");
	$("#agreement_container").animate({"opacity":"1.0"}, 300);	
}

function PushLicenseAcceptance() {
	var personObj = {};
	personObj["IsLicenseAccepted"] = 1;
	
	var jsonData = {
		"key": { "PersonGUID":personGUID },
		"fields": personObj
	};
	
	jQuery.ajax ({
		headers: {
			"Content-Type": "application/json"
		},
		url: ruIP + ruPort + listsDB + listEN + 'update/cfg/Person',
		type: "POST",
		data: JSON.stringify(jsonData),
		success: function(){
			EnterWC();
		}
	});
}

function EnterWC() {
	document.cookie = "ruIP="		+ ruIP			+ "; path=/";
	document.cookie = "ruPort="		+ ruPort		+ "; path=/";
	document.cookie = "listEN="		+ listEN		+ "; path=/";
	document.cookie = "listsDB="	+ listsDB		+ "; path=/";
	document.cookie = "listEN=" + listEN	+ "; path=/";
	document.cookie = "listsDB=" + listsDB	+ "; path=/";
	document.cookie = "planningCurrentPage=home; path=/";			
	document.cookie = "webLanguage=spanish; path=/";
	window.location.replace("./menu");
}









