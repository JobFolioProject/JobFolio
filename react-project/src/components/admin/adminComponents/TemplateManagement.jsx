import React, { useState, useEffect, useCallback } from 'react';
import axios from "../../../utils/axiosConfig";
import AdminSideBar from '../AdminSideBar';
import Pagination from '../../common/Pagination.jsx'; 
import Select from '@mui/material/Select'; // Material-UI 사용 시
import MenuItem from '@mui/material/MenuItem'; // Material-UI 사용 시
import TempManModal from './TempManModal.jsx';
import TempModiModal from './TempModiModal.jsx';
import '../../../css/admin/adminComponents/TemplateManagement.css'; 

const TemplateManagement = () => {
  const [tempList, setTempList] = useState([]);
  const [templateNo, setTemplateNo] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;
  const totalPages = Math.ceil(tempList.length / pageSize);
  const startIdx = (currentPage - 1) * pageSize;
  const currentTemplates = tempList.slice(startIdx, startIdx + pageSize);
//모달 열기
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
//저장하기
  const [selected, setSelected] = useState([]);
//삭제하기
  const [delTempList, setDelTempList] = useState([]);

  

    const fetchTemplates = useCallback(async () => { 
      try {
        const res = await axios.get('/api/resume/selectAllTemplates', {
          params: {
            page: currentPage,
            pageSize: pageSize, 
            // 검색 필드 및 검색어 파라미터 제거
            // searchField: searchField,
            // search: searchTerm
            // search: '디자인', // 필요 시 고정 값으로 사용하거나 제거
          },
        });
        console.log('res:', res);

        // HTML 파일 내용을 개별 fetch
        const templatesWithHtml = await Promise.all(
          res.map(async (template) => {
            const filePath = `http://localhost:80${template.file_pypath.replace(/^.*?resume_output/, '/resumes').replace(/\\/g, '/')}`;
            try {
              const htmlRes = await fetch(filePath);
              const htmlText = await htmlRes.text();
              return { ...template, html: htmlText };
            } catch (e) {
              return { ...template, html: `<p>불러오기 실패</p>` };
            }
          })
        );
        setTempList(templatesWithHtml);
      } catch (err) {
        console.error('템플릿 데이터 호출 실패:', err); // 에러 메시지 변경
      }
    }, [currentPage, pageSize]);
    

    useEffect(() => {
      fetchTemplates();
    }, [fetchTemplates]); 
 // 의존성 배열에서 searchTerm, searchField 제거


  
  // 팝업 열기 유틸
  const openResumePopup = (physicalPath) => {
    const path = physicalPath
      .replace(/^.*?resume_output/, '/resumes')
      .replace(/\\/g, '/');
    const url = `http://localhost:80${path}`;
    window.open(url, '_blank', 'width=900,height=700');
  };

  // 삭제 
  const deleteTemplateList = async () =>{
    console.log(selected);
    if (selected.length===0){
      alert("삭제할 템플릿을 선택해주세요");
      return;
    }
    if (!window.confirm("선택한 템플릿을 정말 삭제하시겠습니까?")){
      return;
    }
    
    try {
      const res = await axios.post(`/api/resume/deleteTemplateInfo`,  {resumeNo : selected})
      console.log("삭제 :",res);
      if (Object.keys(res).length === 0){
        alert("삭제되었습니다");
        fetchTemplates();
      }else{
        alert("삭제 실패");
      }
    } catch(err) {
      alert('삭제 중 오류가 발생했습니다.');
    }
  }

  
  const handleToggleSelect = (resumeNo) => {
    setSelected((prev) =>
      prev.includes(resumeNo)
        ? prev.filter((id) => id !== resumeNo)
        : [...prev, resumeNo]
    );
    console.log('templaList', tempList);
  };


  return (
    <div className='templateManagement'>
      <AdminSideBar />
      <div className='info-content'>
        <div className='info-section-title-box'>
          <h2>템플릿 관리</h2> 
        </div>

        <div className='info-section-content-box'>
          <div className='info-header'>
            <h3>템플릿 작성</h3>
            <div className='template-button'>
            <button className= "template-write" onClick={()=>setIsModalOpen(true)}>템플릿 작성</button>   
              <button className= "template-delete" onClick={()=>deleteTemplateList(true)}>템플릿 삭제</button>            
            </div>         
          </div>
        </div>
        <TempManModal
        isModalOpen={isModalOpen}
        onClose={()=>setIsModalOpen(false)}
        onSaveTempList={fetchTemplates}
        />
        <div className="template-template-wrapper">
          {tempList.length === 0 ? (
            <p>선택 가능한 템플릿이 없습니다.</p>
          ) : (
            <>
              <div className="template-template-grid">
                {currentTemplates.map((template) => (

                  <div
                    id={`template-template-grid-${template.template_no}`}
                    key={template.template_no}
                    className="template-card-wrapper"
                  >
                    
                    <div className="template-slide"
                      onClick={() => openResumePopup(template.file_pypath)}>
                      {/* 체크박스 */}
                      
                      <iframe
                        srcDoc={template.html}
                        title={`템플릿 미리보기 ${template.template_name}`}
                        className="template-template-preview-image"
                        width="100%"
                        height="300px"
                        style={{ pointerEvents: 'none' }}
                      ></iframe>

                    </div>
                  
                    <div className="template-info-box">
                      <div className='template-info-container'>
                      <input
                        type="checkbox"
                        className='template-select-checkbox'
                        checked={selected.includes(template.template_no)}
                        onChange={(e) => {
                          e.stopPropagation();
                          handleToggleSelect(template.template_no);}}
                          />   
                      
                    <button 
                    className='template-modify-btn'
                    onClick={()=>{
                      setTemplateNo(template.template_no);
                      setEditModalOpen(true)
                      console.log(templateNo);
                    }}>수정</button>
                    
                    </div>
                  
                      <p><strong>템플릿 번호:</strong> {template.template_no}</p> {/* 텍스트 변경 */}
                      {/* <p><strong>작성일:</strong> {template.create_date ? template.create_date.slice(0, 16) : '날짜 없음'}</p> */}
                      <p><strong>템플릿 이름:</strong> {template.template_name}</p>
                    </div>
                 
                  </div>
                ))}
                <TempModiModal
                        template_no={templateNo}
                        editModalOpen={editModalOpen}
                        onClose={()=>setEditModalOpen(false)}
                        onSaveTempList={fetchTemplates}
                    />
              </div>
            </>
          )}
          {totalPages > 1 && (
            <div className="community-notice-pagination">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                setCurrentPage={setCurrentPage}
              />
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default TemplateManagement;