import React from 'react'

function Resent_absent() {
  return (
    <div className='rounded-xl border  border-blue-100 p-4 ring-1 ring-blue-100  '>
        <h1 className='font-bold mb-3'>Recent Absences</h1>
        <div className='flex justify-between bg-gray-100 rounded-lg p-2 mb-3'>
            <div className='flex gap-2'>
                <div className='rounded-full  bg-red-200 text-red-700 font-bold px-3 py-2 text-center mt-1.5'>Va</div>
                <div className='text-center'>
                    <h1 className='text-lg font-medium text-center'>Vathana</h1>
                    <p className='text-sm text-center'>PHP-Laravel</p>
                </div>
            </div>
            <div>
                <h1 className='text-center mt-3 mr-3 ' >Mar 6</h1>
            </div>
        </div>
        <div className='flex justify-between bg-gray-100 rounded-lg p-2 mb-3'>
            <div className='flex gap-2'>
                <div className='rounded-full  bg-red-200 text-red-700 font-bold px-3 py-2 text-center mt-1.5'>Va</div>
                <div className='text-center'>
                    <h1 className='text-lg font-medium text-center'>Vathana</h1>
                    <p className='text-sm text-center'>PHP-Laravel</p>
                </div>
            </div>
            <div>
                <h1 className='text-center mt-3 mr-3 ' >Mar 6</h1>
            </div>
        </div>
    </div>
  )
}

export default Resent_absent
