import React, { useState, useRef, useEffect } from "react";
import "../../../css/user/join/JoinForm.css";
import axios from "../../../utils/axiosConfig";
import { useNavigate } from "react-router-dom";
import SocialLogin from "./SocialLogin";

const JoinForm = () => {
  // 상태 정의
  const [email, setEmail] = useState("");
  const [emailToken, setEmailToken] = useState("");
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [sex, setSex] = useState("");
  const [hp, setHp] = useState("");
  const [birthday, setBirthday] = useState("");
  const [address, setAddress] = useState("");
  const [detailAddress, setDetailAddress] = useState(""); 
  const [emailMsg, setEmailMsg] = useState("");
  const [tokenMsg, setTokenMsg] = useState("");
  const [joinMsg, setJoinMsg] = useState("");
  const [joinError, setJoinError] = useState("");
  
  // 이메일 발송 관련 상태 추가
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);
  const [isEmailSending, setIsEmailSending] = useState(false);
  
  const navigate = useNavigate();

  // 검증 에러 메시지
  const [emailError, setEmailError] = useState("");
  const [tokenError, setTokenError] = useState("");
  const [nameError, setNameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [hpError, setHpError] = useState("");
  const [birthdayError, setBirthdayError] = useState("");
  const [addressError, setAddressError] = useState("");

  // 플로팅 라벨 포커스 상태
  const [focus, setFocus] = useState({
    email: false,
    emailToken: false,
    userName: false,
    password: false,
    hp: false,
    birthday: false,
    address: false,
    detailAddress: false, // 상세주소 포커스 추가
  });

  // 추가: 각 input에 ref 연결
  const emailRef = useRef();
  const nameRef = useRef();
  const passwordRef = useRef();
  const birthdayRef = useRef();
  const hpRef = useRef();
  const addressRef = useRef();

  // 타이머 효과
  useEffect(() => {
    let timer;
    if (remainingTime > 0) {
      timer = setInterval(() => {
        setRemainingTime((prev) => {
          if (prev <= 1) {
            setIsEmailSent(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [remainingTime]);

  // 시간 포맷팅 함수
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // 검증 함수
  const validateEmail = (value) => {
    if (!value) return "이메일을 입력해주세요.";
    if (value.length > 50) return "이메일은 50자 이하로 입력해주세요.";
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(value))
      return "올바른 이메일 형식이 아닙니다. (특수문자는 @, ., _, - 만 허용)";
    return "";
  };
  const validateToken = (value) => {
    if (!value) return "인증번호를 입력해주세요.";
    if (value.length !== 12) return "인증번호는 12자리입니다.";
    const tokenRegex = /^[a-zA-Z0-9]{12}$/;
    if (!tokenRegex.test(value))
      return "인증번호는 영문과 숫자만 입력 가능합니다.";
    return "";
  };
  const validateName = (value) => {
    if (!value) return "이름을 입력해주세요.";
    if (value.length > 20) return "이름은 20자 이하로 입력해주세요.";
    const nameRegex = /^[a-zA-Z가-힣\s]+$/;
    if (!nameRegex.test(value)) return "이름은 한글과 영문만 입력 가능합니다.";
    return "";
  };
  const validatePassword = (value) => {
    if (!value) return "비밀번호를 입력해주세요.";
    if (value.length < 4) return "비밀번호는 4자 이상이어야 합니다.";
    if (value.length > 100) return "비밀번호는 100자 이하로 입력해주세요.";
    return "";
  };
  const formatPhoneNumber = (value) => {
    const numbers = value.replace(/[^0-9]/g, "");
    if (numbers.length <= 3) return numbers;
    else if (numbers.length <= 7)
      return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    else if (numbers.length <= 11)
      return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(
        7
      )}`;
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(
      7,
      11
    )}`;
  };
  const validatePhone = (value) => {
    if (!value) return "휴대폰번호를 입력해주세요.";
    const numbers = value.replace(/[^0-9]/g, "");
    if (!numbers.startsWith("010"))
      return "010으로 시작하는 번호만 입력 가능합니다.";
    if (numbers.length !== 11) return "휴대폰번호는 11자리여야 합니다.";
    if (value.length > 15) return "형식이 올바르지 않습니다.";
    return "";
  };
  const formatBirthday = (value) => {
    const numbers = value.replace(/[^0-9]/g, "");
    if (numbers.length <= 4) return numbers;
    else if (numbers.length <= 6)
      return `${numbers.slice(0, 4)}-${numbers.slice(4)}`;
    else if (numbers.length <= 8)
      return `${numbers.slice(0, 4)}-${numbers.slice(4, 6)}-${numbers.slice(
        6
      )}`;
    return `${numbers.slice(0, 4)}-${numbers.slice(4, 6)}-${numbers.slice(
      6,
      8
    )}`;
  };
  const validateBirthday = (value) => {
    if (!value) return "생년월일을 입력해주세요.";
    const numbers = value.replace(/[^0-9]/g, "");
    if (numbers.length !== 8) return "생년월일은 8자리로 입력해주세요.";
    const year = parseInt(numbers.slice(0, 4));
    const month = parseInt(numbers.slice(4, 6));
    const day = parseInt(numbers.slice(6, 8));
    const now = new Date();
    const currentYear = now.getFullYear();
    if (year < currentYear - 100 || year > currentYear)
      return "올바른 연도를 입력해주세요.";
    if (month < 1 || month > 12) return "올바른 월을 입력해주세요.";
    if (day < 1 || day > 31) return "올바른 일을 입력해주세요.";
    const inputDate = new Date(year, month - 1, day);
    if (
      inputDate.getFullYear() !== year ||
      inputDate.getMonth() !== month - 1 ||
      inputDate.getDate() !== day
    )
      return "유효하지 않은 날짜입니다.";
    if (inputDate > now) return "올바른 날짜를 입력해주세요.";
    return "";
  };
  
  // 새로운 함수 추가: YYYYMMDD → YYYY-MM-DD 변환
  const formatBirthdayForServer = (birthday) => {
    const numbers = birthday.replace(/[^0-9]/g, "");
    if (numbers.length === 8) {
      return `${numbers.slice(0, 4)}-${numbers.slice(4, 6)}-${numbers.slice(6, 8)}`;
    }
    return birthday;
  };
  const validateAddress = (value) => {
    if (!value) return "주소를 입력해주세요.";
    if (value.length > 500) return "주소는 500자 이하로 입력해주세요.";
    return "";
  };

  // 다음 주소 검색 함수
  const handleAddressSearch = () => {
    new window.daum.Postcode({
      oncomplete: function (data) {
        // 선택한 주소 정보
        let fullAddress = data.roadAddress; // 도로명 주소

        // 건물명이 있으면 추가
        if (data.buildingName) {
          fullAddress += ` (${data.buildingName})`;
        }

        // 우편번호 포함
        fullAddress = `(${data.zonecode}) ${fullAddress}`;

        setAddress(fullAddress);
        setAddressError(""); // 에러 초기화

        console.log("선택된 주소:", fullAddress);
      },
    }).open();
  };

  // 입력 핸들러 (검증 포함)
  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    if (!value) {
      setEmailError("");
    } else {
      const error = validateEmail(value);
      setEmailError(error === "이메일을 입력해주세요." ? "" : error);
    }
    // 이메일이 변경되면 인증 상태 초기화
    if (isEmailVerified) {
      setIsEmailVerified(false);
      setTokenMsg("");
    }
    if (isEmailSent) {
      setIsEmailSent(false);
      setRemainingTime(0);
      setEmailMsg("");
    }
    if (isEmailSending) {
      setIsEmailSending(false);
    }
  };
  const handleTokenChange = (e) => {
    const value = e.target.value.toUpperCase();
    setEmailToken(value);
    setTokenError(validateToken(value));
  };
  const handleNameChange = (e) => {
    const value = e.target.value;
    setUserName(value);
    if (!value) {
      setNameError("");
    } else {
      const error = validateName(value);
      setNameError(error === "이름을 입력해주세요." ? "" : error);
    }
  };
  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    if (!value) {
      setPasswordError("");
    } else {
      const error = validatePassword(value);
      setPasswordError(error === "비밀번호를 입력해주세요." ? "" : error);
    }
  };
  const handlePhoneChange = (e) => {
    const formatted = formatPhoneNumber(e.target.value);
    setHp(formatted);
    if (!formatted) {
      setHpError("");
    } else {
      const error = validatePhone(formatted);
      setHpError(error === "휴대폰번호를 입력해주세요." ? "" : error);
    }
  };
  const formatPhoneForServer = (phone) => {
    return phone.replace(/[^0-9]/g, "");
  };
  const handleBirthdayChange = (e) => {
    const formatted = formatBirthday(e.target.value);
    setBirthday(formatted);
    if (!formatted) {
      setBirthdayError("");
    } else {
      const error = validateBirthday(formatted);
      setBirthdayError(error === "생년월일을 입력해주세요." ? "" : error);
    }
  };
  const handleDetailAddressChange = (e) => {
    setDetailAddress(e.target.value);
  };

  // 이메일 인증번호 발송
  const handleSendEmail = async () => {
    // 1. 이메일이 비어있으면 바로 리턴
    if (!email) return;
    
    // 2. 이메일 형식 검증
    const error = validateEmail(email);
    if (error) {
      setEmailError(error);
      return;
    }
    
    // 3. 발송 상태 설정
    setIsEmailSending(true); 
    setEmailMsg(""); 
    setEmailError(""); 
    
    try {
      const response = await axios.post("http://localhost:80/api/join/send-email-verification", {
        email,
      });
      
      if (response.result === "Y") {
        setEmailMsg("인증이메일을 발송했습니다");
        setEmailError("");
        setIsEmailSent(true);
        setRemainingTime(300); // 5분 = 300초
      } else {
        setEmailMsg("");
        setEmailError(response.message || "이메일 발송에 실패했습니다.");
      }
    } catch (err) {
      // 5. 서버 에러 응답 처리
      const errorMessage = err.response?.data?.message || 
                          err.response?.message || 
                          "이메일 발송에 실패했습니다.";
      setEmailError("");
      setEmailMsg(errorMessage);
    } finally {
      setIsEmailSending(false);
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
      await axios.post("http://localhost:80/api/join/verify-email-token", {
        email,
        token: emailToken,
      });
      setIsEmailVerified(true);
      setTokenMsg("이메일 인증이 완료되었습니다.");
      setTokenError("");
      setIsEmailSent(false);
      setRemainingTime(0);
    } catch (err) {
      setTokenMsg("인증번호가 올바르지 않습니다.");
    }
  };

  // 회원가입 처리 
  const handleJoin = async (e) => {
    e.preventDefault();
    setJoinMsg("");
    setJoinError("");

    // 전체 주소 = 기본주소 + 상세주소
    const fullAddress = detailAddress ? `${address} ${detailAddress}` : address;

    // 모든 필드 검증
    const errors = {
      email: validateEmail(email),
      name: validateName(userName),
      password: validatePassword(password),
      phone: validatePhone(hp),
      birthday: validateBirthday(birthday),
      address: validateAddress(fullAddress),
    };
    // 포커스 이동을 위한 ref 배열
    const refs = [
      emailRef,
      nameRef,
      passwordRef,
      birthdayRef,
      hpRef,
      addressRef,
    ];
    const errorOrder = [
      errors.email,
      errors.name,
      errors.password,
      errors.birthday,
      errors.phone,
      errors.address,
    ];
    // 가장 먼저 빈값인 input에 포커스 이동
    for (let i = 0; i < errorOrder.length; i++) {
      if (
        errorOrder[i] &&
        (errorOrder[i].includes("입력해주세요.") ||
          errorOrder[i].includes("선택"))
      ) {
        if (refs[i] && refs[i].current) refs[i].current.focus();
        break;
      }
    }
    // 이메일이 비어있으면 이때만 에러 메시지 띄움
    if (!email) setEmailError("이메일을 입력해주세요.");
    else if (errors.email && errors.email !== "이메일을 입력해주세요.")
      setEmailError(errors.email);
    else setEmailError("");
    if (!userName) setNameError("이름을 입력해주세요.");
    else if (errors.name && errors.name !== "이름을 입력해주세요.")
      setNameError(errors.name);
    else setNameError("");
    if (!password) setPasswordError("비밀번호를 입력해주세요.");
    else if (errors.password && errors.password !== "비밀번호를 입력해주세요.")
      setPasswordError(errors.password);
    else setPasswordError("");
    if (!birthday) setBirthdayError("생년월일을 입력해주세요.");
    else if (errors.birthday && errors.birthday !== "생년월일을 입력해주세요.")
      setBirthdayError(errors.birthday);
    else setBirthdayError("");
    if (!hp) setHpError("휴대폰번호를 입력해주세요.");
    else if (errors.phone && errors.phone !== "휴대폰번호를 입력해주세요.")
      setHpError(errors.phone);
    else setHpError("");
    if (!fullAddress) setAddressError("주소를 입력해주세요.");
    else if (errors.address && errors.address !== "주소를 입력해주세요.")
      setAddressError(errors.address);
    else setAddressError("");
    if (Object.values(errors).some((error) => error)) {
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
        login_id: email,
        user_name: userName, 
        password,
        sex,
        hp: formatPhoneForServer(hp),
        birthday: formatBirthdayForServer(birthday),
        address: fullAddress, 
      });
      setJoinMsg("회원가입이 완료되었습니다. 로그인 후 이용해주세요.");
      navigate("/");
    } catch (err) {
      setJoinError("회원가입에 실패했습니다. 입력값을 확인해주세요.");
    }
  };

  return (
    <div className="jf-joinform-wrapper">
      <h2 className="jf-joinform-title">
        회원가입하고 다양한 혜택을 누리세요!
      </h2>
    <SocialLogin 
      title="소셜로 간편하게 로그인하세요"
      providers={['naver', 'kakao', 'google']}
      size="large"
      showDivider={true}
    />
      <form className="jf-joinform-form" onSubmit={handleJoin}>
        {/* 이메일 + 인증번호 발송 */}
        <div className="jf-joinform-field-group email-row">
          <div className="floating-input-wrap">
            <input
              type="email"
              className={`jf-joinform-input floating-input${
                email ? " has-value" : ""
              }${emailError ? " error" : ""}`}
              value={email}
              onChange={handleEmailChange}
              onFocus={() => setFocus((f) => ({ ...f, email: true }))}
              onBlur={() => setFocus((f) => ({ ...f, email: false }))}
              disabled={isEmailVerified}
              autoComplete="off"
              ref={emailRef}
            />
            <label
              className={`floating-label${
                focus.email || email ? " active" : ""
              }`}
            >
              이메일
            </label>
            {emailError && (
              <div className="jf-joinform-tooltip-error">{emailError}</div>
            )}
          </div>
          <button
            type="button"
            className="jf-joinform-btn email-btn"
            onClick={handleSendEmail}
            disabled={isEmailVerified || !!emailError || isEmailSending}
          >
            {isEmailSending 
              ? "발송중..." 
              : (isEmailSent && remainingTime > 0 && !isEmailSending)
              ? `재발송(${formatTime(remainingTime)})` 
              : "인증번호 발송"
            }
          </button>
        </div>
        {emailMsg && <div className="jf-joinform-msg">{emailMsg}</div>}
        {/* 인증번호 + 인증버튼 */}
        <div className="jf-joinform-field-group email-row">
          <div className="floating-input-wrap">
            <input
              type="text"
              className={`jf-joinform-input floating-input${
                emailToken ? " has-value" : ""
              }${tokenError ? " error" : ""}`}
              value={emailToken}
              onChange={handleTokenChange}
              onFocus={() => setFocus((f) => ({ ...f, emailToken: true }))}
              onBlur={() => setFocus((f) => ({ ...f, emailToken: false }))}
              disabled={isEmailVerified}
              maxLength={12}
              autoComplete="off"
            />
            <label
              className={`floating-label${
                focus.emailToken || emailToken ? " active" : ""
              }`}
            >
              인증번호
            </label>
            {tokenError && (
              <div className="jf-joinform-tooltip-error">{tokenError}</div>
            )}
          </div>
          <button
            type="button"
            className="jf-joinform-btn email-btn"
            onClick={handleVerifyToken}
            disabled={isEmailVerified || !!tokenError}
          >
            이메일 인증
          </button>
        </div>
        {tokenMsg && <div className="jf-joinform-msg">{tokenMsg}</div>}
        <div className="jf-joinform-field-group">
          <div className="floating-input-wrap">
            <input
              type="text"
              className={`jf-joinform-input floating-input${
                userName ? " has-value" : ""
              }${nameError ? " error" : ""}`}
              value={userName}
              onChange={handleNameChange}
              onFocus={() => setFocus((f) => ({ ...f, userName: true }))}
              onBlur={() => setFocus((f) => ({ ...f, userName: false }))}
              autoComplete="off"
              ref={nameRef}
            />
            <label
              className={`floating-label${
                focus.userName || userName ? " active" : ""
              }`}
            >
              이름
            </label>
            {nameError && (
              <div className="jf-joinform-tooltip-error">{nameError}</div>
            )}
          </div>
        </div>
        <div className="jf-joinform-field-group">
          <div className="floating-input-wrap">
            <input
              type="password"
              className={`jf-joinform-input floating-input${
                password ? " has-value" : ""
              }${passwordError ? " error" : ""}`}
              value={password}
              onChange={handlePasswordChange}
              onFocus={() => setFocus((f) => ({ ...f, password: true }))}
              onBlur={() => setFocus((f) => ({ ...f, password: false }))}
              autoComplete="off"
              ref={passwordRef}
            />
            <label
              className={`floating-label${
                focus.password || password ? " active" : ""
              }`}
            >
              비밀번호
            </label>
            {passwordError && (
              <div className="jf-joinform-tooltip-error">{passwordError}</div>
            )}
          </div>
        </div>
        <div className="jf-joinform-field-group flex-row">
          <div className="floating-input-wrap" style={{ flex: 2 }}>
            <input
              type="text"
              className={`jf-joinform-input floating-input${
                birthday ? " has-value" : ""
              }${birthdayError ? " error" : ""}`}
              value={birthday}
              onChange={handleBirthdayChange}
              onFocus={() => setFocus((f) => ({ ...f, birthday: true }))}
              onBlur={() => setFocus((f) => ({ ...f, birthday: false }))}
              placeholder=""
              autoComplete="off"
              ref={birthdayRef}
            />
            <label
              className={`floating-label${
                focus.birthday || birthday ? " active" : ""
              }`}
            >
              생년월일(예시: 20000131)
            </label>
            {birthdayError && (
              <div className="jf-joinform-tooltip-error">{birthdayError}</div>
            )}
          </div>
          <div className="gender-box-wrap" style={{ flex: 1 }}>
            <button
              type="button"
              className={`gender-box${sex === "M" ? " gender-selected" : ""}`}
              onClick={() => setSex("M")}
            >
              남자
            </button>
            <button
              type="button"
              className={`gender-box${sex === "W" ? " gender-selected" : ""}`}
              onClick={() => setSex("W")}
            >
              여자
            </button>
          </div>
        </div>
        {joinError === "성별을 선택해주세요." && (
          <div className="jf-joinform-tooltip-error">성별을 선택해주세요.</div>
        )}
        <div className="jf-joinform-field-group">
          <div className="floating-input-wrap">
            <input
              type="text"
              className={`jf-joinform-input floating-input${
                hp ? " has-value" : ""
              }${hpError ? " error" : ""}`}
              value={hp}
              onChange={handlePhoneChange}
              onFocus={() => setFocus((f) => ({ ...f, hp: true }))}
              onBlur={() => setFocus((f) => ({ ...f, hp: false }))}
              placeholder=""
              autoComplete="off"
              ref={hpRef}
            />
            <label
              className={`floating-label${focus.hp || hp ? " active" : ""}`}
            >
              휴대폰번호
            </label>
            {hpError && (
              <div className="jf-joinform-tooltip-error">{hpError}</div>
            )}
          </div>
        </div>
        <div className="jf-joinform-field-group email-row">
          <div className="floating-input-wrap">
            <input
              type="text"
              className={`jf-joinform-input floating-input${
                address ? " has-value" : ""
              }${addressError ? " error" : ""}`}
              value={address}
              onFocus={() => setFocus((f) => ({ ...f, address: true }))}
              onBlur={() => setFocus((f) => ({ ...f, address: false }))}
              placeholder=""
              readOnly 
              onClick={handleAddressSearch} 
              autoComplete="off"
              ref={addressRef}
            />
            <label
              className={`floating-label${
                focus.address || address ? " active" : ""
              }`}
            >
              주소
            </label>
            {addressError && (
              <div className="jf-joinform-tooltip-error">{addressError}</div>
            )}
          </div>
          <button
            type="button"
            className="jf-joinform-btn email-btn"
            onClick={handleAddressSearch}
          >
            주소 검색
          </button>
        </div>

        {/* 상세주소 (주소가 선택된 경우에만 표시) */}
        {address && (
          <div className="jf-joinform-field-group">
            <div className="floating-input-wrap">
              <input
                type="text"
                className={`jf-joinform-input floating-input${
                  detailAddress ? " has-value" : ""
                }`}
                value={detailAddress}
                onChange={handleDetailAddressChange}
                onFocus={() => setFocus((f) => ({ ...f, detailAddress: true }))}
                onBlur={() => setFocus((f) => ({ ...f, detailAddress: false }))}
                placeholder=""
                autoComplete="off"
              />
              <label
                className={`floating-label${
                  focus.detailAddress || detailAddress ? " active" : ""
                }`}
              >
                상세주소 (선택사항)
              </label>
            </div>
          </div>
        )}

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
        <button type="submit" className="jf-joinform-btn email-btn">
          회원가입
        </button>
      </form>
    </div>
  );
};

export default JoinForm;