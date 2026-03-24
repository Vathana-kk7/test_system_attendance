import { LinearProgress } from '@mui/material'
import { FileText, School } from 'lucide-react'
import React from 'react'
import RateCard from './RateCard'

function Student_att_report() {
  return (
    <div>
        <div className='flex gap-3 p-4 border-b border border-gray-200    transition-all rounded-t-lg mt-15 '>
            <div><FileText className='w-5 h-5 text-center'/></div>
            <div className='font-bold'>Student Attendance Report</div>
        </div>
        <div className='grid grid-cols-7 gap-10 p-3 border-b border border-gray-200 transition-all  hover:bg-gray-100 shadow'>
            <div><School className='w-5 h-5 text-center'/></div>
            <div className='text-gray800 font-bold' >Student</div>
            <div className='text-gray800 font-bold' >Name Cours</div>
            <div className='text-gray800 font-bold' >Present</div>
            <div className='text-gray800 font-bold' >Absent</div>
            <div className='text-gray800 font-bold' >Perrmission</div>
            <div className='text-gray800 font-bold' >Rate</div>
        </div>
        <div className='grid grid-cols-7 gap-10 p-3 border-b border border-gray-200 justify-center items-center   transition-all  hover:bg-gray-100 shadow'>
            <div className='text-gray-500'>1</div>
            <div className='text-gray-500' >Student</div>
            <div className='text-gray-500' >Vathana</div>
            <div className='text-gray-500' >4</div>
            <div className='text-gray-500' >1</div>
            <div className='text-gray-500' >3</div>
            <div className='text-gray-500' ><RateCard/></div>
        </div>
    </div>
  )
}

export default Student_att_report
