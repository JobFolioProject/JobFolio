import React from 'react';
import Slider from 'react-slick';
import '../../css/resume/TemplateSlider.css'; // 스타일 따로 작성


const TemplateSlider = ({ tempList }) => {
  const settings = {
    dots: true, // 하단에 점으로 페이지네이션 표시
    infinite: true, // 무한 루프
    speed: 500, // 슬라이드 전환 속도
    slidesToShow: 4, // 한 번에 보여줄 슬라이드 개수
    slidesToScroll: 4, // 한 번에 스크롤할 슬라이드 개수
    autoplay: true, // 자동 재생
    autoplaySpeed: 3000, // 자동 재생 간격 (3초)
    cssEase: "linear", // 슬라이드 전환 애니메이션 (선택 사항)
    responsive: [ // 반응형 설정
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };

   return (
    <div className="template-selection-container">
      <h2>템플릿 선택</h2>
      {!tempList || tempList.length === 0 ? (
        <p>선택 가능한 템플릿이 없습니다.</p>
      ) : (
        <div className="template-grid">
          <Slider {...settings}>
            {tempList.map((template) => (
              <div key={template.temp_no} className="template-slide">
                <iframe
                  src={template.file_pypath}
                  title={`template-${template.temp_no}`}
                  width="100%"
                  height="300px"
                  frameBorder="0"
                ></iframe>
              </div>
            ))}
          </Slider>
        </div>
      )}
    </div>
  );
};

export default TemplateSlider;