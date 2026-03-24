import { ChartSpline, GraduationCap, LayoutDashboard, NotebookPen, School, User } from 'lucide-react'
import React, { useState } from 'react'
import { NavLink } from 'react-router-dom';

function ListMenu() {
    const menu=[
        {id:"Dashboard",label:"Dashboard",icons: <LayoutDashboard className='w-5 h-5' />,path:"/dashboard"},
        {id:"class",label:"Class",icons: <School className='w-5 h-5' />,path:"/class"},
        {id:"Students",label:"Students",icons: <User className='w-5 h-5' />,path:"/studentpage"},
        {id:"Attendance",label:"Attendance",icons: <NotebookPen className='w-5 h-5' />,path:"/attendance"},
        {id:"Reports",label:"Reports",icons: <ChartSpline className='w-5 h-5' />,path:"/reports"},
    ];
  return (
    <div className='bg-gradient-to-b w-70 from-gray-900 to-gray-800 h-screen fixed top-0 left-0 p-7'>
        <div className='flex items-center  border-b border-gray-700 pb-7'>
            <div className='absolute bg-sky-600 p-3.5 rounded-2xl'>
                <div>
                    <GraduationCap  className='text-white' />
                </div>
            </div>
            <div className='ms-15 text-white relative'>
                <h1 className='font-bold text-xl'>Attendance</h1>
                <p className='font-normal text-gray-400 text-sm'>Management System</p>
            </div>
        </div>
        <div className='mt-3'>
            <div>
                <p className='font-medium text-gray-500'>Menu</p>
            </div>
            {menu.map((item)=>(
            <div className='text-white ' key={item.id}>
               <NavLink to={item.path} className={({ isActive }) => isActive ? 'bg-emerald-600 p-2 rounded-lg flex font-bold' : 'p-2 rounded-lg flex hover:bg-gray-700'}>
                    <h1 className='p-2  rounded-lg flex'>
                        <span>{item.icons}</span>
                        <span className='ms-2'>{item.label}</span>
                    </h1>
                </NavLink>
            </div>
             ))}
        </div>
    </div>
  )
}

export default ListMenu
