import React, { useEffect } from 'react';
import Slider from 'react-slick';
import '../../css/resume/TemplateSlider.css'; // 스타일 따로 작성


const TemplateSlider = ({ tempList }) => {
  const settings = {
    dots: true, // 하단에 점으로 페이지네이션 표시
    infinite: true, // 무한 루프
    speed: 500, // 슬라이드 전환 속도
    slidesToShow: 5, // 한 번에 보여줄 슬라이드 개수
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
    <div className="template-slider-wrapper">
      <h2>템플릿 선택</h2>
      {!tempList || tempList.length === 0 ? (
        <p>선택 가능한 템플릿이 없습니다.</p>
      ) : (
        <div className="template-grid">
          <Slider {...settings}>
            {tempList.map((template) => (
              <div id={`template-slide-${template.temp_no}`} key={template.temp_no} className="template-slide">
               {/* <img> 태그로 변경 및 이미지 경로 사용 */}
                <img
                    src={template.file_pypath} // 변경된 이미지 경로 사용
                    alt={`템플릿 미리보기 ${template.temp_name}`}
                    className="template-preview-image" // 이미지 스타일링을 위한 클래스 추가
                />
                {/* 필요하다면 여기에 템플릿 이름을 표시할 수 있습니다 */}
                {/* <p>{template.temp_name}</p> */}
              </div>
            ))}
          </Slider>
        </div>
      )}
    </div>
  );
};

export default TemplateSlider;