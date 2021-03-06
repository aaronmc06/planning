/*============================================================
	Property of:		MISOM TECHNOLOGIES
	Developer:			AARON MCCOLOUGH FT. JORGE MURILLO
	Application Name:	FARA_FRESNILLO
	Directory:			FARA_FRESNILLO/CONFIG/PLAN_CONFIG/STEP_MEASURE/JS
	File Name:			jqxgrid_measures.js
=============================================================*/

var grid2ChangesMade = false;
var editModeG2 = false;
var savedStateG2;

function LoadMeasuresGrid(url) {
	$('#jqxgrid2').jqxGrid('destroy');

	if($("#jqxgrid2").length == 0) {
		$("#jqxWidget2").prepend('<div id="jqxgrid2"></div>');
	}
	
	var source = {
		datatype: "json",
		datafields: [
			{ name: 'Step_Measure_GUID',	display: 'Step_Measure_GUID', 		type: 'string' },
			{ name: 'Step_GUID',			display: 'Step_GUID',				type: 'string' },
			{ name: 'Method_GUID',			display: 'Method_GUID',				type: 'string' },
			{ name: 'StepDisplayName',		display: 'StepDisplayName',			type: 'string' },
			{ name: 'MeasureCategoryDisplayName',	display: 'MeasureCategoryDisplayName',		type: 'string' },
			{ name: 'MeasureDisplayName',	display: 'MeasureDisplayName',		type: 'string' },
			{ name: 'StepMeasure_IsActive',	display: 'StepMeasure_IsActive',	type: 'bool' }
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
				RemoveMeasureRow(rowObject, rowId);
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
					newRow.Step_Measure_GUID = -1;
					newRow.StepDisplayName 	= stepName;
					newRow.Step_GUID 		= stepGuid;
					
					grid2ChangesMade = true;
					
					$("#jqxgrid2").jqxGrid('addrow', null, newRow);
					$('#jqxgrid2').jqxGrid('selectrow', $('#jqxgrid2').jqxGrid('getrows').length - 1);
					$("#jqxgrid2").jqxGrid('begincelledit', $('#jqxgrid2').jqxGrid('getrows').length - 1, "MeasureDisplayName");
				}
			});

			// update grid.
			updateButton.click(function (event) {
				if(!editModeG2 && !lockedForService) {
					grid2ChangesMade = false;
					LockForService();
					UpdateMeasureGrid();
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
			{ text: 'Step_Measure_GUID', datafield: 'Step_Measure_GUID', hidden: true, editable: false },
			{ text: 'Step_GUID', datafield: 'Step_GUID', hidden: true, editable: false },
			{ text: 'Actividad', datafield: 'StepDisplayName', editable: false },
			{ text: 'Measure_GUID', datafield: 'Measure_GUID', hidden: true, editable: false },
			{ text: 'MeasureCategoryDisplayName', datafield: 'MeasureCategoryDisplayName', editable: false },
			{ text: 'Medida', datafield: 'MeasureDisplayName', editable: true,  columntype: 'dropdownlist',
				createeditor: function (row, column, editor) {
					// assign a new data source to the dropdownlist.
					var list = MeasureNameList;
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
					if (newvalue == ""){
						return oldvalue;
					}
				},
				validation: function (cell, value) {
					if(!value) {
						return { result: false, message: "Debes seleccionar una medida." };
					}
					return true;
				}
			},
			{ text: 'Active', datafield: 'StepMeasure_IsActive', editable: false, hidden: true },
			{ text: languagePack.common.del, datafield: 'Delete', width: 60, editable: false, resizable: false, groupable: false, cellsrenderer: deleteButton }
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
			if(dataField == 'MeasureDisplayName') {
				rowData.Measure_GUID = MeasureGUIDList[MeasureNameList.indexOf(value)];
			}
			if((dataField == 'MeasureDisplayName') && rowData.Step_Measure_GUID != -1) {
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