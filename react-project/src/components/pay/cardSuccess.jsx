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
        const res = await axios.post('/api/pay/cardSuccess', {
          paymentKey,
          orderId,
          amount,
          product_no,
          user_no,
          order_name,
        });

        if (res.data.status === 'success') {
          console.log('결제 성공', res.data);
          navigate('/pay');
        }
    };

    if (orderId && paymentKey && amount) {
      confirmPayment();
    } else {
      alert('결제 필수 정보 누락');
      navigate('/pay/cardFail');
    }
  }, [searchParams, navigate]);

  return (
    <div className="card-success">
    </div>
  );
};

export default CardSuccess;
