/*============================================================
	Property of:		MISOM TECHNOLOGIES
	Developer:			AARON MCCOLOUGH
	Application Name:	FARA_FRESNILLO
	Directory:			FARA_FRESNILLO/MENU/ITEM_LIST/JS
	File Name:			load_dropdowns.js
=============================================================*/

var RoleList     = [];
var RoleGUIDList = [];

LoadLists();

function LoadLists() {
	RoleList           = [];
	RoleGUIDList       = [];
	
	var jqxhrroles = $.getJSON(ruIP + ruPort + listsDB + listEN + "read/cfg/Role?where=\"IsActive = '1' ORDER BY DisplayName ASC\"", function() {
		var rolesData = jQuery.parseJSON(jqxhrroles.responseText);
		
		for(var key in rolesData) {
			var dataObj = {};
			dataObj.id = rolesData[key].RoleGUID;
			dataObj.title = rolesData[key].DisplayName;
			RoleGUIDList.push(dataObj.id);
			RoleList.push(dataObj.title);
		}
			
		LoadItemListGrid(ruIP + ruPort + listsDB + listEN + "read/dbo/v_MenuRoleConfig?where=\"IsActive = '1' ORDER BY RoleDisplayName, MenuGroupId ASC\"");
	});
}