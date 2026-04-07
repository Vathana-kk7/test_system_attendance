const PENDING_STUDENTS_KEY = 'pending_students';

export const getPendingStudents = () => {
  const data = localStorage.getItem(PENDING_STUDENTS_KEY);
  return data ? JSON.parse(data) : [];
};

export const addPendingStudent = (student, courseData = null) => {
  const pending = getPendingStudents();
  const newStudent = {
    ...student,
    id: `pending_${Date.now()}`,
    isPending: true,
    createdAt: new Date().toISOString(),
    courses: courseData ? [courseData] : []
  };
  pending.push(newStudent);
  localStorage.setItem(PENDING_STUDENTS_KEY, JSON.stringify(pending));
  return newStudent;
};

export const removePendingStudent = (studentId) => {
  const pending = getPendingStudents().filter(s => s.id !== studentId);
  localStorage.setItem(PENDING_STUDENTS_KEY, JSON.stringify(pending));
};

export const clearPendingStudents = () => {
  localStorage.removeItem(PENDING_STUDENTS_KEY);
};