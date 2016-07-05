/*============================================================
	Property of:		MISOM TECHNOLOGIES
	Developer:			AARON MCCOLOUGH FT. JORGE MURILLO
	Application Name:	FARA_FRESNILLO
	Directory:			FARA_FRESNILLO/MAINT/LOCATION/JS
	File Name:			jqxgrid_downcodes.js
=============================================================*/

var selectedGrid1Row	= -1;
var grid1ChangesMade	= false;
var editModeG1			= false;
var maxCodeValue		= -1;
var currentEditCell		= [];
var savedStateG1;

function getDatasetGrid(url){
	var newArray = [];
	
	var dataset = $.getJSON(url, function(){
		var datasetData = $.parseJSON(dataset.responseText);
		
		for(var key in datasetData){
			var newObj = {};
			
			newObj.MachineDownEvent_GUID	= datasetData[key].MachineDownEvent_GUID;
			newObj.Lineup_GUID				= datasetData[key].Lineup_GUID;
			newObj.ShiftDate       			= moment(datasetData[key].ShiftDate).format('DD/MM/YY');
			newObj.Shift       				= datasetData[key].Shift;
			newObj.Location_GUID        	= datasetData[key].Location_GUID;
			newObj.LocationDisplayName		= datasetData[key].LocationDisplayName;
			newObj.Operator_GUID      		= datasetData[key].Operator_GUID;
			newObj.OperatorDisplayName    	= datasetData[key].OperatorDisplayName;
			newObj.Machine_GUID           	= datasetData[key].Machine_GUID;
			newObj.MachineDisplayName		= datasetData[key].MachineDisplayName;
			newObj.MachineStatus			= datasetData[key].MachineStatus;
			newObj.DownReasonCode_GUID    	= datasetData[key].DownReasonCode_GUID;
			newObj.ReasonCode				= datasetData[key].ReasonCode;
			newObj.ReasonCodeDisplayName	= datasetData[key].ReasonCodeDisplayName;
			
			if(datasetData[key].DownStartTime != null) {
				console.log(datasetData[key].DownStartTime)
				newObj.DownStartTime	= moment(datasetData[key].DownStartTime.split("Z")[0]).format('DD/MM/YY HH:mm');
			}
			else {
				newObj.DownStartTime = "";
			}
			
			if(datasetData[key].MaintenanceArrivalTime != null) {
				newObj.MaintenanceArrivalTime	= moment(datasetData[key].MaintenanceArrivalTime.split("Z")[0]).format('DD/MM/YY HH:mm');
			}
			else {
				newObj.MaintenanceArrivalTime = "";
			}
			
			if(datasetData[key].DownFinishTime != null) {
				newObj.DownFinishTime	= moment(datasetData[key].DownFinishTime.split("Z")[0]).format('DD/MM/YY HH:mm');
			}
			else {
				newObj.DownFinishTime = "";
			}
			
			newObj.Comment				= datasetData[key].Comment;
			newObj.CreatedBy			= datasetData[key].CreatedBy;
			newObj.CreatedByDisplayName	= datasetData[key].CreatedByDisplayName;
			newObj.IsCompleted			= datasetData[key].IsCompleted;
			newObj.IsActive				= datasetData[key].IsActive;
			
			newArray.push(newObj);
		}
		
		LoadDownCodesGrid(newArray);
	});
}

function LoadDownCodesGrid(newArray) {
	$('#jqxgrid').jqxGrid('destroy');

	if($("#jqxgrid").length == 0) {
		$("#jqxWidget").prepend('<div id="jqxgrid"></div>');
	}
	
	var source = {
		localdata: newArray,
		datatype: "array",
		datafields: [
			{ name: 'MachineDownEvent_GUID',	type: 'string' },
			{ name: 'Lineup_GUID',				type: 'string' },
			{ name: 'ShiftDate',				type: 'date' },
			{ name: 'Shift',					type: 'string' },
			{ name: 'Location_GUID',			type: 'string' },
			{ name: 'LocationDisplayName',		type: 'string' },
			{ name: 'Operator_GUID',			type: 'string' },
			{ name: 'OperatorDisplayName',		type: 'string' },
			{ name: 'Machine_GUID',				type: 'string' },
			{ name: 'MachineDisplayName',		type: 'string' },
			{ name: 'MachineStatus',			type: 'string' },
			{ name: 'DownReasonCode_GUID',		type: 'string' },
			{ name: 'ReasonCode',				type: 'string' },
			{ name: 'ReasonCodeDisplayName',	type: 'string' },
			{ name: 'DownStartTime',			type: 'date' },
			{ name: 'MaintenanceArrivalTime',	type: 'date' },
			{ name: 'DownFinishTime',			type: 'date' },
			{ name: 'Comment',					type: 'string' },
			{ name: 'CreatedBy',				type: 'string' },
			{ name: 'CreatedByDisplayName',		type: 'string' },
			{ name: 'IsCompleted',				type: 'bool' },
			{ name: 'IsActive',					type: 'bool' }
		]
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
			var updateButton = $("<div id='grid_upload_button' style='float: left; margin-left: 5px;'><img style='position: relative; width: 25px; height: 25px; cursor: initial' src='../images/upload_inactive_icon.png'/><span style='margin-left: 4px; position: relative; top: -1px;'></span></div>");
			container.append(updateButton);	
			statusbar.append(container);
			updateButton.jqxButton({  width: 60, height: 20 });
			
			// update grid.
			updateButton.click(function (event) {
				if(!editModeG1) {
					LockForService();
					UpdateDownCodeGrid();
				}
			});
		},
		columnsresize: true,
		columnsreorder: true,
        editable: true,
		editmode: 'dblclick',
		sortable: true,
        filterable: true,
		groupable: true,
		enabletooltips: true,
		columns: [
			{ datafield: '', text: '#', sortable: false, cellclassname: 'uneditable-column', filterable: false, editable: false, groupable: false, draggable: false,
				resizable: false, columntype: 'number', width: 50, cellsrenderer: function (row, column, value) {
					return "<div style='margin:4px;'>" + (value + 1) + "</div>";
				}
			},
			{ datafield: 'MachineDownEvent_GUID',	text: 'MachineDownEvent_GUID',								hidden: true,	editable: false },
			{ datafield: 'Lineup_GUID',				text: 'Lineup_GUID',										hidden: true,	editable: false },
			{ datafield: 'ShiftDate',				text: languagePack.downCodes.grid1.ShiftDate,				hidden: false,	editable: false, cellclassname: 'uneditable-column', width: 110, columntype: 'datetimeinput', cellsformat: 'dd/MM/yy' },
			{ datafield: 'Shift',					text: languagePack.downCodes.grid1.Shift,					hidden: false,	editable: false, cellclassname: 'uneditable-column', width: 50 },
			{ datafield: 'Location_GUID',			text: 'Location_GUID',										hidden: true,	editable: false },
			{ datafield: 'LocationDisplayName',		text: languagePack.downCodes.grid1.LocationDisplayName,		hidden: false,	editable: false, cellclassname: 'uneditable-column', width: 150 },
			{ datafield: 'Machine_GUID',			text: 'Machine_GUID',										hidden: true,	editable: false },
			{ datafield: 'MachineDisplayName',		text: languagePack.downCodes.grid1.MachineDisplayName,		hidden: false,	editable: false, cellclassname: 'uneditable-column', width: 70 },
			{ datafield: 'Operator_GUID',			text: 'Operator_GUID',										hidden: true,	editable: false },
			{ datafield: 'OperatorDisplayName',		text: languagePack.downCodes.grid1.OperatorDisplayName,		hidden: false,	editable: false, cellclassname: 'uneditable-column', width: 150 },
			{ datafield: 'CreatedBy',				text: 'CreatedBy',											hidden: true,	editable: false },
			{ datafield: 'CreatedByDisplayName',	text: languagePack.downCodes.grid1.CreatedByDisplayName,	hidden: false,	editable: false, cellclassname: 'uneditable-column', width: 100 },
			{ datafield: 'DownReasonCode_GUID',		text: 'DownReasonCode_GUID',								hidden: true,	editable: false },
			{ datafield: 'ReasonCodeDisplayName',	text: languagePack.downCodes.grid1.ReasonCodeDisplayName,	hidden: false,	editable: true, width: 250, filtertype: 'checkedlist', columntype: 'dropdownlist',
				createeditor: function (row, column, editor) {
					// assign a new data source to the dropdownlist.
					var list = DownCodesNameList;
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
						return { result: false, message: languagePack.downCodes.invalidReasonCode };
					}
					return true;
				}
			},
			{ datafield: 'DownStartTime',			text: languagePack.downCodes.grid1.DownStartTime,			hidden: false,	editable: true, width: 120, columntype: 'datetimeinput', cellsformat: 'dd/MM/yy hh:mm' },
			{ datafield: 'MaintenanceArrivalTime',	text: languagePack.downCodes.grid1.MaintenanceArrivalTime,	hidden: false,	editable: true, width: 120, columntype: 'datetimeinput', cellsformat: 'dd/MM/yy hh:mm' },
			{ datafield: 'DownFinishTime',			text: languagePack.downCodes.grid1.DownFinishTime,			hidden: false,	editable: true, width: 120, columntype: 'datetimeinput', cellsformat: 'dd/MM/yy hh:mm' },
			{ datafield: 'Comment',					text: languagePack.downCodes.grid1.Comment,					hidden: false,	editable: true },
			{ datafield: 'MachineStatus',			text: languagePack.downCodes.grid1.MachineStatus,			hidden: false,	editable: true, columntype: 'dropdownlist', width: 170,
				createeditor: function (row, column, editor) {
					// assign a new data source to the dropdownlist.
					var list = MachineStatusList;
					editor.jqxDropDownList({ autoDropDownHeight: true, source: list, placeHolder: "" });
				},
				// update the editor's value before saving it.
				cellvaluechanging: function (row, column, columntype, oldvalue, newvalue) {
					// return the old value, if the new value is empty.
					if (newvalue == "") return oldvalue;
				}
			},
			{ datafield: 'IsCompleted',				text: languagePack.downCodes.grid1.IsCompleted,				hidden: false,	editable: true, columntype: 'checkbox', width: 75},
			{ datafield: 'IsActive',				text: 'IsActive',											hidden: true,	editable: false }
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
		var rowData = $("#jqxgrid").jqxGrid('getrowdata', rowBoundIndex);

		if(value != oldvalue) {			
			if(dataField == 'ReasonCodeDisplayName') {
				rowData.DownReasonCode_GUID = DownCodesGUIDList[DownCodesNameList.indexOf(value)];
			}
			
			if(dataField == 'IsCompleted') {
				for(var key in currentEditCell) {
					$("#jqxgrid").jqxGrid('endcelledit', rowBoundIndex, currentEditCell[key], false);
				}
				currentEditCell = [];
			}
			else {
				currentEditCell = [];
			}
			
			if((dataField == 'MachineStatus' || dataField == 'ReasonCodeDisplayName' || dataField == 'DownStartTime' || dataField == 'MaintenanceArrivalTime' || dataField == 'DownFinishTime' || dataField == 'Comment' || dataField == 'IsCompleted') && rowData.MachineDownEvent_GUID != -1) {
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