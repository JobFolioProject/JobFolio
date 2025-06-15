import { Link } from "react-router-dom";
import { useState } from "react";
import "../../css/common/MenuBar.css";
import Login from "../user/Login";
import LoginForm from "../user/join/LoginForm";
import { useAuth } from "../../context/AuthContext"; // ← 추가!

const MenuBar = () => {
  // const loginUser = JSON.parse(sessionStorage.getItem("user")); ← 삭제!
  // const status = loginUser?.status || ""; ← 삭제!

  const { user, isAuthenticated, logout } = useAuth(); // ← AuthContext 사용!

  const [menuOpen, setMenuOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
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
        {/* loginUser 대신 user 사용! */}
        {user?.userType === "C" && (
          <li>
            <Link to="myPage">마이페이지</Link>
          </li>
        )}
        {user?.userType === "A" && (
          <li>
            <Link to="/adminPage">관리자</Link>
          </li>
        )}
      </ul>
      <div className="user-options">
        {/* loginUser 대신 isAuthenticated 사용! */}
        {isAuthenticated ? (
          <>
            <span onClick={logout} style={{ cursor: "pointer" }}>
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
      {showLoginForm && <LoginForm onClose={() => setShowLoginForm(false)} />}
    </div>
  );
};

export default MenuBar;
