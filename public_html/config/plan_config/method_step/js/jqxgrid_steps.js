/*============================================================
	Property of:		MISOM TECHNOLOGIES
	Developer:			AARON MCCOLOUGH FT. JORGE MURILLO
	Application Name:	FARA_FRESNILLO
	Directory:			FARA_FRESNILLO/CONFIG/PLAN_CONFIG/METHOD_STEP/JS
	File Name:			jqxgrid_steps.js
=============================================================*/

var grid2ChangesMade = false;
var editModeG2 = false;
var savedStateG2;

function LoadStepsGrid(url) {
	$('#jqxgrid2').jqxGrid('destroy');

	if($("#jqxgrid2").length == 0) {
		$("#jqxWidget2").prepend('<div id="jqxgrid2"></div>');
	}
	
	var source = {
		datatype: "json",
		datafields: [
			{ name: 'Step_GUID',			display: 'Step_GUID',			type: 'string' },
			{ name: 'Method_GUID',			display: 'Method_GUID',			type: 'string' },
			{ name: 'StepDisplayName',		display: 'StepDisplayName',		type: 'string' },
			{ name: 'MethodDisplayName',	display: 'MethodDisplayName',	type: 'string' },
			{ name: 'StepOrdinal',			display: 'StepOrdinal',			type: 'int' },
			{ name: 'IsLineup',				display: 'IsLineup',			type: 'bool' },
			{ name: 'Step_IsActive',		display: 'Step_IsActive',		type: 'bool' }
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
				RemoveStepRow(rowObject, rowId);
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
					newRow.Step_GUID   = -1;
					newRow.StepOrdinal = $('#jqxgrid2').jqxGrid('getrows').length + 1;
					newRow.MethodDisplayName = methodName;
					newRow.Method_GUID = methodGuid;
					newRow.IsLineup    = false;
					
					grid2ChangesMade = true;
					
					$("#jqxgrid2").jqxGrid('addrow', null, newRow);
					$('#jqxgrid2').jqxGrid('selectrow', $('#jqxgrid2').jqxGrid('getrows').length - 1);
					$("#jqxgrid2").jqxGrid('begincelledit', $('#jqxgrid2').jqxGrid('getrows').length - 1, "StepDisplayName");
				}
			});
			
			// update grid.
			updateButton.click(function (event) {
				if(!editModeG2 && !lockedForService) {
					grid2ChangesMade = false;
					UpdateStepGrid();
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
			{ text: languagePack.methodStep.grid2.StepOrdinal, datafield: 'StepOrdinal', editable: true, width: 60,
				validation: function(cell, value) {
					if(value <= 0 || value > $("#jqxgrid2").jqxGrid('getrows').length) {
						return {
							result: false, message: languagePack.methodStep.invalidOrden + " " + $("#jqxgrid2").jqxGrid('getrows').length
						};
					}
					else {
						return true;
					}
				}
			},
			{ text: 'Method_GUID', datafield: 'Method_GUID', hidden: true, editable: false },
			{ text: languagePack.methodStep.grid2.MethodDisplayName, datafield: 'MethodDisplayName', editable: false },
			{ text: 'Step_GUID', datafield: 'Step_GUID', hidden: true, editable: false },
			{ text: languagePack.methodStep.grid2.StepDisplayName, datafield: 'StepDisplayName', editable: true },
			{ text: languagePack.methodStep.grid2.IsLineup, datafield: 'IsLineup', columntype: 'checkbox', width: 75},
			{ text: 'Active', datafield: 'Step_IsActive', editable: false, hidden: true },
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
		var rowData = $("#jqxgrid2").jqxGrid('getrowdata', rowBoundIndex);
		
		if(value != oldvalue) {
			if(dataField == 'StepOrdinal'){
				var gridrows = $("#jqxgrid2").jqxGrid('getrows');
				var intvalue = parseInt(value);
				var oldintvalue = parseInt(oldvalue);
				var introwindex = parseInt(rowBoundIndex);
				
				if((intvalue > 0) && (intvalue <= gridrows.length)){
					if(intvalue < oldintvalue) {
						for(var key in gridrows) {
							if((intvalue <= gridrows[key].StepOrdinal) && (gridrows[key].StepOrdinal <= oldintvalue)){
								$("#jqxgrid2").jqxGrid('setcellvalue', gridrows[key].uid, 'StepOrdinal', gridrows[key].StepOrdinal + 1);							
								gridrows[key].RowModified = true;
							}
						}
					}
					else if(intvalue > oldintvalue) {
						for(var key in gridrows) {
							if((intvalue >= gridrows[key].StepOrdinal) && (gridrows[key].StepOrdinal >= oldintvalue)){
								$("#jqxgrid2").jqxGrid('setcellvalue', gridrows[key].uid, 'StepOrdinal', gridrows[key].StepOrdinal - 1);						
								gridrows[key].RowModified = true;
							}
						}
					}
				}
			}

			if((dataField == 'StepDisplayName' || dataField == 'StepOrdinal' || dataField == 'IsLineup') && rowData.Step_GUID != -1) {
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
		$('#jqxgrid2').jqxGrid('sortby','StepOrdinal', 'asc');
		
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


