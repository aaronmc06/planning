/*============================================================
	Property of:		MISOM TECHNOLOGIES
	Developer:			AARON MCCOLOUGH FT. JORGE MURILLO
	Application Name:	FARA_FRESNILLO
	Directory:			FARA_FRESNILLO/CONFIG/EMPLOYEE_MACHINE/JS
	File Name:			jqxgrid_employee_machine.js
=============================================================*/

var selectedGrid1Row = -1;
var grid1ChangesMade = false;
var currentEditCell  = [];
var savedStateG1;

var editModeG1 = false;

function LoadEmployeeMachGrid(url) {
	$('#jqxgrid').jqxGrid('destroy');

	if($("#jqxgrid").length == 0) {
		$("#jqxWidget1").prepend('<div id="jqxgrid"></div>');
	}
	
	var source = {
		datatype: "json",
		datafields: [
			{ name: 'EmployeeMachShift_GUID',	display: 'EmployeeMachShift_GUID',	type: 'string' },
			{ name: 'Employee_GUID',			display: 'Employee_GUID',			type: 'string' },
			{ name: 'Machine_GUID',				display: 'Machine_GUID',			type: 'string' },
			{ name: 'EmployeeName',				display: 'EmployeeName', 			type: 'string' },
			{ name: 'MachineDisplayName',		display: 'MachineDisplayName', 		type: 'string' },
			{ name: 'IsOperator',				display: 'IsOperator', 				type: 'bool' },
			{ name: 'IsHelper',					display: 'IsHelper', 				type: 'bool' },
			{ name: 'IsActive',					display: 'IsActive', 				type: 'bool' }
		],
		url: url
	};
	
	var dataAdapter = new $.jqx.dataAdapter(source);
	
	var deleteButton = function(row, columnfield, value, defaulthtml, columnproperties) {
		return '<div id="grid_cancel_button" style="cursor: pointer"><img style="width: 22px; height: 22px" src="../images/cancel_icon.png"/></div>';
	};
	
	var deleteButtonClick = function(rowIndex, rowId) {
		DisplayConfirm(languagePack.message.confirm,languagePack.message.confirmRecordDelete, function(){
			editrow = rowIndex;
			var rowObject = $('#jqxgrid').jqxGrid('getrowdata', rowIndex);
			RemoveEmployeeRow(rowObject, rowId);
		});
	};
	
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
					$('#jqxgrid').jqxGrid('cleargroups');
					var newRow = {};
					newRow.EmployeeMachShift_GUID = -1;
					newRow.IsOperator             = false;
					newRow.IsHelper               = false;

					$("#jqxgrid").jqxGrid('addrow', null, newRow);
					$('#jqxgrid').jqxGrid('selectrow', $('#jqxgrid').jqxGrid('getrows').length - 1);
					$("#jqxgrid").jqxGrid('begincelledit', $('#jqxgrid').jqxGrid('getrows').length - 1, "EmployeeName");
				}
			});

			// update grid.
			updateButton.click(function (event) {
				if(!editModeG1 && !lockedForService) {
					LockForService();
					UpdateEmployeeGrid();
				}
			});
		},
		columnsresize: true,
		columnsreorder: true,
        editable: true,
		editmode: 'dblclick',
		sortable: true,
		filterable: 'excel',
		groupable: true,
		enabletooltips: true,
		columns: [
			{ text: '#', sortable: false, filterable: false, editable: false, groupable: false, draggable: false,
				resizable: false, datafield: '', columntype: 'number', width: 50, cellsrenderer: function (row, column, value) {
					return "<div style='margin:4px;'>" + (value + 1) + "</div>";
				}
			},
			{ text: 'EmployeeMachShift_GUID', datafield: 'EmployeeMachShift_GUID', hidden: true, editable: false },
			{ text: 'Employee_GUID', datafield: 'Employee_GUID', hidden: true, editable: false },
			{ text: 'Machine_GUID', datafield: 'Machine_GUID', hidden: true, editable: false },
			{ text: languagePack.employeeMachine.grid1.EmployeeName, datafield: 'EmployeeName', editable: true,  columntype: 'dropdownlist',
				createeditor: function (row, column, editor) {
					// assign a new data source to the dropdownlist.
					var list = EmployeeNameList;
					editor.jqxDropDownList({
						filterable: true, selectedIndex: 0, source: list, itemHeight: 30, height: 30,
						renderer: function (index, label, value) {
							var datarecord = list[index];
							var table = '<table style="min-width: 10px;"><tr><td style="width: 10px;"></td><td>' + label + '</td></tr></table>';
							return table;
						},
						selectionRenderer: function (element, index, label, value) {
							var text = label.replace(/<br>/g, " ");
							return "<span style='left: 4px; top: 8px; position: relative;'>" + text + "</span>";
						}
					});
				},
				// update the editor's value before saving it.
				cellvaluechanging: function (row, column, columntype, oldvalue, newvalue) {
					// return the old value, if the new value is empty.
					if (newvalue == "") return oldvalue;
				},
				validation: function (cell, value) {
					if(!value) {
						return { result: false, message: languagePack.employeeMachine.invalidEmployee };
					}
					return true;
				}
			},
			{ text: languagePack.employeeMachine.grid1.MachineDisplayName, datafield: 'MachineDisplayName', editable: true,  columntype: 'dropdownlist',
				createeditor: function (row, column, editor) {
					// assign a new data source to the dropdownlist.
					var list = MachineNameList;
					editor.jqxDropDownList({
						filterable: true, selectedIndex: 0, source: list, itemHeight: 30, height: 30,
						renderer: function (index, label, value) {
							var datarecord = list[index];
							var table = '<table style="min-width: 10px;"><tr><td style="width: 10px;"></td><td>' + label + '</td></tr></table>';
							return table;
						},
						selectionRenderer: function (element, index, label, value) {
							var text = label.replace(/<br>/g, " ");
							return "<span style='left: 4px; top: 8px; position: relative;'>" + text + "</span>";
						}
					});
				},
				// update the editor's value before saving it.
				cellvaluechanging: function (row, column, columntype, oldvalue, newvalue) {
					// return the old value, if the new value is empty.
					if (newvalue == "") return oldvalue;
				},
				validation: function (cell, value) {
					if(!value) {
						return { result: false, message: languagePack.employeeMachine.invalidMachine };
					}
					return true;
				}
			},
			{ text: languagePack.employeeMachine.grid1.IsOperator, datafield: 'IsOperator', columntype: 'checkbox', width: 75},
			{ text: languagePack.employeeMachine.grid1.IsHelper	, datafield: 'IsHelper', columntype: 'checkbox', width: 75},
			{ text: 'IsActive', datafield: 'IsActive', editable: false, hidden: true },
			{ text: languagePack.common.del, datafield: 'Delete', width: 60, editable: false, resizable: false, groupable: false, cellsrenderer: deleteButton }
		],
	});
	
	
	/*===================================================
					Event Handlers
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
		
		if(dataField == "Delete") {
			$('#jqxgrid').jqxGrid('clearselection');
			deleteButtonClick(rowBoundIndex, $('#jqxgrid').jqxGrid('getrowid', rowBoundIndex));
		}
	});
	
	$("#jqxgrid").on('cellbeginedit', function (event) {
		// event arguments.
		var args = event.args;
		// column data field.
		var dataField = event.args.datafield;
		// row's bound index.
		var rowBoundIndex = event.args.rowindex;
		// cell value
		var value = args.value;
		// row's data.
		var rowData = args.row;
		editModeG1 = true;
		currentEditCell.push(dataField);
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
		//var rowData = args.row;
		var rowData = $("#jqxgrid").jqxGrid('getrowdata', rowBoundIndex);
		
		if(value != oldvalue) {
			if(dataField == 'EmployeeName') {
				rowData.Employee_GUID = EmployeeGUIDList[EmployeeNameList.indexOf(value)];
			}
			if(dataField == 'MachineDisplayName') {
				rowData.Machine_GUID = MachineGUIDList[MachineNameList.indexOf(value)];
			}
			if(dataField == 'IsOperator' || dataField == 'IsHelper') {
				for(var key in currentEditCell) {
					$("#jqxgrid").jqxGrid('endcelledit', rowBoundIndex, currentEditCell[key], false);
				}
				currentEditCell = [];
			}
			else {
				currentEditCell = [];
			}
			if((dataField == 'EmployeeName' || dataField == 'MachineDisplayName' || dataField == 'IsOperator' || dataField == 'IsHelper') && rowData.EmployeeMachShift_GUID != -1 ) {
				rowData.RowModified = true;
			}
			grid1ChangesMade = true;
		}
		
		editModeG1 = false;
		
		if(grid1ChangesMade) {
			$('#jqxgrid #grid_upload_button img').attr("src", "../images/upload_icon.png");
			$('#jqxgrid #grid_upload_button img').css("cursor", "pointer");
		}
		$('#jqxgrid #grid_add_button img').attr("src", "../images/add_icon.png");
		$('#jqxgrid #grid_add_button img').css("cursor", "pointer");
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
				$("#jqxgrid").jqxGrid('ensurerowvisible', $("#jqxgrid").jqxGrid('getselectedrowindex'));
				savedStateG1 = null;
			}
			else {
				$('#jqxgrid').jqxGrid('render');
			}
			
			ServiceComplete();
		}, 500);
	});
}