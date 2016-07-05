/*============================================================
	Property of:		MISOM TECHNOLOGIES
	Developer:			AARON MCCOLOUGH
	Application Name:	FARA
	Directory:			FARA/JS
	File Name:			display_alert.js
=============================================================*/

function CanDisplayAlert() {
	$("#okay_alert_btn").on("click", function() {
		HideAlert();
	});
	
	$("#alert_cancel_btn").on("click", function() {
		HideAlert();
	});
};

function DisplayAlert(title, message) {
	$('#alert_container #alert_header span').html(title);
	$('#alert_container #alert_message span').html(message);
	$('#alert_container').css("display", "block");
	$('#alert_container').animate({"opacity":1}, 200);
	$('#user_wrapper').css("display", "block");
	$('#user_wrapper').animate({opacity:1}, 200);
}

function HideAlert() {
	$('#alert_container').css("display", "none");
	$('#alert_container').css("opacity", 0);
	$('#alert_container #alert_message span').html("");	
	$('#user_wrapper').css("display", "none");
	$('#user_wrapper').css("opacity", 0);
}

function DisplayConfirm(title, message, respondYes, respondNo) {
	$('#confirm_container #confirm_header span').html(title);
	$('#confirm_container #confirm_message span').html(message);
	$('#confirm_container').css("display", "block");
	$('#confirm_container').animate({"opacity":1}, 200);
	$('#user_wrapper').css("display", "block");
	$('#user_wrapper').animate({opacity:1}, 200);	
	
	$("#confirm_cancel_btn").on("click", function() {
		HideConfirm();
		
		if (respondNo !== undefined) {
			respondNo();
		}
	});
	
	$("#yes_confirm_btn").on("click", function() {
		HideConfirm();
		respondYes();
	});
	
	$("#no_confirm_btn").on("click", function() {
		HideConfirm();
		
		if (respondNo !== undefined) {
			respondNo();
		}
	});
}

function HideConfirm(response) {
	$('#confirm_container').css("display", "none");
	$('#confirm_container').css("opacity", 0);
	$('#confirm_container #confirm_message span').html("");	
	$('#user_wrapper').css("display", "none");
	$('#user_wrapper').css("opacity", 0);
	
	$("#confirm_cancel_btn").unbind("click");
	$("#yes_confirm_btn").unbind("click");
	$("#no_confirm_btn").unbind("click");
}









