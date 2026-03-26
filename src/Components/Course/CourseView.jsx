import { NavLink, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft, BookOpen, User, Clock, Calendar,
  MapPin, Users, Award, FileText, Video, Download, ChevronRight
} from 'lucide-react';

import '../../styles/viewpage.css';

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
                  <NavLink to="/class">
                    Enroll Now <ChevronRight size={1} />
                  </NavLink>
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
