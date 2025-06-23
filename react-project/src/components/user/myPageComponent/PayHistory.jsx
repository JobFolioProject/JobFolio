import '../../../css/user/myPageComponent/PayHistory.css';
import Pagination from '../../common/Pagination.jsx';
import { useEffect, useState } from 'react';
import axios from '../../../utils/axiosConfig';
import { useAuth } from '../../../context/AuthContext';
import SearchIcon from '@mui/icons-material/Search';
const PayHistory = () => {
    const [data, setData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const pageSize = 10;
    const totalPages = Math.ceil(totalCount / pageSize);

    const [searchData, setSearchData] = useState('');
    const [searchKeyword, setSearchKeyword] = useState(''); // 검색 입력 필드의 값

    const { user, isAuthenticated } = useAuth();
    const [statusFilterType, setStatusFilterType] = useState('all');
    useEffect(() => {
        const userNo = user.userNo;
        if (!userNo && !user.userNo) return;

        const payHisData = async () => {
            const params = {
                page: currentPage,
                limit: pageSize,
                ...(searchData && { search: searchData }),
                ...(statusFilterType !== 'all' && { status: Number(statusFilterType) }),
            };
            await axios
                .get(`api/myPage/payHistory/${userNo}`, { params: params })
                .then((response) => {
                    console.log(response);

                    setData(response.payModels);
                    setTotalCount(response.totalCount);
                })
                .catch((error) => {
                    console.log(error);
                });
        };
        payHisData();
    }, [currentPage, searchData, user, isAuthenticated, statusFilterType]);

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

    const statusFilterChange = (e) => {
        setStatusFilterType(e.target.value);
        setCurrentPage(1);
    };

    return (
        <div className="userInfoWrap">
            <div className="userInfoContent">
                <div className="payHis-section-title-box"></div>

                <div className="payHis-section-content-box">
                    <div className="payHis-controls">
                        <div className="adminMag-left-content">
                            <select
                                className="adminMag-filter-select"
                                value={statusFilterType}
                                onChange={statusFilterChange}
                            >
                                <option value={'all'}>모든 상태</option>
                                <option value={2}>완료</option>
                                <option value={3}>환불</option>
                            </select>
                        </div>
                        <div className="payHis-right-content">
                            <input
                                className="payHis-search-input"
                                type="text"
                                value={searchKeyword}
                                placeholder="검색어를 입력하세요(Enter)"
                                onChange={(e) => setSearchKeyword(e.target.value)}
                                onKeyPress={keyPress}
                            />
                            <button className="payHis-search-button" onClick={keywordSearch}>
                                <SearchIcon className="search-icon" />
                                검색
                            </button>
                        </div>
                    </div>
                    <div className="payHisData">
                        <table className="payHis-table">
                            <thead>
                                <tr>
                                    <th>주문 번호</th>
                                    <th>상품 정보</th>
                                    <th>결제 금액</th>
                                    <th>결제 날짜</th>
                                    <th>상태</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data && data.length > 0 ? (
                                    data.map((item) => (
                                        <tr key={item.order_id}>
                                            <td>{item.order_id}</td>
                                            <td>{item.order_name}</td>
                                            <td>{item.amount.toLocaleString('ko-KR') + '원'}</td>
                                            <td>{item.paid_date.substring(0, 16)}</td>
                                            <td
                                                style={{
                                                    color:
                                                        item.pay_status === 2
                                                            ? 'green'
                                                            : item.pay_status === 3
                                                            ? 'red'
                                                            : 'inherit',
                                                }}
                                            >
                                                {item.pay_status === 2
                                                    ? '완료'
                                                    : item.pay_status === 3
                                                    ? '환불'
                                                    : '요청'}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="payHis-noPay">
                                            결제 내역이 없습니다.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                        <Pagination currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PayHistory;
