import { BadgeCheck, BadgeX, Clock } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import api from '../API/api.jsx';
import Box from "@mui/material/Box";
import CircularProgress from '@mui/material/CircularProgress';

function List() {
  const [student, setStudent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const stuRes = await api.get("/api/student");
        setStudent(stuRes.data);
      } catch (error) {
        console.log(error);
        alert("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}>
        <CircularProgress size={50} />
      </Box>
    )
  }

  return (
    <div>
      {student.map((stu) => {
        // ✅ courses នៅក្នុង student object ហើយ
        const courses = stu.courses || [];

        return (
          <div
            key={stu.id}
            className='w-full flex mb-3 justify-between rounded-lg border border-blue-200 ring-1 ring-blue-200 p-2.5 shadow-lg hover:shadow-xl transition-all'
          >
            {/* LEFT */}
            <div className='flex gap-3 ml-2'>
              <div className='bg-blue-200 rounded-full w-10 h-10 flex items-center justify-center text-blue-800 font-bold'>
                {stu.name_student?.charAt(0).toUpperCase()}
              </div>

              <div>
                <h1 className='text-xl font-medium'>{stu.name_student}</h1>

                {/* ✅ បង្ហាញ courses ទាំងអស់ */}
                {courses.map((c) => (
                  <p key={c.id} className='text-sm text-gray-500'>
                    📚 {c.name_course} | 👨‍🏫 {c.name_teacher} | 🕐 {c.time_course}
                  </p>
                ))}

                {courses.length === 0 && (
                  <p className='text-sm text-gray-400'>No Course</p>
                )}
              </div>
            </div>

            {/* RIGHT BUTTON */}
            <div className='flex gap-1 items-center mr-2'>
              <button className='hover:bg-green-100 hover:text-green-400 cursor-pointer rounded-full p-1.5'>
                <BadgeCheck />
              </button>
              <button className='hover:bg-red-100 hover:text-red-400 cursor-pointer rounded-full p-1.5'>
                <BadgeX />
              </button>
              <button className='hover:bg-yellow-100 hover:text-yellow-400 cursor-pointer rounded-full p-1.5'>
                <Clock />
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default List;