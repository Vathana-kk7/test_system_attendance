// import React, { useEffect, useState } from 'react'
// import api from '../Components/API/Api'

// export const Attendance=async(course)=>{
//     const [course,setCourse]=useState([]);
//     useEffect(()=>{
//         const fetchcourse=async()=>{
//             try {
//                 const res=await api.get("/api/course");
//                 const res_data=res.data;
//                 setCourse(res_data);
//             } catch (error) {
//                 if(error.response){
//                     console.error(error.response.data );
//                     alert(error.response.data.message || "False to fetch name Course");
//                 }else{
//                     alert("False to get Course");
//                 }
//             }
//         }
//         fetchcourse();
//     },[]);
// } 
