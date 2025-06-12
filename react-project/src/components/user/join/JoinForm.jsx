import React, { useState } from "react";
import "../../../css/user/join/JoinForm.css";
import axios from "axios";



const JoinForm = () => {
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

  axios.defaults.withCredentials = true;

  // 이메일 인증번호 발송
  const handleSendEmail = async () => {
    try {
      await axios.post("http://localhost:80/api/join/send-email-verification", {
        email,
      });
      setEmailMsg("인증번호가 이메일로 발송되었습니다.");
    } catch (err) {
      setEmailMsg("이메일 발송에 실패했습니다.");
    }
  };

  // 이메일 인증번호 확인
  const handleVerifyToken = async () => {
    try {
      await axios.post("http://localhost:80/api/join/verify-email-token", {
        email,
        token: emailToken,
      });
      setIsEmailVerified(true);
      setTokenMsg("이메일 인증이 완료되었습니다.");
      setLoginId(email); // 인증된 이메일을 loginId로 자동 입력
    } catch (err) {
      setTokenMsg("인증번호가 올바르지 않습니다.");
    }
  };

  // 회원가입 처리
  const handleJoin = async (e) => {
    e.preventDefault();
    setJoinMsg("");
    setJoinError("");
    if (!isEmailVerified) {
      setJoinError("이메일 인증을 완료해주세요.");
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
        <div className="jf-joinform-field-group">
          <label className="jf-joinform-label">이메일</label>
          <input
            type="email"
            className="jf-joinform-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isEmailVerified}
          />
          <button
            type="button"
            className="jf-joinform-btn"
            onClick={handleSendEmail}
            disabled={isEmailVerified}
          >
            인증번호 발송
          </button>
          {emailMsg && <div className="jf-joinform-msg">{emailMsg}</div>}
        </div>
        <div className="jf-joinform-field-group">
          <label className="jf-joinform-label">인증번호</label>
          <input
            type="text"
            className="jf-joinform-input"
            value={emailToken}
            onChange={(e) => setEmailToken(e.target.value)}
            disabled={isEmailVerified}
          />
          <button
            type="button"
            className="jf-joinform-btn"
            onClick={handleVerifyToken}
            disabled={isEmailVerified}
          >
            이메일 인증
          </button>
          {tokenMsg && <div className="jf-joinform-msg">{tokenMsg}</div>}
        </div>
        <div className="jf-joinform-field-group">
          <label className="jf-joinform-label">이름</label>
          <input
            type="text"
            className="jf-joinform-input"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
        </div>
        <div className="jf-joinform-field-group">
          <label className="jf-joinform-label">비밀번호</label>
          <input
            type="password"
            className="jf-joinform-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="jf-joinform-field-group">
          <label className="jf-joinform-label">성별</label>
          <select
            className="jf-joinform-input"
            value={sex}
            onChange={(e) => setSex(e.target.value)}
          >
            <option value="">선택</option>
            <option value="M">남자</option>
            <option value="W">여자</option>
          </select>
        </div>
        <div className="jf-joinform-field-group">
          <label className="jf-joinform-label">휴대폰번호</label>
          <input
            type="text"
            className="jf-joinform-input"
            value={hp}
            onChange={(e) => setHp(e.target.value)}
          />
        </div>
        <div className="jf-joinform-field-group">
          <label className="jf-joinform-label">생년월일</label>
          <input
            type="text"
            className="jf-joinform-input"
            value={birthday}
            onChange={(e) => setBirthday(e.target.value)}
            placeholder="예: 2000-01-01"
          />
        </div>
        <div className="jf-joinform-field-group">
          <label className="jf-joinform-label">주소</label>
          <input
            type="text"
            className="jf-joinform-input"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>
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
