import { useState } from "react";
import axios from "axios";
import "../../../css/user/join/FindAccountForm.css";

const FindAccountForm = ({ onClose, type }) => {
  const [formData, setFormData] = useState({
    user_name: "",
    hp: "",
    email: ""
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [foundResult, setFoundResult] = useState(null); 

  // 전화번호 포맷팅 함수 (JoinForm에서 가져옴)
  const formatPhoneNumber = (value) => {
    const numbers = value.replace(/[^0-9]/g, "");
    if (numbers.length <= 3) return numbers;
    else if (numbers.length <= 7)
      return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    else if (numbers.length <= 11)
      return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7)}`;
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
  };

  // 숫자만 추출하는 함수
  const extractNumbers = (str) => {
    return str.replace(/[^0-9]/g, '');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // 전화번호인 경우 포맷팅 적용
    if (name === "hp") {
      const formattedValue = formatPhoneNumber(value);
      setFormData(prev => ({
        ...prev,
        [name]: formattedValue
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    setFoundResult(null);

    try {
      if (type === "id") {
        if (!formData.user_name.trim() || !formData.hp.trim()) {
          setError("이름과 연락처를 모두 입력해주세요.");
          setIsLoading(false);
          return;
        }

        // 전화번호에서 숫자만 추출해서 서버로 전송
        const phoneNumbers = extractNumbers(formData.hp);

        const response = await axios.post("http://localhost:80/api/join/find-id", {
          user_name: formData.user_name,
          hp: phoneNumbers // DB에는 숫자만 저장
        });

        if (response.data.result === "Y") {
          setFoundResult({
            type: "id",
            found_id: response.data.found_id,
            reg_date: response.data.reg_date,
            message: response.data.message
          });
        } else {
          setError(response.data.message || "일치하는 정보의 계정을 찾을 수 없습니다.");
        }

      } else {
        if (!formData.email.trim()) {
          setError("이메일을 입력해주세요.");
          setIsLoading(false);
          return;
        }

        const response = await axios.post("/api/join/send-password-reset-token", {
          email: formData.email
        });

        if (response.data.result === "Y") {
          setFoundResult({
            type: "password",
            email: formData.email,
            message: response.data.message
          });
        } else {
          setError(response.data.message || "처리 중 오류가 발생했습니다.");
        }
      }
    } catch (error) {
      // console.error("Error:", error);
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("처리 중 오류가 발생했습니다. 다시 시도해주세요.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (foundResult) {
    return (
      <div className="find-account-modal-overlay" onClick={onClose}>
        <div className="find-account-modal" onClick={e => e.stopPropagation()}>
        <img
                  src="/resources/logo/logo.png"
                  alt="로고"
                  className="logoImg"
                  // 크기 css
                  style={{width: '230px', height: '241.14px', marginLeft: '0px'}}
                />
          <div className="find-account-container">
            {/* <h1 className="login-form-title" style={{marginBottom: 0}}>jobfolio</h1> */}
           
            <h3 className="login-form-subtitle" style={{marginTop: 0, marginBottom: '2.2rem'}}>
              AI기반의 자기소개서 생성서비스
            </h3>
            
            {foundResult.type === "id" ? (
              <div className="find-result">
                <div className="success-message" style={{marginBottom: '1.5rem'}}>
                  등록된 아이디를 확인해 주세요
                </div>
                <div className="found-info">
                  <div className="info-item">
                    <strong>아이디 : </strong>
                    <span style={{color: '#007bff', fontSize: '1.1em', fontWeight: 'bold'}}>
                      {foundResult.found_id}
                    </span>
                  </div>
                  <div className="info-item">
                    <strong>가입일 : </strong>
                    <span>{foundResult.reg_date}</span>
                  </div>
                </div>
                <button 
                  className="login-form-submit" 
                  onClick={onClose}
                  style={{marginTop: '2rem'}}
                >
                  확인
                </button>
              </div>
            ) : (
              <div className="find-result">
                <div className="success-message" style={{marginBottom: '1.5rem'}}>
                   {foundResult.message}
                </div>
                <div className="info-text">
                  <strong>{foundResult.email}</strong>로<br/>
                  인증번호가 발송되었습니다.
                </div>
                <button 
                  className="login-form-submit" 
                  onClick={onClose}
                  style={{marginTop: '2rem'}}
                >
                  확인
                </button>
              </div>
            )}
          </div>
          <button className="login-form-close" onClick={onClose}>
            ×
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="find-account-modal-overlay" onClick={onClose}>
      <div className="find-account-modal" onClick={e => e.stopPropagation()}>
        <div className="find-account-container">
          {/* <h1 className="login-form-title" style={{marginBottom: 0}}>jobfolio</h1> */}
          <img
                  src="/resources/logo/logo.png"
                  alt="로고"
                  className="logoImg"
                  style={{width: '230px', height: '241.14px', marginLeft: '0px'}}
                />
          <h3 className="login-form-subtitle" style={{marginTop: 0, marginBottom: '2.2rem'}}>
            AI기반의 자기소개서 생성서비스
          </h3>
          
          <form onSubmit={handleSubmit} className="find-account-form">
            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            {type === "id" ? (
              <>
                <div className="form-group">
                  <label htmlFor="user_name" className="form-label">
                    이름
                  </label>
                  <input
                    type="text"
                    className="form-input login-form-input"
                    id="user_name"
                    name="user_name"
                    value={formData.user_name}
                    onChange={handleInputChange}
                    required
                    disabled={isLoading}
                    placeholder="홍길동"
                    autoComplete="name"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="hp" className="form-label">
                    연락처
                  </label>
                  <input
                    type="tel"
                    className="form-input login-form-input"
                    id="hp"
                    name="hp"
                    value={formData.hp}
                    onChange={handleInputChange}
                    required
                    disabled={isLoading}
                    placeholder="010-1234-5678"
                    autoComplete="tel"
                    maxLength={13} // 010-1234-5678 형식 (13자리)
                  />
                </div>

                <button
                  type="submit"
                  className="login-form-submit"
                  disabled={isLoading}
                  style={{marginTop: '2.2rem'}}
                >
                  {isLoading ? "검색 중..." : "아이디 찾기"}
                </button>
              </>
            ) : (
              <>
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
              </>
            )}
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