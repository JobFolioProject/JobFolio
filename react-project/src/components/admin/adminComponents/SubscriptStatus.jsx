import axios from '../../../utils/axiosConfig';
import '../../../css/admin/adminComponents/InfoManagement.css';
import '../../../css/admin/adminComponents/SubscriptStatus.css';
import AdminSideBar from '../AdminSideBar';
import Pagination from '../../common/Pagination.jsx';

import { useState, useRef, useEffect } from 'react';
import { Chart } from 'chart.js/auto';

const SubscriptManagement = () => {
  const itemsPerPage = 5;

  // 일별 현황
  const [dailyData, setDailyData] = useState([]);
  const [dailyPage, setDailyPage] = useState(1);
  const [dailyTotalCount, setDailyTotalCount] = useState(0);

  // 월별 현황
  const [monthlyData, setMonthlyData] = useState([]);
  const [monthlyPage, setMonthlyPage] = useState(1);
  const [monthlyTotalCount, setMonthlyTotalCount] = useState(0);

  // 결제 내역
  const [salesData, setsalesData] = useState([]);
  const [salesDataPage, setsalesDataPage] = useState(1);
  const [salesDataTotalCount, setsalesDataTotalCount] = useState(0);



  // 차트 참조
  const updateDayChartRef = useRef(null);
  const updateMonthChartRef = useRef(null);

  // 일별 데이터 요청
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('/api/admin/sales/daySalesList', {
          params: {
            currentpage: dailyPage,
            pagesize: itemsPerPage,
          },
        });

        setDailyData(res.daySalesList);
        setDailyTotalCount(res.totalcnt);
      } catch (err) {
        console.error('일별 데이터 불러오기 실패:', err);
      }
    };

    fetchData();
  }, [dailyPage]);

  // 월별 데이터 요청
  useEffect(() => {
    const fetchMonthlyData = async () => {
      try {
        const res = await axios.get('/api/admin/sales/monthSalesList', {
          params: {
            currentpage: monthlyPage,
            pagesize: itemsPerPage,
          },
        });

        setMonthlyData(res.monthSalesList);
        setMonthlyTotalCount(res.totalcnt);
      } catch (err) {
        console.error('월별 데이터 불러오기 실패:', err);
      }
    };

    fetchMonthlyData();
  }, [monthlyPage]);

  // 결제 내역 데이터 요청
  useEffect(() => {
    const fetchsalesData = async () => {
      try {
        const res = await axios.get('/api/admin/sales/salesHistory', {
          params: {
            currentpage: salesDataPage,
            pagesize: itemsPerPage,
          },
        });
        setsalesData(res.salesHistory);
        setsalesDataTotalCount(res.totalcnt);
      } catch (err) {
        console.error('월별 데이터 불러오기 실패:', err);
      }
    };

    fetchsalesData();
  }, [salesDataPage]);



  // 차트용 데이터 (페이지에 상관없이 전체 조회)
  useEffect(() => {
    const drawDayChart = async () => {
      try {
        const res = await axios.get('/api/admin/sales/daySalesChart', {
          params: { currentpage: 1, pagesize: 100 },
        });
        const data = res.daySalesChart;
        const labels = data.map(item => item.day_sale_date);
        const counts = data.map(item => item.total_count);
        updateDayChart(labels, counts);
      } catch (err) {
        console.error('일별 차트 로딩 실패:', err);
      }
    };

    const drawMonthChart = async () => {
      try {
        const res = await axios.get('/api/admin/sales/monthSalesChart', {
          params: { currentpage: 1, pagesize: 12 },
        });
        const data = res.monthSalesChart;
        const labels = data.map(item => item.month_sale_date);
        const counts = data.map(item => item.total_count);
        updateMonthChart(labels, counts);
      } catch (err) {
        console.error('월별 차트 로딩 실패:', err);
      }
    };

    drawDayChart();
    drawMonthChart();
  }, []);

  // 차트 함수
  const updateDayChart = (labels, data) => {
    const ctx = document.getElementById('userChartDay')?.getContext('2d');
    if (!ctx) return;

    if (updateDayChartRef.current) {
      updateDayChartRef.current.destroy();
    }

    updateDayChartRef.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: '일별 매출 건수',
          data,
          borderColor: '#36A2EB',
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          tension: 0.2,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: { y: { beginAtZero: true } },
      },
    });
  };

  const updateMonthChart = (labels, data) => {
    const ctx = document.getElementById('userChartMonth')?.getContext('2d');
    if (!ctx) return;

    if (updateMonthChartRef.current) {
      updateMonthChartRef.current.destroy();
    }

    updateMonthChartRef.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: '월별 매출 건수',
          data,
          borderColor: '#36A2EB',
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          tension: 0.2,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: { y: { beginAtZero: true } },
      },
    });
  };

  const dailyTotalPages = Math.ceil(dailyTotalCount / itemsPerPage);
  const monthlyTotalPages = Math.ceil(monthlyTotalCount / itemsPerPage);
  const salesTotalPages = Math.ceil(salesDataTotalCount / itemsPerPage);

  return (
    <div className='infoManagement'>
      <AdminSideBar />
      <div className='info-content'>
        <div className='info-section-title-box'>
          <h2>이용권 현황</h2>
        </div>

        <div className='info-section-content-box'>
          {/* 일별 현황 */}
          <div>
            <div className='info-header'>
              <div className='info-controls'>
                <h2>일별 현황</h2>
              </div>
            </div>

            <div className="chartData">
                <div className="salesChart">
                  <canvas id="userChartDay"></canvas>
                </div>
                <table className='info-table'>
                  <thead>
                    <tr>
                      <th>일별</th>
                      <th>결제 횟수</th>
                      <th>매출액</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dailyData.map((item, index) => (
                      <tr key={`${item.day_sale_date}-${index}`}>
                        <td>{item.day_sale_date}</td>
                        <td>{item.total_count}</td>
                        <td>{item.total_sales}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <Pagination
                  currentPage={dailyPage}
                  totalPages={dailyTotalPages}
                  setCurrentPage={setDailyPage}
                />
            </div>
          </div>

          {/* 월별 현황 */}
          <div>
          <div className="chartData">
            <div className='info-header'>
              <div className='info-controls'>
                <h2>월별 현황</h2>
              </div>
            </div>
            <div className="salesChart">
              <canvas id="userChartMonth"></canvas>
            </div>
            <table className='info-table'>
              <thead>
                <tr>
                  <th>월별</th>
                  <th>결제 횟수</th>
                  <th>매출액</th>
                </tr>
              </thead>
              <tbody>
                {monthlyData.map((item, index) => (
                  <tr key={`${item.month_sale_date}-${index}`}>
                    <td>{item.month_sale_date}</td>
                    <td>{item.total_count}</td>
                    <td>{item.total_sales}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Pagination
              currentPage={monthlyPage}
              totalPages={monthlyTotalPages}
              setCurrentPage={setMonthlyPage}
            />
          </div>
          </div>
          

        {/* 결제 내역 */}
        <div>
          <div className="chartData">
            <div className='info-header'>
              <div className='info-controls'>
                <h2>결제 내역</h2>
              </div>
            </div>
           
            <table className='info-table'>
              <thead>
                <tr>
                  <th>결제 ID</th>
                  <th>회원 ID</th>
                  <th>이름</th>
                  <th>주문명</th>
                  <th>금액</th>
                  <th>결제 날짜</th>
                  <th>상태</th>
                  <th>처리</th>
                </tr>
              </thead>
              <tbody>
                {salesData.map((item) => (
                  <tr key={item.order_id}>
                    <td>{item.order_id}</td>
                    <td>{item.login_id}</td>
                    <td>{item.user_name}</td>
                    <td>{item.order_name}</td>
                    <td>{item.amount}</td>
                    <td>{item.paid_date}</td>
                    <td>{item.pay_status}</td>      
                    <td><button className="refundButton">환 불</button></td>                      
                  </tr>
                ))}
              </tbody>
            </table>
            <Pagination
              currentPage={salesDataPage}
              totalPages={salesTotalPages}
              setCurrentPage={setsalesDataPage}
              />
          </div>
        </div>
        </div>
        </div>
    </div>
  );
};

export default SubscriptManagement;
