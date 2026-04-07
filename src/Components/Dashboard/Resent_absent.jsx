import React, { useState, useEffect } from 'react'
import api from '../API/api.jsx';
import PaginationControlled from '../Pagination/Pagination.jsx';

const itemsPerPage = 2;

function Resent_absent() {
  const [absences, setAbsences] = useState([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
    const fetchAbsences = async () => {
      try {
        const res = await api.get("/api/attendance");
        const records = res.data;

        const absentRecords = records
          .filter(r => r.status === 'absent')
          .sort((a, b) => new Date(b.date) - new Date(a.date)); // ✅ fixed typo

        const studentsRes = await api.get("/api/student");
        const students = studentsRes.data;

        const enrichedAbsences = absentRecords.map(record => {
          const student = students.find(s => s.id === record.student_id);
          return {
            ...record,
            studentName: student?.name_student || 'Unknown',
            courseName: student?.courses?.[0]?.name_course || 'Unknown',
            initials: (student?.name_student || 'U')
              .split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
          };
        });

        setAbsences(enrichedAbsences); // ✅ no more .slice(0,5) — let pagination handle it
      } catch (error) {
        console.log(error);
      }
    };

    fetchAbsences();
  }, []);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // ✅ Paginate here instead
  const paginatedAbsences = absences.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  return (
    <div className='rounded-xl border border-blue-100 p-4 ring-1 ring-blue-100'>
      <h1 className='font-bold mb-3'>Recent Absences</h1>
      {absences.length === 0 ? (
        <p className="text-gray-500 text-sm">No recent absences</p>
      ) : (
        paginatedAbsences.map((absence) => ( // ✅ use paginatedAbsences
          <div key={absence.id} className='flex justify-between bg-gray-100 rounded-lg p-2 mb-3'>
            <div className='flex gap-2'>
              <div className='rounded-full bg-red-200 text-red-700 font-bold px-3 py-2 text-center mt-1.5'>
                {absence.initials}
              </div>
              <div className='text-center'>
                <h1 className='text-lg font-medium text-center'>{absence.studentName}</h1>
                <p className='text-sm text-center'>{absence.courseName}</p>
              </div>
            </div>
            <div>
              <h1 className='text-center mt-3 mr-3'>{formatDate(absence.date)}</h1>
            </div>
          </div>
        ))
      )}
      <div className='fixed bottom-5 right-8'>
        <PaginationControlled
        page={page}
        setPage={setPage}
        total={Math.ceil(absences.length / itemsPerPage)} // ✅ fixed
      />
      </div>
    </div>
  )
}

export default Resent_absent