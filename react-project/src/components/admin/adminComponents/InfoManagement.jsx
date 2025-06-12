// InfoManagement.jsx
import axios from 'axios';
import '../../../css/admin/adminComponents/InfoManagement.css';
import InfoManagementDetail from './InfoManagement_detail';
import AdminSideBar from '../AdminSideBar';
import { useState, useEffect } from 'react';
import Pagination from '../../common/Pagination.jsx'; 

/*
const mockData = Array.from({ length: 14 }, (_, i) => ({
  id: 14 - i,
  question: `이용안내 항목 예시 ${14 - i}`,
  answer: `
구매한 사용권을 전혀 사용하지 않은 경우에 한해 구매일로부터 7일 이내(발급일 기준, 구매일 포함)아래 고객센터(카카오톡 혹은 이메일)로 환불 의사를 전달해 주실 경우 100% 환불이 진행됩니다.

단, 사용권을 일부 사용하거나 환불 기한이 지난 경우에는 잔여 사용권이 있더라도 부분 환불이 불가능합니다.

추가로, 위 조건을 충족하여 환불이 진행되면 결제 내역은 즉시 취소되나 결제 수단별(카드사)로 실제 환급이 이루어지기까지는 카드사 사정에 따라 상이할 수 있습니다.

(앱에서 구매한 경우, 구매한 스토어에서 환불 여부를 결정하며 하이잡 서비스에서는 환불 여부를 결정하지 못합니다.)
  `,
  createdAt: `2024-06-${(14 - i).toString().padStart(2, '0')}`,
  writer: '운영자',
  priority : i
}));
*/

const InfoManagement = () => {
  const [data, setData] = useState([]);
  const [selected, setSelected] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [detailItem, setDetailItem] = useState(null);    
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [modalMode, setModalMode] = useState('edit');

    useEffect(() => {
    axios.get('/api/info/list')
      .then((res) => {
        if (Array.isArray(res.data)) {
          setData(res.data);
        } else {
          console.error('예상치 못한 응답 데이터:', res.data);
        }
      })
      .catch((err) => {
        console.error('이용안내 불러오기 실패:', err);
      });
  }, []);

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
  }

  return (
    <div className='infoManagement'>
      <AdminSideBar />
      <div className='info-content'>
        <div className = 'info-section-title-box'>
        <h2>커뮤니티 관리</h2>
        </div>
        <div className='info-header'>
          <h3>이용안내</h3>
          <p className='info-warning'>삭제할 경우 복구가 어려우며, 하이잡 이용자에게 해당 항목이 즉시 비노출됩니다. 삭제 시 신중히 선택 바랍니다.</p>
          <div className='info-controls'>
            <button>선택 삭제</button>
            <button onClick={openNewPostModal}>이용안내 등록</button>
          </div>
        </div>
       
        {isDetailOpen && (
      <InfoManagementDetail
        item={detailItem}
        onClose={() => setIsDetailOpen(false)}
        mode={modalMode}
        onSaved={() => {
          axios.get('/api/info/list')
          .then((res) => setData(res.data))
          .catch((err) => console.error(err));
        }}
      />
    )}
  

        <table className='info-table'>
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
                    className = "info-title"
                    onClick={() => openDetail(item)}
                >
                    {item.question}
                </td>
                <td>{item.createdAt}</td>
                <td><input className='input-priority' value={item.priority} onChange={(e) => {}}></input></td>
                <td>{item.writer}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
        />

      </div>
    </div>
  );
};

export default InfoManagement;