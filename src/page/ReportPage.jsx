import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import BarAnimation from '../Components/Chart/BarAnimation'
import Student_att_report from '../Report/Student_att_report'
import api from '../Components/API/api.jsx';
import Reportcourses from '../Report/Report_courses';
import CountingNumber from '../Components/CountingNumber';

import { getPendingStudents } from '../Components/Students/PendingStudents';

function ReportPage() {
  const [storeCourse, setCourse] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [stats, setStats] = useState({ overallRate: "0%", presentRecords: "0%", absentRecords: "0%", totalRecords: "0%" });
  // const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState({ presentData: [], absentData: [], permissionData: [], xLabels: [] });
  const [studentStats, setStudentStats] = useState([]);
  
  const fetchStatistics = async () => {
    try {
      let url = "/api/attendance";
      if (selectedCourse) {
        url += `?course_id=${selectedCourse}`;
      }
      const res = await api.get(url);
      const records = res.data;
      
      const totalRecords = records.length;
      const presentRecords = records.filter(r => r.status === 'present').length;
      const absentRecords = records.filter(r => r.status === 'absent').length;
      const permissionRecords = records.filter(r => r.status === 'permission').length;
      const overallRate = totalRecords > 0 ? Math.round((presentRecords / totalRecords) * 100) : 0;
      
      setStats({
        overallRate: `${overallRate}%`,
        presentRecords: presentRecords,
        absentRecords: absentRecords,
        totalRecords: totalRecords
      });
    } catch (error) {
      console.log(error);
      setStats({ overallRate: "0%", presentRecords: "0", absentRecords: "0", totalRecords: "0" });
    }
  };

  const fetchChartData = async () => {
    try {
      const res = await api.get("/api/attendance");
      const records = res.data;
      
      const last14Days = [];
      for (let i = 13; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        last14Days.push(date.toISOString().split('T')[0]);
      }

      const presentData = last14Days.map(date => 
        records.filter(r => r.date === date && r.status === 'present').length
      );
      const absentData = last14Days.map(date => 
        records.filter(r => r.date === date && r.status === 'absent').length
      );
      const permissionData = last14Days.map(date => 
        records.filter(r => r.date === date && r.status === 'permission').length
      );

      const xLabels = last14Days.map(date => {
        const d = new Date(date);
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      });

      setChartData({ presentData, absentData, permissionData, xLabels });
    } catch (error) {
      console.log(error);
    }
  };

  const fetchStudentStats = async () => {
    try {
      const [studentsRes, attendanceRes] = await Promise.all([
        api.get("/api/student"),
        selectedCourse ? api.get(`/api/attendance?course_id=${selectedCourse}`) : api.get("/api/attendance")
      ]);
      
      const students = studentsRes.data;
      const attendance = attendanceRes.data;

      const pendingStudents = getPendingStudents();
      const allStudents = [...students, ...pendingStudents];

      const studentStatsData = allStudents.map(student => {
        const studentRecords = attendance.filter(r => {
          const studentId = String(r.student_id);
          return studentId === String(student.id) || studentId === String(student.id)?.replace('pending_', '');
        });
        
        const present = studentRecords.filter(r => r.status === 'present').length;
        const absent = studentRecords.filter(r => r.status === 'absent').length;
        const permission = studentRecords.filter(r => r.status === 'permission').length;
        const total = studentRecords.length;
        let rate = total > 0 ? Math.round((present / total) * 100) : 0;
        
        if (present === 0 && absent > 0 && permission === 0) {
          rate = 25;
        } else if (permission > 0 && present === 0 && absent === 0) {
          rate = 75;
        }

        const courseName = student.courses?.[0]?.name_course || (selectedCourse ? 'Unknown' : 'All Courses');

        return {
          id: student.id,
          name: student.name_student,
          course: courseName,
          present,
          absent,
          permission,
          rate
        };
      });

      setStudentStats(studentStatsData);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchCourse = async () => {
    const data = await Reportcourses();
    setCourse(data);
  };

  useEffect(() => {
    const loadData = async () => {
      // setLoading(true);
      await Promise.all([
        fetchCourse(),
        fetchStatistics(),
        fetchChartData(),
        fetchStudentStats()
      ]);
      // setLoading(false);
    };
    loadData();
  }, []);

  useEffect(() => {
    fetchStatistics();
    fetchStudentStats();
  }, [selectedCourse]);

  const getRateColor = (rate) => {
    const numericRate = typeof rate === 'string' ? parseInt(rate) : rate;
    if (numericRate === 100) return "text-green-500";
    if (numericRate === 0) return "text-red-500";
    if (numericRate === 50) return "text-yellow-500";
    return "text-blue-500";
  };

  const data = [
    {
      percentage: stats.overallRate,
      color: getRateColor(stats.overallRate),
      des: "Overall Attendance Rate",
      isPercent: true
    },
    {
      percentage: stats.presentRecords,
      color: "text-green-500",
      des: "Total Present",
      isPercent: false
    },
    {
      percentage: stats.totalRecords,
      color: "text-black",
      des: "Total Records",
      isPercent: false
    },
  ];

  // if (loading) {
  //   return (
  //     <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
  //       <CircularProgress size={50} />
  //     </Box>
  //   );
  // }

  return (
    <div className='p-6'>
      <div className='mb-5 flex justify-between'>
        <div>
          <h1 className='text-2xl font-bold'>Reports</h1>
          <p className='text-gray-600'>Attendance analytics and student reports</p>
        </div>
        <div>
          <select 
            value={selectedCourse} 
            onChange={(e) => setSelectedCourse(e.target.value)}
            className='border border-gray-400 p-2 px-5 rounded-lg ring-1 ring-blue-100 outline-none'
          >
            <option value="">All Class</option>
            {storeCourse.map((course) => (
              <option key={course.id} value={course.id}>{course.name_course}</option>
            ))}
          </select>
        </div>
      </div>
      <div className='grid grid-cols-3 mb-7 grid-rows-1 gap-4 ' >
        {data.map((item, index) => {
          const numericValue = typeof item.percentage === 'string'
          ? parseInt(item.percentage)   // "85%" → 85
          : item.percentage;            // 42 → 42
            return (
              <div className='border border-blue-100 rounded-xl ring-2 p-4 ring-blue-100' key={index}>
                <h1 className={`text-2xl ${item.color} text-center font-bold`}>
                  <CountingNumber number={numericValue} />
                  {item.isPercent ? '%' : ''}
                </h1>
                <p className='text-sm text-center text-gray-600'>{item.des}</p>
              </div>
            )
          })}

      </div>
      <div className=' w-full '>
        <BarAnimation chartData={chartData} />
      </div>
      <Student_att_report studentStats={studentStats} />
    </div>
  )
}

export default ReportPage