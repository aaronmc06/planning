/*============================================================
	Property of:		MISOM TECHNOLOGIES
	Developer:			AARON MCCOLOUGH
	Application Name:	FARA_FRESNILLO
	Directory:			FARA_FRESNILLO/CONFIG/GEO_CONFIG/ZONES
	File Name:			jqxgrid_zones.js
=============================================================*/

var zoneGuid;
var zone;
var selectedGrid1Row = -1;
var grid1ChangesMade = false;
var savedStateG1;

var editModeG1 = false;

function LoadZonesGrid(url) {
	$('#jqxgrid').jqxGrid('destroy');

	if($("#jqxgrid").length == 0) {
		$("#jqxWidget1").prepend('<div id="jqxgrid"></div>');
	}
	
	var source = {
		datatype: "json",
		datafields: [
			{ name: 'Zone_GUID',		display: 'Zone_GUID',		type: 'string' },
			{ name: 'ZoneName',			display: 'ZoneName',		type: 'string' },
			{ name: 'DisplayName',		display: 'DisplayName',		type: 'string' },
			{ name: 'Area_GUID',		display: 'Area_GUID',		type: 'string' },
			{ name: 'AreaDisplayName',	display: 'AreaDisplayName',	type: 'string' },
			{ name: 'IsActive',			display: 'IsActive',		type: 'int' },			
			{ name: 'Area_IsActive',	display: 'Area_IsActive',	type: 'int' }
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
				RemoveZoneRow(rowObject, rowId);
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
					newRow.Zone_GUID = -1;
					
					$("#jqxgrid").jqxGrid('addrow', null, newRow);
					$('#jqxgrid').jqxGrid('selectrow', $('#jqxgrid').jqxGrid('getrows').length - 1);
					$("#jqxgrid").jqxGrid('begincelledit', $('#jqxgrid').jqxGrid('getrows').length - 1, "ZoneName");
				}
			});

			// update grid.
			updateButton.click(function (event) {
				if(grid2ChangesMade) {
					DisplayConfirm(languagePack.message.confirm, languagePack.message.unsavedChanges,
						function() {
							if(!editModeG1 && !lockedForService) {
								LockForService();
								UpdateZonesGrid();
								grid1ChangesMade = false;
							}
						}
					);
				}
				else if(!editModeG1 && !lockedForService) {
					LockForService();
					UpdateZonesGrid();
					grid1ChangesMade = false;
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
			{ text: 'Zone_GUID', datafield: 'Zone_GUID', hidden: true, editable: false },
			{ text: languagePack.zones.grid1.ZoneName, datafield: 'ZoneName', hidden: false, editable: true },
			{ text: languagePack.zones.grid1.DisplayName, datafield: 'DisplayName', hidden: false, editable: true },
			{ text: 'Area_GUID', datafield: 'Area_GUID', hidden: true, editable: false },
			{ text: languagePack.zones.grid1.AreaDisplayName, datafield: 'AreaDisplayName', hidden: false, editable: true, columntype: 'dropdownlist', createeditor: function (row, column, editor) {
					// assign a new data source to the dropdownlist.
					var list = areaList;
					editor.jqxDropDownList({ autoDropDownHeight: true, source: list });
				},
				// update the editor's value before saving it.
				cellvaluechanging: function (row, column, columntype, oldvalue, newvalue) {
					// return the old value, if the new value is empty.
					if (newvalue == "") return oldvalue;
				},
				validation: function (cell, value) {
					if(!value) {
						return { result: false, message: languagePack.zones.invalidArea };
					}
					return true;
				}
			},
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
			if(dataField == 'ZoneName') {
				$("#jqxgrid").jqxGrid('setcellvalue', rowBoundIndex, "DisplayName", value);
			}
			if(dataField == 'AreaDisplayName') {
				 rowData.Area_GUID = areaGuidList[areaList.indexOf(value)];
			}
			if((dataField == 'ZoneName' || dataField == 'DisplayName' || dataField == 'AreaDisplayName') && rowData.Zone_GUID != -1) {
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
	
	$('#jqxgrid').on('rowselect', function (event) {
		if(grid2ChangesMade) {
			DisplayConfirm(languagePack.message.confirm, languagePack.message.unsavedChanges,
				function() {
					if(!(editModeG1)) {
						selectedGrid1Row = event.args.rowindex;
						
						zone     = $('#jqxgrid').jqxGrid('getcellvalue', selectedGrid1Row, "ZoneName");			
						zoneGuid = $('#jqxgrid').jqxGrid('getcellvalue', selectedGrid1Row, "Zone_GUID");
						areaGuid = $('#jqxgrid').jqxGrid('getcellvalue', selectedGrid1Row, "Area_GUID");
			
						savedStateG2 = null;
						
						LoadLocations(areaGuid);
						
						grid2ChangesMade = false;
						editModeG2 = false;
					}
				}
			);
		}
		else if(!(editModeG1)) {
			selectedGrid1Row = event.args.rowindex;
			
			zone     = $('#jqxgrid').jqxGrid('getcellvalue', selectedGrid1Row, "ZoneName");			
			zoneGuid = $('#jqxgrid').jqxGrid('getcellvalue', selectedGrid1Row, "Zone_GUID");
			areaGuid = $('#jqxgrid').jqxGrid('getcellvalue', selectedGrid1Row, "Area_GUID");
			
			savedStateG2 = null;
			
			LoadLocations(areaGuid);
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