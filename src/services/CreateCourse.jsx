import api from "../Components/API/Api";

// create course
export const CreateCourse = async (courseName, teacherName, courseTime) => {
  try {
    const res = await api.post("/api/course", {
      name_course: courseName,
      name_teacher: teacherName,
      time_course: courseTime,
    });

    return res;
  } catch (error) {
    throw error;
  }
};