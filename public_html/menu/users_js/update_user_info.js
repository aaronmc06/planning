/*============================================================
	Property of:		MISOM TECHNOLOGIES
	Developer:			AARON MCCOLOUGH
	Application Name:	FARA_FRESNILLO
	Directory:			FARA_FRESNILLO/MENU/USERS_JS
	File Name:			update_user_info.js
=============================================================*/

function UpdateUserDetails() {
	var newDisplayName = $("#user_display_name_field").val();
	var newPassword = $("#user_new_password_field").val();

	var jsonData = {
		 "key": { "PersonGUID":UserData[0].PersonGUID },
		 "fields": { "AppPassword":newPassword, "DisplayName":newDisplayName, "Modified":moment(new Date()).format("YYYY-MM-DDTHH:mm:ss.000z") }
	};
	
	$.ajax ({
		headers: {
			"Content-Type": "application/json"
		},
		url: ruIP + ruPort + planningDB + planningEN + 'update/cfg/Person',
		type: "POST",
		data: JSON.stringify(jsonData),
		success: function(){
			$("#welcome_message").html(languagePack.menu_index.welcome + " " + newDisplayName + "!");
			UserData[0].AppPassword = newPassword;
			UserData[0].DisplayName = newDisplayName;
			CancelUser();
		}
	});
}

function UpdateUserDisplayName() {
	var newDisplayName = $("#user_display_name_field").val();

	var jsonData2 = {
		 "key": { "PersonGUID":UserData[0].PersonGUID },
		 "fields": { "DisplayName":newDisplayName, "Modified":moment(new Date()).format("YYYY-MM-DDTHH:mm:ss.000z") }
	};
	
	$.ajax ({
		headers: {
			"Content-Type": "application/json"
		},
		url: ruIP + ruPort + planningDB + planningEN + 'update/cfg/Person',
		type: "POST",
		data: JSON.stringify(jsonData2),
		success: function(){
			$("#welcome_message").html(languagePack.menu_index.welcome + " " + newDisplayName + "!");
			UserData[0].DisplayName = newDisplayName;
			CancelUser();
		}
	});
}