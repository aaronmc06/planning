/*============================================================
	Property of:		MISOM TECHNOLOGIES
	Developer:			AARON MCCOLOUGH
	Application Name:	FARA_FRESNILLO
	Directory:			FARA_FRESNILLO/MENU/JS
	File Name:			utilities.js
=============================================================*/

function loadjscssfile(filename, filetype) {
	if(filetype == "js") {
		var fileref = document.createElement('script');
		fileref.setAttribute("type","text/javascript");
		fileref.setAttribute("src", filename);
	}
	else if(filetype == "css") {
		var fileref = document.createElement("link")
		fileref.setAttribute("rel", "stylesheet")
		fileref.setAttribute("type", "text/css")
		fileref.setAttribute("href", filename)
	}
	if(typeof fileref != "undefined") {
		document.getElementById("file_include_container").appendChild(fileref);
	}
}

function objectToQueryString(object) {	
	var queryString = "";
	
	for(var value in object) {
		if(value == "params") {
			var ParamArray = object[value];
			
			for(var key in ParamArray) {
				queryString = queryString + "&params=" + ParamArray[key];
			}
		}
		if(value == "schema") {
			queryString = queryString + "&schema=" + object[value];
		}
		
		if(value == "procedure") {
			queryString = queryString + "&procedure=" + object[value];
		}
	}	
	return queryString;
}

function CreateGUID() {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x3|0x8)).toString(16);
    });
    return uuid.toUpperCase();
}

function OpenPopupWrapper() {
	$('#popup_wrapper').css("display", "block");
	$('#popup_wrapper').animate({opacity:1}, 200);
}

function ClosePopupWrapper() {
	$('#popup_wrapper').css("display", "none");
	$('#popup_wrapper').css("opacity", 0);
}

function OpenTopPopupWrapper() {
	$('#top_popup_wrapper').css("display", "block");
	$('#top_popup_wrapper').animate({opacity:1}, 200);
}

function CloseTopPopupWrapper() {
	$('#top_popup_wrapper').css("display", "none");
	$('#top_popup_wrapper').css("opacity", 0);
}









