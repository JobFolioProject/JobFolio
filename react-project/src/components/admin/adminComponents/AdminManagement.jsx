import Pagination from '../../common/Pagination.jsx';
import '../../../css/admin/adminComponents/AdminManagement.css';
import '../../../css/admin/adminComponents/InfoManagement.css';
import AdminManagementDetail from './AdminManagementDetail';
import AdminSideBar from '../AdminSideBar';
import SearchIcon from '@mui/icons-material/Search';
import { useEffect, useState } from 'react';
import axios from '../../../utils/axiosConfig';
import { useAuth } from '../../../context/AuthContext';

import Chip from '@mui/material/Chip';
import CrownIcon from '@mui/icons-material/EmojiEvents';
import SettingsIcon from '@mui/icons-material/Settings';
import PersonIcon from '@mui/icons-material/Person';

const AdminManagement = () => {
    const { user, isAuthenticated } = useAuth();
    const [currentPage, setCurrentPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [data, setData] = useState([]);

    const pageSize = 10;
    const totalPages = Math.ceil(totalCount / pageSize);

    const [filterType, setFilterType] = useState('all');
    const [searchData, setSearchData] = useState('');
    const [searchKeyword, setSearchKeyword] = useState('');

    const [showModal, setShowModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    const [statusFilterType, setStatusFilterType] = useState('all');

    useEffect(() => {
        if (!user || !isAuthenticated) return;

        const fetchUserData = async () => {
            const params = {};

            if (filterType !== 'all') {
                params.type = filterType;
            }

            if (statusFilterType !== 'all') {
                params.status = statusFilterType;
            }

            params.page = currentPage;
            params.limit = pageSize;

            if (searchData) {
                params.search = searchData;
            }

            try {
                const response = await axios.get('api/admin/customers/list', { params: params });
                setData(response.customers || []);
                setTotalCount(response.totalCount || 0);
            } catch (error) {
                setData([]);
                setTotalCount(0);
            }
        };

        fetchUserData();
    }, [currentPage, filterType, searchData, user, isAuthenticated, statusFilterType]);
    const statusFilterChange = (e) => {
        setStatusFilterType(e.target.value);
        setCurrentPage(1);
    };
    const filterChange = (e) => {
        setFilterType(e.target.value);
        setCurrentPage(1);
    };

    const keywordSearch = () => {
        setCurrentPage(1);
        setSearchData(searchKeyword);
    };

    const keyPress = (e) => {
        if (e.key === 'Enter') {
            keywordSearch();
            setSearchKeyword('');
        }
    };

    const openModal = (userItem, event) => {
        if (event) {
            event.stopPropagation();
        }
        setSelectedUser(userItem);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedUser(null);
    };

    const refreshUserList = async () => {
        const params = {};

        if (filterType !== 'all') {
            params.type = filterType;
        }

        if (statusFilterType !== 'all') {
            params.status = statusFilterType;
        }

        params.page = currentPage;
        params.limit = pageSize;
        if (searchData) {
            params.search = searchData;
        }

        try {
            const response = await axios.get('api/admin/customers/list', { params: params });
            setData(response.customers || []);
            setTotalCount(response.totalCount || 0);
        } catch (error) {
            console.error('사용자 목록 새로고침 실패:', error);
        }
    };

    return (
        <div className="adminManagement">
            <AdminSideBar />
            <div className="adminMag-content">
                <div className="adminMag-section-title-box">
                    <h2>계정 관리</h2>
                </div>

                <div className="adminMag-section-content-box">
                    <div className="adminMag-header">
                        <h3>권한 관리</h3>
                        <p className="adminMag-warning">
                            삭제할 경우 복구가 어려우며, 삭제 시 신중히 선택 바랍니다. <br />
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
                            {data && data.length > 0 ? (
                                data.map((item) => (
                                    <tr
                                        key={item.user_no}
                                        onClick={(e) => openModal(item, e)}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <td>{item.user_no}</td>
                                        <td>{item.login_id}</td>
                                        <td>{item.user_name}</td>

                                        <td
                                            style={{
                                                color:
                                                    item.status_yn === 'N'
                                                        ? 'green'
                                                        : item.status_yn === 'Y'
                                                        ? 'red'
                                                        : 'inherit',
                                            }}
                                        >
                                            {item.status_yn === 'N' ? '정상' : item.status_yn === 'Y' ? '탈퇴' : '대기'}
                                        </td>

                                        <td>{item.reg_date}</td>
                                        <td>{item.withdrawal_date || ''}</td>

                                        <td
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                e.preventDefault();
                                            }}
                                            style={{
                                                cursor: 'default',
                                                pointerEvents: 'none',
                                            }}
                                        >
                                            {item.user_type === 'A' ? (
                                                <Chip
                                                    label="슈퍼"
                                                    icon={<CrownIcon fontSize="small" />}
                                                    size="small"
                                                    clickable={false}
                                                    sx={{
                                                        bgcolor: '#FFD700',
                                                        color: '#333',
                                                        fontWeight: 'bold',
                                                        minWidth: '80px',
                                                        pointerEvents: 'none',
                                                        cursor: 'default',
                                                    }}
                                                />
                                            ) : item.user_type === 'B' ? (
                                                <Chip
                                                    label="관리자"
                                                    icon={<SettingsIcon fontSize="small" />}
                                                    size="small"
                                                    clickable={false}
                                                    sx={{
                                                        bgcolor: '#90CAF9',
                                                        color: '#333',
                                                        fontWeight: 'bold',
                                                        minWidth: '80px',
                                                        pointerEvents: 'none',
                                                        cursor: 'default',
                                                    }}
                                                />
                                            ) : (
                                                <Chip
                                                    label="일반회원"
                                                    icon={<PersonIcon fontSize="small" />}
                                                    size="small"
                                                    clickable={false}
                                                    sx={{
                                                        bgcolor: '#E0E0E0',
                                                        color: '#333',
                                                        fontWeight: 'bold',
                                                        minWidth: '80px',
                                                        pointerEvents: 'none',
                                                        cursor: 'default',
                                                    }}
                                                />
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" style={{ textAlign: 'center', padding: '20px' }}>
                                        데이터가 없습니다.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                    <Pagination currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage} />
                </div>
            </div>

            <AdminManagementDetail
                open={showModal}
                onClose={closeModal}
                selectedUser={selectedUser}
                currentUser={user}
                onUserUpdated={refreshUserList}
            />
        </div>
    );
};

export default AdminManagement;
