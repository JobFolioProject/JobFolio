import AdminSideBar from '../AdminSideBar';
import Pagination from '../../common/Pagination.jsx';
import { useState, useEffect } from 'react';
import axios from '../../../utils/axiosConfig';

const GroupManagement = () => {

    const [searchdata, setSearchdata] = useState({
    stype: "",
    searchword: "",
    useyn: "",
    cpage: 1,
    pagesize: 5,
    blocksize: 10,
  });
    

  return (
    <>
      <div className="content">
        <p className="conTitle">
          <span> 공통 코드</span>
          <span className="fr" style={{ textAlign: "left", display: "block" }}>
            <select
              id="stype"
              name="stype"
              onChange={(e) => {
                setSearchdata({ ...searchdata, stype: e.target.value });
              }}
            >
              <option value="">전체</option>
              <option value="code">코드</option>
              <option value="name">코드명</option>
            </select>
            <input
              type="text"
              className="form-control"
              id="searchword"
              name="searchword"
              style={{ width: 150 }}
              onInput={(e) => {
                setSearchdata({ ...searchdata, searchword: e.target.value });
              }}
            />
            사용 여부
            <select
              id="useyn"
              name="useyn"
              onChange={(e) => {
                setSearchdata({ ...searchdata, useyn: e.target.value });
              }}
            >
              <option value="">전체</option>
              <option value="Y">사용</option>
              <option value="N">미사용</option>
            </select>
            <button
              className="btn btn-primary mx-2"
              id="btnSearchGrpcod"
              name="btn"
            >
              <span> 검 색 </span>
            </button>
            <button
              className="btn btn-light mx-2"
              id="btnSearchGrpcod"
              name="btn"
            >
              <span> 신규등록 </span>
            </button>
          </span>
        </p>
        <div style={{ marginTop: "5px" }}>
          <span>
            총건수 :  현재 페이지번호 : 
          </span>
          <table className="col">
            <thead>
              <tr>
                <th scope="col"> 그룹 코드 </th>
                <th scope="col"> 그룸 코드 명 </th>
                <th scope="col"> 사용 여부 </th>
                <th scope="col"> 등록 일자 </th>
                <th scope="col"> </th>
              </tr>
            </thead>
            <tbody>
                <tr>
                  <td colSpan="4">조회된 제이터가 없습니다.</td>
                </tr>
             
            </tbody>
          </table>
          <br />
          <div>
            
          </div>
        </div>
        <div style={{ marginTop: "5px" }}>
          <span>
            총건수 :  현재 페이지번호 : 
            <span className="fr">
              <button
                className="btn btn-light mx-2"
                id="btnSearchGrpcod"
                name="btn"
              >
                <span> 신규등록 </span>
              </button>
            </span>
          </span>
          <table className="col">
            <thead>
              <tr>
                <th scope="col"> 상세 코드 </th>
                <th scope="col"> 상세코드 명 </th>
                <th scope="col"> 사용 여부 </th>
                <th scope="col"> 등록자 </th>
                <th scope="col"></th>
              </tr>
            </thead>
            <tbody>
              
                <tr>
                  <td colSpan={5}>조회된 데이터가 없습니다.</td>
                </tr>
              
            </tbody>
          </table>
          <br />
          <div>
            
          </div>
        </div>
      </div>
      
      
    </>
  );
};

export default GroupManagement;
