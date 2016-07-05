/*============================================================
	Property of:		MISOM TECHNOLOGIES
	Developer:			AARON MCCOLOUGH
	Application Name:	FARA_FRESNILLO
	Directory:			FARA_FRESNILLO/MENU/ITEM_LIST/JS
	File Name:			jqxgrid_item_list.js
=============================================================*/

var measureGuid;
var measureName;
var selectedGrid1Row = -1;
var grid1ChangesMade = false;
var savedStateG1;

var editModeG1 = false;

function LoadItemListGrid(url) {
	$('#jqxgrid').jqxGrid('destroy');

	if($("#jqxgrid").length == 0) {
		$("#jqxWidget1").prepend('<div id="jqxgrid"></div>');
	}
	
	var source = {
		datatype: "json",
		datafields: [
			{ name: 'MenuItemGUID', display: 'MenuItemGUID', type: 'string' },
			{ name: 'MenuGroupId', display: 'MenuGroupId', type: 'int' },
			{ name: 'MenuItemName', display: 'MenuItemName', type: 'string' },
			{ name: 'DisplayName', display: 'DisplayName', type: 'string' },
			{ name: 'SpanishName', display: 'SpanishName', type: 'string' },
			{ name: 'RoleGUID', display: 'RoleGUID', type: 'string' },
			{ name: 'RoleDisplayName', display: 'RoleDisplayName', type: 'string' },
			{ name: 'ParentMenuItemId', display: 'ParentMenuItemId', type: 'int'},
			{ name: 'MenuItemURL', display: 'MenuItemURL', type: 'string' },
			{ name: 'Ordinal', display: 'Ordinal', type: 'int'}
		],
		url: url
	};
	
	var dataAdapter = new $.jqx.dataAdapter(source);
	
	var deleteButton = function(row, columnfield, value, defaulthtml, columnproperties) {
		return '<div id="grid_cancel_button" style="cursor: pointer"><img style="width: 22px; height: 22px" src="../images/cancel_icon.png"/></div>';
	};
	
	var deleteButtonClick = function(rowIndex, rowId) {
		DisplayConfirm("Confirm","Are you sure you want to delete this menu item?", function(){
			editrow = rowIndex;
			var rowObject = $('#jqxgrid').jqxGrid('getrowdata', rowIndex);
			RemoveItemListRow(rowObject, rowId);
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
					newRow.MenuItemGUID   = -1;
					
					grid1ChangesMade = true;
					
					$("#jqxgrid").jqxGrid('addrow', null, newRow);
					$('#jqxgrid').jqxGrid('selectrow', $('#jqxgrid').jqxGrid('getrows').length - 1);
					$("#jqxgrid").jqxGrid('begincelledit', $('#jqxgrid').jqxGrid('getrows').length - 1, "MenuItemName");
				}
			});

			// update grid.
			updateButton.click(function (event) {
				if(!editModeG1 && !lockedForService) {
					grid1ChangesMade = false;
					LockForService();
					UpdateItemListGrid();
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
			{ text: 'MenuItemGUID', datafield: 'MenuItemGUID', hidden: true, editable: false },
			{ text: 'MenuGroupId', datafield: 'MenuGroupId', hidden: false, editable: true },
			{ text: 'MenuItemName', datafield: 'MenuItemName', hidden: false, editable: true },
			{ text: 'DisplayName', datafield: 'DisplayName', hidden: false, editable: true },
			{ text: 'SpanishName', datafield: 'SpanishName', hidden: false, editable: true },
			{ text: 'RoleGUID', datafield: 'RoleGUID', hidden: true, editable: false },
			{ text: 'RoleDisplayName', datafield: 'RoleDisplayName', editable: true, width: 200, columntype: 'dropdownlist',
				createeditor: function (row, column, editor) {
					// assign a new data source to the dropdownlist.
					var list = RoleList;
					editor.jqxDropDownList({ autoDropDownHeight: true, source: list });
				},
				// update the editor's value before saving it.
				cellvaluechanging: function (row, column, columntype, oldvalue, newvalue) {
					// return the old value, if the new value is empty.
					if (newvalue == ""){
						return oldvalue;
					}
				}
			},
			{ text: 'ParentMenuItemId', datafield: 'ParentMenuItemId', hidden: false, editable: true },
			{ text: 'MenuItemURL', datafield: 'MenuItemURL', hidden: false, editable: true },
			{ text: 'Ordinal', datafield: 'Ordinal', hidden: false, editable: true },
			{ text: 'Borrar', datafield: 'Delete', width: 60, editable: false, resizable: false, groupable: false, cellsrenderer: deleteButton }
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
		//var rowData = args.row;
		var rowData = $("#jqxgrid").jqxGrid('getrowdata', rowBoundIndex);
		
		if(value != oldvalue) {
			if(dataField == 'RoleDisplayName') {
				rowData.RoleGUID = RoleGUIDList[RoleList.indexOf(value)];
			}
			if((dataField == 'MenuGroupId' || dataField == 'MenuItemName' || dataField == 'DisplayName' ||dataField == 'SpanishName' || dataField == 'RoleDisplayName' || dataField == 'ParentMenuItemId' || dataField == 'MenuItemURL' || dataField == 'Ordinal') && rowData.MenuItemGUID != -1) {
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
				savedStateG1 = null;
			}
			else {
				$('#jqxgrid').jqxGrid('render');
				$('#jqxgrid').jqxGrid('selectrow', 0);
			}
			
			ServiceComplete();
		},500);
	});
}