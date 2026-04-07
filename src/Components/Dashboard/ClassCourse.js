import api from '../API/api.jsx';
export const ClassCourse=async()=>{
    try {
        const res=await api.get("/api/course");
        return res.data;
    } catch (error) {
        alert("Error fetching courses: " + error.message);
        return [];
    }
}