import "../../../css/user/join/LoginForm.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import FindAccountForm from "./FindAccountForm";
import FindPasswordForm from "./FindPasswordForm";
import FindPasswordResult from "./FindPasswordResult";
import { useAuth } from "../../../context/AuthContext";
import { useSnackbar } from "../../../context/SnackbarProvider";

const LoginForm = ({ onClose }) => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showFindAccount, setShowFindAccount] = useState(false);
  const [findAccountType, setFindAccountType] = useState("");

  const snackbar = useSnackbar();

  const [showFindPassword, setShowFindPassword] = useState(false);
  const [findPasswordEmail, setFindPasswordEmail] = useState("");
  const [showFindPasswordResult, setShowFindPasswordResult] = useState(false);

  const handleOverlayClick = (e) => {
    e.stopPropagation();
  };

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

      console.log("=== 로그인 응답 구조 확인 ===");
      console.log("전체 result:", result);
      console.log("result.user:", result.user);
      console.log("result.data:", result.data);

      if (result.success) {
        let userName = '사용자';
        
        const possibleUserNames = [
          result.user?.user_name,    
          result.user?.name,        
          result.data?.user?.user_name,
          result.data?.user?.name,   
          result.data?.user_name,    
          result.data?.name,         
          result.userName,           
          result.name,                
          result.user_name,          
        ];

        userName = possibleUserNames.find(name => name && typeof name === 'string' && name.trim()) || '사용자';
        
        console.log("최종 선택된 사용자 이름:", userName);

        // 🔥 로그인 팝업 즉시 닫기
        onClose();
        navigate("/");
        
        // 🔥 MUI 초록색 팝업만 표시 (3초 후 자동 사라짐)
        snackbar.auth.loginSuccess(userName);
        
      } else {
        if (result.message && result.message.includes("탈퇴한 계정")) {
          setError(
            "탈퇴한 계정입니다. 고객센터에 문의하시거나 계정 복구를 요청해주세요."
          );
        } else {
          setError(result.message || "로그인에 실패했습니다.");
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      
      let errorMessage = "로그인 중 오류가 발생했습니다.";
      
      if (error.message) {
        if (error.message.includes("네트워크")) {
          errorMessage = "네트워크 연결을 확인해주세요.";
          snackbar.system.networkError();
        } else if (error.message.includes("서버")) {
          errorMessage = "서버에 문제가 발생했습니다.";
          snackbar.system.serverError();
        } else {
          errorMessage = error.message;
          snackbar.error(errorMessage);
        }
      } else {
        snackbar.error(errorMessage);
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const goToFindPassword = () => {
    setShowFindPassword(true);
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

  const handleFindPasswordClose = () => {
    setShowFindPassword(false);
  };

  const handleFindPasswordSuccess = (email) => {
    setShowFindPassword(false);
    setFindPasswordEmail(email);
    setShowFindPasswordResult(true);
  };

  const handleFindPasswordResultClose = () => {
    setShowFindPasswordResult(false);
    setFindPasswordEmail("");
  };

  const handleGoToLogin = () => {
    setShowFindPasswordResult(false);
    setFindPasswordEmail("");
  };

  return (
    <>
      {!showFindAccount && !showFindPassword && !showFindPasswordResult && (
        <div className="login-form-modal-overlay" onClick={handleOverlayClick}>
          <div
            className="login-form-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="login-form-container">
              <h1 className="login-form-title">
                <img
                  src="/resources/logo/logo.png"
                  alt="로고"
                  className="logoImg"
                />
                <h3 className="login-form-subtitle">
                  AI기반의 자기소개서 생성서비스
                </h3>
              </h1>

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
      )}

      {showFindAccount && (
        <FindAccountForm
          onClose={handleFindAccountClose}
          type={findAccountType}
        />
      )}

      {showFindPassword && (
        <FindPasswordForm
          onClose={handleFindPasswordClose}
          onSuccess={handleFindPasswordSuccess}
        />
      )}

      {showFindPasswordResult && (
        <FindPasswordResult
          onClose={handleFindPasswordResultClose}
          email={findPasswordEmail}
          onGoToLogin={handleGoToLogin}
        />
      )}
    </>
  );
};

export default LoginForm;