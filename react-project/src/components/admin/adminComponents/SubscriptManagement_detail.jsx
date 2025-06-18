import React, { useState, useEffect } from 'react';
import axios from '../../../utils/axiosConfig';
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

  // item 또는 mode가 바뀔 때마다 값 초기화
  useEffect(() => {
    if (isEdit && item) {
      setProductName(item.product_name || '');
      setProductDetail(item.product_detail || '');
      setPrice(item.price || '');
      setSubPeriod(item.sub_period || '');
      setUseYn(item.use_yn || 'Y');
    } else {
      // 신규 등록 시 초기값 설정
      setProductName('');
      setProductDetail('');
      setPrice('');
      setSubPeriod('');
      setUseYn('Y');
    }
  }, [item, mode, isEdit]);

  const handleSave = async () => {
    if (!productName || !price || !subPeriod) {
      alert('상품명, 가격, 구독 기간은 필수 입력 항목입니다.');
      return;
    }
  
    const payload = {
      product_name: productName,
      product_detail: productDetail,
      price: price,
      sub_period: subPeriod,
      use_yn: useYn,
      ...(isEdit && { product_no: item?.product_no }),
    };

    
    try {
      if (isEdit) {
        await axios.post('/api/admin/product/updateProduct', payload);
        alert('수정되었습니다.');
      } else {
        await axios.post('/api/admin/product/insertProduct', payload);
        alert('등록되었습니다.');
      }
  
      onSaved();
      onClose();
    } catch (err) {
      console.error(`${isEdit ? '수정' : '등록'} 실패:`, err);
      alert(`${isEdit ? '수정' : '등록'}에 실패했습니다.`);
    }
  };
  

  if (isEdit && !item) return null;

  return (
    <div className="detail-overlay" onClick={onClose}>
      <div className="detail-modal" onClick={(e) => e.stopPropagation()}>
        <button className="detail-close" onClick={onClose}>×</button>
        <div className="detail-header_product"></div>

        <div className="detail-Wrapper">
          <div className="detail-body">
            <h3 className="detail-text">상품명</h3>
            {isEditing ? (
              <input
                className="detail-input-question"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
              />
            ) : (
              <p className="detail-text">{productName}</p>
            )}
          </div>

          <div className="detail-body">
            <h3 className="detail-text">상품 설명</h3>
            {isEditing ? (
              <textarea
                className="detail-textarea-answer_product"
                value={productDetail}
                onChange={(e) => setProductDetail(e.target.value)}
              />
            ) : (
              productDetail.split('\n\n').map((para, idx) => (
                <p key={idx} className="detail-text">{para}</p>
              ))
            )}
          </div>

          <div className="detail-body">
            <h3 className="detail-text">상품 금액</h3>
            {isEditing ? (
              <input
                type="number"
                className="detail-input-question"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            ) : (
              <p className="detail-text">{Number(price).toLocaleString()}원</p>
            )}
          </div>

          <div className="detail-body">
            <h3 className="detail-text">구독 기간 (개월 기준)</h3>
            {isEditing ? (
              <input
                type="number"
                className="detail-input-question"
                value={subPeriod}
                onChange={(e) => setSubPeriod(e.target.value)}
              />
            ) : (
              <p className="detail-text">{subPeriod}개월</p>
            )}
          </div>

          <div className="detail-body">
            <h3 className="detail-text">사용 유무</h3>
            {isEditing ? (
              <select
                className="detail-input-question"
                value={useYn}
                onChange={(e) => setUseYn(e.target.value)}
              >
                <option value="Y">사용</option>
                <option value="N">미사용</option>
              </select>
            ) : (
              <p className="detail-text">{useYn === 'Y' ? '사용' : '미사용'}</p>
            )}
          </div>
        </div>

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
