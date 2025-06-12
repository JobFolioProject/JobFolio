import React, { useState } from "react";
import "../../../css/user/join/JoinForm.css";
import axios from "axios";

const JoinForm = () => {
  // 상태 정의
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [userName, setUserName] = useState("");
  const [birthday, setBirthday] = useState("");
  const [sex, setSex] = useState("");
  const [email, setEmail] = useState("");
  const [emailToken, setEmailToken] = useState("");
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [emailMsg, setEmailMsg] = useState("");
  const [tokenMsg, setTokenMsg] = useState("");
  const [joinMsg, setJoinMsg] = useState("");
  const [joinError, setJoinError] = useState("");

  // 약관 동의
  const [agreeAll, setAgreeAll] = useState(false);
  const [agreeAge, setAgreeAge] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const [agreePrivacyOpt, setAgreePrivacyOpt] = useState(false);
  const [agreeEmail, setAgreeEmail] = useState(false);
  const [agreeSms, setAgreeSms] = useState(false);

  // 에러 메시지
  const [userIdError, setUserIdError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [nameError, setNameError] = useState("");
  const [birthdayError, setBirthdayError] = useState("");
  const [sexError, setSexError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [tokenError, setTokenError] = useState("");

  // 검증 함수
  const validateUserId = (value) => {
    if (!value) return "아이디를 입력해주세요.";
    if (value.length < 4 || value.length > 16) return "아이디는 4~16자여야 합니다.";
    if (!/^[a-zA-Z0-9]+$/.test(value)) return "아이디는 영문, 숫자만 입력 가능합니다.";
    return "";
  };
  const validatePassword = (value) => {
    if (!value) return "비밀번호를 입력해주세요.";
    if (value.length < 8 || value.length > 16) return "비밀번호는 8~16자여야 합니다.";
    if (!/(?=.*[a-zA-Z])(?=.*\d)(?=.*[!"#$%&'()*+,-./:;?@[\]^_{|}~]).{8,16}/.test(value)) return "영문, 숫자, 특수문자를 포함해야 합니다.";
    return "";
  };
  const validateName = (value) => {
    if (!value) return "이름을 입력해주세요.";
    if (value.length > 12) return "이름은 12자 이하로 입력해주세요.";
    return "";
  };
  const validateBirthday = (value) => {
    if (!value) return "생년월일을 입력해주세요.";
    if (!/^\d{8}$/.test(value)) return "생년월일은 8자리로 입력해주세요.";
    return "";
  };
  const validateEmail = (value) => {
    if (!value) return "이메일을 입력해주세요.";
    if (!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)) return "올바른 이메일 형식이 아닙니다.";
    return "";
  };
  const validateToken = (value) => {
    if (!value) return "인증번호를 입력해주세요.";
    if (value.length !== 12) return "인증번호는 12자리입니다.";
    if (!/^[a-zA-Z0-9]{12}$/.test(value)) return "인증번호는 영문과 숫자만 입력 가능합니다.";
    return "";
  };

  // 전체동의 핸들러
  const handleAgreeAll = (e) => {
    const checked = e.target.checked;
    setAgreeAll(checked);
    setAgreeAge(checked);
    setAgreeTerms(checked);
    setAgreePrivacy(checked);
    setAgreePrivacyOpt(checked);
    setAgreeEmail(checked);
    setAgreeSms(checked);
  };

  // 이메일 인증번호 발송
  const handleSendEmail = async () => {
    const error = validateEmail(email);
    if (error) {
      setEmailError(error);
      return;
    }
    try {
      await axios.post("http://localhost:80/api/join/send-email-verification", { email });
      setEmailMsg("인증번호가 이메일로 발송되었습니다.");
      setEmailError("");
    } catch (err) {
      setEmailMsg("이메일 발송에 실패했습니다.");
    }
  };

  // 이메일 인증번호 확인
  const handleVerifyToken = async () => {
    const tokenErr = validateToken(emailToken);
    if (tokenErr) {
      setTokenError(tokenErr);
      return;
    }
    try {
      await axios.post("http://localhost:80/api/join/verify-email-token", { email, token: emailToken });
      setIsEmailVerified(true);
      setTokenMsg("이메일 인증이 완료되었습니다.");
      setTokenError("");
    } catch (err) {
      setTokenMsg("인증번호가 올바르지 않습니다.");
    }
  };

  // 가입 처리
  const handleJoin = (e) => {
    e.preventDefault();
    setJoinMsg("");
    setJoinError("");
    // 검증
    const errors = {
      userId: validateUserId(userId),
      password: validatePassword(password),
      userName: validateName(userName),
      birthday: validateBirthday(birthday),
      sex: sex ? "" : "성별을 선택해주세요.",
      email: validateEmail(email),
      token: isEmailVerified ? "" : "이메일 인증을 완료해주세요.",
    };
    setUserIdError(errors.userId);
    setPasswordError(errors.password);
    setNameError(errors.userName);
    setBirthdayError(errors.birthday);
    setSexError(errors.sex);
    setEmailError(errors.email);
    setTokenError(errors.token);
    if (Object.values(errors).some((v) => v)) {
      setJoinError("입력값을 확인해주세요.");
      return;
    }
    if (!agreeAge || !agreeTerms || !agreePrivacy) {
      setJoinError("필수 약관에 동의해주세요.");
      return;
    }
    setJoinMsg("회원가입이 완료되었습니다. 로그인 후 이용해주세요.");
  };

  return (
    <div className="jf-joinform-wrapper">
      <form className="jf-joinform-form" onSubmit={handleJoin}>
        {/* 아이디 */}
        <div className="jf-joinform-field-group">
          <label className="jf-joinform-label">아이디 *</label>
          <input
            type="text"
            className={`jf-joinform-input ${userIdError ? 'error' : ''}`}
            value={userId}
            onChange={e => { setUserId(e.target.value); setUserIdError(validateUserId(e.target.value)); }}
            maxLength={16}
            placeholder="아이디 입력"
          />
          {userIdError && <div className="jf-joinform-error">{userIdError}</div>}
        </div>
        {/* 비밀번호 */}
        <div className="jf-joinform-field-group">
          <label className="jf-joinform-label">비밀번호 *</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <input
              type={showPassword ? "text" : "password"}
              className={`jf-joinform-input ${passwordError ? 'error' : ''}`}
              value={password}
              onChange={e => { setPassword(e.target.value); setPasswordError(validatePassword(e.target.value)); }}
              maxLength={16}
              placeholder="비밀번호 입력"
              style={{ flex: 1 }}
            />
            <button type="button" className="jf-joinform-btn" style={{ minWidth: 60 }} onClick={() => setShowPassword(v => !v)}>{showPassword ? "숨김" : "표시"}</button>
          </div>
          {passwordError && <div className="jf-joinform-error">{passwordError}</div>}
        </div>
        {/* 이름, 생년월일, 성별 */}
        <div className="jf-joinform-field-group" style={{ display: 'flex', gap: 8 }}>
          <div style={{ flex: 2 }}>
            <label className="jf-joinform-label">이름 *</label>
            <input
              type="text"
              className={`jf-joinform-input ${nameError ? 'error' : ''}`}
              value={userName}
              onChange={e => { setUserName(e.target.value); setNameError(validateName(e.target.value)); }}
              maxLength={12}
              placeholder="이름 입력"
            />
            {nameError && <div className="jf-joinform-error">{nameError}</div>}
          </div>
          <div style={{ flex: 2 }}>
            <label className="jf-joinform-label">생년월일(예시: 20000131) *</label>
            <input
              type="text"
              className={`jf-joinform-input ${birthdayError ? 'error' : ''}`}
              value={birthday}
              onChange={e => { setBirthday(e.target.value); setBirthdayError(validateBirthday(e.target.value)); }}
              maxLength={8}
              placeholder="8자리"
            />
            {birthdayError && <div className="jf-joinform-error">{birthdayError}</div>}
          </div>
          <div style={{ flex: 2, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
            <label className="jf-joinform-label">성별 *</label>
            <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
              <label><input type="radio" name="sex" value="M" checked={sex === "M"} onChange={() => setSex("M")} /> 남자</label>
              <label><input type="radio" name="sex" value="W" checked={sex === "W"} onChange={() => setSex("W")} /> 여자</label>
            </div>
            {sexError && <div className="jf-joinform-error">{sexError}</div>}
          </div>
        </div>
        {/* 이메일 */}
        <div className="jf-joinform-field-group">
          <label className="jf-joinform-label">이메일 *</label>
          <input
            type="email"
            className={`jf-joinform-input ${emailError ? 'error' : ''}`}
            value={email}
            onChange={e => { setEmail(e.target.value); setEmailError(validateEmail(e.target.value)); setIsEmailVerified(false); setEmailMsg(""); setTokenMsg(""); }}
            disabled={isEmailVerified}
            placeholder="example@email.com"
          />
          <button
            type="button"
            className="jf-joinform-btn"
            onClick={handleSendEmail}
            disabled={isEmailVerified || !!emailError}
            style={{ marginTop: 6 }}
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
            onChange={e => { setEmailToken(e.target.value.toUpperCase()); setTokenError(""); }}
            disabled={isEmailVerified}
            placeholder="12자리 인증번호"
            maxLength={12}
          />
          <button
            type="button"
            className="jf-joinform-btn"
            onClick={handleVerifyToken}
            disabled={isEmailVerified || !!tokenError}
            style={{ marginTop: 6 }}
          >
            이메일 인증
          </button>
          {tokenError && <div className="jf-joinform-error">{tokenError}</div>}
          {tokenMsg && <div className="jf-joinform-msg">{tokenMsg}</div>}
        </div>
        {/* 약관동의 */}
        <div className="jf-joinform-field-group" style={{ border: '1px solid #e0e0e0', borderRadius: 8, padding: 16, background: '#f8fbff' }}>
          <label style={{ fontWeight: 'bold', marginBottom: 8 }}>
            <input type="checkbox" checked={agreeAll} onChange={handleAgreeAll} /> 전체동의
          </label>
          <div style={{ marginLeft: 16, marginTop: 8, display: 'flex', flexDirection: 'column', gap: 4 }}>
            <label><input type="checkbox" checked={agreeAge} onChange={e => setAgreeAge(e.target.checked)} /> [필수] 만 15세 이상입니다</label>
            <label><input type="checkbox" checked={agreeTerms} onChange={e => setAgreeTerms(e.target.checked)} /> [필수] 이용약관 동의</label>
            <label><input type="checkbox" checked={agreePrivacy} onChange={e => setAgreePrivacy(e.target.checked)} /> [필수] 개인정보 수집 및 이용 동의</label>
            <label><input type="checkbox" checked={agreePrivacyOpt} onChange={e => setAgreePrivacyOpt(e.target.checked)} /> [선택] 개인정보 수집 및 이용 동의</label>
            <label><input type="checkbox" checked={agreeEmail} onChange={e => setAgreeEmail(e.target.checked)} /> [선택] 광고성 정보 이메일 수신 동의</label>
            <label><input type="checkbox" checked={agreeSms} onChange={e => setAgreeSms(e.target.checked)} /> [선택] 광고성 정보 SMS 수신 동의</label>
          </div>
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
        {/* 가입하기 버튼 */}
        <button type="submit" className="jf-joinform-submit">가입하기</button>
      </form>
    </div>
  );
};

export default JoinForm;