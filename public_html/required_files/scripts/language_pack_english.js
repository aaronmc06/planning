/*============================================================
	Property of:		MISOM TECHNOLOGIES
	Developer:			AARON MCCOLOUGH
	Directory:			REQUIRED FILES
	File Name:			language_pack_spanish.js
=============================================================*/

var languagePack = (function() {

	//---------- MAIN LANGUAGE PACK OBJECT ----------
	var languagePack = {};


	//----------   AREA MACHINE CONFIGURATION   ----------
	languagePack.areaMachine = {};

	languagePack.areaMachine.areaAlreadyMapped	= "already mapped to this Area.";
	languagePack.areaMachine.invalidMachine		= "You have not selected a valid machine.";
	languagePack.areaMachine.invalidMachineType	= "You have not selected a valid machine type.";
	languagePack.areaMachine.title1				= "Area";
	languagePack.areaMachine.title2				= "Machines";

	languagePack.areaMachine.grid1 = {};

	languagePack.areaMachine.grid1.AreaDisplayName			= "Area";
	languagePack.areaMachine.grid1.MachineDisplayName		= "Machine";
	languagePack.areaMachine.grid1.MachineTypeDisplayName	= "Machine Type";
	languagePack.areaMachine.grid1.IsHelper					= "Helper";
	
	
	//----------   CALENDAR VIEW   ---------- 
	languagePack.calendar = {};
	
	languagePack.calendar.forLocation			= "For Location";
	languagePack.calendar.howMany				= "How many";
	languagePack.calendar.variety				= "Variety";
	languagePack.calendar.planPreparation		= "Plan Preparation";
	languagePack.calendar.noActivitiesAvailable	= "No Steps Available";
	languagePack.calendar.questionName			= "Question Name";


	//----------   CHECKLIST CONFIGURATION   ----------
	languagePack.checklists = {};

	languagePack.checklists.checklistTypes		= "Checklist Types";
	languagePack.checklists.checklistQuestions	= "Checklist Questions";
	languagePack.checklists.noQuestionName		= "You do not have a valid question name.";
	languagePack.checklists.noQuestionGroup		= "You do not have a valid question group.";
	languagePack.checklists.noInputType			= "You do not have a valid input type.";

	languagePack.checklists.grid1 = {};

	languagePack.checklists.grid1.ChecklistTypes	= "Checklist Type";
	languagePack.checklists.grid1.UsageType			= "Usage Type";

	languagePack.checklists.grid2 = {};

	languagePack.checklists.grid2.QuestionName			= "Question Name";
	languagePack.checklists.grid2.Group					= "Group";
	languagePack.checklists.grid2.InputType1			= "Input Type 1";
	languagePack.checklists.grid2.InputType2			= "Input Type 2";
	languagePack.checklists.grid2.InputType3			= "Input Type 3";
	languagePack.checklists.grid2.MachineDisplayName	= "Machine DisplayName";
	languagePack.checklists.grid2.CommentsRequired		= "Comments Required";
	languagePack.checklists.grid2.IsMandatory			= "Mandatroy";


	//----------   COMMON   ----------
	languagePack.common = {};

	languagePack.common.selectOption	= "-- Select --";
	languagePack.common.selectEmployee	= "-- Select Employee --";
	languagePack.common.selectPosition	= "-- Select Position --";
	languagePack.common.generating		= "Generating...";
	languagePack.common.loading			= "Loading...";
	languagePack.common.update			= "Update";
	languagePack.common.del				= "Delete";
	languagePack.common.resetPass		= "Reset Password";
	languagePack.common.configuration	= "Configuration";
	languagePack.common.acceptChanges	= "Accept Changes";
	languagePack.common.saveChanges		= "Save Changes";
	languagePack.common.updateChanges	= "Upload Changes";
	languagePack.common.submit			= "Submit";
	languagePack.common.print			= "Print";
	languagePack.common.accept			= "Accept";
	languagePack.common.week			= "Week";
	languagePack.common.cancel			= "Cancel";
	languagePack.common.date			= "Date";
	languagePack.common.shift			= "Shift";
	languagePack.common.first			= "Morning";
	languagePack.common.second			= "Evening";
	languagePack.common.third			= "Night";
	languagePack.common.comments		= "Comments";
	languagePack.common.apply 			= "Apply";
	languagePack.common.area			= "Area";
	languagePack.common.process			= "Process";
	languagePack.common.method			= "Method";
	languagePack.common.activity		= "Step";
	languagePack.common.measure			= "Measure";
	languagePack.common.pending			= "Pending";
	languagePack.common.rejected		= "Rejected";
	languagePack.common.approved		= "Approved";
	languagePack.common.employee		= "Employee";
	languagePack.common.location		= "Location";
	languagePack.common.location_s		= "Location(s)";
	languagePack.common.machine			= "Machine";
	languagePack.common.planning		= "Planning";
	languagePack.common.status 			= "Status";
	languagePack.common.yes				= "Yes";
	languagePack.common.no				= "No";
	languagePack.common.commonFields    = "Common Fields";
	languagePack.common.addRow		    = "Add New Row";
	languagePack.common.num			    = "#";
	languagePack.common.checkbox	    = "Checkbox";
	languagePack.common.textarea	    = "Textarea";
	languagePack.common.field		    = "Field";
	languagePack.common.of1			    = "of";
	languagePack.common.of2			    = "of";
	languagePack.common.production		= "Production";
	languagePack.common.development		= "Development";
	languagePack.common.operating		= "Ready";
	languagePack.common.down			= "Down";
	languagePack.common.startOfShift	= "Start of Shift";
	languagePack.common.endOfShift		= "Fin de TurnoEnd of Shift";
	languagePack.common.search			= "Search";
	languagePack.common.site			= "Site";
	languagePack.common.confirmation	= "Confirmation";
	
	
	//----------   DATETIME OPTIONS   ----------
	languagePack.datetime = {};
	
	languagePack.datetime.monday			= "Monday";
	languagePack.datetime.tuesday			= "Tuesday";
	languagePack.datetime.wednesday			= "Wednesday";
	languagePack.datetime.thursday			= "Thursday";
	languagePack.datetime.friday			= "Friday";
	languagePack.datetime.saturday			= "Saturday";
	languagePack.datetime.sunday			= "Sunday";
	languagePack.datetime.mon				= "Mon";
	languagePack.datetime.tue				= "Tue";
	languagePack.datetime.wed				= "Wed";
	languagePack.datetime.thu				= "Thu";
	languagePack.datetime.fri				= "Fri";
	languagePack.datetime.sat				= "Sat";
	languagePack.datetime.sun				= "Sun";
	languagePack.datetime.firstShift		= "First Shift";
	languagePack.datetime.secondShift		= "Secoond Shift";
	languagePack.datetime.thirdShift		= "Third Shift";
	languagePack.datetime.firstShiftAbbr	= "1st";
	languagePack.datetime.secondShiftAbbr	= "2nd";
	languagePack.datetime.thirdShiftAbbr	= "3rd";
	languagePack.datetime.forTheWeekOf		= "For the week of";
	languagePack.datetime.startDate			= "Start Date";
	languagePack.datetime.endDate			= "End Date";
	languagePack.datetime.weekof			= "Week of:";
	languagePack.datetime.duration			= "Duration (hrs)";
	languagePack.datetime.days				= "Days";


	//----------   DOWN CODES CONFIGURATION   ----------
	languagePack.downCodes = {};

	languagePack.downCodes.title				= "Down Codes";
	languagePack.downCodes.invalidReasonCode	= "You have not selected a valid Reason Code.";
	languagePack.downCodes.invalidStartTime		= "You have not selected a valid Start Time.";
	languagePack.downCodes.invalidArrivalTime	= "You have not selected a valid Arrival Time.";
	languagePack.downCodes.invalidfinishTime	= "You have not selected a valid Finish Time.";

	languagePack.downCodes.grid1 = {};

	languagePack.downCodes.grid1.ShiftDate				= "Shift Date";
	languagePack.downCodes.grid1.Shift					= "Shift";
	languagePack.downCodes.grid1.LocationDisplayName	= "Location";
	languagePack.downCodes.grid1.MachineDisplayName		= "Machine";
	languagePack.downCodes.grid1.MachineStatus			= "Machine Status";
	languagePack.downCodes.grid1.OperatorDisplayName	= "Operator";
	languagePack.downCodes.grid1.CreatedByDisplayName	= "Created By";
	languagePack.downCodes.grid1.ReasonCodeDisplayName	= "Reason Code";
	languagePack.downCodes.grid1.DownStartTime			= "Dpown Begin Time";
	languagePack.downCodes.grid1.MaintenanceArrivalTime	= "Maintenance Arrival Time";
	languagePack.downCodes.grid1.DownFinishTime			= "Down End Time";
	languagePack.downCodes.grid1.Comment				= "Comments";
	languagePack.downCodes.grid1.IsCompleted			= "Is Completed";


	//----------   EMPLOYEE MACHINE CONFIGURATION   ----------
	languagePack.employeeMachine = {};

	languagePack.employeeMachine.title				= "Employee - Machine";
	languagePack.employeeMachine.invalidEmployee	= "You have not selected a valid employee.";
	languagePack.employeeMachine.invalidMachine		= "You have not selected a valid machine.";
	languagePack.employeeMachine.selectPositionFor	= "You need to select a position for";

	languagePack.employeeMachine.grid1 = {};

	languagePack.employeeMachine.grid1.EmployeeName			= "Employee";
	languagePack.employeeMachine.grid1.MachineDisplayName	= "Machine";
	languagePack.employeeMachine.grid1.IsOperator			= "Operator";
	languagePack.employeeMachine.grid1.IsHelper				= "Helper";
	
	
	//----------   GRID DISPLAY   ----------
	languagePack.grid = {};
	
	languagePack.grid.percentsymbol						= "%";
	languagePack.grid.currencysymbol					= "$";
	languagePack.grid.currencysymbolposition			= "before";
	languagePack.grid.decimalseparator					= ".";
	languagePack.grid.thousandsseparator				= ",";
	languagePack.grid.pagergotopagestring				= "Go to page:";
	languagePack.grid.pagershowrowsstring				= "Show Rows:";
	languagePack.grid.pagerrangestring					= " of ";
	languagePack.grid.pagerpreviousbuttonstring			= "previous";
	languagePack.grid.pagernextbuttonstring				= "next";
	languagePack.grid.pagerfirstbuttonstring			= "first";
	languagePack.grid.pagerlastbuttonstring				= "last";
	languagePack.grid.groupsheaderstring				= "Drag a column and drop it here to group by that column";
	languagePack.grid.sortascendingstring				= "Sort Ascending";
	languagePack.grid.sortdescendingstring				= "Sort Descending";
	languagePack.grid.sortremovestring					= "Remove Sort";
	languagePack.grid.groupbystring						= "Group By this column";
	languagePack.grid.groupremovestring					= "Remove from groups";
	languagePack.grid.filterclearstring					= "Clear";
	languagePack.grid.filterstring						= "Filter";
	languagePack.grid.filtershowrowstring				= "Show rows where:";
	languagePack.grid.filtershowrowdatestring			= "Show rows where date:";
	languagePack.grid.filterorconditionstring			= "Or";
	languagePack.grid.filterandconditionstring			= "And";
	languagePack.grid.filterselectallstring				= "(Select All)";
	languagePack.grid.filterchoosestring				= "Please Choose:";
	languagePack.grid.filterstringcomparisonoperators	= [ "empty", "not empty", "contains", "contains(match case)", "does not contain", "does not contain(match case)", "starts with", "starts with(match case)", "ends with", "ends with(match case)", "equal", "equal(match case)", "null", "not null" ],
	languagePack.grid.filternumericcomparisonoperators	= [ "equal", "not equal", "less than", "less than or equal", "greater than", "greater than or equal", "null", "not null" ],
	languagePack.grid.filterdatecomparisonoperators		= [ "equal", "not equal", "less than", "less than or equal", "greater than", "greater than or equal", "null", "not null" ],
	languagePack.grid.filterbooleancomparisonoperators	= [ "equal", "not equal" ],
	languagePack.grid.validationstring					= "Entered value is not valid";
	languagePack.grid.emptydatastring					= "No data to display";
	languagePack.grid.filterselectstring				= "Select Filter";
	languagePack.grid.loadtext							= "Loading...";
	languagePack.grid.clearstring						= "Clear";
	languagePack.grid.todaystring						= "Today";


	//----------   INDEX PAGE FOR LOGIN    ----------
	languagePack.index = {};

	languagePack.index.title	= "Fresnillo - Login";
	languagePack.index.okay		= "okay";
	languagePack.index.accept	= "Accept";
	languagePack.index.contin	= "Continue";
	languagePack.index.username	= "Username";
	languagePack.index.password	= "Password";
	languagePack.index.login	= "Login";
	languagePack.index.version	= "V4.8 R01";
	
	
	//----------   LINEUP   ----------
	languagePack.lineup = {};
	
	languagePack.lineup.header			= "Plans for Lineup";
	languagePack.lineup.lineup			= "Lineup";
	languagePack.lineup.newLineup		= "New Lineup";
	languagePack.lineup.selectStep		= "You must select a step.";
	languagePack.lineup.addNewStep		= "You must first add a new step.";
	languagePack.lineup.selectMethod	= "You must select a method.";
	languagePack.lineup.selectLocation	= "You must select a location.";
	languagePack.lineup.selectOperator	= "You must select an operator.";
	languagePack.lineup.selectProcess	= "You must select a process.";
	languagePack.lineup.addNewLineup	= "You must first add a new Lineup.";
	languagePack.lineup.lineupExists	= "A lineup has already been generated for that location.";


	//----------   LOCATION GRADE CONFIGURATION   ----------
	languagePack.locationGrade = {};

	languagePack.locationGrade.title			= "Location grade";
	languagePack.locationGrade.invalidLocation	= "You have not selected a valid location.";
	languagePack.locationGrade.invalidDate		= "You can not have two records for the same location on the same date.";
	languagePack.locationGrade.invalidLocation	= "You have not selected a valid location.";

	languagePack.locationGrade.grid1 = {};

	languagePack.locationGrade.grid1.LocationDisplayName	= "Location";
	languagePack.locationGrade.grid1.Mined_Width			= "Mined Width (m)";
	languagePack.locationGrade.grid1.Vein_Width				= "Vein Width (m)";
	languagePack.locationGrade.grid1.length					= "Length (m)";
	languagePack.locationGrade.grid1.meters_advanced		= "Meters Advanced (m)";
	languagePack.locationGrade.grid1.GoldGrade				= "Gold Grade (g/t)";
	languagePack.locationGrade.grid1.SilverGrade			= "Silver Grade (g/t)";
	languagePack.locationGrade.grid1.LeadGrade				= "Lead Grade (%)";
	languagePack.locationGrade.grid1.ZincGrade				= "Zinc Grade (%)";
	languagePack.locationGrade.grid1.DateEffective			= "Date";


	//----------   LOCATIONS CONFIGURATION   ----------
	languagePack.locations = {};

	languagePack.locations.title				= "Locations";
	languagePack.locations.invalidLocation		= "You have not entered a valid location.";
	languagePack.locations.invalidCommonName	= "You have not entered a valid common name.";
	languagePack.locations.invalidLocationCode	= "You have not entered a valid Location Code.";
	languagePack.locations.invalidArea			= "You have not entered a valid Area.";
	languagePack.locations.invalidWorkCode		= "You have not entered a valid Work Code.";
	languagePack.locations.invalidLevel			= "You have not entered a valid Level.";
	languagePack.locations.invalidLevelNum		= "Level must be a number.";
	languagePack.locations.invalidOrientation	= "You have not entered a valid Orientation.";
	languagePack.locations.invalidKeyVein		= "You have not entered a valid Key Vein.";
	languagePack.locations.invalidReferenceLine	= "You have not entered a valid Reference Line.";
	languagePack.locations.invalidGeologyStatus	= "You have not entered a valid Geology Status.";

	languagePack.locations.grid1 = {};

	languagePack.locations.grid1.LocationName				= "Location";
	languagePack.locations.grid1.AreaDisplayName			= "Area";
	languagePack.locations.grid1.ObraDisplayName			= "Work";
	languagePack.locations.grid1.Level						= "Level";
	languagePack.locations.grid1.ReferenceLine				= "Reference Line";
	languagePack.locations.grid1.Orientation				= "Orientation";
	languagePack.locations.grid1.VetaClaveDisplayName		= "Key Vein";
	languagePack.locations.grid1.LocationDisplayName		= "Common Name";
	languagePack.locations.grid1.LocationCode				= "Location Code";
	languagePack.locations.grid1.GeologyStatusDisplayName	= "Geology Status";
	languagePack.locations.grid1.MinestatusDisplayName		= "Mine status";
	languagePack.locations.grid1.Elevation					= "Elevation";
	languagePack.locations.grid1.BlockName					= "Block";
	languagePack.locations.grid1.Length						= "Length";


	//----------   LOCATION STATUS CONFIGURATION   ----------
	languagePack.locationStatus = {};

	languagePack.locationStatus.title			= "Location Status";
	languagePack.locationStatus.invalidStatus	= "You have not selected a valid Status.";

	languagePack.locationStatus.grid1 = {};

	languagePack.locationStatus.grid1.AreaDisplayName			= "Area";
	languagePack.locationStatus.grid1.ZoneDisplayName			= "Zone";
	languagePack.locationStatus.grid1.LocationDisplayName		= "Location";
	languagePack.locationStatus.grid1.LocationStatusDisplayName	= "Status";


	//----------   MACHINE MEASURES CONFIGURATION   ----------
	languagePack.machineMeasures = {};

	languagePack.machineMeasures.title1			= "Machines";
	languagePack.machineMeasures.title2			= "Measures";
	languagePack.machineMeasures.invalidMeasure	= "You have not selected a valid measure.";

	languagePack.machineMeasures.grid1 = {};

	languagePack.machineMeasures.grid1.DisplayName		= "Display Name";
	languagePack.machineMeasures.grid1.MachineTypeCode	= "MachineTypeCode";
	
	languagePack.machineMeasures.grid2 = {};

	languagePack.machineMeasures.grid2.MachineTypeDisplayName	= "MachineType";
	languagePack.machineMeasures.grid2.MeasureCategoryDisplayName		= "Measure Category";
	languagePack.machineMeasures.grid2.MeasureDisplayName		= "Measure";


	//----------   MEASURES CONFIGURATION   ----------
	languagePack.measures = {};

	languagePack.measures.title					= "Measures";
	languagePack.measures.invalidMeasure		= "You have not selected a valid measure.";
	languagePack.measures.invalidMeasureType	= "You have not selected a valid measure type.";
	languagePack.measures.invalidDisplayName	= "You have not selected a valid display name.";

	languagePack.measures.grid1 = {};

	languagePack.measures.grid1.MeasureDisplayName			= "Measure";
	languagePack.measures.grid1.MeasureTypeDisplayName		= "Measure Type";
	languagePack.measures.grid1.MeasureCategoryDisplayName	= "Measure Category";
	languagePack.measures.grid1.IsLineupMeasure				= "For Lineup";
	
	
	//----------   MENU DISPLAY   ----------
	languagePack.menu = {};
	
	languagePack.menu.crumbDefaultText	= "Choose an option";
	languagePack.menu.backLinkText		= "Back";


	//----------   INDEX PAGE FOR MENU   ----------
	languagePack.menu_index = {};

	languagePack.menu_index.title			= "FARA Fresnillo";
	languagePack.menu_index.welcome			= "Welcome ";
	languagePack.menu_index.globalFilters	= "Global Filters";
	languagePack.menu_index.area			= "Area:";
	languagePack.menu_index.zone			= "Zone:";
	languagePack.menu_index.applyFilters	= "Apply Filters";
	languagePack.menu_index.okay			= "Okay";
	languagePack.menu_index.yes				= "Yes";
	languagePack.menu_index.no				= "No";
	languagePack.menu_index.displayName		= "Display Name:";
	languagePack.menu_index.oldPass			= "Old Password:";
	languagePack.menu_index.newPass			= "New Password:";
	languagePack.menu_index.language		= "Language:";
	languagePack.menu_index.english			= "English";
	languagePack.menu_index.spanish			= "Spanish";


	//----------   MESSAGES   ----------
	languagePack.message = {};

	languagePack.message.error					= "Error!";
	languagePack.message.alert					= "Alert!";
	languagePack.message.success				= "Success!";
	languagePack.message.confirm				= "Confirm";
	languagePack.message.incorrectLogin			= "Your login was incorrect";
	languagePack.message.confirmRecordDelete	= "Are you sure you want to delete this record?";
	languagePack.message.confirmPassReset		= "Are you sure you want to reset this users password?";
	languagePack.message.unsavedChanges			= "You have unsaved changes, do you want to continue without saving?";
	languagePack.message.recordsStored			= "Records have been created in the database";
	languagePack.message.recordsUpdated			= "Records have been updated.";
	languagePack.message.recordsNotStored		= "Records have not been created in the database.";
	languagePack.message.recordsNotUpdated		= "Records have not been updated.";
	languagePack.message.recordsDeleted			= "Records have been deleted.";
	languagePack.message.displayName			= "You must have a display name.";
	languagePack.message.oldPass				= "You did not enter your current password correctly.";
	languagePack.message.newPass				= "Your new password must be atleast 6 characters long.";
	languagePack.message.filtersSelected		= "Make sure all filters are selected.";	
	languagePack.message.youHave				= "You have";
	languagePack.message.plansToReview			= "plans to review.";
	languagePack.message.selectProcess			= "You must select a process.";
	languagePack.message.selectMethod			= "You must select a method.";
	languagePack.message.noPlansAssigned		= "No plans assigned";
	languagePack.message.forTheWeekOf			= "for the week of";
	languagePack.message.submittingPlan			= "About to submit the plan, do you wish to continue?";
	languagePack.message.cannotSubmitPlan		= "You cannot submit the plan as there is no superintendent assigned to the current area.";
	languagePack.message.noPlans				= "No approved plans exist for this date and location.";
	languagePack.message.noSameMethods			= "You cannot assign different methods to the same shift.";
	languagePack.message.oneDayStep				= "You must select at least one day per activity.";
	languagePack.message.oneStepShift			= "You cannot assign an activity to a shift more than once.";
	languagePack.message.needStep				= "You must first add an activity before submitting the plan.";
	languagePack.message.requiredQuestion 		= "Required Question";
	languagePack.message.required		 		= "Required";
	languagePack.message.replaceStep			= "Are you sure you want to replace the actaul step with the one selected?";
	languagePack.message.updateDurationStep		= "Do you want to update the actual step duration?";
	languagePack.message.replaceMachine			= "Do you want to replace the machine asigned for the one selected?";
	languagePack.message.removeLocationPlan		= "Are you sure you want to remove Location from Plan?";
	languagePack.message.adjustAreaZoneWeek		= "Area, Zone and Week filters have been adjusted.";
	languagePack.message.rejectPlan				= "Are you sure you want to reject the plan?";
	languagePack.message.approvePlan			= "Are you sure you want to approve the plan?";
	languagePack.message.selectAllFields		= "You need to select all required fields.";
	languagePack.message.needOperator			= "You must select an operator for the selected machine.";
	languagePack.message.confirmUpdateMachine1	= "Do you want to update the status of the following machine(s) to down?";
	languagePack.message.theEmail				= "The email,";
	languagePack.message.enterSiteName			= "Please enter a site name.";
	languagePack.message.enterFirstName			= "Please enter a first name.";
	languagePack.message.enterLastName			= "Please enter a last name.";
	languagePack.message.enterEmailAddress		= "Please enter an email address.";
	languagePack.message.cantCreateTables		= "Unable to Create Tables.";
	languagePack.message.cantCreateTableElem	= "Unable to Create Table Elements.";
	languagePack.message.newSiteSuccesful1		= "A new site has been successfully setup! An email has been sent to";
	languagePack.message.newSiteSuccesful2		= "with a temporary password.";
	languagePack.message.newUserFailed			= "Creating a new user has failed.";
	languagePack.message.consultAdmin			= "Please consult you system Administrator for help.";
	languagePack.message.mdm1					= "Please Select a Down Code.";
	languagePack.message.mdm2					= "Down Start Time can not be greater than Maintenance Arrival Time.";
	languagePack.message.mdm3					= "Down Start Time can not be greater than Down End Time.";
	languagePack.message.mdm4					= "Maintenance Arrival Time cannot be greater than  Down End Time.";
	languagePack.message.mdm5					= "You must enter a Down Start Time.";
	languagePack.message.mdm6					= "You must enter a Down End Time.";
	languagePack.message.mdm7					= "Down Start Time must begin after the start of the shift.";
	languagePack.message.mdm8					= "Down End Time must end before the end of the shift.";


	//----------   METHOD STEP CONFIGURATION   ----------
	languagePack.methodStep = {};

	languagePack.methodStep.title1				= "Method";
	languagePack.methodStep.title2				= "Steps";
	languagePack.methodStep.invalidStep			= "You have not entered a valid step name.";
	languagePack.methodStep.invalidDisplayName	= "You have not entered a valid display name.";
	languagePack.methodStep.invalidOrden		= "Ordinal cannot be less than 1 or greater than.";

	languagePack.methodStep.grid1 = {};

	languagePack.methodStep.grid1.MineProcessDisplayName	= "Process";
	languagePack.methodStep.grid1.MethodDisplayName			= "Method";
	
	languagePack.methodStep.grid2 = {};

	languagePack.methodStep.grid2.StepOrdinal		= "Ordinal";
	languagePack.methodStep.grid2.MethodDisplayName	= "Method";
	languagePack.methodStep.grid2.StepDisplayName	= "Step";
	languagePack.methodStep.grid2.IsLineup			= "For Lineup";


	//----------   PERSON AREAS CONFIGURATION   ----------
	languagePack.personArea = {};

	languagePack.personArea.title1				= "Users";
	languagePack.personArea.title2				= "Areas";
	languagePack.personArea.invalidArea			= "You have not selected a valid Area.";

	languagePack.personArea.grid1 = {};

	languagePack.personArea.grid1.DisplayName		= "Display Name";
	languagePack.personArea.grid1.Email				= "Email";
	languagePack.personArea.grid1.RoleDisplayName	= "Role";
	
	languagePack.personArea.grid2 = {};

	languagePack.personArea.grid2.PersonDisplayName	= "User";
	languagePack.personArea.grid2.AreaDisplayName	= "Area";
	
	
	//----------   PLANNING SYSTEM   ----------
	languagePack.planning = {};
	
	languagePack.planning.plan				= "Plan";
	languagePack.planning.header			= "Plan Configuration";
	languagePack.planning.location			= "Location:";
	languagePack.planning.step				= "Step";
	languagePack.planning.all				= "All";
	languagePack.planning.process			= "Process:";
	languagePack.planning.method			= "Method:";
	languagePack.planning.machine			= "Machine";
	languagePack.planning.operator			= "Operator";
	languagePack.planning.helper			= "Helper";
	languagePack.planning.op				= "Op";
	languagePack.planning.he				= "He";
	languagePack.planning.addStep			= "Add Step";
	languagePack.planning.generatePlan		= "Generate Plan";
	languagePack.planning.configureSteps	= "Configure Steps";
	languagePack.planning.planningSystem	= "Planning System";
	languagePack.planning.planning			= "Planning";
	languagePack.planning.review			= "Review";
	languagePack.planning.checklists		= "Checklists";
	languagePack.planning.lineup			= "Lineup";
	languagePack.planning.addPlan			= "Add a Plan";
	languagePack.planning.addLineup			= "Add Lineup";
	languagePack.planning.generateLineup	= "Generate Lineup";
	languagePack.planning.planStatus		= "Plan Status:";
	languagePack.planning.pending			= "PENDING...";
	languagePack.planning.approved			= "APPROVED";
	languagePack.planning.rejected			= "REJECTED";
	languagePack.planning.planningMeasures	= "Planning Measures";
	languagePack.planning.delayHours		= "Delay Hours";
	languagePack.planning.noCurrentPlans	= "No current plans for";
	languagePack.planning.delayComments		= "Delay Comments";
	languagePack.planning.noPlansShiftDate	= "No Plans for shift date.";
	languagePack.planning.empty				= "( Empty )";
	
	
	//----------   PRE-LINEUP   ----------
	languagePack.prelineup = {};
	
	languagePack.prelineup.plansForLineup			= "Plans for Lineup";
	languagePack.prelineup.newLineup				= "New Lineup";
	languagePack.prelineup.machineStatus			= "Machine Status";
	languagePack.prelineup.locationStatus			= "Location Status";
	languagePack.prelineup.endingMachineStatus		= "Ending Machine Status";
	languagePack.prelineup.endingLocationStatus		= "Ending Location Status";
	languagePack.prelineup.noLineupsAvailable		= "No Lineups available";
	languagePack.prelineup.machineDownEvent			= "Add Machine Down Event";
	languagePack.prelineup.downCode					= "Down Code";
	languagePack.prelineup.startDownTime			= "Start Down Time";
	languagePack.prelineup.responseTime				= "Response Time";
	languagePack.prelineup.endDownTime				= "End Down Time";
	languagePack.prelineup.observations				= "Observations";
	languagePack.prelineup.material					= "Material";
	languagePack.prelineup.materialType				= "Material Type";
	languagePack.prelineup.explosive				= "Explosive";
	languagePack.prelineup.haulage					= "Haulage";
	languagePack.prelineup.tons						= "Tons";
	languagePack.prelineup.production				= "Production";
	languagePack.prelineup.rehandle					= "Rehandle";
	languagePack.prelineup.fromLocation				= "From Location";
	languagePack.prelineup.numLoads					= "# of Loads";
	languagePack.prelineup.toLocation				= "To Location";
	languagePack.prelineup.real						= "Real";
	languagePack.prelineup.surplus					= "Surplus";
	languagePack.prelineup.top						= "Top";
	languagePack.prelineup.niche					= "Niche";
	languagePack.prelineup.overflow1				= "Underbreak Sides";
	languagePack.prelineup.overflow2				= "Underbreak Top";
	languagePack.prelineup.operatorTimeIn			= "Operator Time arrival at location";
	languagePack.prelineup.operatorTimeOut			= "Operator Time leave location";
	languagePack.prelineup.startShiftLocation		= "Machine Location at Start of Shift";
	languagePack.prelineup.endShiftLocation			= "Machine Location at End of Shift";
	languagePack.prelineup.activitiesPerformed		= "Activities Performed";
	languagePack.prelineup.activitiesNotPerformed	= "Activities Not Performed";
	languagePack.prelineup.startOfShift				= "Start of Shift";
	languagePack.prelineup.endOfShift				= "End of Shift";
	languagePack.prelineup.response					= "Response";
	languagePack.prelineup.measurePerStep			= "Measure Per Step";
	languagePack.prelineup.hydraulicOil				= "Hydraulic Oil";
	languagePack.prelineup.fuelLevel				= "Fuel Level";
	languagePack.prelineup.electricalSource			= "Electrical Source";
	languagePack.prelineup.deleteLinuepConfirm		= "You are about to permanently delete this lineup, do you wish to continue?";
	languagePack.prelineup.createLateLinuep			= "You can not create a linuep for a day other than today.";
	languagePack.prelineup.timeInOrder				= "El inicio debe ser antes de T. Respuesta y del Fin, y T. Respuesta debe ser antes del Fin.";
	languagePack.prelineup.timeInOrder				= "Begin time must occur before arrival time and end time, and arrival time must occur before end time.";
	languagePack.prelineup.pendingChecklist			= "The current checklist is still saving."
	
	
	//----------   REVIEW VIEW   ---------- 
	languagePack.review = {};
	
	languagePack.review.reviewPlans 	= "Review Plans";
	languagePack.review.byEmployees 	= "By Employees";
	languagePack.review.byLocations		= "By Locations";
	languagePack.review.byMachines		= "By Machines";
	languagePack.review.noFields		= "No rows exist for";
	languagePack.review.weekOf			= "Week of";
	languagePack.review.deliveryHour	= "Delivery Hour";
	languagePack.review.noPlansReview	= "No plans to review";


	//----------   STEP LOCATION STATUS CONFIGURATION   ----------
	languagePack.stepLocationStatus = {};

	languagePack.stepLocationStatus.title1					= "Location Status'";
	languagePack.stepLocationStatus.title2					= "Steps";
	languagePack.stepLocationStatus.invalidDisplayName		= "You have not entered a valid display name.";
	languagePack.stepLocationStatus.invalidStep				= "You have not selected a valid step.";
	languagePack.stepLocationStatus.invalidStepDisplayName	= "You have not selected a valid step display name.";
	languagePack.stepLocationStatus.invalidProcess			= "You have not selected a valid process.";
	languagePack.stepLocationStatus.invalidMethod			= "You have not selected a valid method.";

	languagePack.stepLocationStatus.grid1 = {};

	languagePack.stepLocationStatus.grid1.DisplayName	= "Display Name";
	
	languagePack.stepLocationStatus.grid2 = {};

	languagePack.stepLocationStatus.grid2.LocationStatus_DisplayName	= "Status";
	languagePack.stepLocationStatus.grid2.MineProcess_DisplayName		= "Process";
	languagePack.stepLocationStatus.grid2.Method_DisplayName			= "Method";
	languagePack.stepLocationStatus.grid2.Step_DisplayName				= "Step";


	//----------   STEP MEASURE CONFIGURATION   ----------
	languagePack.stepMeasure = {};

	languagePack.stepMeasure.title1					= "Steps";
	languagePack.stepMeasure.title2					= "Measures";
	languagePack.stepMeasure.invalidMeasure			= "You have not selected a valid measure.";

	languagePack.stepMeasure.grid1 = {};

	languagePack.stepMeasure.grid1.StepOrdinal			= "Ordinal";
	languagePack.stepMeasure.grid1.MethodDisplayName	= "Method";
	languagePack.stepMeasure.grid1.StepDisplayName		= "Step";
	
	languagePack.stepMeasure.grid2 = {};

	languagePack.stepMeasure.grid2.StepDisplayName		= "Step";
	languagePack.stepMeasure.grid2.MeasureDisplayName	= "Measure";


	//----------   USERS CONFIGURATION   ----------
	languagePack.users = {};

	languagePack.users.title1			= "Manage Users";
	languagePack.users.title2			= "User List";
	languagePack.users.title3			= "Add New User";
	languagePack.users.chooseRole		= "Choose a Role";
	languagePack.users.emailInUse		= "That email is already in use.  Please enter a valid email.";
	languagePack.users.invalidEmail		= "You have not entered a valid email.";
	languagePack.users.invalidSite		= "You did not select a valid site.";
	languagePack.users.invalidRole		= "You did not select a valid role.";
	languagePack.users.invalidPass		= "Your new password must be atleast 6 characters long.";
	languagePack.users.SiteDisplayName	= "Site";
	languagePack.users.RoleDisplayName	= "Role";
	languagePack.users.FirstName		= "First Name";
	languagePack.users.MiddleName		= "Middle Name";
	languagePack.users.LastName			= "Last Name";
	languagePack.users.DisplayName		= "Display Name";
	languagePack.users.Email			= "Email";
	languagePack.users.AppUserName		= "User Name";
	languagePack.users.AppPassword		= "Password";
	languagePack.users.IsActive			= "Is Active";
	languagePack.users.AddUser			= "add user";
	languagePack.users.ConfirmDelete	= "Are you sure you want to delete this user?";


	//----------   ZONES CONFIGURATION   ----------
	languagePack.zones = {};

	languagePack.zones.title1				= "Zones";
	languagePack.zones.title2				= "Locations";
	languagePack.zones.invalidZone			= "You have not selected a valid zone.";
	languagePack.zones.invalidLocation		= "You have not selected a valid location."
	languagePack.zones.invalidDisplayName	= "You have not selected a valid display name.";
	languagePack.zones.invalidArea			= "You have not selected a valid Area.";

	languagePack.zones.grid1 = {};

	languagePack.zones.grid1.ZoneName			= "Zone";
	languagePack.zones.grid1.DisplayName		= "Display Name";
	languagePack.zones.grid1.AreaDisplayName	= "Area";
	
	languagePack.zones.grid2 = {};

	languagePack.zones.grid2.ZoneDisplayName		= "Zone";
	languagePack.zones.grid2.LocationDisplayName	= "Location";
	
	
	return languagePack;
	
})();







































