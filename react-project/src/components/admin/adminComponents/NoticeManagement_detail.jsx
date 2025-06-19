import React, { useState, useEffect, useRef, startTransition } from 'react';
import PropTypes from 'prop-types';
import { useQuill } from 'react-quilljs';
import 'quill/dist/quill.snow.css';
import DOMPurify from 'dompurify';
import axios, { instanceAdmin } from '../../../utils/axiosConfig';
import '../../../css/admin/adminComponents/NoticeManagement_detail.css';

const NoticeManagementDetail = ({ open, mode, onClose, onSaved, onEdit, noticeData }) => {
  if (!open) return null;
  return (
    <NoticeModalContent
      open={open}
      mode={mode}
      onClose={onClose}
      onSaved={onSaved}
      onEdit={onEdit}
      noticeData={noticeData}
    />
  );
};

const NoticeModalContent = ({ open, mode, onClose, onSaved, onEdit, noticeData }) => {
  const isView = mode === 'view';
  const isEdit = mode === 'edit';

  const [title, setTitle] = useState('');
  const [statusYn, setStatusYn] = useState('Y');
  const [loading, setLoading] = useState(false);

  const firstInputRef = useRef(null);

  // Quill 초기화
  const { quill, quillRef } = useQuill({
    theme: 'snow',
    modules: {
      toolbar: isView
        ? false
        : {
            container: [
              [{ header: [1, 2, false] }],
              ['bold', 'italic', 'underline'],
              [{ list: 'ordered' }, { list: 'bullet' }],
              ['link', 'image'],
              ['clean'],
            ],
          },
    },
    formats: ['header', 'bold', 'italic', 'underline', 'list', 'link', 'image'],
    readOnly: isView,
    placeholder: isView ? '' : '내용을 입력하세요...',
  });

  // 이미지 버튼 핸들러 등록
  useEffect(() => {
    if (!quill) return;
    quill.getModule('toolbar').addHandler('image', handleImageUpload);
  }, [quill]);

  // 모달 열림 시 초기화
  useEffect(() => {
    if (!open) return;
    setTitle((isEdit || isView) ? noticeData?.title || '' : '');
    setStatusYn((isEdit || isView) ? noticeData?.statusYn || 'Y' : 'Y');
    quill?.clipboard.dangerouslyPasteHTML(noticeData?.content || '');
    quill?.enable(!isView);
    startTransition(() => firstInputRef.current?.focus());
  }, [open, mode, quill, noticeData, isView, isEdit]);

  const handleClose = () => {
    quill?.blur();
    onClose();
  };

  // 저장 (등록 / 수정)
  const handleSave = async () => {
    setLoading(true);
    try {
      // 1) sanitize
      const clean = DOMPurify.sanitize(quill.root.innerHTML, {
        ALLOWED_TAGS: ['p','br','strong','em','a','ul','ol','li','img','h1','h2'],
        ALLOWED_ATTR: ['src','href','alt','title'],
      });

      // 2) 가상 DOM에 로드
      const container = document.createElement('div');
      container.innerHTML = clean;

      // 3) Base64 이미지만 업로드 후 URL 교체
      const imgEls = Array.from(container.querySelectorAll('img'))
        .filter(img => img.src.startsWith('data:'));
      for (const img of imgEls) {
        const blob = await (await fetch(img.src)).blob();
        const form = new FormData();
        form.append('image', blob, 'upload.png');
        const { url: uploadedUrl } = await instanceAdmin.post(
          '/api/admin/community/upload/image',
          form
        );
        img.src = uploadedUrl;
      }

      // 4) 최종 content
      const finalContent = container.innerHTML;

      // 5) API 호출
      if (isEdit) {
        await axios.put('/api/admin/community/update', {
          boardNo: noticeData.boardNo,
          title: title.trim(),
          content: finalContent,
          statusYn,
        });
      } else {
        await axios.post('/api/admin/community/create', {
          title: title.trim(),
          content: finalContent,
          boardType: 'N',
          statusYn,
        });
      }

      onSaved();
      handleClose();
    } catch (err) {
      console.error(err);
      alert(`${isEdit ? '수정' : '등록'} 중 오류가 발생했습니다.`);
    } finally {
      setLoading(false);
    }
  };

  // 삭제
  const handleDelete = async () => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;
    setLoading(true);
    try {
      await axios.delete('/api/admin/community/delete', {
        params: { boardNo: noticeData.boardNo }
      });
      onSaved();
      handleClose();
    } catch (err) {
      console.error(err);
      alert('삭제 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 이미지 업로드: Base64 삽입
  const handleImageUpload = () => {
    if (!quill) return;
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = () => {
      const file = input.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result;
        const range = quill.getSelection();
        const index = range?.index ?? quill.getLength();
        quill.insertEmbed(index, 'image', base64);
        quill.setSelection(index + 1);
      };
      reader.readAsDataURL(file);
    };
    input.click();
  };

  const canSubmit = title.trim() !== '';

  return (
    <div className="noticeManagementDetail modal-show">
      <div className="modal-overlay" onClick={handleClose}>
        <div
          className="modal-content"
          role="dialog"
          aria-labelledby="modal-title"
          aria-modal="true"
          onClick={e => e.stopPropagation()}
        >
          <button className="modal-close" onClick={handleClose}>×</button>
          <h2 id="modal-title">
            {isEdit ? '공지 수정' : isView ? '공지 내용 보기' : '새 공지 등록'}
          </h2>
          <input
            ref={firstInputRef}
            type="text"
            placeholder="제목을 입력하세요"
            value={title}
            onChange={e => setTitle(e.target.value)}
            disabled={isView}
            className={isView ? 'input-readonly' : ''}
          />
          {isView ? (
            <div
              className="notice-view-content"
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(noticeData.content) }}
            />
          ) : (
            <div ref={quillRef} className="ql-container" />
          )}
          <div className="modal-actions">
            {!isView && (
              <div className="notice-status-select">
                <select
                  value={statusYn}
                  onChange={e => setStatusYn(e.target.value)}
                >
                  <option value="Y">노출</option>
                  <option value="N">숨김</option>
                </select>
              </div>
            )}
            <button className="btn-cancel" onClick={handleClose} disabled={loading}>
              {isView ? '닫기' : '취소'}
            </button>
            {isView ? (
              <>
                <button className="btn-edit" onClick={onEdit} disabled={loading}>수정</button>
                <button className="btn-delete" onClick={handleDelete} disabled={loading}>삭제</button>
              </>
            ) : (
              <button className="btn-save" onClick={handleSave} disabled={!canSubmit || loading}>
                {loading ? '저장 중...' : isEdit ? '수정완료' : '등록'}
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
  onEdit: PropTypes.func.isRequired,
  noticeData: PropTypes.shape({
    boardNo: PropTypes.number,
    title: PropTypes.string,
    content: PropTypes.string,
    statusYn: PropTypes.string,
  }),
};
NoticeManagementDetail.defaultProps = {
  onEdit: () => {},
  noticeData: null,
};

export default NoticeManagementDetail;
