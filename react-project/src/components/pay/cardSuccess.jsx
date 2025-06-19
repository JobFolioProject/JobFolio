import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from '../../utils/axiosConfig';

const CardSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const user_no = searchParams.get('user_no');
    const product_no = searchParams.get('product_no');
    const order_name = searchParams.get('order_name');
    const orderId = searchParams.get('orderId');
    const paymentKey = searchParams.get('paymentKey');
    const amount = searchParams.get('amount');

    const confirmPayment = async () => {
      try {
        const res = await axios.post('/api/pay/cardSuccess', {
          paymentKey,
          orderId,
          amount,
          product_no,
          user_no,
          order_name,
        });
          console.log('결제 성공', res);
          navigate('/pay'); 
      } catch (err) {
        console.error('결제 승인 처리 실패', err);
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
    </div>
  );
};

export default CardSuccess;