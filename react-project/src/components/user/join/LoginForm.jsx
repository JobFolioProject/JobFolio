import "../../../css/user/join/LoginForm.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import FindAccountForm from "./FindAccountForm"; // 🔥 수정: FindPasswordForm → FindAccountForm
import { useAuth } from "../../../context/AuthContext";

const LoginForm = ({ onClose }) => {
  const navigate = useNavigate();
  const { login } = useAuth(); // AuthContext의 login 함수 사용
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showFindAccount, setShowFindAccount] = useState(false);
  const [findAccountType, setFindAccountType] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!loginId.trim() || !password.trim()) {
      setError("이메일과 비밀번호를 입력해주세요.");
      setIsLoading(false);
      return;
    }

    try {
      const result = await login({
        login_id: loginId,
        password: password,
      });

      if (result.success) {
        alert(result.data.message || "로그인이 완료되었습니다.");
        onClose();
        navigate("/");
      } else {
        if (result.message && result.message.includes("탈퇴한 계정")) {
          setError("탈퇴한 계정입니다. 고객센터에 문의하시거나 계정 복구를 요청해주세요.");
        } else {
          setError(result.message || "로그인에 실패했습니다.");
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      setError(
        error.message ||
          "로그인 중 오류가 발생했습니다. 네트워크 연결을 확인해주세요."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const goToFindPassword = () => {
    setFindAccountType("password");
    setShowFindAccount(true);
  };

  const goToFindId = () => {
    setFindAccountType("id");
    setShowFindAccount(true);
  };

  const goToJoin = () => {
    onClose();
    navigate("/join");
  };

  const handleFindAccountClose = () => {
    setShowFindAccount(false);
    setFindAccountType("");
  };

  return (
    <>
      {!showFindAccount && (
        <div className="login-form-modal-overlay" onClick={onClose}>
          <div
            className="login-form-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="login-form-container">
              <h1 className="login-form-title">jobfolio</h1>
              <h3 className="login-form-subtitle">
                AI기반의 자기소개서 생성서비스
              </h3>

              <form onSubmit={handleLogin} className="login-form">
                {error && (
                  <div
                    className="error-message"
                    style={{
                      color: "#ff4757",
                      marginBottom: "1rem",
                      padding: "10px",
                      backgroundColor: "#fff5f5",
                      border: "1px solid #ffebee",
                      borderRadius: "4px",
                      fontSize: "14px",
                    }}
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
                    disabled={isLoading}
                    placeholder="example@email.com"
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
                    disabled={isLoading}
                    placeholder="비밀번호를 입력하세요"
                  />
                </div>

                <button
                  type="submit"
                  className="login-form-submit"
                  disabled={isLoading}
                  style={{
                    opacity: isLoading ? 0.6 : 1,
                    cursor: isLoading ? "not-allowed" : "pointer",
                  }}
                >
                  {isLoading ? "로그인 중..." : "로그인"}
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
                <span onClick={goToJoin} className="login-form-linㅈㅈk">
                  회원가입
                </span>
              </div>
            </div>

            <button className="login-form-close" onClick={onClose}>
              ×
            </button>
          </div>
        </div>
      )}
      {showFindAccount && (
        <FindAccountForm
          onClose={handleFindAccountClose}
          type={findAccountType}
        />
      )}
    </>
  );
};

export default LoginForm;