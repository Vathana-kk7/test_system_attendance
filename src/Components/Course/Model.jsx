import React from "react";
import { CircleX } from "lucide-react";

function Model({
  addCourse,
  toggle,
  courseName,
  setCourseName,
  teacherName,
  setTeacherName,
  courseTime,
  setCourseTime,
  handleSave,
}) {
  if (!addCourse) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)" }}
    >
      <div className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-fadeIn">

        {/* Top gradient bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-blue-500 via-violet-500 to-purple-500" />

        <div className="p-7">
          {/* Header */}
          <div className="flex items-center justify-between mb-7">
            <div>
              <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">
                Add New Course
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">
                Fill in the details to create a course
              </p>
            </div>
            <button
              onClick={toggle}
              className="w-9 h-9 flex items-center justify-center rounded-xl text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all duration-200"
            >
              <CircleX size={20} />
            </button>
          </div>

          {/* Form */}
          <form className="space-y-5" onSubmit={handleSave}>

            {/* Course Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                <span className="w-5 h-5 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </span>
                Course Name
              </label>
              <input
                value={courseName}
                onChange={(e) => setCourseName(e.target.value)}
                placeholder="e.g. Vue, React, TypeScript"
                className="w-full border border-gray-200 bg-gray-50 rounded-xl px-4 py-2.5 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent focus:bg-white transition-all duration-200"
              />
            </div>

            {/* Teacher Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                <span className="w-5 h-5 rounded-md bg-violet-50 text-violet-600 flex items-center justify-center">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A9 9 0 1118.88 6.196M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </span>
                Teacher Name
              </label>
              <input
                value={teacherName}
                onChange={(e) => setTeacherName(e.target.value)}
                placeholder="e.g. Vathana"
                className="w-full border border-gray-200 bg-gray-50 rounded-xl px-4 py-2.5 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent focus:bg-white transition-all duration-200"
              />
            </div>

            {/* Course Time */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                <span className="w-5 h-5 rounded-md bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="9" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 7v5l3 3" />
                  </svg>
                </span>
                Course Time
              </label>
              <input
                value={courseTime}
                onChange={(e) => setCourseTime(e.target.value)}
                placeholder="08:00 - 10:00"
                className="w-full border border-gray-200 bg-gray-50 rounded-xl px-4 py-2.5 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent focus:bg-white transition-all duration-200"
              />
            </div>

            {/* Divider */}
            <div className="border-t border-gray-100 pt-1" />

            {/* Actions */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={toggle}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-semibold hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 active:scale-95"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-violet-500 text-white text-sm font-semibold shadow-sm hover:shadow-md hover:opacity-90 transition-all duration-200 active:scale-95 cursor-pointer"
              >
                Save Course
              </button>
            </div>

          </form>
        </div>
      </div>

      {/* Fade-in animation */}
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

export default Model;
