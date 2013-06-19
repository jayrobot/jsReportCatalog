/// <reference path="jquery-1.7.2-vsdoc.js" />

// jQuery.noconflict();
var AnimationDelay = 500;
var oTable;
/* calc the total space for table rows, assign it to iDisplayLength if desired */
var ts = parseInt((jQuery(window).height() - 270) / 22.9);
jQuery(document).ready(function () {
	// alert("Page ready!");
	// jQuery("#mainTable").tipsy({ gravity: jQuery.fn.tipsy.autoNS, html: true });
		
	jQuery(function () {

		// global setting override
		jQuery.extend(jQuery.gritter.options, {
			// class_name: 'gritter-light', for light notifications (can be added directly to $.gritter.add too)
			position: 'bottom-right', // possibilities: bottom-left, bottom-right, top-left, top-right
			fade_in_speed: 100, 		// how fast notifications fade in (string or int)
			fade_out_speed: 100, 	// how fast the notices fade out
			time: 3000					// hang on the screen for...
		});
	});

	/* Set the dataTables option for Page display and initialise the dataTable */
	// jQuery.fn.dataTableExt.oPagination.iFullNumbersShowPages = 5;
	// oTable = jQuery("mainTable").dataTable();
	oTable = jQuery("#mainTable").dataTable({ "sDom": '<"H"pf>t<"F"lri>'
									, "bLengthChange": true
									, "bFilter": true
									, "bInfo": true
									, "bStateSave": true
									, "iCookieDuration": 300
									, "iDisplayLength": 15
									, "sPaginationType": "two_button"
									, "aaSorting": [[0, 'asc'], [1, 'asc']]
									, "aoColumns": [{ bSearchable: true }
													, { bSearchable: true }
													, { "bSortable": false }
													, { "bSortable": true, bSearchable: true }
													, { "bSortable": true, bSearchable: true }
													, { "bSortable": true, bSearchable: true }
													, { "bSortable": true, bSearchable: true }
													, { "bSortable": false, "bVisible": false }
													, { "bSortable": false, "bVisible": false }
													, { "bSortable": false, "bVisible": false }
													, { "bSortable": false, "bVisible": false }
													, { "bSortable": false, "bVisible": false}]
									, "oLanguage": { "sLengthMenu": 'Display <select>' +
												   '<option value="5">5</option>' +
												   '<option value="10">10</option>' +
												   '<option value="15">15</option>' +
												   '<option value="20">20</option>' +
												   '<option value="25">25</option>' +
												   '<option value="50">50</option>' +
												   '<option value="-1">All</option>' +
												   '</select> records'
									}
	});

	/* hide the four togglable columns */
	oTable.fnSetColumnVis(3, false, false);
	oTable.fnSetColumnVis(4, false, false);
	oTable.fnSetColumnVis(5, false, false);
	oTable.fnSetColumnVis(6, false, true);

	/* hide the Return to Report Catalog button */
	jQuery('[ID$="btnReturn"]').hide();

	/* set Run Report button text */
	jQuery('[ID$="btnRunReport"]').attr("value", "Run Report");

	if (jQuery('[ID$="hfReportToRun"]').val() == "") {
		jQuery('[ID$="btnRunReport"]').attr("disabled", "disabled");
	}

	/* assign the click event for the filter labels */
	jQuery(".FilterLabel").click(function () {
		jQuery(".FilterLabel").css("font-weight", "normal");
		/* if it's already bolded, they're turning it off, unbold and bold the All option */
		if (jQuery(this).css("font-weight") == 700) {
			jQuery(this).css("font-weight", "normal");
			jQuery(".FilterLabel").first().css("font-weight", "bold");
			oTable.fnFilter("", 0, false, true, false);
		} else {
			/* unbold all others and bold the one they clicked on */
			jQuery(".FilterLabel").css("font-weight", "normal");
			jQuery(this).css("font-weight", "bold");
			var filter = jQuery(this).text();
			if (filter == "All") {
				oTable.fnFilter("", 0, false, true, false);
				if (jQuery(".dataTables_filter > input").val() != "") {
					jQuery(this).val("");
				}
			} else {
				oTable.fnFilter(filter, 0, false, true, false);
			}
		}
	});
	/* end of click event for filter labels */

	/* assign the click event for the column labels */
	jQuery(".ColumnLabel").click(function () {
		/* Column 3 = UserLastRun
		Column 4 = ProgramLastRun
		Column 5 = UserRank
		Column 6 = ProgramRank */

		/* figure out which column displayer they clicked on */
		var ControlContent = jQuery(this).html();
		var ColumnArray = new Array("Recent-You", "Recent-All", "Frequent-You", "Frequent-All");
		var Column = jQuery.inArray(ControlContent, ColumnArray) + 3;

		/* if it's already bolded, they're turning it off, unbold and remove the column */
		if (jQuery(this).css("font-weight") == 700) {
			jQuery(this).css("font-weight", "normal");
			oTable.fnSetColumnVis(Column, false, true);
			/* get the current sort order and if it's set to the column we're removing, reset the sort to default (category/report name) */
			var CurrentSort = oTable.fnSettings().aaSorting;
			if (CurrentSort[0].toString().substring(0, 6) == Column + ",desc" || CurrentSort[0].toString().substring(0, 5) == Column + ",asc") {
				oTable.fnSort([[0, 'desc'], [1, 'asc']]);
			}
		} else {
			/* bold the one they clicked on, display the column and set sort order to that column */
			jQuery(this).css("font-weight", "bold");
			oTable.fnSetColumnVis(Column, true, true);

			/* if the column is 3 or 4 (the recently runs), sort by the column descending, most recent first */
			var SortDirection = '';
			if (Column == 3 || Column == 4) {
				SortDirection = 'desc';
			} else {
				/* else it's either 5 or 6 (the frequency ranks), so sort ascending, top ranked first */
				SortDirection = 'asc';
			}
			oTable.fnSort([[Column, SortDirection], [1, 'asc']]);
		}
	});
	/* end of click event for column labels */

	/* Register the click event for each data row in the table to redraw criteria boxes */
	/* jQuery("#mainTable tbody").on("click", "tr:not([th])", function () { -- on not supported until jQuery 1.7 */

	/* jQuery("#mainTable tbody tr:not([th])").live('click', function () { */
	jQuery(document).on("click", "#mainTable tbody tr:not([th])", function () {
		/* set all rows in grid back to default background color */
		$AllRows = jQuery("#mainTable tbody tr:not([th])");
		if ($AllRows.length) {
			$AllRows.css("font-weight", "normal");
		}

		/* set the current row to bold to show highlighting */
		jQuery(this).css("font-weight", "bold");

		/* Get the position of the current data from the node */
		var aPos = oTable.fnGetPosition(this);
		/* pull out the elements we need from the data array for this row */
		var Criteria = oTable.fnGetData(aPos[0])[aPos][8];
		var Defaults = oTable.fnGetData(aPos[0])[aPos][9];

		var ReportCategory = oTable.fnGetData(aPos[0])[aPos][0];
		var ReportFK = oTable.fnGetData(aPos[0])[aPos][11];

		if (Criteria !== null && Criteria > "") {
			ToggleCriteriaBoxes(Criteria, Defaults);
		}
		var strReportName = oTable.fnGetData(aPos[0])[aPos][7];
		jQuery('[ID$="btnRunReport"]').removeAttr("disabled");

		jQuery('[ID$="hfCriteria"]').val(Criteria);
		jQuery('[ID$="hfDefaults"]').val(Defaults);
		jQuery('[ID$="hfReportCategory"]').val(ReportCategory);
		jQuery('[ID$="hfReportFK"]').val(ReportFK);
		jQuery('[ID$="hfReportToRun"]').val(strReportName);
		var InsertParameters = jQuery('[ID$="hfProgramFK"]').val() + ',' +
								oTable.fnGetData(aPos[0])[aPos][0] + ',' +
								oTable.fnGetData(aPos[0])[aPos][11] + ',' +
								oTable.fnGetData(aPos[0])[aPos][1] + ',  ,' +
								new Date() + ',' +
								jQuery('[ID$="hfUserName"]').val();
		jQuery('[ID$="hfInsertParameters"]').val(InsertParameters);

		/* if (jQuery('[ID$="hfCriteria"]').val() == "") {
		jQuery('[ID$="hfCriteria"]').val(Criteria);
		}

		if (jQuery('[ID$="hfDefaults"]').val() == "") {
		jQuery('[ID$="hfDefaults"]').val(Defaults);
		}
		// SetReportNameHiddenField(ReportName);

		if (jQuery('[ID$="hfReportCategory"]').val() == "") {
		jQuery('[ID$="hfReportCategory"]').val(ReportCategory);
		}
		if (jQuery('[ID$="hfReportFK"]').val() == "") {
		jQuery('[ID$="hfReportFK"]').val(ReportFK);
		}
		if (jQuery('[ID$="hfReportToRun"]').val() == "") {
		jQuery('[ID$="hfReportToRun"]').val(strReportName);
		}

		if (jQuery('[ID$="hfInsertParameters"]').val() == "") {
		var InsertParameters = jQuery('[ID$="hfProgramFK"]').val() + ',' +
		oTable.fnGetData(aPos[0])[aPos][0] + ',' +
		oTable.fnGetData(aPos[0])[aPos][11] + ',' +
		oTable.fnGetData(aPos[0])[aPos][1] + ',  ,' +
		new Date() + ',' +
		jQuery('[ID$="hfUserName"]').val();
		jQuery('[ID$="hfInsertParameters"]').val(InsertParameters);
		} */
	});
	/* end of on (click) event for data rows */

	/* register the change event for end date to display the run report button */
	jQuery('[ID$="txtEndDate"]').change(function () {
		/* alert(jQuery(this).val()); */

		if (jQuery(this).val() > "") {
			if (jQuery("#divRun").is(":hidden")) {
				jQuery("#divRun").show(AnimationDelay);
			}
		}
	});

	/* 'ul' */
	/* jQuery('[ID$="CollapsiblePanel"]').accordion({ multiple: true }); */
	/* jQuery('h4').collapsible(); */

	jQuery('[ID$="rbtnPC1ID"]').click(function () {
		if (jQuery(this).is(":checked")) {
			jQuery('[ID$="chkIncludeClosedCases"]').show(AnimationDelay);
		} else {
			jQuery('[ID$="chkIncludeClosedCases"]').hide();
		}
	});

	/* register the click event for chkIncludeClosedCases - must re-bind the pc1id list to the ddl, 
	toggle data source between with closed cases and without */
	jQuery('[ID$="chkIncludeClosedCases"]').click(function () {

		if (jQuery(this).is(":checked")) {
			//			var intPosTop = jQuery('[ID$="ddlPC1ID"]').css("top");
			//			var intPosLeft = jQuery('[ID$="ddlPC1ID"]').css("left");
			jQuery('[ID$="ddlPC1ID"]').hide();
			jQuery('[ID$="ddlPC1IDWithClosed"]').show(AnimationDelay);
			//			jQuery('[ID$="ddlPC1IDWithClosed"]').css({ 'top': intPosTop, 'left': intPosLeft }).show(AnimationDelay);

			//			if (jQuery('[ID$="ddlPC1ID"]').is(":visible")) {
			//				jQuery('[ID$="ddlPC1ID"]').hide();
			//			}
			//			if (jQuery('[ID$="ddlPC1IDWithClosed"]').is(":hidden")) {
			//				jQuery('[ID$="ddlPC1IDWithClosed"]').show(AnimationDelay);
			//			}
		} else {
			jQuery('[ID$="ddlPC1ID"]').show(AnimationDelay);
			jQuery('[ID$="ddlPC1IDWithClosed"]').hide();
			//			if (jQuery('[ID$="ddlPC1ID"]').is(":hidden")) {
			//				jQuery('[ID$="ddlPC1ID"]').show(AnimationDelay);
			//			}
			//			if (jQuery('[ID$="ddlPC1IDWithClosed"]').is(":visible")) {
			//				jQuery('[ID$="ddlPC1IDWithClosed"]').hide();
			//			}
		}
	});

	/* now hide the PC1ID list with closed cases until we need it */
	jQuery('[ID$="ddlPC1IDWithClosed"]').hide();

	/* register the click event for the run report button */
	/* jQuery("#btnRunReport").click(function () { */

	/* register a function for the window unload event to persist the criteria */
	jQuery(window).unload(function () {
		PersistCriteria();
	});

	/* register the click event for any of the ServRefBreakdown and HVLogBreakdown controls to set the togglables */
	jQuery('.ServRefBreakdown,.HVLogBreakdown').click(function () {
		var BreakdownRadioButtonValue = jQuery(this).text();
		ToggleBreakdown(BreakdownRadioButtonValue, jQuery(this).attr('class').substr(0, 5));
	});

	/* register the click event for any of the ByWhom controls to set the togglables */
	jQuery('.ByWhom').click(function () {
		var RadioButtonValue = jQuery(this).text();
		// var test1 = jQuery(this).attr("innerText");
		// var test2 = jQuery(this).val();
		ToggleByWhom(RadioButtonValue);
		//		jQuery.gritter.add({
		//			// (string | mandatory) the heading of the notification
		//			title: 'Toggling ByWhom!',
		//			// (string | mandatory) the text inside the notification
		//			text: 'The ByWhom controls should not be displaying according to the report clicked <a href="#" style="color:#ccc">report</a>.',
		//			// (string | optional) the image to display on the left
		//			image: '../Images/newh5.png',
		//			// (bool | optional) if you want it to fade out on its own or just sit there
		//			sticky: false,
		//			// (int | optional) the time you want it to be alive for before fading out
		//			time: ''
		//		});

		//		jQuery('#jGrowl').jGrowl("Toggling ByWhom!", {
		//			theme: "smoke",
		//			closer: false
		//		});

	});

	/* register the change event for the ddlQuarter control to fill in the start and end dates */
	jQuery('[ID$="ddlQuarter"]').change(function () {
		SetQuarterDates(jQuery(this));
	});

	/* register the click event for the quarter date options */
	jQuery('.Quarters').click(function () {
		var QuarterRadioButtonValue = jQuery(this).text();
		ToggleQuarters(QuarterRadioButtonValue);
	});

	jQuery('[ID$="ddlTSumSup"]').change(function () {
		jQuery('[ID$="rbtnTSumSup"]').attr('checked', 'checked');
	});

	jQuery('[ID$="ddlTSumWorkers"]').change(function () {
		jQuery('[ID$="rbtnTSumWorkers"]').attr('checked', 'checked');
	});
	jQuery('[ID$="rbtnAggregate"]').click(function () {
		toggleHVRecord();
	});
	jQuery('[ID$="rbtnDetails"]').click(function () {
		toggleHVRecord();
	});

	jQuery(".cblPrograms input:first").click(function () {
		if (jQuery(this).attr("checked")) {
			jQuery(".cblPrograms input:gt(0)").removeAttr("checked");
		}
	});

	jQuery(".cblPrograms input:gt(0)").click(function () {
		if (jQuery(this).attr("checked")) {
			jQuery(".cblPrograms input:first").removeAttr("checked");
		}
	});

	/* bind the cluetip to the call-out image */
	// jQuery('.calloutimg').cluetip({ splitTitle: '|', sticky: false, closePosition: 'title', arrows: true, activation: 'hover', closeText: "&#215;" });
	jQuery(".calloutimg").tipsy({ gravity: jQuery.fn.tipsy.autoNSE, html: true, live: true });

	/* bind the cluetip to both types of labels */
	// jQuery(".FilterLabel,.ColumnLabel").cluetip({ splitTitle: '|', sticky: false, closePosition: 'title', arrows: true, activation: 'hover', closeText: "&#215;" });
	jQuery(".FilterLabel").tipsy({ gravity: 'nw', html: true });
	jQuery(".ColumnLabel").tipsy({ gravity: 'ne', html: true });

	/* set the mask and the width on the date textboxes */
	jQuery(".dateMask").mask("99/99/99").width(80);

	/* set the mask on the month and year only textbox */
	jQuery('[ID$="txtMonthYearOnly"]').mask("99/9999");
});

function DebugWorkerPC1ID(DebugStage) {
	var DebugOutput = DebugStage + '\n'

	if (jQuery("#divByWhom").is(":hidden")) {
		DebugOutput += "#divByWhom - hidden";
	} else {
		DebugOutput += "#divByWhom - visible";
	}
	DebugOutput += '\n';

	if (jQuery("#rbtnAll").is(":hidden")) {
		DebugOutput += "#rbtnAll - hidden";
	} else {
		DebugOutput += "#rbtnAll - visible";
	}
	DebugOutput += '\n';

	if (jQuery("#divSup").is(":hidden")) {
		DebugOutput += "#divSup - hidden";
	} else {
		DebugOutput += "#divSup - visible";
	}
	DebugOutput += '\n';

	if (jQuery("#divWorker").is(":hidden")) {
		DebugOutput += "#divWorker - hidden";
	} else {
		DebugOutput += "#divWorker - visible";
	}
	DebugOutput += '\n';

	if (jQuery("#divFAW").is(":hidden")) {
		DebugOutput += "#divFAW - hidden";
	} else {
		DebugOutput += "#divFAW - visible";
	}
	DebugOutput += '\n';

	if (jQuery("#divPC1ID").is(":hidden")) {
		DebugOutput += "#divPC1ID - hidden";
	} else {
		DebugOutput += "#divPC1ID - visible";
	}
	
	alert(DebugOutput);
}

function TestControlForValue(strControlName) {
	var jqControlRef = jQuery("#"+strControlName);
	if (jqControlRef.length > 0) {
		alert(jQuery(jqControlRef).val());
	}
}

function SetReportNameHiddenField(strReportName) {
	jQuery('[ID$="hfReportToRun"]').val(strReportName);
}
