// import axios from 'axios'
// import React from 'react'

// const api=axios.create({
//     baseURL:"https://laravel-test-api-qpy0.onrender.com"
// });
// api.interceptors.request.use(config=>{
//     const token=localStorage.getItem("token");
//     if(token){
//         config.headers.Authorization=`Bearer ${token}`;
//     }
//     return config;
// })

// export default api


import axios from 'axios'

const api = axios.create({
    baseURL: "https://laravel-test-api-qpy0.onrender.com"
});
// https://laravel-test-api-qpy0.onrender.com/api/student
// http://127.0.0.1:8000
api.interceptors.request.use(config => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
})

export default api