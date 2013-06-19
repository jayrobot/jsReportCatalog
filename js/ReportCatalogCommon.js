/// <reference path="jquery-1.7.2-vsdoc.js" />
var AnimationDelay = 500;

/* utility function for tipsy plug-in; same as AutoNS, but adds 'e' for east to return string */
jQuery.fn.tipsy.autoNSE = function () {
	return jQuery(this).offset().top > (jQuery(document).scrollTop() + jQuery(window).height() / 2) ? 'se' : 'ne';
};

function ToggleCriteriaBoxes(CriteriaOptions, DefaultOptions) {
	/// <summary>Called from row click event of the dataTable/Repeater.
	///		<para>It first determines the default date(s) to use if date(s) are part of the criteria.</para>
	/// 	<para>Then it determines which criteria option elements to display based on the passed three letter codes.</para>
	///		<para>This function does a lot of work after an item is clicked in the report catalog list.</para>
	/// </summary>
	/// <param name="CriteriaOptions" type="String">Comma-separated list of codes of criteria elements to display</param>
	/// <param name="DefaultOptions" type="String">Code indicating how to calculate the default dates for the selected report</param>

	var DatesStartEnd = (CriteriaOptions.toUpperCase().indexOf("SED")) > -1;
	var DateStartOnly = (CriteriaOptions.toUpperCase().indexOf("SDO")) > -1;
	var Quarters = (CriteriaOptions.toUpperCase().indexOf("QTR")) > -1;
	var DatesRetention = (CriteriaOptions.toUpperCase().indexOf("SER")) > -1;
	var Months = (CriteriaOptions.toUpperCase().indexOf("CMO")) > -1;
	var MonthYearOnly = (CriteriaOptions.toUpperCase().indexOf("MYO")) > -1;

	/* first fill in the default dates from the default option which was passed in */
	if ((DatesStartEnd || DateStartOnly || Quarters || DatesRetention) && DefaultOptions !== "" && DefaultOptions !== null) {
		var arrDefaultDates = CalculateDefaultDates(DefaultOptions);
		//	var DefaultStartDate = CalculateDefaultDate('start', DefaultOptions);
		//	var DefaultEndDate = CalculateDefaultDate('end', DefaultOptions);

		jQuery('[ID$="StartDate"]').val(arrDefaultDates[0].toString('MM/dd/yy'));
		jQuery('[ID$="EndDate"]').val(arrDefaultDates[1].toString('MM/dd/yy'));
		// jQuery(".StartDate").val(arrDefaultDates[0].toString('MM/dd/yy'));
		// jQuery(".EndDate").val(arrDefaultDates[1].toString('MM/dd/yy'));
		//		jQuery("#<%= txtStartDate.ClientID %>").val(arrDefaultDates[0].toString('MM/dd/yy'));
		//		jQuery("#<%= txtEndDate.ClientID %>").val(arrDefaultDates[1].toString('MM/dd/yy'));
	}

	if (Months) {
		var strFirstOfMonth = new Date().moveToFirstDayOfMonth().toString("MM/dd/yy");
		jQuery('[ID$="ddlMonth"]').val(strFirstOfMonth);
	}

	if (MonthYearOnly) {
		var strLastMonth = new Date().moveToFirstDayOfMonth().add({ days: -1 }).toString("MM/yyyy");
		jQuery('[ID$="txtMonthYearOnly"]').val(strLastMonth);
	}

	/* unregister the change function for start and end dates related to retention rates */
	jQuery('[ID$="txtEndDate"]').unbind("change");

	var WorkerCutoffHiredAfter = (CriteriaOptions.toUpperCase().indexOf("WC0")) > -1;
	var WorkerCutoffStartedRole = (CriteriaOptions.toUpperCase().indexOf("WC1")) > -1;
	var WorkerCutoffWorkWithFamilies = (CriteriaOptions.toUpperCase().indexOf("WC2")) > -1;

	var PC1IDOnly = (CriteriaOptions.toUpperCase().indexOf("PC1")) > -1 
					|| (CriteriaOptions.toUpperCase().indexOf("PCO")) > -1;
	// var PC1IDWithTC = (CriteriaOptions.toUpperCase().indexOf("PCO")) > -1;
	var WorkerFAWOnly = (CriteriaOptions.toUpperCase().indexOf("FAW")) > -1;
	var WorkerSupOnly = (CriteriaOptions.toUpperCase().indexOf("SUP")) > -1;
	var WorkerAll = (CriteriaOptions.toUpperCase().indexOf("WKL")) > -1;
	var WorkerNoPC1ID = (CriteriaOptions.toUpperCase().indexOf("WKN")) > -1;
	var WorkerPC1ID = (CriteriaOptions.toUpperCase().indexOf("WKP")) > -1;
	var WorkerFSWOnly = (CriteriaOptions.toUpperCase().indexOf("WKF")) > -1;
	var WorkerFatherAdvocate = (CriteriaOptions.toUpperCase().indexOf("FAD")) > -1;
	var WorkerFAdvPC1ID = (CriteriaOptions.toUpperCase().indexOf("FAP")) > -1;
	var WorkerAllTypes = (CriteriaOptions.toUpperCase().indexOf("WKA")) > -1;

	// (CriteriaOptions.length > 0)
	var Criteria = DatesStartEnd || DateStartOnly || Months || Quarters || MonthYearOnly || DatesRetention
					|| WorkerCutoffHiredAfter || WorkerCutoffStartedRole || WorkerCutoffWorkWithFamilies
					|| PC1IDOnly || WorkerFAWOnly || WorkerSupOnly || WorkerAll
					|| WorkerNoPC1ID || WorkerPC1ID || WorkerFSWOnly || WorkerFatherAdvocate || WorkerFAdvPC1ID
					|| WorkerAllTypes;
					/* || PC1IDWithTC  */

	var MiscPerformanceTargetOptions = (CriteriaOptions.toUpperCase().indexOf("PTO")) > -1;
	var MiscSummaryDetail = (CriteriaOptions.toUpperCase().indexOf("SUM")) > -1;
	var MiscByStatus = (CriteriaOptions.toUpperCase().indexOf("STA")) > -1;
	var MiscTicklerSummaries = (CriteriaOptions.toUpperCase().indexOf("TIC")) > -1;
	var MiscHVRecord = (CriteriaOptions.toUpperCase().indexOf("HVR")) > -1;
	var MiscASQUnderCutoff = (CriteriaOptions.toUpperCase().indexOf("AUC")) > -1;
	var MiscASQSEOverCutoff = (CriteriaOptions.toUpperCase().indexOf("AOC")) > -1;
	var MiscPSIUnderCutoff = (CriteriaOptions.toUpperCase().indexOf("PUC")) > -1;
	var MiscReferralSourceBreakdown = (CriteriaOptions.toUpperCase().indexOf("RSB")) > -1;
	var MiscServiceReferralBreakdown = (CriteriaOptions.toUpperCase().indexOf("SRB")) > -1;
	var MiscHVLogActivitiesBreakdown = (CriteriaOptions.toUpperCase().indexOf("HVB")) > -1;
	var MiscIncludeClosedCases = (CriteriaOptions.toUpperCase().indexOf("ICC")) > -1;
	var MiscFAWTicklerSortOrder = (CriteriaOptions.toUpperCase().indexOf("FTS")) > -1;
	var MiscQAReportOptions = (CriteriaOptions.toUpperCase().indexOf("QAR")) > -1;
	var MiscIncludePreintake = (CriteriaOptions.toUpperCase().indexOf("IPI")) > -1;
	var MiscIncludeInactive = (CriteriaOptions.toUpperCase().indexOf("III")) > -1;

	var Miscellaneous = MiscPerformanceTargetOptions || MiscSummaryDetail || MiscByStatus || MiscTicklerSummaries || MiscHVRecord 
						|| MiscASQUnderCutoff || MiscASQSEOverCutoff || MiscPSIUnderCutoff || MiscReferralSourceBreakdown
						|| MiscServiceReferralBreakdown || MiscHVLogActivitiesBreakdown || MiscIncludeClosedCases 
						|| MiscFAWTicklerSortOrder || MiscQAReportOptions || MiscIncludePreintake || MiscIncludeInactive;

	var CaseFilters = (CriteriaOptions.toUpperCase().indexOf("CFI")) > -1;
	var Programs = (CriteriaOptions.toUpperCase().indexOf("PRG")) > -1;
	var Sites = CaseFilters || ((CriteriaOptions.toUpperCase().indexOf("SIT")) > -1);

/*	if (Criteria || Miscellaneous) {
		if (jQuery("#divCriteria").is(":hidden")) {
			jQuery("#divCriteria").show(AnimationDelay);
		}
	} else {
		if (jQuery("#divCriteria").is(":visible")) {
			jQuery("#divCriteria").hide(AnimationDelay);
		}
	} */

	if (Criteria) {
		if (DatesStartEnd || DateStartOnly || DatesRetention) {
			if (jQuery("#divStartDate").is(":hidden")) {
				jQuery("#divStartDate").show(AnimationDelay);
			}
			if (!DateStartOnly && jQuery("#divEndDate").is(":hidden")) {
				jQuery("#divEndDate").show(AnimationDelay);
			}
		} else {
			if (jQuery("#divStartDate").is(":visible")) {
				jQuery("#divStartDate").hide(AnimationDelay);
			}
			if (jQuery("#divEndDate").is(":visible")) {
				jQuery("#divEndDate").hide(AnimationDelay);
			}
			jQuery("#divRun").show(AnimationDelay);
		}

		if (Months) {
			if (jQuery("#divMonths").is(":hidden")) {
				jQuery("#divMonths").show(AnimationDelay);
			}
		} else {
			if (jQuery("#divMonths").is(":visible")) {
				jQuery("#divMonths").hide(AnimationDelay);
			}
		}

		if (Quarters) {
			if (jQuery("#divQuarters").is(":hidden")) {
				jQuery("#divQuarters").show(AnimationDelay);
			}
			var SelectedQuarterButtonText = jQuery(".Quarters :radio:checked + label").text();
			ToggleQuarters(SelectedQuarterButtonText);
		} else {
			if (jQuery("#divQuarters").is(":visible")) {
				jQuery("#divQuarters").hide(AnimationDelay);
			}
		}

		if (MonthYearOnly) {
			if (jQuery("#divMonthYearOnly").is(":hidden")) {
				jQuery("#divMonthYearOnly").show(AnimationDelay);
			}
		} else {
			if (jQuery("#divMonthYearOnly").is(":visible")) {
				jQuery("#divMonthYearOnly").hide(AnimationDelay);
			}
		}

		if (DatesRetention) {
			if (jQuery("#divRetentionDetails").is(":hidden")) {
				jQuery("#divRetentionDetails").show(AnimationDelay);
				/* calculate the default message based on the default dates */
				var strRetentionPeriods = GetRetentionPeriods(jQuery('[ID$="txtEndDate"]').val());
				jQuery('[ID$="lblRetentionDetails"]').html(strRetentionPeriods).show(AnimationDelay);

				/* register the change function for both start and end dates to adjust the retention rates message */
				jQuery('[ID$="txtEndDate"]').change(function () {
					var strRetentionPeriods = GetRetentionPeriods(jQuery('[ID$="txtEndDate"]').val());
					jQuery('[ID$="lblRetentionDetails"]').html(strRetentionPeriods).show(AnimationDelay);
				});
			}
		} else {
			if (jQuery("#divRetentionDetails").is(":visible")) {
				jQuery("#divRetentionDetails").hide(AnimationDelay);
			}
		}

		if (WorkerCutoffHiredAfter) {
			if (jQuery("#divWorkerCutoffHiredAfter").is(":hidden")) {
				jQuery("#divWorkerCutoffHiredAfter").show(AnimationDelay);
			}
		} else {
			if (jQuery("#divWorkerCutoffHiredAfter").is(":visible")) {
				jQuery("#divWorkerCutoffHiredAfter").hide(AnimationDelay);
			}
		}

		if (WorkerCutoffStartedRole) {
			if (jQuery("#divWorkerCutoffStartedRole").is(":hidden")) {
				jQuery("#divWorkerCutoffStartedRole").show(AnimationDelay);
			}
		} else {
			if (jQuery("#divWorkerCutoffStartedRole").is(":visible")) {
				jQuery("#divWorkerCutoffStartedRole").hide(AnimationDelay);
			}
		}

		if (WorkerCutoffWorkWithFamilies) {
			if (jQuery("#divWorkerCutoffWorkWithFamilies").is(":hidden")) {
				jQuery("#divWorkerCutoffWorkWithFamilies").show(AnimationDelay);
			}
		} else {
			if (jQuery("#divWorkerCutoffWorkWithFamilies").is(":visible")) {
				jQuery("#divWorkerCutoffWorkWithFamilies").hide(AnimationDelay);
			}
		}

		/* if (PC1IDWithTC) {
		if (jQuery("#divPC1IDWithTC").is(":hidden")) {
		jQuery("#divPC1IDWithTC").show(AnimationDelay);
		jQuery(this).children().show(AnimationDelay);
		jQuery('[ID$="txtPC1IDWithTCs"]').show(AnimationDelay);
		}
		} */

		if (PC1IDOnly || WorkerFAWOnly || WorkerSupOnly || WorkerAll || WorkerNoPC1ID
			|| WorkerPC1ID || WorkerFSWOnly || WorkerFatherAdvocate || WorkerFAdvPC1ID || WorkerAllTypes) {

			// DebugWorkerPC1ID("Start");

			if (jQuery("#divByWhom").is(":hidden")) {
				jQuery("#divByWhom").show(AnimationDelay);
			}
			jQuery("#divByWhom").children().show(AnimationDelay);

			if (jQuery('[ID$="rbtnAll"]').is(":hidden")) {
				jQuery('[ID$="rbtnAll"]').show(AnimationDelay).siblings("label").show(AnimationDelay);
			}

			if ((WorkerPC1ID || PC1IDOnly || WorkerFAdvPC1ID) && jQuery("#divPC1ID").is(":hidden")) {
				jQuery("#divPC1ID").removeAttr("disabled").show(AnimationDelay);
			}

			if ((WorkerFAWOnly || WorkerSupOnly || WorkerFSWOnly || WorkerFatherAdvocate || WorkerAllTypes) 
					&& jQuery("#divPC1ID").is(":visible")) {
				jQuery("#divPC1ID").hide(AnimationDelay);
			}

			if (WorkerNoPC1ID) {
				if (jQuery("#divPC1ID").is(":visible")) {
					jQuery("#divPC1ID").hide(AnimationDelay);
				}
				if (jQuery("#divWorker").is(":visible")) {
					jQuery("#divWorker").hide(AnimationDelay);
				}
				if (jQuery("#divFAW").is(":visible")) {
					jQuery("#divFAW").hide(AnimationDelay);
				}
			}

			if (PC1IDOnly) {
				if (jQuery('[ID$="rbtnAll"]').is(":visible")) {
					jQuery('[ID$="rbtnAll"]').hide(AnimationDelay).siblings("label").hide(AnimationDelay);
				}
				if (jQuery("#divSup").is(":visible")) {
					jQuery("#divSup").hide(AnimationDelay);
				}
				if (jQuery("#divWorker").is(":visible")) {
					jQuery("#divWorker").hide(AnimationDelay);
				}
				if (jQuery("#divFSW").is(":visible")) {
					jQuery("#divFSW").hide(AnimationDelay);
				}
				if (jQuery("#divFAW").is(":visible")) {
					jQuery("#divFAW").hide(AnimationDelay);
				}
				if (jQuery("#divFAdv").is(":visible")) {
					jQuery("#divFAdv").hide(AnimationDelay);
				}
				if (jQuery('[ID$="rbtnPC1ID"]').is(":visible")) {
					jQuery('[ID$="rbtnPC1ID"]').hide(AnimationDelay);
				}
				
				jQuery('[ID$="ddlPC1ID"]').show(AnimationDelay).removeAttr("disabled");
				jQuery('[ID$="ddlPC1IDWithClosed"]').removeAttr("disabled").hide(AnimationDelay);
				/* if (jQuery("#chkIncludeClosedCases").is(":hidden")) { */
				jQuery('[ID$="chkIncludeClosedCases"]').removeAttr("disabled").show(AnimationDelay).next().removeAttr("disabled").show(AnimationDelay);
				jQuery('[ID$="chkIncludeClosedCases"]').parent().removeAttr("disabled").show(AnimationDelay);
				/* } */

				jQuery('#divPC1ID input:radio').attr('checked', true);
			}

			if (WorkerFatherAdvocate || WorkerFAdvPC1ID) {

				if (WorkerFatherAdvocate && jQuery("#divSup").is(":hidden")) {
					jQuery("#divSup").show(AnimationDelay);
				}
				if (jQuery("#divWorker").is(":visible")) {
					jQuery("#divWorker").hide(AnimationDelay);
				}
				if (jQuery("#divFSW").is(":visible")) {
					jQuery("#divFSW").hide(AnimationDelay);
				}
				if (jQuery("#divFAW").is(":visible")) {
					jQuery("#divFAW").hide(AnimationDelay);
				}
				if (jQuery("#divFAdv").is(":hidden")) {
					jQuery("#divFAdv").show(AnimationDelay);
				}
			} else {
				if (jQuery("#divFAdv").is(":visible")) {
					jQuery("#divFAdv").hide(AnimationDelay);
				}
			}

			if (WorkerFSWOnly) {
				if (jQuery("#divWorker").is(":visible")) {
					jQuery("#divWorker").hide(AnimationDelay);
				}
				if (jQuery("#divSup").is(":visible")) {
					jQuery("#divSup").hide(AnimationDelay);
				}
				if (jQuery("#divFAW").is(":visible")) {
					jQuery("#divFAW").hide(AnimationDelay);
				}
			}

			if (WorkerFAWOnly) {
				if (jQuery("#divSup").is(":visible")) {
					jQuery("#divSup").hide(AnimationDelay);
				}
				if (jQuery("#divWorker").is(":visible")) {
					jQuery("#divWorker").hide(AnimationDelay);
				}
				if (jQuery("#divFSW").is(":visible")) {
					jQuery("#divFSW").hide(AnimationDelay);
				}
			}

			if (WorkerSupOnly) {
				if (jQuery("#divFSW").is(":visible")) {
					jQuery("#divFSW").hide(AnimationDelay);
				}
				if (jQuery("#divFAW").is(":visible")) {
					jQuery("#divFAW").hide(AnimationDelay);
				}
				if (jQuery("#divWorker").is(":visible")) {
					jQuery("#divWorker").hide(AnimationDelay);
				}
			}

			if (WorkerAll) {
				if (jQuery("#divWorker").is(":visible")) {
					jQuery("#divWorker").hide(AnimationDelay);
				}
				if (jQuery("#divFAW").is(":visible")) {
					jQuery("#divFAW").hide(AnimationDelay);
				}
			}

			if (WorkerAllTypes) {
				if (jQuery("#divFSW").is(":visible")) {
					jQuery("#divFSW").hide(AnimationDelay);
				}
				if (jQuery("#divFAW").is(":visible")) {
					jQuery("#divFAW").hide(AnimationDelay);
				}
				if (jQuery("#divSup").is(":visible")) {
					jQuery("#divSup").hide(AnimationDelay);
				}
			}

			// DebugWorkerPC1ID("Pre-ToggleByWhom");
			// ToggleByWhom();
			// DebugWorkerPC1ID("Post-ToggleByWhom");
			var SelectedByWhomButtonText = jQuery(".ByWhom :radio:checked + label").text();
			ToggleByWhom(SelectedByWhomButtonText);
		} else {
			if (jQuery("#divByWhom").is(":visible")) {
				jQuery("#divByWhom").hide(AnimationDelay);
			}
		}
	} else {
		if (jQuery("#divStartDate").is(":visible")) {
			jQuery("#divStartDate").hide(AnimationDelay);
		}
		if (jQuery("#divEndDate").is(":visible")) {
			jQuery("#divEndDate").hide(AnimationDelay);
		}
		if (jQuery("#divMonths").is(":visible")) {
			jQuery("#divMonths").hide(AnimationDelay);
		}
		if (jQuery("#divQuarters").is(":visible")) {
			jQuery("#divQuarters").hide(AnimationDelay);
		}
		if (jQuery("#divMonthYearOnly").is(":visible")) {
			jQuery("#divMonthYearOnly").hide(AnimationDelay);
		}
		if (jQuery("#divRetentionDetails").is(":visible")) {
			jQuery("#divRetentionDetails").hide(AnimationDelay);
		}
		if (jQuery("#divWorkerCutoffHiredAfter").is(":visible")) {
			jQuery("#divWorkerCutoffHiredAfter").hide(AnimationDelay);
		}
		if (jQuery("#divWorkerCutoffStartedRole").is(":visible")) {
			jQuery("#divWorkerCutoffStartedRole").hide(AnimationDelay);
		}
		if (jQuery("#divWorkerCutoffWorkWithFamilies").is(":visible")) {
			jQuery("#divWorkerCutoffWorkWithFamilies").hide(AnimationDelay);
		}
		if (jQuery("#divByWhom").is(":visible")) {
			jQuery("#divByWhom").hide(AnimationDelay);
		} 
	}

	if (Miscellaneous) {
		if (jQuery("#divMisc").is(":hidden")) {
			jQuery("#divMisc").show(AnimationDelay);
		}
	} else {
		if (jQuery("#divMisc").is(":visible")) {
			jQuery("#divMisc").hide(AnimationDelay);
		}
	}

	if (Miscellaneous) {
		if (MiscPerformanceTargetOptions) {
			if (jQuery("#divPerformanceTargetOptions").is(":hidden")) {
				jQuery("#divPerformanceTargetOptions").show(AnimationDelay);
			}
		} else {
			if (jQuery("#divPerformanceTargetOptions").is(":visible")) {
				jQuery("#divPerformanceTargetOptions").hide(AnimationDelay);
			}
		}

		if (MiscSummaryDetail) {
			if (jQuery("#divSummaryDetail").is(":hidden")) {
				jQuery("#divSummaryDetail").show(AnimationDelay);
			}
		} else {
			if (jQuery("#divSummaryDetail").is(":visible")) {
				jQuery("#divSummaryDetail").hide(AnimationDelay);
			}
		}

		if (MiscByStatus) {
			if (jQuery("#divByStatus").is(":hidden")) {
				jQuery("#divByStatus").show(AnimationDelay);
			}
		} else {
			if (jQuery("#divByStatus").is(":visible")) {
				jQuery("#divByStatus").hide(AnimationDelay);
			}
		}

		if (MiscTicklerSummaries) {
			if (jQuery("#divTicklerSummaries").is(":hidden")) {
				jQuery("#divTicklerSummaries").show(AnimationDelay);
			}
		} else {
			if (jQuery("#divTicklerSummaries").is(":visible")) {
				jQuery("#divTicklerSummaries").hide(AnimationDelay);
			}
		}

		if (MiscHVRecord) {
			if (jQuery("#divHVRecord").is(":hidden")) {
				jQuery("#divHVRecord").show(AnimationDelay);
			}
		} else {
			if (jQuery("#divHVRecord").is(":visible")) {
				jQuery("#divHVRecord").hide(AnimationDelay);
			}
		}

		if (MiscASQUnderCutoff) {
			if (jQuery("#divUnderCutoffASQ").is(":hidden")) {
				jQuery("#divUnderCutoffASQ").show(AnimationDelay);
			}
		} else {
			if (jQuery("#divUnderCutoffASQ").is(":visible")) {
				jQuery("#divUnderCutoffASQ").hide(AnimationDelay);
			}
		}

		if (MiscASQSEOverCutoff) {
			if (jQuery("#divOverCutoffASQSE").is(":hidden")) {
				jQuery("#divOverCutoffASQSE").show(AnimationDelay);
			}
		} else {
			if (jQuery("#divOverCutoffASQSE").is(":visible")) {
				jQuery("#divOverCutoffASQSE").hide(AnimationDelay);
			}
		}

		if (MiscPSIUnderCutoff) {
			if (jQuery("#divUnderCutoffPSI").is(":hidden")) {
				jQuery("#divUnderCutoffPSI").show(AnimationDelay);
			}
		} else {
			if (jQuery("#divUnderCutoffPSI").is(":visible")) {
				jQuery("#divUnderCutoffPSI").hide(AnimationDelay);
			}
		}

		if (MiscReferralSourceBreakdown) {
			if (jQuery("#divReferralSourceBreakdown").is(":hidden")) {
				jQuery("#divReferralSourceBreakdown").show(AnimationDelay);
			}
		} else {
			if (jQuery("#divReferralSourceBreakdown").is(":visible")) {
				jQuery("#divReferralSourceBreakdown").hide(AnimationDelay);
			}
		}

		if (MiscServiceReferralBreakdown) {
			if (jQuery("#divServiceReferralBreakdown").is(":hidden")) {
				jQuery("#divServiceReferralBreakdown").show(AnimationDelay);
			}

			var SelectedSRBButtonText = jQuery(".ServRefBreakdown :radio:checked + label").text();
			ToggleBreakdown(SelectedSRBButtonText,"ServRef");
		} else {
			if (jQuery("#divServiceReferralBreakdown").is(":visible")) {
				jQuery("#divServiceReferralBreakdown").hide(AnimationDelay);
			}
		}

		if (MiscHVLogActivitiesBreakdown) {
			if (jQuery("#divHVLogSummary").is(":hidden")) {
				jQuery("#divHVLogSummary").show(AnimationDelay);
			}

			var SelectedHVLButtonText = jQuery(".HVLogBreakdown :radio:checked + label").text();
			ToggleBreakdown(SelectedHVLButtonText, "HVLog");
		} else {
			if (jQuery("#divHVLogSummary").is(":visible")) {
				jQuery("#divHVLogSummary").hide(AnimationDelay);
			}
		}

		if (MiscIncludeClosedCases) {
			if (jQuery("#divIncludeClosedCases").is(":hidden")) {
				jQuery("#divIncludeClosedCases").show(AnimationDelay);
			}
		} else {
			if (jQuery("#divIncludeClosedCases").is(":visible")) {
				jQuery("#divIncludeClosedCases").hide(AnimationDelay);
			}
		}

		if (MiscFAWTicklerSortOrder) {
			if (jQuery("#divFAWTicklerSortOrder").is(":hidden")) {
				jQuery("#divFAWTicklerSortOrder").show(AnimationDelay);
			}
		} else {
			if (jQuery("#divFAWTicklerSortOrder").is(":visible")) {
				jQuery("#divFAWTicklerSortOrder").hide(AnimationDelay);
			}
		}

		if (MiscQAReportOptions) {
			if (jQuery("#divQAReportOptions").is(":hidden")) {
				jQuery("#divQAReportOptions").show(AnimationDelay);
			}
		} else {
			if (jQuery("#divQAReportOptions").is(":visible")) {
				jQuery("#divQAReportOptions").hide(AnimationDelay);
			}
		}

		if (MiscIncludePreintake) {
			if (jQuery("#divIncludePreintake").is(":hidden")) {
				jQuery("#divIncludePreintake").show(AnimationDelay);
			}
		} else {
			if (jQuery("#divIncludePreintake").is(":visible")) {
				jQuery("#divIncludePreintake").hide(AnimationDelay);
			}
		}

		if (MiscIncludeInactive) {
			if (jQuery("#divIncludeInactive").is(":hidden")) {
				jQuery("#divIncludeInactive").show(AnimationDelay);
			}
		} else {
			if (jQuery("#divIncludeInactive").is(":visible")) {
				jQuery("#divIncludeInactive").hide(AnimationDelay);
			}
		} 
	}

	if (CaseFilters) {
		if (jQuery("#divCaseFilters").is(":hidden")) {
			jQuery("#divCaseFilters").show(AnimationDelay);
		}
	} else {
		if (jQuery("#divCaseFilters").is(":visible")) {
			jQuery("#divCaseFilters").hide(AnimationDelay);
		}
	}

	if (Programs) {
		if (jQuery("#divPrograms").is(":hidden")) {
			jQuery("#divPrograms").show(AnimationDelay);
		}
	} else {
		if (jQuery("#divPrograms").is(":visible")) {
			jQuery("#divPrograms").hide(AnimationDelay);
		}
	}

	if (Sites) {
		if (jQuery("#divSites").is(":hidden")) {
			jQuery("#divSites").show(AnimationDelay);
		}
	} else {
		if (jQuery("#divSites").is(":visible")) {
			jQuery("#divSites").hide(AnimationDelay);
		}
	}
}
/* end of function CriteriaOptions() */

function CalculateDefaultDates(strDefaultOption) {
	/// <summary>Calculate default dates based on the passed date default code
	/// Supported formats for date default code:
	/// <para>
	/// SD<NN> - 00, 01, 03, 06, and 12 are currently used
	/// SD = Starting Date always in relation to current month	
	/// NN = Number of months in range	
	/// 
	/// eg: SD03; Current date = {02/14/2011}; 	
	/// start of range = first of month {02/01/2011} - 3 months = {10/01/2011}
	/// end of range = first of month - 1 day = {01/31/2011}	
	/// </para>
	/// <para>
	/// SD-<NN>,<SS> - this is only used once so far, in the form SD-12,24
	/// End Date = Start of current month minus <NN> months	
	/// Start Date = End Date minus <SS> months	
	/// 
	/// eg: SD-12,24; Current date = {02/14/2011}	
	/// end of range = first of month - 1 day - 12 months = {01/31/2010}
	/// start of range = end of range {01/31/2010} - 24 months = {02/01/2008}	
	/// </para>
	/// <para>
	/// LFQ	
	/// Last Full Quarter dependent on programs contract year (start date) 
	/// </para>
	/// 
	/// Note: these date calculations use date.js, downloaded from datejs.com */
	/// </summary>
	/// <param name="strDefaultOptions" type="String">Code indicating how to calculate the default dates for the selected report</param>

	// strWhichDate - 'start' or 'end' -- first param deprecated, now return an array

	if (strDefaultOption == "" ) /* || strDefaultOption == "LFQ" */
		return;

	var dateStart = new Date();
	var dateEnd = new Date();

	if (strDefaultOption.indexOf('-') > -1) {
		/* dealing with the second form; parse out the number of months to subtract for the start and end dates */
		var numMonthsSubtract = new Number(strDefaultOption.slice(3, 5)) * -1;
		var numMonthsToStart = new Number(strDefaultOption.slice(6, 8)) * -1;

		/* use date.js to easily calculate the end and start dates */
		dateEnd.moveToFirstDayOfMonth().add({ months: numMonthsSubtract });
		dateStart = dateEnd.clone();
		dateStart.add({ months: numMonthsToStart });
		dateEnd.add({ days: -1 });
	} else if (strDefaultOption.indexOf('SD') > -1) {
		/* dealing with the first form; parse out the number of months to subtract for the start date */
		var numMonthsToStart = new Number(strDefaultOption.slice(2, 4)) * -1;
		dateEnd.moveToFirstDayOfMonth();
		dateStart = dateEnd.clone();
		dateStart.add({ months: numMonthsToStart });
		dateEnd.add({ days: -1 });
	} else {
		/* handle the last full quarter default option  -- used to say (actually now the function is current quarter!) <-- no longer */
		/* loop through ddlQuarter's options, skipping the first generic one, and determine which quarter is current one to set default */
		ctlddlQuarter = jQuery('[ID$="ddlQuarter"]');
		ctlddlQuarterOptions = jQuery('[ID$="ddlQuarter"] option');

		if (jQuery('[ID$="txtQtrStartDate"]').val() === "") {
			for (intCounter = ctlddlQuarterOptions.length - 1; intCounter >= 1;  intCounter--) {
				var strOption = ctlddlQuarterOptions[intCounter].value;
				var arrDates = jQuery.parseJSON(strOption);
				dateStart = new Date.parse(arrDates.start);
				dateEnd = new Date.parse(arrDates.end);
				var dateToday = new Date();

				if (dateStart <= dateToday && dateEnd <= dateToday) {
					ctlddlQuarter.val(strOption);
					break;
				}
			}
			/* if we still have no value in the control, set it to the last one in the list */
			if (ctlddlQuarter.val() === null || ctlddlQuarter.val() === '') {
				ctlddlQuarter.val(strOption);
				var arrDates = jQuery.parseJSON(strOption);
				dateStart = arrDates.start;
				dateEnd = arrDates.end;
			}
		} else {
			/* we've already filled in start date, just populate start and end dates */
			dateStart = Date.parse(jQuery('[ID$="txtQtrStartDate"]').val());
			dateEnd = Date.parse(jQuery('[ID$="txtQtrEndDate"]').val());
		}
	}

	var arrReturn = new Array(dateStart, dateEnd);
	return arrReturn;

	//	if (strWhichDate == 'start') {
	//		return dateStart;
	//	} else {
	//		return dateEnd;
	//	}
}
/* end of function CalculateDefaultDates() */

function SetQuarterDates(ctlDDL) {
	/// <summary>Set default quarter start and end dates based on the JSON value of selected ddlQuarter option
	/// </summary>
	/// <param name="ctlDDL" type="Control">Control representing the dropdownlist of quarters</param>
	var strQuarters = ctlDDL.val();
	var strQuarterStart, strQuarterEnd
	if (strQuarters !== "") {
		var arrDates = jQuery.parseJSON(strQuarters);
		strQuarterStart = arrDates.start;
		strQuarterEnd = arrDates.end;
	} else {
		strQuarterStart = ""
		strQuarterEnd = ""
	}
	//	var strQuarterStart = strQuarters.substring(0, 8);
	//	var strQuarterEnd = strQuarters.substring(9);
	jQuery('[ID$="txtQtrStartDate"]').val(strQuarterStart);
	jQuery('[ID$="txtQtrEndDate"]').val(strQuarterEnd);
}
/* end of function SetQuarterDates() */

function ToggleByWhom(RadioValue) {
	/// <summary>Toggles the controls related to the options in the ByWhom group of radiobuttons
	/// </summary>
	/// <param name="RadioValue" type="Control">Text representing the selected ByWhom radiobutton option</param>
	switch (RadioValue) {
		case "All":
			{
				jQuery('#divSup select').attr('disabled', 'disabled').val('');
				jQuery('#divWorker select').attr('disabled', 'disabled').val('');
				jQuery('#divFSW select').attr('disabled', 'disabled').val('');
				jQuery('#divFAW select').attr('disabled', 'disabled').val('');
				jQuery('#divFAdv select').attr('disabled', 'disabled').val('');
				jQuery('#divPC1ID select').attr('disabled', 'disabled').val('');
				jQuery('#divPC1ID input:checkbox').attr('disabled', 'disabled').val('');
			}
			break;

		case "Supervisor":
			{
				jQuery('#divSup select').removeAttr('disabled');
				jQuery('#divWorker select').attr('disabled', 'disabled').val('');
				jQuery('#divFSW select').attr('disabled', 'disabled').val('');
				jQuery('#divFAW select').attr('disabled', 'disabled').val('');
				jQuery('#divFAdv select').attr('disabled', 'disabled').val('');
				jQuery('#divPC1ID select').attr('disabled', 'disabled').val('');
				jQuery('#divPC1ID input:checkbox').attr('disabled', 'disabled').val('');
			}
			break;

		case "Worker":
			{
				jQuery('#divSup select').attr('disabled', 'disabled').val('');
				jQuery('#divWorker select').removeAttr('disabled');
				jQuery('#divFSW select').attr('disabled', 'disabled').val('');
				jQuery('#divFAW select').attr('disabled', 'disabled').val('');
				jQuery('#divFAdv select').attr('disabled', 'disabled').val('');
				jQuery('#divPC1ID select').attr('disabled', 'disabled').val('');
				jQuery('#divPC1ID input:checkbox').attr('disabled', 'disabled').val('');
			}
			break;

		case "FSW":
			{
				jQuery('#divSup select').attr('disabled', 'disabled').val('');
				jQuery('#divWorker select').attr('disabled', 'disabled').val('');
				jQuery('#divFSW select').removeAttr('disabled');
				jQuery('#divFAW select').attr('disabled', 'disabled').val('');
				jQuery('#divFAdv select').attr('disabled', 'disabled').val('');
				jQuery('#divPC1ID select').attr('disabled', 'disabled').val('');
				jQuery('#divPC1ID input:checkbox').attr('disabled', 'disabled').val('');
			}
			break;

		case "FAW":
			{
				jQuery('#divSup select').attr('disabled', 'disabled').val('');
				jQuery('#divWorker select').attr('disabled', 'disabled').val('');
				jQuery('#divFSW select').attr('disabled', 'disabled').val('');
				jQuery('#divFAW select').removeAttr('disabled');
				jQuery('#divFAdv select').attr('disabled', 'disabled').val('');
				jQuery('#divPC1ID select').attr('disabled', 'disabled').val('');
				jQuery('#divPC1ID input:checkbox').attr('disabled', 'disabled').val('');
			}
			break;

		case "FAdv":
			{
				jQuery('#divSup select').attr('disabled', 'disabled').val('');
				jQuery('#divWorker select').attr('disabled', 'disabled').val('');
				jQuery('#divFSW select').attr('disabled', 'disabled').val('');
				jQuery('#divFAW select').attr('disabled', 'disabled').val('');
				jQuery('#divFAdv select').removeAttr('disabled');
				jQuery('#divPC1ID select').attr('disabled', 'disabled').val('');
				jQuery('#divPC1ID input:checkbox').attr('disabled', 'disabled').val('');
			}
			break;

		case "PC1ID":
			{
				jQuery('#divSup select').attr('disabled', 'disabled').val('');
				jQuery('#divWorker select').attr('disabled', 'disabled').val('');
				jQuery('#divFSW select').attr('disabled', 'disabled').val('');
				jQuery('#divFAW select').attr('disabled', 'disabled').val('');
				jQuery('#divFAdv select').attr('disabled', 'disabled').val('');
				jQuery('#divPC1ID select').removeAttr('disabled');
				jQuery('#divPC1ID input:checkbox').removeAttr('disabled');
			}
			break;
	}
}
/* end of function ToggleByWhom() */

function ToggleQuarters(QuarterRadioButtonValue) {
	/// <summary>Toggles between picking a quarter from a dropdownlist or manually entering start and end dates
	/// </summary>
	/// <param name="QuarterRadioButtonValue" type="Control">Text representing the selected Quarters radiobutton option</param>
	if (QuarterRadioButtonValue == " Quarter:") {
		var $ddl = jQuery('[ID$="ddlQuarter"]');
		$ddl.removeAttr('disabled');
		SetQuarterDates($ddl);
		jQuery('[ID$="txtQtrStartDate"]').attr('disabled', 'disabled');
		jQuery('[ID$="txtQtrEndDate"]').attr('disabled', 'disabled');
	} else {
		jQuery('[ID$="ddlQuarter"]').attr('disabled', 'disabled');
		jQuery('[ID$="txtQtrStartDate"]').removeAttr('disabled');
		jQuery('[ID$="txtQtrEndDate"]').removeAttr('disabled');
	}
}
/* end of function ToggleQuarters() */

function ToggleBreakdown(BreakdownRadioButtonValue, WhichReport) {
	/// <summary>Toggles between various breakdown options for the Count of Service Referrals by Code (ServRef) 
	//				and Summary of Home Visit Log Activities (HVLog) reports
	/// </summary>
	/// <param name="BreakdownRadioButtonValue" type="Control">Text representing the selected Breakdown radiobutton option</param>
	/// <param name="WhichReport" type="Control">Text which report to operate on. Choice of ServRef or HVLog</param>
	WhichReport += WhichReport.toString().length = 5 && WhichReport === "ServR" ? "ef" : "";
	var divAll = "#div" + WhichReport + "All" ;
	var divByWorker = "#div" + WhichReport + "ByWorker" ;
	var divByPC1ID = "#div" + WhichReport + "ByPC1ID";

	switch (BreakdownRadioButtonValue) {
		case "All":
			{
				jQuery(divAll).removeAttr("disabled").show(AnimationDelay);
				jQuery(divByWorker).hide(AnimationDelay);
				jQuery(divByWorker + " select").val("");
				jQuery(divByPC1ID + " select").hide(AnimationDelay).val("");
			}
			break;

		case "By Worker":
			{
				jQuery(divAll).hide(AnimationDelay);
				jQuery(divByWorker).removeAttr("disabled").show(AnimationDelay);
				jQuery(divByPC1ID + " select").hide(AnimationDelay).val("");

			}
			break;

		case "By PC1ID":
			{
				jQuery(divAll).hide(AnimationDelay);
				jQuery(divByWorker + " select").val("");
				jQuery(divByWorker).hide(AnimationDelay);
				jQuery(divByPC1ID + " select").removeAttr("disabled").show(AnimationDelay);
			}
			break;
	}
}
/* end of function ToggleBreakdown() */

function toggleHVRecord() {
	var qs = getParameterByName("criteria");
	if (qs.substr(5, 1) == 4) {
		if (jQuery('[ID$="rbtnDetails"]').is(':checked')) {
			jQuery('#divByWhom').show();
			jQuery('#divSup').hide();
			jQuery('#divWorker').show();
			jQuery('#divPC1id').hide();
		} else {
			jQuery('#divByWhom').hide();
		}
	}
}
/* end of function ToggleHVRecord() */

function GetRetentionPeriods(strEndDate) {
	var datEnd = new Date(strEndDate);
	var today = new Date();

	/* check our converted dates to make sure they are > 1950 */
	if (datEnd.getFullYear() < 1950)
		datEnd.setFullYear(datEnd.getFullYear() + 100);

	var strPrefix = new String("This report will include those discharged:<br/>");
	var strStep1 = new String("between Intake and 6m<br/>");
	var strStep2 = new String("between 6m and 12m<br/>");
	var strStep3 = new String("between 12m and 18m<br/>");
	var strStep4 = new String("between 18m and 24m");
	var strMessage = new String(strPrefix);
	var intDays = new TimeSpan(today - datEnd).getDays();
	var intColumns = new Number();

	if (intDays < 183) {
		strMessage = "You must select an end date at least 6 months in the past!";
	} else if (intDays >= 183 && intDays <= 364) {
		strMessage += strStep1;
		intColumns = 1;
	} else if (intDays >= 365 && intDays <= 547) {
		strMessage += strStep1 + strStep2;
		intColumns = 2;
	} else if (intDays >= 548 && intDays <= 729) {
		strMessage += strStep1 + strStep2 + strStep3;
		intColumns = 3;
	} else if (intDays > 729) {
		strMessage += strStep1 + strStep2 + strStep3 + strStep4;
		intColumns = 4;
	}
	// jQuery("#lblRetentionDetails").val(strMessage).show(AnimationDelay);
	return strMessage;
}
/* end of function GetRetentionPeriods() */

function PersistCriteria() {
	var store = sessionStorage;

	store = (function () {
		var self = {};

		self.get = function (key) {
			var b = sessionStorage.getItem(key);
			return b ? JSON.parse(b) : null;
		}

		self.set = function (key, value) {
			var b = JSON.stringify(value);
			sessionStorage.setItem(key, b);
		}

		return self;
	})();

	storeSetCustom(store, 'criteria', '[ID$="hfCriteria"]', 'string');
	storeSetCustom(store, 'defaults', '[ID$="hfDefaults"]', 'string');
	storeSetCustom(store, 'startdate', '[ID$="txtStartDate"]', 'date');
	storeSetCustom(store, 'enddate', '[ID$="txtEndDate"]', 'date');
	storeSetCustom(store, 'monthdate', '[ID$="ddlMonth"]', 'date');
	if (jQuery('[ID$="ddlMonth"]').is(":visible")) {
			/* && ((store.get("startdate") === '' || store.get("startdate") == null) && 
			store.get("monthdate") !== '' && store.get("monthdate") !== null) { */
		var dateStart = new Date.parse(store.get('monthdate'));
		var dateEnd = dateStart.clone();
		dateEnd.add({ months: 1 });
		dateEnd.add({ days: -1 });

		store.set('startdate', dateStart.toString("MM/dd/yy"));
		store.set('enddate', dateEnd.toString("MM/dd/yy"));
	}
	
	if (store.get('monthdate') !== null) {
		var strMonthName = new Date.parse(store.get('monthdate')).toString("MMMM, yyyy");
		store.set('monthname', strMonthName);
	} else {
		store.set('monthname', '');
	}

	storeSetCustom(store, 'qtrstartdate', '[ID$="txtQtrStartDate"]', 'date');
	storeSetCustom(store, 'qtrenddate', '[ID$="txtQtrEndDate"]', 'date');
	
	if (jQuery('[ID$="rbtnDates"]').is(':checked')) {
		var arrQuarterDates = jQuery.parseJSON(jQuery('[ID$="ddlQuarter"]').val());
		var dateQtrStart = arrQuarterDates.start.toString('MM/dd/yy');
		var dateQtrEnd = arrQuarterDates.end.toString('MM/dd/yy');

		if (store.get("qtrstartdate") !== dateQtrStart || store.get("qtrenddate") !== dateQtrEnd) {
			store.set('customquarterlydates', true);
			storeSetCustom(store, 'startdate', '[ID$="txtQtrStartDate"]', 'date');
			storeSetCustom(store, 'enddate', '[ID$="txtQtrEndDate"]', 'date');
		} else {
			store.set('customquarterlydates', false);
		}
	} else {
		store.set('customquarterlydates', false);
	}

	/* use alternate method (ignoring storeSetCustom) to store drop down lists selected value */
	store.set('quarter', jQuery('[ID$="ddlQuarter"] option:selected').text()+':');
	storeSetCustom(store, 'quartervalue', '[ID$="ddlQuarter"] option:selected', 'string');
	if (jQuery('[ID$="ddlQuarter"]').is(":visible") && store.get('customquarterlydates') === false) {
		/* && ((store.get("startdate") === '' || store.get("startdate") == null) && 
		store.get("quarter") !== '' && store.get("quarter") !== null) { */
		storeSetCustom(store, 'startdate', '[ID$="txtQtrStartDate"]', 'date');
		storeSetCustom(store, 'enddate', '[ID$="txtQtrEndDate"]', 'date');
		var arrContractDates = jQuery.parseJSON(jQuery('[ID$="ddlQuarter"]').val());
		if (arrContractDates !== null) {
			var dateContractStart = arrContractDates.contractstart.toString('MM/dd/yy');
			var dateContractEnd = arrContractDates.contractend.toString('MM/dd/yy');
			store.set('contractstartdate', dateContractStart);
			store.set('contractenddate', dateContractEnd);
		}
	} else {
		store.set('contractstartdate', new Date());
		store.set('contractenddate', new Date());
	}

	storeSetCustom(store, 'monthyear', '[ID$="txtMonthYearOnly"]', 'string');
	if (jQuery('[ID$="txtMonthYearOnly"]').is(":visible")) {
			/* && ((store.get("startdate") === '' || store.get("startdate") == null) && 
			 store.get("monthyear") !== '' && store.get("monthyear") !== null) { */
		var dateStart = new Date.parse(store.get('monthyear'));
		var dateEnd = dateStart.clone();
		dateEnd.add({ months: 1 });
		dateEnd.add({ days: -1 });

		store.set('startdate', dateStart.toString("MM/dd/yy"));
		store.set('enddate', dateEnd.toString("MM/dd/yy"));
	}
	storeSetCustom(store, 'workercutoffhiredafter', '[ID$="txtCutoffHiredAfter"]', 'date');
	storeSetCustom(store, 'workercutoffstartedrole', '[ID$="txtCutoffStartedRole"]', 'date');
	storeSetCustom(store, 'workercutoffworkwithfamilies', '[ID$="txtCutoffWorkWithFamilies"]', 'date');
	storeSetCustom(store, 'allworkers', '[ID$="rbtnAll"]', 'bit');
	storeSetCustom(store, 'supervisor', '[ID$="rbtnSup"]', 'bit');
	storeSetCustom(store, 'supervisorfk', '[ID$="ddlSupervisors"]', 'int');
	/* use alternate method (overriding storeSetCustom) to store drop down lists selected value */
	store.set('supervisorname', jQuery('[ID$="ddlSupervisors"] option:selected').text());
	storeSetCustom(store, 'worker', '[ID$="rbtnWorkers"]', 'bit');
	storeSetCustom(store, 'workerfk', '[ID$="ddlWorkers"]', 'int');
	/* use alternate method (overriding storeSetCustom) to store drop down lists selected value */
	store.set('workername', jQuery('[ID$="ddlWorkers"] option:selected').text());
	if (store.get('workerfk') === '' || store.get('workerfk') === null) {
		storeSetCustom(store, 'worker', '[ID$="rbtnFSWs"]', 'bit');
		storeSetCustom(store, 'workerfk', '[ID$="ddlFSWs"]', 'int');
		storeSetCustom(store, 'fsw', '[ID$="rbtnFSWs"]', 'bit');
		storeSetCustom(store, 'fswfk', '[ID$="ddlFSWs"]', 'int');
		/* use alternate method (overriding storeSetCustom) to store drop down lists selected value */
		store.set('workername', jQuery('[ID$="ddlFSWs"] option:selected').text());
	}
	storeSetCustom(store, 'faw', '[ID$="rbtnFAWs"]', 'bit');
	storeSetCustom(store, 'fawfk', '[ID$="ddlFAWs"]', 'int');
	storeSetCustom(store, 'fatheradvocate', '[ID$="rbtnFAdvs"]', 'bit');
	storeSetCustom(store, 'fatheradvocatefk', '[ID$="ddlFAdvs"]', 'int');
	storeSetCustom(store, 'bypc1id', '[ID$="rbtnPC1ID"]', 'bit');
	storeSetCustom(store, 'pc1id', '[ID$="ddlPC1ID"]', 'string');
	storeSetCustom(store, 'includeclosedcasesinpc1idlist', '[ID$="chkIncludeClosedCases"]', 'bit');

	if (jQuery('[ID$="ddlPC1IDWithClosed"]').is(":visible")) {
		storeSetCustom(store, 'pc1id', '[ID$="ddlPC1IDWithClosed"]', 'string');
	}

	storeSetCustom(store, 'performancetargetsummary', '[ID$="chkPTSummary"]', 'bit');
	storeSetCustom(store, 'performancetargetnotmeeting', '[ID$="chkPTNotMeeting"]', 'bit');
	storeSetCustom(store, 'performancetargetinvalidmissing', '[ID$="chkPTInvalidMissing"]', 'bit');
	storeSetCustom(store, 'performancetargetmeeting', '[ID$="chkPTMeeting"]', 'bit');
	storeSetCustom(store, 'summarydetail', '[ID$="rbtnSummary"]', 'bit');
	storeSetCustom(store, 'hvrecordaggregate', '[ID$="rbtnAggregate"]', 'bit');
	storeSetCustom(store, 'hvrecorddetails', '[ID$="rbtnDetails"]', 'bit');
	storeSetCustom(store, 'allstatus', '[ID$="rbtnAllStatus"]', 'bit');
	storeSetCustom(store, 'enrolled', '[ID$="rbtnEnrolled"]', 'bit');
	storeSetCustom(store, 'preintake', '[ID$="rbtnPreintake"]', 'bit');
	storeSetCustom(store, 'preassessment', '[ID$="rbtnPreassessment"]', 'bit');
	//	storeSetCustom(store, 'ticklerdate', '[ID$="ddlTicklerMonth"]', 'bit');
	//	storeSetCustom(store, 'ticklermonthname', '[ID$="ddlTicklerMonth"]', 'string');
	storeSetCustom(store, 'tsumall', '[ID$="rbtnTSumAll"]', 'bit');
	storeSetCustom(store, 'tsumsup', '[ID$="rbtnTSumSup"]', 'bit');
	storeSetCustom(store, 'tsumsupfk', '[ID$="ddlTSumSup"]', 'bit');
	storeSetCustom(store, 'tsumworkers', '[ID$="rbtnTSumWorkers"]', 'bit');
	storeSetCustom(store, 'tsumworkerfk', '[ID$="ddlTSumWorkers"]', 'bit');
	
	storeSetCustom(store, 'tsumreports', '[Name$="rblTSumReports"]:checked', 'string');
	storeSetCustom(store, 'asqundercutoff', '[ID$="chkUnderCutoffASQ"]', 'bit');
	storeSetCustom(store, 'asqseovercutoff', '[ID$="chkOverCutoffASQSE"]', 'bit');
	storeSetCustom(store, 'psiundercutoff', '[ID$="chkUnderCutoffPSI"]', 'bit');

	/* the next 3 are hybrid selections, need to design and assemble values to use in report */
	/* values for screen/referral source demographic and outcome summary report */
	storeSetCustom(store, 'referralsourcebreakdownall', '[ID$="rbtnAllReferralSources"]', 'bit');
	storeSetCustom(store, 'referralsourcebreakdownoneonly', '[ID$="rbtnOnlySelectedReferralSource"]', 'bit');
	storeSetCustom(store, 'referralsourcefk', '[ID$="ddlReferralSource"]', 'int');
	
	/* values for count of service referrals by code report */
	storeSetCustom(store, 'servicereferralsbreakdown', '[ID$="rbtnServiceReferrals"]', 'bit');
	storeSetCustom(store, 'servicereferralsall', '[ID$="rbtnServRefAll"]', 'bit');
	storeSetCustom(store, 'servicereferralsonepageperfsw', '[ID$="rbtnServRefOnePagePerFSW"]', 'bit');
	storeSetCustom(store, 'servicereferralsbyworker', '[ID$="rbtnServRefByWorker"]', 'bit');
	if (store.get("servicereferralsbyworker") === true) {
		storeSetCustom(store, 'workerfk', '[ID$="ddlServRefWorker"]', 'int');
	}
	storeSetCustom(store, 'servicereferralsbyworkerall', '[ID$="rbtnServRefByWorkerAll"]', 'bit');
	storeSetCustom(store, 'servicereferralsonepagepercase', '[ID$="rbtnServRefByWorkerOnePerCase"]', 'bit');
	storeSetCustom(store, 'servicereferralsbypc1id', '[ID$="rbtnServRefByPC1ID"]', 'bit');
	if (store.get("servicereferralsbypc1id") === true) {
		storeSetCustom(store, 'pc1id', '[ID$="ddlServRefPC1ID"]', 'string');
	}

	/* values for home visit log activity summary report */
	storeSetCustom(store, 'hvlogactivitiesbreakdown', '[ID$="rbtnHVLogAll"]', 'bit');
	storeSetCustom(store, 'hvlogactivitiesall', '[ID$="rbtnHVLogSummary"]', 'bit');
	storeSetCustom(store, 'hvlogactivitiesonepageperfsw', '[ID$="rbtnHVLogOnePagePerFSW"]', 'bit');
	storeSetCustom(store, 'hvlogactivitiesbyworker', '[ID$="rbtnHVLogByWorker"]', 'bit');
	if (store.get("hvlogactivitiesbyworker") === true) {
		storeSetCustom(store, 'workerfk', '[ID$="ddlHVLogWorker"]', 'int');
	}
	storeSetCustom(store, 'hvlogactivitiesbyworkerall', '[ID$="rbtnHVLogByWorkerAll"]', 'bit');
	storeSetCustom(store, 'hvlogactivitiesonepagepercase', '[ID$="rbtnHVLogByWorkerOnePerCase"]', 'bit');
	storeSetCustom(store, 'hvlogactivitiesbypc1id', '[ID$="rbtnHVLogByPC1ID"]', 'bit');
	if (store.get("hvlogactivitiesbypc1id") === true) {
		storeSetCustom(store, 'pc1id', '[ID$="ddlHVLogPC1ID"]', 'string');
	}
	storeSetCustom(store, 'includeclosedcases', '[ID$="chkIncludeClosedCasesActiveDuringPeriod"]', 'bit');

	storeSetCustom(store, 'fawticklersortorderscreen', '[ID$="rbtnSortByScreenDate"]', 'bit');
	storeSetCustom(store, 'fawticklersortordertarget', '[ID$="rbtnSortByTargetDate"]', 'bit');

	store.set('fawticklersortorder', jQuery('[ID$="rbtnSortByScreenDate"]').is(':checked') ? 1 : 2);
	storeSetCustom(store, 'qareportoptionsall', '[ID$="rbtnQAAll"]', 'bit');
	storeSetCustom(store, 'qareportoptionsprogram', '[ID$="chkQAProgram"]', 'bit');
	storeSetCustom(store, 'qareportoptionscase', '[ID$="chkQACase"]', 'bit');
	storeSetCustom(store, 'qareportoptionsform', '[ID$="chkQAForm"]', 'bit');

	storeSetCustom(store, 'includepreintake', '[ID$="chkIncludePreintake"]', 'bit');
	storeSetCustom(store, 'includeinactive', '[ID$="chkIncludeInactive"]', 'bit');
	storeSetCustom(store, 'sitefk', '[ID$="ddlSites"]', 'int');
	/* use alternate method (overriding storeSetCustom) to store drop down lists selected value */
	store.set('sitename', jQuery('[ID$="ddlSites"] option:selected').text());	
	
	var arrCaseFilters = GetCaseFilters();
	if (arrCaseFilters !== null && arrCaseFilters !== '' && typeof (arrCaseFilters) == "object") {
		store.set('casefilterspositive', arrCaseFilters[0]);
		store.set('casefilterpositivedescriptions', arrCaseFilters[1]);
		store.set('casefiltersnegative', arrCaseFilters[2]);
		store.set('casefilternegativedescriptions', arrCaseFilters[3]);
	};

	var arrSelectedProgram = GetSelectedPrograms();
	if (arrSelectedProgram !== null && arrSelectedProgram !== '' && typeof(arrSelectedProgram) == "object") {
		store.set('programfks', arrSelectedProgram[0]);
		store.set('programnames', arrSelectedProgram[1]);
	};
}
/* end of function PersistCriteria() */

function storeSetCustom(objStore, strStorageElement, strControlID, strValueType) {
	/// <summary>custom front end to sessionStorage.set() to do the following:
	///		<para>1. Use the correct jQuery function to retrieve value from criteria controls</para>
	/// 	<para>2. Convert the value to the appropriate type. Only options are string, int, bit, date, (and later JSON/Arrays/Objects)</para>
	///		<para>3. Only set the element if we don't have an empty value, except for bits, where 0 is false and not empty</para>
	/// </summary>
	/// <param name="objStore" type="Object">the customized sessionStorage object</param>
	/// <param name="strStorageElement" type="String">name of property of sessionStorage object to store the value</param>
	/// <param name="strControlID" type="String">the ID (ASP.NETified) of the criteria control to use</param>
	/// <param name="strValueType" type="String">value type; string, int, bit or date</param>

	/* custom front end to sessionStorage.set() to do the following:
	1. Use the correct jQuery function to retrieve value from criteria controls
	2. Convert the value to the appropriate type. Only options are string, int, bit, date, 
	(and later JSON/Arrays/Objects)
	3. Only set the element if we don't have an empty value, except for bits, where 0 is false and not empty
	Params:
	objStore - the customized sessionStorage object
	strStorageElement - name of property of sessionStorage object to store the value
	strControlID - the ID (ASP.NETified) of the criteria control to use
	strValueType - value type; string, int, bit or date 
	*/
	var ControlValue;
	var EmptyValue = false;

	if (strValueType == 'string' || strValueType == 'JSON') {
		ControlValue = jQuery(strControlID).val();
		EmptyValue = (ControlValue == '' || ControlValue == null);
	} else if (strValueType == 'int') {
		ControlValue = new Number(jQuery(strControlID).val());
		EmptyValue = (ControlValue == 0 || ControlValue == null);
	} else if (strValueType == 'bit') {
		ControlValue = Boolean(jQuery(strControlID).attr('checked'));
		EmptyValue = false;
	} else if (strValueType == 'date') {
		var ControlDateValue = jQuery(strControlID).val();
		if (ControlDateValue == '' || ControlDateValue == null) {
			EmptyValue = true;
		} else {
			var dateVal = new Date(ControlDateValue);
			if (dateVal.getFullYear() < 1950)
				dateVal.setFullYear(dateVal.getFullYear() + 100);
			ControlValue = dateVal.toString("MM/dd/yy");
		}
	}

	if (!EmptyValue) {
		objStore.set(strStorageElement, ControlValue);
	} else {
		objStore.set(strStorageElement, null);
	}

}
/* end of function storeSetCustom() */

function GetSelectedPrograms() {
	/// <summary>this function returns an array containing the selected program FKs and program names from the Programs checkboxlist control
	/// </summary>
	
	var arrReturn = [];

	/*	if (jQuery(".cblPrograms").length == -1) { */
	if (jQuery(".cblPrograms").is(":hidden")) {
		return ''; 
	};

	/* hard code the NYS ALL variables for now, needs to be fixed later */
	if (jQuery(".cblPrograms input:first").attr("checked")) {
		arrReturn[0] = '1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38';
		arrReturn[1] = 'All New York State';
		return arrReturn;
	}
	/*		return null; */

	var strSelectedPrograms = '';
	var strSelectedProgramNames = '';
	var strVal, strHTML;
	
	jQuery('.cblPrograms input[type=checkbox]:checked').each(function () {
		// var strVal = jQuery(this.id).val();
		// var strVal = jQuery(this.id).closest("tr").find("span").attr("CustomVal");
		// var strVal = jQuery(this).attr("CustomVal");
		strVal = jQuery(this).closest("td").find("span").attr("CustomVal");
		strHTML = jQuery('label[for=' + this.id + ']').html();
		strSelectedPrograms += (strSelectedPrograms.length > 0 ? ',' : '') + strVal;
		strSelectedProgramNames += (strSelectedProgramNames.length > 0 ? ',' : '') + jQuery.trim(strHTML);
	});

	arrReturn[0] = (strSelectedPrograms.length > 0) ? strSelectedPrograms : '';		/* this was appended to the string after "?" + ',' */ 
	arrReturn[1] = (strSelectedProgramNames.length > 0) ? strSelectedProgramNames : '';

	return arrReturn;
}
/* end of function GetSelectedPrograms() */

function GetCaseFilters() {
	/// <summary>this function returns an array containing a comma separated list of 
	///          case filters and descriptions from the case filter grid (table)
	/// </summary>

	if (jQuery('[ID$="gvFilters"]').is(":hidden")) {
		return '';
	};

	var arrReturn = {};

	var strSelectedPositiveFilterName = '';
	var strSelectedPositiveFilterValue = '';
	var strSelectedNegativeFilterName = '';
	var strSelectedNegativeFilterValue = '';

	var strFilterName, booNotEqual, strFilterValue, intSelectedFilterFK

	jQuery('[ID$="chkUse"]:checked').each(function () {
		strFilterName = jQuery(this).closest("tr").children().eq(1).html();
		booNotEqual = jQuery(this).closest("tr").find('[ID$="chkNotEqual"]').is(":checked");
		strFilterValue = jQuery(this).closest("tr").find('[ID$="ddlFilterValue"] option:selected').text();
		// store.set('sitename', jQuery('[ID$="ddlSites"]  option:selected').text()); // attr("SelectedValue")
		intSelectedFilterFK = jQuery(this).closest("tr").find('[ID$="ddlFilterValue"]').val();

		if (booNotEqual) {
			strSelectedNegativeFilterName += ',' + strFilterName;
			strSelectedNegativeFilterValue += ',' + intSelectedFilterFK + strFilterValue; 
		} else {
			strSelectedPositiveFilterName += ',' + strFilterName;
			strSelectedPositiveFilterValue += ',' + intSelectedFilterFK + strFilterValue; /* + '-' + (booNotEqual ? '!' : '') +  */
		}
	});

	arrReturn[0] = (strSelectedPositiveFilterValue.length > 0) ? strSelectedPositiveFilterValue + ',' : '';
	arrReturn[1] = (strSelectedPositiveFilterName.length > 0) ? strSelectedPositiveFilterName + ',' : '';
	arrReturn[2] = (strSelectedNegativeFilterValue.length > 0) ? strSelectedNegativeFilterValue + ',' : '';
	arrReturn[3] = (strSelectedNegativeFilterName.length > 0) ? strSelectedNegativeFilterName + ',' : '';

	return arrReturn;
}
/* end of function GetCaseFilters() */

function GetContractDates() {
	/// <summary>Retrieves the contract start and end dates based on the selected quarter, if applicable
	///			 !!!DEPRECATED!!!
	/// </summary>
	var dateTempContractStart = null;
	var dateTempContractEnd = null;

	// if the quarter drop down is visible and they are not using a custom date range, fill in contract dates
	if (jQuery(".Quarters").is(":visible") && store.get('customquarterlydates') == false) {
		var SelectedQuarterButtonText = jQuery(".Quarters :radio:checked + label").text();

		var ctlddlQuarter = jQuery('[ID$="ddlQuarter"]');
		if (SelectedQuarterButtonText === " Quarter:" && ctlddlQuarter.val() !== "") {
			/* loop through ddlQuarter's options, skipping the first generic one, 
			and determine which quarter is current one to set default */
			ctlddlQuarterOptions = jQuery('[ID$="ddlQuarter"] option');
			/* get the contract start date by grabbing the 2nd (base 0) element of the Quarters drop down */
			var dateTempContractStart = new Date(jQuery.parseJSON(ctlddlQuarterOptions[1].value).start);
			/* get the contract end date by grabbing the current selection's value from the Quarters drop down */
			/* '[ID$="ddlQuarter"] option:selected') */
			var dateTempContractEnd = new Date(jQuery.parseJSON(ctlddlQuarterOptions.filter(":selected").val()).end);

			/* check our converted dates to make sure they are > 1950 */
			if (dateTempContractStart.getFullYear() < 1950)
				dateTempContractStart.setFullYear(dateTempContractStart.getFullYear() + 100);

			if (dateTempContractEnd.getFullYear() < 1950)
				dateTempContractEnd.setFullYear(dateTempContractEnd.getFullYear() + 100);

		}
	}
	var arrContractDates = new Array(dateContractStart, dateContractEnd);
	return arrContractDates;

}
/* end of function GetContractDates() */

function goBack() {
	window.history.back();
}