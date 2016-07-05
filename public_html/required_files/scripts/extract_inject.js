/*============================================================
	Property of:		MISOM TECHNOLOGIES
	Developer:			ZAC CARTER & AARON MCCOLOUGH
	Directory:			REQUIRED FILES
	File Name:			extract_inject.js
=============================================================*/

//*------------------------------------------     CONFIGURATION SETTINGS     -------------------------------------------------*/
//*===========================================================================================================================*/
//Server Configurations
var appURL               = "";
var FormGUID             = "";
var SiteGUID             = "";
var DocumentName         = "";
var DisplayName          = "";
var UserNameTS           = "";
var SubjectName          = "";
var ManagerName          = "";
var URL_Alias            = "";
var currentField         = "";
var imageAttachments     = [];
var imageAttachmentCount = 0;
var signatureShowing     = 0;
var currentSignatureData = {};
var callEnvironment      = "desktop";
var formZoom             = 1.0;

var operatorUserList     = [];
var managerUserList      = [];
var modelList            = [];
var euipmentList         = [];


//App / Site META Data
var managerMetadata      = {};
var mainOperator         = "";
var modelMetaData        = "";
var equipmentMetaData    = "";

//URL DATA
var rootURL = "";

if(typeof ruIP === "undefined" || typeof ruPort === "undefined" || typeof listsDB === "undefined" || typeof listEN === "undefined") {
	rootURL = GetCookieValue("ruIP", "string") + GetCookieValue("ruPort", "string") + GetCookieValue("listsDB", "string") + GetCookieValue("listEN", "string");
}
else {
	rootURL = ruIP + ruPort + listsDB + listEN;
}

//User Data
var userFirstName = "";
var userLastName = "";
var userSiteGUID = "";
var userPersonGUID = "";

if(typeof UserData === "undefined") {
	userFirstName = GetCookieValue("userFirstName", "string");
	userLastName = GetCookieValue("userLastName", "string");
	userSiteGUID = GetCookieValue("userSiteGUID", "string");
	userPersonGUID = GetCookieValue("userPersonGUID", "string");
}
else {
	userFirstName = UserData[0].Firstname;
	userLastName = UserData[0].LastName;
	userSiteGUID = UserData[0].SiteGUID;
	userPersonGUID = UserData[0].PersonGUID;
}


//This is to grab any data we need. 
function extractData() {

	$.fn.hasAttr = function(attributeName) 
	{ 
		var attribVal = this.attr(attributeName); 
		return (attribVal !== undefined) && (attribVal !== false); 
	};
	
	//This is going to extract all of our data (also known as the Extractor)
	var extractedValues = [];
	$("[elementType]").each(function() {
	
		//Textareas
		if($(this).attr("elementType") == "textarea") {
			var extractObject            = {};
			extractObject.type           = $(this).attr("elementType");
			extractObject.databaseColumn = $(this).attr("databaseColumn");
			extractObject.value          = $(this).val();
			extractObject.loadLast       = ($(this).hasAttr("loadLast")) ? $(this).attr("loadLast") : "false";
			
			extractedValues.push(extractObject);
		}
		//Textboxes
		if($(this).attr("elementType") == "textbox") {
			var extractObject            = {};
		    extractObject.type           = $(this).attr("elementType");
			extractObject.databaseColumn = $(this).attr("databaseColumn");
			extractObject.value          = $(this).val();
			extractObject.instanceFn     = ($(this).hasAttr("executeInstanceFunction")) ? $(this).attr("executeInstanceFunction") : "";
			extractObject.standardFn     = ($(this).hasAttr("executeStandardFunction")) ? $(this).attr("executeStandardFunction") : "";
			extractObject.loadLast       = ($(this).hasAttr("loadLast")) ? $(this).attr("loadLast") : "false";
			
			extractedValues.push(extractObject);
		}
		//Checkboxes
		if($(this).attr("elementType") == "checkbox") {
			var extractObject            = {};
		    extractObject.type           = $(this).attr("elementType");
			extractObject.databaseColumn = $(this).attr("databaseColumn");
			extractObject.value          = $(this).is(":checked");
		    extractObject.instanceFn     = ($(this).hasAttr("executeInstanceFunction")) ? $(this).attr("executeInstanceFunction") : "";
			extractObject.standardFn     = ($(this).hasAttr("executeStandardFunction")) ? $(this).attr("executeStandardFunction") : "";
			extractObject.loadLast       = ($(this).hasAttr("loadLast")) ? $(this).attr("loadLast") : "false";
			
			extractedValues.push(extractObject);
		}
		//Date -- i.e. 12/20/1995 - Standard Date, no Time
		if($(this).attr("elementType") == "date") {
			var extractObject            = {};
		    extractObject._class         = $(this).attr("class");
		    extractObject.type           = $(this).attr("elementType");
			extractObject.databaseColumn = $(this).attr("databaseColumn");
			extractObject.value          = $(this).val();
			extractObject.standardFn     = ($(this).hasAttr("executeStandardFunction")) ? $(this).attr("executeStandardFunction") : "";
			extractObject.loadLast       = ($(this).hasAttr("loadLast")) ? $(this).attr("loadLast") : "false";
			
			extractedValues.push(extractObject);
		}
		//Radio Button Group
		if($(this).attr("elementType") == "radiogroup") {
			var extractObject            = {};
			extractObject.type           = $(this).attr("elementType");
			extractObject.databaseColumn = $(this).attr("databaseColumn");
			extractObject.value          = $(this).val();
			extractObject.group          = $(this).attr("name");
			extractObject.uniqueRadioId  = $(this).attr("uniqueRadioId");
			extractObject.selected       = $(this).is(":checked"); 
			extractObject.instanceFn     = ($(this).hasAttr("executeInstanceFunction")) ? $(this).attr("executeInstanceFunction") : "";
			extractObject.standardFn     = ($(this).hasAttr("executeStandardFunction")) ? $(this).attr("executeStandardFunction") : "";
			extractObject.loadLast       = ($(this).hasAttr("loadLast")) ? $(this).attr("loadLast") : "false";
			
			extractedValues.push(extractObject);
		}
		//Select Fields
		if($(this).attr("elementType") == "select") {
			var extractObject            = {};
			
			extractObject.type           = $(this).attr("elementType");
			extractObject.databaseColumn = $(this).attr("databaseColumn");
			extractObject.value          = $(this).val();
			extractObject.standardFn     = ($(this).hasAttr("executeStandardFunction")) ? $(this).attr("executeStandardFunction") : "";
			extractObject.loadLast       = ($(this).hasAttr("loadLast")) ? $(this).attr("loadLast") : "false";
			
			extractedValues.push(extractObject);
		}
		//MultiSelect Fields
		if($(this).attr("elementType") == "multiSelectOption") {
			//alert('About to look for multi-select');
			if($(this).attr("isselected") == "true") {
				var extractObject              = {};
				extractObject.type             = $(this).attr("elementType");
				extractObject.databaseColumn   = $(this).attr("databaseColumn");
				extractObject.multiSelectGroup = $(this).attr("multiSelectGroup");
				extractObject.value            = $(this).val();
				extractObject.loadLast         = ($(this).hasAttr("loadLast")) ? $(this).attr("loadLast") : "false";
				
				extractedValues.push(extractObject);
			}			
		}
		//Span Fields
		if($(this).attr("elementType") == "span") {
			var extractObject            = {};
			
			extractObject.type           = $(this).attr("elementType");
			extractObject.databaseColumn = $(this).attr("databaseColumn");
			extractObject.value          = $(this).html();
			extractObject.standardFn     = ($(this).hasAttr("executeStandardFunction")) ? $(this).attr("executeStandardFunction") : "";
			extractObject.loadLast       = ($(this).hasAttr("loadLast")) ? $(this).attr("loadLast") : "false";
			
			extractedValues.push(extractObject);
		}
		//Labels		
		if($(this).attr("elementType") == "label") {
			var extractObject            = {};
			
			extractObject.type           = $(this).attr("elementType");
			extractObject.databaseColumn = $(this).attr("databaseColumn");
			extractObject.value          = $(this).html();
			extractObject.standardFn     = ($(this).hasAttr("executeStandardFunction")) ? $(this).attr("executeStandardFunction") : "";
			extractObject.loadLast       = ($(this).hasAttr("loadLast")) ? $(this).attr("loadLast") : "false";
			
			extractedValues.push(extractObject);
		}
	});
	
	if(imageAttachmentCount > 0) {
		var imagesObject    = {};
		imagesObject.type   = "images";
		imagesObject.images = imageAttachments;
		extractedValues.push(imagesObject);
	}
	
	if(signatureShowing == 1) {
		var signatureObject           = {};
		signatureObject.type          = "signature";
		signatureObject.signatureData = currentSignatureData;
		extractedValues.push(signatureObject);
	}	


	//We need to extract the subject and the manager
	//Ideally, this will only loop once, as we should only have one in each form, however if there are more, the last in putted will take precedence.
	$("[isSubject]").each(function() {
		SubjectName = $(this).val();
	});
	
	$("[isManager]").each(function() {
		ManagerName = $(this).val();
	});
	
	return JSON.stringify(extractedValues, null, 2);
}

function injectData(dataArr, sequence) {
	$.fn.hasAttr = function(attributeName) 
	{ 
		var attribVal = this.attr(attributeName); 
		return (attribVal !== undefined) && (attribVal !== false); 
	};
	
	dataArr = decodeURIComponent(dataArr);
	dataArr = atob(dataArr);
	dataArr = JSON.parse(dataArr);
	
	var secondDataArr = new Array();
	
	if(sequence != "final") {
		clearAutoDate();
	}
	
	for(var i = 0; i<dataArr.length; i++)
	{
		//Attachments
		if(dataArr[i].type == "images")
		{
			var formImages = dataArr[i].images;
			
			for(var key in formImages)
			{
				var constructObject        = {};
				
				var currentObject          = formImages[key];
				constructObject.User       = currentObject.User;
				constructObject.Lat        = currentObject.Lat;
				constructObject.Lon        = currentObject.Lon;
				constructObject.Field      = currentObject.Field;
				constructObject.Comment    = currentObject.Comment;
				constructObject.GUID       = currentObject.GUID;
				
				var ImageData              = currentObject.Image;
				
				attachPicture(encodeURIComponent(btoa(JSON.stringify(constructObject))), ImageData);
				
			}
			
		}
		//Signature
		if(dataArr[i].type == "signature")
		{
			for(var key in dataArr[i].signatureData)
			{
				var currentSignature = dataArr[i].signatureData[key];
				attachSignature(key, currentSignature);
			}
		}
		
		//Textareas
		if(dataArr[i].type == "textarea")
		{
			//Get the instance of the object so we can set a value.
			var grabber = "[databaseColumn=" + dataArr[i].databaseColumn + "]";
			var value   = dataArr[i].value;
			$(grabber).val(value);
			
			if(dataArr[i].loadLast == "true") { secondDataArr.push(dataArr[i]); } 
		}
		//Textboxes
		else if(dataArr[i].type == "textbox")
		{
			//Get the instance of the object so we can set a value.
			var grabber = "[databaseColumn=" + dataArr[i].databaseColumn + "]";
			var value   = dataArr[i].value;
			$(grabber).val(value);
			
			//We need to check for custom functions.
			if(dataArr[i].standardFn != "" && dataArr[i].standardFn != undefined && sequence != "final")
			{
				var standardFnString = dataArr[i].standardFn;
				window[standardFnString]();
			}
			if(dataArr[i].instanceFn != "" && dataArr[i].instanceFn != undefined && sequence != "final")
			{
				var instanceFnString = dataArr[i].instanceFn;
				window[instanceFnString]($(grabber));
			}
			
			if(dataArr[i].loadLast == "true") { secondDataArr.push(dataArr[i]); } 
		}
		//Checkboxes
		else if(dataArr[i].type == "checkbox")
		{
			//Get the instance of the object so we can set a value.
			var grabber = "[databaseColumn=" + dataArr[i].databaseColumn + "]";
			var value   = dataArr[i].value;
			$(grabber).prop('checked', value);

			//We need to check for custom functions.
		    if(dataArr[i].standardFn != "" && value && sequence != "final")
			{
				var standardFnString = dataArr[i].standardFn;
				window[standardFnString]();
			}
			if(dataArr[i].instanceFn != "" && value && sequence != "final")
			{
				var instanceFnString = dataArr[i].instanceFn;
				window[instanceFnString]($(grabber));
			}
			
			if(dataArr[i].loadLast == "true") { secondDataArr.push(dataArr[i]); }
		}
		//Date -- i.e. 12/20/1995 - Standard Date, no Time
		else if(dataArr[i].type == "date")
		{
			//We need to check for custom functions.
		    if(dataArr[i].standardFn != "" && value && sequence != "final")
			{
				var standardFnString = dataArr[i].standardFn;
				window[standardFnString]();
			}
			if(dataArr[i].instanceFn != "" && value && sequence != "final" && dataArr[i].instanceFn !== undefined)
			{
				var instanceFnString = dataArr[i].instanceFn;
				window[instanceFnString]($(grabber));
			}
			
			//Get the instance of the object so we can set a value.
			var grabber = "[databaseColumn=" + dataArr[i].databaseColumn + "]";
			var value   = dataArr[i].value;
			$(grabber).val(value);
			
			if(dataArr[i].loadLast == "true") { secondDataArr.push(dataArr[i]); }
		}
		//Group of radio buttons
		else if(dataArr[i].type == "radiogroup")
		{
			var grabber  = "[uniqueRadioId=" + dataArr[i].uniqueRadioId + "]";
			var selected = dataArr[i].selected;
			$(grabber).prop('checked', selected);
			
			//We need to check for custom functions.
			if(dataArr[i].standardFn != "" && selected && sequence != "final")
			{
				var standardFnString = dataArr[i].standardFn;
				window[standardFnString]();
			}
			if(dataArr[i].instanceFn != "" && selected && sequence != "final")
			{
				var instanceFnString = dataArr[i].instanceFn;
				window[instanceFnString]($(grabber));
			}
			
			if(dataArr[i].loadLast == "true") { secondDataArr.push(dataArr[i]); }
		}
		//Selects
		else if(dataArr[i].type == "select")
		{
			//Get the instance of the object so we can set a value.
			var grabber = "[databaseColumn=" + dataArr[i].databaseColumn + "]";
			var value   = dataArr[i].value;
			
			//We need to check for custom functions.
		    if(dataArr[i].standardFn != "" && value && sequence != "final")
			{
				var standardFnString = dataArr[i].standardFn;
				window[standardFnString]();
			}
			
			if(sequence == "final" && dataArr[i].loadLast) {
				$(grabber).val(value);
			}
			else {
				$(grabber).val(value);
			}
			
			if(dataArr[i].loadLast == "true") { secondDataArr.push(dataArr[i]); }
		}
		//Multi Selects
		else if(dataArr[i].type == "multiSelectOption")
		{
			var grabber = "[id=" + dataArr[i].multiSelectGroup + "]";
			var values = [];
			var keyArray = $(grabber).val();
			
			if($(grabber).val() != null) {
				for(var key in keyArray) {
					values.push(keyArray[key])
				}
				values.push($(grabber).val());
			}
			
			values.push(dataArr[i].value);
			$(grabber).val(values).trigger('chosen:updated');
			
			if(dataArr[i].loadLast == "true") { secondDataArr.push(dataArr[i]); }
		}
		//Span
		else if(dataArr[i].type == "span")
		{
			//Get the instance of the object so we can set a value.
			var grabber = "[databaseColumn=" + dataArr[i].databaseColumn + "]";
			var value   = dataArr[i].value;
			
			//We need to check for custom functions.
		    if(dataArr[i].standardFn != "" && value && sequence != "final")
			{
				var standardFnString = dataArr[i].standardFn;
				window[standardFnString]();
			}
			
			$(grabber).html(value);
			
			if(dataArr[i].loadLast == "true") { secondDataArr.push(dataArr[i]); }
		}
		else if(dataArr[i].type == "label") {
			//Get the instance of the object so we can set a value.
			var grabber = "[databaseColumn=" + dataArr[i].databaseColumn + "]";
			var value   = dataArr[i].value;
			
			//We need to check for custom functions.
		    if(dataArr[i].standardFn != "" && value && sequence != "final")
			{
				var standardFnString = dataArr[i].standardFn;
				window[standardFnString]();
			}
			
			$(grabber).val(value);
			
			if(dataArr[i].loadLast == "true") { secondDataArr.push(dataArr[i]); }			
		}
	}
	
	secondDataArr = JSON.stringify(secondDataArr, null, 2);
	
	setTimeout(function() {
		if(sequence != "final") {
			injectData(btoa(secondDataArr), "final");
		}
		else {
			if(callEnvironment == 'desktop') {
				if(typeof HideFormLoading !== "undefined") {
					HideFormLoading();
				}
			}
		}
	}, 500);
}

var globalEval = function globalEval(src, element) {
	if (window.execScript) {
		window.execScript(src);
		return;
	}
	var fn = function(element) {
		window.eval.call(window,src);
	};
	fn(element);
};

function receiveMetaData(metaDataObject) {
	 metaDataObject = decodeURIComponent(metaDataObject);
	 metaDataObject = atob(metaDataObject);
	 metaDataObject = JSON.parse(metaDataObject);
	
     for(var key in metaDataObject)
     {
		 if(key == "managers") {
			 managerMetadata   = metaDataObject[key];
		 }
		 if(key == "operator") {
			 mainOperator      = metaDataObject[key];
		 }
		 if(key == "models") {
			 modelMetaData     = metaDataObject[key];
			 //alert(modelMetaData);
		 }
		 if(key == "equipment") {			 
			 equipmentMetaData = metaDataObject[key];
		 }
     }		
	 
	 //Pre-set drop down lists via meta data
	$("[populateEmployees]").each(function() {
		if(managerMetadata.length > 0) {
			$(this).html("");
			$(this).append(new Option("-- Choose --"));
		}
		for(var val in managerMetadata) {
			var employeeName = managerMetadata[val].employeeName + " " + managerMetadata[val].employeeLastName;
			$(this).append(new Option(employeeName));
		}
	});
	
	$("[populateModels]").each(function() {
		if(modelMetaData.length > 0)
		{
			$(this).html("");
			$(this).append(new Option("-- Choose --"));
		}
		for(var val in modelMetaData)
		{
			var modelName = modelMetaData[val];
			$(this).append(new Option(modelName));
		}
	});
	
	$("[populateEquipment]").each(function() {
		if(equipmentMetaData.length > 0)
		{
			$(this).html("");
			$(this).append(new Option("-- Choose --"));
		}
		for(var val in equipmentMetaData)
		{
			var equipmentName = equipmentMetaData[val].enumber;
			$(this).append(new Option(equipmentName));
		}
	});
	
	$("[populateOperatorName]").each(function() {		
		$(this).val(mainOperator);		
	});
	
	window.location = "ilod://true";
	
	//Get's called to handle any changes to the Form GUI based on the environment.
	//Will either be ios or desktop
	UpdateEnvironmentDefaults(callEnvironment);	
}

function receivePostInformation(url, siteGUID, formGUID, displayname, username, url_alias, callEnv)
{
	//Server Configurations
	appURL            = url;
	FormGUID          = formGUID;
	SiteGUID          = siteGUID;
	DisplayName       = displayname;
	UserNameTS        = username;
	URL_Alias         = url_alias;
	callEnvironment   = callEnv;
}

function postToDb(documentGUID, creatorGUID, created, nickName, lock)
{
 
    try { 
	
	var urlConstruct3  = appURL + "read/virtual/" + SiteGUID + "/Documents?where=\"DocumentGUID = '"+ documentGUID +"'\"";
		
	$.getJSON( urlConstruct3, function( data ) {
		
		if(data.length < 1)
		{
			nickName                = atob(nickName);
			created 			    = atob(created);
			
			var jsonData            = {};
			var jsonData2           = {};
			var formValues          = extractData();
			
			jsonData.fields   = {"DocumentGUID":documentGUID, "FormGUID":FormGUID, "CreatorGUID":creatorGUID, "DisplayName":DisplayName, "submitted_by":UserNameTS, "Subject":SubjectName, "Manager":ManagerName, "Desktop_URL_Alias":URL_Alias, "IsLocked":(lock == "yes") ? "1" : "0", "Nickname":nickName, "DateCreated":created, "DateModified":created };
			jsonData2.fields  = {"DocumentGUID":documentGUID, "DocumentJSON":btoa(formValues)}
			var urlConstruct  = appURL + "create/virtual/" + SiteGUID + "/Documents";
			var urlConstruct2 = appURL + "create/forms/FormData";
			
			$.ajax({
				url : urlConstruct,
				type: "POST",
				data : JSON.stringify(jsonData),
				contentType: "application/json",
				success: function(data, textStatus, jqXHR)
				{
					
					$.ajax({
						url : urlConstruct2,
						type: "POST",
						data : JSON.stringify(jsonData2),
						contentType: "application/json",
						success: function(data, textStatus, jqXHR)
						{
							alert("Form Successfully Saved");
							if(callEnvironment == "ios")
								window.location = "isyn://yes";
						},
						error: function (jqXHR, textStatus, errorThrown)
						{
							if(callEnvironment == "ios")
								window.location = "isyn://no";
							alert("Form has been saved locally.");
						}
					});
				},
				error: function (jqXHR, textStatus, errorThrown)
				{
					if(callEnvironment == "ios")
						window.location = "isyn://no";
					alert("Form has been saved locally.");
				}
			});
		}
		else
		{
			alert('Error. Duplicate forms exist. Please contact support with reference x219');
		}
	
	});
	
	}
	catch(err)
	{
		alert(err);
	}
}

function resetElements() {
	$('input:radio[class*="formElement"]').prop('checked', false);
	
	$(".chosen").val('').trigger("chosen:updated");
	
	$('input[class*="formElement"]').each(function() {	
		if($(this).attr("type") != "button" && $(this).attr("type") != "submit")
		{
			$(this).val("");
		}
	});
	
	if(typeof RemoveAllRowsFromTaskList == 'function') {
		RemoveAllRowsFromTaskList();
	}
	
	$('textarea[class*="formElement"]').each(function() {
		$(this).val("");
	});
	
	$('input:checkbox[class*="formElement"]').prop('checked', false);
	
	$('select[class*="formElement"]').val(0);
	$("button span").html("Select");
	
	$("[removeOnReset]").each(function() {
		$(this).remove("");
	});
	
	$("[clearOnReset]").each(function() {
		$(this).html("");
	});
	
	$("[populateOperatorName]").each(function() {
		$(this).val(SubjectName);
	});
	
	$("#signature_container").html("");
	signatureShowing = 0;
	
	$("#picture_container").html("");
	imageAttachmentCount = 0;
	imageAttachments     = [];
	
	loadDefaultFields();
}

function enableElements() {
	$('.formElement').attr('disabled', false);
	$(".chosen").attr('disabled', false).trigger("chosen:updated");
	$(".autoDate").attr('disabled', true);
}

function disableElements() {
	$('.formElement').attr('disabled', true);
	$('.activeButton').attr('disabled', false);
	$(".chosen").attr('disabled', true).trigger("chosen:updated");
}

function updateDb(documentGUID, Modified, lock, nickName, creatorGUID) {
	
	/*
		The API currently does not allow submitting updated records without the RecordGroupGUID. We
		can get this by grabbing the DocumentGUID. If we get more than one object back, we will send an alert,
		saying duplicate documents were sent in, and a new one needs to be created and MISOM Technical Support
		needs to be contacted. Ideally, this will never happen, but I suppose it's a one in a million trillion billion quadrillion chance.
	*/
	try {
		
		var urlConstruct  = appURL + "read/virtual/" + SiteGUID + "/Documents?where=\"DocumentGUID = '"+ documentGUID +"'\"";
		
		$.getJSON( urlConstruct, function( data ) {
			
			if(data.length > 0)
			{
				var returnedObject  = data[0];
				var TableRecordGUID = returnedObject.TableRecordGUID;
				
				var jsonData            = {};
				var jsonData2           = {};
				var formValues          = extractData();
				nickName                = atob(nickName);
				Modified                = atob(Modified);
				
				jsonData.key      = {"TableRecordGUID":TableRecordGUID};
				jsonData.fields   = {"DisplayName":DisplayName, "submitted_by":UserNameTS, "Subject":SubjectName, "Manager":ManagerName, "Desktop_URL_Alias":URL_Alias, "IsLocked":(lock == "yes") ? "1" : "0", "Nickname":nickName, "DateModified":Modified };
				jsonData2.fields  = {"DocumentGUID":documentGUID, "DocumentJSON":btoa(formValues)};
				jsonData2.key     = {"DocumentGUID":documentGUID};
				var urlConstruct3 = appURL + "update/virtual/" + SiteGUID + "/Documents";
				var urlConstruct2 = appURL + "update/forms/FormData";
				
				$.ajax({
					url : urlConstruct3,
					type: "POST",
					data : JSON.stringify(jsonData),
					contentType: "application/json",
					success: function(data, textStatus, jqXHR)
					{
						
						$.ajax({
							url : urlConstruct2,
							type: "POST",
							data : JSON.stringify(jsonData2),
							contentType: "application/json",
							success: function(data, textStatus, jqXHR)
							{
								if(lock == "yes")
									alert("Form Successfully Submitted & Locked");
								else
									alert("Form Successfully Saved");
								
								if(callEnvironment == "ios" && lock == "yes")
									window.location = "lwss://yes"; //lwss - Lock was sent successfully
							},
							error: function (jqXHR, textStatus, errorThrown)
							{
								alert("Form has been saved locally.");
								if(callEnvironment == "ios" && lock == "yes")
									window.location = "lwss://no"; 
							}
						});
					},
					error: function (jqXHR, textStatus, errorThrown)
					{
						if(callEnvironment == "ios" && lock == "yes")
							window.location = "lwss://no"; 
						
						alert("Form has been saved locally.");
					}
				});
			}
			else
			{
				postToDb(documentGUID, creatorGUID, Modified, nickName, lock);
			}
			
		});
	}
	catch(err)
	{
		alert("This document cannot be submitted. Please contact support. Reference: x492");
	}
	
}

function SaveButtonClicked(nickName, isLocked) {
	documentGuid = createGUID();
	postToDb(documentGuid, userPersonGUID, btoa(getNewFormattedDate(new Date)), btoa(nickName), isLocked);
	$("#update_button").css("display","inline-block");
	$("#print_button").css("display","inline-block");
}

function UpdateButtonClicked(docGUID, nickn, isLocked) {	
	documentGuid = docGUID;
	updateDb(docGUID, btoa(getNewFormattedDate(new Date)), isLocked,  btoa(nickn), userPersonGUID);
	$("#print_button").css("display","inline-block");
}

$(document).ready(function() {
	
	$("[populateOperatorName]").each(function() {
		$(this).val(SubjectName);
	});
	
	//We need to set focus event triggers to determine what element we are on.
	$('input[class*="formElement"]').focus(function() {
		if($(this).hasAttr("databaseColumn"))
			currentField = $(this).attr("databaseColumn");
	});
	
	$('textarea[class*="formElement"]').focus(function() { 
		if($(this).hasAttr("databaseColumn"))
			currentField = $(this).attr("databaseColumn");
	});
	
	$('select[class*="formElement"]').focus(function() { 
		if($(this).hasAttr("databaseColumn"))
			currentField = $(this).attr("databaseColumn");
	});
	//End focus triggers

});

function attachSignature(databaseColumn, signatureData) {
	
	try {
		
		signatureData                        = decodeURIComponent(signatureData);
		currentSignatureData[databaseColumn] = signatureData;
		signatureShowing = 1;
		
		//We need to get the actual instance of the element via the databaseColumn.
		var key = "[databaseColumn=" + databaseColumn + "]";
		var dbColumnInstance;
		
		$(key).each(function() {
			dbColumnInstance = $(this);
		});
	
		$(dbColumnInstance).html("");
		
		var height   = $(dbColumnInstance).attr("picheight");
		var width    = $(dbColumnInstance).attr("picwidth");
		
		var newImage = '<img src="data:image/png;base64,' + signatureData + '" id="' + 'img' + databaseColumn + '" width="'+width+'" height="'+height+'" style="margin-top:15px;" removeOnReset="true" />';
		
		var imageOffsetKey = "#img" + databaseColumn;
		
		$(dbColumnInstance).css("text-align", "left");
		$(dbColumnInstance).append(newImage);
		$(dbColumnInstance).css("background", "none");
	}
	catch(err) 
	{
		alert(err);
	}
}

function UpdateGeoLocation(location) {
	UpdateGeoLabel();
	UpdateGeoCell(location);
}

function UpdateGeoLabel() {	
	$("#geoLabelCell").html("");
	
	$("#geoLabelCell").append('<label databaseColumn="geoLocLabel" elementType="label" executeStandardFunction="UpdateGeoLabel" id="geo_location_label" style="display:inline-block">GEO Location:</label>');
}

function UpdateGeoCell(location) {	
	$("#geo_location").html(location);
}

function attachPicture(tagDetails, imageData) {
	try {
	tagDetails = decodeURIComponent(tagDetails);
	tagDetails = atob(tagDetails);
	tagDetails = JSON.parse(tagDetails);
	
	imageData  = decodeURIComponent(imageData);

	//Inject the first styling of the pictures
	if(imageAttachmentCount == 0) {
		var picContainer   = document.getElementById("picture_container");
		var pictureTitle   = document.createElement('div');
		pictureTitle.style.borderBottom = "2px solid #919191";
		pictureTitle.style.textAlign    = "left";
		pictureTitle.style.height       = "40px";
		pictureTitle.style.marginTop    = "10px";
		pictureTitle.style.fontsize     = "20px";
		pictureTitle.id                 = "pictitle";
		pictureTitle.style.fontweight   = "bold";
		pictureTitle.style.width        = "100%";
		pictureTitle.innerHTML = "Picture Attachments";
		picContainer.appendChild(pictureTitle);
	}
	
	var marginL        = (imageAttachments.length == 0) ? 0 : 15;

	//Add the attachment to the image attachment.
	var attachment       = {};
	
	var id               = tagDetails.GUID;
	attachment.ImageGUID = id;
	attachment.User      = tagDetails.User;
	attachment.Lat       = tagDetails.Lat;
	attachment.Lon       = tagDetails.Lon;
	attachment.Field     = currentField;
	attachment.Image     = imageData;
    attachment.Comment   = tagDetails.Comments;
	
	imageAttachments.push(attachment);	
	
	var currentLength = imageAttachments.length-1;
	
	var newImage = '<img src="data:image/png;base64,' + imageData + '" onclick="showImage(\'' + currentLength + '\')" id="pic_' + currentLength + '" width="150" style="border-radius:15px; margin-left:' + marginL + 'px; margin-top:15px;" />';
	$("#picture_container").append(newImage);
	
	imageAttachmentCount++;
	
	}
	catch(err) {
		alert(err);
	}
}

function showImage(pictureID) {
	var imageContainer                   = document.createElement("div");
	imageContainer.style.width           = "100%";
	imageContainer.style.height          = "100%";
	imageContainer.style.position        = "fixed";
	imageContainer.id  				     = "pic_container";
	imageContainer.style.zIndex          = "500000";
	imageContainer.style.backgroundColor = "#000000";
	imageContainer.style.top             = "0";
	imageContainer.style.left            = "0";
	imageContainer.style.opacity         = "1.0";
	document.body.appendChild(imageContainer);
	
	//Let's grab the base 64 image data.
	var imageData = imageAttachments[pictureID].Image;
	var comments  = imageAttachments[pictureID].Comment;
	if(comments == "")
		comments = "No Comments Entered.";
	
	var newImage  = '<table align="center" border="0" cellspacing="2" width="95%" height="95%" style="box-shadow:none">' +
						'<tr height="70%">' +
							'<td align="center" width="100%" colspan="2" bgcolor="#000000">' +
								'<img src="data:image/png;base64,' + imageData + '" style="margin-top:45px; height:450px; width:450px;" />' +
							'</td>' +
						'</tr>' +
						'<tr height="20%">' +
							'<td align="right" width="25%" bgcolor="#000000"><font color="#FFFFFF" size="2" face="Arial">Comments:</font></td>' +
							'<td align="left" width="75%" bgcolor="#000000">&nbsp;&nbsp;<font color="#CCCCCC" size="2" face="Arial"> ' + comments + '</font></td>' + 
						'</tr>' + 
						'<tr height="10%">' +
							'<td align="center" colspan="2" width="100%" bgcolor="#000000">' +
								'<div style="width:45%; text-align:center; height:50px; line-height:50px; background-color:#fc9817; color:#FFFFFF; font-size:13px; float:left; margin-left:3%; margin-top:25px;" onclick="removePicture(\''+ pictureID +'\');">Remove</div>' +
								'<div style="line-height:50px; margin-top:25px; width:45%; margin-left:5%; text-align:center; height:50px; float:left; background-color:#fc9817; color:#FFFFFF; font-size:13px;" onclick="cancelPicture()">Done</div>' +
							'</td>' +
						'</tr>' +
					'</table>';
	
	$("#pic_container").append(newImage);

}

function removePicture(pictureID) {
	imageAttachmentCount--;
	
	var picID = "#pic_" + pictureID;
	$(picID).remove("");
	$("#pic_container").remove("");
	
	delete imageAttachments[pictureID];
	
	if(imageAttachmentCount == 0)
		$("#pictitle").remove("");
}

function cancelPicture() {
	$("#pic_container").remove("");
}

//Make a GUID for the picture
function createGUID() {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x3|0x8)).toString(16);
    });
    return uuid.toUpperCase();
}

//Cookie Extractor
function GetCookieValue(key, type) {
	var cookieArr = document.cookie.split("; ");
	var tempValue;
	
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

function getNewFormattedDate(date) {
	var dateTimeString = "";
	
	if(date.getMonth() < 10) {
		dateTimeString += "0";
	}
	
	dateTimeString += date.getMonth();
	dateTimeString += "/";	
	
	if(date.getDate() < 10) {
		dateTimeString += "0";
	}
	
	dateTimeString += date.getDate();
	dateTimeString += "/";
	dateTimeString += date.getFullYear();
	
	dateTimeString += " ";
	dateTimeString += date.getHours();
	dateTimeString += ":";
	dateTimeString += date.getMinutes();
	
	return dateTimeString;
}

function getFormattedDate() {
	var newDate = new Date();
	var year = newDate.getFullYear();
	var month = newDate.getMonth() + 1;
	var date = newDate.getDate();
	
	if(month < 10) {
		month = "0" + month;
	}
	
	if(date < 10) {
		date = "0" + date;
	}
	
	
	var formattedDate = (year + '-' + month + '-' + date);
	return formattedDate;
}

function clearAutoDate() {
	$('.autoDate').val("");
}

//This is designed to call the iOS application with a signature box for initials. -Z.C. 4/21/2015
function callInitials(DatabaseColumn)
{
	if(callEnvironment == "desktop")
	{
		alert('Initials must be completed from an iOS device.');
	}
	else
	{
		window.location = "isig://" + DatabaseColumn; 
	}
}

//This is designed to call the iOS application with a signature box for initials. -Z.C. 4/21/2015
function callSignature(DatabaseColumn) {
	if(callEnvironment == "desktop")
	{
		alert('Signatures must be completed from an iOS device.');
	}
	else
	{
		window.location = "ssig://" + DatabaseColumn; 
	}
}

function loadDefaultFields() {
	$(".autoDate").val(getFormattedDate());
	
	$("#geoSpanCell").html('<span executeStandardFunction="UpdateGeoCell" id="geo_location" databaseColumn="geoLocation" elementType="span"></span>');
	
	if(callEnvironment == "desktop") {
		$(".isUser").val(userFirstName + " " + userLastName);
		$(".isUser").attr("PersonGUID", userPersonGUID);
		
		if(GetCookieValue("documentGUID","string")) {
			var docGuid = GetCookieValue("documentGUID","sting");
			getDocumentJSONData(docGuid);
		}
	}
	
	$(".initialsTD div").css("background-image", "url('../forms/images/initials_icon.png')");
	$(".chosen").attr("data-placeholder", "Select Some Options:");
	$(".chosen").trigger("chosen:updated");
	
	UpdateEnvironmentDefaults(callEnvironment);	
}

function UpdateEnvironmentDefaults(env) {
	if(env == 'desktop') {		
		$(".signatureBox").html("Signatures need to be completed from an iOS device.");
	}
	if(env == 'ios') {
		$(".signatureBox").html("Tap to sign.");
	}
}

function FriendlyPrintView(elementId) {
	$(".formElement").each(function() {
		var element = $(this);
		
		var elementMaskHtml = '';
		var elementValue;
		
		if(element.attr("elementType") == "textarea") {
			elementValue = element.val();
			elementMaskHtml += '<span>'+elementValue+'</span>';
		}
		
		//Textboxes
		if(element.attr("elementType") == "textbox") {
			elementValue = element.val();
			elementMaskHtml += '<span>'+elementValue+'</span>';		
		}
		
		//Checkboxes
		if(element.attr("elementType") == "checkbox") {
			var isChecked = element.is(":Checked");
			
			if(isChecked) {
				elementValue = "&#9745";
			}
			else {
				elementValue = "&#9744";
			}
			
			elementMaskHtml += '<span>'+elementValue+'</span>';		
		}
		
		//Date -- i.e. 12/20/1995 - Standard Date, no Time
		if(element.attr("elementType") == "date") {
			elementValue = element.val();
			elementMaskHtml += '<span>'+elementValue+'</span>';		
		}
		
		//Radio Button Group
		if(element.attr("elementType") == "radiogroup") {
			var isChecked = element.is(":Checked");
			
			if(isChecked) {
				elementValue = "&#9899";
			}
			else {
				elementValue = "&#9898";
			}
			
			elementMaskHtml += '<span>'+elementValue+'</span>';		
		}
		
		//Select Fields
		if(element.attr("elementType") == "select") {
			elementValue = element.children("option:selected").text();
			elementMaskHtml += '<span>'+elementValue+'</span>';	
		}
		
		element.after(elementMaskHtml);
		element.hide();
	});
	
	printData(elementId);
}

function printData(elementId) {
	var divToPrint=document.getElementById(elementId);
	newWin= window.open("");
	newWin.document.write('<link href="../menu/css/print.css" rel="stylesheet"/>');
	newWin.document.write(divToPrint.outerHTML);
	
	setTimeout(function() {
		newWin.print();
		newWin.close();
		CloseForm();
	}, 50);
}

function DisplayFormLoadingBox() {
	$('#content_container #form_loading_box').css("display", "block");
	$('#content_container #form_loading_box').animate({"opacity":1}, 200);
}

function HideFormLoadingBox() {
	$('#content_container #form_loading_box').css("display", "none");
	$('#content_container #form_loading_box').css("opacity", 0);
}