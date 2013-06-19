/// <reference path="jquery-1.7.2-vsdoc.js" />
// jQuery.noconflict();

jQuery(document).ready(function () {
	// alert('Ready!');
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

	var Criteria = sessionStorage.criteria; // jQuery('[ID$="hfCriteria"]').val();
	var Defaults = sessionStorage.defaults; // jQuery('[ID$="hfDefaults"]').val();
	ToggleCriteriaBoxes(Criteria, Defaults);
	RestoreCriteria();

	/* show the Return to Report Catalog button */
	jQuery('[ID$="btnReturn"]').show();

	/* change Run Report button text to be re-run */
	jQuery('[ID$="btnRunReport"]').attr("value", "Refresh Report");

	jQuery('[ID$="btnRunReport"]')
			.attr('title', 'Run the report again using the updated criteria')
			.tipsy({ gravity: 'w', html: true });

	/* set the mask and the width on the date textboxes */
	jQuery(".dateMask").mask("99/99/99").width(80);

	/* set the mask on the month and year only textbox */
	jQuery('[ID$="txtMonthYearOnly"]').mask("99/9999");

	/* register a function for the Re-Run Report button click event to persist the criteria */
	jQuery('[ID$="btnRunReport"]').click(function () {
		PersistCriteria();
	});

	/* register the click event for chkIncludeClosedCases - must re-bind the pc1id list to the ddl, 
	toggle data source between with closed cases and without */
	jQuery('[ID$="chkIncludeClosedCases"]').click(function () {
		if (jQuery(this).is(":checked")) {
			jQuery('[ID$="ddlPC1ID"]').hide();
			jQuery('[ID$="ddlPC1IDWithClosed"]').show(AnimationDelay);
		} else {
			jQuery('[ID$="ddlPC1ID"]').show(AnimationDelay);
			jQuery('[ID$="ddlPC1IDWithClosed"]').hide();
		}
	});

	/* now hide the PC1ID list with closed cases until we need it */
	jQuery('[ID$="ddlPC1IDWithClosed"]').hide();

	/* and see if we need to toggle the display of the pc1id lists */
	if (jQuery('[ID$="chkIncludeClosedCases"]').is(":checked")) {
		jQuery('[ID$="ddlPC1ID"]').hide();
		jQuery('[ID$="ddlPC1IDWithClosed"]').show(AnimationDelay);
	}

	/* register the click event for any of the ServRefBreakdown and HVLogBreakdown controls to set the togglables */
	jQuery('.ServRefBreakdown,.HVLogBreakdown').click(function () {
		var RadioButtonValue = jQuery(this).text();
		ToggleBreakdown(RadioButtonValue, jQuery(this).attr('class').substr(0, 5));
	});

	/* register the click event for any of the ByWhom controls to set the togglables */
	jQuery('.ByWhom').click(function () {
		var RadioButtonValue = jQuery(this).text();
		// var test1 = jQuery(this).attr("innerText");
		// var test2 = jQuery(this).val();
		ToggleByWhom(RadioButtonValue);
	});

	/* register the blur event for the no data hidden field */
	jQuery('[ID$="hfNoData"]').change(function () {
		jQuery.gritter.add({
			// (string | mandatory) the heading of the notification
			title: 'No Data!',
			// (string | mandatory) the text inside the notification
			text: 'The report has no data. Please adjust your criteria and try again.',
			// (string | optional) the image to display on the left
			image: '../Images/newh5.png',
			// (bool | optional) if you want it to fade out on its own or just sit there
			sticky: true,
			// (int | optional) the time you want it to be alive for before fading out
			time: ''
		});

		jQuery(this).val('');
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

	var SelectedQuarterButtonText = jQuery(".Quarters :radio:checked + label").text();
	ToggleQuarters(SelectedQuarterButtonText);

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

	//	jQuery.gritter.add({
	//		// (string | mandatory) the heading of the notification
	//		title: 'ReportCatalogViewer ready!',
	//		// (string | mandatory) the text inside the notification
	//		text: 'The ReportCatalogViewer has restored all criteria passed from the ReportCatalog page and is proceeding to render the report.',
	//		// (string | optional) the image to display on the left
	//		image: '../Images/newh5.png',
	//		// (bool | optional) if you want it to fade out on its own or just sit there
	//		sticky: false,
	//		// (int | optional) the time you want it to be alive for before fading out
	//		time: ''
	//	});

	//		jQuery('#jGrowl').jGrowl("ReviewCatalogViewer ready!", {
	//			theme: "smoke",
	//			closer: false
	//		});

});

function RestoreCriteria() {
	var store = sessionStorage;

	store = (function () {
		var self = {};

		self.get = function (key) {
			var b = sessionStorage.getItem(key);
			return b ? JSON.parse(b) : null;
		};

		self.set = function (key, value) {
			var b = JSON.stringify(value);
			sessionStorage.setItem(key, b);
		};

		return self;
	})();

	// alert('Restoring criteria values');
	/* ---------------------------------------------------------------------------
		phase one - set the values of the hidden fields from the sessionStorage
	--------------------------------------------------------------------------- */
	storeGetCustom(store, 'criteria', '[ID$="hfCriteria"]');
	storeGetCustom(store, 'defaults', '[ID$="hfDefaults"]');
	storeGetCustom(store, 'startdate', '[ID$="hfStartDate"]');
	storeGetCustom(store, 'enddate', '[ID$="hfEndDate"]');
	storeGetCustom(store, 'workercutoffhiredafter', '[ID$="hfCutoffHiredAfter"]');
	storeGetCustom(store, 'workercutoffstartedrole', '[ID$="hfCutoffStartedRole"]');
	storeGetCustom(store, 'workercutoffworkwithfamilies', '[ID$="hfCutoffWorkWithFamilies"]');
	storeGetCustom(store, 'monthdate', '[ID$="hfMonth"]');
	storeGetCustom(store, 'monthname', '[ID$="hfMonthName"]');
	storeGetCustom(store, 'quarter', '[ID$="hfQuarter"]');
	storeGetCustom(store, 'quartervalue', '[ID$="hfQuarterValue"]');
	storeGetCustom(store, 'qtrstartdate', '[ID$="hfQtrStartDate"]');
	storeGetCustom(store, 'qtrenddate', '[ID$="hfQtrEndDate"]');
	storeGetCustom(store, 'customquarterlydates', '[ID$="hfCustomQuarterlyDates"]');
	storeGetCustom(store, 'contractstartdate', '[ID$="hfContractStartDate"]');
	storeGetCustom(store, 'contractenddate', '[ID$="hfContractEndDate"]');
	storeGetCustom(store, 'monthyear', '[ID$="hfMonthYearOnly"]');
	storeGetCustom(store, 'allworkers', '[ID$="hfAll"]');
	storeGetCustom(store, 'supervisor', '[ID$="hfSupervisor"]');
	storeGetCustom(store, 'supervisorfk', '[ID$="hfSupervisorFK"]');
	storeGetCustom(store, 'supervisorname', '[ID$="hfSupervisorName"]');
	storeGetCustom(store, 'worker', '[ID$="hfWorker"]');
	storeGetCustom(store, 'workerfk', '[ID$="hfWorkerFK"]');
	storeGetCustom(store, 'workername', '[ID$="hfWorkerName"]');
	storeGetCustom(store, 'fsw', '[ID$="hfFSW"]');
	storeGetCustom(store, 'fswfk', '[ID$="hfFSWFK"]');
	storeGetCustom(store, 'faw', '[ID$="hfFAW"]');
	storeGetCustom(store, 'fawfk', '[ID$="hfFAWFK"]');
	storeGetCustom(store, 'fatheradvocate', '[ID$="hfFatherAdvocate"]');
	storeGetCustom(store, 'fatheradvocatefk', '[ID$="hfFatherAdvocateFK"]');
	storeGetCustom(store, 'bypc1id', '[ID$="hfByPC1ID"]');
	storeGetCustom(store, 'includeclosedcasesinpc1idlist', '[ID$="hfIncludeClosedCases"]');
	storeGetCustom(store, 'pc1id', '[ID$="hfPC1ID"]');

	storeGetCustom(store, 'performancetargetsummary', '[ID$="hfPerformanceTargetSummary"]');
	storeGetCustom(store, 'performancetargetnotmeeting', '[ID$="hfPerformanceTargetNotMeeting"]');
	storeGetCustom(store, 'performancetargetinvalidmissing', '[ID$="hfPerformanceTargetInvalidMissing"]');
	storeGetCustom(store, 'performancetargetmeeting', '[ID$="hfPerformanceTargetMeeting"]');
	storeGetCustom(store, 'hvrecordaggregate', '[ID$="hfHVRecordAggregate"]');
	storeGetCustom(store, 'hvrecorddetails', '[ID$="hfHVRecordDetails"]');
	storeGetCustom(store, 'allstatus', '[ID$="hfAllStatus"]');
	storeGetCustom(store, 'enrolled', '[ID$="hfEnrolled"]');
	storeGetCustom(store, 'preintake', '[ID$="hfPreintake"]');
	storeGetCustom(store, 'preassessment', '[ID$="hfPreassessment"]');
	storeGetCustom(store, 'ticklerdate', '[ID$="hfTicklerMonth"]');
	storeGetCustom(store, 'ticklermonthname', '[ID$="hfTicklerMonth"]');
	storeGetCustom(store, 'tsumall', '[ID$="hfTSumAll"]');
	storeGetCustom(store, 'tsumsup', '[ID$="hfTSumSup"]');
	storeGetCustom(store, 'tsumsupfk', '[ID$="hfTSumSupFK"]');
	storeGetCustom(store, 'tsumworkers', '[ID$="hfTSumWorkers"]');
	storeGetCustom(store, 'tsumworkerfk', '[ID$="hfTSumWorkersFK"]');
	storeGetCustom(store, 'tsumreports', '[ID$="hfTSumReports"]');

	storeGetCustom(store, 'asqundercutoff', '[ID$="hfUnderCutoffASQ"]');
	storeGetCustom(store, 'psiundercutoff', '[ID$="hfUnderCutoffPSI"]');

	/* the next 3 are hybrid selections, need to design and assemble values to use in report */
	/* values for screen/referral source demographic and outcome summary report */
	storeGetCustom(store, 'referralsourcebreakdownall', '[ID$="hfAllReferralSources"]');
	storeGetCustom(store, 'referralsourcebreakdownoneonly', '[ID$="hfOnlySelectedReferralSource"]');
	storeGetCustom(store, 'referralsourcefk', '[ID$="hfReferralSourceFK"]');

	/* values for count of service referrals by code report */
	storeGetCustom(store, 'servicereferralsbreakdown', '[ID$="hfServiceReferralBreakdown"]');
	storeGetCustom(store, 'servicereferralsall', '[ID$="hfServRefAll"]');
	storeGetCustom(store, 'servicereferralsonepageperfsw', '[ID$="hfServRefOnePagePerFSW"]');
	storeGetCustom(store, 'servicereferralsbyworker', '[ID$="hfServRefByWorker"]');
	if (store.get("servicereferralsbyworker") === true) {
		storeGetCustom(store, 'workerfk', '[ID$="hfWorkerFK"]');
	}
	storeGetCustom(store, 'servicereferralsbyworkerall', '[ID$="hfServRefByWorkerAll"]');
	storeGetCustom(store, 'servicereferralsonepagepercase', '[ID$="hfServRefByWorkerOnePerCase"]');
	storeGetCustom(store, 'servicereferralsbypc1id', '[ID$="hfServRefByPC1ID"]');
	if (store.get("servicereferralsbypc1id") === true) {
		storeGetCustom(store, 'pc1id', '[ID$="hfPC1ID"]');
	}

	/* values for home visit log activity summary report */
	storeGetCustom(store, 'hvlogactivitiesbreakdown', '[ID$="hfHVLogActivitiesBreakdown"]');
	storeGetCustom(store, 'hvlogactivitiesall', '[ID$="hfHVLogSummary"]');
	storeGetCustom(store, 'hvlogactivitiesonepageperfsw', '[ID$="hfHVLogOnePagePerFSW"]');
	storeGetCustom(store, 'hvlogactivitiesbyworker', '[ID$="hfHVLogByWorker"]');
	if (store.get("hvlogactivitiesbyworker") === true) {
		storeGetCustom(store, 'workerfk', '[ID$="hfWorkerFK"]');
	}
	storeGetCustom(store, 'hvlogactivitiesbyworkerall', '[ID$="hfHVLogByWorkerAll"]');
	storeGetCustom(store, 'hvlogactivitiesonepagepercase', '[ID$="hfHVLogByWorkerOnePerCase"]');
	storeGetCustom(store, 'hvlogactivitiesbypc1id', '[ID$="hfHVLogByPC1ID"]');
	if (store.get("hvlogactivitiesbypc1id") === true) {
		storeGetCustom(store, 'pc1id', '[ID$="hfPC1ID"]');
	}
	storeGetCustom(store, 'includeclosedcases', '[ID$="hfIncludeClosedCasesActiveDuringPeriod"]');

	/* the next 2 are hybrid selections, need to design and assemble values to use in report */
	storeGetCustom(store, 'fawticklersortorder', '[ID$="hfFAWTicklerSortOrder"]');
	storeGetCustom(store, 'qareportoptions', '[ID$="hfQAReportOptions"]');

	storeGetCustom(store, 'includepreintake', '[ID$="hfIncludePreintake"]');
	storeGetCustom(store, 'includeinactive', '[ID$="hfIncludeInactive"]');

	storeGetCustom(store, 'sitefk', '[ID$="hfSiteFK"]');
	storeGetCustom(store, 'sitename', '[ID$="hfSiteName"]');
	storeGetCustom(store, 'casefilterspositive', '[ID$="hfCaseFiltersPositive"]');
	storeGetCustom(store, 'casefilterpositivedescriptions', '[ID$="hfCaseFilterPositiveDescriptions"]');
	storeGetCustom(store, 'casefiltersnegative', '[ID$="hfCaseFiltersNegative"]');
	storeGetCustom(store, 'casefilternegativedescriptions', '[ID$="hfCaseFilterNegativeDescriptions"]');

	storeGetCustom(store, 'programfks', '[ID$="hfProgramFKs"]');
	storeGetCustom(store, 'programnames', '[ID$="hfProgramNames"]');
	/* jQuery('[ID$="hfDone"]').val("Done"); */

	/* ---------------------------------------------------------------------------
		phase two - set the values of the criteria controls from the sessionStorage
	--------------------------------------------------------------------------- */
	storeGetCustom(store, 'startdate', '[ID$="txtStartDate"]');
	storeGetCustom(store, 'enddate', '[ID$="txtEndDate"]');
	storeGetCustom(store, 'workercutoffhiredafter', '[ID$="txtCutoffHiredAfter"]');
	storeGetCustom(store, 'workercutoffstartedrole', '[ID$="txtCutoffStartedRole"]');
	storeGetCustom(store, 'workercutoffworkwithfamilies', '[ID$="txtCutoffWorkWithFamilies"]');
	storeGetCustom(store, 'monthdate', '[ID$="ddlMonth"]');
	storeGetCustom(store, 'quartervalue', '[ID$="ddlQuarter"]');
	storeGetCustom(store, 'qtrstartdate', '[ID$="txtQtrStartDate"]');
	storeGetCustom(store, 'qtrenddate', '[ID$="txtQtrEndDate"]');
	storeGetCustom(store, 'customquarterlydates', '[ID$="rbtnDates"]');
	storeGetCustom(store, 'monthyear', '[ID$="txtMonthYearOnly"]');
	storeGetCustom(store, 'allworkers', '[ID$="rbtnAll"]');
	storeGetCustom(store, 'supervisor', '[ID$="rbtnSup"]');
	storeGetCustom(store, 'supervisorfk', '[ID$="ddlSupervisors"]');
	storeGetCustom(store, 'worker', '[ID$="rbtnWorkers"]');
	storeGetCustom(store, 'workerfk', '[ID$="ddlWorkers"]');
	storeGetCustom(store, 'fsw', '[ID$="rbtnFSWs"]');
	storeGetCustom(store, 'fswfk', '[ID$="ddlFSWs"]');
	storeGetCustom(store, 'faw', '[ID$="rbtnFAWs"]');
	storeGetCustom(store, 'fawfk', '[ID$="ddlFAWs"]');
	storeGetCustom(store, 'fatheradvocate', '[ID$="rbtnFAdvs"]');
	storeGetCustom(store, 'fatheradvocatefk', '[ID$="ddlFAdvs"]');
	storeGetCustom(store, 'bypc1id', '[ID$="rbtnPC1ID"]');
	storeGetCustom(store, 'includeclosedcasesinpc1idlist', '[ID$="chkIncludeClosedCases"]');
	storeGetCustom(store, 'pc1id', '[ID$="ddlPC1ID"]');
	if (store.get("includeclosedcasesinpc1idlist") === true) {
		storeGetCustom(store, 'pc1id', '[ID$="ddlPC1IDWithClosed"]');
	}
	
	/* call the function to toggle the enabled/disabled status of the controls in the ByWhom group */ 
	var SelectedByWhomButtonText = jQuery(".ByWhom :radio:checked + label").text();
	ToggleByWhom(SelectedByWhomButtonText);

	storeGetCustom(store, 'performancetargetsummary', '[ID$="chkPTSummary"]');
	storeGetCustom(store, 'performancetargetnotmeeting', '[ID$="chkPTNotMeeting"]');
	storeGetCustom(store, 'performancetargetinvalidmissing', '[ID$="chkPTInvalidMissing"]');
	storeGetCustom(store, 'performancetargetmeeting', '[ID$="chkPTMeeting"]');
	storeGetCustom(store, 'summarydetail', '[ID$="rbtnSummary"]');
	storeGetCustom(store, 'hvrecordaggregate', '[ID$="rbtnAggregate"]');
	storeGetCustom(store, 'hvrecorddetails', '[ID$="rbtnDetails"]');
	storeGetCustom(store, 'allstatus', '[ID$="rbtnAllStatus"]');
	storeGetCustom(store, 'enrolled', '[ID$="rbtnEnrolled"]');
	storeGetCustom(store, 'preintake', '[ID$="rbtnPreintake"]');
	storeGetCustom(store, 'preassessment', '[ID$="rbtnPreassessment"]');
	//	storeGetCustom(store, 'ticklerdate', '[ID$="ddlTicklerMonth"]');
	//	storeGetCustom(store, 'ticklermonthname', '[ID$="ddlTicklerMonth"]');
	//	storeGetCustom(store, 'tsumall', '[ID$="rbtnTSumAll"]');
	//	storeGetCustom(store, 'tsumsup', '[ID$="rbtnTSumSup"]');
	//	storeGetCustom(store, 'tsumsupfk', '[ID$="ddlTSumSup"]');
	//	storeGetCustom(store, 'tsumworkers', '[ID$="rbtnTSumWorkers"]');
	//	storeGetCustom(store, 'tsumworkerfk', '[ID$="ddlTSumWorkers"]');
	storeGetCustom(store, 'tsumreports', '[ID$="rblTSumReports"]');

	storeGetCustom(store, 'asqundercutoff', '[ID$="chkUnderCutoffASQ"]');
	storeGetCustom(store, 'psiundercutoff', '[ID$="chkUnderCutoffPSI"]');

	/* the next 3 are hybrid selections, need to design and assemble values to use in report */
	/* values for screen/referral source demographic and outcome summary report */
	storeGetCustom(store, 'referralsourcebreakdownall', '[ID$="rbtnAllReferralSources"]');
	storeGetCustom(store, 'referralsourcebreakdownoneonly', '[ID$="rbtnOnlySelectedReferralSource"]');
	storeGetCustom(store, 'referralsourcefk', '[ID$="ddlReferralSource"]');

	/* values for count of service referrals by code report */
	storeGetCustom(store, 'servicereferralsbreakdown', '[ID$="rbtnServiceReferrals"]');
	storeGetCustom(store, 'servicereferralsall', '[ID$="rbtnServRefAll"]');
	storeGetCustom(store, 'servicereferralsonepageperfsw', '[ID$="rbtnServRefOnePagePerFSW"]');
	storeGetCustom(store, 'servicereferralsbyworker', '[ID$="rbtnServRefByWorker"]');
	if (store.get("servicereferralsbyworker") === true) {
		storeGetCustom(store, 'workerfk', '[ID$="ddlServRefWorker"]');
	}
	storeGetCustom(store, 'servicereferralsbyworkerall', '[ID$="rbtnServRefByWorkerAll"]');
	storeGetCustom(store, 'servicereferralsonepagepercase', '[ID$="rbtnServRefByWorkerOnePerCase"]');
	storeGetCustom(store, 'servicereferralsbypc1id', '[ID$="rbtnServRefByPC1ID"]');
	if (store.get("servicereferralsbypc1id") === true) {
		storeGetCustom(store, 'pc1id', '[ID$="ddlServRefPC1ID"]');
	}
	/* get the value of the selected option and toggle all the related controls */
	var SelectedSRBButtonText = jQuery(".ServRefBreakdown :radio:checked + label").text();
	ToggleBreakdown(SelectedSRBButtonText, "ServRef");
	
	/* values for Summary of Home Visit Log Activities report */
	storeGetCustom(store, 'hvlogactivitiesbreakdown', '[ID$="rbtnHVLogAll"]');
	storeGetCustom(store, 'hvlogactivitiesall', '[ID$="rbtnHVLogSummary"]');
	storeGetCustom(store, 'hvlogactivitiesonepageperfsw', '[ID$="rbtnHVLogOnePagePerFSW"]');
	storeGetCustom(store, 'hvlogactivitiesbyworker', '[ID$="rbtnHVLogByWorker"]');
	if (store.get("hvlogactivitiesbyworker") === true) {
		storeGetCustom(store, 'workerfk', '[ID$="ddlHVLogWorker"]');
	}
	storeGetCustom(store, 'hvlogactivitiesbyworkerall', '[ID$="rbtnHVLogByWorkerAll"]');
	storeGetCustom(store, 'hvlogactivitiesonepagepercase', '[ID$="rbtnHVLogByWorkerOnePerCase"]');
	storeGetCustom(store, 'hvlogactivitiesbypc1id', '[ID$="rbtnHVLogByPC1ID"]');
	if (store.get("hvlogactivitiesbypc1id") === true) {
		storeGetCustom(store, 'pc1id', '[ID$="ddlHVLogPC1ID"]');
	}
	storeGetCustom(store, 'includeclosedcases', '[ID$="chkIncludeClosedCasesActiveDuringPeriod"]');
	/* get the value of the selected option and toggle all the related controls */
	var SelectedHVLButtonText = jQuery(".HVLogBreakdown :radio:checked + label").text();
	ToggleBreakdown(SelectedHVLButtonText, "HVLog");

	/* the next 2 are hybrid selections, need to design and assemble values to use in report */
	// storeGetCustom(store, 'fawticklersortorder', '[ID$="rbtnSortByScreenDate"]:checked', 'bit');
	if (store.get('fawticklersortorder') === '1') {
		jQuery('[ID$="rbtnSortByScreenDate"]').attr('checked', 'checked');
		jQuery('[ID$="rbtnSortByTargetDate"]').removeAttr('checked');
	} else {
		jQuery('[ID$="rbtnSortByScreenDate"]').removeAttr('checked');
		jQuery('[ID$="rbtnSortByTargetDate"]').attr('checked', 'checked');
	}

	// storeGetCustom(store, 'qareportoptions', '[ID$="hfQAReportOptions"]', 'bit');

	storeGetCustom(store, 'includepreintake', '[ID$="chkIncludePreintake"]');
	storeGetCustom(store, 'includeinactive', '[ID$="chkIncludeInactive"]');

	storeGetCustom(store, 'sitefk', '[ID$="ddlSites"]');
	// storeGetCustom(store, 'sitename', '[ID$="hfSiteName"]');

	SetCaseFilters(store.get('casefilterspositive'));
	SetSelectedPrograms(store.get('programfks'));
	jQuery('[ID$="hfDone"]').val("Done");
	
}

function storeGetCustom(objStore, strStorageElement, strControlID) {
	/// <summary>this function customizes the reading of values from sessionStorage.
	///		<para>it converts boolean and date types to character and writes the value to the passed hidden field</para>
	/// </summary>
	/// <param name="objStore" type="String">our instance of sessionStorage</param>
	/// <param name="strStorageElement" type="String">the name of the element in sessionStorage where we previously saved the value</param>
	/// <param name="strControlID" type="String">the expanded name of the hidden field to store the value in</param>

	/* this function customizes the reading of values from sessionStorage.
	it converts boolean and date types to character and writes the value to the passed hidden field
	Parameters:
	objStore - our instance of sessionStorage
	strStorageElement - the name of the element in sessionStorage where we previously saved the value
	strControlID - the expanded name of the hidden field to store the value in
	*/
	var sessionVar = objStore.get(strStorageElement)
		, tempDate
		, valueToSet
		, setValue = true
		, jqControl = jQuery(strControlID);

	if (jQuery(jqControl).length === 0) {
		jQuery.gritter.add({
			// (string | mandatory) the heading of the notification
			title: 'Programmer Error!',
			// (string | mandatory) the text inside the notification
			text: 'The value passed to the storeGetCustom() function for strControlID was invalid -- jQuery returned 0 results when the selector string was executed.' +
					' Please review and correct the value: ' + strControlID,
			// (string | optional) the image to display on the left
			image: '../Images/newh5.png',
			// (bool | optional) if you want it to fade out on its own or just sit there
			sticky: false,
			// (int | optional) the time you want it to be alive for before fading out
			time: ''
		});
	} else {
		if (sessionVar !== null && sessionVar !== "undefined") {
			if (typeof sessionVar === 'boolean') {
				valueToSet = (sessionVar) ? '1' : '0';
				/* if a hidden field control is passed in for the boolean, set it as normal later */ 
				/* else do the special handling for chekcboxes and radio buttons */
				if (strControlID.substr(6, 2) !== 'hf') {
					if (valueToSet === '1') {
						jQuery(jqControl).attr('checked', 'checked');
					} else {
						jQuery(jqControl).removeAttr('checked');
					}
					setValue = false;
				}
			} else if (strStorageElement.indexOf('date') > -1) {
				if (sessionVar.length > 19) {
					/* '10/10/2013T18:17:16.000Z' */
					sessionVar = sessionVar.slice(0,19)+'Z';
				}
				
				tempDate = Date.parse(sessionVar);
				valueToSet = tempDate.toString('MM/dd/yy');
				/* valueToSet = new Date(sessionVar).toString('MM/dd/yyyy'); */
			} else if (typeof sessionVar === 'date') {
				valueToSet = sessionVar.toString('MM/dd/yy');
			} else {
				valueToSet = sessionVar;
			}
			if (setValue) {
				jqControl.val(valueToSet);
			}
		}
	}
}

function SetCaseFilters(strCaseFilters) {
	/// <summary>This function sets the values of the case filters grid view from the passed string, which is stored in sessionStorage and 
	///			<para>passed to the reports as the case filter parameter and is in the format NNSSS... where SS is the PK of the filter</para>
	///			<para>option and SSS... is the selected string value to filter on</para>
	/// </summary>
	/// <param name="strCaseFilters" type="String">the string containing the case filter values</param>

}

function SetSelectedPrograms(strSelectedProgramFKs) {
	/// <summary>This function sets the values of the program check boxes from the passed string, which is stored in sessionStorage and 
	///			<para>passed to the reports as the programfks parameter and is a comma separated list of Program FKs</para>
	/// </summary>
	/// <param name="strCaseFilters" type="String">the string containing the case filter values</param>

	strSelectedProgramFKs = "," + strSelectedProgramFKs + ",";

	jQuery('.cblPrograms input[type=checkbox]').each(function () {
		var strDataElement = "," + jQuery(this).closest("td").find("span").attr("CustomVal") + ",";

		if (strDataElement !== ",,") {
			if (strSelectedProgramFKs.indexOf(strDataElement) > -1) {
				jQuery(this).attr("checked", true);
			} else {
				jQuery(this).attr("checked", false);
			}
		}

	});
}