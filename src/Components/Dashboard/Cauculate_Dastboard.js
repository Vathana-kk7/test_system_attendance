import api from '../API/api.jsx';
export const Calculate_Dashboard = async () => {
    const res = await api.get("/api/student");
    const students = res.data;

    let present = 0;
    let absent = 0;
    let permission = 0;

    students.forEach(student => {
        student.courses.forEach(course => {
            const status = course.pivot.status;

            if (status === "present") present++;
            else if (status === "absent") absent++;
            else if (status === "permission") permission++;
        });
    });

    const total = present + absent + permission;

    const rate = total > 0 
        ? Math.round((present / total) * 100) 
        : 0;

    return { total, present, absent, permission, rate };
};