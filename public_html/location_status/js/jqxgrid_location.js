/*============================================================
	Property of:		MISOM TECHNOLOGIES
	Developer:			AARON MCCOLOUGH FT. JORGE MURILLO
	Application Name:	FARA_FRESNILLO
	Directory:			FARA_FRESNILLO/LOCATION/JS
	File Name:			jqxgrid_location.js
=============================================================*/

var selectedGrid1Row	= -1;
var grid1ChangesMade	= false;
var editModeG1			= false;
var maxCodeValue		= -1;
var savedStateG1;

function LoadLocationGrid(url) {
	$('#jqxgrid').jqxGrid('destroy');

	if($("#jqxgrid").length == 0) {
		$("#jqxWidget").prepend('<div id="jqxgrid"></div>');
	}
	
	var source = {
		datatype: "json",
		datafields: [
			{ name: 'LocationCurrentStatus_GUID',	display: 'LocationCurrentStatus_GUID',	type: 'string' },
			{ name: 'Area_GUID',					display: 'Area_GUID',					type: 'string' },
			{ name: 'AreaDisplayName',				display: 'AreaDisplayName',				type: 'string' },
			{ name: 'Zone_GUID',					display: 'Zone_GUID',					type: 'string' },
			{ name: 'ZoneDisplayName',				display: 'ZoneDisplayName',				type: 'string' },
			{ name: 'Location_GUID',				display: 'Location_GUID',				type: 'string' },
			{ name: 'LocationDisplayName',			display: 'LocationDisplayName',			type: 'string' },
			{ name: 'LocationStatus_GUID',			display: 'LocationStatus_GUID',			type: 'string' },
			{ name: 'LocationStatusDisplayName',	display: 'LocationStatusDisplayName',	type: 'string' },
			{ name: 'AreaIsActive',					display: 'AreaIsActive',				type: 'bool' },
			{ name: 'ZoneIsActive',					display: 'ZoneIsActive',				type: 'bool' },
			{ name: 'LocationIsActive',				display: 'LocationIsActive',			type: 'bool' }
		],
		url: url
	};
	
	var dataAdapter = new $.jqx.dataAdapter(source);
	
	var deleteButton = function(row, columnfield, value, defaulthtml, columnproperties) {
		return '<div id="grid_cancel_button" style="cursor: pointer"><img style="width: 22px; height: 22px" src="../images/cancel_icon.png"/></div>';
	};
	
	var deleteButtonClick = function(rowIndex, rowId) {
		DisplayConfirm(languagePack.message.confirm,languagePack.message.confirmRecordDelete, function() {
			editrow = rowIndex;
			var rowObject = $('#jqxgrid').jqxGrid('getrowdata', rowIndex);
			RemoveLocationRow(rowObject, rowId);
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
			container.append(updateButton);	
			statusbar.append(container);
			updateButton.jqxButton({  width: 60, height: 20 });

			// update grid.
			updateButton.click(function (event) {
				if(!editModeG1 && !lockedForService) {
					LockForService();
					UpdateLocationGrid();
				}
			});
		},
		columnsresize: true,
		columnsreorder: true,
        editable: true,
		editmode: 'dblclick',
		sortable: true,
		showfilterrow: true,
        filterable: true,
		groupable: true,
		enabletooltips: true,
		columns: [
			{ datafield: '', text: '#', sortable: false, filterable: false, editable: false, groupable: false, draggable: false,
				resizable: false, columntype: 'number', width: 50, cellsrenderer: function (row, column, value) {
					return "<div style='margin:4px;'>" + (value + 1) + "</div>";
				}
			},
			{ datafield: 'LocationCurrentStatus_GUID',	text: 'LocationCurrentStatus_GUID',									hidden: true,	editable: false },
			{ datafield: 'Area_GUID',					text: 'Area_GUID',													hidden: true,	editable: false },
			{ datafield: 'AreaDisplayName',				text: languagePack.locationStatus.grid1.AreaDisplayName,			hidden: false,	editable: false, filtertype: 'checkedlist' },
			{ datafield: 'Zone_GUID',					text: 'Zone_GUID',													hidden: true,	editable: false },
			{ datafield: 'ZoneDisplayName',				text: languagePack.locationStatus.grid1.ZoneDisplayName,			hidden: false,	editable: false, filtertype: 'checkedlist' },
			{ datafield: 'Location_GUID',				text: 'Location_GUID',												hidden: true,	editable: false },
			{ datafield: 'LocationDisplayName',			text: languagePack.locationStatus.grid1.LocationDisplayName,		hidden: false,	editable: false },
			{ datafield: 'LocationStatus_GUID',			text: 'LocationStatus_GUID',										hidden: true,	editable: false },
			{ datafield: 'LocationStatusDisplayName',	text: languagePack.locationStatus.grid1.LocationStatusDisplayName,	hidden: false,	editable: true, filtertype: 'checkedlist', columntype: 'dropdownlist',
				createeditor: function (row, column, editor) {
					// assign a new data source to the dropdownlist.
					var list = StatusNameList;
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
						return { result: false, message: languagePack.locationStatus.invalidStatus };
					}
					return true;
				}
			},
			{ datafield: 'AreaIsActive',		text: 'AreaIsActive',		hidden: true, editable: false },
			{ datafield: 'ZoneIsActive',		text: 'ZoneIsActive',		hidden: true, editable: false },
			{ datafield: 'LocationIsActive',	text: 'LocationIsActive',	hidden: true, editable: false }
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
			if(dataField == 'LocationStatusDisplayName') {
				rowData.LocationStatus_GUID = StatusGUIDList[StatusNameList.indexOf(value)];
				rowData.RowModified = true;
			}
			
			grid1ChangesMade = true;
		}
		
		editModeG1 = false;
		
		if(grid1ChangesMade) {
			$('#jqxgrid #grid_upload_button img').attr("src", "../images/upload_icon.png");
			$('#jqxgrid #grid_upload_button img').css("cursor", "pointer");
		}
	});
	
	$('#jqxgrid').on('rowselect', function (event) {
		
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
				$('#jqxgrid').jqxGrid('selectrow', 0);
			}
			
			ServiceComplete();
			
		}, 500);
	});
}