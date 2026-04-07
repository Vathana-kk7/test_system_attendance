import api from '../Components/API/api.jsx';


const Reportcourses = async () => {
  try {
    const res = await api.get("/api/course");
    return res.data;
  } catch (error) {
    alert(error.response?.data?.message || "Failed to fetch courses");
    console.log(error.response?.data?.message);
    return [];
  }
};
export default Reportcourses;