import React from 'react';
import "../../../css/user/join/FindAccountForm.css";

const FindPasswordResult = ({ onClose, email, onGoToLogin }) => {
  return (
    <div className="find-account-modal-overlay" onClick={onClose}>
      <div className="find-account-modal" onClick={e => e.stopPropagation()}>
        <div className="find-account-container">
          {/* <h1 className="login-form-title" style={{marginBottom: 0}}>jobfolio</h1> */}
          <img
                  src="/resources/logo/logo.png"
                  alt="로고"
                  className="logoImg"
                  // 크기 css
                  style={{width: '80px', height: '100.14px', marginLeft: '0px'}}
                />
          {/* <h3 className="login-form-subtitle" style={{marginTop: 0, marginBottom: '2.2rem'}}>
            AI기반의 자기소개서 생성서비스
          </h3> */}
          
          <div className="find-result">
            <div className="completion-content" style={{textAlign: 'center', padding: '20px 0'}}>
              <div style={{
                fontSize: '48px',
                color: '#28a745',
                marginBottom: '20px'
              }}>
                ✅
              </div>
              
              <div className="success-message" style={{
                marginBottom: '1.5rem',
                fontSize: '16px',
                fontWeight: 'bold',
                color: '#28a745'
              }}>
                비밀번호 재설정 완료!
              </div>
              
              <div style={{
                backgroundColor: '#f8f9fa',
                padding: '20px',
                borderRadius: '8px',
                marginBottom: '20px',
                border: '1px solid #dee2e6'
              }}>
                <p style={{margin: '0 0 10px', fontSize: '14px', color: '#495057'}}>
                  <strong style={{color: '#007bff'}}>{email}</strong>로<br/>
                  <strong style={{color: '#007bff'}}>새로운 비밀번호</strong>가 발송되었습니다.
                </p>
                <p style={{margin: '0', fontSize: '13px', color: '#6c757d'}}>
                  이메일을 확인하고 새 비밀번호로 로그인해주세요.
                </p>
              </div>
              
              <div style={{
                fontSize: '13px',
                color: '#6c757d',
                marginBottom: '25px',
                lineHeight: '1.4'
              }}>
                💡 <strong>안내:</strong> 이메일로 발송된 새 비밀번호로 로그인해주세요.
                <br/>로그인 후 보안을 위해 비밀번호를 변경하는 것을 권장합니다.
              </div>
              
              <button
                className="login-form-submit"
                onClick={onGoToLogin}
                style={{width: '100%'}}
              >
                로그인하러 가기
              </button>
            </div>
          </div>
        </div>
        <button className="login-form-close" onClick={onClose}>
          ×
        </button>
      </div>
    </div>
  );
};

export default FindPasswordResult;