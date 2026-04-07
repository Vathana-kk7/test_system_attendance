import { Search, X, UserPlus, Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import api from '../Components/API/api.jsx';
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import { Crude, CreateStudent, UpdataStudent, DeleteStudent } from "../Components/Students/Crude";
import { getPendingStudents, addPendingStudent, removePendingStudent, clearPendingStudents } from "../Components/Students/PendingStudents";
import "../styles/main.css";
import PaginationControlled from "../Components/Pagination/Pagination.jsx";

function StudentPage() {
  const [page, setPage] = useState(1);
  const itemsPerPage = 8;
  const [loading, setLoading]               = useState(true);
  const [search, setSearch]                 = useState("");
  const [editId, setEditId]                 = useState(null);
  const [addsutdents, setStudents]          = useState(false);
  const [students_save, setStudents_save]   = useState([]);
  const [pendingStudents, setPendingStudents] = useState([]);
  const [courses, setCourses]               = useState([]);
  const [name_student, setNamestudents]     = useState("");
  const [phone, setPhone]                   = useState("");
  const [parent, setParent]                 = useState("");
  const [address, setAddress]               = useState("");
  const [gender, setGender]                = useState("");
  const [course_id, setCourseId]            = useState("");
  const [deleteId, setDeleteId]             = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const allStudents = [...students_save, ...pendingStudents];
  const filteredStudents = Crude({ students: allStudents, search });
  
  const startIndex = (page - 1) * itemsPerPage;
  const paginatedStudents = filteredStudents.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  useEffect(() => { 
    fetchStudent(); 
    fetchCourse(); 
    setPendingStudents(getPendingStudents());
  }, []);

  const fetchStudent = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/student");
      setStudents_save(res.data);
    } catch (error) {
      alert(error.response?.data?.message || "Error fetching students");
    } finally { setLoading(false); }
  };

  const fetchCourse = async () => {
    try {
      const res = await api.get("/api/course");
      setCourses(res.data);
    } catch (error) {
      alert(error.response?.data?.message || "Error fetching courses");
    }
  };

  const toggleModal = () => { resetForm(); setStudents(!addsutdents); };

  const resetForm = () => {
    setNamestudents(""); setPhone(""); setParent("");
    setAddress(""); setGender(""); setCourseId(""); setEditId(null);
  };

  const handesave = async (e) => {
    e.preventDefault();
    if (!name_student || !phone || !parent || !address || !gender || (!editId && !course_id))
      return alert("Please fill all fields");
    const data = { 
      name_student,
      phone: String(phone),
      parent,
      address,
      gender,
      course_id
     };
    try {
      if (editId){ 
        await UpdataStudent(editId, data, fetchStudent);
      } 
      else{
        const selectedCourse = courses.find(c => String(c.id) === String(course_id));
        const courseData = selectedCourse ? {
          id: selectedCourse.id,
          name_course: selectedCourse.name_course,
          name_teacher: selectedCourse.name_teacher,
          time_course: selectedCourse.time_course
        } : null;
        addPendingStudent(data, courseData);
        setPendingStudents(getPendingStudents());
      }
      toggleModal();
    } catch (error) {
      alert(error.response?.data?.message || "Error saving student");
    }
  };

  //Edite
  const handleEdit = (student) => {
    setEditId(student.id);
    setNamestudents(student.name_student);
    setPhone(student.phone);
    setParent(student.parent);
    setAddress(student.address);
    setGender(student.gender);
    setCourseId(String(student.courses?.[0]?.id || ""));
    setStudents(true);
  };
  //Delete
  const showDelete = (id) => { setDeleteId(id); setShowDeleteModal(true); };

  const confirmDelete = async () => {
    await DeleteStudent(deleteId, fetchStudent);
    setShowDeleteModal(false);
    setDeleteId(null);
  };

  if (loading) {
    return (
      <Box sx={{ display:"flex", justifyContent:"center", alignItems:"center", height:"80vh" }}>
        <CircularProgress size={50} />
      </Box>
    );
  }

  return (
    <div className="p-6">

      {/* Header */}
      <div className="flex justify-between items-center mb-5">
        <div>
          <h1 className="font-bold text-2xl">Students</h1>
          <p className="text-gray-500 text-sm mt-0.5">Manage and register students</p>
        </div>
        <button
          onClick={toggleModal}
          className="flex items-center gap-2 px-5 py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-xl font-semibold text-sm cursor-pointer transition"
        >
          + Add Student
        </button>
      </div>

      {/* Search */}
      <div className="relative w-full mb-5">
        <input
          type="search"
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search students..."
          className="w-full border border-gray-200 rounded-2xl py-2.5 pl-10 pr-4 text-sm outline-none focus:border-green-400"
        />
        <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
      </div>

      {/* Table Header */}
      <div className="grid grid-cols-7 gap-4 px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide border border-gray-200 rounded-t-xl bg-gray-50">
        <div>Student</div><div>Course</div><div>Gender</div>
        <div>Phone</div><div>Parent</div><div>Address</div>
        <div className="text-right">Actions</div>
      </div>

      {/* Students List */}
      {paginatedStudents.length === 0 ? (
        <div className="text-center py-16 text-gray-400 border border-t-0 border-gray-200 rounded-b-xl">
          No students found
        </div>
      ) : (
        paginatedStudents.map((value) => (
          <div key={value.id} className="bg-white border border-t-0 border-gray-200 last:rounded-b-xl">
            <div className="grid grid-cols-7 gap-4 px-6 py-4 items-center text-sm hover:bg-gray-50 transition">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-green-100 text-green-700 flex items-center justify-center font-bold text-xs shrink-0">
                  {value.name_student?.split(" ").map((n) => n[0]).join("").slice(0,2).toUpperCase()}
                </div>
                <span className="font-semibold text-gray-800 truncate">{value.name_student}</span>
              </div>
              <div>
                <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-medium">
                  {[...new Map((value.courses || []).map(c => [c.id, c])).values()].map(c => c.name_course).join(", ") || "—"}
                </span>
              </div>
              <div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${value.gender === "Male" ? "bg-sky-50 text-sky-600" : "bg-pink-50 text-pink-600"}`}>
                  {value.gender}
                </span>
              </div>
              <div className="text-gray-600">{value.phone}</div>
              <div className="text-gray-600">{value.parent}</div>
              <div className="truncate text-gray-600">{value.address}</div>
              <div className="flex gap-2 justify-end">
                <button onClick={() => handleEdit(value)}
                  className="w-8 h-8 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-500 flex items-center justify-center transition cursor-pointer text-base">
                  ✏️
                </button>
                <button onClick={() => showDelete(value.id)}
                  className="w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 flex items-center justify-center transition cursor-pointer text-base">
                  🗑️
                </button>
              </div>
            </div>
          </div>
        ))
      )}

      {/* ── Delete Modal ── */}
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

      {/* ── Add / Edit Modal ── */}
      {addsutdents && (
        <div className="form-overlay" onClick={toggleModal}>
          <div className="form-card" onClick={(e) => e.stopPropagation()}>

            {/* Header */}
            <div className="form-header">
              <div className="form-header-top">
                <span className="form-badge">
                  {editId ? "Edit Record" : "New Enrollment"}
                </span>
                <button className="form-close" type="button" onClick={toggleModal}>
                  <X size={14} />
                </button>
              </div>
              <h1 className="form-title">{editId ? "Edit Student" : "Add Student"}</h1>
              <p className="form-subtitle">
                {editId ? "Update the student's information below" : "Fill in the details to register a new student"}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handesave}>
              <div className="form-body">

                {/* Name */}
                <div className="field-group">
                  <label className="field-label">Full Name</label>
                  <div className="field-wrapper">
                    <input type="text" value={name_student}
                      onChange={(e) => setNamestudents(e.target.value)}
                      placeholder="e.g. Sok Dara" className="form-input" />
                  </div>
                </div>

                {/* Course — only on create */}
                {!editId && (
                  <div className="field-group">
                    <label className="field-label">Course</label>
                    <div className="field-wrapper">
                      <select value={course_id} onChange={(e) => setCourseId(e.target.value)} className="form-select">
                        <option value="">Select a course</option>
                        {courses.map((c) => (
                          <option key={c.id} value={String(c.id)}>{c.name_course}</option>
                        ))}
                      </select>
                      <span className="select-arrow">▼</span>
                    </div>
                  </div>
                )}

                {/* Phone + Parent — 2 columns */}
                <div className="form-row">
                  <div className="field-group">
                    <label className="field-label">Phone</label>
                    <div className="field-wrapper">
                      <input type="text" value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="012 345 678" className="form-input" style={{paddingLeft: 14}} />
                    </div>
                  </div>
                  <div className="field-group">
                    <label className="field-label">Gender</label>
                    <div className="field-wrapper">
                      <select value={gender} onChange={(e) => setGender(e.target.value)}
                        className="form-select" style={{paddingLeft: 14}}>
                        <option value="">Select</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </select>
                      <span className="select-arrow">▼</span>
                    </div>
                  </div>
                </div>

                {/* Parent */}
                <div className="field-group">
                  <label className="field-label">Parent Name</label>
                  <div className="field-wrapper">
                    <input type="text" value={parent}
                      onChange={(e) => setParent(e.target.value)}
                      placeholder="Parent's full name" className="form-input" style={{paddingLeft: 14}} />
                  </div>
                </div>

                {/* Address */}
                <div className="field-group">
                  <label className="field-label">Address</label>
                  <div className="field-wrapper">
                    <input type="text" value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Street, City" className="form-input" style={{paddingLeft: 14}} />
                  </div>
                </div>

              </div>

              <div className="form-divider" />

              <div className="form-footer">
                <button type="button" onClick={toggleModal} className="btn-cancel">Cancel</button>
                <button type="submit" className="btn-save">
                  {editId ? "Update Student" : "Save Student"}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}
      <div className='fixed bottom-8 right-8'>
        <PaginationControlled
           page={page}
           setPage={setPage}
           total={Math.ceil(filteredStudents.length / itemsPerPage)}
         />
      </div>
    </div>
  );
}

export default StudentPage;
