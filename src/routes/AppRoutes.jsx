import { Routes, Route, Outlet } from 'react-router-dom'
import React, { useState } from 'react'

import Dashboard from '../page/Dashboard'
import AttendancePage from '../page/AttendancePage'
import ClassPage from '../page/ClassPage'
import StudentPage from '../page/StudentPage'
import ListMenu from '../layout/ListMenu'
import ReportPage from '../page/ReportPage'
import Hero from '../layout/Hero'
import LoginPage from '../auth/Login'
import RegisterPage from '../auth/Register'
import ProtectedRoute from '../Components/ProtectedRoute/ProtectedRoute'
import CourseView from '../Components/Course/CourseView'




function MainLayout({ children }) {
  const [menuOpen, setMenuOpen] = useState(true)
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  }

  return (
    <div className="flex">
        {menuOpen && <ListMenu isOpen={menuOpen} />}
      <div className={`${menuOpen ? 'ml-70' : 'ml-0'} flex-1 transition-all duration-300`}>
        <Hero onToggleMenu={toggleMenu} menuOpen={menuOpen} />
        <div className="mt-16">  {/* Content area */}
          {children}
        </div>
      </div>
    </div>
  );
}
function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<MainLayout><LoginPage/></MainLayout>}/>
      {/* <Route path="/attendance" element={<MainLayout><div><AttendancePage/></div></MainLayout>} /> */}
      <Route path="/" element={<MainLayout><Dashboard /></MainLayout>} />
      <Route path="/class" element={<MainLayout><ClassPage /></MainLayout>} />
      <Route path="/studentpage" element={<MainLayout><StudentPage /></MainLayout>} />
      <Route path="/attendance" element={<MainLayout><AttendancePage /></MainLayout>} />
      <Route path="/reports" element={<MainLayout><ReportPage /></MainLayout>} />
      <Route path="/register" element={<MainLayout><div><RegisterPage/></div></MainLayout>} />
      <Route path="/view" element={<MainLayout><CourseView/></MainLayout>} />

      
     <Route 
       path="/dashboard" 
       element={
         <MainLayout>
           <ProtectedRoute allowedRoles={["Teacher"]}>
           <Dashboard />
         </ProtectedRoute>
         </MainLayout>
       } 
     />
    </Routes>
  )
}

export default AppRoutes