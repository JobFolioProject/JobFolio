import "../../css/user/join/join.css";
import { useNavigate } from "react-router-dom";

const Login = ({ onClose, onLoginClick }) => {
  const navigate = useNavigate();

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
        <div className="login-container">
          <h1 className="login-title">jobfollio</h1>
          <h3 className="login-subtitle">Ai기반의 자기소개서 생성서비스</h3>
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
            <span onClick={goToFindPassword}>비밀번호 찾기</span>
            <span className="divider">|</span>
            <span onClick={goToFindId}>아이디 찾기</span>
            <span className="divider">|</span>
            <span onClick={goToJoin}>회원가입</span>
          </div>
        </div>
        <button className="close-button" onClick={onClose}>
          ×
        </button>
      </div>
    </div>
  );
};

export default Login;
