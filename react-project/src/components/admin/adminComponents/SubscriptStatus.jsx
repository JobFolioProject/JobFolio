import axios from 'axios';
import '../../../css/admin/adminComponents/InfoManagement.css';

import AdminSideBar from '../AdminSideBar';
import { useState, useEffect } from 'react';

import Pagination from '../../common/Pagination.jsx'; 


const SubscriptStatus = () => {
    const [data, setData] = useState([]);
    const [selected, setSelected] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
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
  

  return (
    <div className='infoManagement'>
      <AdminSideBar />
      <div className='info-content'>
        <div className = 'info-section-title-box'>
            <h2>이용권 현황</h2>
        </div>
              
        <div className = 'info-section-content-box'>
        <div className='info-header'>
            <h2>일별 현황</h2>
        </div>
                  
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
                    
                  />
                    </td>
                    <td>{item.product_no}</td>
                <td className = "info-title">{item.product_name}</td>
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

export default SubscriptStatus;