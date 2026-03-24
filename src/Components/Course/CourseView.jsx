import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft, BookOpen, User, Clock, Calendar,
  MapPin, Users, Award, FileText, Video, Download, ChevronRight
} from 'lucide-react';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap');

  .cv-root * { box-sizing: border-box; }
  .cv-root {
    font-family: 'DM Sans', sans-serif;
    min-height: 100vh;
    background: #f5f2ee;
    color: #1a1714;
  }

  /* ── Back button ── */
  .cv-back {
    display: inline-flex; align-items: center; gap: 8px;
    color: #8c7b6b; font-size: 13px; font-weight: 500;
    text-decoration: none; background: none; border: none;
    cursor: pointer; padding: 0; transition: color 0.2s;
    letter-spacing: 0.04em; text-transform: uppercase;
    margin-bottom: 32px;
  }
  .cv-back:hover { color: #1a1714; }
  .cv-back svg { transition: transform 0.2s; }
  .cv-back:hover svg { transform: translateX(-4px); }

  /* ── Hero ── */
  .cv-hero {
    position: relative;
    background: #1a1714;
    border-radius: 24px;
    overflow: hidden;
    padding: 56px 56px 0;
    margin-bottom: 24px;
  }
  .cv-hero-noise {
    position: absolute; inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
    pointer-events: none; opacity: 0.6;
  }
  .cv-hero-glow {
    position: absolute; top: -80px; right: -80px;
    width: 400px; height: 400px; border-radius: 50%;
    background: radial-gradient(circle, rgba(134,239,172,0.12) 0%, transparent 65%);
    pointer-events: none;
  }
  .cv-hero-tags { display: flex; gap: 10px; margin-bottom: 20px; }
  .cv-tag {
    padding: 5px 14px; border-radius: 99px;
    font-size: 11px; font-weight: 600; letter-spacing: 0.08em;
    text-transform: uppercase;
  }
  .cv-tag-new { background: #86efac; color: #14532d; }
  .cv-tag-level { background: rgba(255,255,255,0.08); color: rgba(255,255,255,0.6); border: 1px solid rgba(255,255,255,0.1); }
  .cv-hero-title {
    font-family: 'DM Serif Display', serif;
    font-size: clamp(52px, 8vw, 80px);
    color: #fff;
    line-height: 1;
    letter-spacing: -0.02em;
    margin: 0 0 16px;
  }
  .cv-hero-title em { font-style: italic; color: #86efac; }
  .cv-hero-desc {
    color: rgba(255,255,255,0.5);
    font-size: 15px; line-height: 1.7;
    max-width: 560px; margin: 0 0 40px;
  }
  .cv-hero-bottom {
    display: flex; align-items: center;
    justify-content: space-between;
    border-top: 1px solid rgba(255,255,255,0.06);
    padding: 20px 0;
    position: relative;
  }
  .cv-hero-stat { text-align: center; padding: 0 24px; }
  .cv-hero-stat-val { font-family: 'DM Serif Display', serif; font-size: 28px; color: #fff; }
  .cv-hero-stat-lbl { font-size: 11px; color: rgba(255,255,255,0.35); text-transform: uppercase; letter-spacing: 0.07em; }
  .cv-hero-divider { width: 1px; height: 40px; background: rgba(255,255,255,0.08); }
  .cv-enroll-btn {
  /* Removed background color */
  color: #14532d;           /* Optional: default text color */
  border: none;
  border-radius: 12px;
  padding: 14px 28px;
  font-size: 14px;
  font-weight: 600;
  font-family: 'DM Sans', sans-serif;
  cursor: pointer;
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}
  .cv-enroll-btnn {
  color: #14532d;           /* Default text color */
  border: none;
  border-radius: 12px;
  padding: 14px 28px;
  font-size: 14px;
  font-weight: 600;
  font-family: 'DM Sans', sans-serif;
  cursor: pointer;
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: transparent;   /* Make sure no default background */
}
.cv-enroll-btn:hover {
  transform: translateY(-2px);
}
  .cv-enroll-btn:hover { background: #bbf7d0; transform: translateY(-2px); }

  /* ── Content layout ── */
  .cv-content { display: grid; grid-template-columns: 1fr 340px; gap: 24px; }

  /* ── Info Cards ── */
  .cv-info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 24px; }
  .cv-info-card {
    background: #fff; border-radius: 16px;
    padding: 18px 20px; display: flex;
    align-items: center; gap: 14px;
    border: 1px solid rgba(0,0,0,0.05);
    transition: transform 0.2s, box-shadow 0.2s;
  }
  .cv-info-card:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.07); }
  .cv-info-icon {
    width: 42px; height: 42px; border-radius: 12px;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }
  .cv-info-lbl { font-size: 10.5px; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.07em; margin-bottom: 3px; }
  .cv-info-val { font-size: 14.5px; font-weight: 600; color: #1a1714; }

  /* ── Topics ── */
  .cv-section-title {
    font-family: 'DM Serif Display', serif;
    font-size: 24px; color: #1a1714;
    margin: 0 0 18px; letter-spacing: -0.01em;
  }
  .cv-topics { display: flex; flex-direction: column; gap: 8px; }
  .cv-topic {
    display: flex; align-items: center; gap: 12px;
    padding: 14px 16px; background: #fff; border-radius: 12px;
    border: 1px solid rgba(0,0,0,0.05);
    transition: all 0.2s; cursor: default;
  }
  .cv-topic:hover { border-color: #86efac; background: #f0fdf4; }
  .cv-topic-num {
    width: 26px; height: 26px; border-radius: 8px;
    background: #f5f2ee; color: #8c7b6b;
    display: flex; align-items: center; justify-content: center;
    font-size: 12px; font-weight: 600; flex-shrink: 0;
    transition: all 0.2s;
  }
  .cv-topic:hover .cv-topic-num { background: #86efac; color: #14532d; }
  .cv-topic-text { font-size: 14px; color: #374151; font-weight: 500; }

  /* ── Sidebar ── */
  .cv-sidebar { display: flex; flex-direction: column; gap: 16px; }

  /* ── Materials ── */
  .cv-sidebar-card {
    background: #fff; border-radius: 20px;
    padding: 24px;
    border: 1px solid rgba(0,0,0,0.05);
  }
  .cv-material {
    display: flex; align-items: center; gap: 12px;
    padding: 12px; border-radius: 12px;
    border: 1px solid #f1f5f9;
    margin-bottom: 8px; cursor: pointer;
    transition: all 0.2s;
  }
  .cv-material:last-child { margin-bottom: 0; }
  .cv-material:hover { border-color: #86efac; background: #f0fdf4; }
  .cv-mat-icon {
    width: 38px; height: 38px; border-radius: 10px;
    background: #f5f2ee; display: flex;
    align-items: center; justify-content: center;
    flex-shrink: 0; transition: background 0.2s;
  }
  .cv-material:hover .cv-mat-icon { background: #dcfce7; }
  .cv-mat-name { font-size: 13.5px; font-weight: 600; color: #1a1714; }
  .cv-mat-meta { font-size: 11.5px; color: #9ca3af; }
  .cv-mat-dl { margin-left: auto; color: #cbd5e1; transition: color 0.2s; flex-shrink: 0; }
  .cv-material:hover .cv-mat-dl { color: #22c55e; }

  /* ── Schedule card ── */
  .cv-schedule {
    background: #1a1714; border-radius: 20px;
    padding: 24px; position: relative; overflow: hidden;
  }
  .cv-schedule::before {
    content: '';
    position: absolute; top: -40px; right: -40px;
    width: 120px; height: 120px; border-radius: 50%;
    background: radial-gradient(circle, rgba(134,239,172,0.15) 0%, transparent 70%);
  }
  .cv-schedule-title {
    font-family: 'DM Serif Display', serif;
    font-size: 18px; color: #fff; margin: 0 0 16px;
  }
  .cv-schedule-row {
    display: flex; align-items: center; gap: 10px;
    padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.06);
    font-size: 13.5px; color: rgba(255,255,255,0.6);
  }
  .cv-schedule-row:last-child { border-bottom: none; padding-bottom: 0; }
  .cv-schedule-row svg { color: #86efac; flex-shrink: 0; }

  /* ── Progress bar ── */
  .cv-progress-wrap { margin-top: 6px; }
  .cv-progress-lbl {
    display: flex; justify-content: space-between;
    font-size: 12px; color: #9ca3af; margin-bottom: 6px;
  }
  .cv-progress-bar {
    height: 6px; background: #f1f5f9; border-radius: 99px; overflow: hidden;
  }
  .cv-progress-fill {
    height: 100%; background: linear-gradient(90deg, #86efac, #22c55e);
    border-radius: 99px; transition: width 1s ease;
  }

  /* ── Wishlist btn ── */
  .cv-wish-btn {
    width: 100%; padding: 13px; border-radius: 12px;
    border: 1.5px solid #e5e7eb; background: #fff;
    color: #374151; font-size: 14px; font-weight: 600;
    font-family: 'DM Sans', sans-serif;
    cursor: pointer; transition: all 0.2s;
  }
  .cv-wish-btn:hover { border-color: #86efac; color: #15803d; background: #f0fdf4; }

  /* ── Wrapper ── */
  .cv-wrap { max-width: 1100px; margin: 0 auto; padding: 40px 24px; }
`;

function CourseView() {
  const navigate = useNavigate();
  const { id } = useParams();

  const courseData = {
    id,
    courseName: 'Vue',
    teacherName: 'Vathana',
    courseTime: '10:00 – 11:00',
    isNew: true,
    description: 'Master the progressive JavaScript framework for building modern user interfaces. Learn Vue.js fundamentals, component architecture, state management, and advanced patterns.',
    level: 'Intermediate',
    duration: '8 weeks',
    location: 'Room 204, Building A',
    enrolledStudents: 24,
    maxStudents: 30,
    startDate: 'March 25, 2026',
    schedule: 'Mon, Wed, Fri',
    topics: [
      'Vue.js Fundamentals & Reactivity System',
      'Components & Props',
      'Vue Router & Navigation',
      'State Management with Pinia',
      'Composition API',
      'Performance Optimization',
      'Testing Vue Applications',
      'Production Deployment',
    ],
    materials: [
      { name: 'Course Syllabus',             type: 'PDF',   size: '245 KB' },
      { name: 'Week 1 – Intro to Vue',       type: 'Video', size: '1.2 GB' },
      { name: 'Code Examples & Exercises',   type: 'ZIP',   size: '12 MB'  },
      { name: 'Additional Resources',        type: 'PDF',   size: '180 KB' },
    ],
  };

  const pct = Math.round((courseData.enrolledStudents / courseData.maxStudents) * 100);

  const infoCards = [
    { icon: <User  size={18} />, label: 'Instructor', value: courseData.teacherName, bg: '#f0fdf4', fg: '#22c55e' },
    { icon: <Clock size={18} />, label: 'Class Time',  value: courseData.courseTime,  bg: '#eff6ff', fg: '#3b82f6' },
    { icon: <Calendar size={18} />, label: 'Start Date', value: courseData.startDate, bg: '#faf5ff', fg: '#a855f7' },
    { icon: <Award  size={18} />, label: 'Duration',   value: courseData.duration,    bg: '#fff7ed', fg: '#f97316' },
    { icon: <MapPin size={18} />, label: 'Location',   value: courseData.location,    bg: '#fff1f2', fg: '#f43f5e' },
    { icon: <Users  size={18} />, label: 'Enrollment', value: `${courseData.enrolledStudents}/${courseData.maxStudents} students`, bg: '#f0fdf4', fg: '#22c55e' },
  ];

  return (
    <>
      <style>{styles}</style>
      <div className="cv-root">
        <div className="cv-wrap">

          {/* Back */}
          <button className="cv-back" onClick={() => navigate('/class')}>
            <ArrowLeft size={14} /> Back to courses
          </button>

          {/* Hero */}
          <div className="cv-hero">
            <div className="cv-hero-noise" />
            <div className="cv-hero-glow" />

            <div className="cv-hero-tags">
              {courseData.isNew && <span className="cv-tag cv-tag-new">● New</span>}
              <span className="cv-tag cv-tag-level">{courseData.level}</span>
            </div>

            <h1 className="cv-hero-title">
              Learn<br /><em>{courseData.courseName}</em>
            </h1>
            <p className="cv-hero-desc">{courseData.description}</p>

            <div className="cv-hero-bottom">
              <div style={{display:'flex', alignItems:'center', gap: 0}}>
                {[
                  { val: courseData.duration,           lbl: 'Duration'  },
                  { val: `${courseData.maxStudents}`,   lbl: 'Max seats' },
                  { val: courseData.topics.length,      lbl: 'Topics'    },
                  { val: courseData.materials.length,   lbl: 'Materials' },
                ].map((s, i) => (
                  <span key={i} style={{display:'flex', alignItems:'center'}}>
                    <span className="cv-hero-stat">
                      <div className="cv-hero-stat-val">{s.val}</div>
                      <div className="cv-hero-stat-lbl">{s.lbl}</div>
                    </span>
                    {i < 3 && <span className="cv-hero-divider" />}
                  </span>
                ))}
              </div>
               <button className="cv-enroll-btn bg-red-500 hover:bg-red-600 transition-colors flex items-center gap-1 px-4 py-2 rounded-md text-white font-medium">
                  Delete <ChevronRight size={16} />
                </button>
                <button className="cv-enroll-btn bg-blue-500 hover:bg-blue-600 transition-colors flex items-center gap-1 px-4 py-2 rounded-md text-white font-medium">
                  Edit <ChevronRight size={16} />
                </button>

                <button className="cv-enroll-btn bg-green-500 hover:bg-green-600 transition-colors flex items-center gap-1 px-4 py-2 rounded-md text-white font-medium">
                  Enroll Now <ChevronRight size={16} />
                </button>
            </div>
          </div>

          {/* Body */}
          <div className="cv-content">

            {/* Left */}
            <div>
              {/* Info cards */}
              <div className="cv-info-grid">
                {infoCards.map((c, i) => (
                  <div className="cv-info-card" key={i}>
                    <div className="cv-info-icon" style={{background: c.bg}}>
                      <span style={{color: c.fg}}>{c.icon}</span>
                    </div>
                    <div>
                      <div className="cv-info-lbl">{c.label}</div>
                      <div className="cv-info-val">{c.value}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Topics */}
              <h2 className="cv-section-title">Course Topics</h2>
              <div className="cv-topics">
                {courseData.topics.map((t, i) => (
                  <div className="cv-topic" key={i}>
                    <span className="cv-topic-num">{i + 1}</span>
                    <span className="cv-topic-text">{t}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Sidebar */}
            <div className="cv-sidebar">

              {/* Enrollment progress */}
              <div className="cv-sidebar-card">
                <h3 style={{fontFamily:"'DM Serif Display',serif", fontSize:18, margin:'0 0 14px', letterSpacing:'-0.01em'}}>Enrollment</h3>
                <div className="cv-progress-wrap">
                  <div className="cv-progress-lbl">
                    <span>{courseData.enrolledStudents} enrolled</span>
                    <span style={{color:'#22c55e', fontWeight:600}}>{pct}%</span>
                  </div>
                  <div className="cv-progress-bar">
                    <div className="cv-progress-fill" style={{width:`${pct}%`}} />
                  </div>
                  <p style={{fontSize:12, color:'#9ca3af', marginTop:8}}>
                    {courseData.maxStudents - courseData.enrolledStudents} seats remaining
                  </p>
                </div>
              </div>

              {/* Materials */}
              <div className="cv-sidebar-card">
                <h3 style={{fontFamily:"'DM Serif Display',serif", fontSize:18, margin:'0 0 14px', letterSpacing:'-0.01em'}}>Materials</h3>
                {courseData.materials.map((m, i) => (
                  <div className="cv-material" key={i}>
                    <div className="cv-mat-icon">
                      {m.type === 'Video'
                        ? <Video size={16} color="#8c7b6b" />
                        : <FileText size={16} color="#8c7b6b" />}
                    </div>
                    <div>
                      <div className="cv-mat-name">{m.name}</div>
                      <div className="cv-mat-meta">{m.type} · {m.size}</div>
                    </div>
                    <Download size={15} className="cv-mat-dl" />
                  </div>
                ))}
              </div>

              {/* Schedule */}
              <div className="cv-schedule">
                <h3 className="cv-schedule-title">Schedule</h3>
                <div className="cv-schedule-row">
                  <Calendar size={14} />
                  {courseData.schedule}
                </div>
                <div className="cv-schedule-row">
                  <Clock size={14} />
                  {courseData.courseTime}
                </div>
                <div className="cv-schedule-row">
                  <MapPin size={14} />
                  {courseData.location}
                </div>
                <div className="cv-schedule-row">
                  <Calendar size={14} />
                  Starts {courseData.startDate}
                </div>
              </div>

              {/* Wishlist */}
              <button className="cv-wish-btn">♡ &nbsp;Add to Wishlist</button>

            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default CourseView;
