import { useState } from "react";
import axios from "axios";
import "../../../css/user/join/FindAccountForm.css";

const FindAccountForm = ({ onClose, type }) => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!email.trim()) {
      setError("이메일을 입력해주세요.");
      setIsLoading(false);
      return;
    }

    try {
      const endpoint = type === "id" ? "/api/join/find-id" : "/api/join/find-password";
      const response = await axios.post(`http://localhost:80${endpoint}`, {
        email: email
      });

      if (response.data.result === "Y") {
        alert(response.data.message || "이메일이 발송되었습니다.");
        onClose();
      } else {
        setError(response.data.message || "처리 중 오류가 발생했습니다.");
      }
    } catch (error) {
      console.error("Error:", error);
      setError("처리 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
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
          <form onSubmit={handleSubmit} className="find-account-form">
            {error && (
              <div className="error-message">
                {error}
              </div>
            )}
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                이메일
              </label>
              <input
                type="email"
                className="form-input login-form-input"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
                placeholder="example@email.com"
                autoComplete="off"
              />
            </div>
            <button 
              type="submit" 
              className="login-form-submit"
              disabled={isLoading}
              style={{marginTop: '2.2rem'}}
            >
              {isLoading ? "발송 중..." : "인증메일 발송"}
            </button>
          </form>
        </div>
        <button className="login-form-close" onClick={onClose}>
          ×
        </button>
      </div>
    </div>
  );
};

export default FindAccountForm; 