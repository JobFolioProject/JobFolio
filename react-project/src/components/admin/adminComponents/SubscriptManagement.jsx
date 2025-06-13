import axios from 'axios';
import '../../../css/admin/adminComponents/InfoManagement.css';

import SubscriptManagementDetail from './SubscriptManagement_detail';
import AdminSideBar from '../AdminSideBar';
import { useState, useEffect } from 'react';
import Pagination from '../../common/Pagination.jsx'; 


const SubscriptManagement = () => {
    const [data, setData] = useState([]);
    const [selected, setSelected] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [detailItem, setDetailItem] = useState(null);    
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [modalMode, setModalMode] = useState('edit');
    const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('/product/productList', {
          params: {
            currentpage: currentPage,
            pagesize: itemsPerPage
          }
        });
  
        setData(res.data.productList);
        setTotalCount(res.data.totalcnt); 
      } catch (err) {
        console.error('상품 안내 불러오기 실패:', err);
      }
    };
  
    fetchData();
  }, [currentPage]);

  const itemsPerPage = 10;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem); 
  const totalPages = Math.ceil(totalCount / itemsPerPage);            
  

  const toggleCheckbox = (product_no) => {
    setSelected(prev =>
      prev.includes(product_no) ? prev.filter(item => item !== product_no) : [...prev, product_no]
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
            <h2>상품 관리</h2>
        </div>
              
        <div className = 'info-section-content-box'>
        <div className='info-header'>
          <div className='info-controls'>
            <button>선택 삭제</button>
            <button onClick={openNewPostModal}>상품 등록</button>
          </div>
        </div>
       
        {isDetailOpen && (              
          <SubscriptManagementDetail
            item={detailItem}
            onClose={() => setIsDetailOpen(false)}
            mode={modalMode}
            onSaved={() => {
              axios.get('/product/productList')
              .then((res) => setData(res.data))
              .catch((err) => console.error(err));
            }}
          />
        )}
  
        <table className='info-table'>
          <thead>
            <tr>
            <th>
                <input type='checkbox' disabled /></th>
                <th>번호</th>
                <th>상품명</th>
                <th>가격</th>
                <th>사용유무</th>
                <th>등록일자</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((item) => (
              <tr key={item.product_no}>
                <td>
                  <input
                    type='checkbox'
                    checked={selected.includes(item.product_no)}
                    onChange={() => toggleCheckbox(item.product_no)}
                  />
                    </td>
                    <td>{item.product_no}</td>
                <td className = "info-title"
                        onClick={() => openDetail(item)}>{item.product_name}</td>
                  <td> {item.price.toLocaleString()}원</td>
                <td>{item.use_yn}</td>
                <td>{item.created_date}</td>
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
          </div>
  );
};

export default SubscriptManagement;