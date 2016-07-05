/*============================================================
	Property of:		MISOM TECHNOLOGIES
	Developer:			AARON MCCOLOUGH FT. JORGE MURILLO
	Application Name:	FARA_FRESNILLO
	Directory:			FARA_FRESNILLO/CONFIG/PLAN_CONFIG/MACHINE_MEASURE/JS
	File Name:			jqxgrid_machine.js
=============================================================*/

var machinetypeGuid;
var machinetypeName;
var selectedGrid1Row = -1;
var grid1ChangesMade = false;
var savedStateG1;

var editModeG1 = false;

function LoadMachineTypesGrid(url) {
	$('#jqxgrid').jqxGrid('destroy');

	if($("#jqxgrid").length == 0) {
		$("#jqxWidget1").prepend('<div id="jqxgrid"></div>');
	}
	
	var source = {
		datatype: "json",
		datafields: [
			{ name: 'MachineType_GUID',	display: 'MachineType_GUID',	type: 'string' },
			{ name: 'DisplayName',		display: 'DisplayName',			type: 'string' },
			{ name: 'MachineTypeCode',	display: 'MachineTypeCode',		type: 'string' },
			{ name: 'IsActive',			display: 'IsActive',			type: 'bool' }
		],
		url: url
	};
	
	var dataAdapter = new $.jqx.dataAdapter(source);

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
			{ text: '#', sortable: false, filterable: false, editable: false, groupable: false, draggable: false,
				resizable: false, datafield: '', columntype: 'number', width: 50, cellsrenderer: function (row, column, value) {
					return "<div style='margin:4px;'>" + (value + 1) + "</div>";
				}
			},
			{ text: 'MachineType_GUID', datafield: 'MachineType_GUID', hidden: true, editable: false },
			{ text: 'MineProcess_GUID', datafield: 'MineProcess_GUID', hidden: true, editable: false },
			{ text: languagePack.machineMeasures.grid1.DisplayName, datafield: 'DisplayName', editable: false},
			{ text: languagePack.machineMeasures.grid1.MachineTypeCode, datafield: 'MachineTypeCode', editable: false },
			{ text: 'Active', datafield: 'IsActive', editable: false, hidden: true }
		]
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
						
						machinetypeName = $('#jqxgrid').jqxGrid('getcellvalue', selectedGrid1Row, "DisplayName");
						machinetypeGuid = $('#jqxgrid').jqxGrid('getcellvalue', selectedGrid1Row, "MachineType_GUID");			
						
						savedStateG2 = null;
						grid2ChangesMade = false;
						editModeG2 = false;
						
						LoadMeasures(machinetypeGuid);
					}
				}
			);
		}
		else if(!(editModeG1)) {
			selectedGrid1Row = event.args.rowindex;
			
			machinetypeName = $('#jqxgrid').jqxGrid('getcellvalue', selectedGrid1Row, "DisplayName");
			machinetypeGuid = $('#jqxgrid').jqxGrid('getcellvalue', selectedGrid1Row, "MachineType_GUID");			
			
			savedStateG2 = null;
			grid2ChangesMade = false;
			editModeG2 = false;
			
			LoadMeasures(machinetypeGuid);
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