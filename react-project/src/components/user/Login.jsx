import "../../css/user/join/join.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import FindAccountForm from "./join/FindAccountForm";
import FindPasswordForm from "./join/FindPasswordForm";
import FindPasswordResult from "./join/FindPasswordResult";

const Login = ({ onClose, onLoginClick }) => {
  const navigate = useNavigate();
  const [showFindAccount, setShowFindAccount] = useState(false);
  const [findAccountType, setFindAccountType] = useState("");
  const [showFindPassword, setShowFindPassword] = useState(false);
  const [findPasswordEmail, setFindPasswordEmail] = useState("");
  const [showFindPasswordResult, setShowFindPasswordResult] = useState(false);

  const userLogin = () => {
    onLoginClick();
    onClose();
  };

  const naverLogin = () => {
    window.location.href = "http://localhost/oauth2/authorization/naver";
  };
  
  const kakaoLogin = () => {
    window.location.href = "http://localhost/oauth2/authorization/kakao";
  };
  
  const googleLogin = () => {
    window.location.href = "http://localhost/oauth2/authorization/google";
  };

  const goToFindPassword = () => {
    setShowFindPassword(true);
  };

  const goToFindId = () => {
    setFindAccountType("id");
    setShowFindAccount(true);
  };

  const goToJoin = () => {
    navigate("/join");
    onClose();
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
        <div className="login-form-modal-overlay">
          <div className="login-form-modal">
            <div className="login-container">
              <h1 className="login-title">jobfolio</h1> 
              <h3 className="login-subtitle">AI기반의 자기소개서 생성서비스</h3>
              <div className="login-buttons">
                <button className="login-btn user-login" onClick={userLogin}>
                  <img
                    src="/resources/img/local_login.png"
                    alt="로컬 로그인"
                    className="login-icon"
                  />
                  <span className="login-text">로그인</span>
                </button>
                <button className="login-btn kakao-login" onClick={kakaoLogin}>
                  <img
                    src="/resources/img/KakaoTalk_login.svg"
                    alt="카카오 로그인"
                    className="login-icon"
                  />
                  <span className="login-text">카카오로 로그인</span>
                </button>
                
                <button className="login-btn naver-login" onClick={naverLogin}>
                  <img
                    src="/resources/img/naver_login.png"
                    alt="네이버 로그인"
                    className="login-icon"
                  />
                  <span className="login-text">네이버로 로그인</span>
                </button>

                <button className="login-btn google-login gsi-material-button" onClick={googleLogin}>
                <div className="gsi-material-button-state"></div>
                <div className="gsi-material-button-content-wrapper">
                  <div className="gsi-material-button-icon">
                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" style={{display: "block"}}>
                      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                      <path fill="none" d="M0 0h48v48H0z"></path>
                    </svg>
                  </div>
                  <span className="gsi-material-button-contents login-text">구글로 로그인</span>
                </div>
              </button>

              </div>
              <div className="login-links">
                <span onClick={goToFindPassword} style={{cursor: 'pointer'}}>
                  비밀번호 찾기
                </span>
                <span className="divider">|</span>
                <span onClick={goToFindId} style={{cursor: 'pointer'}}>
                  아이디 찾기
                </span>
                <span className="divider">|</span>
                <span onClick={goToJoin} style={{cursor: 'pointer'}}>
                  회원가입
                </span>
              </div>
            </div>
            <button className="close-button" onClick={onClose}>
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

export default Login;