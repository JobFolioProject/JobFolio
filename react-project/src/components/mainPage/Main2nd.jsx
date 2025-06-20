import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Parallax, Autoplay } from "swiper/modules";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/parallax";
import '../../css/mainPage/Main2nd.css';
import React, { useRef } from "react";
import { Link } from "react-router-dom";

const slides = [
  {
    id: 1,
    title: "이력서 작성",
    subtitle: "원하는 이력서를 한번에",
    desc: "간편한 양식과 템플릿으로 \n\n 이력서를 빠르게 완성할 수 있어요. \n\n직무에 맞는 템플릿으로 전문가처럼 작성해보세요.   ",
    image: "https://www.tigercampus.com.my/wp-content/uploads/2022/01/iStock-1160804712-2048x1365.jpg.webp",
    url: "/resume/write"
  },
  {
    id: 2,
    title: "면접연습",
    subtitle: "부담되는 면접도 쉽게",
    desc: "처음 면접을 준비하더라도 걱정하지 마세요. \n\n AI가 예상 질문을 제시하고, 답변을 분석해드려요. \n\n  연습할수록 더 나은 면접 준비가 가능합니다.",
    image: "https://images.unsplash.com/photo-1510709657750-f5a80fc8da9c?auto=format&fit=crop&w=1950&q=60",
    url: "/interview"
  },
  {
    id: 3,
    title: "커뮤니티",
    subtitle: "다양한 이력서를 보고싶다면",
    desc: "다양한 이력서는 미래를 바꿀 아이디어가 됩니다. \n\n  경험을 나누고, 이야기로 연결되는 이력서 공간,\n\n  서로의 경험이 더 나은 취업 준비로 이어집니다. ",
    image: "https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FlSLOI%2FbtstfbUsbhO%2FVlSdgkYH7Xxg0yvh2DYkW0%2Fimg.png",
    url: "/community/resume"
  }
];

const Main2nd = () => {
    const isMobile = window.innerWidth < 1200;
    const prevRef = useRef(null);
    const nextRef = useRef(null);

  return (
    <section className="section__slider">
      <div className="container__center">
        <Swiper
          modules={[Navigation, Parallax, Autoplay]}
          onInit={(swiper) => {
            swiper.params.navigation.prevEl = prevRef.current;  
            swiper.params.navigation.nextEl = nextRef.current; 
            swiper.navigation.init();
            swiper.navigation.update();
          }}
          direction="horizontal"
          slidesPerView={1}
          spaceBetween={0}
          speed={isMobile ? 300 : 1500}
          parallax={!isMobile}
          autoplay={{ delay: 3500 }}
          loop={true}
          className="swiper-container"
        >
          {slides.map((slide) => (
            <SwiperSlide key={slide.id}>
              <div className="swiper-slide__block">
                <div
                  className="swiper-slide__block__img"
                  data-swiper-parallax-y="70%"
                >
                  <Link to={slide.url} rel="noreferrer">
                    <img src={slide.image} alt="이미지" />
                  </Link>
                </div>
                <div className="swiper-slide__block__text">
                  <h2 data-swiper-parallax-x="-60%" className="main__title">
                    {slide.title} <span>.</span>
                  </h2>
                  <h3 data-swiper-parallax-x="-50%" className="main__subtitle">
                    {slide.subtitle}
                  </h3>
                  <p data-swiper-parallax-x="-40%" className="paragraphe">
                    {slide.desc.split("\n").map((line, idx) => (
                        <React.Fragment key={idx}>
                        {line}
                        <br />
                        </React.Fragment>
                    ))}
                  </p>
                  <span data-swiper-parallax-y="60%" className="number">
                    {slide.id}
                  </span>
                </div>
              </div>
            </SwiperSlide>
          ))}

          {/* Navigation buttons */}
            <div className="swiper-button-prev" ref={prevRef}>
                <FontAwesomeIcon icon={faArrowLeft} />
            </div>
            <div className="swiper-button-next" ref={nextRef}>
                <FontAwesomeIcon icon={faArrowRight} />
            </div>
        </Swiper>
      </div>
    </section>
  );
};

export default Main2nd;