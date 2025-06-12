import React, { useState } from "react";
import "../../../css/user/join/JoinForm.css";
import axios from "axios";

const JoinForm = () => {
  // 기존 상태
  const [email, setEmail] = useState("");
  const [emailToken, setEmailToken] = useState("");
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [loginId, setLoginId] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [sex, setSex] = useState("");
  const [hp, setHp] = useState("");
  const [birthday, setBirthday] = useState("");
  const [address, setAddress] = useState("");
  const [emailMsg, setEmailMsg] = useState("");
  const [tokenMsg, setTokenMsg] = useState("");
  const [joinMsg, setJoinMsg] = useState("");
  const [joinError, setJoinError] = useState("");

  // 검증 에러 메시지 추가
  const [emailError, setEmailError] = useState("");
  const [tokenError, setTokenError] = useState("");
  const [nameError, setNameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [hpError, setHpError] = useState("");
  const [birthdayError, setBirthdayError] = useState("");
  const [addressError, setAddressError] = useState("");

  axios.defaults.withCredentials = true;

  // 검증 함수들
  const validateEmail = (value) => {
    if (!value) {
      return "이메일을 입력해주세요.";
    }
    if (value.length > 50) {
      return "이메일은 50자 이하로 입력해주세요.";
    }
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(value)) {
      return "올바른 이메일 형식이 아닙니다. (특수문자는 @, ., _, - 만 허용)";
    }
    return "";
  };

  const validateToken = (value) => {
    if (!value) {
      return "인증번호를 입력해주세요.";
    }
    if (value.length !== 12) {
      return "인증번호는 12자리입니다.";
    }
    const tokenRegex = /^[a-zA-Z0-9]{12}$/;
    if (!tokenRegex.test(value)) {
      return "인증번호는 영문과 숫자만 입력 가능합니다.";
    }
    return "";
  };

  const validateName = (value) => {
    if (!value) {
      return "이름을 입력해주세요.";
    }
    if (value.length > 20) {
      return "이름은 20자 이하로 입력해주세요.";
    }
    const nameRegex = /^[a-zA-Z가-힣\s]+$/;
    if (!nameRegex.test(value)) {
      return "이름은 한글과 영문만 입력 가능합니다.";
    }
    return "";
  };

  const validatePassword = (value) => {
    if (!value) {
      return "비밀번호를 입력해주세요.";
    }
    if (value.length < 8) {
      return "비밀번호는 8자 이상이어야 합니다.";
    }
    if (value.length > 100) {
      return "비밀번호는 100자 이하로 입력해주세요.";
    }
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/;
    if (!passwordRegex.test(value)) {
      return "비밀번호는 영문, 숫자, 특수문자를 포함해야 합니다.";
    }
    return "";
  };

  const formatPhoneNumber = (value) => {
    const numbers = value.replace(/[^0-9]/g, '');
    
    if (numbers.length <= 3) {
      return numbers;
    } else if (numbers.length <= 7) {
      return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    } else if (numbers.length <= 11) {
      return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7)}`;
    }
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
  };

  const validatePhone = (value) => {
    if (!value) {
      return "휴대폰번호를 입력해주세요.";
    }
    const numbers = value.replace(/[^0-9]/g, '');
    if (!numbers.startsWith('010')) {
      return "010으로 시작하는 번호만 입력 가능합니다.";
    }
    if (numbers.length !== 11) {
      return "휴대폰번호는 11자리여야 합니다.";
    }
    if (value.length > 15) {
      return "형식이 올바르지 않습니다.";
    }
    return "";
  };

  const formatBirthday = (value) => {
    const numbers = value.replace(/[^0-9]/g, '');
    
    if (numbers.length <= 4) {
      return numbers;
    } else if (numbers.length <= 6) {
      return `${numbers.slice(0, 4)}-${numbers.slice(4)}`;
    } else if (numbers.length <= 8) {
      return `${numbers.slice(0, 4)}-${numbers.slice(4, 6)}-${numbers.slice(6)}`;
    }
    return `${numbers.slice(0, 4)}-${numbers.slice(4, 6)}-${numbers.slice(6, 8)}`;
  };

  const validateBirthday = (value) => {
    if (!value) {
      return "생년월일을 입력해주세요.";
    }
    
    const numbers = value.replace(/[^0-9]/g, '');
    if (numbers.length !== 8) {
      return "생년월일은 8자리로 입력해주세요.";
    }

    const year = parseInt(numbers.slice(0, 4));
    const month = parseInt(numbers.slice(4, 6));
    const day = parseInt(numbers.slice(6, 8));

    const now = new Date();
    const currentYear = now.getFullYear();
    
    if (year < currentYear - 100 || year > currentYear) {
      return "올바른 연도를 입력해주세요.";
    }
    
    if (month < 1 || month > 12) {
      return "올바른 월을 입력해주세요.";
    }
    
    if (day < 1 || day > 31) {
      return "올바른 일을 입력해주세요.";
    }

    const inputDate = new Date(year, month - 1, day);
    if (inputDate.getFullYear() !== year || 
        inputDate.getMonth() !== month - 1 || 
        inputDate.getDate() !== day) {
      return "유효하지 않은 날짜입니다.";
    }

    if (inputDate > now) {
      return "미래 날짜는 입력할 수 없습니다.";
    }

    return "";
  };

  const validateAddress = (value) => {
    if (!value) {
      return "주소를 입력해주세요.";
    }
    if (value.length > 500) {
      return "주소는 500자 이하로 입력해주세요.";
    }
    const addressRegex = /^[a-zA-Z0-9가-힣\s]+$/;
    if (!addressRegex.test(value)) {
      return "주소는 한글, 영문, 숫자만 입력 가능합니다.";
    }
    return "";
  };

  // 입력 핸들러들 (검증 로직 포함)
  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    setEmailError(validateEmail(value));
  };

  const handleTokenChange = (e) => {
    const value = e.target.value.toUpperCase();
    setEmailToken(value);
    setTokenError(validateToken(value));
  };

  const handleNameChange = (e) => {
    const value = e.target.value;
    setUserName(value);
    setNameError(validateName(value));
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    setPasswordError(validatePassword(value));
  };

  const handlePhoneChange = (e) => {
    const formatted = formatPhoneNumber(e.target.value);
    setHp(formatted);
    setHpError(validatePhone(formatted));
  };

  const handleBirthdayChange = (e) => {
    const formatted = formatBirthday(e.target.value);
    setBirthday(formatted);
    setBirthdayError(validateBirthday(formatted));
  };

  const handleAddressChange = (e) => {
    const value = e.target.value;
    setAddress(value);
    setAddressError(validateAddress(value));
  };

  // 이메일 인증번호 발송 (검증 추가)
  const handleSendEmail = async () => {
    const error = validateEmail(email);
    if (error) {
      setEmailError(error);
      return;
    }

    try {
      await axios.post("http://localhost:80/api/join/send-email-verification", {
        email,
      });
      setEmailMsg("인증번호가 이메일로 발송되었습니다.");
      setEmailError("");
    } catch (err) {
      setEmailMsg("이메일 발송에 실패했습니다.");
    }
  };

  // 이메일 인증번호 확인 (검증 추가)
  const handleVerifyToken = async () => {
    const tokenErr = validateToken(emailToken);
    if (tokenErr) {
      setTokenError(tokenErr);
      return;
    }

    try {
      await axios.post("http://localhost:80/api/join/verify-email-token", {
        email,
        token: emailToken,
      });
      setIsEmailVerified(true);
      setTokenMsg("이메일 인증이 완료되었습니다.");
      setLoginId(email);
      setTokenError("");
    } catch (err) {
      setTokenMsg("인증번호가 올바르지 않습니다.");
    }
  };

  // 회원가입 처리 (전체 검증 추가)
  const handleJoin = async (e) => {
    e.preventDefault();
    setJoinMsg("");
    setJoinError("");

    // 모든 필드 검증
    const errors = {
      email: validateEmail(email),
      name: validateName(userName),
      password: validatePassword(password),
      phone: validatePhone(hp),
      birthday: validateBirthday(birthday),
      address: validateAddress(address)
    };

    // 에러가 있으면 표시하고 중단
    if (Object.values(errors).some(error => error)) {
      setEmailError(errors.email);
      setNameError(errors.name);
      setPasswordError(errors.password);
      setHpError(errors.phone);
      setBirthdayError(errors.birthday);
      setAddressError(errors.address);
      setJoinError("입력값을 확인해주세요.");
      return;
    }

    if (!isEmailVerified) {
      setJoinError("이메일 인증을 완료해주세요.");
      return;
    }

    if (!sex) {
      setJoinError("성별을 선택해주세요.");
      return;
    }

    try {
      await axios.post("http://localhost:80/api/join/register", {
        loginId,
        userName,
        password,
        sex,
        hp,
        birthday,
        address,
      });
      setJoinMsg("회원가입이 완료되었습니다. 로그인 후 이용해주세요.");
    } catch (err) {
      setJoinError("회원가입에 실패했습니다. 입력값을 확인해주세요.");
    }
  };

  return (
    <div className="jf-joinform-wrapper">
      <h2 className="jf-joinform-title">회원가입</h2>
      <form className="jf-joinform-form" onSubmit={handleJoin}>
        
        {/* 이메일 */}
        <div className="jf-joinform-field-group">
          <label className="jf-joinform-label">이메일 *</label>
          <input
            type="email"
            className={`jf-joinform-input ${emailError ? 'error' : ''}`}
            value={email}
            onChange={handleEmailChange}
            disabled={isEmailVerified}
            placeholder="example@email.com"
          />
          <button
            type="button"
            className="jf-joinform-btn"
            onClick={handleSendEmail}
            disabled={isEmailVerified || !!emailError}
          >
            인증번호 발송
          </button>
          {emailError && <div className="jf-joinform-error">{emailError}</div>}
          {emailMsg && <div className="jf-joinform-msg">{emailMsg}</div>}
        </div>

        {/* 인증번호 */}
        <div className="jf-joinform-field-group">
          <label className="jf-joinform-label">인증번호 *</label>
          <input
            type="text"
            className={`jf-joinform-input ${tokenError ? 'error' : ''}`}
            value={emailToken}
            onChange={handleTokenChange}
            disabled={isEmailVerified}
            placeholder="12자리 인증번호"
            maxLength={12}
          />
          <button
            type="button"
            className="jf-joinform-btn"
            onClick={handleVerifyToken}
            disabled={isEmailVerified || !!tokenError}
          >
            이메일 인증
          </button>
          {tokenError && <div className="jf-joinform-error">{tokenError}</div>}
          {tokenMsg && <div className="jf-joinform-msg">{tokenMsg}</div>}
        </div>

        {/* 이름 */}
        <div className="jf-joinform-field-group">
          <label className="jf-joinform-label">이름 *</label>
          <input
            type="text"
            className={`jf-joinform-input ${nameError ? 'error' : ''}`}
            value={userName}
            onChange={handleNameChange}
            placeholder="한글 또는 영문으로 입력"
          />
          {nameError && <div className="jf-joinform-error">{nameError}</div>}
        </div>

        {/* 비밀번호 */}
        <div className="jf-joinform-field-group">
          <label className="jf-joinform-label">비밀번호 *</label>
          <input
            type="password"
            className={`jf-joinform-input ${passwordError ? 'error' : ''}`}
            value={password}
            onChange={handlePasswordChange}
            placeholder="영문, 숫자, 특수문자 포함 8자 이상"
          />
          {passwordError && <div className="jf-joinform-error">{passwordError}</div>}
        </div>

        {/* 성별 */}
        <div className="jf-joinform-field-group">
          <label className="jf-joinform-label">성별 *</label>
          <select
            className="jf-joinform-input"
            value={sex}
            onChange={(e) => setSex(e.target.value)}
          >
            <option value="">선택해주세요</option>
            <option value="M">남자</option>
            <option value="W">여자</option>
          </select>
        </div>

        {/* 휴대폰번호 */}
        <div className="jf-joinform-field-group">
          <label className="jf-joinform-label">휴대폰번호 *</label>
          <input
            type="text"
            className={`jf-joinform-input ${hpError ? 'error' : ''}`}
            value={hp}
            onChange={handlePhoneChange}
            placeholder="010-1234-5678"
          />
          {hpError && <div className="jf-joinform-error">{hpError}</div>}
        </div>

        {/* 생년월일 */}
        <div className="jf-joinform-field-group">
          <label className="jf-joinform-label">생년월일 *</label>
          <input
            type="text"
            className={`jf-joinform-input ${birthdayError ? 'error' : ''}`}
            value={birthday}
            onChange={handleBirthdayChange}
            placeholder="2000-01-01"
          />
          {birthdayError && <div className="jf-joinform-error">{birthdayError}</div>}
        </div>

        {/* 주소 */}
        <div className="jf-joinform-field-group">
          <label className="jf-joinform-label">주소 *</label>
          <input
            type="text"
            className={`jf-joinform-input ${addressError ? 'error' : ''}`}
            value={address}
            onChange={handleAddressChange}
            placeholder="한글, 영문, 숫자만 입력"
          />
          {addressError && <div className="jf-joinform-error">{addressError}</div>}
        </div>

        {/* 메시지 */}
        {joinMsg && (
          <div className="jf-joinform-msg" style={{ color: "green" }}>
            {joinMsg}
          </div>
        )}
        {joinError && (
          <div className="jf-joinform-msg" style={{ color: "red" }}>
            {joinError}
          </div>
        )}

        <button type="submit" className="jf-joinform-submit">
          회원가입
        </button>
      </form>
    </div>
  );
};

export default JoinForm;