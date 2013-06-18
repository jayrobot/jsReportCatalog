jsReportCatalog
===============

A front end for a set of DevExpress reports (SQL Server backend) using Javascript, [jQuery] [1], [jQueryUI] [2], the [dataTables] [3] plugin, and [Bootstrap] [4].
  [1]: http://jquery.com/       "jQuery"
  [2]: http://jqueryui.com/     "jQueryUI"
  [3]: http://datatables.net/   "dataTables"
  [4]: http://twitter.github.io/bootstrap  "Bootstrap"

ReportCatalog table
-------------------
1. Creation script
```sql
	create table [dbo].[codeReportCatalog](
	  [codeReportCatalogPK] [int] identity (1,1) not null,	  
		[CriteriaOptions] [varchar](25) null,		
		[Defaults] [varchar](20) null,		
		[Keywords] [varchar](max) null,		
		[OldReportFK] [int] null,		
		[OldReportID] [nchar](5) null,		
		[ReportCategory] [varchar](20) null,		
		[ReportClass] [varchar](50) null,		
		[ReportDescription] [varchar](1000) null,		
		[ReportName] [varchar](100) null,		
		constraint [PK_codeReportCatalog] primary key clustered		
		(		
		[codeReportCatalogPK] asc		
		) with (pad_index = off,statistics_norecompute = off,ignore_dup_key = off,allow_row_locks = on,allow_page_locks = on) on 		
			[PRIMARY]			
	) on [PRIMARY]	
	
	go
```

2. Column descriptions
	* codeReportCatalogPK - autoinc id
	* CriteriaOptions - comma separated list of 3 character criteria options (see Table of Criteria Options).
	* Defaults - 3 character default date option.
	* Keywords - not displayed, used for searching and categorizing only.
	* OldReportFK - no longer used, was used to import history data.
	* OldReportID - id of the report in the old data system.
	* ReportCategory - category of the report. The following are supported by the category filtering code: 
		* Lists
		* Ticklers
		* Analysis
		* Quarterlies
		* Accreditation
		* Training
	* ReportClass - the name of the VB.NET class representing the report, minus the standard ```rpt``` prefix.
	* ReportDescription - description of the report, displayed in tooltip.
	* ReportName - the name that displays in the main interface table.
