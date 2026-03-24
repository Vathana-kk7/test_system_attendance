import { Search, Pencil, Trash2, UserPlus, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import api from "../Components/API/api.jsx";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";

const AVATAR_COLORS = [
  "from-blue-400 to-blue-500",
  "from-violet-400 to-purple-500",
  "from-emerald-400 to-teal-500",
  "from-rose-400 to-pink-500",
  "from-amber-400 to-orange-500",
];

function getInitials(name = "") {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

function GenderBadge({ gender }) {
  const g = gender?.toLowerCase();
  if (g === "male")
    return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-50 text-sky-600 border border-sky-100">♂ Male</span>;
  if (g === "female")
    return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-pink-50 text-pink-500 border border-pink-100">♀ Female</span>;
  return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-50 text-gray-500 border border-gray-100">{gender}</span>;
}

function StudentPage() {
  const [addsutdents, setStudents] = useState(false);
  const [students_save, setStudents_save] = useState([]);
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState("");

  const [name_student, setNamestudents] = useState("");
  const [phone, setPhone] = useState("");
  const [parent, setParent] = useState("");
  const [address, setAddress] = useState("");
  const [gender, setGender] = useState("");
  const [course_id, setCourseId] = useState("");
  const [loading, setLoading] = useState(true);

  const toggle = () => setStudents(!addsutdents);

  const handesave = async (e) => {
    e.preventDefault();
    if (!name_student || !phone || !parent || !address || !gender || !course_id)
      return alert("Please fill all fields");
    try {
      await api.post("/api/student", { name_student, gender, phone, parent, address, course_id });
      setNamestudents(""); setPhone(""); setParent("");
      setAddress(""); setGender(""); setCourseId("");
      setStudents(false);
      fetchStudent();
    } catch (error) {
      console.log(error.response.data);
      alert(error.response.data.message);
    }
  };

  const fetchStudent = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/student");
      setStudents_save(res.data);
    } catch (error) {
      console.log(error.response.data);
      alert(error.response.data.message);
    } finally { setLoading(false); }
  };

  const fetchCourse = async () => {
    try {
      const res = await api.get("/api/course");
      setCourses(res.data);
    } catch (error) {
      console.log(error.response.data);
      alert(error.response.data.message);
    }
  };

  useEffect(() => { fetchStudent(); fetchCourse(); }, []);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "80vh" }}>
        <CircularProgress size={50} />
      </Box>
    );
  }

  const filtered = students_save.filter((s) =>
    s.name_student?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-gray-50 to-slate-200 p-8">

      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Students</h1>
          <p className="text-gray-400 text-sm mt-1">
            {students_save.length} student{students_save.length !== 1 ? "s" : ""} registered
          </p>
        </div>
        <button
          onClick={toggle}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold shadow hover:bg-blue-700 transition-all active:scale-95 cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          Add Student
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm mb-6">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search students..."
          className="w-full bg-white border border-gray-200 rounded-xl py-2.5 pl-10 pr-4 text-sm text-gray-700 placeholder-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
        />
        <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
        {/* Table Head */}
        <div className="grid grid-cols-7 gap-4 px-6 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider border-b border-gray-100 bg-gray-50">
          <div>Student</div>
          <div>Course</div>
          <div>Gender</div>
          <div>Phone</div>
          <div>Parent</div>
          <div>Address</div>
          <div className="text-right">Actions</div>
        </div>

        {/* Rows */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-300">
            <svg className="w-14 h-14 mb-3" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
            <p className="text-sm font-semibold text-gray-400">No students found</p>
          </div>
        ) : (
          filtered.map((value, index) => (
            <div
              key={value.id}
              className="grid grid-cols-7 gap-4 px-6 py-4 items-center text-sm border-b border-gray-50 hover:bg-blue-50/40 transition-colors duration-150 last:border-none"
            >
              {/* Avatar + Name */}
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${AVATAR_COLORS[index % AVATAR_COLORS.length]} text-white flex items-center justify-center text-xs font-bold shadow-sm flex-shrink-0`}>
                  {getInitials(value.name_student)}
                </div>
                <span className="font-semibold text-gray-800 truncate">{value.name_student}</span>
              </div>

              {/* Course */}
              <div>
                {value.courses?.map((c) => c.name_course).join(", ")
                  ? <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-600 text-xs font-semibold border border-blue-100">
                      {value.courses?.map((c) => c.name_course).join(", ")}
                    </span>
                  : <span className="text-gray-300 text-xs">—</span>
                }
              </div>

              {/* Gender */}
              <div><GenderBadge gender={value.gender} /></div>

              {/* Phone */}
              <div className="text-gray-600">{value.phone}</div>

              {/* Parent */}
              <div className="text-gray-600">{value.parent}</div>

              {/* Address */}
              <div className="text-gray-500 truncate">{value.address}</div>

              {/* Actions */}
              <div className="flex gap-2 justify-end">
                <button className="w-8 h-8 rounded-lg flex items-center justify-center text-blue-500 hover:bg-blue-50 transition-all active:scale-95">
                  <Pencil className="w-4 h-4" />
                </button>
                <button className="w-8 h-8 rounded-lg flex items-center justify-center text-red-400 hover:bg-red-50 transition-all active:scale-95">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {addsutdents && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ backgroundColor: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)" }}
          onClick={toggle}
        >
          <div
            className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-fadeIn"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top bar */}
            <div className="h-1.5 w-full bg-gradient-to-r from-blue-500 via-violet-500 to-purple-500" />

            <div className="p-7">
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">Add New Student</h2>
                  <p className="text-xs text-gray-400 mt-0.5">Fill in the student's information</p>
                </div>
                <button
                  onClick={toggle}
                  className="w-9 h-9 flex items-center justify-center rounded-xl text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handesave} className="space-y-4">

                {/* Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Student Name</label>
                  <input
                    type="text" value={name_student}
                    onChange={(e) => setNamestudents(e.target.value)}
                    placeholder="e.g. Sophea Dara"
                    className="w-full border border-gray-200 bg-gray-50 rounded-xl px-4 py-2.5 text-sm placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white transition-all"
                  />
                </div>

                {/* Course */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Course</label>
                  <select
                    value={course_id} onChange={(e) => setCourseId(e.target.value)}
                    className="w-full border border-gray-200 bg-gray-50 rounded-xl px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:bg-white transition-all appearance-none cursor-pointer"
                  >
                    <option value="">Select a course</option>
                    {courses.map((course) => (
                      <option key={course.id} value={course.id}>{course.name_course}</option>
                    ))}
                  </select>
                </div>

                {/* Gender */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Gender</label>
                  <select
                    value={gender} onChange={(e) => setGender(e.target.value)}
                    className="w-full border border-gray-200 bg-gray-50 rounded-xl px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:bg-white transition-all appearance-none cursor-pointer"
                  >
                    <option value="">Select gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>

                {/* Phone + Parent row */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Phone</label>
                    <input
                      type="text" value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="012 345 678"
                      className="w-full border border-gray-200 bg-gray-50 rounded-xl px-4 py-2.5 text-sm placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:bg-white transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Parent</label>
                    <input
                      type="text" value={parent}
                      onChange={(e) => setParent(e.target.value)}
                      placeholder="Parent name"
                      className="w-full border border-gray-200 bg-gray-50 rounded-xl px-4 py-2.5 text-sm placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:bg-white transition-all"
                    />
                  </div>
                </div>

                {/* Address */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Address</label>
                  <input
                    type="text" value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Phnom Penh, Cambodia"
                    className="w-full border border-gray-200 bg-gray-50 rounded-xl px-4 py-2.5 text-sm placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white transition-all"
                  />
                </div>

                {/* Divider */}
                <div className="border-t border-gray-100 pt-1" />

                {/* Actions */}
                <div className="flex gap-3">
                  <button type="button" onClick={toggle}
                    className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-semibold hover:bg-gray-50 transition-all active:scale-95"
                  >
                    Cancel
                  </button>
                  <button type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-violet-500 text-white text-sm font-semibold shadow-sm hover:shadow-md hover:opacity-90 transition-all active:scale-95 cursor-pointer"
                  >
                    Save Student
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.96) translateY(8px); }
          to   { opacity: 1; transform: scale(1)    translateY(0);   }
        }
        .animate-fadeIn { animation: fadeIn 0.2s ease-out both; }
      `}</style>
    </div>
  );
}

export default StudentPage;
