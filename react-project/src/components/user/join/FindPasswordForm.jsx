import { useState } from "react";
import axios from '../../../utils/axiosConfig';
import "../../../css/user/join/FindAccountForm.css";

const FindPasswordForm = ({ onClose, onSuccess }) => {
  const [step, setStep] = useState(1); // 1: 이메일 입력, 2: 인증번호 입력
  const [formData, setFormData] = useState({
    email: "",
    verificationCode: ""
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

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
        setSuccessMessage("인증번호가 이메일로 발송되었습니다. (5분간 유효)");
        setStep(2); // 인증번호 입력 단계로 이동
        console.log("Step changed to 2"); // 디버깅용
      } else {
        setError(response.message || "이메일 발송에 실패했습니다.");
      }
    } catch (error) {
      console.error("Error:", error);
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("처리 중 오류가 발생했습니다. 다시 시도해주세요.");
      }
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

    try {
      const response = await axios.post("/api/join/verify-password-reset-and-send-new", {
        email: formData.email,
        verification_code: formData.verificationCode
      });

      if (response.result === "Y") {
        // 성공시 부모 컴포넌트에 알림 (결과 화면으로 전환)
        onSuccess(formData.email);
      } else {
        setError(response.message || "인증번호가 올바르지 않거나 만료되었습니다.");
      }
    } catch (error) {
      console.error("Error:", error);
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.message);
      } else {
        setError("비밀번호 재설정 중 오류가 발생했습니다.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const renderStepContent = () => {
    console.log("Current step:", step); // 디버깅용
    
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
              <span style={{color: '#e74c3c'}}>인증번호는 5분간 유효합니다.</span>
            </div>
            <div className="form-group">
              <label htmlFor="verificationCode" className="form-label">
                인증번호
              </label>
              <input
                type="text"
                className="form-input login-form-input"
                id="verificationCode"
                name="verificationCode"
                value={formData.verificationCode}
                onChange={handleInputChange}
                required
                disabled={isLoading}
                placeholder="인증번호 6자리"
                maxLength={6}
                autoComplete="off"
              />
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
                }}
                style={{flex: 1, backgroundColor: '#6c757d'}}
              >
                이전
              </button>
              <button
                type="submit"
                className="login-form-submit"
                disabled={isLoading}
                style={{flex: 2}}
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
    <div className="find-account-modal-overlay" onClick={onClose}>
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