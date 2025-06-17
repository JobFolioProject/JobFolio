import { useEffect, useRef, useState } from 'react';
import '../../css/admin/AdminPage.css';
import AdminSideBar from './AdminSideBar';
import { Chart } from 'chart.js/auto';
import { instanceAdmin } from '../../utils/axiosConfig';

const AdminPage = () => {
 useEffect(() => {
    instanceAdmin.get(`http://${window.location.hostname}:3000/`);
  }, []);

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

  useEffect(() => {
    // 서버 상태 체크
    const checkServerHealth = async () => {
      try {
        const response = await instanceAdmin.get(`/api/admin/status-check`);
        if ( response.status === 'UP') {
          setServerStatus('Work');
          setServerColor('rgb(0, 175, 0)'); // 녹색
        } else {
          throw new Error('Health check failed');
        }
      } catch (error) {
        setServerStatus('Disconnect');
        setServerColor('red'); // 빨간색
        console.error('서버 상태 확인 실패:', error);
      }
    };
    checkServerHealth();


    // Total Earnings 데이터를 불러오는 API 호출
    const getTotalEarnings = async () => {
      try {
        const response = await fetch(`/api/admin/total-earnings`);
        if (response.ok) {
          const data = await response.json();
          setTotalEarnings(data); // 상태에 데이터 저장
        } else {
          console.error('Failed to fetch total earnings');
        }
      } catch (error) {
        console.error('Error fetching total earnings:', error);
      }
    };

    const getTotalConsumers = async () => {
      try {
        const response = await fetch(`/api/admin/total-consumers`);
        if (response.ok) {
          const data = await response.json();
          setTotalConsumers(data); // 상태에 데이터 저장
        } else {
          console.error('Failed to fetch total consumers');
        }
      } catch (error) {
        console.error('Error fetching total consumers:', error);
      }
    };

    const getTotalUsers = async () => {
      const url = `/api/admin/total-users`;

      try {
        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          setTotalUsers(data);
        } else {
          console.error('Failed to fetch total users');
        }
      } catch (error) {
        console.error('Error fetching total users:', error);
      }
    };

    // 월별 수익 데이터를 불러오는 API 호출
    const getMonthlyEarnings = async () => {
      try {
        const response = await fetch(`/api/admin/monthly-earnings`);
        if (response.ok) {
          const data = await response.json();

          // 데이터 확인 및 변환
          if (Array.isArray(data) && data.length > 0) {
            const labels = data.map(item => item.month); // 대소문자를 정확히 맞춤
            const earnings = data.map(item => item.earnings); // 대소문자를 정확히 맞춤
            updateEarningsChart(labels, earnings);
          } else {
            console.error('Invalid data format received from API');
          }
        } else {
          console.error('Failed to fetch monthly earnings');
        }
      } catch (error) {
        console.error('Error fetching monthly earnings:', error);
      }
    };


    // 차트2 데이터 불러오기
    const getConsumerData = async () => {
      try {
        const response = await fetch(`/api/admin/consumer-distribution`);
        if (response.ok) {
          const data = await response.json();

          // 차트 데이터 업데이트
          updateConsumerChart({
            normal: data.normal,
            subscribe1: data.subscribe1,
            subscribe2: data.subscribe2,
            subscribe3: data.subscribe3,
          });
          
        } else {
          console.error(`HTTP ${response.status}: ${response.statusText}`);
        }
      } catch (error) {
        console.error('Error fetching consumer distribution:', error);
      }
    };

    // 월별 가입 회원 데이터 가져오기
    const getMonthlyMembers = async () => {
      try {
        const response = await fetch(`/api/admin/monthly-members`);
        if (response.ok) {
          const data = await response.json();

          // 데이터에서 라벨과 값을 추출
          const labels = data.map(item => item.month); // "YYYY-MM" 형식의 월 데이터
          const memberCounts = data.map(item => item.memberCount); // 월별 회원 수
          updateUserChart(labels, memberCounts); // 차트 업데이트
        } else {
          console.error('월별 회원 데이터 요청 실패');
        }
      } catch (error) {
        console.error('월별 회원 데이터를 가져오는 중 오류 발생:', error);
      }
    };

    const getTotalTasks = async () => {
      try {
        const response = await fetch(`/api/admin/total-tasks`);
        if (response.ok) {
          const data = await response.json();
          setTotalTasks(data); // 상태 업데이트
        } else {
          console.error('Failed to fetch total tasks');
        }
      } catch (error) {
        console.error('Error fetching total tasks:', error);
      }
    };

    getTotalEarnings();
    getTotalConsumers();
    getTotalUsers();
    getMonthlyEarnings();
    getConsumerData();
    getMonthlyMembers();
    getTotalTasks();
    
  }, []);

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
    <div className="admin-main">
      <AdminSideBar />
      <div className="main-content">
        <h1>Dashboard</h1>
        <hr />

        <section className="dashboard">
          <div className="dashboard-cards">

            {/* Total Earnings */}
            <div className="card">
              <h3>Total Earnings</h3>
              <p>{totalEarnings.toLocaleString()}</p>
            </div>

            {/* Total Consumer */}
            <div className="card">
              <h3>Total Subscribers</h3>
              <p>{totalConsumers}</p>
            </div>

            {/* Total User */}
            <div className="card">
              <h3>Total User</h3>
              <p>{totalUsers}</p>
            </div>

            {/* Total Tasks */}
            <div className="card">
              <h3>Total Tasks</h3>
              <p>{totalTasks}</p>
            </div>
          </div>

          <div className="charts-projects">
            {/* 차트 1 */}
            <div className="chart">
              <canvas id="earningsChart"></canvas>
            </div>

            {/* 차트 2 */}
            <div className="chartTwo">
              <canvas id="consumerChart"></canvas>
            </div>

            {/* 차트 3 */}
            <div className="chart3">
              <canvas id="userChart"></canvas>
            </div>

            {/* 프로젝트 리스트 */}
            <div className="projects">
              <h3>Latest Function</h3>
              <ul>
                <li>
                  Open AI - Status:{' '}
                  <span style={{ color: 'rgb(0, 175, 0)' }}>Work</span>
                </li>
                <li>
                  Open API - Status:{' '}
                  <span style={{ color: 'rgb(0, 175, 0)' }}>Work</span>
                </li>
                <li>
                  Web Server - Status:{' '}
                  <span style={{ color: serverColor }}>{serverStatus}</span>
                </li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
    );
};

export default AdminPage;