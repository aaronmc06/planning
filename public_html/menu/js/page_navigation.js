/*============================================================
	Property of:		MISOM TECHNOLOGIES
	Developer:			AARON MCCOLOUGH
	Application Name:	FARA_FRESNILLO
	Directory:			FARA_FRESNILLO/MENU/JS
	File Name:			page_navigation.js
=============================================================*/

var includedFilesArray = [];

function NavigateToPage(pageName) {
	
	if(pageName != "na") {
		switch(pageName) {
			
			case "logout":
				LogOut();
			break;
			
			case "fara":				
				document.cookie = "planningCurrentPage=home; path=/";
				window.open(ruIP + ruPort + "fara_fresnillo/menu");
			break;
			
			default:
				if(pageName.indexOf('/') == -1) {
					$("#code_receiver").load('../' + pageName + '/' + pageName + '.html', function() {
						ReloadIncludedFiles();
					});
					document.cookie = 'planningCurrentPage='+pageName+'; path=/';
				}
				else {
					var pageNameArr = pageName.split('/');
					$("#code_receiver").load('../' + pageName + '/' + pageNameArr[(pageNameArr.length - 1)] + '.html', function() {
						ReloadIncludedFiles();
					});
					document.cookie = 'planningCurrentPage='+pageName+'; path=/';
				}
		}
	}	
}

function LogOut() {
	EraseCookies();

	window.location.replace("../../fara_fresnillo");
}

function ReloadIncludedFiles() {
	
	if(includedFilesArray.length > 0) {
		for(var key in includedFilesArray) {
			includedFilesArray[key].remove();
		}
	}
	
	includedFilesArray = [];
	
	$("#code_receiver link").each(function() {
		var element = $(this)[0];
		includedFilesArray.push(element);
	});
	
	$("#code_receiver script").each(function() {
		var element = $(this)[0];
		includedFilesArray.push(element);
	});
}


