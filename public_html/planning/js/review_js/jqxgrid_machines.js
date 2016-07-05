/*============================================================
	Property of:		MISOM TECHNOLOGIES
	Developer:			JORGE MURILLO
	Application Name:	FARA_FRESNILLO
	Directory:			FARA_FRESNILLO/PLANNING/JS/REVIEW_JS
	File Name:			jqxgrid_machines.js
=============================================================*/

function getMachines(areaFilter, stepFilter, measureFilter){
	machineArray = [];
	
	$('#machinesGrid').jqxGrid('destroy');
	$("#jqGrid3").html('<div class="titleGrid"> - '+languagePack.review.byMachines+'</div><div id="machinesGrid"></div>');
	
	$.getJSON(ruIP + ruPort + planningDB + planningEN + "read/dbo/v_Summary_ByMachine?where=\"Shiftdate between '"+moment($("#plan_week_selector").val()).format("YYYY/MM/DD")+"' and '"+moment($("#plan_week_selector").val()).add(6,'days').format("YYYY/MM/DD")+"'"+areaFilter+stepFilter+measureFilter+" ORDER BY Shiftdate ASC\"", function( machineData ) {		
	
		for(var key in machineData) {
			var repeatMach = false;
			var machineObj = {};
			
			for(var i = 0; i < machineArray.length; i++){
				if(machineArray[i].MachineName == machineData[key].MachineName && machineData[key].SUM){
					(machineData[key].SUM) ? machineArray[i][moment(machineData[key].Shiftdate.split("Z")[0]).format('dddd')] += (Math.round(machineData[key].SUM * 10) / 10) : machineObj[moment(machineData[key].Shiftdate.split("Z")[0]).format('dddd')] += 0;
					repeatMach = true;
				}
			}
			
			if(repeatMach == false && machineData[key].SUM){
				machineObj.MachineName = machineData[key].MachineName;
				machineObj.Step_GUID = machineData[key].Step_GUID;
				machineObj.Measure_GUID = machineData[key].Measure_GUID;
				machineObj["Lunes"]		= 0;
				machineObj["Martes"]	= 0;
				machineObj["Miércoles"]	= 0;
				machineObj["Jueves"]	= 0;
				machineObj["Viernes"]	= 0;
				machineObj["Sábado"]	= 0;
				machineObj["Domingo"]	= 0;
				(machineData[key].SUM) ? machineObj[moment(machineData[key].Shiftdate.split("Z")[0]).format('dddd')] += (Math.round(machineData[key].SUM * 10) / 10) : machineObj[moment(machineData[key].Shiftdate.split("Z")[0]).format('dddd')] += 0;
				
				machineArray.push(machineObj);
			}
		}

		if(machineArray.length > 0){
			loadMachines();
		}
		else{
			$('#jqGrid3').append('<div class="emptyGrid">'+ languagePack.review.noFields +$("#measureDD option:selected").text()+' '+ languagePack.review.byMachines +'</div>');
		}		
	});
}

function loadMachines(){
	var jsonGrid = JSON.stringify(machineArray);
	
	var source =
	{
		datatype: "json",
		datafields: [
			{ name: 'MachineName', type: 'string' },
			{ name: 'Lunes',       type: 'float' },
			{ name: 'Martes',      type: 'float' },
			{ name: 'Miércoles',   type: 'float' },
			{ name: 'Jueves',      type: 'float' },
			{ name: 'Viernes',     type: 'float' },
			{ name: 'Sábado',      type: 'float' },
			{ name: 'Domingo',     type: 'float' }
		],
		localdata: jsonGrid
	};
	
	var dataAdapter = new $.jqx.dataAdapter(source);
	$("#machinesGrid").jqxGrid(
	{
		width: '100%',
		autoheight: true,
		columnsresize: true,
		source: dataAdapter,
		showstatusbar: true,
		showaggregates: true,
		columns: [
			{ text: languagePack.common.machine,		datafield: 'MachineName' },
			{ text: languagePack.datetime.monday,		datafield: 'Lunes',     width: 150, aggregates:
				[{'Sum': function (aggregatedValue, currentValue, column, record) {
					if(currentValue || currentValue == 0) {
						return (Math.round((aggregatedValue + currentValue) * 10) / 10);
					}
					else {
						return (Math.round((aggregatedValue) * 10) / 10);
					}
				}}]
			},
			{ text: languagePack.datetime.tuesday,		datafield: 'Martes',    width: 150, aggregates:
				[{'Sum': function (aggregatedValue, currentValue, column, record) {
					if(currentValue || currentValue == 0) {
						return (Math.round((aggregatedValue + currentValue) * 10) / 10);
					}
					else {
						return (Math.round((aggregatedValue) * 10) / 10);
					}
				}}]
			},
			{ text: languagePack.datetime.wednesday,	datafield: 'Miércoles', width: 150, aggregates:
				[{'Sum': function (aggregatedValue, currentValue, column, record) {
					if(currentValue || currentValue == 0) {
						return (Math.round((aggregatedValue + currentValue) * 10) / 10);
					}
					else {
						return (Math.round((aggregatedValue) * 10) / 10);
					}
				}}]
			},
			{ text: languagePack.datetime.thursday,		datafield: 'Jueves',    width: 150, aggregates:
				[{'Sum': function (aggregatedValue, currentValue, column, record) {
					if(currentValue || currentValue == 0) {
						return (Math.round((aggregatedValue + currentValue) * 10) / 10);
					}
					else {
						return (Math.round((aggregatedValue) * 10) / 10);
					}
				}}]
			},
			{ text: languagePack.datetime.friday,		datafield: 'Viernes',   width: 150, aggregates:
				[{'Sum': function (aggregatedValue, currentValue, column, record) {
					if(currentValue || currentValue == 0) {
						return (Math.round((aggregatedValue + currentValue) * 10) / 10);
					}
					else {
						return (Math.round((aggregatedValue) * 10) / 10);
					}
				}}]
			},
			{ text: languagePack.datetime.saturday,		datafield: 'Sábado',    width: 150, aggregates:
				[{'Sum': function (aggregatedValue, currentValue, column, record) {
					if(currentValue || currentValue == 0) {
						return (Math.round((aggregatedValue + currentValue) * 10) / 10);
					}
					else {
						return (Math.round((aggregatedValue) * 10) / 10);
					}
				}}]
			},
			{ text: languagePack.datetime.sunday,		datafield: 'Domingo',   width: 150, aggregates:
				[{'Sum': function (aggregatedValue, currentValue, column, record) {
					if(currentValue || currentValue == 0) {
						return (Math.round((aggregatedValue + currentValue) * 10) / 10);
					}
					else {
						return (Math.round((aggregatedValue) * 10) / 10);
					}
				}}]
			},
			{ text: 'Total', datafield: 'Total', width: 150,
				cellsrenderer: function (index, datafield, value, defaultvalue, column, rowdata) {
					var total = 0;
					
					if(rowdata.Lunes) {
						total += parseFloat(rowdata.Lunes);
					}
					
					if(rowdata.Martes) {
						total += parseFloat(rowdata.Martes);
					}
					
					if(rowdata.Miércoles) {
						total += parseFloat(rowdata.Miércoles);
					}
					
					if(rowdata.Jueves) {
						total += parseFloat(rowdata.Jueves);
					}
					
					if(rowdata.Viernes) {
						total += parseFloat(rowdata.Viernes);
					}
					
					if(rowdata.Sábado) {
						total += parseFloat(rowdata.Sábado);
					}
					
					if(rowdata.Domingo) {
						total += parseFloat(rowdata.Domingo);
					}
					
					return "<div style='margin: 4px;'>" + (Math.round(total * 10) / 10) + "</div>";
				}
			}
		]
	});
}









