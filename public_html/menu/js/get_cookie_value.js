/*============================================================
	Property of:		MISOM TECHNOLOGIES
	Developer:			AARON MCCOLOUGH
	Application Name:	FARA_FRESNILLO
	Directory:			FARA_FRESNILLO/MENU/JS
	File Name:			get_cookie_value.js
=============================================================*/

function GetCookieValue(key, type, create) {
	var cookieArr = document.cookie.split("; ");
	var tempValue = 0;
	
	for(var i = 1; i <= cookieArr.length; i++) {
		var tempKey = cookieArr[i-1].split("=")[0];
		if(tempKey == key) {
			if(type == "int") {
				tempValue = parseInt(cookieArr[i-1].split("=")[1]);
			}
			else {
				tempValue = cookieArr[i-1].split("=")[1];
			}
		}
	}
	return tempValue;
}

function EraseCookies() {
	var cookies = document.cookie.split(";");
	
	for(var key in cookies) {
		SetCookieExpiration(cookies[key].split("=")[0], "", -1);
	}
}

function SetCookieExpiration(name, value, days) {
	if (days) {
		var date = new Date();
		date.setTime(date.getTime()+(days*24*60*60*1000));
		var expires = "; expires="+date.toGMTString();
	}
	else var expires = "";
	document.cookie = name+"="+value+expires+"; path=/";	
}