/*============================================================
	Property of:		MISOM TECHNOLOGIES
	Developer:			AARON MCCOLOUGH
	Application Name:	FARA_FRESNILLO
	Directory:			FARA_FRESNILLO/CONFIG/JS
	File Name:			load_dropdowns.js
=============================================================*/

var roleIdArray = [];
var roleArray = [];
var areaIdArray = [];
var areaArray = [];

LoadSelects();

$(document).ready(function() {
    $(".lang-common.configuration").html(languagePack.common.configuration);
    $(".lang-users.title").html(languagePack.users.title);
    $(".lang-common.saveChanges").html(languagePack.common.saveChanges);
    $(".lang-common.uploadChanges").html(languagePack.common.updateChanges);
});

function LoadSelects() {

    roleIdArray = [];
    roleArray = [];
    areaIdArray = [];
    areaArray = [];

	var jqxhrRoleArr = $.getJSON(ruIP + ruPort + listsDB + listEN + "read/cfg/Role?where=\"IsActive = '1' AND DisplayName != 'SuperAdmin' AND SiteGUID = '3F77803D-C303-4720-90DA-FDA2624BCDF6' ORDER BY DisplayName ASC\"", function() {

		roleArrData = $.parseJSON(jqxhrRoleArr.responseText);

		for (var key in roleArrData) {
			var roleObj = {};
			roleObj.id = roleArrData[key].RoleGUID;
			roleObj.title = roleArrData[key].DisplayName;
			roleIdArray.push(roleObj.id);
			roleArray.push(roleObj.title);
		}

		var jqxhrAreaArr = $.getJSON(ruIP + ruPort + planningDB + planningEN + "read/geo/Area?where=\"IsActive = '1' ORDER BY DisplayName ASC\"", function() {

			areaArrData = $.parseJSON(jqxhrAreaArr.responseText);

			for (var key in areaArrData) {
				var areaObj = {};
				areaObj.id = areaArrData[key].Area_GUID;
				areaObj.title = areaArrData[key].DisplayName;
				areaIdArray.push(areaObj.id);
				areaArray.push(areaObj.title);
			}

			LoadGrid(ruIP + ruPort + planningDB + planningEN + "read/dbo/v_Employees?where=\"IsActive = '1' ORDER BY FirstName ASC\"");
		});
	});
}