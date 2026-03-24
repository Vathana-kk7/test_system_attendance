import React from 'react';

function Form_input({
  name_student, setNamestudents,
  name_course, setNamecourse,
  phone, setPhone,
  parentName, setParentName,
  address, setAddress,
  gender, setGender,
  toggle, handesave
}) {
  return (
    <div className='fixed flex justify-center items-center inset-0 z-50 bg-black/50' onClick={toggle}>
      <div className='bg-white shadow-lg w-[500px] h-[500px] p-7 rounded-2xl' onClick={e => e.stopPropagation()}>
        <form onSubmit={handesave}>
          <h1 className='text-center mb-3 font-bold text-2xl'>Add Students</h1>

          <input type="text" value={name_student || ''} onChange={e => setNamestudents(e.target.value)} placeholder='Name Student' className='mb-4 border border-gray-400 p-2 w-full rounded-lg' />
          <input type="text" value={name_course || ''} onChange={e => setNamecourse(e.target.value)} placeholder='Course Name' className='mb-4 border border-gray-400 p-2 w-full rounded-lg' />
          <input type="text" value={phone || ''} onChange={e => setPhone(e.target.value)} placeholder='Phone' className='mb-4 border border-gray-400 p-2 w-full rounded-lg' />
          <input type="text" value={parentName || ''} onChange={e => setParentName(e.target.value)} placeholder='Parent' className='mb-4 border border-gray-400 p-2 w-full rounded-lg' />
          <input type="text" value={address || ''} onChange={e => setAddress(e.target.value)} placeholder='Address' className='mb-4 border border-gray-400 p-2 w-full rounded-lg' />
          <input type="text" value={gender || ''} onChange={e => setGender(e.target.value)} placeholder='Gender' className='mb-4 border border-gray-400 p-2 w-full rounded-lg' />

          <div className='flex justify-between'>
            <button type='button' onClick={toggle} className='bg-red-500 text-white rounded-lg p-2 px-4'>Cancel</button>
            <button type='submit' className='bg-green-500 text-white rounded-lg p-2 px-4'>Save</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Form_input;