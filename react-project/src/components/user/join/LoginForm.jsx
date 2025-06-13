import "../../../css/user/join/LoginForm.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

const LoginForm = ({ onClose }) => {
  const navigate = useNavigate();
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // axios 설정
  axios.defaults.withCredentials = true;

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // 입력값 검증
    if (!loginId.trim() || !password.trim()) {
      setError("이메일과 비밀번호를 입력해주세요.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post("http://localhost:80/api/join/login", {
        login_id: loginId,  
        password: password,
      });

      console.log("로그인 응답:", response.data);

      const result = response.data;

      if (result.result === "Y") {
        // 로그인 성공
        console.log("로그인 성공:", result.userInfo);
        
        // 사용자 정보를 sessionStorage에 저장
        const userInfo = {
          userNo: result.userInfo.user_no,
          loginId: result.userInfo.login_id,
          userName: result.userInfo.user_name,
          userType: result.userInfo.user_type,
          loginTime: new Date().toISOString()
        };
        
        sessionStorage.setItem("user",JSON.stringify(userInfo));
        
        // 로그인 성공 알림
        alert(result.message || "로그인이 완료되었습니다.");
        
        // 모달 닫기
        onClose();
        
        // 메인 페이지로 이동
        navigate("/");
        
        // 페이지 새로고침으로 헤더 상태 업데이트
        window.location.reload();
      } else {
        // 로그인 실패
        setError(result.message || "로그인에 실패했습니다.");
      }
    } catch (error) {
      console.error("Login error:", error);
      
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else if (error.response?.status === 400) {
        setError("아이디 또는 비밀번호가 올바르지 않습니다.");
      } else if (error.response?.status === 500) {
        setError("서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
      } else {
        setError("로그인 중 오류가 발생했습니다. 네트워크 연결을 확인해주세요.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const goToFindPassword = () => {
    onClose();
    navigate("/find-password");
  };

  const goToFindId = () => {
    onClose();
    navigate("/find-id");
  };

  const goToJoin = () => {
    onClose();
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
                style={{ 
                  color: "#ff4757", 
                  marginBottom: "1rem",
                  padding: "10px",
                  backgroundColor: "#fff5f5",
                  border: "1px solid #ffebee",
                  borderRadius: "4px",
                  fontSize: "14px"
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
                cursor: isLoading ? "not-allowed" : "pointer"
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
  );
};

export default LoginForm;