// FindPasswordForm.jsx - 카운트다운 타이머 추가

import { useState, useEffect } from "react";
import axios from '../../../utils/axiosConfig';
import "../../../css/user/join/FindAccountForm.css";

const FindPasswordForm = ({ onClose, onSuccess }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: "",
    verificationCode: ""
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  
  // 타이머 관련 state 추가
  const [timeLeft, setTimeLeft] = useState(0); // 남은 시간 (초)
  const [isTimerActive, setIsTimerActive] = useState(false);

  // 카운트다운 타이머 useEffect
  useEffect(() => {
    let intervalId;
    
    if (isTimerActive && timeLeft > 0) {
      intervalId = setInterval(() => {
        setTimeLeft(time => {
          if (time <= 1) {
            setIsTimerActive(false);
            setError("인증번호가 만료되었습니다. 다시 요청해주세요.");
            return 0;
          }
          return time - 1;
        });
      }, 1000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isTimerActive, timeLeft]);

  // 시간을 MM:SS 형태로 포맷팅하는 함수
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // 타이머 색상 결정 함수
  const getTimerColor = () => {
    if (timeLeft <= 30) return '#e74c3c'; // 30초 이하: 빨간색
    if (timeLeft <= 60) return '#f39c12'; // 1분 이하: 주황색
    return '#27ae60'; // 그 외: 초록색
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      if (step === 1) {
        onClose();
      } else {
        const modal = e.currentTarget.querySelector('.find-account-modal');
        if (modal) {
          modal.style.animation = 'shake 0.3s ease-in-out';
          setTimeout(() => {
            modal.style.animation = '';
          }, 300);
        }
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError("");
  };

  // 이메일로 인증번호 발송
  const handleSendVerificationCode = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
  
    if (!formData.email.trim()) {
      setError("이메일을 입력해주세요.");
      setIsLoading(false);
      return;
    }
  
    try {
      const response = await axios.post("api/join/send-password-reset-token", {
        email: formData.email
      });
  
      if (response.result === "Y") {
        setSuccessMessage("인증번호가 이메일로 발송되었습니다.");
        setStep(2);
        
        // 타이머 시작 (5분 = 300초)
        setTimeLeft(300);
        setIsTimerActive(true);
        
        console.log("Step changed to 2, Timer started");
      } else {
        setError(response.message || "이메일 발송에 실패했습니다.");
      }
    } catch (error) {
      console.error("Error:", error);
      setError(error.message || "처리 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  // 인증번호 재전송 함수
  const handleResendCode = async () => {
    setError("");
    setIsLoading(true);

    try {
      const response = await axios.post("api/join/send-password-reset-token", {
        email: formData.email
      });

      if (response.result === "Y") {
        setSuccessMessage("인증번호가 재전송되었습니다.");
        
        // 타이머 리셋 및 재시작
        setTimeLeft(300);
        setIsTimerActive(true);
        
        console.log("Code resent, Timer restarted");
      } else {
        setError(response.message || "인증번호 재전송에 실패했습니다.");
      }
    } catch (error) {
      console.error("Error:", error);
      setError(error.message || "재전송 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  // 2단계: 인증번호 확인 + 새 비밀번호 발송
  const handleVerifyCodeAndResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
  
    if (!formData.verificationCode.trim()) {
      setError("인증번호를 입력해주세요.");
      setIsLoading(false);
      return;
    }

    // 시간 만료 체크
    if (timeLeft <= 0) {
      setError("인증번호가 만료되었습니다. 다시 요청해주세요.");
      setIsLoading(false);
      return;
    }
  
    try {
      const response = await axios.post("/api/join/verify-password-reset-and-send-new", {
        email: formData.email,
        verification_code: formData.verificationCode
      });
  
      if (response.result === "Y") {
        // 성공 시 타이머 정지
        setIsTimerActive(false);
        onSuccess(formData.email);
      } else {
        setError(response.message || "인증번호가 올바르지 않거나 만료되었습니다.");
      }
    } catch (error) {
      console.error("Error:", error);
      setError(error.message || "비밀번호 재설정 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <form onSubmit={handleSendVerificationCode} className="find-account-form">
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                이메일
              </label>
              <input
                type="email"
                className="form-input login-form-input"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                disabled={isLoading}
                placeholder="example@email.com"
                autoComplete="email"
              />
            </div>
            <button
              type="submit"
              className="login-form-submit"
              disabled={isLoading}
              style={{marginTop: '2.2rem'}}
            >
              {isLoading ? "발송 중..." : "인증번호 발송"}
            </button>
          </form>
        );

      case 2:
        return (
          <form onSubmit={handleVerifyCodeAndResetPassword} className="find-account-form">
            <div className="step-info" style={{marginBottom: '1.5rem', fontSize: '14px', color: '#666'}}>
              <strong>{formData.email}</strong>로 인증번호를 발송했습니다.<br/>
              
              <div style={{
                marginTop: '8px',
                fontSize: '16px',
                fontWeight: 'bold',
                color: getTimerColor()
              }}>
                {isTimerActive && timeLeft > 0 ? (
                  <>남은 시간: {formatTime(timeLeft)}</>
                ) : (
                  <span style={{color: '#e74c3c'}}>⚠️ 인증번호가 만료되었습니다</span>
                )}
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="verificationCode" className="form-label">
                인증번호
              </label>
              <div style={{display: 'flex', gap: '10px'}}>
                <input
                  type="text"
                  className="form-input login-form-input"
                  id="verificationCode"
                  name="verificationCode"
                  value={formData.verificationCode}
                  onChange={handleInputChange}
                  required
                  disabled={isLoading || timeLeft <= 0}
                  placeholder="인증번호 6자리"
                  maxLength={6}
                  autoComplete="off"
                  style={{flex: 1}}
                />
                <button
                  type="button"
                  onClick={handleResendCode}
                  disabled={isLoading || (isTimerActive && timeLeft > 240)} // 1분 후부터 재전송 가능
                  style={{
                    padding: '8px 12px',
                    fontSize: '12px',
                    backgroundColor: '#6c757d',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: timeLeft <= 240 ? 'pointer' : 'not-allowed',
                    opacity: timeLeft <= 240 ? 1 : 0.5,
                    whiteSpace: 'nowrap'
                  }}
                >
                  재전송
                </button>
              </div>
              {timeLeft > 240 && (
                <div style={{fontSize: '12px', color: '#666', marginTop: '5px'}}>
                  재전송은 {formatTime(timeLeft - 240)} 후 가능합니다
                </div>
              )}
            </div>
            
            <div className="info-box" style={{
              backgroundColor: '#fff3cd',
              padding: '15px',
              borderRadius: '6px',
              marginBottom: '1.5rem',
              fontSize: '13px',
              color: '#856404',
              border: '1px solid #ffeaa7'
            }}>
              <strong>⚠️ 중요:</strong> 인증번호 확인 후 새로운 비밀번호가 자동으로 생성되어 이메일로 발송됩니다.
            </div>
            
            <div className="button-group" style={{display: 'flex', gap: '10px', marginTop: '2.2rem'}}>
              <button
                type="button"
                className="login-form-submit"
                onClick={() => {
                  setStep(1);
                  setSuccessMessage("");
                  setError("");
                  //  타이머 정지
                  setIsTimerActive(false);
                  setTimeLeft(0);
                }}
                style={{flex: 1, backgroundColor: '#6c757d'}}
              >
                이전
              </button>
              <button
                type="submit"
                className="login-form-submit"
                disabled={isLoading || timeLeft <= 0}
                style={{
                  flex: 2,
                  opacity: timeLeft <= 0 ? 0.5 : 1,
                  cursor: timeLeft <= 0 ? 'not-allowed' : 'pointer'
                }}
              >
                {isLoading ? "처리 중..." : "인증번호 확인"}
              </button>
            </div>
          </form>
        );

      default:
        return null;
    }
  };

  return (
    <div className="find-account-modal-overlay" onClick={handleOverlayClick}>
      <div className="find-account-modal" onClick={e => e.stopPropagation()}>
        <div className="find-account-container">
          <h1 className="login-form-title" style={{marginBottom: 0}}>jobfolio</h1>
          <h3 className="login-form-subtitle" style={{marginTop: 0, marginBottom: '2.2rem'}}>
            AI기반의 자기소개서 생성서비스
          </h3>
          
          <div className="step-indicator" style={{marginBottom: '2rem'}}>
            <div style={{display: 'flex', justifyContent: 'center', gap: '15px'}}>
              {[
                { num: 1, label: "이메일 입력" },
                { num: 2, label: "인증번호 확인" }
              ].map((stepInfo) => (
                <div key={stepInfo.num} style={{textAlign: 'center'}}>
                  <div
                    style={{
                      width: '35px',
                      height: '35px',
                      borderRadius: '50%',
                      backgroundColor: step >= stepInfo.num ? '#007bff' : '#e9ecef',
                      color: step >= stepInfo.num ? 'white' : '#6c757d',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '14px',
                      fontWeight: 'bold',
                      margin: '0 auto 8px'
                    }}
                  >
                    {stepInfo.num}
                  </div>
                  <div style={{fontSize: '12px', color: '#666'}}>
                    {stepInfo.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {error && (
            <div className="error-message" style={{marginBottom: '1rem'}}>
              {error}
            </div>
          )}

          {successMessage && (
            <div className="success-message" style={{
              marginBottom: '1rem', 
              color: '#28a745', 
              padding: '12px', 
              backgroundColor: '#d4edda', 
              border: '1px solid #c3e6cb', 
              borderRadius: '6px',
              fontSize: '14px'
            }}>
              {successMessage}
            </div>
          )}

          {renderStepContent()}
        </div>
        <button className="login-form-close" onClick={onClose}>
          ×
        </button>
      </div>
    </div>
  );
};

export default FindPasswordForm;