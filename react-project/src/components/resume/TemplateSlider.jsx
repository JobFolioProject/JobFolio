import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import '../../css/resume/TemplateSlider.css'; // 스타일 따로 작성
import axios from "../../utils/axiosConfig";


const TemplateSlider = ({ tempList, formData }) => {

  const [open, setOpen] = useState(false);
  const [htmlString, setHtmlString] = useState(null);
  const [loading, setLoading] = useState(false);

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

  const resumePreview = async()=>{
    setLoading(true);
    setOpen(true);
    try {
      const res = await axios.get(`/api/resume/template/${tempNo}`);
      setHtmlString(res.html);
    } catch (err) {
      console.error('템플릿 상세 조회 실패', err);
      setHtmlString({ error: '상세 정보를 불러오는 데 실패했습니다.' });
    } finally {
      setLoading(false);
    }

  }

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

//선택된 템플렛 정보.
  const handelSelectTemplate = (template) => {
    console.log('Selected template:', template);
  }

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
              <div id={`template-slide-${template.temp_no}`} key={template.temp_no} className="template-slide"
              onClick={() => {resumePreview(formData)}}>
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
                {/* 투명클릭레이어. 클릭 감지용 투명 오버레이 적용.
                iframe은 다른 도메인의 콘텐츠일 수도 있어서 보안 때문에 부모가 직접 조작하거나 이벤트를 거는 게 불가능. 그래서 이런 식으로 위에 투명 div를 덮어서 "대리로" 클릭을 받는 방식이 널리 쓰임. 
                특히 이미지 미리보기, 비디오 썸네일, 광고 클릭 등에서도 쓰임. */}
                  <div
                      onClick={() => handelSelectTemplate(template)}
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        cursor: 'pointer',
                        zIndex: 10,
                      }}
                ></div>
                  {/* 선택된 템플릿 강조 (예: 테두리 등) */}
                  {selectedTemplate?.temp_no === template.temp_no && (
                    <div
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        border: '3px solid #3b82f6',
                        boxSizing: 'border-box',
                        zIndex: 15,
                        pointerEvents: 'none',
                      }}
                    />
                  )}
              </div>
            ))}
          </Slider>
        </div>
      )}
    </div>
  );
};

export default TemplateSlider;