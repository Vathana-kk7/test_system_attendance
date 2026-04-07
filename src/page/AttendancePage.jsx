import React, { useEffect, useState } from 'react'
import DateNavigator from '../Components/Common/DateNavigator';
import { Box, Circle, FileDown, RotateCcw, Eye } from 'lucide-react';
import List from '../Components/Attendance/List';
import api from '../Components/API/api.jsx';
import { CircularProgress } from '@mui/material';
import { getPendingStudents, clearPendingStudents } from '../Components/Students/PendingStudents';
import { generateLocally } from '../Components/Utils/pdfGenerator';

const getAttendanceStats = (attendanceArray, total) => {
  const present    = attendanceArray.filter(r => r.status === 'present').length;
  const absent     = attendanceArray.filter(r => r.status === 'absent').length;
  const permission = attendanceArray.filter(r => r.status === 'permission').length;
  const unmarked   = Math.max(0, total - present - absent - permission);
  return { present, absent, permission, unmarked };
};

const isToday = (date) => {
  const today = new Date();
  return date.toDateString() === today.toDateString();
};

function AttendancePage() {
  const [select, setSelect]                                   = useState("");
  const [selectedDate, setSelectedDate]                       = useState(new Date());
  const [courses, setCourses]                                 = useState([]);
  const [students, setStudents]                               = useState([]);
  const [pendingStudents, setPendingStudents]                 = useState([]);
  const [localAttendance, setLocalAttendance]                 = useState({});
  const [loadedAttendance, setLoadedAttendance]               = useState([]);
  const [permissionNotes, setPermissionNotes]                 = useState({});
  const [permissionInputVisible, setPermissionInputVisible]   = useState(null);
  const [loading, setLoading]                                   = useState(false);
  const [stats, setStats] = useState({ present: 0, absent: 0, permission: 0, unmarked: 0 });

  const saveBulkAttendance = async (attendanceMap, notes = {}) => {
    if (!select) return;
    
    const dateStr = selectedDate.toISOString().split('T')[0];
    const courseId = parseInt(select);
    const allStudents = [...students, ...pendingStudents];
    
    const studentsInCourse = allStudents.filter(s => 
      s.courses && s.courses.some(c => Number(c.id) === courseId)
    );
    const validStudentIds = studentsInCourse.map(s => s.id);

    const existingByKey = {};
    loadedAttendance
      .filter(rec => rec.course_id === courseId)
      .forEach(rec => {
        const key = `${rec.student_id}-${rec.course_id}`;
        existingByKey[key] = rec;
      });

    const updates = [];
    const creates = [];

    Object.entries(attendanceMap)
      .filter(([studentId]) => validStudentIds.includes(parseInt(studentId)))
      .forEach(([studentId, status]) => {
        const record = {
          student_id: parseInt(studentId),
          course_id: courseId,
          date: dateStr,
          status,
          reason: notes[studentId] || '',
        };
        
        const key = `${studentId}-${courseId}`;
        if (existingByKey[key]) {
          updates.push({ existing: existingByKey[key], newData: record });
        } else {
          creates.push(record);
        }
      });

    if (updates.length > 0) {
      await Promise.all(
        updates.map(({ existing, newData }) =>
          api.put(`/api/attendance/${existing.id}`, newData)
        )
      );
    }

    if (creates.length > 0) {
      await Promise.all(
        creates.map(record =>
          api.post('/api/attendance', record)
        )
      );
    }

    await fetchAttendance();
  };

  // ─── Mark single student ───────────────────────────────────────────────────
  const handleMark = async (studentId, status, reason = '') => {
    setLocalAttendance(prev => ({
      ...prev,
      [studentId]: status
    }));

    if (reason) {
      setPermissionNotes(prev => ({
        ...prev,
        [studentId]: reason
      }));
    }

    const allStudents = [...students, ...pendingStudents];
    const preview = Object.entries({
      ...Object.fromEntries(
        loadedAttendance.map(r => [r.student_id, r.status])
      ),
      ...localAttendance,
      [studentId]: status
    }).map(([id, status]) => ({
      student_id: parseInt(id),
      status
    }));

    setStats(getAttendanceStats(preview, allStudents.length));
    setPermissionInputVisible(null);

    // Auto-save to database if date is not today
    if (!isToday(selectedDate) && select) {
      const dateStr = selectedDate.toISOString().split('T')[0];
      const courseId = parseInt(select);
      
      const studentsInCourse = allStudents.filter(s => 
        s.courses && s.courses.some(c => Number(c.id) === courseId)
      );
      if (!studentsInCourse.some(s => String(s.id) === String(studentId))) return;

      const existing = loadedAttendance.find(
        r => r.student_id === parseInt(studentId) && r.course_id === courseId
      );

      const record = {
        student_id: parseInt(studentId),
        course_id: courseId,
        date: dateStr,
        status,
        reason: reason || '',
      };

      try {
        if (existing) {
          await api.put(`/api/attendance/${existing.id}`, record);
        } else {
          await api.post('/api/attendance', record);
        }
        await fetchAttendance();
      } catch (error) {
        console.error('Auto-save failed:', error);
      }
    }
  };

  // ─── All Present ──────────────────────────────────────────────────────────
  const handleAllPresent = async () => {
    const allStudents = [...students, ...pendingStudents];
    const newLocal = {};
    allStudents.forEach(s => { newLocal[s.id] = 'present'; });
    setLocalAttendance(newLocal);
    const merged = allStudents.map(s => ({ student_id: s.id, status: 'present', reason: '' }));
    setStats(getAttendanceStats(merged, allStudents.length));

    if (!isToday(selectedDate) && select) {
      await saveBulkAttendance(newLocal);
    }
  };

  // ─── All Absent ───────────────────────────────────────────────────────────
  const handleAllAbsent = async () => {
    const allStudents = [...students, ...pendingStudents];
    const newLocal = {};
    allStudents.forEach(s => { newLocal[s.id] = 'absent'; });
    setLocalAttendance(newLocal);
    const merged = allStudents.map(s => ({ student_id: s.id, status: 'absent', reason: '' }));
    setStats(getAttendanceStats(merged, allStudents.length));

    if (!isToday(selectedDate) && select) {
      await saveBulkAttendance(newLocal);
    }
  };

  // ─── Reset ────────────────────────────────────────────────────────────────
  const handleReset = () => {
    const allStudents = [...students, ...pendingStudents];
    setLocalAttendance({});
    setPermissionNotes({});
    setPermissionInputVisible(null);
    setStats(getAttendanceStats(loadedAttendance, allStudents.length));
  };

  // ─── Save to database ─────────────────────────────────────────────────────
  const handleSave = async () => {
  try {
    if (!select) {
      alert("Please select a course first!");
      return;
    }
    const dateStr = selectedDate.toISOString().split('T')[0];
    const courseId = parseInt(select);

    // Save pending students to database first
    if (pendingStudents.length > 0) {
      await Promise.all(
        pendingStudents.map(student => 
          api.post('/api/student', {
            name_student: student.name_student,
            phone: student.phone,
            parent: student.parent,
            address: student.address,
            gender: student.gender,
            course_id: student.course_id
          })
        )
      );
      clearPendingStudents();
      setPendingStudents([]);
      await fetchStudents();
    }

    // Only process students that belong to the selected course
    const studentsInCourse = students.filter(s => 
      s.courses && s.courses.some(c => Number(c.id) === courseId)
    );
    const validStudentIds = studentsInCourse.map(s => s.id);
    
    // Build existing records lookup for selected course only
    const existingByKey = {};
    loadedAttendance
      .filter(rec => rec.course_id === courseId)
      .forEach(rec => {
        const key = `${rec.student_id}-${rec.course_id}`;
        existingByKey[key] = rec;
      });
    console.log('existingByKey:', existingByKey);

    // Separate into updates and creates
    const updates = [];
    const creates = [];
    
    Object.entries(localAttendance)
      .filter(([studentId]) => validStudentIds.includes(parseInt(studentId)))
      .forEach(([studentId, status]) => {
        console.log('Processing studentId:', studentId, 'status:', status);
        const record = {
          student_id: parseInt(studentId),
          course_id: courseId,
          date: dateStr,
          status,
          reason: permissionNotes[studentId] || '',
        };
        
        const key = `${studentId}-${courseId}`;
        if (existingByKey[key]) {
          updates.push({ existing: existingByKey[key], newData: record });
        } else {
          creates.push(record);
        }
      });

    if (updates.length === 0 && creates.length === 0) {
      alert("No changes to save!");
      return;
    }

    // Process updates (existing records)
    if (updates.length > 0) {
      await Promise.all(
        updates.map(({ existing, newData }) =>
          api.put(`/api/attendance/${existing.id}`, newData)
        )
      );
    }

    // Process creates (new records)
    if (creates.length > 0) {
      await Promise.all(
        creates.map(record =>
          api.post('/api/attendance', record)
        )
      );
    }

    alert('Attendance saved successfully!');

    // ✅ refresh AFTER save
    
    await fetchAttendance();

    // ✅ clear UI state
    setLocalAttendance({});
    setPermissionNotes({});

  } catch (error) {
    console.log(error);
    alert('Failed to save attendance.');
  }
};

  const handleSavePDF = async () => {
    const dateStr = selectedDate.toISOString().split('T')[0];
    const selectedCourse = courses.find(c => c.id === parseInt(select));
    const courseName = selectedCourse?.name_course || 'All Classes';
    
    try {
      const res = await api.get(`/api/attendance?date=${dateStr}`);
      const data = res.data;
      
      if (!data || data.length === 0) {
        alert('No attendance data for this date');
        return;
      }
      
      const doc = generateLocally(data, dateStr, courseName);
      doc.save(`attendance_${dateStr}.pdf`);
    } catch (error) {
      console.error('Save PDF error:', error);
      alert('Failed to save PDF');
    }
  };

  const handlePreviewPDF = async () => {
    const dateStr = selectedDate.toISOString().split('T')[0];
    const selectedCourse = courses.find(c => c.id === parseInt(select));
    const courseName = selectedCourse?.name_course || 'All Classes';
    
    try {
      const res = await api.get(`/api/attendance?date=${dateStr}`);
      const data = res.data;
      
      if (!data || data.length === 0) {
        alert('No attendance data for this date');
        return;
      }
      
      const doc = generateLocally(data, dateStr, courseName);
      const blob = doc.output('blob');
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
    } catch (error) {
      console.error('Preview PDF error:', error);
      alert('Failed to preview PDF');
    }
  };
  
  // ─── Fetch courses ────────────────────────────────────────────────────────
  const fetchCourses = async () => {
    try {
      const res = await api.get("/api/course");
      setCourses(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  // ─── Fetch students ───────────────────────────────────────────────────────
  const fetchStudents = async () => {
    try {
      const res = await api.get("/api/student");
      setStudents(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  // ─── Fetch attendance for selected date ───────────────────────────────────
  const fetchAttendance = async () => {
    const allStudents = [...students, ...pendingStudents];
    try {
      const dateStr = selectedDate.toISOString().split('T')[0];
      const res = await api.get(`/api/attendance?date=${dateStr}`);
      setLoadedAttendance(res.data);
      setLocalAttendance({});
      setPermissionNotes({});
      setPermissionInputVisible(null);
      setStats(getAttendanceStats(res.data, allStudents.length));
    } catch (error) {
      console.log(error);
      setLoadedAttendance([]);
      setStats({ present: 0, absent: 0, permission: 0, unmarked: allStudents.length });
    }
  };

  useEffect(() => {
    fetchCourses();
    fetchStudents();
    setPendingStudents(getPendingStudents());
  }, []);

  useEffect(() => {
    if (students.length > 0 || pendingStudents.length > 0) fetchAttendance();
  }, [selectedDate, students.length, pendingStudents.length]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}>
        <CircularProgress size={50} />
      </Box>
    );
  }

  return (
    <div className='p-6'>
      <div className='mb-3'>
        <h1 className='font-bold text-2xl'>Mark Attendance</h1>
        <p className='text-gray-600'>Record daily student attendance</p>
      </div>

      {/* ── Top controls ── */}
      <div className='flex justify-between items-center mb-5'>
        <div className='flex gap-5 items-center mb-4'>
        <DateNavigator value={selectedDate} onChange={setSelectedDate} />
        <button
          type='button'
          onClick={() => setSelectedDate(new Date())}
          className='text-center p-2 border border-gray-300 px-5 rounded-xl py-1 shadow bg-white font-semibold hover:bg-gray-50 active:bg-gray-100'
        >
          Today
        </button>
        <select
          className="border border-gray-300 p-2 rounded-2xl outline-none w-[150px]"
          onChange={(e) => setSelect(e.target.value)}
          value={select}
        >
          <option value="">All Classes</option>
          {courses.map((course) => (
            <option key={course.id} value={course.id} className="font-semibold">
              {course.name_course}
            </option>
          ))}
        </select>
      </div>
      <div className="flex gap-2">
      <button 
        onClick={handlePreviewPDF}
        className="flex items-center gap-2 my-2 px-4 py-2 cursor-pointer rounded-xl bg-blue-500 hover:bg-blue-600 text-white shadow-md transition duration-200"
      >
        <Eye size={18} />
        Preview PDF
      </button>
      <button 
        onClick={handleSavePDF}
        className="flex items-center gap-2 my-2 px-4 py-2 cursor-pointer rounded-xl bg-green-500 hover:bg-green-600 text-white shadow-md transition duration-200"
      >
        <FileDown size={18} />
        Save PDF
      </button>
    </div>
      </div>

      {/* ── Stats bar ── */}
      <div className='w-full mb-7 border flex justify-between ring-2 ring-blue-100 border-none shadow-lg rounded-lg p-4'>
        <div className='flex gap-5'>
          <div className='flex gap-3'>
            <div className='flex items-center'><Circle className='bg-green-700 text-green-700 rounded-full w-4 h-4' /></div>
            <div className='flex items-center'>{stats.present} Present</div>
          </div>
          <div className='flex gap-3'>
            <div className='flex items-center'><Circle className='bg-red-600 text-red-600 rounded-full w-4 h-4' /></div>
            <div className='flex items-center'>{stats.absent} Absent</div>
          </div>
          <div className='flex gap-3'>
            <div className='flex items-center'><Circle className='bg-yellow-400 text-yellow-400 rounded-full w-4 h-4' /></div>
            <div className='flex items-center'>{stats.permission} Permission</div>
          </div>
          <div className='flex gap-3'>
            <div className='flex items-center'><Circle className='bg-gray-200 text-gray-200 rounded-full w-4 h-4' /></div>
            <div className='flex items-center'>{stats.unmarked} Unmarked</div>
          </div>
        </div>
        <div className='flex gap-2'>
          <button
            onClick={handleAllPresent}
            className='bg-green-100 cursor-pointer rounded-2xl px-3 py-1 hover:bg-green-200 transition-colors'
          >
            All Present
          </button>
          <button
            onClick={handleAllAbsent}
            className='bg-red-100 text-red-600 cursor-pointer rounded-2xl px-3 py-1 hover:bg-red-200 transition-colors'
          >
            All Absent
          </button>
          <div className='bg-gray-200 rounded-2xl cursor-pointer px-3 py-1 flex gap-2 hover:bg-gray-300 transition-colors cursor-pointer'>
            <div className='flex items-center'><RotateCcw className='w-4 h-4' /></div>
            <button onClick={handleReset}>Reset</button>
          </div>
        </div>
      </div>

      {/* ── List ── */}
      <List
        select={select}
        students={[...students, ...pendingStudents]}
        onMarkAttendance={handleMark}
        localAttendance={localAttendance}
        loadedAttendance={loadedAttendance}
        permissionInputVisible={permissionInputVisible}
        setPermissionInputVisible={setPermissionInputVisible}
        permissionNotes={permissionNotes}
        onSave={handleSave}
      />
    </div>
  );
}

export default AttendancePage;