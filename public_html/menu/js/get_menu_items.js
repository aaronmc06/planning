/*============================================================
	Property of:		MISOM TECHNOLOGIES
	Developer:			AARON MCCOLOUGH
	Application Name:	FARA_FRESNILLO
	Directory:			FARA_FRESNILLO/MENU/JS
	File Name:			get_menu_items.js
=============================================================*/

function GetMenuItems() { //based on RoleId
	var menuHtmlString = '';
	var menuData;
	var menuItemArray = [];

	var jqxhrMenuItems = $.getJSON(ruIP + ruPort + listsDB + listEN + "read/web/MenuItems?where=\"RoleGUID = '"+ UserData[0].RoleGUID +"' AND IsActive = '1' AND Environment IN ('all','planning') ORDER BY Ordinal ASC \"", function() {
		menuData = jQuery.parseJSON(jqxhrMenuItems.responseText);
		menuItemArray = [];
		
		for(var key in menuData) {
			var menuDisplayText = "";
			
			if(language_GF == "English") {
				menuDisplayText =  menuData[key].DisplayName;
			}
			if(language_GF == "Spanish") {
				menuDisplayText =  menuData[key].SpanishName;
			}
			
			if(menuData[key].ParentMenuItemId == null) {
				menuItemArray.push(menuData[key]);
				menuHtmlString = menuHtmlString + '<li><a class="menuItemAnchor" href="#" onclick="NavigateToPage(\'' + menuData[key].MenuItemURL + '\')">' + menuDisplayText + '</a>';
				OrderMenuItems(menuData[key].MenuGroupId);
				menuHtmlString = menuHtmlString + '</li>';
			}
		}
		
		$("#menuItemList").append(menuHtmlString);
		$("body").append('<script type="text/javascript" src="../required_files/jqmenu/fg.menu.js"></script><script type="text/javascript" src="./js/initialize_menu.js"></script>');
		
	});

	function OrderMenuItems(tempId) {
		var newLevel = true;
		for(var key in menuData) {
			var menuDisplayText = "";
			
			if(language_GF == "English") {
				menuDisplayText =  menuData[key].DisplayName;
			}
			if(language_GF == "Spanish") {
				menuDisplayText =  menuData[key].SpanishName;
			}
			
			if(menuData[key].ParentMenuItemId == tempId) {
				if(newLevel) {
					menuHtmlString = menuHtmlString + '<ul>';
					newLevel = false;
				}
				menuItemArray.push(menuData[key]);
				menuHtmlString = menuHtmlString + '<li><a class="menuItemAnchor" href="#" onclick="NavigateToPage(\'' + menuData[key].MenuItemURL + '\')">' + menuDisplayText + '</a>';
				OrderMenuItems(menuData[key].MenuGroupId);
				menuHtmlString = menuHtmlString + '</li>';
			}
		}
		if(!newLevel) {
			menuHtmlString = menuHtmlString + '</ul>';
		}
	}
}