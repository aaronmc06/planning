/*============================================================
	Property of:		MISOM TECHNOLOGIES
	Developer:			AARON MCCOLOUGH
	Application Name:	FARA_FRESNILLO
	Directory:			FARA_FRESNILLO/CONFIG/JS
	File Name:			jqxgrid_load.js
=============================================================*/
var newG1RowExist	= false;
var rowsG1Changed	= false;
var editModeG1		= false;
var rowSelected		= false;
var savedStateG1;

function LoadGrid(url) {

    $('#jqxgrid').jqxGrid('destroy');

    if ($("#jqxgrid").length == 0) {
        $("#jqxWidget").prepend('<div id="jqxgrid"></div>');
    }

    // prepare the data
    var source = {
        datatype: "json",
        datafields: [
			{ name: 'Employee_GUID',	display: 'Employee_GUID',		type: 'string' },
			{ name: 'Area_GUID',		display: 'Area_GUID',			type: 'string' },
			{ name: 'AreaDisplayName',	display: 'AreaDisplayName',		type: 'string' },
			{ name: 'RoleGUID',			display: 'RoleGUID',			type: 'string' },
			{ name: 'RoleDisplayName',	display: 'RoleDisplayName',		type: 'string' },
			{ name: 'CorporateEmpId',	display: 'CorporateEmpId',		type: 'string' },
			{ name: 'Department',		display: 'Department',			type: 'string' },
			{ name: 'Crew',				display: 'Crew',				type: 'string' },
			{ name: 'FirstName',		display: 'FirstName',			type: 'string' },
			{ name: 'MiddleName',		display: 'MiddleName',			type: 'string' },
			{ name: 'LastName',			display: 'LastName',			type: 'string' },
			{ name: 'EmployeeName',		display: 'EmployeeName',		type: 'string' },
			{ name: 'EmployeePosition',	display: 'EmployeePosition',	type: 'string' },
			{ name: 'IsActive',			display: 'IsActive',			type: 'bool' },
			{ name: 'IsUser',			display: 'IsUser',				type: 'string' }
		],
        url: url
    };

    var dataAdapter = new $.jqx.dataAdapter(source);

    // Create jqxgrid
    $("#jqxgrid").jqxGrid({
        width: "100%",
        height: "100%",
        source: dataAdapter,
        showstatusbar: true,
        renderstatusbar: function(statusbar) {
            // appends buttons to the status bar.
			var container		= $("<div style='overflow: hidden; position: relative; margin: 5px;'></div>");
			var convertButton	= $('<input class="jqx-fill-state-disabled" style="float: right; font-size:16px !important; font-weight:bold;" id="convert_button" type="button" value="Convertir" />');
			var addButton		= $("<div id='grid_add_button' style='float: left; margin-left: 5px;'><img style='position: relative; width: 25px; height: 25px' src='../images/add_icon.png'/><span style='margin-left: 4px; position: relative; top: -1px;'></span></div>");
			var updateButton	= $("<div id='grid_upload_button' style='float: left; margin-left: 5px;'><img style='position: relative; width: 25px; height: 25px; cursor: initial' src='../images/upload_inactive_icon.png'/><span style='margin-left: 4px; position: relative; top: -1px;'></span></div>");
			container.append(addButton);
			container.append(updateButton);
			container.append(convertButton);
			statusbar.append(container);
			addButton.jqxButton({  width: 60, height: 20 });
			updateButton.jqxButton({  width: 60, height: 20 });
			convertButton.jqxButton({ width: 100, height: 24 });
			
			// add new row.
			addButton.click(function (event) {
				if(!editModeG1 && !lockedForService) {
					$('#jqxgrid').jqxGrid('cleargroups');
					var newRow = {};
					newG1RowExist = true;
					newRow.Employee_GUID   = -1;
					
					$("#jqxgrid").jqxGrid('addrow', null, newRow);
					$('#jqxgrid').jqxGrid('selectrow', $('#jqxgrid').jqxGrid('getrows').length - 1);
					$("#jqxgrid").jqxGrid('begincelledit', $('#jqxgrid').jqxGrid('getrows').length - 1, "CorporateEmpId");
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
			
			// convert row.
			convertButton.click(function (event) {
				var element = $(this);
				if(rowSelected && !editModeG1 && !lockedForService && !element.hasClass("jqx-fill-state-disabled")) {
					var rowObject = $('#jqxgrid').jqxGrid('getrowdata', $('#jqxgrid').jqxGrid('getselectedrowindex'));

					DisplayConfirm(languagePack.message.confirm, "Desea crear usuario para " + rowObject.EmployeeName + "?",
						function() {
							ConvertUser(rowObject);
						}
					);
				}
			});
   
            statusbar.append(container);

        },
        columnsresize: true,
        columnsreorder: true,
        filterable: true,
        sortable: true,
        groupable: true,
        editable: true,
		editmode: 'dblclick',
        enabletooltips: true,
        columns: [
			{ text: '#', sortable: false, filterable: false, editable: false, groupable: false, draggable: false,
				resizable: false, datafield: '', columntype: 'number', width: 50, cellsrenderer: function (row, column, value) {
					return "<div style='margin:4px;'>" + (value + 1) + "</div>";
				}
			},
			{ text: 'Employee_GUID',	datafield: 'Employee_GUID',	hidden: true },
			{ text: 'Area_GUID',		datafield: 'Area_GUID',		hidden: true },
			{ text: 'RoleGUID',			datafield: 'RoleGUID',		hidden: true },
			{ text: 'Created',			datafield: 'Created',		hidden: true },
			{ text: 'Modified',			datafield: 'Modified',		hidden: true },
			{ text: "Área", datafield: 'AreaDisplayName', editable: true, columntype: 'dropdownlist', createeditor: function(row, column, editor) {
					// assign a new data source to the dropdownlist.
					var list = areaArray;
					editor.jqxDropDownList({
						autoDropDownHeight: true,
						source: list
					});
				},
				// update the editor's value before saving it.
				cellvaluechanging: function(row, column, columntype, oldvalue, newvalue) {
					// return the old value, if the new value is empty.
					if (newvalue == "") return oldvalue;
				},
				validation: function(cell, value) {
					if (!value) {
						return {
							result: false,
							message: languagePack.users.invalidArea
						};
					}
					return true;
				}
			},
			{ text: languagePack.users.RoleDisplayName, datafield: 'RoleDisplayName', editable: true, columntype: 'dropdownlist', createeditor: function(row, column, editor) {
					// assign a new data source to the dropdownlist.
					var list = roleArray;
					editor.jqxDropDownList({
						autoDropDownHeight: true,
						source: list
					});
				},
				// update the editor's value before saving it.
				cellvaluechanging: function(row, column, columntype, oldvalue, newvalue) {
					// return the old value, if the new value is empty.
					if (newvalue == "") return oldvalue;
				},
				validation: function(cell, value) {
					if (!value) {
						return {
							result: false,
							message: languagePack.users.invalidRole
						};
					}
					return true;
				}
			},
			{ text: 'CorporateEmpId', datafield: 'CorporateEmpId' },
			{ text: 'Department', datafield: 'Department' },
			{ text: 'Crew', datafield: 'Crew' },
			{ text: languagePack.users.FirstName, datafield: 'FirstName' },
			{ text: languagePack.users.MiddleName, datafield: 'MiddleName' },
			{ text: languagePack.users.LastName, datafield: 'LastName' },
			{ text: languagePack.users.DisplayName, datafield: 'EmployeeName' },
			{ text: 'Posición', datafield: 'EmployeePosition' },
			{ text: languagePack.users.IsActive, editable: true, datafield: 'IsActive', columntype: 'checkbox', width: 50, hidden: true },
			{ text: 'IsUser', datafield: 'IsUser', hidden: true }
		],
    });

    /*===================================================
					Listener Events
	====================================================*/
	
	$("#jqxgrid").on('cellbeginedit', function (event) {
		editModeG1 = true;
		$("#convert_button").addClass("jqx-fill-state-disabled");
		$('#jqxgrid #grid_upload_button img').attr("src", "../images/upload_inactive_icon.png");
		$('#jqxgrid #grid_upload_button img').css("cursor", "initial");
		$('#jqxgrid #grid_add_button img').attr("src", "../images/add_inactive_icon.png");			
		$('#jqxgrid #grid_add_button img').css("cursor", "initial");
	});

    $("#jqxgrid").on('cellendedit', function(event) {
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
			switch(value) {
				case "SuperAdmin":
				case "Admin":
				case "Planner":
				case "Supervisor":
				case "Superintendent":
				case "Contractor":
				case "Warehouse":
				case "Maintenance":
					rowData.WebUser = 1;
					rowData.iOSUser	= 1;
					break;
				case "Operator":
					rowData.WebUser = 1;
					rowData.iOSUser	= 0;
				default:
				break;
			}
		}
		(dataField == 'AreaDisplayName') ? rowData.Area_GUID = areaIdArray[areaArray.indexOf(value)] : false;

		$("#convert_button").removeClass("jqx-fill-state-disabled");
    });
	
	$('#jqxgrid').on('rowselect', function (event) {
		var selectedRow	= event.args.rowindex;
		var isUser		= $('#jqxgrid').jqxGrid('getcellvalue', selectedRow, "IsUser");
		
		rowSelected		= true;

		(isUser == 'true') ? $("#convert_button").addClass("jqx-fill-state-disabled") : $("#convert_button").removeClass("jqx-fill-state-disabled");
	});

    $("#jqxgrid").on("pagesizechanged", function(event) {
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

    $("#jqxgrid").on("bindingcomplete", function(event) {
        setTimeout(function() {

            if (savedStateG1) {
                $("#jqxgrid").jqxGrid('loadstate', savedStateG1);
                savedStateG1 = null;
            } else {
                $('#jqxgrid').jqxGrid('render');
            }

            ServiceComplete();
        }, 500);
    });
}