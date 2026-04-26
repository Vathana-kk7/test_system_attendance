import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import api from '../API/api';

// ─── Color Palette ────────────────────────────────────────────────────────────
const COLORS = {
  primary:      [30,  90,  160],
  primaryLight: [214, 230, 248],
  accent:       [16,  110, 86],
  danger:       [162, 45,  45],
  dangerLight:  [252, 235, 235],
  warning:      [133, 79,  11],
  warningLight: [250, 238, 218],
  successLight: [234, 243, 222],
  success:      [59,  109, 17],
  white:        [255, 255, 255],
  black:        [30,  30,  30],
  gray100:      [245, 245, 242],
  gray200:      [220, 218, 210],
  gray500:      [136, 135, 128],
  gray800:      [68,  68,  65],
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
const getStudentName = (record) => {
  if (record.student?.name_student) return record.student.name_student;
  if (record.name_student)          return record.name_student;
  if (record.student?.name)         return record.student.name;
  return record.student_id || '-';
};

const getCourseName = (record, courses) => {
  const courseId =
    record.course_id ??
    record.student?.course_id ??
    record.student?.courses?.[0]?.id ??
    record.student?.courses?.[0]?.course_id;

  if (courseId && courses?.length) {
    const course = courses.find(
      (c) => String(c.id ?? c.course_id) === String(courseId)
    );
    if (course) return course.name_course ?? course.name ?? '-';
  }

  if (record.student?.courses?.[0]?.name_course)
    return record.student.courses[0].name_course;
  if (record.course?.name_course) return record.course.name_course;
  if (record.course?.name)        return record.course.name;

  return '-';
};

// No bullet character — plain text only (jsPDF Helvetica doesn't support Unicode bullets)
const statusStyle = (status) => {
  switch (status?.toLowerCase()) {
    case 'present':    return { bg: COLORS.successLight, text: COLORS.success, label: 'Present'    };
    case 'absent':     return { bg: COLORS.dangerLight,  text: COLORS.danger,  label: 'Absent'     };
    case 'permission': return { bg: COLORS.warningLight, text: COLORS.warning, label: 'Permission' };
    default:           return { bg: COLORS.gray100,      text: COLORS.gray500, label: '-'          };
  }
};

// ─── Draw Header Banner ───────────────────────────────────────────────────────
const drawHeader = (doc, formattedDate, courseName, pageWidth) => {
  // Deep blue banner
  doc.setFillColor(...COLORS.primary);
  doc.rect(0, 0, pageWidth, 42, 'F');

  // Accent stripe
  doc.setFillColor(...COLORS.accent);
  doc.rect(0, 42, pageWidth, 3, 'F');

  // System label
  doc.setTextColor(...COLORS.primaryLight);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('ATTENDANCE MANAGEMENT SYSTEM', 14, 10);

  // Title
  doc.setTextColor(...COLORS.white);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('Attendance Report', 14, 24);

  // Date & Course right-aligned
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...COLORS.primaryLight);
  doc.text(formattedDate, pageWidth - 14, 18, { align: 'right' });
  doc.text(`Course: ${courseName || 'All Classes'}`, pageWidth - 14, 27, { align: 'right' });
};

// ─── Draw Stat Cards ──────────────────────────────────────────────────────────
const drawStatCards = (doc, stats, startY, pageWidth) => {
  const margin = 14;
  const gap    = 5;
  const cols   = 4;
  const cardW  = (pageWidth - margin * 2 - gap * (cols - 1)) / cols;
  const cardH  = 22;

  const cards = [
    { label: 'Total Students', value: stats.total,      bg: COLORS.gray100,      text: COLORS.gray800, accent: COLORS.gray500  },
    { label: 'Present',        value: stats.present,    bg: COLORS.successLight, text: COLORS.success, accent: COLORS.success  },
    { label: 'Absent',         value: stats.absent,     bg: COLORS.dangerLight,  text: COLORS.danger,  accent: COLORS.danger   },
    { label: 'Permission',     value: stats.permission, bg: COLORS.warningLight, text: COLORS.warning, accent: COLORS.warning  },
  ];

  cards.forEach((card, i) => {
    const x = margin + i * (cardW + gap);

    // Card background
    doc.setFillColor(...card.bg);
    doc.roundedRect(x, startY, cardW, cardH, 2, 2, 'F');

    // Left accent bar
    doc.setFillColor(...card.accent);
    doc.roundedRect(x, startY, 2.5, cardH, 1, 1, 'F');

    // Label
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...card.text);
    doc.text(card.label.toUpperCase(), x + 6, startY + 8);

    // Value
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...card.text);
    doc.text(String(card.value), x + 6, startY + 18);
  });

  return startY + cardH;
};

// ─── Draw Section Label ───────────────────────────────────────────────────────
const drawSectionLabel = (doc, y, pageWidth) => {
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...COLORS.primary);
  doc.text('STUDENT ATTENDANCE RECORDS', 14, y);

  doc.setDrawColor(...COLORS.primary);
  doc.setLineWidth(0.4);
  doc.line(14, y + 1.5, pageWidth - 14, y + 1.5);
};

// ─── Draw Footer ──────────────────────────────────────────────────────────────
const drawFooter = (doc, pageNum, totalPages, pageWidth, pageHeight) => {
  doc.setDrawColor(...COLORS.gray200);
  doc.setLineWidth(0.3);
  doc.line(14, pageHeight - 14, pageWidth - 14, pageHeight - 14);

  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...COLORS.gray500);

  const now = new Date().toLocaleString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });

  doc.text(`Generated: ${now}`, 14, pageHeight - 8);
  doc.text(`Page ${pageNum} of ${totalPages}`, pageWidth - 14, pageHeight - 8, { align: 'right' });
};

// ─── Main Generator ───────────────────────────────────────────────────────────
export const generateLocally = (attendanceData, date, courseName, courses = []) => {
  const doc        = new jsPDF();
  const pageWidth  = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  const stats = {
    present:    attendanceData.filter((r) => r.status === 'present').length,
    absent:     attendanceData.filter((r) => r.status === 'absent').length,
    permission: attendanceData.filter((r) => r.status === 'permission').length,
    total:      attendanceData.length,
  };

  // Build table rows — status column is '' so autoTable renders nothing there
  // We draw the colored pill manually in didDrawCell
  const tableData = attendanceData.map((record, index) => ({
    no:     index + 1,
    name:   getStudentName(record),
    course: getCourseName(record, courses),
    status: record.status || '',
    reason: record.reason || '-',
    _style: statusStyle(record.status),
  }));

  // ── Draw sections ──
  drawHeader(doc, formattedDate, courseName, pageWidth);
  drawStatCards(doc, stats, 52, pageWidth);
  drawSectionLabel(doc, 84, pageWidth);

  // ── Table ──
  autoTable(doc, {
    startY: 88,
    margin: { left: 14, right: 14 },

    // Pass '' for status column so no raw text renders underneath the pill
    head: [['No.', 'Student Name', 'Course', 'Status', 'Reason']],
    body: tableData.map((r) => [r.no, r.name, r.course, '', r.reason]),

    theme: 'plain',

    headStyles: {
      fillColor:   COLORS.primary,
      textColor:   COLORS.white,
      fontSize:    8.5,
      fontStyle:   'bold',
      cellPadding: { top: 5, bottom: 5, left: 5, right: 5 },
      lineWidth:   0,
    },

    bodyStyles: {
      fontSize:    8.5,
      textColor:   COLORS.black,
      cellPadding: { top: 5, bottom: 5, left: 5, right: 5 },
      lineColor:   COLORS.gray200,
      lineWidth:   0.2,
    },

    alternateRowStyles: {
      fillColor: COLORS.gray100,
    },

    columnStyles: {
      0: { cellWidth: 12,     halign: 'center', fontStyle: 'bold', textColor: COLORS.gray500 },
      1: { cellWidth: 52,     fontStyle: 'bold' },
      2: { cellWidth: 42 },
      3: { cellWidth: 30,     halign: 'center' },
      4: { cellWidth: 'auto' },
    },

    // Draw colored pill badge in Status column
    didDrawCell(data) {
      if (data.section !== 'body' || data.column.index !== 3) return;

      const row = tableData[data.row.index];
      if (!row?.status) return;

      const s              = row._style;
      const { x, y, width, height } = data.cell;
      const padX = 4, padY = 3;
      const bw   = width  - padX * 2;
      const bh   = height - padY * 2;

      // Pill background
      doc.setFillColor(...s.bg);
      doc.roundedRect(x + padX, y + padY, bw, bh, 2, 2, 'F');

      // Status label centered in pill
      doc.setFontSize(7.5);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...s.text);
      doc.text(
        s.label,
        x + width  / 2,
        y + height / 2 + 2.5,
        { align: 'center' }
      );
    },

    // Redraw footer on every page after table finishes
    didDrawPage() {
      const total = doc.internal.getNumberOfPages();
      for (let p = 1; p <= total; p++) {
        doc.setPage(p);
        drawFooter(doc, p, total, pageWidth, pageHeight);
      }
    },
  });

  return doc;
};

// ─── Download PDF (server-side blob) ─────────────────────────────────────────
export const downloadPDF = async (date, courseId = null) => {
  try {
    const params = new URLSearchParams({ date });
    if (courseId) params.append('course_id', courseId);

    const response = await api.get(`/api/attendance/export?${params.toString()}`, {
      responseType: 'blob',
    });

    const url  = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href  = url;
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

// ─── Preview PDF (server-side blob) ──────────────────────────────────────────
export const previewPDF = async (date, courseId = null) => {
  try {
    const params = new URLSearchParams({ date });
    if (courseId) params.append('course_id', courseId);

    const response = await api.get(`/api/attendance/export?${params.toString()}`, {
      responseType: 'blob',
    });

    const url = window.URL.createObjectURL(
      new Blob([response.data], { type: 'application/pdf' })
    );
    window.open(url, '_blank');
  } catch (error) {
    console.error('Failed to preview PDF:', error);
    throw error;
  }
};

// ─── Generate PDF (client-side) ───────────────────────────────────────────────
export const generatePDF = async (date, courses) => {
  const dateStr = date.toISOString().split('T')[0];
  console.log('Fetching attendance for date:', dateStr);
  console.log('Courses received:', courses);

  const res = await api.get(
    `/api/attendance?date=${dateStr}&include=course,student`
  );
  console.log('Attendance response:', res.data);

  const attendanceData = res.data;

  if (!attendanceData || attendanceData.length === 0) {
    throw new Error('No attendance data for this date');
  }

  if (attendanceData[0]) {
    console.log('First record:', attendanceData[0]);
  }

  const courseName = courses?.[0]?.name_course ?? courses?.[0]?.name ?? '';
  const doc = generateLocally(attendanceData, dateStr, courseName, courses);
  return doc;
};