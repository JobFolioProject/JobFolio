import React, { useEffect } from 'react';
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
        breakpoint: 1024, // 화면 너비가 1024px 이하일 때 이 설정을 적용
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true, //슬라이드가 끝까지 가면 멈추는 게 아니라 다시 처음으로 돌아가서 무한 루프처럼 반복
          dots: true //슬라이드 아래에 있는 점(dot) 네비게이션을 보여줍니다
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

/////높이 너비 전달을 위해 추가함.////////////////////
    useEffect(() => {
    const handleMessage = (event) => {
      const { type, height, width, tempNo } = event.data;
      if (type === 'iframeSize' && tempNo) {
        const iframe = document.querySelector(`iframe[data-temp-no="${tempNo}"]`);
        if (iframe) {
          iframe.style.height = height;
          iframe.style.width = width;
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

////////////////////////////////////////////////
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
            {/* <div key={template.temp_no} className="template-slide"></div> */}
               {/* <img> 태그로 변경 및 이미지 경로 사용 */}
                {/* <iframe
                  src={template.file_pypath} // 변경된 이미지 경로 사용
                  title={`템플릿 미리보기 ${template.temp_name}`} // 고유한 title 속성 추가
                  alt={`템플릿 미리보기 ${template.temp_name}`}
                  className="template-preview-image" // 이미지 스타일링을 위한 클래스 추가
                  width="100%"
                  height="300px"
                ></iframe> */}
                 <iframe
                  src={`${template.file_pypath}?tempNo=${template.temp_no}`} // tempNo 쿼리 파라미터 추가
                  title={`템플릿 미리보기 ${template.temp_name}`}
                  data-temp-no={template.temp_no} // data 속성은 그대로 유지
                  className="template-preview-image"
                  width="100%"
                  height="300px" // 초기 높이는 여전히 중요하지만, 스크립트가 재정의할 것
// sandbox 속성을 추가하여 iframe 내부 스크립트의 보안을 강화할 수 있습니다.
// 하지만 이 경우 postMessage가 작동하려면 'allow-scripts'와 'allow-same-origin'이 필요합니다.
// sandbox="allow-scripts allow-same-origin"
                ></iframe>
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