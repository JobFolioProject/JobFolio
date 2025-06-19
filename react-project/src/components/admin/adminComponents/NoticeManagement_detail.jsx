import React, { useState, useEffect, useRef, startTransition } from 'react';
import PropTypes from 'prop-types';
import { useQuill } from 'react-quilljs';
import Quill from 'quill';
import { ImageDrop } from 'quill-image-drop-module';
import ImageResize from 'quill-image-resize';
import 'quill/dist/quill.snow.css';
import DOMPurify from 'dompurify';
import axios, { instanceAdmin } from '../../../utils/axiosConfig';
import '../../../css/admin/adminComponents/NoticeManagement_detail.css';

// Quill 모듈 등록
Quill.register('modules/imageDrop', ImageDrop);
Quill.register('modules/imageResize', ImageResize);

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
  const origIdxRef = useRef(null);

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
              ['link', 'image', { align: [] }],
              ['clean'],
            ],
          },
      imageDrop: true,
      imageResize: {},
    },
    formats: [
      'header', 'bold', 'italic', 'underline',
      'list', 'link', 'image', 'align',
    ],
    readOnly: isView,
    placeholder: isView ? '' : '내용을 입력하세요...',
  });

  useEffect(() => {
    if (!quill) return;
    const editor = quill.root;
    quill.getModule('toolbar').addHandler('image', handleImageUpload);

    const onDragStart = e => {
      if (e.target.tagName === 'IMG') {
        e.dataTransfer.setData('text/plain', e.target.src);
        origIdxRef.current = quill.getIndex(Quill.find(e.target));
      }
    };
    const onDrop = e => {
      e.preventDefault();
      const sel = quill.getSelection();
      const idx = sel?.index ?? quill.getLength();

      if (e.dataTransfer.files?.length) {
        const reader = new FileReader();
        reader.onload = () => {
          quill.insertEmbed(idx, 'image', reader.result);
          quill.setSelection(idx + 1);
        };
        reader.readAsDataURL(e.dataTransfer.files[0]);
        return;
      }

      const src = e.dataTransfer.getData('text/plain');
      if (src) {
        quill.insertEmbed(idx, 'image', src);
        quill.setSelection(idx + 1);
        const old = origIdxRef.current;
        if (old != null) {
          const del = old < idx ? old : old + 1;
          quill.deleteText(del, 1);
        }
        origIdxRef.current = null;
      }
    };

    editor.addEventListener('dragstart', onDragStart);
    editor.addEventListener('drop', onDrop);
    return () => {
      editor.removeEventListener('dragstart', onDragStart);
      editor.removeEventListener('drop', onDrop);
    };
  }, [quill]);

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

  const handleSave = async () => {
    setLoading(true);
    try {
      // 먼저 실제 DOM에서 이미지 style 강제 반영
      const editorImages = quill.root.querySelectorAll('img');
      editorImages.forEach(img => {
        const width = img.style.width || img.width ? `${img.width}px` : '';
        const height = img.style.height || img.height ? `${img.height}px` : '';
        if (width || height) {
          img.setAttribute('style', `width:${width}; height:${height};`);
        }
      });

      // 이후 HTML을 추출
      const cleanHtml = DOMPurify.sanitize(quill.root.innerHTML, {
        ALLOWED_ATTR: ['style', 'src', 'href', 'alt', 'title'],
        ADD_ATTR: ['style'],
      });

      const wrapper = document.createElement('div');
      wrapper.innerHTML = cleanHtml;

      // Base64 이미지 업로드 처리
      for (const img of wrapper.querySelectorAll('img')) {
        if (img.src.startsWith('data:')) {
          const blob = await (await fetch(img.src)).blob();
          const form = new FormData();
          form.append('image', blob, 'upload.png');
          const { url } = await instanceAdmin.post(
            '/api/admin/community/upload/image', form
          );
          img.src = url;
        }
      }

      const payload = {
        title: title.trim(),
        content: wrapper.innerHTML,
        statusYn,
        ...(isEdit ? { boardNo: noticeData.boardNo } : { boardType: 'N' }),
      };

      if (isEdit) {
        await axios.put('/api/admin/community/update', payload);
      } else {
        await axios.post('/api/admin/community/create', payload);
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
        const idx = quill.getSelection()?.index ?? quill.getLength();
        quill.insertEmbed(idx, 'image', reader.result);
        quill.setSelection(idx + 1);
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
          aria-modal="true"
          onClick={e => e.stopPropagation()}
        >
          <button className="modal-close" onClick={handleClose}>×</button>
          <h2>
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
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(noticeData?.content || '')
              }}
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
            <button
              className="btn-cancel"
              onClick={handleClose}
              disabled={loading}
            >
              {isView ? '닫기' : '취소'}
            </button>
            {isView ? (
              <>
                <button className="btn-edit" onClick={onEdit} disabled={loading}>
                  수정
                </button>
                <button className="btn-delete" onClick={handleDelete} disabled={loading}>
                  삭제
                </button>
              </>
            ) : (
              <button
                className="btn-save"
                onClick={handleSave}
                disabled={!canSubmit || loading}
              >
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
  open:       PropTypes.bool.isRequired,
  mode:       PropTypes.oneOf(['create','view','edit']).isRequired,
  onClose:    PropTypes.func.isRequired,
  onSaved:    PropTypes.func.isRequired,
  onEdit:     PropTypes.func.isRequired,
  noticeData: PropTypes.shape({
    boardNo: PropTypes.number,
    title:   PropTypes.string,
    content: PropTypes.string,
    statusYn:PropTypes.string,
  }),
};

NoticeManagementDetail.defaultProps = {
  onEdit: () => {},
  noticeData: null,
};

export default NoticeManagementDetail;
