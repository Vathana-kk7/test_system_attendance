import React, { useEffect, useState } from 'react'
import DateNavigator from '../Components/Common/DateNavigator'
import { Circle, RotateCcw } from 'lucide-react';
import List from '../Components/Attendance/List';
import api from '../Components/API/api.jsx';

const getAttendanceStats = (attendanceArray, total) => {
  const present    = attendanceArray.filter(r => r.status === 'present').length;
  const absent     = attendanceArray.filter(r => r.status === 'absent').length;
  const permission = attendanceArray.filter(r => r.status === 'permission').length;
  const unmarked   = Math.max(0, total - present - absent - permission);
  return { present, absent, permission, unmarked };
};

function AttendancePage() {
  const [select, setSelect]                                   = useState("");
  const [selectedDate, setSelectedDate]                       = useState(new Date());
  const [courses, setCourses]                                 = useState([]);
  const [students, setStudents]                               = useState([]);
  const [localAttendance, setLocalAttendance]                 = useState({});
  const [loadedAttendance, setLoadedAttendance]               = useState([]);
  const [permissionNotes, setPermissionNotes]                 = useState({});
  const [permissionInputVisible, setPermissionInputVisible]   = useState(null);
  const [stats, setStats] = useState({ present: 0, absent: 0, permission: 0, unmarked: 0 });

  // ─── Mark single student ───────────────────────────────────────────────────
  const handleMark = (studentId, status, reason = '') => {
    setLocalAttendance(prev => ({ ...prev, [studentId]: status }));
    if (reason) setPermissionNotes(prev => ({ ...prev, [studentId]: reason }));

    const merged   = [...loadedAttendance];
    const existing = merged.find(r => r.student_id == studentId);
    if (!existing) merged.push({ student_id: parseInt(studentId), status, reason });
    else { existing.status = status; existing.reason = reason; }

    setStats(getAttendanceStats(merged, students.length));
    setPermissionInputVisible(null);
  };

  // ─── All Present ──────────────────────────────────────────────────────────
  const handleAllPresent = () => {
    const newLocal = {};
    students.forEach(s => { newLocal[s.id] = 'present'; });
    setLocalAttendance(newLocal);
    const merged = students.map(s => ({ student_id: s.id, status: 'present', reason: '' }));
    setStats(getAttendanceStats(merged, students.length));
  };

  // ─── All Absent ───────────────────────────────────────────────────────────
  const handleAllAbsent = () => {
    const newLocal = {};
    students.forEach(s => { newLocal[s.id] = 'absent'; });
    setLocalAttendance(newLocal);
    const merged = students.map(s => ({ student_id: s.id, status: 'absent', reason: '' }));
    setStats(getAttendanceStats(merged, students.length));
  };

  // ─── Reset ────────────────────────────────────────────────────────────────
  const handleReset = () => {
    setLocalAttendance({});
    setPermissionNotes({});
    setPermissionInputVisible(null);
    setStats(getAttendanceStats(loadedAttendance, students.length));
  };

  // ─── Save to database ─────────────────────────────────────────────────────
  const handleSave = async () => {
    try {
      const dateStr = selectedDate.toISOString().split('T')[0];

      // Merge local changes on top of loaded data (local wins)
      const merged = [...loadedAttendance];
      Object.entries(localAttendance).forEach(([studentId, status]) => {
        const existing = merged.find(r => r.student_id == studentId);
        const reason   = permissionNotes[studentId] || '';
        if (!existing) merged.push({ student_id: parseInt(studentId), status, reason });
        else { existing.status = status; existing.reason = reason; }
      });

      await api.post('/api/attendance', { date: dateStr, attendance: merged });
      alert('Attendance saved successfully!');

      // Sync loaded state with what was saved
      setLoadedAttendance(merged);
      setLocalAttendance({});
      setPermissionNotes({});
      setStats(getAttendanceStats(merged, students.length));
    } catch (error) {
      console.log(error);
      alert('Failed to save attendance.');
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
    try {
      const dateStr = selectedDate.toISOString().split('T')[0];
      const res = await api.get(`/api/attendance?date=${dateStr}`);
      setLoadedAttendance(res.data);
      setLocalAttendance({});
      setPermissionNotes({});
      setPermissionInputVisible(null);
      setStats(getAttendanceStats(res.data, students.length));
    } catch (error) {
      console.log(error);
      setLoadedAttendance([]);
      setStats({ present: 0, absent: 0, permission: 0, unmarked: students.length });
    }
  };

  useEffect(() => {
    fetchCourses();
    fetchStudents();
  }, []);

  useEffect(() => {
    if (students.length > 0) fetchAttendance();
  }, [selectedDate, students.length]);

  return (
    <div className='p-6'>
      <div className='mb-3'>
        <h1 className='font-bold text-2xl'>Mark Attendance</h1>
        <p className='text-gray-600'>Record daily student attendance</p>
      </div>

      {/* ── Top controls ── */}
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
        students={students}
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