import BarAnimation from '../Components/Chart/BarAnimation'
import Student_att_report from '../Report/Student_att_report'

function ReportPage() {
  const data=[
    {
      percentage:"70%",
      color:"text-blue-500",
      des:"Overall Attendance Rate"
    },
    {
      percentage:"40%",
      color:"text-green-500",
      des:"Total Present Records"
    },
    {
      percentage:"60%",
      color:"text-black",
      des:"Total Records"
    },
  ]
  return (
    <div className='p-6'>
      <div className='mb-5 flex justify-between'>
        <div>
          <h1 className='text-2xl font-bold'>Reports</h1>
          <p className='text-gray-600'>Attendance analytics and student reports</p>
        </div>
        <div>
            <select name="" id="" className='border border-gray-400 p-2 px-5 rounded-lg ring-1 ring-blue-100 outline-none'>
              <option value="">All Class</option>
              <option value="">PHP</option>
              <option value="">Laravel</option>
              <option value="">React</option>
            </select>
        </div>
      </div>
      <div className='grid grid-cols-3 mb-7 grid-rows-1 gap-4 ' >
        {data.map((item,index)=>{
          return(
              <div className='border border-blue-100 rounded-xl ring-2 p-4 ring-blue-100 'key={index}>
                  <h1 className={`text-2xl ${item.color} text-center font-bold`}>{item.percentage}</h1>
                  <p className='text-sm text-center text-gray-600'>{item.des}</p>
              </div>
          )
        })}
      </div>
      <div className=' w-full '>
        <BarAnimation/>
      </div>
      <Student_att_report />
    </div>
  )
}

export default ReportPage
