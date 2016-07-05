/*============================================================
	Property of:		MISOM TECHNOLOGIES
	Developer:			JORGE MURILLO & AARON MCCOLOUGH
	Application Name:	FARA_FRESNILLO
	Directory:			FARA_FRESNILLO/CONFIG/CHECKLISTS/JS
	File Name:			jqxgrid_types.js
=============================================================*/

var typeGuid;
var typeName;
var usageType;
var selectedGrid1Row = -1;
var grid1ChangesMade = false;
var editModeG1       = false;
var savedStateG1;
var lineupCL 				 = true;

function LoadTypesGrid(url) {
	$('#jqxgrid').jqxGrid('destroy');

	if($("#jqxgrid").length == 0) {
		$("#jqxWidget1").prepend('<div id="jqxgrid"></div>');
	}
	
	var source = {
		datatype: "json",
		datafields: [
			{ name: 'ChecklistType_GUID', 	display: 'ChecklistType_GUID',	type: 'string' },
			{ name: 'ChecklistType_Name', 	display: 'ChecklistType_Name',	type: 'string' },
			{ name: 'DisplayName',			display: 'DisplayName',			type: 'string' },
			{ name: 'UsageType', 			display: 'UsageType',			type: 'string' },
			{ name: 'Method',				display: 'Method',				type: 'string' },
			{ name: 'IsActive', 			display: 'IsActive', 			type: 'bool' },
			{ name: 'Created', 				display: 'Created', 			type: 'date' },
			{ name: 'Modified', 			display: 'Modified', 			type: 'date' }
		],
		url: url
	};
	
	var dataAdapter = new $.jqx.dataAdapter(source);
	
	var deleteButton = function(row, columnfield, value, defaulthtml, columnproperties) {
		return '<div id="grid_cancel_button" style="cursor: pointer"><img style="width: 22px; height: 22px" src="../images/cancel_icon.png"/></div>';
	}
	
	var deleteButtonClick = function(rowIndex, rowId) {
		DisplayConfirm(languagePack.message.confirm,languagePack.message.confirmRecordDelete,
			function() {
				editrow = rowIndex;
				var rowObject = $('#jqxgrid').jqxGrid('getrowdata', rowIndex);
				RemoveTypeRow(rowObject, rowId);
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
					$('#jqxgrid').jqxGrid('cleargroups');
					var newRow = {};
					newRow.ChecklistType_GUID   = -1;
					
					grid1ChangesMade = true;
					
					$("#jqxgrid").jqxGrid('addrow', null, newRow);
					$('#jqxgrid').jqxGrid('selectrow', $('#jqxgrid').jqxGrid('getrows').length - 1);
					$("#jqxgrid").jqxGrid('begincelledit', $('#jqxgrid').jqxGrid('getrows').length - 1, "DisplayName");
				}
			});

			// update grid.
			updateButton.click(function (event) {
				if(!editModeG1 && !lockedForService) {
					grid1ChangesMade = false;
					LockForService();
					UpdateTypeGrid();
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
			{ text: 'ChecklistType_GUID', datafield: 'ChecklistType_GUID', hidden: true, editable: false },
			{ text: languagePack.checklists.grid1.ChecklistTypes, datafield: 'DisplayName', editable: true},
			{ text: languagePack.checklists.grid1.UsageType, datafield: 'UsageType', editable: true },
			{ text: 'Method', datafield: 'Method', columntype: 'dropdownlist', createeditor: function (row, column, editor) {
					// assign a new data source to the dropdownlist.
					var list = methodNameList;
					editor.jqxDropDownList({ autoDropDownHeight: true, source: list });
				},
				validation: function (cell, value) {
					if(!value) {
						return { result: false, message: "You must select a Method." };
					}
					return true;
				}
			},
			{ text: 'Active', datafield: 'IsActive', editable: false, hidden: true },
			{ text: 'Created On', datafield: 'Created', editable: false, cellsformat: 'MM/dd/yyyy hh:mm tt', hidden: true },
			{ text: 'Modified On', datafield: 'Modified', editable: false, cellsformat: 'MM/dd/yyyy hh:mm tt', hidden: true },
			{ text: 'Delete', datafield: 'Delete', width: 60, editable: false, resizable: false, groupable: false, hidden: true, cellsrenderer: deleteButton }
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
		
		if(value != oldvalue) {
			if((dataField == 'DisplayName' || dataField == 'UsageType' || dataField == 'Method') && rowData.ChecklistType_GUID != -1) {
				rowData.RowModified = true;
			}
			if(dataField == 'Method') {
				rowData.Method_GUID = methodGUIDList[methodNameList.indexOf(value)];
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
	
	$('#jqxgrid').on('rowselect', function (event) {
		if(grid2ChangesMade) {
			DisplayConfirm(languagePack.message.confirm, languagePack.message.unsavedChanges,
				function() {
					if(!(editModeG1)) {
						selectedGrid1Row = event.args.rowindex;
						
						typeName = $('#jqxgrid').jqxGrid('getcellvalue', selectedGrid1Row, "ChecklistType_Name");
						typeGuid = $('#jqxgrid').jqxGrid('getcellvalue', selectedGrid1Row, "ChecklistType_GUID");
						usageType = $('#jqxgrid').jqxGrid('getcellvalue', selectedGrid1Row, "UsageType");
						
						lineupCL = (( usageType == "Lineup") ? false : true);
						
						savedStateG2 = null;
						grid2ChangesMade = false;
						editModeG1 = false;
						
						LoadQuestionsGrid(ruIP + ruPort + planningDB + planningEN + "read/web/v_ChecklistQuestion?where=\"ChecklistType_GUID = '" + typeGuid + "' AND IsActive = '1' ORDER BY Created ASC\"");
					}
				}
			);
		}
		else if(!(editModeG1)) {
			selectedGrid1Row = event.args.rowindex;
			
			typeName = $('#jqxgrid').jqxGrid('getcellvalue', selectedGrid1Row, "ChecklistType_Name");
			typeGuid = $('#jqxgrid').jqxGrid('getcellvalue', selectedGrid1Row, "ChecklistType_GUID");
			usageType = $('#jqxgrid').jqxGrid('getcellvalue', selectedGrid1Row, "UsageType");
			
			lineupCL = (( usageType == "Lineup") ? false : true);
			
			savedStateG2 = null;
			grid2ChangesMade = false;
			editModeG1 = false;
			
			LoadQuestionsGrid(ruIP + ruPort + planningDB + planningEN + "read/web/v_ChecklistQuestion?where=\"ChecklistType_GUID = '" + typeGuid + "' AND IsActive = '1' ORDER BY Created ASC\"");
		}
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
				setTimeout(function(){
					$('#jqxgrid').jqxGrid('selectrow', $('#jqxgrid').jqxGrid('getselectedrowindex'));
					savedStateG1 = null;
				},250);
			}
			else {
				$('#jqxgrid').jqxGrid('render');
				$('#jqxgrid').jqxGrid('selectrow', 0);
			}
			
			ServiceComplete();
		},500);
	});
}