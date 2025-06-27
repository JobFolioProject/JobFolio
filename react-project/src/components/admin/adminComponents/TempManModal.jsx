import React, {useState} from "react";
import '../../../css/admin/adminComponents/TempManModal.css'; 
import axios from "../../../utils/axiosConfig";
// src>component>admin>admincom>TempManModal.jsx
// src>css>admin>admincom>TempManModal.css

const TempManModal = ({ isModalOpen, onClose, onSaveTempList }) => {
     const [tempInfo, setTempInfo] = useState({
        title:'',
        content:''
     })
       const onSaveTemplate = async () => {
        console.log(tempInfo);
            const dataToSend = {
                title: tempInfo.title,
                content: tempInfo.content
            };
                try {
                    const res = await axios.post('/api/resume/insertTemplateInfo', dataToSend);
                    if (res.result === 1) {
                    const path = res.filePath;
                    alert('템플릿 저장이 완료되었습니다');
                    onSaveTempList();

                    return path;       // ← 여기서 반드시 리턴!
                    } else {
                    alert('템플렛 저장에 실패했습니다.');
                    throw new Error('저장 실패');
                    }
                } catch (err) {
                    console.error(err);
                    throw err;
                    // setTempInfo((prev)=>(
                    //   {
                    //     ...prev,
                    //     title:'',
                    //     content:''
                    //   }
                    // ))
                } finally {
                }
        };

  if (!isModalOpen) {
    return null;
  }

  return (
    <div
      role="presentation"
      // CSS 파일의 클래스 이름을 사용합니다.
      // isModalOpen 상태에 따라 'man-modal-overlay--visible' 클래스를 동적으로 추가/제거합니다.
      className={`man-modal-overlay ${isModalOpen ? 'man-modal-overlay--visible' : ''}`}
      // onClick={onClose} // 뒷 배경 클릭 시 모달 닫기
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
        <h4 className="man-modal-title">템플릿 작성</h4>
        <div className="man-modal-template">
            <label htmlFor="templateTitle" className="man-modal-label">제목:</label>
            <textarea
                // type="text"
                id="templateTitle"
                className="man-modal-input-field"
                placeholder="제목 입력"
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
                onChange={(e)=>setTempInfo((prev)=>({
                    ...prev,
                    content:e.target.value
                }))}
            ></textarea>
        </div>
        <div className="man-modal-btn-container">
          <button 
              className="man-modal-btn-save"
              onClick={() => {
              if(tempInfo.title && tempInfo.content){
                onSaveTemplate(); 
                onClose();
                setTempInfo({});
              }else{
                alert("제목과 내용을 모두 작성해주세요")
              }}} style={{ marginRight: '10px' }}>저장</button> 
          <button className="man-modal-btn-cancel" onClick={onClose} style={{ marginRight: '10px' }}>취소</button>
        </div>
      </section>
    </div>
  );
}

export default TempManModal;