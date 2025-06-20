import '../../../css/user/myPageComponent/PayHistory.css';
import Pagination from '../../common/Pagination.jsx';
import { useEffect, useState } from 'react';
import axios from '../../../utils/axiosConfig';
import { useAuth } from '../../../context/AuthContext';

const PayHistory = () => {
    const [data, setData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const pageSize = 10;
    const totalPages = Math.ceil(totalCount / pageSize);

    const [searchData, setSearchData] = useState('');
    const [searchKeyword, setSearchKeyword] = useState(''); // 검색 입력 필드의 값

    const { user, isAuthenticated } = useAuth();

    useEffect(() => {
        const userNo = user.userNo;
        if (!userNo && !user.userNo) return;
        console.log(userNo);
        const payHisData = async () => {
            const params = {
                page: currentPage,
                limit: pageSize,
                ...(searchData && { search: searchData }),
            };
            await axios
                .get(`api/myPage//payHistory/${userNo}`, { params: params })
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
    }, [currentPage, searchData, user, isAuthenticated]);
    return (
        <div className="userInfoWrap">
            <div className="userInfoContent">
                <div className="payHis-section-title-box">{/* <h2>결재 내역</h2> */}</div>

                <div className="payHis-section-content-box">
                    <div>
                        <div className="payHisData">
                            <table className="payHis-table">
                                <thead>
                                    <tr>
                                        <th>결제 날짜</th>
                                        <th>주문 번호</th>
                                        <th>상품 정보</th>
                                        <th>결제 금액</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.map((item) => (
                                        <tr key={item.order_id}>
                                            <td>{item.paid_date}</td>
                                            <td>{item.product_no}</td>
                                            <td>{item.order_name}</td>
                                            <td>{item.amount}</td>
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
            </div>
        </div>
    );
};

export default PayHistory;
