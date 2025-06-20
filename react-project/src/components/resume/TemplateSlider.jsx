import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import '../../css/resume/TemplateSlider.css'; // 스타일 따로 작성
import axios from "../../utils/axiosConfig";
import ResumePreviewModal from "./ResumePreviewModal"


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

  const resumePreview = async(formData,template_no)=>{
    setLoading(true);
    setOpen(true);
    const dataToSend = {
            ...formData,
            education: [...formData.education, ...formData.newEducation],
            experience: [...formData.experience, ...formData.newExperience],
            template_no: 4,
            newEducation: undefined,
            newExperience: undefined,
            skillList: [...formData.skillList, ...formData.newSkillList],
        };

    try {
      const res = await axios.post("/api/resume/resumePreview", dataToSend);
      const html = res.htmlContent
      setHtmlString(html);
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

////////////////////////////////////////////////
   return (
    <>
    <div className="template-slider-wrapper">
      <h2>템플릿 선택</h2>
      {!tempList || tempList.length === 0 ? (
        <p>선택 가능한 템플릿이 없습니다.</p>
      ) : (
        <div className="template-grid">
          <Slider {...settings}>
            {tempList.map((template) => (
              <div id={`template-slide-${template.temp_no}`} key={template.temp_no} className="template-slide"
              onClick={() => {resumePreview(formData, template.temp_no)}}>
                 <iframe
                  src={`${template.file_pypath}?tempNo=${template.temp_no}`} // tempNo 쿼리 파라미터 추가
                  title={`템플릿 미리보기 ${template.temp_name}`}
                  data-temp-no={template.temp_no} // data 속성은 그대로 유지
                  className="template-preview-image"
                ></iframe>
              </div>
            ))}
          </Slider>
        </div>
      )}
    </div>
    <ResumePreviewModal
        open={open}
        onClose={setOpen}
        loading={loading}
        setLoading={setLoading}
        htmlString={htmlString}
        formData={formData}
      />
    </>
  );
};

export default TemplateSlider;