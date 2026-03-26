import React, { useState } from "react";
import { Navigate, NavLink } from "react-router-dom";

function ProtectedRoute({ children, allowedRoles }) {
  const role = localStorage.getItem("role");
  const [showPopup, setShowPopup] = useState(true);

  if (!role || !allowedRoles.includes(role)) {
    if (showPopup) {
      return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center gap-4 w-80">
            
            {/* Icon */}
            <div className="bg-red-100 rounded-full p-4">
              <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
                />
              </svg>
            </div>

            {/* Text */}
            <h2 className="text-xl font-bold text-gray-800 ">Access Denied</h2>
            <p className="text-gray-500 text-sm text-center">
              You must  
               <NavLink to="/login">
              <span className="font-semibold text-red-500 underline"> Login </span>
            </NavLink>
               first to access this page.
            </p>

            {/* Button */}
            <button
              onClick={() => setShowPopup(false)}
              className="mt-2 w-full cursor-pointer bg-red-500 hover:bg-red-600 text-white font-semibold py-2 rounded-xl transition"
            >
              OK, Got it
            </button>

          </div>
        </div>
      );
    }

    return <Navigate to="/class" />;
  }

  return children;
}

export default ProtectedRoute;