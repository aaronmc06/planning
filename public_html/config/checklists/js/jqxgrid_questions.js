/*============================================================
	Property of:		MISOM TECHNOLOGIES
	Developer:			JORGE MURILLO & AARON MCCOLOUGH
	Application Name:	FARA_FRESNILLO
	Directory:			FARA_FRESNILLO/CONFIG/CHECKLISTS/JS
	File Name:			jqxgrid_questions.js
=============================================================*/

var grid2ChangesMade = false;
var editModeG2       = false;
var currentEditCell  = [];
var savedStateG2;

function LoadQuestionsGrid(url) {
	$('#jqxgrid2').jqxGrid('destroy');

	if($("#jqxgrid2").length == 0) {
		$("#jqxWidget2").prepend('<div id="jqxgrid2"></div>');
	}
	
	var source = {
		datatype: "json",
		datafields: [
			{ name: 'ChecklistQuestion_GUID',	display: 'ChecklistQuestion_GUID',	type: 'string' },
			{ name: 'ChecklistType_GUID',		display: 'ChecklistType_GUID',		type: 'string' },
			{ name: 'Question_Name',			display: 'Question_Name',			type: 'string' },
			{ name: 'ChecklistGroup_GUID',		display: 'ChecklistGroup_GUID',		type: 'string' },
			{ name: 'ChecklistGroupName',		display: 'ChecklistGroupName',		type: 'string' },
			{ name: 'InputType_1',				display: 'InputType_1',				type: 'string' },
			{ name: 'InputType_2',				display: 'InputType_2',				type: 'string' },
			{ name: 'InputType_3',				display: 'InputType_3',				type: 'string' },
			{ name: 'MachineType_GUID',			display: 'MachineType_GUID',		type: 'string' },
			{ name: 'MachineTypeDisplayName',	display: 'MachineTypeDisplayName',	type: 'string' },
			{ name: 'IsManadatory',				display: 'IsManadatory',			type: 'bool' },
			{ name: 'IsCommentReqd',			display: 'IsCommentReqd',			type: 'bool' },
			{ name: 'IsActive',					display: 'IsActive',				type: 'bool' },
			{ name: 'Created',					display: 'Created',					type: 'datetime' },
			{ name: 'Modified',					display: 'Modified',				type: 'datetime' }
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
				var rowObject = $('#jqxgrid2').jqxGrid('getrowdata', rowIndex);
				RemoveQuestionRow(rowObject, rowId);
			}
		);
	}

	// Create jqxgrid2
	$("#jqxgrid2").jqxGrid({
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
				if(!editModeG2 && !lockedForService) {
					$('#jqxgrid2').jqxGrid('cleargroups');
					var newRow = {};
					newRow.ChecklistQuestion_GUID   = -1;
					newRow.ChecklistType_Name = typeName;
					newRow.ChecklistType_GUID = typeGuid;
					newRow.IsMandatory        = false;
					newRow.IsCommentReqd      = false;
					
					grid2ChangesMade = true;
					
					$("#jqxgrid2").jqxGrid('addrow', null, newRow);
					$('#jqxgrid2').jqxGrid('selectrow', $('#jqxgrid2').jqxGrid('getrows').length - 1);
					$("#jqxgrid2").jqxGrid('begincelledit', $('#jqxgrid2').jqxGrid('getrows').length - 1, "Question_Name");
				}
			});

			// update grid.
			updateButton.click(function (event) {
				if(!editModeG2 && !lockedForService) {	
					grid2ChangesMade = false;
					LockForService();
					UpdateQuestionGrid();
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
				resizable: false, datafield: '', columntype: 'number', width: 45, cellsrenderer: function (row, column, value) {
					return "<div style='margin:4px;'>" + (value + 1) + "</div>";
				}
			},
			{ text: 'ChecklistQuestion_GUID', datafield: 'ChecklistQuestion_GUID', hidden: true, editable: false },
			{ text: languagePack.checklists.grid2.QuestionName, datafield: 'Question_Name', editable: true },
			{ text: 'ChecklistType_GUID', datafield: 'ChecklistType_GUID', hidden: true, editable: false },
			{ text: 'ChecklistGroup_GUID', datafield: 'ChecklistGroup_GUID', hidden: true, editable: false },
			{ text: languagePack.checklists.grid2.Group	, datafield: 'ChecklistGroupName', editable: true, columntype: 'dropdownlist', width: 170, createeditor: function (row, column, editor) {
					// assign a new data source to the dropdownlist.
					var list = groupNameList;
					editor.jqxDropDownList({ autoDropDownHeight: true, source: list, placeHolder: "" });
				},
				// update the editor's value before saving it.
				cellvaluechanging: function (row, column, columntype, oldvalue, newvalue) {
					// return the old value, if the new value is empty.
					if (newvalue == "") return oldvalue;
				}
			},
			{ text: languagePack.checklists.grid2.InputType1, datafield: 'InputType_1', editable: true, columntype: 'dropdownlist', width: 110, createeditor: function (row, column, editor) {
					// assign a new data source to the dropdownlist.
					var list = inputTypeList;
					editor.jqxDropDownList({ autoDropDownHeight: true, source: list, placeHolder: "" });
				},
				// update the editor's value before saving it.
				cellvaluechanging: function (row, column, columntype, oldvalue, newvalue) {
					// return the old value, if the new value is empty.
					if (newvalue == "") return oldvalue;
				}
			},
			{ text: languagePack.checklists.grid2.InputType2, datafield: 'InputType_2', editable: true, columntype: 'dropdownlist', width: 110, createeditor: function (row, column, editor) {
					// assign a new data source to the dropdownlist.
					var list = inputTypeList;
					editor.jqxDropDownList({ autoDropDownHeight: true, source: list, placeHolder: "" });
				},
				// update the editor's value before saving it.
				cellvaluechanging: function (row, column, columntype, oldvalue, newvalue) {
					// return the old value, if the new value is empty.
					if (newvalue == "") return oldvalue;
				}
			},
			{ text: languagePack.checklists.grid2.InputType3, datafield: 'InputType_3', hidden: lineupCL, editable: true, columntype: 'dropdownlist', width: 110, createeditor: function (row, column, editor) {
					// assign a new data source to the dropdownlist.
					var list = inputTypeList;
					editor.jqxDropDownList({ autoDropDownHeight: true, source: list, placeHolder: "" });
				},
				// update the editor's value before saving it.
				cellvaluechanging: function (row, column, columntype, oldvalue, newvalue) {
					// return the old value, if the new value is empty.
					if (newvalue == "") return oldvalue;
				}
			},
			{ text: 'MachineType_GUID', datafield: 'MachineType_GUID', hidden: true, editable: false },
			{ text: languagePack.checklists.grid2.MachineDisplayName, datafield: 'MachineTypeDisplayName', hidden: lineupCL, editable: true, columntype: 'dropdownlist', width: 110, createeditor: function (row, column, editor) {
					// assign a new data source to the dropdownlist.
					var list = machineNameList;
					editor.jqxDropDownList({ autoDropDownHeight: true, source: list, placeHolder: "" });
				},
				// update the editor's value before saving it.
				cellvaluechanging: function (row, column, columntype, oldvalue, newvalue) {
					// return the old value, if the new value is empty.
					if (newvalue == "") return oldvalue;
				}
			},
			{ text: languagePack.checklists.grid2.CommentsRequired, datafield: 'IsCommentReqd', columntype: 'checkbox', width: 75},
			{ text: languagePack.checklists.grid2.IsMandatory, datafield: 'IsManadatory', columntype: 'checkbox', width: 65},
			{ text: 'Active', datafield: 'IsActive', editable: false, hidden: true },
			{ text: 'Created On', datafield: 'Created', editable: false, cellsformat: 'MM/dd/yyyy hh:mm tt', hidden: true },
			{ text: 'Modified On', datafield: 'Modified', editable: false, cellsformat: 'MM/dd/yyyy hh:mm tt', hidden: true },
			{ text: languagePack.common.del, datafield: 'Delete', width: 50, editable: false, resizable: false, groupable: false, cellsrenderer: deleteButton }
		],
	});
	
	/*===================================================
					Listener Events
	====================================================*/
	
	$("#jqxgrid2").on("cellclick", function (event) {
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
			$('#jqxgrid2').jqxGrid('clearselection');
			deleteButtonClick(rowBoundIndex, $('#jqxgrid2').jqxGrid('getrowid', rowBoundIndex));
		}
	}); 
	
	$("#jqxgrid2").on('cellbeginedit', function (event) {
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
		editModeG2 = true;
		currentEditCell.push(dataField);
		$('#jqxgrid2 #grid_upload_button img').attr("src", "../images/upload_inactive_icon.png");
		$('#jqxgrid2 #grid_upload_button img').css("cursor", "initial");
		$('#jqxgrid2 #grid_add_button img').attr("src", "../images/add_inactive_icon.png");			
		$('#jqxgrid2 #grid_add_button img').css("cursor", "initial");
	});
	
	$("#jqxgrid2").on('cellendedit', function (event) {
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
		var datarow = $("#jqxgrid2").jqxGrid('getrowdata', rowBoundIndex);

		if(value != oldvalue) {
			if(dataField == 'ChecklistGroupName') {
				datarow.ChecklistGroup_GUID = groupGUIDList[groupNameList.indexOf(value)];
			}
			if(dataField == 'MachineTypeDisplayName') {
				datarow.MachineType_GUID = machineGUIDList[machineNameList.indexOf(value)];
			}
			if(dataField == 'IsCommentReqd' || dataField == 'IsManadatory') {
				for(var key in currentEditCell) {
					$("#jqxgrid2").jqxGrid('endcelledit', rowBoundIndex, currentEditCell[key], false);
				}
				currentEditCell = [];
			}
			else {
				currentEditCell = [];
			}
			if((dataField == 'Question_Name' || dataField == 'InputType_1' || dataField == 'InputType_2' || dataField == 'ChecklistGroupName' || dataField == 'IsCommentReqd' || dataField == 'IsManadatory' || dataField == 'MachineTypeDisplayName') && datarow.ChecklistQuestion_GUID != -1) {
				datarow.RowModified = true;
			}
			grid2ChangesMade = true;
		}
		
		editModeG2 = false;
		
		if(grid2ChangesMade) {
			$('#jqxgrid2 #grid_upload_button img').attr("src", "../images/upload_icon.png");
			$('#jqxgrid2 #grid_upload_button img').css("cursor", "pointer");
		}
		
		$('#jqxgrid2 #grid_add_button img').attr("src", "../images/add_icon.png");
		$('#jqxgrid2 #grid_add_button img').css("cursor", "pointer");
	});
	
	$("#jqxgrid2").on("pagesizechanged", function (event) {
	    // event arguments.
	    var args = event.args;
	    // page number.
	    var pagenum = args.pagenum;
	    // old page size.
	    var oldpagesize = args.oldpagesize;
	    // new page size.
	    var pagesize = args.pagesize;
	   
	    $('#jqxgrid2').jqxGrid('render');
	});
	
	$("#jqxgrid2").on("bindingcomplete", function (event) {
		setTimeout(function(){
			
			if(savedStateG2) {
				$("#jqxgrid2").jqxGrid('loadstate', savedStateG2);
				$("#jqxgrid2").jqxGrid('ensurerowvisible', $("#jqxgrid2").jqxGrid('getselectedrowindex'));
				savedStateG2 = null;
			}
			else {
				$('#jqxgrid2').jqxGrid('render');
			}
			
			ServiceComplete();
		}, 500);
	});
}