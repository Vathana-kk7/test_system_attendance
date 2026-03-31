# Fix Attendance 500 Error - Match Backend API

## Status: Step 2 & 3 Complete ✅

### Steps:
- [x] Understand issue (FK + bulk vs single)
- [x] Step 1: Read Filter.js (client-side course filter)
- [x] Step 2: Update List.jsx → Fetch `/api/course/${select}/students` (pivot IDs)
- [x] Step 3: Update handleSave → Loop single POST `/api/attendance` 
- [ ] Step 4: Test `GET http://127.0.0.1:8000/api/course/1/students` endpoint exists
- [ ] Step 5: Full test save attendance

**Next:** Select course 1, check Network tab for course students fetch, test save.

