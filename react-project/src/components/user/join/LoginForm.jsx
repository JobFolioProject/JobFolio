import "../../../css/user/join/LoginForm.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

const LoginForm = ({ onClose }) => {
  const navigate = useNavigate();
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:80/api/join/login", {
        loginId,
        password,
      });

      if (response.data) {
        // 로그인 성공 시 처리
        sessionStorage.setItem("user", JSON.stringify(response.data));
        onClose();
        navigate("/"); // 메인 페이지로 이동
      }
    } catch (error) {
      setError("로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.");
      console.error("Login error:", error);
    }
  };

  const goToFindPassword = () => {
    navigate("/find-password");
  };

  const goToFindId = () => {
    navigate("/find-id");
  };

  const goToJoin = () => {
    navigate("/join");
  };

  return (
    <div className="login-form-modal-overlay">
      <div className="login-form-modal">
        <div className="login-form-container">
          <h1 className="login-form-title">jobfollio</h1>
          <h3 className="login-form-subtitle">
            AI기반의 자기소개서 생성서비스
          </h3>
          <form onSubmit={handleLogin} className="login-form">
            {error && (
              <div
                className="error-message"
                style={{ color: "red", marginBottom: "1rem" }}
              >
                {error}
              </div>
            )}
            <div className="mb-3 text-start">
              <label htmlFor="loginId" className="login-form-label">
                이메일
              </label>
              <input
                type="email"
                className="login-form-input"
                id="loginId"
                value={loginId}
                onChange={(e) => setLoginId(e.target.value)}
                required
                autoComplete="username"
              />
            </div>
            <div className="mb-4 text-start">
              <label htmlFor="password" className="login-form-label">
                비밀번호
              </label>
              <input
                type="password"
                className="login-form-input"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>
            <button type="submit" className="login-form-submit">
              로그인
            </button>
          </form>
          <div className="login-form-links">
            <span onClick={goToFindPassword} className="login-form-link">
              비밀번호 찾기
            </span>
            <span className="login-form-divider">|</span>
            <span onClick={goToFindId} className="login-form-link">
              아이디 찾기
            </span>
            <span className="login-form-divider">|</span>
            <span onClick={goToJoin} className="login-form-link">
              회원가입
            </span>
          </div>
        </div>
        <button className="login-form-close" onClick={onClose}>
          ×
        </button>
      </div>
    </div>
  );
};

export default LoginForm;
