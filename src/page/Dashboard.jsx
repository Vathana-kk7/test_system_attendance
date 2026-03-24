import React from 'react';
import { CircleCheck, Clock, User, XCircle } from 'lucide-react';
import MyBarChart from '../Components/Chart/MyBarChart';
import { TrendingUp } from 'lucide-react';
import CountingNumber from '../Components/CountingNumber';
import ClassChart from '../Components/Chart/ClassChart';
import Resent_absent from '../Dashboard/Resent_absent';


function Dashboard() {
  const data = [
    {
      id: 1,
      title: 'Total Students',
      value: 12,
      icons: <User className="text-blue-800 w-6 h-6" />,
      color: "bg-blue-200"
    },
    {
      id: 2,
      title: "Present Today",
      value: 2,
      icons: <CircleCheck className="text-green-600 w-6 h-6" />,
      color: "bg-green-200"
    },
    {
      id: 3,
      title: "Absent Today",
      value: 10,
      icons: <XCircle className="text-red-600 w-6 h-6" />,
      color: "bg-red-200"
    },
    {
      id: 4,
      title: "Permission",
      value: 1,
      icons: <Clock className="text-yellow-500 w-6 h-6" />,
      color: "bg-yellow-200"
    },
  ];

  return (
    <div className='p-6' >
     <div className="flex justify-between items-center">
      <div>
        <h1 className='text-2xl font-bold'>Dashboard</h1>
        <p className='text-gray-600'>Overview of attendance system</p>
      </div>
      <div className='text-gray-600'>
        {new Date().toLocaleDateString()} {/* shows current date */}
      </div>
    </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mt-5">
        {data.map((item) => (
          <div
            className="bg-white rounded-lg p-5 shadow-xl ring-2 ring-blue-100 inline-flex items-center"
            key={item.id}
          >
            <div className={`${item.color} p-2 rounded-2xl`}>
              {item.icons}
            </div>
            <div className='ml-4'>
              <h1 className='font-medium text-2xl'>{item.value}</h1>
              <p className='text-gray-600 text-sm'>{item.title}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Bar Chart */}
      <div className='flex justify-center gap-5 mb-5'>
        <div className="w-[960px] mt-8  shadow-xl ring-2 ring-blue-100 h-100 rounded-lg">
          <h1 className='p-5 font-bold text-sm'>Weekly Attendance</h1>
          <MyBarChart />
        </div>
        <div className='w-[605px] p-4 rounded-lg mt-4'>
          <div className='shadow ring-2 ring-blue-100 h-35 rounded-lg mb-5 '>
            <div className='flex'>
              <TrendingUp className='ml-5 mt-5 w-5 h-5 text-green-500' />
              <h1 className='font-bold text-sm  p-5'>Today's Rate</h1>
            </div>
            <div className='ms-5 flex'>
              <h1 className='text-3xl font-bold'>
                <CountingNumber number={100} />
              </h1>
                <h1 className=' text-3xl font-bold ml-1'>%</h1>
            </div>
            <p className='ms-5 mt-2 text-sm text-gray-500'>0 of 12 students present</p>
            
          </div>
          <div className='shadow-xl ring-2 ring-blue-100 h-60 rounded-lg p-5'>
            <h1 className=' text-sm font-bold'>Students by Class</h1>
            <ClassChart className="w-20 h-20 flex justify-center items-center transition-all " />
          </div>
        </div>
      </div>
      <Resent_absent/>
    </div>
  );
}

export default Dashboard;