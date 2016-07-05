/*============================================================
	Property of:		MISOM TECHNOLOGIES
	Developer:			AARON MCCOLOUGH
	Application Name:	FARA_FRESNILLO
	Directory:			FARA_FRESNILLO/CONFIG/JS
	File Name:			load_dropdowns.js
=============================================================*/

var siteIdArray = [];
var siteArray = [];
var roleIdArray = [];
var roleArray = [];

LoadSelects();

$(document).ready(function() {
	$(".lang-common.configuration").html(languagePack.common.configuration);
	$(".lang-users.title").html(languagePack.users.title);
	$(".lang-common.saveChanges").html(languagePack.common.saveChanges);
	$(".lang-common.uploadChanges").html(languagePack.common.updateChanges);
});

function LoadSelects() {
	
	siteIdArray = [];
	siteArray = [];
	roleIdArray = [];
	roleArray = [];
	
	var jqxhrSiteArr = $.getJSON(ruIP + ruPort + listsDB + listEN + "read/org/Sites?where=\"IsActive = '1' ORDER BY DisplayName ASC\"", function() {
			
		var siteArrData = jQuery.parseJSON(jqxhrSiteArr.responseText);
		
		for(var key in siteArrData) {
			var siteObj = {};
			siteObj.id = siteArrData[key].SiteGUID;
			siteObj.title = siteArrData[key].DisplayName;
			siteIdArray.push(siteObj.id);
			siteArray.push(siteObj.title);
		}		

		var jqxhrRoleArr = $.getJSON(ruIP + ruPort + listsDB + listEN + "read/cfg/Role?where=\"IsActive = '1' AND DisplayName != 'SuperAdmin' ORDER BY DisplayName ASC\"", function() {
				
			roleArrData = jQuery.parseJSON(jqxhrRoleArr.responseText);
			
			for(var key in roleArrData) {
				var roleObj = {};
				roleObj.id = roleArrData[key].RoleGUID;
				roleObj.title = roleArrData[key].DisplayName;
				roleIdArray.push(roleObj.id);
				roleArray.push(roleObj.title);
			}
			
			LoadGrid(ruIP + ruPort + listsDB + listEN + "read/web/v_Person?where=\"IsActive = '1' AND RoleDisplayName != 'SuperAdmin' ORDER BY DisplayName ASC\"");
		});
	});
}