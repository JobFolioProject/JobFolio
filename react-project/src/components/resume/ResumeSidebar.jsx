import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../../css/resume/ResumeSidebar.css'; // 스타일 따로 작성


const ResumeSidebar = () => {
  const location = useLocation();

  return (
    <div className="resume-sidebar">
      <div className="sidebar-title">이력서</div>
      <ul className="sidebar-menu">
        <li className={location.pathname === '/resume/edit' ? 'active' : ''}>
          <Link to="/resume/edit">이력서 수정</Link>
        </li>
        <li className={location.pathname === '/resume/manage' ? 'active' : ''}>
          <Link to="/resume/manage">이력서 관리</Link>
        </li>
      </ul>
    </div>
  );
};

export default ResumeSidebar;

