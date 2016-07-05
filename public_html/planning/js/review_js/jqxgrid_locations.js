/*============================================================
	Property of:		MISOM TECHNOLOGIES
	Developer:			JORGE MURILLO
	Application Name:	FARA_FRESNILLO
	Directory:			FARA_FRESNILLO/PLANNING/JS/REVIEW_JS
	File Name:			jqxgrid_locations.js
=============================================================*/

function getLocations(areaFilter, stepFilter, measureFilter){
	locationArray = [];
	
	$('#locationsGrid').jqxGrid('destroy');
	$("#jqGrid2").html('<div class="titleGrid"> - '+languagePack.review.byLocations+'</div><div id="locationsGrid"></div>');
	
	$.getJSON(ruIP + ruPort + planningDB + planningEN + "read/dbo/v_Summary_ByLocation?where=\"Shiftdate between '"+moment($("#plan_week_selector").val()).format("YYYY/MM/DD")+"' and '"+moment($("#plan_week_selector").val()).add(6,'days').format("YYYY/MM/DD")+"'"+areaFilter+stepFilter+measureFilter+" AND SUM is not null ORDER BY Shiftdate ASC\"", function( locationData ) {

		for(var key in locationData) {
			var repeatLoc = false;
			var locationObj = {};
			
			for(var i = 0; i < locationArray.length; i++){
				if(locationArray[i].LocationName == locationData[key].LocationName && locationData[key].SUM){
					(locationData[key].SUM) ? locationArray[i][moment(locationData[key].Shiftdate.split("Z")[0]).format('dddd')] += (Math.round(locationData[key].SUM * 10) / 10) : locationObj[moment(locationData[key].Shiftdate.split("Z")[0]).format('dddd')] += 0;
					repeatLoc = true;
				}
			}
			
			if(repeatLoc == false && locationData[key].SUM){
				locationObj.LocationName = locationData[key].LocationName;
				locationObj.Step_GUID = locationData[key].Step_GUID;
				locationObj.Measure_GUID = locationData[key].Measure_GUID;
				locationObj[moment(locationData[key].Shiftdate.split("Z")[0]).format('dddd')] = locationData[key].SUM;
				locationObj["Lunes"]		= 0;
				locationObj["Martes"]		= 0;
				locationObj["Miércoles"]	= 0;
				locationObj["Jueves"]		= 0;
				locationObj["Viernes"]		= 0;
				locationObj["Sábado"]		= 0;
				locationObj["Domingo"]		= 0;
				(locationData[key].SUM) ? locationObj[moment(locationData[key].Shiftdate.split("Z")[0]).format('dddd')] += (Math.round(locationData[key].SUM * 10) / 10) : locationObj[moment(locationData[key].Shiftdate.split("Z")[0]).format('dddd')] += 0;
				
				
				locationArray.push(locationObj);
			}
		}
		
		if(locationArray.length > 0){
			loadLocations();
		}
		else{
			$('#jqGrid2').append('<div class="emptyGrid">'+ languagePack.review.noFields +$("#measureDD option:selected").text()+' '+ languagePack.review.byLocations +'</div>');
		}
		
	});
}

function loadLocations(){
	var jsonGrid = JSON.stringify(locationArray);
	
	var source =
	{
		datatype: "json",
		datafields: [
			{ name: 'LocationName', type: 'string' },
			{ name: 'Lunes',        type: 'float' },
			{ name: 'Martes',       type: 'float' },
			{ name: 'Miércoles',    type: 'float' },
			{ name: 'Jueves',       type: 'float' },
			{ name: 'Viernes',      type: 'float' },
			{ name: 'Sábado',       type: 'float' },
			{ name: 'Domingo',      type: 'float' }
		],
		localdata: jsonGrid
	};
	
	var dataAdapter = new $.jqx.dataAdapter(source);
	$("#locationsGrid").jqxGrid(
	{
		width: '100%',
		autoheight: true,
		columnsresize: true,
		source: dataAdapter,
		showstatusbar: true,
		showaggregates: true,
		columns: [
			{ text: languagePack.common.location,		datafield: 'LocationName'  },
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
			{ text: languagePack.datetime.sunday,   	datafield: 'Domingo',   width: 150, aggregates:
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









