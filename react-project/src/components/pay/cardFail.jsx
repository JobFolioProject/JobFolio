import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const CardFail = () => {
  const navigate = useNavigate();

  useEffect(() => {
    alert('결제에 실패했습니다.');
    const timer = setTimeout(() => {
      navigate('/pay');
    }, 1000); 

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="card-fail">
    </div>
  );
};

export default CardFail;
