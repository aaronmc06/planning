/*============================================================
	Property of:		MISOM TECHNOLOGIES
	Developer:			JORGE MURILLO
	Application Name:	FARA_FRESNILLO
	Directory:			FARA_FRESNILLO/PLANNING/JS/REVIEW_JS
	File Name:			jqxgrid_employees.js
=============================================================*/

function getEmployees(areaFilter, stepFilter, measureFilter){
	employeeArray = [];
	
	$('#employeesGrid').jqxGrid('destroy');
	$("#jqGrid1").html('<div class="titleGrid"> - '+languagePack.review.byEmployees+'</div><div id="employeesGrid"></div>');
	
	$.getJSON(ruIP + ruPort + planningDB + planningEN + "read/dbo/v_Summary_ByPersonnel?where=\"Shiftdate between '"+moment($("#plan_week_selector").val()).format("YYYY/MM/DD")+"' and '"+moment($("#plan_week_selector").val()).add(6,'days').format("YYYY/MM/DD")+"'"+areaFilter+stepFilter+measureFilter+" ORDER BY Shiftdate ASC\"", function( employeeData ) {

		for(var key in employeeData) {
			var repeatEmp = false;
			var employeeObj = {};
			
			for(var i = 0; i < employeeArray.length; i++){
				if(employeeArray[i].EmployeeName == employeeData[key].EmployeeName && employeeData[key].SUM){
					(employeeData[key].SUM) ? employeeArray[i][moment(employeeData[key].Shiftdate.split("Z")[0]).format('dddd')] += (Math.round(employeeData[key].SUM * 10) / 10) : employeeObj[moment(employeeData[key].Shiftdate.split("Z")[0]).format('dddd')] += 0;
					repeatEmp = true;
				}
			}
			
			if(repeatEmp == false && employeeData[key].SUM){
				employeeObj.EmployeeName = employeeData[key].EmployeeName;
				employeeObj.Step_GUID = employeeData[key].Step_GUID;
				employeeObj.Measure_GUID = employeeData[key].Measure_GUID;
				employeeObj["Lunes"]		= 0;
				employeeObj["Martes"]		= 0;
				employeeObj["Miércoles"]	= 0;
				employeeObj["Jueves"]		= 0;
				employeeObj["Viernes"]		= 0;
				employeeObj["Sábado"]		= 0;
				employeeObj["Domingo"]		= 0;
				(employeeData[key].SUM) ? employeeObj[moment(employeeData[key].Shiftdate.split("Z")[0]).format('dddd')] += (Math.round(employeeData[key].SUM * 10) / 10) : employeeObj[moment(employeeData[key].Shiftdate.split("Z")[0]).format('dddd')] += 0;
				
				employeeArray.push(employeeObj);
			}
		}
		if(employeeArray.length > 0){
			loadEmployees();
		}
		else{
			$('#jqGrid1').append('<div class="emptyGrid">'+languagePack.review.noFields +$("#measureDD option:selected").text()+' '+ languagePack.review.byEmployees +'.</div>');
		}		
	});
}

function loadEmployees(){
	var jsonGrid = JSON.stringify(employeeArray);
	
	var source =
	{
		datatype: "json",
		datafields: [
			{ name: 'EmployeeName',  type: 'string' },
			{ name: 'Lunes',         type: 'float' },
			{ name: 'Martes',        type: 'float' },
			{ name: 'Miércoles',     type: 'float' },
			{ name: 'Jueves',        type: 'float' },
			{ name: 'Viernes',       type: 'float' },
			{ name: 'Sábado',        type: 'float' },
			{ name: 'Domingo',       type: 'float' }
		],
		localdata: jsonGrid
	};
	
	var dataAdapter = new $.jqx.dataAdapter(source);
	$("#employeesGrid").jqxGrid(
	{
		width: '100%',
		autoheight: true,
		columnsresize: true,
		source: dataAdapter,
		showstatusbar: true,
		showaggregates: true,
		
		columns: [
			{ text: languagePack.common.employee,		datafield: 'EmployeeName'  },
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









