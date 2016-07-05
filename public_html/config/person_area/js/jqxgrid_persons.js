/*============================================================
	Property of:		MISOM TECHNOLOGIES
	Developer:			AARON MCCOLOUGH FT. JORGE MURILLO
	Application Name:	FARA_FRESNILLO
	Directory:			FARA_FRESNILLO/CONFIG/PERSON_AREA/JS
	File Name:			jqxgrid_persons.js
=============================================================*/

var personGuid;
var personName;
var selectedGrid1Row = -1;
var grid1ChangesMade = false;
var savedStateG1;

var editModeG1 = false;

function LoadPersonsGrid(url) {
	$('#jqxgrid').jqxGrid('destroy');
	
	if($("#jqxgrid").length == 0) {
		$("#jqxWidget1").prepend('<div id="jqxgrid"></div>');
	}
	
	var source = {
		datatype: "json",
		datafields: [
			{ name: 'PersonGUID',		display: 'PersonGUID',		type: 'string' },
			{ name: 'DisplayName',		display: 'DisplayName',		type: 'string' },
			{ name: 'Email',			display: 'Email',			type: 'string' },
			{ name: 'RoleDisplayName',	display: 'RoleDisplayName',	type: 'string' }
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
			{ text: 'PersonGUID', datafield: 'PersonGUID', hidden: true, editable: false },
			{ text: languagePack.personArea.grid1.DisplayName, datafield: 'DisplayName', editable: false },
			{ text: languagePack.personArea.grid1.Email, datafield: 'Email', editable: false},
			{ text: languagePack.personArea.grid1.RoleDisplayName, datafield: 'RoleDisplayName', editable: false }
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
	});
	
	$('#jqxgrid').on('rowselect', function (event) {
		if(grid2ChangesMade) {
			DisplayConfirm(languagePack.message.confirm, languagePack.message.unsavedChanges,
				function() {
					if(!(editModeG1)) {
						selectedGrid1Row = event.args.rowindex;
						
						personName = $('#jqxgrid').jqxGrid('getcellvalue', selectedGrid1Row, "DisplayName");
						personGuid = $('#jqxgrid').jqxGrid('getcellvalue', selectedGrid1Row, "PersonGUID");
						
						savedStateG2 = null;
						grid2ChangesMade = false;
						editModeG2 = false;
						
						loadAreaList(personGuid);
					}
				}
			);
		}
		else if(!(editModeG1)) {
			selectedGrid1Row = event.args.rowindex;
			
			personName = $('#jqxgrid').jqxGrid('getcellvalue', selectedGrid1Row, "DisplayName");
			personGuid = $('#jqxgrid').jqxGrid('getcellvalue', selectedGrid1Row, "PersonGUID");
			
			savedStateG2 = null;
			grid2ChangesMade = false;
			editModeG2 = false;
			
			loadAreaList(personGuid);
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