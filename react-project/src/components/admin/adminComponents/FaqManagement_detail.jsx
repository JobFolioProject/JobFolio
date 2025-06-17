// FaqManagement_detail.jsx
import React, { useState } from 'react';
import axios from "../../../utils/axiosConfig";
import '../../../css/admin/adminComponents/FaqManagement_detail.css';

const FaqManagementDetail = ({ item, onClose, mode, onSaved, boardType }) => {
  const isEdit = mode === 'edit';
  const isPost = mode === 'post';
  const [isEditing, setIsEditing] = useState(isPost);
  const [editQuestion, setEditQuestion] = useState(item?.question || '');
  const [editAnswer, setEditAnswer] = useState(item?.answer || '');

  const paragraphs = editAnswer.split('\n\n');

  const handleSave = async () => {
    const payload = {
      id : item?.id,
      question : editQuestion,
      answer : editAnswer,
      board_type : boardType
    };

    try {
      if(isEdit) {
        await axios.put('/api/board', payload);
      }else {
        await axios.post('/api/board', payload);
      }

      onSaved();
      onClose();

    }catch (err) {
      console.error('등록 실패:',err);
      alert('등록에 실패했습니다.');
    }
  };

  if (isEdit && !item ) {return null};

  return (
    <div className="detail-overlay" onClick={onClose}>
      <div className="detail-modal" onClick={e => e.stopPropagation()}>
        <button className="detail-close" onClick={onClose}>×</button>

        <div className="detail-header">
          <h3 className="detail-subtitle">제목</h3>
          {isEditing ? (
            <input
              className="detail-input-question"
              value={editQuestion}
              onChange={e => setEditQuestion(e.target.value)}
            />
          ) : (
            <h2 className="detail-title">{item?.question || ''}</h2>
          )}
        </div>

        <div className="detail-body">
          <h3 className="detail-text">내용</h3>
          {isEditing ? (
            <textarea
              className="detail-textarea-answer"
              value={editAnswer}
              onChange={e => setEditAnswer(e.target.value)}
            />
          ) : (
            paragraphs.map((para, idx) => (
              <p key={idx} className="detail-text">{para}</p>
            ))
          )}
        </div>

        <div className="detail-footer">
          {isEdit && (
            <button className="btn-edit" onClick={() => setIsEditing(prev => !prev)}>
              {isEditing ? '취소' : '수정'}
            </button>
          )}
          {isEditing && (
            <button className="btn-save" onClick={handleSave}>
              저장
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FaqManagementDetail;
