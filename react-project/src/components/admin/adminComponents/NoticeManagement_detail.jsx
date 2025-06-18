import React, { useState, useEffect, useRef, startTransition } from 'react';
import PropTypes from 'prop-types';
import { useQuill } from 'react-quilljs';
import 'quill/dist/quill.snow.css';
import DOMPurify from 'dompurify';
import axios, { instanceAdmin } from "../../../utils/axiosConfig";
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
  const [content, setContent] = useState('');
  const [statusYn, setStatusYn] = useState('Y');
  const [loading, setLoading] = useState(false);

  // 신규: 업로드된 파일명 추적
  const [uploadedFiles, setUploadedFiles] = useState([]);

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
            handlers: {},
          },
    },
    formats: ['header', 'bold', 'italic', 'underline', 'list', 'link', 'image'],
    readOnly: isView,
    placeholder: isView ? '' : '내용을 입력하세요...',
  });

  // 이미지 버튼 핸들러 등록
  useEffect(() => {
    if (!quill) return;
    const toolbar = quill.getModule('toolbar');
    toolbar.addHandler('image', handleImageUpload);
  }, [quill]);

  // 모달 열림/모드 변경 시 초기화
  useEffect(() => {
    if (open) {
      const initTitle   = (isEdit || isView) ? noticeData?.title   || '' : '';
      const initContent = (isEdit || isView) ? noticeData?.content || '' : '';
      const initStatus  = (isEdit || isView) ? noticeData?.statusYn|| 'Y': 'Y';

      setTitle(initTitle);
      setContent(initContent);
      setStatusYn(initStatus);

      quill?.clipboard.dangerouslyPasteHTML(initContent);
      quill?.enable(!isView);
      startTransition(() => firstInputRef.current?.focus());
    }
  }, [open, mode, quill, noticeData, isView, isEdit]);

  // 모달 닫힐 때 내부 상태 리셋
  useEffect(() => {
    if (!open) {
      setTitle('');
      setContent('');
      setStatusYn('Y');
      // 업로드 중이던 모든 파일 삭제
      uploadedFiles.forEach(fn => {
        instanceAdmin.delete('/api/admin/community/upload/image', { params: { filename: fn } });
      });
      setUploadedFiles([]);
    }
  }, [open]);

  // Quill 에디터 변경 시 content 동기화
  useEffect(() => {
    if (!quill || isView) return;
    const handler = () => setContent(quill.root.innerHTML);
    quill.on('text-change', handler);
    return () => quill.off('text-change', handler);
  }, [quill, isView]);

  // 모달 닫기
  const handleClose = () => {
    quill?.blur();
    onClose();
  };

  // 저장 (등록 / 수정)
  const handleSave = async () => {
    setLoading(true);
    try {
      // 1) XSS 방지용 sanitize
      const clean = DOMPurify.sanitize(content, {
        ALLOWED_TAGS: ['p','br','strong','em','a','ul','ol','li','img','h1','h2'],
        ALLOWED_ATTR: ['href','src','alt','title'],
      });

      // 2) orphan 파일 정리: 업로드했으나 본문에 남지 않은 파일 삭제
      const usedFiles = Array.from(clean.matchAll(/\/api\/community\/image\/([^"'>]+)/g))
                             .map(m => m[1]);
      const orphanFiles = uploadedFiles.filter(f => !usedFiles.includes(f));
      await Promise.all(
        orphanFiles.map(fn =>
          instanceAdmin.delete('/api/admin/community/delete/image', { params: { filename: fn } })
        )
      );

      // 3) 실제 서버 저장 호출
      if (isEdit) {
        await axios.put('/api/admin/community/update', {
          boardNo: noticeData.boardNo,
          title:   title.trim(),
          content: clean,
          statusYn,
        });
      } else {
        await axios.post('/api/admin/community/create', {
          title:     title.trim(),
          content:   clean,
          boardType: 'N',
          statusYn,
        });
      }

      // 4) parent에게 완료 콜백
      onSaved();
      // 5) cleanup: 업로드 리스트 초기화
      setUploadedFiles([]);
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

  // 이미지 업로드 핸들러
  const handleImageUpload = () => {
    if (!quill) return;

    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';

    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;

      const formData = new FormData();
      formData.append('image', file);

      try {
        // multipart/form-data 로 서버 업로드
        const data = await instanceAdmin.post(
          '/api/admin/community/upload/image',
          formData
        );
        const imageUrl = data.url; 
        const filename = imageUrl.split('/').pop();
        // 업로드된 파일명 추적
        setUploadedFiles(prev => [...prev, filename]);

        // Quill 에디터에 삽입
        const range = quill.getSelection();
        const index = range?.index ?? quill.getLength();
        quill.insertEmbed(index, 'image', imageUrl);
        quill.setSelection(index + 1);
      } catch (err) {
        console.error('이미지 업로드 실패', err);
        alert('이미지 업로드에 실패했습니다.');
      }
    };

    input.click();
  };

  const canSubmit = title.trim() !== '' && quill?.getLength() > 1;

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
            {isEdit ? '공지 수정' : mode === 'view' ? '공지 내용 보기' : '새 공지 등록'}
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
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(content) }}
            />
          ) : (
            <div ref={quillRef} className="ql-container" />
          )}
          <div className="modal-actions">
            {!isView && (
              <div className="notice-status-select">
                <select
                  id="statusYn"
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
  open:      PropTypes.bool.isRequired,
  mode:      PropTypes.oneOf(['create','view','edit']).isRequired,
  onClose:   PropTypes.func.isRequired,
  onSaved:   PropTypes.func.isRequired,
  onEdit:    PropTypes.func.isRequired,
  noticeData: PropTypes.shape({
    boardNo: PropTypes.number,
    title:   PropTypes.string,
    content: PropTypes.string,
    statusYn: PropTypes.string,
  }),
};
NoticeManagementDetail.defaultProps = {
  onEdit:     () => {},
  noticeData: null,
};

export default NoticeManagementDetail;
