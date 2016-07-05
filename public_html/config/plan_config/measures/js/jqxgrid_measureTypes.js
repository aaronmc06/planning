/*============================================================
	Property of:		MISOM TECHNOLOGIES
	Developer:			AARON MCCOLOUGH FT. JORGE MURILLO
	Application Name:	FARA_FRESNILLO
	Directory:			FARA_FRESNILLO/CONFIG/PLAN_CONFIG/MEASURES/JS
	File Name:			jqxgrid_steps.js
=============================================================*/

var grid2ChangesMade = false;
var editModeG2 = false;
var savedStateG2;
var measureTypeGuid;
var measureTypeName;

function LoadMeasureTypesGrid(url) {
	$('#jqxgrid2').jqxGrid('destroy');

	if($("#jqxgrid2").length == 0) {
		$("#jqxWidget2").prepend('<div id="jqxgrid2"></div>');
	}
	
	var source = {
		datatype: "json",
		datafields: [
			{ name: 'MeasureType_GUID', display: 'MeasureType_GUID', type: 'string' },
			{ name: 'MeasureTypeName', display: 'MeasureTypeName', type: 'string' },
			{ name: 'DisplayName', display: 'DisplayName', type: 'string' },
			{ name: 'Description', display: 'Description', type: 'string' },
			{ name: 'IsActive', display: 'IsActive', type: 'bool' },
			{ name: 'Created', display: 'Created', type: 'date' },
			{ name: 'Modified', display: 'Modified', type: 'date' }
		],
		url: url
	};
	
	var dataAdapter = new $.jqx.dataAdapter(source);
	
	var deleteButton = function(row, columnfield, value, defaulthtml, columnproperties) {
		return '<div id="grid_cancel_button" style="cursor: pointer"><img style="width: 22px; height: 22px" src="../images/cancel_icon.png"/></div>';
	}
	
	var deleteButtonClick = function(rowIndex, rowId) {
		DisplayConfirm("Confirmar","Esta seguro que desea eliminar este registro?", function(){
			editrow = rowIndex;
			var rowObject = $('#jqxgrid2').jqxGrid('getrowdata', rowIndex);
			RemoveMeasureTypeRow(rowObject, rowId);
		});
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
					newRow.MeasureType_GUID   = -1;
					
					$("#jqxgrid2").jqxGrid('addrow', null, newRow);
					$('#jqxgrid2').jqxGrid('selectrow', $('#jqxgrid2').jqxGrid('getrows').length - 1);
					$("#jqxgrid2").jqxGrid('begincelledit', $('#jqxgrid2').jqxGrid('getrows').length - 1, "MeasureTypeName");
				}
			});

			// update grid.
			updateButton.click(function (event) {
				if(!editModeG2 && !lockedForService) {
					LockForService();
					UpdateMeasureTypeGrid();
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
			{ text: 'MeasureType_GUID', datafield: 'MeasureType_GUID', hidden: true, editable: false },
			{ text: 'Tipo de Medida', datafield: 'MeasureTypeName', editable: true },
			{ text: 'Nombre Display', datafield: 'DisplayName', editable: true },
			{ text: 'Descripci&oacute;n', datafield: 'Description', editable: true },
			{ text: 'Active', datafield: 'IsActive', editable: false, hidden: true },
			{ text: 'Created On', datafield: 'Created', editable: false, cellsformat: 'MM/dd/yyyy hh:mm tt', hidden: true },
			{ text: 'Modified On', datafield: 'Modified', editable: false, cellsformat: 'MM/dd/yyyy hh:mm tt', hidden: true },
			{ text: 'Borrar', datafield: 'Delete', width: 60, editable: false, resizable: false, groupable: false, cellsrenderer: deleteButton }
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
		var rowData = args.row;
		
		if(value != oldvalue) {
			if((dataField == 'MeasureTypeName' || dataField == 'DisplayName' || dataField == 'Description') && rowData.MeasureType_GUID != -1) {
				rowData.RowModified = true;
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
	
	$('#jqxgrid2').on('rowselect', function (event) {
		if(grid1ChangesMade) {
			DisplayConfirm("Confirm", "You have unsaved changes, do you want to continue without saving?",
				function() {
					if(!(editModeG2)) {
						selectedGrid2Row = event.args.rowindex;
						
						measureTypeName = $('#jqxgrid2').jqxGrid('getcellvalue', selectedGrid2Row, "DisplayName");
						measureTypeGuid = $('#jqxgrid2').jqxGrid('getcellvalue', selectedGrid2Row, "MeasureType_GUID");
						
						savedStateG1 = null;
						grid1ChangesMade = false;
						editModeG1 = false;
						
						LoadMeasuresGrid(ruIP + ruPort + planningDB + planningEN + "read/dbo/v_MeasureTypeConfig?where=\"MeasureType_GUID = '"+measureTypeGuid+"' AND Measure_IsActive = '1' ORDER BY Created ASC\"");
					}
				}
			);
		}
		else if(!(editModeG2)) {
			selectedGrid2Row = event.args.rowindex;
			
			measureTypeName = $('#jqxgrid2').jqxGrid('getcellvalue', selectedGrid2Row, "DisplayName");
			measureTypeGuid = $('#jqxgrid2').jqxGrid('getcellvalue', selectedGrid2Row, "MeasureType_GUID");
			
			savedStateG1 = null;
			grid1ChangesMade = false;
			editModeG1 = false;
			
			LoadMeasuresGrid(ruIP + ruPort + planningDB + planningEN + "read/dbo/v_MeasureTypeConfig?where=\"MeasureType_GUID = '"+measureTypeGuid+"' AND Measure_IsActive = '1' ORDER BY Created ASC\"");
		}
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
				setTimeout(function(){
					$('#jqxgrid2').jqxGrid('selectrow', $('#jqxgrid2').jqxGrid('getselectedrowindex'));
					savedStateG2 = null;
				},250);
			}
			else {
				$('#jqxgrid2').jqxGrid('render');
				$('#jqxgrid2').jqxGrid('selectrow', 0);
			}
			
			ServiceComplete();
		}, 500);
	});
}