import React, { useState, useRef, useEffect } from "react";

import '../../css/mainPage/Mainpage.css';



const MainPage = () => {
  const [curSlide, setCurSlide] = useState(1);
  const [isAnimating, setIsAnimating] = useState(true);
  const appRef = useRef(null);

  const goToSlide = (target) => {
    if (isAnimating || target === curSlide) return;
    setIsAnimating(true);

    const next = target;
    const prev = curSlide;

    appRef.current.classList.toggle("active");
    setCurSlide(next);

    setTimeout(() => {
      setIsAnimating(false);
    }, 3000);
  };

  const handleWheel = (e) => {
    if (isAnimating) return;
    const delta = e.deltaY || e.detail || e.wheelDelta;

    if (delta < 0 && curSlide > 1) {
      goToSlide(curSlide - 1);
    } else if (delta > 0 && curSlide < 2) {
      goToSlide(curSlide + 1);
    }
  };

  useEffect(() => {
  const timer1 = setTimeout(() => {
    appRef.current.classList.add("initial");
  }, 1500);
  const timer2 = setTimeout(() => setIsAnimating(false), 4500);

  const handleWheel = (e) => {
    if (isAnimating) return;

    const delta = e.deltaY || e.detail || e.wheelDelta;

    // 🔽 슬라이드 아래로 (curSlide === 1 -> 2)
    if (delta > 0 && curSlide < 2) {
      goToSlide(curSlide + 1);
    }

    // 🔼 슬라이드 위로 (Main2nd → MainPage 복귀)
    else if (delta < 0 && curSlide === 2) {
      if (window.scrollY === 0) {
        goToSlide(curSlide - 1);
      }
    }
  };

  window.addEventListener("wheel", handleWheel, { passive: true });

  return () => {
    clearTimeout(timer1);
    clearTimeout(timer2);
    window.removeEventListener("wheel", handleWheel);
  };
}, [curSlide, isAnimating]);

useEffect(() => {
  if (curSlide === 2 && !isAnimating) {
    document.body.style.overflow = "auto"; // ✅ 아래로 스크롤 가능
  } else {
    document.body.style.overflow = "hidden"; // ✅ 스크롤 막기
  }

  return () => {
    document.body.style.overflow = "auto"; // ✅ 컴포넌트 제거 시 복원
  };
}, [curSlide, isAnimating]);

  return (
    <div className="cont">
      <div className="app" ref={appRef}>
        <div className="app__bgimg">
          <div className="app__bgimg-image app__bgimg-image--1"></div>
          <div className="app__bgimg-image app__bgimg-image--2"></div>
        </div>

        <div className="app__img">
          <img
            onMouseDown={(e) => e.preventDefault()}
            src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/537051/whiteTest4.png"
            alt="city"
          />
        </div>

        <div className={`app__text app__text--1 ${curSlide === 1 ? "visible" : ""}`}>
          <div className="app__text-line app__text-line--4">Create </div>
          <div className="app__text-line app__text-line--3">your future</div>
          <div className="app__text-line app__text-line--2">당신의 미래를 작성하세요</div>
          <div className="app__text-line app__text-line--1">
            <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/537051/opus-attachment.png" alt="" />
          </div>
        </div>

        <div className={`app__text app__text--2 ${curSlide === 2 ? "visible" : ""}`}>
          <div className="app__text-line app__text-line--4">FIND</div>
          <div className="app__text-line app__text-line--3">YOUR STORY</div>
          <div className="app__text-line app__text-line--2">경력은 기록이 아닌, 여정입니다.</div>
          <div className="app__text-line app__text-line--1">
            <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/537051/opus-attachment.png" alt="" />
          </div>
        </div>
      </div>

      <div className="pages">
        <ul className="pages__list">
          {[1, 2].map((page) => (
            <li
              key={page}
              data-target={page}
              className={`pages__item pages__item--${page} ${
                curSlide === page ? "page__item-active" : ""
              }`}
              onClick={() => goToSlide(page)}
            ></li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MainPage;