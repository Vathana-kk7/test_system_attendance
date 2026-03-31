import { BadgeCheck, BadgeX, Clock } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import Box from "@mui/material/Box";
import CircularProgress from '@mui/material/CircularProgress';
import { Filter } from './Filter.js';
import PaginationControlled from '../Pagination/Pagination.jsx';

function List({
  select,
  students = [],
  onMarkAttendance,
  localAttendance = {},
  loadedAttendance = [],
  permissionInputVisible,
  setPermissionInputVisible,
  permissionNotes = {},
  onSave,
}) {
  const [page, setPage]         = useState(1);
  const [saving, setSaving]     = useState(false);
  const itemsPerPage            = 7;

  const filteredStudents  = Filter({ newfilte: students, select });
  const startIndex        = (page - 1) * itemsPerPage;
  const paginatedStudents = filteredStudents.slice(startIndex, startIndex + itemsPerPage);

  useEffect(() => { setPage(1); }, [select]);

  // Local override takes priority over loaded DB data
  const getStatus = (stuId) => {
    if (localAttendance[stuId]) return localAttendance[stuId];
    const loaded = loadedAttendance.find(r => r.student_id == stuId);
    return loaded ? loaded.status : null;
  };

  const handleSaveClick = async () => {
    setSaving(true);
    try {
      await onSave();
    } finally {
      setSaving(false);
    }
  };

  if (students.length === 0) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}>
        <CircularProgress size={50} />
      </Box>
    );
  }

  return (
    <div className='pb-24'>
      {paginatedStudents.map((stu) => {
        const courses       = stu.courses || [];
        const currentStatus = getStatus(stu.id);

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
                {courses.map((c) => (
                  <p key={c.id} className='text-sm text-gray-500'>
                    📚 {c.name_course} | 👨‍🏫 {c.name_teacher} | 🕐 {c.time_course}
                  </p>
                ))}
                {courses.length === 0 && (
                  <p className='text-sm text-gray-400'>No Course</p>
                )}

                {/* Permission reason input */}
                {permissionInputVisible === stu.id && (
                  <div className='mt-2 flex gap-2'>
                    <input
                      id={`reason-${stu.id}`}
                      type='text'
                      defaultValue={permissionNotes[stu.id] || ''}
                      placeholder='Enter reason...'
                      className='border border-gray-300 rounded-lg px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-yellow-300'
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') onMarkAttendance(stu.id, 'permission', e.target.value);
                      }}
                    />
                    <button
                      className='text-xs bg-yellow-100 text-yellow-700 px-3 py-1 rounded-lg hover:bg-yellow-200 transition-colors'
                      onClick={() => {
                        const val = document.getElementById(`reason-${stu.id}`)?.value || '';
                        onMarkAttendance(stu.id, 'permission', val);
                      }}
                    >
                      Save
                    </button>
                    <button
                      className='text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-lg hover:bg-gray-200 transition-colors'
                      onClick={() => setPermissionInputVisible(null)}
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT BUTTONS */}
            <div className='flex gap-1 items-center mr-2'>
              {/* Present */}
              <button
                className={`p-1.5 rounded-full transition-all cursor-pointer
                  ${currentStatus === 'present'
                    ? 'bg-green-400 text-white shadow-lg ring-2 ring-green-500'
                    : 'hover:bg-green-100 hover:text-green-600 hover:shadow-md text-gray-400'
                  }`}
                onClick={() => onMarkAttendance(stu.id, 'present')}
                title="Mark Present"
              >
                <BadgeCheck size={20} />
              </button>

              {/* Absent */}
              <button
                className={`p-1.5 rounded-full transition-all cursor-pointer
                  ${currentStatus === 'absent'
                    ? 'bg-red-400 text-white shadow-lg ring-2 ring-red-500'
                    : 'hover:bg-red-100 hover:text-red-600 hover:shadow-md text-gray-400'
                  }`}
                onClick={() => onMarkAttendance(stu.id, 'absent')}
                title="Mark Absent"
              >
                <BadgeX size={20} />
              </button>

              {/* Permission */}
              <button
                className={`p-1.5 rounded-full transition-all cursor-pointer
                  ${currentStatus === 'permission'
                    ? 'bg-yellow-400 text-white shadow-lg ring-2 ring-yellow-500'
                    : 'hover:bg-yellow-100 hover:text-yellow-600 hover:shadow-md text-gray-400'
                  }`}
                onClick={() => setPermissionInputVisible(
                  permissionInputVisible === stu.id ? null : stu.id
                )}
                title="Mark Permission"
              >
                <Clock size={20} />
              </button>
            </div>
          </div>
        );
      })}

      {/* ── Fixed bottom bar ── */}
      <div className='fixed bottom-5 right-8 flex gap-3 items-center'>
        <button type='submit'
          onClick={handleSaveClick}
          disabled={saving}
          className={`px-10 py-2 rounded-2xl shadow-lg font-semibold text-white transition-colors
            ${saving
              ? 'bg-green-400 cursor-not-allowed'
              : 'bg-green-700 hover:bg-green-800 active:bg-green-900 cursor-pointer'
            }`}
        >
          {saving ? 'Saving...' : 'Save'}
        </button>
        <PaginationControlled
          page={page}
          setPage={setPage}
          total={Math.ceil(filteredStudents.length / itemsPerPage)}
        />
      </div>
    </div>
  );
}

export default List;