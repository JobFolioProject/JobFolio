import { Link } from "react-router-dom";
import { useState } from "react";
import "../../css/common/MenuBar.css";
import Login from "../user/Login";
import LoginForm from "../user/join/LoginForm";
import { useAuth } from "../../context/AuthContext";

const MenuBar = () => {
  // 🔐 AuthContext에서 사용자 정보 및 인증 상태 가져오기
  const { user, isAuthenticated, logout } = useAuth();
  
  const [menuOpen, setMenuOpen] = useState(false); // 메뉴 열고 닫기
  const [showLoginModal, setShowLoginModal] = useState(false); // 모달 열기 상태
  const [showLoginForm, setShowLoginForm] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen); // 메뉴 상태를 토글
  };

  const handleLogout = () => {
    logout(); 
  };

  const handleLoginClick = () => {
    setShowLoginForm(true);
  };

  return (
    <div className={`navbar ${menuOpen ? "active" : ""}`}>
      <div className="toggle-button" onClick={toggleMenu}></div>
      
      <div className="logo">
        <img src="/resources/logo/logo.png" alt="로고" className="logoImg" />
        <Link to="/">JOBFOLIO</Link>
      </div>
      
      <ul>
        <li>
          <Link to="/resume/write">이력서</Link>
        </li>
        <li>
          <Link to="/interview">면접연습</Link>
        </li>
        <li>
          <Link to="/pay">이용권</Link>
        </li>
        <li>
          <Link to="/community/notice">커뮤니티</Link>
        </li>
        
        {user?.userType === "C" && (
          <li>
            <Link to="/myPage">마이페이지</Link>
          </li>
        )}
        
        {(user?.userType === "A" || user?.userType === "B") && (
          <li>
            <Link to="/adminPage">관리자</Link>
          </li>
        )}
      </ul>
      
      <div className="user-options">
        {isAuthenticated ? (
          <>
            <span onClick={handleLogout} style={{ cursor: "pointer" }}>
              Logout
            </span>
          </>
        ) : (
          <span
            onClick={() => setShowLoginModal(true)}
            style={{ cursor: "pointer" }}
          >
            LOG IN
          </span>
        )}
      </div>
      
      {showLoginModal && (
        <Login
          onClose={() => setShowLoginModal(false)}
          onLoginClick={handleLoginClick}
        />
      )}
      {showLoginForm && (
        <LoginForm onClose={() => setShowLoginForm(false)} />
      )}
    </div>
  );
};

export default MenuBar;