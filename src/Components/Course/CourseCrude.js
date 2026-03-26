import api from "../API/api.jsx";

export const Crude = ({ student, select }) => {
  if (!select || select === "All Classes") return student;
  return student.filter((s) => String(s.id) === String(select));
};
//Create
export const Create = async (data, onSuccess, onError) => {
  try {
    await api.post("/api/course", data);
    onSuccess?.();
  } catch (error) {
    const message = error.response?.data?.message || "Create failed";
    console.error(message);
    onError?.(message);
  }
};

//Update
export const Update = async (id, data, onSuccess, onError) => {
  try {
    await api.put(`/api/course/${id}`, data);
    onSuccess?.();
  } catch (error) {
    const message = error.response?.data?.message || "Update failed";
    console.error(message);
    onError?.(message);
  }
};
//Delete
export const Delete = async (id, onSuccess, onError) => {
  try {
    await api.delete(`/api/course/${id}`);
    onSuccess?.();
  } catch (error) {
    const message = error.response?.data?.message || "Delete failed";
    console.error(message);
    onError?.(message);
  }
};

