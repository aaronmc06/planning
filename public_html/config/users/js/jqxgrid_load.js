/*============================================================
	Property of:		MISOM TECHNOLOGIES
	Developer:			AARON MCCOLOUGH
	Application Name:	FARA_FRESNILLO
	Directory:			FARA_FRESNILLO/CONFIG/JS
	File Name:			jqxgrid_load.js
=============================================================*/

var newG1RowExist  = false;
var rowsG1Changed  = false;
var editModeG1     = false;
var savedStateG1;

function LoadGrid(url) {
	
	$('#jqxgrid').jqxGrid('destroy');

	if($("#jqxgrid").length == 0) {
		$("#jqxWidget").prepend('<div id="jqxgrid"></div>');
	}

	// prepare the data
	var source = {
		datatype: "json",
		datafields: [
			{ name: 'PersonGUID',		display: 'PersonGUID', type: 'string' },
			{ name: 'Firstname',		display: 'Firstname', type: 'string' },
			{ name: 'MiddleName',		display: 'MiddleName', type: 'string' },
			{ name: 'LastName',			display: 'LastName', type: 'string' },
			{ name: 'DisplayName',		display: 'DisplayName', type: 'string' },
			{ name: 'Email',			display: 'Email', type: 'string' },
			{ name: 'AppUserName',		display: 'AppUserName', type: 'string' },
			{ name: 'AppPassword',		display: 'AppPassword', type: 'string' },
			{ name: 'IsActive',			display: 'IsActive', type: 'bool' },
			{ name: 'SiteGUID',			display: 'SiteGUID', type: 'string' },
			{ name: 'RoleGUID',			display: 'RoleGUID', type: 'string' },
			{ name: 'SiteDisplayName',	display: 'Site', type: 'string' },
			{ name: 'RoleDisplayName',	display: 'Role', type: 'string' },
			{ name: 'Created',			display: 'Created', type: 'string' },
			{ name: 'Modified',			display: 'Modified', type: 'string' }
		],
		url: url
	};
	
	var dataAdapter = new $.jqx.dataAdapter(source);
	
	var resetPassword = function(row, columnfield, value, defaulthtml, columnproperties) {
		return '<div id="grid_cancel_button" style="cursor: pointer"><img style="width: 22px; height: 22px" src="../images/reset_icon.png"/></div>';
	}
	
	var resetButtonClick = function(rowIndex, rowId) {
		DisplayConfirm(languagePack.message.confirm,languagePack.message.confirmPassReset,
			function() {
				editrow = rowIndex;
				var rowObject = $('#jqxgrid').jqxGrid('getrowdata', rowIndex);
				ResetPassword(rowObject);
			}
		);
	}

	// Create jqxgrid
	$("#jqxgrid").jqxGrid({
		width: "100%",
		height: "100%",
		source: dataAdapter,
		showstatusbar: true,
		renderstatusbar: function (statusbar) {
			// appends buttons to the status bar.
			var container = $("<div style='overflow: hidden; position: relative; margin: 5px;'></div>");
			var addButton = $("<div id='grid_add_button' style='float: left; margin-left: 5px;'><img style='position: relative; width: 25px; height: 25px' src='../images/add_icon.png'/><span style='margin-left: 4px; position: relative; top: -1px;'></span></div>");
			var updateButton = $("<div id='grid_upload_button' style='float: left; margin-left: 5px;'><img style='position: relative; width: 25px; height: 25px; cursor: initial' src='../images/upload_inactive_icon.png'/><span style='margin-left: 4px; position: relative; top: -1px;'></span></div>");
			container.append(addButton);
			container.append(updateButton);
			statusbar.append(container);
			addButton.jqxButton({  width: 60, height: 20 });
			updateButton.jqxButton({  width: 60, height: 20 });
			
			// add new row.
			addButton.click(function (event) {
				if(!editModeG1 && !lockedForService) {
					AddNewUserRow();
					newG1RowExist = true;
				}
			});

			// update grid.
			updateButton.click(function (event) {
				if((rowsG1Changed || newG1RowExist) && !editModeG1 && !lockedForService) {
					LockForService();
					$('#jqxgrid #grid_upload_button img').attr("src", "../images/upload_inactive_icon.png");
					$('#jqxgrid #grid_upload_button img').css("cursor", "initial");
					$('#jqxgrid #grid_add_button img').attr("src", "../images/add_inactive_icon.png");			
					$('#jqxgrid #grid_add_button img').css("cursor", "initial");
					rowsG1Changed = false;
					newG1RowExist = false;					
					UpdateGrid();
				}
			});
		},
		columnsresize: true,
		columnsreorder: true,
		filterable: true,
		sortable: true,
		groupable: true,
        editable: true,
		enabletooltips: true,
		columns: [
			{ text: 'PersonGUID', datafield: 'PersonGUID', hidden: true },
			{ text: 'SiteGUID', datafield: 'SiteGUID', hidden: true },
			{ text: 'RoleGUID', datafield: 'RoleGUID', hidden: true },
			{ text: languagePack.users.SiteDisplayName, datafield: 'SiteDisplayName', editable: true, columntype: 'dropdownlist', createeditor: function (row, column, editor) {
					// assign a new data source to the dropdownlist.
					var list = siteArray;
					editor.jqxDropDownList({ autoDropDownHeight: true, source: list });
				},
				// update the editor's value before saving it.
				cellvaluechanging: function (row, column, columntype, oldvalue, newvalue) {
					// return the old value, if the new value is empty.
					if (newvalue == "") return oldvalue;
				},
				validation: function (cell, value) {
					if(!value) {
						return { result: false, message: languagePack.users.invalidSite };
					}
					return true;
				}
			},
			{ text: languagePack.users.RoleDisplayName, datafield: 'RoleDisplayName', columntype: 'dropdownlist', width: 110, createeditor: function (row, column, editor) {
					// assign a new data source to the dropdownlist.
					var list = roleArray;
					editor.jqxDropDownList({ autoDropDownHeight: true, source: list });
				},
				// update the editor's value before saving it.
				cellvaluechanging: function (row, column, columntype, oldvalue, newvalue) {
					// return the old value, if the new value is empty.
					if (newvalue == "") return oldvalue;
				},
				validation: function (cell, value) {
					if(!value) {
						return { result: false, message: languagePack.users.invalidRole };
					}
					return true;
				}
			},
			{ text: 'Created', datafield: 'Created', hidden: true },
			{ text: 'Modified', datafield: 'Modified', hidden: true },
			{ text: languagePack.users.Firstname, editable: true, datafield: 'Firstname' },
			{ text: languagePack.users.MiddleName, editable: true, datafield: 'MiddleName' },
			{ text: languagePack.users.LastName, editable: true, datafield: 'LastName' },
			{ text: languagePack.users.DisplayName, editable: true, datafield: 'DisplayName' },
			{ text: languagePack.users.Email, editable: true, datafield: 'Email', width: 180,
				validation: function (cell, value) {
					if(!value || value == "") {
						return { result: false, message: languagePack.users.invalidEmail };
					}
					for(var key in personData) {
						if(value == personData[key].Email && $('#jqxgrid').jqxGrid('getrowdata', cell.row).PersonGUID != personData[key].PersonGUID) {
							return { result: false, message: languagePack.users.emailInUse };
						}
					}
					return true;
				}
			},
			{ text: languagePack.users.AppUserName, editable: false, datafield: 'AppUserName' },
			{ text: languagePack.users.AppPassword, editable: true, hidden: false, datafield: 'AppPassword',
				validation: function (cell, value) {
					if(value.length < 6) {
						return { result: false, message: languagePack.users.invalidPass };
					}
					return true;
				}
			},
			{ text: languagePack.users.IsActive, editable: true, datafield: 'IsActive', columntype: 'checkbox', width: 50 },
			{ text: languagePack.common.resetPass, datafield: 'Reset', width: 60, editable: false, resizable: false, groupable: false, hidden: false, cellsrenderer: resetPassword }
		],
	});
	
	/*===================================================
					Listener Events
	====================================================*/
	
	$("#jqxgrid").on("cellclick", function (event) {
		// event arguments.
		var args = event.args;
		// row's bound index.
		var rowBoundIndex = args.rowindex;
		// row's visible index.
		var rowVisibleIndex = args.visibleindex;
		// right click.
		var rightclick = args.rightclick; 
		// original event.
		var ev = args.originalEvent;
		// column index.
		var columnindex = args.columnindex;
		// column data field.
		var dataField = args.datafield;
		// cell value
		var value = args.value;
		
		if(dataField == "Reset") {
			$('#jqxgrid').jqxGrid('clearselection');
			resetButtonClick(rowBoundIndex, $('#jqxgrid').jqxGrid('getrowid', rowBoundIndex));
		}
	});
	
	$("#jqxgrid").on('cellbeginedit', function (event) {
		editModeG1 = true;
		$('#jqxgrid #grid_upload_button img').attr("src", "../images/upload_inactive_icon.png");
		$('#jqxgrid #grid_upload_button img').css("cursor", "initial");
		$('#jqxgrid #grid_add_button img').attr("src", "../images/add_inactive_icon.png");			
		$('#jqxgrid #grid_add_button img').css("cursor", "initial");
	});
	
	$("#jqxgrid").on('cellendedit', function (event) {
		// event arguments.
		var args = event.args;
		// column data field.
		var dataField = event.args.datafield;
		// row's bound index.
		var rowBoundIndex = event.args.rowindex;
		// cell value
		var value = args.value;
		// cell old value.
		var oldvalue = args.oldvalue;
		// row's data.
		var rowData = args.row;

		editModeG1 = false;
		
		if(value != oldvalue) {
			rowsG1Changed = true;
		}
		
		if(newG1RowExist || rowsG1Changed) {
			$('#jqxgrid #grid_upload_button img').attr("src", "../images/upload_icon.png");
			$('#jqxgrid #grid_upload_button img').css("cursor", "pointer");
		}
		$('#jqxgrid #grid_add_button img').attr("src", "../images/add_icon.png");			
		$('#jqxgrid #grid_add_button img').css("cursor", "pointer");

		if(dataField == 'RoleDisplayName') {
			rowData.RoleGUID = roleIdArray[roleArray.indexOf(value)];
		}
		if(dataField == 'SiteDisplayName') {
			rowData.SiteGUID = siteIdArray[siteArray.indexOf(value)];
		}
		if(dataField == 'Email') {
			$('#jqxgrid').jqxGrid('setcellvalue',rowBoundIndex, "AppUserName", value);
		}
		
		editModeG1 = false;
	});
	
	$("#jqxgrid").on("pagesizechanged", function (event) {
		// event arguments.
		var args = event.args;
		// page number.
		var pagenum = args.pagenum;
		// old page size.
		var oldpagesize = args.oldpagesize;
		// new page size.
		var pagesize = args.pagesize;
		
		$('#jqxgrid').jqxGrid('render');
	});
	
	$("#jqxgrid").on("bindingcomplete", function (event) {
		setTimeout(function(){
			
			if(savedStateG1) {
				$("#jqxgrid").jqxGrid('loadstate', savedStateG1);
				savedStateG1 = null;
			}
			else {
				$('#jqxgrid').jqxGrid('render');
			}
			
			ServiceComplete();
		},500);
	});
}