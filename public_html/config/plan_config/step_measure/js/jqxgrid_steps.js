/*============================================================
	Property of:		MISOM TECHNOLOGIES
	Developer:			AARON MCCOLOUGH FT. JORGE MURILLO
	Application Name:	FARA_FRESNILLO
	Directory:			FARA_FRESNILLO/CONFIG/PLAN_CONFIG/STEP_MEASURE/JS
	File Name:			jqxgrid_steps.js
=============================================================*/

var stepGuid;
var stepName;
var selectedGrid1Row = -1;
var grid1ChangesMade = false;
var savedStateG1;

var editModeG1 = false;

function LoadSteps2Grid(url) {
	$('#jqxgrid').jqxGrid('destroy');

	if($("#jqxgrid").length == 0) {
		$("#jqxWidget1").prepend('<div id="jqxgrid"></div>');
	}
	
	var source = {
		datatype: "json",
		datafields: [
			{ name: 'Method_GUID',			display: 'Method_GUID',			type: 'string' },
			{ name: 'MethodDisplayName',	display: 'MethodDisplayName',	type: 'string' },
			{ name: 'Step_GUID',			display: 'Step_GUID',			type: 'string' },
			{ name: 'StepDisplayName',		display: 'StepDisplayName',		type: 'string' },
			{ name: 'StepOrdinal',			display: 'StepOrdinal',			type: 'int' },
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
				var rowObject = $('#jqxgrid').jqxGrid('getrowdata', rowIndex);
				RemoveMethodRow(rowObject, rowId);
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
			statusbar.append(container);
		},
		columnsresize: true,
		columnsreorder: true,
        editable: false,
		editmode: 'dblclick',
		sortable: true,
		filterable: 'excel',
		groupable: true,
		enabletooltips: true,
		columns: [
			{ text: 'Method_GUID', datafield: 'Method_GUID', hidden: true, editable: false },
			{ text: languagePack.stepMeasure.grid1.StepOrdinal, datafield: 'StepOrdinal', editable: false, width: 50},
			{ text: languagePack.stepMeasure.grid1.MethodDisplayName, datafield: 'MethodDisplayName', editable: false, width: 200 },
			{ text: 'Step_GUID', datafield: 'Step_GUID', hidden: true, editable: false },
			{ text: languagePack.stepMeasure.grid1.StepDisplayName, datafield: 'StepDisplayName', editable: false},
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
	
	$('#jqxgrid').on('rowselect', function (event) {
		if(grid2ChangesMade) {
			DisplayConfirm(languagePack.message.confirm, languagePack.message.unsavedChanges,
				function() {
					if(!(editModeG1)) {
						selectedGrid1Row = event.args.rowindex;
						
						stepName = $('#jqxgrid').jqxGrid('getcellvalue', selectedGrid1Row, "StepDisplayName");
						stepGuid = $('#jqxgrid').jqxGrid('getcellvalue', selectedGrid1Row, "Step_GUID");
						
						savedStateG2 = null;
						grid2ChangesMade = false;
						editModeG2 = false;

						LoadMeasuresGrid(ruIP + ruPort + planningDB + planningEN + "read/dbo/v_StepMeasureConfig?where=\"Step_GUID = '" + stepGuid + "' AND StepMeasure_IsActive = '1'\"");
					}
				}
			);
		}
		else if(!(editModeG1)) {
			selectedGrid1Row = event.args.rowindex;
			
			stepName = $('#jqxgrid').jqxGrid('getcellvalue', selectedGrid1Row, "StepDisplayName");
			stepGuid = $('#jqxgrid').jqxGrid('getcellvalue', selectedGrid1Row, "Step_GUID");
			
			savedStateG2 = null;
			grid2ChangesMade = false;
			editModeG2 = false;

			LoadMeasuresGrid(ruIP + ruPort + planningDB + planningEN + "read/dbo/v_StepMeasureConfig?where=\"Step_GUID = '" + stepGuid + "' AND StepMeasure_IsActive = '1'\"");
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