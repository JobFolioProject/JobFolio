import React, { useEffect, useState, useRef, useCallback } from 'react';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import '../../../css/user/myPageComponent/ValidationMessage.css';

const ValidationMessage = ({ message, duration = 3000 }) => {
  // duration prop으로 사라지는 시간 설정 (기본 3초)
  const [shouldRender, setShouldRender] = useState(false); // 컴포넌트가 DOM에 마운트될지 여부
  const [isCurrentlyVisible, setIsCurrentlyVisible] = useState(false); // 나타나는 애니메이션을 위한 상태
  const [isFadingOut, setIsFadingOut] = useState(false); // 사라지는 애니메이션을 위한 상태

  const appearTimerRef = useRef(null);
  const fadeOutTimerRef = useRef(null);
  const unmountTimerRef = useRef(null);

  // 모든 타이머를 클리어
  const clearAllTimers = useCallback(() => {
    clearTimeout(appearTimerRef.current);
    clearTimeout(fadeOutTimerRef.current);
    clearTimeout(unmountTimerRef.current);
  }, []);

  useEffect(() => {
    clearAllTimers();

    if (message) {
      // 메세지가 props가 새로 생겼을대
      setShouldRender(true);
      setIsFadingOut(false);

      //0ms 딜레이: 컴포넌트가 먼저 DOM에 마운트된 후 'is-visible' 클래스를 적용하여 나타나는 트랜지션 시작
      appearTimerRef.current = setTimeout(() => {
        setIsCurrentlyVisible(true);
      }, 0);

      // 3초 후 페이드 아웃 애니메이션 시작 타이머
      fadeOutTimerRef.current = setTimeout(() => {
        setIsFadingOut(true); // fade-out 클래스 적용 (사라지는 트랜지션 시작)
        setIsCurrentlyVisible(false); // is-visible 클래스 제거 (사라지는 트랜지션의 시작점)

        // CSS 트랜지션 시간 0.5초 후 컴포넌트를 제거하는 타이머
        unmountTimerRef.current = setTimeout(() => {
          setShouldRender(false);
          setIsFadingOut(false);
          setIsCurrentlyVisible(false);
        }, 500);
      }, duration);
    } else {
      // message prop이 비어있으면  ( 부모에서 메세지를 지웠을 경우 , 자동으로 사라짐이 완료 했을 경우)

      // 아직 페이드아웃 애니메이션이 시작되지 않았다면 (isFadingOut이 false),
      // 즉시 페이드아웃 애니메이션을 시작하고 완료 후 제거
      if (shouldRender && isCurrentlyVisible && !isFadingOut) {
        setIsFadingOut(true); // 즉시 페이드아웃 애니메이션 시작
        setIsCurrentlyVisible(false);

        // 페이드아웃 애니메이션 완료 후 DOM에서 제거하는 타이머
        unmountTimerRef.current = setTimeout(() => {
          setShouldRender(false);
          setIsFadingOut(false);
          setIsCurrentlyVisible(false);
        }, 500); // CSS 트랜지션 시간(0.5초)과 동일하게 설정
      } else {
        setShouldRender(false); // (재확인)
        setIsFadingOut(false); // (재확인)
        setIsCurrentlyVisible(false);
      }
      // 만약 isFaidingOut 중이라면 기존 타이머가 끝까지 애니메이션을 진행
    }
    // 컴포넌트 어마운트, massage prop 변경 시 타이머 클리어
    return () => {
      clearAllTimers();
    };
  }, [message, duration, clearAllTimers]);

  // false 이면 아무것도 렌더링 하지 않음(DOM에서 제거)
  if (!shouldRender) {
    return null;
  }

  return (
    <div className={`validationMessage ${isCurrentlyVisible ? 'is-visible' : ''} ${isFadingOut ? 'fade-out' : ''}`}>
      <WarningAmberIcon className="warning-icon" />
      <p>{message}</p>
    </div>
  );
};

export default ValidationMessage;
