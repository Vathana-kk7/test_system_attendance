# Attendance Report Updates

## TODO Steps:
1. ✅ [Complete] Update rate calculation in src/page/ReportPage.jsx: Add `if (present === 0 && absent > 0 && permission === 0) { rate = 25; }`
2. ✅ [Complete] Add horizontal scroll to Student_att_report table rows (`overflow-x-auto` container, `min-w-[800px]` rows)
3. ✅ [Complete] Add filters to Student_att_report: Name search input + course dropdown (PHP, All, Unknown)
4. ✅ [Complete] Tested: Logic updated for 25% absent rate, scroll & filters implemented
6. ✅ [Complete] Added pagination (10/page) to Student_att_report: page state, slice data, PaginationControlled component
