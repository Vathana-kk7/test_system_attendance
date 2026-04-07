import { FileText, School, Search } from 'lucide-react'
import React, { useState, useEffect } from 'react'
import RateCard from './RateCard'
import PaginationControlled from '../Components/Pagination/Pagination.jsx'
import Reportcourses from './Report_courses.js'
function Student_att_report({ studentStats = [] }) {
  const [filterCourse, setFilterCourse] = useState('');
  const [searchName, setSearchName] = useState('');
  const [page, setPage] = useState(1);
  const itemsPerPage = 3;

  const filteredStats = studentStats.filter(student => 
    (filterCourse === '' || student.course === filterCourse) &&
    (searchName === '' || student.name.toLowerCase().includes(searchName.toLowerCase()))
  );

  const totalPages = Math.ceil(filteredStats.length / itemsPerPage);
  const paginatedStats = filteredStats.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  useEffect(() => {
    setPage(1);
  }, [filterCourse, searchName, studentStats]);

  useEffect(() => {
    if (page > totalPages && totalPages > 0) {
      setPage(1);
    }
  }, [totalPages, page]);

  return (
    <div>
      <div className='flex justify-between gap-3 p-4 border-b border border-gray-200 transition-all rounded-t-lg mt-15'>
        <div className='flex gap-3 items-center'>
          <div><FileText className='w-5 h-5 text-center'/></div>
          <div className='font-bold'>Student Attendance Report</div>
        </div>
        <div className='flex gap-3 flex-wrap'>
          <div className='flex gap-2 items-center p-2 border rounded-lg'>
            <Search className='w-4 h-4' />
            <input 
              type='text' 
              placeholder='Search student name...'
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              className='outline-none text-sm'
            />
          </div>
          {/* <select 
            value={filterCourse} 
            onChange={(e) => setFilterCourse(e.target.value)}
            className='border p-2 rounded-lg text-sm outline-none'
          >
            <option value=''>All Courses</option>
            <option value='PHP'>PHP</option>
            <option value='All Courses'>All Courses</option>
            <option value='Unknown'>Unknown</option>
          </select> */}
        </div>
      </div>
      <div className='overflow-x-auto'>
        <div className='grid grid-cols-7 gap-10 p-3 border-b border border-gray-200 transition-all hover:bg-gray-100 shadow min-w-[800px] bg-gray-50'>
          <div><School className='w-5 h-5 text-center'/></div>
          <div className='text-gray800 font-bold'>Student</div>
          <div className='text-gray800 font-bold'>Name Course</div>
          <div className='text-gray800 font-bold'>Present</div>
          <div className='text-gray800 font-bold'>Absent</div>
          <div className='text-gray800 font-bold'>Permission</div>
          <div className='text-gray800 font-bold'>Rate</div>
        </div>
      </div>
      <div className="overflow-x-auto">
        {paginatedStats.length === 0 ? (
          <div className='p-4 text-center text-gray-500'>No matching students found</div>
        ) : (
          paginatedStats.map((student, index) => (
            <div key={student.id || index} className='grid grid-cols-7 gap-10 p-3 border-b border border-gray-200 justify-center items-center transition-all hover:bg-gray-100 shadow min-w-[800px]'>
              <div className='text-gray-500'>{((page - 1) * itemsPerPage) + index + 1}</div>
              <div className='text-gray-500'>{student.name}</div>
              <div className='text-gray-500'>{student.course}</div>
              <div className='text-green-600 font-semibold'>{student.present}</div>
              <div className='text-red-600 font-semibold'>{student.absent}</div>
              <div className='text-yellow-600 font-semibold'>{student.permission}</div>
              <div className='text-gray-500'>
                <RateCard rate={student.rate} present={student.present} absent={student.absent} permission={student.permission} />
              </div>
            </div>
          ))
        )}
      </div>
      {totalPages > 1 && (
        <div className='fixed bottom-8 right-8'>
          <PaginationControlled page={page} setPage={setPage} total={totalPages} />
        </div>
      )}
    </div>
  )
}

export default Student_att_report