/*============================================================
	Property of:		MISOM TECHNOLOGIES
	Developer:			AARON MCCOLOUGH FT. JORGE MURILLO
	Application Name:	FARA_FRESNILLO
	Directory:			FARA_FRESNILLO/CONFIG/GEO_CONFIG/AREA_MACHINE/JS
	File Name:			jqxgrid_area.js
=============================================================*/

var areaGuid;
var areaName;
var grid1ChangesMade  = false;
var editModeG1        = false;
var savedStateG1;

function LoadAreasGrid(url) {
	$('#jqxgrid').jqxGrid('destroy');

	if($("#jqxgrid").length == 0) {
		$("#jqxWidget1").prepend('<div id="jqxgrid"></div>');
	}
	
	var source = {
		datatype: "json",
		datafields: [
			{ name: 'Area_GUID',	display: 'Area_GUID',	type: 'string' },
      { name: 'AreaName',	display: 'AreaName',	type: 'string' },
			{ name: 'DisplayName',	display: 'DisplayName',	type: 'string' }
		],
		url: url
	};
	
	var dataAdapter = new $.jqx.dataAdapter(source);	
	
	var deleteButton = function(row, columnfield, value, defaulthtml, columnproperties) {
		return '<div id="grid_cancel_button" style="cursor: pointer"><img style="width: 22px; height: 22px" src="../images/cancel_icon.png"/></div>';
	}
	
	var deleteButtonClick = function(rowIndex, rowId) {
		DisplayConfirm(languagePack.message.confirm,languagePack.message.confirmRecordDelete, function(){
			editrow = rowIndex;
			var rowObject = $('#jqxgrid').jqxGrid('getrowdata', rowIndex);
			RemoveAreaRow(rowObject, rowId);
		});
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
					newRow.Area_GUID = -1;
          										
					$("#jqxgrid").jqxGrid('addrow', null, newRow);
					$('#jqxgrid').jqxGrid('selectrow', $('#jqxgrid').jqxGrid('getrows').length - 1);
					$("#jqxgrid").jqxGrid('begincelledit', $('#jqxgrid').jqxGrid('getrows').length - 1, "AreaName");
				}
			});

			// update grid.
			updateButton.click(function (event) {
				if(!editModeG1 && !lockedForService) {
					LockForService();
					UpdateAreas2Grid();
					$('#jqxgrid #grid_upload_button img').attr("src", "../images/upload_inactive_icon.png");
					$('#jqxgrid #grid_upload_button img').css("cursor", "initial");
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
      { text: 'Area_GUID', datafield: 'Area_GUID', hidden: true, editable: false },
			{ text: languagePack.areaMachine.grid1.AreaDisplayName, datafield: 'AreaName', hidden: false, editable: true },
			{ text: 'Nombre Display', datafield: 'DisplayName', hidden: false, editable: true }
		],
	});
	
	/*===================================================
					Listener Events
	====================================================*/	
	
	$('#jqxgrid').on('rowselect', function (event) {
		if(grid1ChangesMade) {
			DisplayConfirm(languagePack.message.confirm, languagePack.message.unsavedChanges,
				function() {
					selectedGrid1Row = event.args.rowindex;
					
					areaName = $('#jqxgrid').jqxGrid('getcellvalue', selectedGrid1Row, "DisplayName");			
					areaGuid = $('#jqxgrid').jqxGrid('getcellvalue', selectedGrid1Row, "Area_GUID");
					
					savedStateG2 = null;
					grid1ChangesMade = false;
					editModeG1 = false;
					
					LoadMachinesGrid(ruIP + ruPort + planningDB + planningEN + "read/web/v_MachineAreaConfig?where=\"Area_GUID = '" + areaGuid + "' AND IsActive = '1'\"");
				}
			);
		}
		else {
			selectedGrid1Row = event.args.rowindex;
					
			areaName = $('#jqxgrid').jqxGrid('getcellvalue', selectedGrid1Row, "DisplayName");			
			areaGuid = $('#jqxgrid').jqxGrid('getcellvalue', selectedGrid1Row, "Area_GUID");
			
			savedStateG2 = null;
			grid1ChangesMade = false;
			editModeG1 = false;
			
			LoadMachinesGrid(ruIP + ruPort + planningDB + planningEN + "read/web/v_MachineAreaConfig?where=\"Area_GUID = '" + areaGuid + "' AND IsActive = '1'\"");			
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
			if(dataField == 'AreaName') {
				CheckForExistentMapping(value, rowBoundIndex);
			}
			if((dataField == 'AreaName' || dataField == 'DisplayName') && rowData.Area_GUID != -1) {
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