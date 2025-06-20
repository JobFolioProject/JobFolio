// 📁 src/components/user/join/SocialLogin.jsx
import React from 'react';
import '../../../css/user/join/SocialLogin.css';

const SocialLogin = ({ 
  title = "소셜로 간편하게 로그인하세요",
  showDivider = true,
  size = "medium", // small, medium, large
  providers = ['naver', 'kakao', 'google'] 
}) => {
  
  const socialHandlers = {
    naver: () => {
      window.location.href = "http://localhost/oauth2/authorization/naver";
    },
    kakao: () => {
      window.location.href = "http://localhost/oauth2/authorization/kakao";
    },
    google: () => {
      window.location.href = "http://localhost/oauth2/authorization/google";
    }
  };

  // SocialLogin.jsx에서 renderGoogleButton 함수를 이렇게 완전 교체:

const renderGoogleButton = () => (
  <button
    type="button"
    className="social-login-btn google-custom-btn"
    onClick={socialHandlers.google}
    aria-label="구글로 로그인"
    title="구글로 로그인"
    style={{
      backgroundColor: '#ffffff',
      border: '2px solid #dadce0',
      borderRadius: '50%',
      width: '45px',
      height: '45px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      transition: 'all 0.3s ease'
    }}
  >
    <svg 
      version="1.1" 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 48 48" 
      style={{
        width: '22px', 
        height: '22px', 
        display: 'block'
      }}
    >
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
      <path fill="none" d="M0 0h48v48H0z"></path>
    </svg>
  </button>
);

  //  카카오 버튼 렌더링
  const renderKakaoButton = () => (
    <button
      type="button"
      className="kakao-svg-btn"
      onClick={socialHandlers.kakao}
      aria-label="카카오로 로그인"
      title="카카오로 로그인"
    >
      <svg 
        id="Layer_1" 
        data-name="Layer 1" 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 100 100"
        className="kakao-svg-icon"
      >
        <defs>
          <style>{`.cls-1{fill:#fae300;}.cls-2{fill:#391b1b;}`}</style>
        </defs>
        <circle className="cls-1" cx="50" cy="50" r="50"/>
        <path className="cls-2" d="M50,31.38c-13.6,0-24.6,8.74-24.59,19.49,0,7,4.69,13.12,11.7,16.54-.52,1.92-1.86,7-2.13,8-.33,1.34.49,1.32,1,1s6.74-4.59,9.47-6.45a29.67,29.67,0,0,0,4.56.33c13.6,0,24.6-8.74,24.59-19.48S63.57,31.37,50,31.38" transform="translate(0 0)"/>
      </svg>
    </button>
  );

  // 일반 소셜 버튼 렌더링 (커스텀 스타일)
  const renderSocialButton = (provider) => {
    const socialConfig = {
      naver: {
        label: '네이버',
        className: 'naver-btn',
        icon: 'N'
      }
    };

    const config = socialConfig[provider];
    if (!config) return null;
    
    return (
      <button
        key={provider}
        type="button"
        className={`social-login-btn ${config.className}`}
        onClick={socialHandlers[provider]}
        aria-label={`${config.label}로 로그인`}
        title={`${config.label}로 로그인`}
      >
        <div className="social-icon">
          {config.icon}
        </div>
      </button>
    );
  };

  return (
    <div className={`social-login-section ${size}`}>
      {title && (
        <div className="social-login-title">
          <span>{title}</span>
        </div>
      )}
      
      <div className="social-login-buttons">
        {providers.map(provider => {
          // 구글은 특별 처리
          if (provider === 'google') {
            return <div key="google">{renderGoogleButton()}</div>;
          }
          // 카카오는 특별 처리
          if (provider === 'kakao') {
            return <div key="kakao">{renderKakaoButton()}</div>;
          }
          // 나머지는 일반 처리
          return renderSocialButton(provider);
        })}
      </div>
      
      {showDivider && (
        <div className="login-divider">
          <span></span>
        </div>
      )}
    </div>
  );
};

export default SocialLogin;