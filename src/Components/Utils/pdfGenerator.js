import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import api from '../API/api';

const getStudentName = (record) => {
  if (record.student?.name_student) return record.student.name_student;
  if (record.name_student) return record.name_student;
  if (record.student?.name) return record.student.name;
  return record.student_id || '-';
};

export const generateLocally = (attendanceData, date, courseName) => {
  const doc = new jsPDF();
  
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  doc.setFontSize(18);
  doc.text('Attendance Report', 105, 20, { align: 'center' });
  
  doc.setFontSize(12);
  doc.text(`Date: ${formattedDate}`, 105, 30, { align: 'center' });
  doc.text(`Course: ${courseName || 'All Classes'}`, 105, 38, { align: 'center' });

  const stats = {
    present: attendanceData.filter(r => r.status === 'present').length,
    absent: attendanceData.filter(r => r.status === 'absent').length,
    permission: attendanceData.filter(r => r.status === 'permission').length,
    total: attendanceData.length
  };

  doc.setFontSize(10);
  doc.text(`Total Students: ${stats.total}`, 14, 50);
  doc.text(`Present: ${stats.present}`, 14, 56);
  doc.text(`Absent: ${stats.absent}`, 14, 62);
  doc.text(`Permission: ${stats.permission}`, 14, 68);

  const tableData = attendanceData.map((record, index) => [
    index + 1,
    getStudentName(record),
    record.status?.charAt(0).toUpperCase() + record.status?.slice(1) || '-',
    record.reason || '-'
  ]);

  autoTable(doc, {
    startY: 75,
    head: [['No.', 'Student Name', 'Status', 'Reason']],
    body: tableData,
    theme: 'striped',
    headStyles: { fillColor: [41, 128, 185], fontSize: 10, fontStyle: 'bold' },
    bodyStyles: { fontSize: 9 },
    alternateRowStyles: { fillColor: [245, 245, 245] },
    columnStyles: {
      0: { cellWidth: 15, halign: 'center' },
      1: { cellWidth: 60 },
      2: { cellWidth: 30, halign: 'center' },
      3: { cellWidth: 'auto' }
    }
  });

  return doc;
};

export const downloadPDF = async (date, courseId = null) => {
  try {
    const params = new URLSearchParams({ date });
    if (courseId) params.append('course_id', courseId);
    
    const response = await api.get(`/api/attendance/export?${params.toString()}`, {
      responseType: 'blob'
    });
    
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `attendance_${date}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Failed to download PDF:', error);
    throw error;
  }
};

export const previewPDF = async (date, courseId = null) => {
  try {
    const params = new URLSearchParams({ date });
    if (courseId) params.append('course_id', courseId);
    
    const response = await api.get(`/api/attendance/export?${params.toString()}`, {
      responseType: 'blob'
    });
    
    const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
    window.open(url, '_blank');
  } catch (error) {
    console.error('Failed to preview PDF:', error);
    throw error;
  }
};

export const generatePDF = async (date, courses) => {
  const dateStr = date.toISOString().split('T')[0];
  console.log('Fetching attendance for date:', dateStr);
  
  const res = await api.get(`/api/attendance?date=${dateStr}`);
  console.log('Attendance response:', res.data);
  
  const attendanceData = res.data;
  
  if (!attendanceData || attendanceData.length === 0) {
    throw new Error('No attendance data for this date');
  }
  
  const courseName = courses?.[0]?.name_course || '';
  console.log('Using course name:', courseName);
  
  const doc = generateLocally(attendanceData, dateStr, courseName);
  return doc;
};