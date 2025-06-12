// FaqManagement.jsx
import '../../../css/admin/adminComponents/FaqManagement.css';
import FaqManagementDetail from './FaqManagement_detail';
import AdminSideBar from '../AdminSideBar';
import { useState } from 'react';

const mockData = Array.from({ length: 14 }, (_, i) => ({
  id: 14 - i,
  question: `FAQ 항목 예시 ${14 - i}`,
  answer: `
자주 묻는 질문에 대한 답변을 제공합니다. 각 항목은 사용자의 이해를 돕기 위해 작성되었습니다.

FAQ 항목 ${14 - i}의 예시 내용입니다.`,
  createdAt: `2024-06-${(14 - i).toString().padStart(2, '0')}`,
  writer: '운영자',
  priority: i
}));

const FaqManagement = () => {
  const [data, setData] = useState(mockData);
  const [selected, setSelected] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [detailItem, setDetailItem] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [modalMode, setModalMode] = useState('edit');

  const itemsPerPage = 10;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const sortedData = [...data].sort((a, b) => a.priority - b.priority);
  const currentItems = sortedData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(data.length / itemsPerPage);

  const toggleCheckbox = (id) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const openDetail = (item) => {
    setModalMode('edit');
    setDetailItem(item);
    setIsDetailOpen(true);
  };

  const openNewPostModal = () => {
    setModalMode('post');
    setDetailItem(null);
    setIsDetailOpen(true);
  };

  return (
    <div className='faqManagement'>
      <AdminSideBar />
      <div className='faq-content'>
        <div className='faq-section-title-box'>
          <h2>커뮤니티 관리</h2>
        </div>
        <div className='faq-header'>
          <h3>FAQ</h3>
          <p className='faq-warning'>삭제할 경우 복구가 어려우며, 하이잡 이용자에게 해당 항목이 즉시 비노출됩니다. 삭제 시 신중히 선택 바랍니다.</p>
          <div className='faq-controls'>
            <button>선택 삭제</button>
            <button onClick={openNewPostModal}>FAQ 등록</button>
          </div>
        </div>

        {isDetailOpen && (
          <FaqManagementDetail
            item={detailItem}
            onClose={() => setIsDetailOpen(false)}
            mode={modalMode}
          />
        )}

        <table className='faq-table'>
          <thead>
            <tr>
              <th><input type='checkbox' disabled /></th>
              <th>번호</th>
              <th>제목</th>
              <th>작성일(수정일)</th>
              <th>우선순위</th>
              <th>작성자</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((item) => (
              <tr key={item.id}>
                <td>
                  <input
                    type='checkbox'
                    checked={selected.includes(item.id)}
                    onChange={() => toggleCheckbox(item.id)}
                  />
                </td>
                <td>{item.id}</td>
                <td
                  className='faq-title'
                  onClick={() => openDetail(item)}
                >
                  {item.question}
                </td>
                <td>{item.createdAt}</td>
                <td><input className='input-priority' value={item.priority} readOnly /></td>
                <td>{item.writer}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className='pagination'>
          <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1}>{'<<'}</button>
          <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>{'<'}</button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
            <button
              key={num}
              className={num === currentPage ? 'active' : ''}
              onClick={() => setCurrentPage(num)}
            >
              {num}
            </button>
          ))}
          <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>{'>'}</button>
          <button onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages}>{'>>'}</button>
        </div>
      </div>
    </div>
  );
};

export default FaqManagement;
