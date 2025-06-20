import Pagination from '../../common/Pagination.jsx';
import '../../../css/admin/adminComponents/AdminManagement.css';
import '../../../css/admin/adminComponents/InfoManagement.css';
import AdminManagementDetail from './AdminManagement_detail.jsx';
import AdminSideBar from '../AdminSideBar';
import SearchIcon from '@mui/icons-material/Search';
import { useEffect, useState } from 'react';
import axios from '../../../utils/axiosConfig';
import { useAuth } from '../../../context/AuthContext';

import Chip from '@mui/material/Chip'; // Chip 컴포넌트 임포트
import CrownIcon from '@mui/icons-material/EmojiEvents'; // 슈퍼관리자 아이콘 (예시)
import SettingsIcon from '@mui/icons-material/Settings'; // 관리자 아이콘 (예시)
import PersonIcon from '@mui/icons-material/Person'; // 일반회원 아이콘 (예시)

const AdminManagement = () => {
    const { user, isAuthenticated } = useAuth();
    const [currentPage, setCurrentPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [data, setData] = useState([]);

    const pageSize = 10;
    const totalPages = Math.ceil(totalCount / pageSize);

    const [filterType, setFilterType] = useState('all'); // 기본값
    const [searchData, setSearchData] = useState('');
    const [searchKeyword, setSearchKeyword] = useState(''); // 검색 입력 필드의 값

    const [showModal, setShowModal] = useState(false); // 모달 오픈
    const [selectedUser, setSelectedUser] = useState(null); // 모달에 표시할 유저 정보 아이디

    const [statusFilterType, setStatusFilterType] = useState('all');

    useEffect(() => {
        const userNo = user.userNo;
        if (!userNo && !user.userNo) return;
        if (!isAuthenticated) return;

        const userDate = async () => {
            // 리퀘스트 파라미터 설정?  api/admin/customers?type=abc&page=1&limit=10&search=keyword ... 이런식으로
            const params = {};

            if (filterType !== 'all') {
                params.type = filterType; // 필터 타입이 all 이 아닐때 type 파라미터 추가
            }
            if (statusFilterType !== 'all') {
                params.status = statusFilterType;
            }

            // 페이지 네이션 파라미터
            params.page = currentPage; // 현재 페이지 파라미터
            params.limit = pageSize; // 제한 파라미터

            // 검색어 파라미터
            if (searchData) {
                // 검색 데이터가 존재할 경우
                params.search = searchData; // search 파라미터 추가
            }

            await axios
                .get('api/admin/customers/list', { params: params })
                .then((response) => {
                    // 백엔드에서 받은 데이터로 상태 업데이트
                    setData(response.customers); // 데이터
                    setTotalCount(response.totalCount); // 전체 개수
                })
                .catch((error) => {
                    console.log(error);
                });
        };
        userDate();
    }, [currentPage, filterType, searchData, user, isAuthenticated, statusFilterType]);

    const statusFilterChange = (e) => {
        setStatusFilterType(e.target.value);
        setCurrentPage(1);
    };

    // 필터 바꿀때 리스트 체인지 후 첫번째 페이지로
    const filterChange = (e) => {
        setFilterType(e.target.value);
        setCurrentPage(1);
    };

    // 키워드로 검색하기
    const keywordSearch = () => {
        setCurrentPage(1);
        setSearchData(searchKeyword);
    };

    // 키 프레스로 검색하기
    const keyPress = (e) => {
        if (e.key === 'Enter') {
            keywordSearch();
            setSearchKeyword('');
        }
    };

    const openModal = (num) => {
        setShowModal(true);
        setSelectedUser(num);
    };
    return (
        <div className="adminManagement">
            <AdminSideBar />
            <div className="adminMag-content">
                <div className="adminMag-section-title-box">
                    <h2>계정 관리</h2>
                </div>

                {/* 검색창 */}
                <div className="adminMag-section-content-box">
                    <div className="adminMag-header">
                        <h3>권한 관리</h3>
                        <p className="adminMag-warning">
                            삭제할 경우 복구가 어려우며, 삭제 시 신중히 선택 바랍니다. <br></br>
                            관리자 등록 변경은 신중히 선택 바랍니다.
                        </p>
                    </div>
                    <div className="adminMag-controls">
                        <div className="adminMag-left-content">
                            <select value={filterType} onChange={filterChange} className="adminMag-filter-select">
                                <option value={'all'}>전체</option>
                                <option value={'ADMIN_GROUP'}>관리자</option>
                                <option value={'C'}>일반</option>
                            </select>

                            <select
                                className="adminMag-filter-select"
                                value={statusFilterType}
                                onChange={statusFilterChange}
                            >
                                <option value={'all'}>모든 상태</option>
                                <option value={'N'}>정상</option>
                                <option value={'Y'}>탈퇴</option>
                            </select>
                        </div>

                        <div className="adminMag-right-content">
                            <input
                                className="adminMag-search-input"
                                type="text"
                                value={searchKeyword}
                                placeholder="검색어를 입력하세요(Enter)"
                                onChange={(e) => setSearchKeyword(e.target.value)}
                                onKeyPress={keyPress}
                            />
                            <button className="adminMag-search-button" onClick={keywordSearch}>
                                <SearchIcon className="search-icon" />
                                검색
                            </button>
                        </div>
                    </div>
                    <table className="adminMag-table">
                        <thead>
                            <tr>
                                <th className="col-userNumber">회원번호</th>
                                <th className="col-loginId">아이디</th>
                                <th className="col-name">이름</th>
                                <th className="col-status">상태</th>
                                <th className="col-regDate">가입일</th>
                                <th className="col-withdrawalDate">탈퇴날짜</th>
                                <th className="col-grade">등급</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((item) => (
                                <tr key={item.user_no} onClick={() => openModal(item.user_no)}>
                                    <td>{item.user_no}</td>
                                    <td>{item.login_id}</td>
                                    <td>{item.user_name}</td>
                                    <td
                                        style={{
                                            color:
                                                item.status_yn === 'N'
                                                    ? 'green' // N일 경우 초록색
                                                    : item.status_yn === 'Y'
                                                    ? 'red' // Y일 경우 빨간색
                                                    : 'inherit',
                                        }}
                                    >
                                        {item.status_yn === 'N' ? '정상' : item.status_yn === 'Y' ? '탈퇴' : '대기'}
                                    </td>
                                    <td>{item.reg_date}</td>
                                    <td>{item.withdrawal_date}</td>
                                    <td>
                                        {item.user_type === 'A' ? (
                                            <Chip
                                                clickable={false}
                                                label="슈퍼"
                                                icon={<CrownIcon fontSize="small" />} // 아이콘 추가
                                                size="small" // 뱃지 크기 조절
                                                color="warning" // 노란색 계열 색상 (경고, 중요)
                                                className="sparkle-badge"
                                                sx={{
                                                    bgcolor: '#FFD700', // 더 정확한 금색 배경
                                                    color: '#333',
                                                    fontWeight: 'bold',
                                                    minWidth: '80px',
                                                }}
                                            />
                                        ) : item.user_type === 'B' ? (
                                            <Chip
                                                label="관리자"
                                                icon={<SettingsIcon fontSize="small" />} // 아이콘 추가
                                                size="small"
                                                color="info" // 파란색 계열 색상 (정보)
                                                sx={{
                                                    bgcolor: '#90CAF9', // 하늘색 배경
                                                    color: '#333',
                                                    fontWeight: 'bold',
                                                    minWidth: '80px',
                                                }}
                                                clickable={false}
                                            />
                                        ) : (
                                            <Chip
                                                label="일반회원"
                                                icon={<PersonIcon fontSize="small" />} // 아이콘 추가
                                                size="small"
                                                color="default" // 기본 회색 계열
                                                sx={{
                                                    bgcolor: '#E0E0E0', // 연회색 배경
                                                    color: '#333',
                                                    fontWeight: 'bold',
                                                    minWidth: '80px',
                                                }}
                                                clickable={false}
                                            />
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {/* 페이지네이션 */}
                    <Pagination currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage} />
                </div>
            </div>

            <AdminManagementDetail open={showModal} />
        </div>
    );
};

export default AdminManagement;
