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

        console.log('결제 승인 응답:', res);

        if (res.success) {
          alert('결제가 완료되었습니다.');
          navigate('/pay');
        } else {
          alert('결제에 실패했습니다.');
          navigate('/pay');
        }

      } catch (err) {
        console.error('결제 승인 처리 에러:', err);
        alert('결제 중 오류가 발생했습니다.');
        navigate('/pay');
      }
    };

    if (orderId && paymentKey && amount) {
      confirmPayment();
    }
  }, [searchParams, navigate]);

  return <div className="card-success"></div>;
};

export default CardSuccess;
