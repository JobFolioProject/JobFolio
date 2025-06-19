import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const CardFail = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/pay');
    }, 5000); // 5초 후 자동 이동

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="card-fail">
      <h2>결제에 실패했습니다.</h2>
      <p>문제가 발생했습니다. 다시 시도해 주세요.</p>
      <p>잠시 후 결제 페이지로 이동합니다...</p>
    </div>
  );
};

export default CardFail;
