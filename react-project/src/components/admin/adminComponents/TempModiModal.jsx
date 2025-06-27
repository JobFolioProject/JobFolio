import React, {useState, useEffect} from "react";
import '../../../css/admin/adminComponents/TempManModal.css'; 
import axios from "../../../utils/axiosConfig";
// src>component>admin>admincom>TempManModal.jsx
// src>css>admin>admincom>TempManModal.css

const TempModiModal = ({ template_no, editModalOpen, onClose, onSaveTempList }) => {
    const [tempInfo, setTempInfo] = useState({
        title: '',
        content: ''
      });


// 내일 할 부분.... 결과가 1이면 어쩌고 저쩌고 0이면 저장 안됨.
  const handleSaveEdit = async() => {
    const dataToSend = {
      template_no: template_no,
      title: tempInfo.title,
      content: tempInfo.content
    }
    try{
      const res = await axios.post(`/api/resume/updateTemplateInfo`, dataToSend)
      console.log("res2", res)
      if(res.result === 1){
        alert("수정되었습니다.");
        onSaveTempList();
      }else{
        alert("수정 실패")
      }
    } catch (err) {
      throw err;
    } 
  }

  


  useEffect(() => {
    const fetchTemplate = async () => {
    try {
      const res = await axios.get(`/api/resume/selectOneTemplate`, {params:{template_no:template_no}} );
      console.log("res", res)      


      setTempInfo({
        title: res.template_name,
        content: res.html
      });

    } catch (err) {
      console.error('템플릿 불러오기 실패:', err);
    }
  };

  if (editModalOpen) fetchTemplate();
}, [template_no, editModalOpen]);


  return (
    <div
      role="presentation"
      // CSS 파일의 클래스 이름을 사용합니다.
      // isModalOpen 상태에 따라 'man-modal-overlay--visible' 클래스를 동적으로 추가/제거합니다.
      className={`man-modal-overlay ${editModalOpen ? 'man-modal-overlay--visible' : ''}`}
      onClick={onClose} // 뒷 배경 클릭 시 모달 닫기
      aria-label="모달 뒷 배경"
    >
      <section
        role="dialog"
        aria-modal="true"
        className="man-modal-content" // CSS 파일의 클래스 이름을 사용합니다.
        onClick={e => e.stopPropagation()} // 모달 내부 클릭 시 이벤트 버블링 방지
        onKeyDown={e => {
          if (e.key === 'Enter' || e.key === ' ') e.stopPropagation()
        }}
      >
        <button
          className="man-modal-close-button" // CSS 파일의 클래스 이름을 사용합니다.
          onClick={onClose}
          aria-label="모달 닫기"
        >
          X
        </button>

        <h4 className="man-modal-title">템플릿 수정</h4>
        <div className="man-modal-template">
            <label htmlFor="templateTitle" className="man-modal-label">제목:</label>
            <textarea
                // type="text"
                id="templateTitle"
                className="man-modal-input-field"
                placeholder="제목 입력"
                value={tempInfo.title}
                onChange={(e)=>setTempInfo((prev) => ({
                    ...prev,
                    title : e.target.value
                }))}
            />
        </div>
        <div className="man-modal-template">
            <label htmlFor="templateContent" className="man-modal-label">내용:</label>
            <textarea
                id="templateContent"
                className="man-modal-textarea-field"
                placeholder="내용 입력"
                rows="20"
                value={tempInfo.content}
                onChange={(e)=>setTempInfo((prev)=>({
                    ...prev,
                    content:e.target.value
                }))}
            ></textarea>
        </div>
       <div className="man-modal-btn-container">
          <button className="man-modal-btn-save" onClick={() => {handleSaveEdit(); onClose();}} style={{ marginRight: '10px' }}>저장</button>
          <button className="man-modal-btn-cancel" onClick={onClose} style={{ marginRight: '10px' }}>취소</button>
        </div>
      </section>
    </div>
  );
}

export default TempModiModal;