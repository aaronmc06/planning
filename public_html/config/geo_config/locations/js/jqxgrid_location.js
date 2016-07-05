/*============================================================
	Property of:		MISOM TECHNOLOGIES
	Developer:			AARON MCCOLOUGH FT. JORGE MURILLO
	Application Name:	FARA_FRESNILLO
	Directory:			FARA_FRESNILLO/CONFIG/GEO_CONFIG/LOCATION/JS
	File Name:			jqxgrid_location.js
=============================================================*/

var selectedGrid1Row = -1;
var grid1ChangesMade = false;
var savedStateG1;
var editModeG1 = false;
var maxCodeValue = -1;

function LoadLocationGrid(url) {
	$('#jqxgrid').jqxGrid('destroy');

	if($("#jqxgrid").length == 0) {
		$("#jqxWidget").prepend('<div id="jqxgrid"></div>');
	}
	
	var source = {
		datatype: "json",
		datafields: [
			{ name: 'Location_GUID', 			display: 'Location_GUID',				type: 'string' },
			{ name: 'LocationName',				display: 'LocationName',				type: 'string' },
			{ name: 'LocationCode', 			display: 'LocationCode',				type: 'int' },
			{ name: 'LocationDisplayName',		display: 'LocationDisplayName',			type: 'string' },
			{ name: 'Area_GUID', 				display: 'Area_GUID',					type: 'string' },
			{ name: 'AreaDisplayName', 			display: 'AreaDisplayName',				type: 'string' },
			{ name: 'Obracode_GUID', 			display: 'Obracode_GUID',				type: 'string' },
			{ name: 'ObraDisplayName', 			display: 'ObraDisplayName',				type: 'string' },
			{ name: 'Nivel',					display: 'Nivel',						type: 'string' },
			{ name: 'ReferenceLine', 			display: 'ReferenceLine',				type: 'string' },
			{ name: 'Orientacion_GUID', 		display: 'Orientacion_GUID',			type: 'string' },
			{ name: 'OrientacionDisplayName',	display: 'OrientacionDisplayName',		type: 'string' },
			{ name: 'VetaClave_GUID', 			display: 'VetaClave_GUID',				type: 'string' },
			{ name: 'VetaClaveDisplayName', 	display: 'VetaClaveDisplayName',		type: 'string' },
			{ name: 'GeologyStatus_GUID', 		display: 'GeologyStatus_GUID',			type: 'string' },
			{ name: 'GeologyStatusDisplayName', display: 'GeologyStatusDisplayName',	type: 'string' },
			{ name: 'Minestatus_GUID', 			display: 'Minestatus_GUID',				type: 'string' },
			{ name: 'MinestatusDisplayName', 	display: 'MinestatusDisplayName',		type: 'string' },
			{ name: 'Elevation', 				display: 'Elevation', 					type: 'string' },
			{ name: 'BlockName', 				display: 'BlockName',					type: 'string' },
			{ name: 'Length', 					display: 'Length', 						type: 'string' },
			{ name: 'IsActive', 				display: 'IsActive', 					type: 'bool' }
		],
		url: url
	};
	
	var dataAdapter = new $.jqx.dataAdapter(source);
	
	var deleteButton = function(row, columnfield, value, defaulthtml, columnproperties) {
		return '<div id="grid_cancel_button" style="cursor: pointer"><img style="width: 22px; height: 22px" src="../images/cancel_icon.png"/></div>';
	};
	
	var deleteButtonClick = function(rowIndex, rowId) {
		DisplayConfirm(languagePack.message.confirm,languagePack.message.confirmRecordDelete, function(){
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
					newRow.Location_GUID = -1;
					newRow.LocationName = languagePack.common.generating;
					
					if(maxCodeValue == -1) {
					
						var jqxhrmaxvalue = $.getJSON(ruIP + ruPort + planningDB + planningEN + "read/geo/Location?where=\"IsActive = '1' ORDER BY LocationCode Desc\"", function() {
			
							var locationData = $.parseJSON(jqxhrmaxvalue.responseText);
							
							if(locationData[0].LocationCode < 199999) {
								maxCodeValue = 199999;
							}
							else {								
								maxCodeValue = locationData[0].LocationCode;
							}
							
							newRow.LocationCode = maxCodeValue + 1;
							$("#jqxgrid").jqxGrid('addrow', null, newRow);
							$('#jqxgrid').jqxGrid('selectrow', $('#jqxgrid').jqxGrid('getrows').length - 1);
							$("#jqxgrid").jqxGrid('begincelledit', $('#jqxgrid').jqxGrid('getrows').length - 1, "AreaDisplayName");
						});
					}
					else {
						newRow.LocationCode = maxCodeValue + 1;						
						$("#jqxgrid").jqxGrid('addrow', null, newRow);
						$('#jqxgrid').jqxGrid('selectrow', $('#jqxgrid').jqxGrid('getrows').length - 1);
						$("#jqxgrid").jqxGrid('begincelledit', $('#jqxgrid').jqxGrid('getrows').length - 1, "AreaDisplayName");
						maxCodeValue++;
					}
				}
			});

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
			{ text: '#', sortable: false, filterable: false, editable: false, groupable: false, draggable: false,
				resizable: false, datafield: '', columntype: 'number', width: 50, cellsrenderer: function (row, column, value) {
					return "<div style='margin:4px;'>" + (value + 1) + "</div>";
				}
			},
			{ text: 'Location_GUID', datafield: 'Location_GUID', hidden: true, editable: false },
			{ text: languagePack.locations.grid1.LocationName, datafield: 'LocationName', width: 150, hidden: false, editable: false },
			{ text: 'Area_GUID', datafield: 'Area_GUID', hidden: true, editable: false },
			{ text: languagePack.locations.grid1.AreaDisplayName, datafield: 'AreaDisplayName', width: 90, editable: true, filtertype: 'checkedlist', columntype: 'dropdownlist',
				createeditor: function (row, column, editor) {
					// assign a new data source to the dropdownlist.
					var list = AreaNameList;
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
						return { result: false, message: languagePack.locations.invalidArea };
					}
					return true;
				}
			},
			{ text: 'Obracode_GUID', datafield: 'Obracode_GUID', hidden: true, editable: false },
			{ text: languagePack.locations.grid1.ObraDisplayName, datafield: 'ObraDisplayName', width: 100, filtertype: 'checkedlist', editable: true, columntype: 'dropdownlist',
				createeditor: function (row, column, editor) {
					// assign a new data source to the dropdownlist.
					var list = ObraCodeNameList;
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
						return { result: false, message: languagePack.locations.invalidObraCode };
					}
					return true;
				}
			},
			{ text: languagePack.locations.grid1.Level, datafield: 'Nivel', width: 70, editable: true,
				validation: function (cell, value) {
					if(!value) {
						return { result: false, message: languagePack.locations.invalidNivel };
					}
					else if(isNaN(value)){
						return { result: false, message: languagePack.locations.invalidNivelNum };
					}
					return true;
				}
			},
			{ text: languagePack.locations.grid1.ReferenceLine, datafield: 'ReferenceLine', width: 130, editable: true },
			{ text: 'Orientacion_GUID', datafield: 'Orientacion_GUID', hidden: true, editable: false },
			{ text: languagePack.locations.grid1.Orientation, datafield: 'OrientacionDisplayName', width: 90, filtertype: 'checkedlist', editable: true, columntype: 'dropdownlist', 
				createeditor: function (row, column, editor) {
					// assign a new data source to the dropdownlist.
					var list = OrientacionNameList;
					editor.jqxDropDownList({ autoDropDownHeight: true, source: list });
				},
				// update the editor's value before saving it.
				cellvaluechanging: function (row, column, columntype, oldvalue, newvalue) {
					// return the old value, if the new value is empty.
					if (newvalue == "") return oldvalue;
				},
				validation: function (cell, value) {
					if(!value) {
						return { result: false, message: languagePack.locations.invalidOrientation };
					}
					return true;
				}
			},
			{ text: 'VetaClave_GUID', datafield: 'VetaClave_GUID', hidden: true, editable: false },
			{ text: languagePack.locations.grid1.VetaClaveDisplayName, datafield: 'VetaClaveDisplayName', width: 110, filtertype: 'checkedlist', editable: true, columntype: 'dropdownlist',
				createeditor: function (row, column, editor) {
					// assign a new data source to the dropdownlist.
					var list = VetaClaveNameList;
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
						return { result: false, message: languagePack.locations.invalidVetaClave };
					}
					return true;
				}
			},
			{ text: languagePack.locations.grid1.LocationDisplayName, datafield: 'LocationDisplayName', hidden: false, editable: true },
			{ text: languagePack.locations.grid1.LocationCode, datafield: 'LocationCode', width: 90, hidden: false, editable: false },
			{ text: 'GeologyStatus_GUID', datafield: 'GeologyStatus_GUID', hidden: true, editable: false },
			{ text: languagePack.locations.grid1.GeologyStatusDisplayName, datafield: 'GeologyStatusDisplayName', width: 120, filtertype: 'checkedlist', editable: true, columntype: 'dropdownlist', 
				createeditor: function (row, column, editor) {
					// assign a new data source to the dropdownlist.
					var list = GeologyStatusNameList;
					editor.jqxDropDownList({ autoDropDownHeight: true, source: list });
				},
				// update the editor's value before saving it.
				cellvaluechanging: function (row, column, columntype, oldvalue, newvalue) {
					// return the old value, if the new value is empty.
					if (newvalue == "") return oldvalue;
				},
				validation: function (cell, value) {
					if(!value) {
						return { result: false, message: languagePack.locations.invalidGeologyStatus };
					}
					return true;
				}
			},
			{ text: 'Minestatus_GUID', datafield: 'Minestatus_GUID', hidden: true, editable: false },
			{ text: languagePack.locations.grid1.MinestatusDisplayName, datafield: 'MinestatusDisplayName', width: 100, filtertype: 'checkedlist', editable: true, columntype: 'dropdownlist', 
				createeditor: function (row, column, editor) {
					// assign a new data source to the dropdownlist.
					var list = MinestatusNameList;
					editor.jqxDropDownList({ autoDropDownHeight: true, source: list });
				},
				// update the editor's value before saving it.
				cellvaluechanging: function (row, column, columntype, oldvalue, newvalue) {
					// return the old value, if the new value is empty.
					if (newvalue == "") return oldvalue;
				}
			},
			{ text: languagePack.locations.grid1.Elevation, datafield: 'Elevation', width: 80, editable: true },
			{ text: languagePack.locations.grid1.BlockName, datafield: 'BlockName', editable: true },
			{ text: languagePack.locations.grid1.Length, datafield: 'Length', editable: true },
			{ text: 'IsActive', datafield: 'IsActive', editable: false, hidden: true },
			{ text: languagePack.common.del, datafield: 'Delete', filterable: false, width: 60, editable: false, resizable: false, groupable: false, cellsrenderer: deleteButton }
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
			if(dataField == 'AreaDisplayName') {
				rowData.Area_GUID = AreaGUIDList[AreaNameList.indexOf(value)];
			}
			if(dataField == 'ObraDisplayName') {
				rowData.Obracode_GUID = ObraCodeGUIDList[ObraCodeNameList.indexOf(value)];
			}
			if(dataField == 'OrientacionDisplayName') {
				rowData.Orientacion_GUID = OrientacionGUIDList[OrientacionNameList.indexOf(value)];
			}
			if(dataField == 'VetaClaveDisplayName') {
				rowData.VetaClave_GUID = VetaClaveGUIDList[VetaClaveNameList.indexOf(value)];
			}
			if(dataField == 'GeologyStatusDisplayName') {
				rowData.GeologyStatus_GUID = GeologyStatusGUIDList[GeologyStatusNameList.indexOf(value)];
			}
			if(dataField == 'MinestatusDisplayName') {
				rowData.Minestatus_GUID = MinestatusGUIDList[MinestatusNameList.indexOf(value)];
			}
			
			if((dataField == 'LocationName' || dataField == 'LocationDisplayName' || dataField == 'AreaDisplayName' || dataField == 'ObraDisplayName' || dataField == 'Nivel' || dataField == 'ReferenceLine' || dataField == 'OrientacionDisplayName' || dataField == 'VetaClaveDisplayName' || dataField == 'LocationDisplayName' || dataField == 'GeologyStatusDisplayName' || dataField == 'MinestatusDisplayName' || dataField == 'Elevation' || dataField == 'BlockName' || dataField == 'Length' || dataField == 'LocationCode') && rowData.Location_GUID != -1) {
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