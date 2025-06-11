// FaqManagement_detail.jsx
import React, { useState } from 'react';
import '../../../css/admin/adminComponents/FaqManagement_detail.css';

const FaqManagementDetail = ({ item, onClose, mode }) => {
  const isEdit = mode === 'edit';
  const [isEditing, setIsEditing] = useState(mode === 'post');
  const [editQuestion, setEditQuestion] = useState(item?.question || '');
  const [editAnswer, setEditAnswer] = useState(item?.answer || '');

  const paragraphs = editAnswer.split('\n\n');

  if (!item && mode === 'edit') return null;

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
            <h2 className="detail-title">{editQuestion}</h2>
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
            <button className="btn-save" onClick={() => setIsEditing(false)}>
              저장
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FaqManagementDetail;
