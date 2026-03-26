import React, { useEffect, useState } from 'react'
import DateNavigator from '../Components/Common/DateNavigator'
import { Circle, RotateCcw } from 'lucide-react';
import List from '../Components/Attendance/List';
import api from '../Components/API/api.jsx';
function AttendancePage() {
  const [select,setSelect]=useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [courses,setCourses]=useState([]);

  const fetctcourse=async()=>{
    try {
      const res =await api.get("/api/course");
      setCourses(res.data);
      console.log("Fetch successfully course in Attendance")
    } catch (error) {
      if(error.respone){
        console.log(error.respone.data);
      }
    }
  }
  useEffect(()=>{
    fetctcourse();
  },[]);
  
  return (
    <div className='p-6'>
      <div className='mb-3'>
        <h1 className='font-bold text-2xl'>Mark Attendance</h1>
        <p className='text-gray-600'>Record daily student attendance</p>
      </div>
      <div className='flex gap-5 items-center mb-4'>
        <DateNavigator value={selectedDate} onChange={setSelectedDate} />

        <button
          type='button'
          onClick={() => setSelectedDate(new Date())}
          className='text-center p-2 border border-gray-300 px-5 rounded-xl py-1 shadow bg-white font-semibold hover:bg-gray-50 active:bg-gray-100'
        >
          Today
        </button>

        {/* <div className='text-center p-2 border border-gray-300 px-15 rounded-2xl py-1 shadow bg-white'>All Classes</div> */}
        <select className="border border-gray-300 p-2 rounded-2xl outline-none w-[150px]"
          onChange={(e)=>setSelect(e.target.value)}
        >
          <option className="font-semibold mb-2">All Classes</option>
          {courses.map((course)=>(
            <option key={course.id} value={course.id}
              className="font-semibold mb-2">{course.name_course}
             </option>
          ))}
        </select>
      </div>

      {/* absent present permission */}
      <div className='w-full mb-7 border flex justify-between ring-2 ring-blue-100 border-none shadow-lg rounded-lg p-4 '>
        <div className='flex gap-5'>
            <div className='flex  gap-3'> 
              <div className='flex items-center'><Circle className='bg-green-700 text-green-700 rounded-full w-4 h-4'/></div>
              <div className='flex items-center'>0 Present</div>
            </div>
            <div className='flex  gap-3'> 
              <div className='flex items-center'><Circle className='bg-red-600 text-red-600 rounded-full w-4 h-4'/></div>
              <div className='flex items-center'>0 Absent</div>
            </div>
            <div className='flex  gap-3'> 
              <div className='flex items-center'><Circle className='bg-yellow-400 text-yellow-400 rounded-full w-4 h-4'/></div>
              <div className='flex items-center'>0 Permission</div>
            </div>
            <div className='flex  gap-3'> 
              <div className='flex items-center'><Circle className='bg-gray-200 text-gray-200 rounded-full w-4 h-4'/></div>
              <div className='flex items-center'>0 Present</div>
            </div>
           
        </div>
        <div className='flex gap-2 '>
            <button className='bg-green-100 rounded-2xl px-3 py-1'>All Present</button>
            <button className='bg-red-100 text-red-600 rounded-2xl px-3 py-1'>All Absent</button>
            <div className='bg-gray-200 rounded-2xl px-3 py-1 flex gap-2'>
              <div className='flex items-center'><RotateCcw className='w-4 h-4'/></div>
              <button>Reset</button>
            </div>
        </div>
      </div>
      {/* List Attendents */}
        <List select={select}/>
    </div>
  )
}

export default AttendancePage
