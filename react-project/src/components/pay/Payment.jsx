import '../../css/pay/Payment.css';

import axios from 'axios';
import { loadTossPayments } from '@tosspayments/tosspayments-sdk';
import { useEffect, useState } from 'react';

const clientKey = "test_ck_D5GePWvyJnrK0W0k6q8gLzN97Eoq";
const customerKey = "syN4ED8k8qZuTmIXjuZMR";

const Payment = () => {
  const [productList, setProductList] = useState([]);
  const [payment, setPayment] = useState(null);
  const [amount] = useState({
    currency: "KRW",
    value: 50000,
  });

  // 상품 목록 불러오기
  const mainProductList = async () => {
    try {
      const res = await axios.post('/product/mainProductList');
      setProductList(res.data.mainProductList);
    } catch (err) {
      console.error('Failed to load product list:', err);
      alert(err.message);
    }
  };

  useEffect(() => {
    mainProductList();
  }, []);

  // TossPayments 초기화
  useEffect(() => {
    async function fetchPayment() {
      try {
        const tossPayments = await loadTossPayments(clientKey);
        const paymentInstance = tossPayments.payment({ customerKey });
        setPayment(paymentInstance);
      } catch (error) {
        console.error("Error initializing TossPayments:", error);
      }
    }

    fetchPayment();
  }, []);

  // 결제 요청 함수
  const requestPayment = async (product) => {
    try {
      const res = await axios.post("/pay/insertOrder", {
        product_no: product.product_no,
        order_name : product.product_name,
        amount: product.price,
        user_no: '4'
      });
  
      const { orderId, amount, order_name, user_no } = res.data;
  
      console.log(res.data);
      if (!payment) {
        alert("결제 시스템이 초기화되지 않았습니다.");
        return;
      }
      console.log(res.data);

      await payment.requestPayment({
        method: "CARD",
        user_no : user_no,
        amount: amount,
        orderId: orderId,
        order_name: order_name + "개월",
        successUrl: window.location.origin + "/pay/success?orderId=" + orderId,
        failUrl: window.location.origin + "/payment/fail?orderId=" + orderId,
        card: {
          useEscrow: false,
          flowMode: "DEFAULT",
          useCardPoint: false,
          useAppCardOnly: false,
        },
      });
    } catch (err) {
      console.error("결제 요청 실패:", err);
      alert("결제 중 오류가 발생했습니다.");
    }
  };
  
  return (
    <div className='payment'>
      <div className='paymentWrap'>
        <div className='paymentTitleSection'>
          <div className='paymentTitle1'>
            <span className='paymentTitlePoint'>저렴한 금액</span>으로
          </div>
          <div className='paymentTitle2'>
            이력서와 템플릿을 <span className='paymentTitlePoint2'>한번에!</span>
          </div>
        </div>

        <div className='paymentCardSection'>
          {productList.map((product) => (
            <div className='paymentCard' key={product.product_no}>
              <div>
                <div className='paymentCardTitle'>{product.product_name}</div>
                <hr />
                <ul className='paymentCardDescList'>
                  {(product.product_detail || '')
                    .split(/\r?\n/)
                    .map((line, idx) => (
                      <li className='paymentCardDescList_li' key={idx}>
                        {line.trim()}
                      </li>
                    ))}
                </ul>
              </div>
              <div className='paymentCardBottom'>
                <div className='paymentCardPrice'>
                  {product.price.toLocaleString()}원
                </div>
                <button
                  className='paymentCardButton'
                  onClick={() => requestPayment(product)}
                >
                  구매하기
                </button>

              </div>
            </div>
          ))}
        </div>

        <div className='paymentDescSection'>
          <h2>사용권 활용 및 환불안내</h2>

          <section className='accordion'>
            <details>
              <summary className='question'>
                <span>Q.</span>사용권은 어디에 사용할 수 있나요?
              </summary>
              <div className='answer'>
                컨텐츠 이용 중 사용권 안내 메시지가 나올 경우 해당 사용권만큼 차감됩니다. 대표적으로 자기소개서 1개, 면접 2개입니다.
              </div>
            </details>
            <details>
              <summary className='question'>
                <span>Q.</span>환불 기준은 어떻게 되나요?
              </summary>
              <div className='answer'>
                사용하지 않은 경우에 한해 7일 이내 100% 환불 가능합니다. 사용했거나 기한이 지난 경우는 불가합니다.
              </div>
            </details>
            <details>
              <summary className='question'>
                <span>Q.</span>사용권은 언제까지 사용 가능한가요?
              </summary>
              <div className='answer'>
                구매일로부터 유효기간 내 사용 가능합니다.
              </div>
            </details>
            <details>
              <summary className='question'>
                <span>Q.</span>품질을 미리 확인할 수 있나요?
              </summary>
              <div className='answer'>
                네, 무료 사용권을 통해 AI 생성 품질을 확인할 수 있습니다.
              </div>
            </details>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Payment;
