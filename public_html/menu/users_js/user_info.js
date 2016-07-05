/*============================================================
	Property of:		MISOM TECHNOLOGIES
	Developer:			AARON MCCOLOUGH
	Application Name:	FARA_FRESNILLO
	Directory:			FARA_FRESNILLO/MENU/USERS_JS
	File Name:			user_info.js
=============================================================*/

var UserData = [];

//	Global object that allows quick access to the current users info.

//	Reads from cfg.Person and loads the logged in user's data into UserData.
function LoadUserInfo(person_guid) {
	var logged_in_user;
	
	$.getJSON(ruIP + ruPort + listsDB + listEN + "read/web/v_Person?where=\"PersonGUID = '"+ person_guid +"'\"", function( data ) {
		$.getJSON(ruIP + ruPort + planningDB + planningEN + "read/dbo/v_PersonArea?where=\"PersonGUID = '"+ person_guid +"'\"", function( data2 ) {
			UserData = data;
			UserData[0].AreaArr = data2;
			
			document.cookie = "PersonGUID=" + UserData[0].PersonGUID + "; path=/";
			
			(UserData.length != 1) ? SendToLogin("Invalid Credentials","There was an issue with the credentials that were entered.  Please contact your system administrator for more information.") : false;
		
			logged_in_user = languagePack.menu_index.welcome + " " + UserData[0].DisplayName + "!";
			$("#welcome_message").html(logged_in_user);
			GetMenuItems();
			LoadFilters();
			AllowUserAccess();
		});
	});
}