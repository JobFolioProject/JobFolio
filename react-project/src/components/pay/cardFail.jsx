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
    </div>
  );
};

export default CardFail;
