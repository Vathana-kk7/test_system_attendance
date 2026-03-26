import React, { useEffect, useState } from 'react';
import api from '../Components/API/api.jsx';
import Model from '../Components/Course/Model';
// import { CreateCourse } from '../services/CreateCourse';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { NavLink } from 'react-router-dom';
import { Create,Update,Delete,Crude } from '../Components/Course/CourseCrude.js';
import { X } from 'lucide-react';
import PaginationControlled from '../Components/Pagination/Pagination';

const CARD_THEMES = [
  { color: 'from-emerald-400 to-teal-500',   accent: 'bg-emerald-50 text-emerald-700' },
  { color: 'from-sky-400 to-blue-500',        accent: 'bg-sky-50 text-sky-700'        },
  { color: 'from-violet-400 to-purple-500',   accent: 'bg-violet-50 text-violet-700'  },
  { color: 'from-rose-400 to-pink-500',       accent: 'bg-rose-50 text-rose-700'      },
];

function CourseCard({ course, index, onEdit, onDelete  }) {
  const [hovered, setHovered] = useState(false);
  const theme = CARD_THEMES[index % CARD_THEMES.length];
  
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
      style={{ transform: hovered ? 'translateY(-4px)' : 'translateY(0)' }}
    >
      {/* Top accent bar */}
      <div className={`h-1.5 w-full bg-gradient-to-r ${theme.color}`} />

      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-5">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">
              Course
            </p>
            <h2 className="text-xl font-bold text-gray-800 leading-tight">
              {course.name_course}
            </h2>
          </div>
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${theme.accent} border-opacity-30`}>
            <span className={`w-1.5 h-1.5 rounded-full animate-pulse bg-current`} />
            New
          </span>
        </div>

        {/* Info rows */}
        <div className="space-y-3 mb-6">
          {/* Course Name */}
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${theme.accent}`}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div>
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Course Name</p>
              <p className="text-sm font-semibold text-gray-700">{course.name_course}</p>
            </div>
          </div>

          {/* Teacher Name */}
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${theme.accent}`}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A9 9 0 1118.88 6.196M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Teacher Name</p>
              <p className="text-sm font-semibold text-gray-700">{course.name_teacher}</p>
            </div>
          </div>

          {/* Course Time */}
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${theme.accent}`}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="9" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 7v5l3 3" />
              </svg>
            </div>
            <div>
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Course Time</p>
              <p className="text-sm font-semibold text-gray-700">{course.time_course}</p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-100 mb-4" />

        {/* Actions */}
        <div className="flex gap-3 mb-3">
          <button
          className="flex-1 py-2.5 cursor-pointer rounded-xl border border-gray-200
           text-gray-600 text-sm font-semibold hover:bg-gray-50
            hover:border-gray-300 transition-all duration-200 active:scale-95"
              onClick={()=>onEdit(course)}
            >
              Edit
          </button>
          <button
            className={`flex-1 py-2.5 rounded-xl cursor-pointer
               text-white text-sm font-semibold bg-gradient-to-r 
               ${theme.color} shadow-sm hover:shadow-md hover:opacity-90
                transition-all duration-200 active:scale-95`}
                onClick={()=>onDelete(course)}
          >
              Delete
          </button>
        </div>
        <div className="flex gap-3">
          <button className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-semibold hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 active:scale-95">
             <NavLink to="/view" className="block w-full h-full">
              View
            </NavLink>
          </button>
          <button
            className={`flex-1 py-2.5 rounded-xl text-white text-sm font-semibold bg-gradient-to-r ${theme.color} shadow-sm hover:shadow-md hover:opacity-90 transition-all duration-200 active:scale-95`}
          >
            <NavLink to="/studentpage" className="block w-full h-full">
              Add Students
            </NavLink>
          </button>
        </div>
      </div>
    </div>
  );
}

function ClassPage() {
  const [addCourse, setAddCourse] = useState(false);

  // form states
  const [courseName, setCourseName]   = useState('');
  const [teacherName, setTeacherName] = useState('');
  const [courseTime, setCourseTime]   = useState('');

  // saved courses
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const [message, setMessage] = useState("");
  const toggle = () => setAddCourse(!addCourse);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  //Edite
  const [editeId,setEditeId]=useState(null);
  const [select,setSelect]=useState("");
  const datastudent=Crude({student:courses,select})
  //Delte
  const [deleteId,setDeleteId]=useState(null);
  
  // Pagination
  const [page, setPage] = useState(1);
  const itemsPerPage = 8;
  const startIndex = (page - 1) * itemsPerPage;
  const paginatedCourses = datastudent.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(datastudent.length / itemsPerPage);
  
  // Reset page when filter changes
  React.useEffect(() => {
    setPage(1);
  }, [select]);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!courseName || !teacherName || !courseTime) return;
    const data = {
    name_course:  courseName,
    name_teacher: teacherName,
    time_course:  courseTime,
  };
    try {
      if(editeId){
        await Update(editeId,data,fetchCourse);
      }else{
        await Create(data,fetchCourse);
      }
      resetForm();
      fetchCourse();
    } catch (error) {
      if (error.response) {
        console.log(error.response.data);
      }
    }
  };
  const handledelete=(id)=>{
    setDeleteId(id);
    setShowDeleteModal(true);

  }
  //reset form
  const resetForm = () => {
    setCourseName('');
    setTeacherName('');
    setCourseTime('');
    setAddCourse(false);
  }
  const handleEdite=(student)=>{
    setEditeId(student.id);
    setCourseName(student.name_course);
    setTeacherName(student.name_teacher);
    setCourseTime(student.time_course);
    setAddCourse(true);
  }
  const fetchCourse = async () => {
    setLoading(true);
    try {
      const response = await api.get('/api/course');
      setCourses(response.data);
    } catch (error) {
      if (error.response) {
        console.log(error.response.data);
      } else {
        alert('Failed to get Course');
      }
    } finally {
      setLoading(false);
    }
  };
  //conform delete
  const confirmDelete = async () => {
      await Delete(deleteId, fetchCourse);
      setShowDeleteModal(false);
      setDeleteId(null);
    };
  useEffect(() => {
    fetchCourse();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress size={50} />
      </Box>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-gray-50 to-slate-200 p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">

  {/* Left: Title + inline filter */}
  <div>
    <div className="flex items-center gap-3">
      <h1 className="text-[22px] font-medium text-gray-900 tracking-tight leading-tight">
        Class Control
      </h1>

      {/* Inline filter pill */}
      <div className="flex items-center gap-1.5 bg-gray-100 border border-gray-200 rounded-full px-3 py-1">
        
        <select className="border border-gray-300 p-2 rounded-2xl outline-none w-[150px]"
        onChange={(e)=>setSelect(e.target.value)} >
          <option className="font-semibold mb-2">All Classes</option>
          {datastudent.map((course)=>(
            <option key={course.id} value={course.id}
              className="font-semibold mb-2">{course.name_course}
             </option>
          ))}
          
        </select>
       
      </div>
    </div>

    <p className="text-sm text-gray-400 mt-1">
      {datastudent.length} course{datastudent.length !== 1 ? "s" : ""} · Control class information and courses
    </p>
  </div>

  {/* Right: Add button */}
    <button
      onClick={toggle}
      className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-medium shadow-none hover:bg-blue-700 transition-all active:scale-95 cursor-pointer"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
      </svg>
      Add course
    </button>
    </div>
      {/* Empty state */}
      {datastudent.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 text-gray-400">
          <svg className="w-16 h-16 mb-4 opacity-30" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <p className="text-lg font-semibold">No courses yet</p>
          <p className="text-sm mt-1">Click "Add Course" to get started.</p>
        </div>
      )}
      {/* Model Edite */}
      {showSuccess && (
        <div className="fixed top-5 right-5 z-50 animate-slideIn">
          <div className="bg-white border border-green-200 shadow-xl rounded-xl px-5 py-4 flex items-center gap-3">
            
            {/* Icon */}
            <div className="w-8 h-8 flex items-center justify-center rounded-full bg-green-100 text-green-600">
              ✓
            </div>

            {/* Text */}
            <p className="text-sm font-medium text-gray-700">
              {message}
            </p>

          </div>
        </div>
      )}
      {/* Model Delete */}
      {showDeleteModal && (
        <div className="form-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="form-card delete-card" style={{width: 420}} onClick={(e) => e.stopPropagation()}>

            <div className="form-header">
              <div className="form-header-top">
                <span className="form-badge">Danger Zone</span>
                <button className="form-close" onClick={() => setShowDeleteModal(false)}>
                  <X size={14} />
                </button>
              </div>
            </div>

            <div className="delete-body">
              <div className="delete-icon-wrap">🗑️</div>
              <h2 className="delete-title">Delete Student?</h2>
              <p className="delete-desc">
                This action is permanent and cannot be undone.<br />
                The student record will be removed from the system.
              </p>
            </div>

            <div className="form-footer" style={{paddingTop: 20}}>
              <button className="btn-cancel" onClick={() => setShowDeleteModal(false)}>
                Cancel
              </button>
              <button className="btn-delete" onClick={confirmDelete}>
                Yes, Delete
              </button>
            </div>

          </div>
        </div>
      )}
      {/* Course Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 left-0 ">
        {paginatedCourses.map((course, index) => (
          <CourseCard
            key={course.id}
            course={course}
            index={index}
            onEdit={handleEdite}
            onDelete={() => handledelete(course.id)}
          />
        ))}
      </div>
      
      {/* Pagination */}
      {datastudent.length > itemsPerPage && (
        <div className="fixed bottom-8 right-8">
          <PaginationControlled
            page={page}
            setPage={setPage}
            total={totalPages}
          />
        </div>
      )}
          
      {/* Modal */}
      <Model
        addCourse={addCourse}
        toggle={toggle}
        courseName={courseName}
        setCourseName={setCourseName}
        teacherName={teacherName}
        setTeacherName={setTeacherName}
        courseTime={courseTime}
        setCourseTime={setCourseTime}
        handleSave={handleSave}
      />
    </div>
  );
}

export default ClassPage;
