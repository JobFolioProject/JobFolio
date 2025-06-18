import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from '../../utils/axiosConfig';

const CardSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const orderId = searchParams.get('orderId');
    const paymentKey = searchParams.get('paymentKey');
    const amount = searchParams.get('amount');

    const confirmPayment = async () => {
      try {
        const res = await axios.post('/api/pay/cardSuccess', {
          orderId,
          paymentKey,
          amount,
        });
          console.log('✅ 결제 성공', res);
          navigate('/pay'); 
      } catch (err) {
        console.error('❌ 결제 승인 처리 실패', err);
        alert('결제 승인 처리에 실패했습니다.');
        navigate('/pay'); 
      }
    };

    if (orderId && paymentKey && amount) {
      confirmPayment();
    }
  }, [searchParams, navigate]);

  return (
    <div className="card-success">
      <h2>결제가 완료되었습니다.</h2>
      <p>이용해 주셔서 감사합니다.</p>
    </div>
  );
};

export default CardSuccess;
