
$(document).ready(function() {          
	// prepare the data
	var source =
	{
		dataType: "json",
		dataFields: [
			{ name: 'ElementGUID', type: 'string' },
			{ name: 'ParentGUID', type: 'string' },
			{ name: 'Entity', type: 'string' },
			{ name: 'Title', type: 'string' },
			{ name: 'ShiftDate', type: 'date' },
			{ name: 'Shift', type: 'string' }
		],
		hierarchy:
		{
			keyDataField: { name: 'ElementGUID' },
			parentDataField: { name: 'ParentGUID' }
		},
		url: "http://192.168.1.21:8888/misom_apps/fara/required_files/data.json"
	};
	var dataAdapter = new $.jqx.dataAdapter(source);
	// create Tree Grid
	$("#treeGrid").jqxTreeGrid(
	{
		source: dataAdapter,
		editable: true,
		columnsResize: true,
		ready: function()
		{
			// expand row with 'EmployeeKey = 32'
			$("#treeGrid").jqxTreeGrid('expandRow', 32);
		},
		columns: [
		  { text: 'Entity', dataField: 'Entity', width: 225 },
		  { text: 'Title',  dataField: 'Title', width: 225 },
		  { text: 'ShiftDate', dataField: 'ShiftDate', cellsformat: 'yyyy-MM-dd', width: 150 },
		  { text: 'Shift', dataField: 'Shift', width: 100 }
		]
	});
});