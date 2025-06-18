import '../../css/pay/Payment.css';

import axios from '../../utils/axiosConfig';
import { loadTossPayments } from '@tosspayments/sdk';
import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const clientKey = "test_ck_D5GePWvyJnrK0W0k6q8gLzN97Eoq";

const Payment = () => {
  const [productList, setProductList] = useState([]);
  const [payment, setPayment] = useState(null);
  const { user } = useAuth();

  // 상품 목록 불러오기
  const mainProductList = async () => {
    try {
      const res = await axios.post('api/product/mainProductList');
      setProductList(res.mainProductList);
    } catch (err) {
      alert(err.message);
    }
  };

  useEffect(() => {
    mainProductList();
  }, []);

  // TossPayments 초기화
  useEffect(() => {
    async function initToss() {
      const tossPayments = await loadTossPayments(clientKey);
      setPayment(tossPayments);
    }
    initToss();
  }, []);

  // 결제 요청 함수
  const requestPayment = async (product) => {
    try {
      const res = await axios.post("/api/pay/insertOrder", {
        product_no: product.product_no,
        order_name: product.product_name,
        amount: Number(product.price),
        user_no: user.userNo,
      });

      console.log("🔥 insertOrder 응답:", res);
  
      const { orderId, amount, order_name: orderName } = res;
  
      const parsedAmount = parseInt(amount, 10);
  
      if (!orderId || !orderName || isNaN(parsedAmount) || parsedAmount <= 0) {
        console.error("❌ 결제 정보 오류", orderId, orderName, parsedAmount);
        return;
      }
  
      const tossPayments = await loadTossPayments(clientKey);
  
      await tossPayments.requestPayment("CARD", {
        amount: parsedAmount,
        orderId: orderId,
        orderName: orderName,
        successUrl: window.location.origin + "/pay/cardSuccess",
        failUrl: window.location.origin + "/api/pay/cardFail",
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
