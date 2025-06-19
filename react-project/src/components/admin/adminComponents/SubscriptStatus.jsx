import axios from '../../../utils/axiosConfig';
import '../../../css/admin/adminComponents/InfoManagement.css';
import '../../../css/admin/AdminPage.css';
import AdminSideBar from '../AdminSideBar';
import Pagination from '../../common/Pagination.jsx';

import { useState, useRef, useEffect } from 'react';
import { Chart } from 'chart.js/auto';


const SubscriptManagement = () => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('/api/admin/product/productList', {
          params: {
            currentpage: currentPage,
            pagesize: itemsPerPage
          }
        });
          setData(res.productList);
          setTotalCount(res.totalcnt);
      } catch (err) {
        console.error('상품 안내 불러오기 실패:', err);
      }
    };

    fetchData();
  }, [currentPage]);
  
  const itemsPerPage = 5;
  const currentItems = data;
  const totalPages = Math.ceil(totalCount / itemsPerPage);

  
  // 차트 구역
  // useEffect(() => {
  //   instanceAdmin.get(`http://${window.location.hostname}:3000/`);
  // }, []);



  const earningsChartRef = useRef(null);
  const consumerChartRef = useRef(null);
  const userChartRef = useRef(null);

  
  // 서버 상태 체크
  const [serverStatus, setServerStatus] = useState('Checking...'); // 서버 상태
  const [serverColor, setServerColor] = useState('rgb(0, 175, 0)'); // 상태 색상 (기본값: 녹색)

  // Total Earnings 상태 관리
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [totalConsumers, setTotalConsumers] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0); // Total Users 상태 추가
  const [totalTasks, setTotalTasks] = useState(0); // Total Tasks 상태 추가

  
  // 서버 상태 체크를 위해 60초마다 새로고침
  useEffect(() => {
    const interval = setInterval(() => {
      window.location.reload();
    }, 60 * 1000); // 60초마다 새로고침

    return () => clearInterval(interval); // 컴포넌트 언마운트 시 인터벌 제거
  }, []);

//   useEffect(() => {
//     // 서버 상태 체크
//     const checkServerHealth = async () => {
//       try {
//         const response = await instanceAdmin.get(`/api/admin/status-check`);
//         if ( response.status === 'UP') {
//           setServerStatus('Work');
//           setServerColor('rgb(0, 175, 0)'); // 녹색
//         } else {
//           throw new Error('Health check failed');
//         }
//       } catch (error) {
//         setServerStatus('Disconnect');
//         setServerColor('red'); // 빨간색
//         console.error('서버 상태 확인 실패:', error);
//       }
//     };
//     checkServerHealth();


//     // Total Earnings 데이터 불러오기
// const getTotalEarnings = async () => {
//   try {
//     const response = await axios.get('/api/admin/total-earnings');
//     setTotalEarnings(response);
//   } catch (error) {
//     console.error('Error fetching total earnings:', error);
//   }
// };

// // Total Consumers 데이터 불러오기
// const getTotalConsumers = async () => {
//   try {
//     const response = await axios.get('/api/admin/total-consumers');
//     setTotalConsumers(response);
//   } catch (error) {
//     console.error('Error fetching total consumers:', error);
//   }
// };

// // Total Users 데이터 불러오기
// const getTotalUsers = async () => {
//   try {
//     const response = await axios.get('/api/admin/total-users');
//     setTotalUsers(response);
//   } catch (error) {
//     console.error('Error fetching total users:', error);
//   }
// };

// // 월별 수익 데이터 불러오기
// const getMonthlyEarnings = async () => {
//   try {
//     const response = await axios.get('/api/admin/monthly-earnings');
//     const data = response;
//     if (Array.isArray(data) && data.length > 0) {
//       const labels = data.map(item => item.month);
//       const earnings = data.map(item => item.earnings);
//       updateEarningsChart(labels, earnings);
//     } else {
//       console.error('Invalid data format received from API');
//     }
//   } catch (error) {
//     console.error('Error fetching monthly earnings:', error);
//   }
// };

// // 차트2: 소비자 분포 데이터
// const getConsumerData = async () => {
//   try {
//     const response = await axios.get('/api/admin/consumer-distribution');
//     const data = response;
//     updateConsumerChart({
//       normal: data.normal,
//       subscribe1: data.subscribe1,
//       subscribe2: data.subscribe2,
//       subscribe3: data.subscribe3,
//     });
//   } catch (error) {
//     console.error('Error fetching consumer distribution:', error);
//   }
// };

// // 월별 가입 회원 수 데이터
// const getMonthlyMembers = async () => {
//   try {
//     const response = await axios.get('/api/admin/monthly-members');
//     const data = response;
//     const labels = data.map(item => item.month);
//     const memberCounts = data.map(item => item.memberCount);
//     updateUserChart(labels, memberCounts);
//   } catch (error) {
//     console.error('월별 회원 데이터를 가져오는 중 오류 발생:', error);
//   }
// };

// // 총 작업 수 데이터
// const getTotalTasks = async () => {
//   try {
//     const response = await axios.get('/api/admin/total-tasks');
//     setTotalTasks(response);
//   } catch (error) {
//     console.error('Error fetching total tasks:', error);
//   }
// };

//     getTotalEarnings();
//     getTotalConsumers();
//     getTotalUsers();
//     getMonthlyEarnings();
//     getConsumerData();
//     getMonthlyMembers();
//     getTotalTasks();
    
//   }, []);

  const updateEarningsChart = (labels, data) => {
    const canvas = document.getElementById('earningsChart');
    if (!canvas) {
      console.error('earningsChart element is not found.');
      return;
    }

    const ctx = canvas.getContext('2d');

    // 기존 차트를 제거
    if (earningsChartRef.current) {
      earningsChartRef.current.destroy();
    }

    earningsChartRef.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels, // 월별 라벨
        datasets: [
          {
            label: 'Monthly Earnings',
            data: data, // 월별 수익 데이터
            backgroundColor: 'rgba(54, 162, 235, 0.6)',
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false, // 차트 크기 유지
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  };

  const updateConsumerChart = (data) => {
    const canvas = document.getElementById('consumerChart');
    if (!canvas) {
      console.error('consumerChart element is not found.');
      return;
    }

    const ctx = canvas.getContext('2d');

    // 기존 차트를 제거
    if (consumerChartRef.current) {
      consumerChartRef.current.destroy();
    }

    consumerChartRef.current = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Normal', 'Subscribe1', 'Subscribe2', 'Subscribe3'],
        datasets: [
          {
            label: 'User Distribution',
            data: [data.normal, data.subscribe1, data.subscribe2, data.subscribe3],
            backgroundColor: ['#ff6384', '#36a2eb', '#cc65fe', '#ffce56'],
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
      },
    });
  };

  const updateUserChart = (labels, data) => {
    const canvas = document.getElementById('userChart');
    if (!canvas) {
      console.error('userChart 요소를 찾을 수 없습니다.');
      return;
    }

    const ctx = canvas.getContext('2d');

    // 기존 차트 제거
    if (userChartRef.current) {
      userChartRef.current.destroy();
    }

    userChartRef.current = new Chart(ctx, {
      type: 'line', // 선형 차트
      data: {
        labels: labels, // 월별 라벨
        datasets: [
          {
            label: '월별 가입 회원 수',
            data: data, // 회원 수 데이터
            borderColor: 'rgb(75, 192, 192)', // 선 색상
            backgroundColor: 'rgba(75, 192, 192, 0.5)', // 투명한 배경색
            tension: 0.1, // 곡선 부드러움
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true, // Y축 0부터 시작
          },
        },
      },
    });
}
  

  
  return (
    <div className='infoManagement'>
      <AdminSideBar />
      <div className='info-content'>
        <div className='info-section-title-box'>
          <h2>이용권 현황</h2>
        </div>

        <div className='info-section-content-box'>
          <div>
          <div className='info-header'>
            <div className='info-controls'>
             <h2>일별 현황</h2>
            </div>
          </div>

            {/* 차트 3 */}
            <div className="chart3">
              <canvas id="userChartDay"></canvas>
            </div>

            <table className='info-table'>
            <thead>
              <tr>
                <th>날짜</th>
                <th>상품명</th>
                <th>결제 횟수</th>
                <th>매출액</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((item) => (
                <tr key={item.product_no}>
                  <td>{item.created_date}</td>
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

      <div>
          <div className='info-header'>
            <div className='info-controls'>
             <h2>월별 현황</h2>
            </div>
          </div>

           {/* 차트 3 */}
           <div className="chart3">
            <canvas id="userChartMonth"></canvas>
            </div>

            <table className='info-table'>
            <thead>
              <tr>
                <th>날짜</th>
                <th>상품명</th>
                <th>결제 횟수</th>
                <th>매출액</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((item) => (
                <tr key={item.product_no}>
                  <td>{item.created_date}</td>
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
    </div>
  );
};

export default SubscriptManagement;