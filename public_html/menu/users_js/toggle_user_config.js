/*============================================================
	Property of:		MISOM TECHNOLOGIES
	Developer:			AARON MCCOLOUGH
	Application Name:	FARA_FRESNILLO
	Directory:			FARA_FRESNILLO/MENU/USERS_JS
	File Name:			toggle_user_config.js
=============================================================*/

function CanToggleUserConfig(){
	
	$('#user_icon_container').on('click', function(event){
    	event.preventDefault();
		CancelFilters();
		CancelList();
		CancelSites();
		
		$('#user_container').toggleClass("hidden");
		
		if($('#user_container').hasClass("hidden")) {
			CancelUser();			
		}
		else {
			$('#user_display_name_field').val('');
			$('#user_old_password_field').val('');
			$('#user_new_password_field').val('');
			$('#user_wrapper').css("display", "block");
			$('#user_wrapper').animate({opacity:1}, 200);
			$('#user_container').css("display", "block");
			$('#user_container').animate({"height": 328}, 200);
			
			setTimeout(function(){
				$("#user_display_name_field").val(UserData[0].DisplayName)
			}, 300);			
			
			$(document).keyup(function(event){
				var keycode = (event.keyCode ? event.keyCode : event.which);
				if(keycode == '13') {
					$("#update_user_btn").click();
				}
			});
		}
	});
	
	$(document).click(function(event) {
		if(!$('#user_container').hasClass("hidden")) {
			if(!$(event.target).closest("#user_container").length && !$(event.target).closest("#user_icon_container").length) {
				CancelUser();
			}
		}
	});
	
	$('#user_cancel_btn').on('click', CancelUser);
	
	$('#update_user_btn').on('click', function(event){
		var langValue = $("#language_filter").val();
		
		if($("#user_display_name_field").val() == null || $("#user_display_name_field").val().trim() == "") {
			DisplayAlert(languagePack.common.error, languagePack.message.displayName);
		}
		else if(($("#user_old_password_field").val() == null || $("#user_old_password_field").val().trim() == "") && ($("#user_new_password_field").val() == null || $("#user_new_password_field").val().trim() == "")) {
			UpdateUserDisplayName();
		}
		else if($("#user_old_password_field").val() != UserData[0].AppPassword) {
			DisplayAlert(languagePack.common.error,languagePack.message.oldPass);
		}
		else if($("#user_new_password_field").val() == null || $("#user_new_password_field").val().trim().length < 6) {
			DisplayAlert(languagePack.common.error,languagePack.message.newPass);
		}
		else {
			UpdateUserDetails();
		}
		
		setTimeout(function(){
			UpdateLanguage(parseInt(langValue));
		},1000);
	});
}

function UpdateLanguage(langValue) {
	switch(langValue) {
		case 1:
			document.cookie = "webLanguage=english; path=/";
			break;
			
		case 2:
			document.cookie = "webLanguage=spanish; path=/";
			break;
	}
	location.reload();
}
	
function CancelUser() {
	$('#user_container').addClass("hidden");
	$('#user_container').css("display", "none");
	$('#user_container').css("height", "0px");
	$('#user_wrapper').animate({opacity:0}, 200);
	$('#user_display_name_field').val('');
	$('#user_old_password_field').val('');
	$('#user_new_password_field').val('');
	setTimeout(function(){
		$('#user_wrapper').css("display", "none");
	}, 200);
	$(document).unbind("keyup");
}









