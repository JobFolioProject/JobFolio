import React, { useState, useEffect } from "react";
import axios from "../../utils/axiosConfig";
import TemplateSlider from "./TemplateSlider";

const TemplateSelection = ({
  formData,
  setFormData,
  editType,
  setResumeInfo,
  setInitHtmlContent,
  setHtmlContent,
}) => {
  //모든 템플릿 리스트 조회하기. 10개면 10개
  //--> 어떻게 담아올라나 {0:{temp_no:1,temp_nm:g, ...},1:{temp_no:2,temp_nm:h, ...},...10:{temp_no:10,temp_nm:k, ...}} 이런식?
  // 배열 형태의 데이터를 담기 위해서는 tempList 상태를 배열로 초기화하고 관리
  const [tempList, setTempList] = useState([]);
  // 로딩 상태 (API호출 중인지)
  const [isLoading, setIsLoading] = useState(false);
  // 에러 상태 (API 호출 실패시)
  const [error, setError] = useState(null);
  //tempList 자르기.

  const selectAllTemplates = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await axios.get("/api/resume/selectAllTemplates");
      console.log("템플릿 조회 결과:", res);

      // --- 이 부분이 CommuResume에서 가져와야 할 핵심 로직입니다 ---
      const templatesWithHtml = await Promise.all(
        res.map(async (template) => {
          const filePath = `http://localhost:80${template.file_pypath
            .replace(/^.*?resume_output/, "/resumes")
            .replace(/\\/g, "/")}`; // 실제 서버 경로에 맞게 수정
          try {
            const htmlRes = await fetch(filePath);
            const htmlText = await htmlRes.text();
            return { ...template, html: htmlText }; // 템플릿 객체에 HTML 내용 추가
          } catch (e) {
            console.log(`HTML 파일 불러오기 실패: ${filePath}`, e);
            return {
              ...template,
              html: `<p>템플릿을 불러오는 데 실패했습니다.</p>`,
            };
          }
        })
      );
      setTempList(templatesWithHtml); // HTML 내용이 추가된 목록으로 업데이트
      // --- 여기까지 핵심 로직 ---
    } catch (err) {
      console.log("템플릿 조회 중 오류 발생", err);
      setError("템플릿을 불러오는 데 실패했습니다.");
      setTempList([]);
    } finally {
      setIsLoading(false);
    }
  };

  // //xml : select * from tb_template
  // const selectAllTemplates = async() => {
  //     setIsLoading(true); //로딩시작
  //     setError(null); //에러 상태 초기화
  //     await axios.get('/api/resume/selectAllTemplates')
  //     .then((res)=>{
  //         console.log("템플렛 조회 결과:" , res);
  //         setTempList(res); //json 배열 형태로 받아왔으니까 그대로 담아서 넘겨준다<div className=""></div>
  //     })
  //     .catch((err)=>{
  //         console.log("템플릿 조회 중 오류 발생", err);
  //         setError("템플릿을 불러오는 데 실패했습니다.")
  //         setTempList([]); //에러 발생 시 목록은 비우기
  //     })
  //     .finally(()=>{
  //         setIsLoading(false);//로딩 끝.
  //     })
  // }
  //*********아래 테스트를 위해 주석 처리!! 다음에 API통신 되면 풀어줄거임.
  useEffect(() => {
    selectAllTemplates();
    console.log("템플릿 리스트 변경:", tempList);
  }, []);

  return (
    <div className="template-selection-container">
      <h2>템플릿 선택</h2>
      {isLoading && <p>템플릿을 불러오는 중...</p>}
      {error && <p className="error-message">{error}</p>}
      {!isLoading && !error && !tempList.length === 0 && (
        <p>선택 가능한 템플릿이 없습니다.</p>
      )}
      <TemplateSlider
        tempList={tempList}
        formData={formData}
        setFormData={setFormData}
        editType={editType}
        setResumeInfo={setResumeInfo}
        setInitHtmlContent={setInitHtmlContent}
        setHtmlContent={setHtmlContent}
        className="TemplateSlider"
      />
    </div>
  );
};

export default TemplateSelection;
