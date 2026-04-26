
import api from "../API/api.jsx";
// Filter
export const Crude = ({ students, search }) => {
  const filtered = students.filter((s) =>
    s.name_student?.toLowerCase().includes(search.toLowerCase())
  );
  return filtered;
};

//Read
export const ReadStudent = async (setStudents, setLoading) => {
  setLoading(true);
  try {
    const res = await api.get("/api/student");
    setStudents(res.data);
  } catch (error) {
    console.log(error.response.data.message);
    alert(error.response.data.message);
  }finally{
    setLoading(false);
  }

}

//Update
export const UpdataStudent=async(id,data,onSuccess)=>{
  try {
    await api.put(`/api/student/${id}`,data);
    onSuccess();
  } catch (error) {
    console.log(error.response.data.message);
    alert(error.response.data.message);
  }
}


// Create Student
export const CreateStudent=async(data,onSuccess)=>{
  try {
    await api.post("/api/student",data);
    onSuccess();
  } catch (error) {
    console.log(error.response.data.message);
    alert(error.response.data.message);
  }
}

//Delete Student
export const DeleteStudent = async (id, onSuccess) => {
  try {
    await api.delete(`/api/student/${id}`);
    onSuccess && onSuccess(); // ✅ safe call
  } catch (error) {
    console.log(error.response?.data?.message);
    alert(error.response?.data?.message);
  }
};


