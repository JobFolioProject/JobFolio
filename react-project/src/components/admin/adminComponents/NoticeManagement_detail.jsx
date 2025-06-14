import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { useQuill } from 'react-quilljs';
import 'quill/dist/quill.snow.css';
import DOMPurify from 'dompurify';
import axios from 'axios';
import '../../../css/admin/adminComponents/NoticeManagementModal.css';

const NoticeManagementDetail = ({
  open,
  mode, // 'create' | 'view' | 'edit'
  onClose,
  onSaved,
  noticeData, // edit/view 시 { boardNo, title, body }
}) => {
  const isView = mode === 'view';
  const isEdit = mode === 'edit';

  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const firstInputRef = useRef(null);

  // Quill 초기화
  const { quill, quillRef } = useQuill({
    theme: 'snow',
    modules: {
      toolbar: {
        container: [
          [{ header: [1, 2, false] }],
          ['bold', 'italic', 'underline'],
          [{ list: 'ordered' }, { list: 'bullet' }],
          ['link', 'image'],
          ['clean']
        ],
        handlers: {
          image: () => handleImageUpload()
        }
      }
    },
    formats: [
      'header', 'bold', 'italic', 'underline',
      'list', 'bullet', 'link', 'image'
    ],
    readOnly: isView,
    placeholder: isView ? '' : '내용을 입력하세요...'
  });

  // 모달 열림 시 초기화
  useEffect(() => {
    if (!open) return;

    setTitle((isEdit || isView) ? noticeData?.title || '' : '');
    if (quill) {
      quill.clipboard.dangerouslyPasteHTML(
        (isEdit || isView) ? noticeData?.body || '' : ''
      );
      quill.enable(!isView);
    }

    if (firstInputRef.current) firstInputRef.current.focus();
  }, [open, mode, quill, noticeData, isEdit, isView]);

  // Quill 텍스트 변경 시 body 업데이트
  useEffect(() => {
    if (!quill || isView) return;
    const handler = () => setBody(quill.root.innerHTML);
    quill.on('text-change', handler);
    return () => quill.off('text-change', handler);
  }, [quill, isView]);

  // 이미지 업로드 핸들러
  const handleImageUpload = () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      if (!file) return;

      const formData = new FormData();
      formData.append('image', file);

      try {
        const res = await axios.post('/upload/image', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });

        const imageUrl = res.data.url;
        const range = quill.getSelection();
        quill.insertEmbed(range.index, 'image', imageUrl);
      } catch (err) {
        console.error('이미지 업로드 실패:', err);
        alert('이미지 업로드에 실패했습니다.');
      }
    };
  };

  // 저장/등록 처리
  const handleSave = async () => {
    try {
      const cleanBody = DOMPurify.sanitize(body, {
        ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'a', 'ul', 'ol', 'li', 'img', 'h1', 'h2'],
        ALLOWED_ATTR: ['href', 'src', 'alt', 'title']
      });

      if (isEdit) {
        await axios.put('/community/update', {
          boardNo: noticeData.boardNo,
          title: title.trim(),
          body: cleanBody
        });
      } else {
        await axios.post('/community/create', {
          title: title.trim(),
          body: cleanBody,
          boardType: 'N'
        });
      }
      onSaved();
      onClose();
    } catch (err) {
      console.error(err);
      alert(`${mode === 'edit' ? '수정' : '등록'} 중 오류가 발생했습니다.`);
    }
  };

  // 삭제 처리
  const handleDelete = async () => {
    if (!noticeData?.boardNo) return;
    if (!window.confirm('정말 삭제하시겠습니까?')) return;

    try {
      await axios.delete('/community/delete', {
        params: { boardNo: noticeData.boardNo }
      });
      onSaved();
      onClose();
    } catch (err) {
      console.error('삭제 실패:', err);
      alert('삭제 중 오류가 발생했습니다.');
    }
  };

  const editorLength = quill ? quill.getLength() : 0;
  const canSubmit = title.trim() !== '' && editorLength > 1;

  if (!open) return null;

  return (
    <div className="noticeManagementDetail modal-show">
      <div className="modal-overlay" onClick={onClose}>
        <div
          className="modal-content"
          role="dialog"
          aria-labelledby="modal-title"
          onClick={(e) => e.stopPropagation()}
        >
          <button className="modal-close" onClick={onClose}>×</button>
          <h2 id="modal-title">
            {mode === 'create' && '새 공지 등록'}
            {mode === 'view' && '공지 내용 보기'}
            {mode === 'edit' && '공지 수정'}
          </h2>

          <input
            ref={firstInputRef}
            type="text"
            placeholder="제목을 입력하세요"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={isView}
            className={isView ? 'input-readonly' : ''}
            style={{ width: '100%', margin: '12px 0', padding: '8px' }}
          />

          <div
            ref={quillRef}
            className={isView ? 'ql-readonly' : ''}
            style={{ height: '300px' }}
          />

          <div className="modal-actions">
            <button className="btn-cancel" onClick={onClose}>
              {isView ? '닫기' : '취소'}
            </button>

            {isView ? (
              <button className="btn-delete" onClick={handleDelete}>
                삭제
              </button>
            ) : (
              <button
                className="btn-save"
                onClick={handleSave}
                disabled={!canSubmit}
              >
                {mode === 'create' ? '등록' : '수정완료'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

NoticeManagementDetail.propTypes = {
  open: PropTypes.bool.isRequired,
  mode: PropTypes.oneOf(['create', 'view', 'edit']).isRequired,
  onClose: PropTypes.func.isRequired,
  onSaved: PropTypes.func.isRequired,
  noticeData: PropTypes.shape({
    boardNo: PropTypes.number,
    title: PropTypes.string,
    body: PropTypes.string
  })
};

NoticeManagementDetail.defaultProps = {
  noticeData: null
};

export default NoticeManagementDetail;
