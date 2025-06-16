import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../../css/admin/adminComponents/SubscriptManagement_detail.css';

const SubscriptManagementDetail = ({ item, onClose, mode, onSaved }) => {
  const isEdit = mode === 'edit';
  const [isEditing, setIsEditing] = useState(mode === 'post');

  // 초기값 설정
  const [productName, setProductName] = useState('');
  const [productDetail, setProductDetail] = useState('');
  const [price, setPrice] = useState('');
  const [subPeriod, setSubPeriod] = useState('');
  const [useYn, setUseYn] = useState('Y');

  // item이 변경될 때마다 값 초기화
  useEffect(() => {
    if (item) {
      setProductName(item.product_name || '');
      setProductDetail(item.product_detail || '');
      setPrice(item.price || '');
      setSubPeriod(item.sub_period || '');
      setUseYn(item.use_yn || 'Y');
    }
  }, [item]);

  const handleSave = async () => {
    const formData = new URLSearchParams();
    formData.append('product_name', productName);
    formData.append('product_detail', productDetail);
    formData.append('price', price);
    formData.append('sub_period', subPeriod);
    formData.append('use_yn', useYn);

    if (isEdit && item?.product_no) {
      formData.append('product_no', item.product_no); // 수정 시 필요
    }

    try { 
      if (isEdit) {
        await axios.post('/product/updateProduct', formData);
        alert('수정되었습니다.');
      } else {
        await axios.post('/product/insertProduct', formData);
        alert('등록되었습니다.');
      }

      onSaved();  // 목록 새로고침
      onClose();  // 모달 닫기

    } catch (err) {
      console.error(`${isEdit ? '수정' : '등록'} 실패:`, err);
      alert(`${isEdit ? '수정' : '등록'}에 실패했습니다.`);
    }
  };

  if (mode === 'edit' && !item) return null;

  return (
    <div className="detail-overlay" onClick={onClose}>
      <div className="detail-modal" onClick={e => e.stopPropagation()}>
        <button className="detail-close" onClick={onClose}>×</button>
        <div className="detail-header_product"></div>

        <div className="detail-Wrapper">
          {/* 상품명 */}
          <div className="detail-body">
            <h3 className="detail-text">상품명</h3>
            {isEditing ? (
              <input
                className="detail-input-question"
                value={productName}
                onChange={e => setProductName(e.target.value)}
              />
            ) : (
              <p className="detail-text">{productName}</p>
            )}
          </div>

          {/* 상품 설명 */}
          <div className="detail-body">
            <h3 className="detail-text">상품 설명</h3>
            {isEditing ? (
              <textarea
                className="detail-textarea-answer_product"
                value={productDetail}
                onChange={e => setProductDetail(e.target.value)}
              />
            ) : (
              productDetail.split('\n\n').map((para, idx) => (
                <p key={idx} className="detail-text">{para}</p>
              ))
            )}
          </div>

          {/* 가격 */}
          <div className="detail-body">
            <h3 className="detail-text">상품 금액</h3>
            {isEditing ? (
              <input
                type="number"
                className="detail-input-question"
                value={price}
                onChange={e => setPrice(e.target.value)}
              />
            ) : (
              <p className="detail-text">{Number(price).toLocaleString()}원</p>
            )}
          </div>

          {/* 구독 기간 */}
          <div className="detail-body">
            <h3 className="detail-text">구독 기간 (개월 기준)</h3>
            {isEditing ? (
              <input
                type="number"
                className="detail-input-question"
                value={subPeriod}
                onChange={e => setSubPeriod(e.target.value)}
              />
            ) : (
              <p className="detail-text">{subPeriod}개월</p>
            )}
          </div>

          {/* 사용 유무 */}
          <div className="detail-body">
            <h3 className="detail-text">사용 유무</h3>
            {isEditing ? (
              <select
                className="detail-input-question"
                value={useYn}
                onChange={e => setUseYn(e.target.value)}
              >
                <option value="Y">사용</option>
                <option value="N">미사용</option>
              </select>
            ) : (
              <p className="detail-text">{useYn === 'Y' ? '사용' : '미사용'}</p>
            )}
          </div>
        </div>

        {/* 버튼 */}
        <div className="detail-footer">
          <button
            className="btn-edit"
            onClick={() => setIsEditing(prev => !prev)}
          >
            {isEditing ? '취소' : '수정'}
          </button>
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

export default SubscriptManagementDetail;
