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
    sessionStorage.setItem("loginUser", "naver");
    window.location.href = "/";
  };

  const kakaoLogin = () => {
    sessionStorage.setItem("loginUser", "kakao");
    window.location.href = "/";
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