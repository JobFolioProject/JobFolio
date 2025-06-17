// FaqManagement.jsx
import axios from "../../../utils/axiosConfig";
import '../../../css/admin/adminComponents/FaqManagement.css';
import FaqManagementDetail from './FaqManagement_detail';
import AdminSideBar from '../AdminSideBar';
import { useState, useEffect } from 'react';
import Pagination from '../../common/Pagination.jsx';
import { useAuth } from '../../../context/AuthContext';
import { Select, MenuItem } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";


const FaqManagement = () => {
  const [data, setData] = useState([]);
  const [selected, setSelected] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [detailItem, setDetailItem] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [modalMode, setModalMode] = useState('edit');
  const [priorityMap, setPriorityMap] = useState({});
  const { user, isAuthenticated } = useAuth();

    useEffect(() => {
      const userNo = user.userNo
            if(!userNo) return;

      axios.get('/api/admin/board/list', {
        params : {board_type : "F", userNo : userNo}
      })
        .then((res) => {
          if(Array.isArray(res)){
            setData(res);
          }else {
            console.error('faq list 예상치 못한 응답 데이터:', res);
          }
        })
        .catch((err) => {
          console.error('FaQ 불러오기 실패:', err);
        });
    }, []);

    const handleDeleteSelected = () => {
      if(selected.length === 0) {
        alert("삭제할 항목을 선택해 주세요");
        return;
      }
      if (!window.confirm("삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다."))
        return;

      axios.post('/api/admin/board/delete', selected)
        .then(() => axios.get('/api/admin/board/list', {
          params : { board_type: "F"}
        }))
        .then((res) => {
          setData(res);
          setSelected([]);
        })
        .catch((err) => {
          console.error("삭제 실패 : ", err);
          alert("삭제 중 오류 발생");
        });
    };

    const handlePriorityUpdate = (item) => {
      const newPriority = priorityMap[item.id];

      if (newPriority === undefined || newPriority === item.priority){
        return;
      }

      axios.post('/api/admin/board/updatePriority', {
        id : item.id,
        board_type : item.board_type || "F",
        newPriority : newPriority
      })
      .then(() => {
        return axios.get('/api/admin/board/list', {
          params : {board_type : item.board_type || "F"}
        });
      })
      .then((res) => {
        setData(res);
        setPriorityMap({});
      })
      .catch((err) => {
        console.error('우선순위 업데이트 실패 :', err);
        alert('우선순위 저장 실패');
        setPriorityMap({});
      });
    };





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

        <div className = 'faq-section-content-box'>
        <div className='faq-header'>
          <h3>FAQ</h3>
          <p className='faq-warning'>삭제할 경우 복구가 어려우며, 하이잡 이용자에게 해당 항목이 즉시 비노출됩니다. 삭제 시 신중히 선택 바랍니다.</p>
          <div className='faq-controls'>
            <button onClick={handleDeleteSelected}>선택 삭제</button>
            <button onClick={openNewPostModal}>FAQ 등록</button>
          </div>
        </div>

        {isDetailOpen && (
          <FaqManagementDetail
            item={detailItem}
            onClose={() => setIsDetailOpen(false)}
            mode={modalMode}
            boardType = "F"
            onSaved={() => {
              axios.get('/api/admin/board/list', {
                params : {board_type : "F"}
              })
              .then((res) => setData(res))
              .catch((err) => console.error(err))
            }}
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
              <th>표시여부</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((item, i) => (
              <tr key={item.id}>
                <td>
                  <input
                    type='checkbox'
                    checked={selected.includes(item.id)}
                    onChange={() => toggleCheckbox(item.id)}
                  />
                </td>
                <td>{JSON.stringify(currentPage-1) === '0' ? (1+i++) : JSON.stringify(currentPage-1) + (1+i++)}</td>
                <td
                  className='faq-title'
                  onClick={() => openDetail(item)}
                >
                  {item.question}
                </td>
                <td>{item.createdAt}</td>
                <td>
                  <input 
                    className='input-priority' 
                    type = 'number'
                    value={priorityMap[item.id] ?? item.priority} 
                    onChange={(e) => {
                      const newVal = parseInt(e.target.value, 10);
                      setPriorityMap((prev) => ({...prev, [item.id]: newVal}))
                    }} 
                    onBlur = {() => handlePriorityUpdate(item)}
                    />
                </td>

                <td>{item.writer}</td>
                
                <td>
                  <Select
                    className="input-status-select"
                    value={item.status_yn ?? "N"}
                    onChange={ (e) => {
                      const newStatus = e.target.value;

                      console.log("변경 요청 payload", {
                          id: item.id,
                          status_yn: newStatus
                      });

                      axios.post("/api/admin/board/updateStatus", {
                        id : item.id,
                        status_yn : newStatus
                      })
                      .then(() => {

                        const raw = sessionStorage.getItem("user");
                        const { userNo } = JSON.parse(raw || "{}");

                        return axios.get("/api/admin/board/list", { 
                          params: {board_type: item.board_type || "I", userNo : userNo}
                        });
                      })
                      .then(() => {
                        setData(prev =>
                          prev.map(row =>
                            row.id === item.id ? {...row, status_yn: newStatus } : row
                          )
                        );
                      })
                      .catch((err) => {
                        console.error("표시여부 변경 실패 : ", err);
                        alert("표시여부 변경 실패")
                      });
                    }}
                    >
                    <MenuItem value="N" className="menu-item">
                      <div className="menu-item-content">
                       <VisibilityIcon className="menu-icon" />
                       <sapn>노출</sapn>
                      </div>
                    </MenuItem>
                    <MenuItem value="Y" className="menu-item">
                      <div className="menu-item-content">
                        <VisibilityOffIcon className="menu-icon" />
                        <sapn>숨김</sapn>
                      </div>
                    </MenuItem>
                  </Select>  
                </td>
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

export default FaqManagement;
