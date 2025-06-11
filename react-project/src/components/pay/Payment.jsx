import '../../css/pay/Payment.css';

const Payment = () => {
   
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

                    <div className='paymentCard'>
                        <div>
                        <div className='paymentCardTitle'>1개월권</div>
                        <hr />
                        <div className='paymentCardDesc'>
                            <ul className='paymentCardDescList'>
                                <li className='paymentCardDescList_li'>1개월권</li>
                                <li className='paymentCardDescList_li'>AI 템플릿 생성</li>
                                <li className='paymentCardDescList_li'>이력서 작성 무제한</li>
                            </ul>
                            </div>
                        </div>
                        <div className="paymentCardBottom">
                            <div className='paymentCardPrice'>10,000원</div>
                            <button className='paymentCardButton'>구매하기</button>
                        </div>
                    </div>

                    <div className='paymentCard'>
                        <div>
                        <div className='paymentCardTitle'>6개월권</div>
                        <hr />
                        <div className='paymentCardDesc'>
                            <ul className='paymentCardDescList'>
                                <li className='paymentCardDescList_li'>6개월권</li>
                                <li className='paymentCardDescList_li'>AI 템플릿 생성</li>
                                <li className='paymentCardDescList_li'>이력서 작성 무제한</li>
                            </ul>
                            </div>
                        </div>
                        <div className="paymentCardBottom">
                            <div className='paymentCardPrice'>60,000원</div>
                            <button className='paymentCardButton'>구매하기</button>
                        </div>
                    </div>

                    <div className='paymentCard'>
                        <div>
                        <div className='paymentCardTitle'>12개월권</div>
                        <hr />
                        <div className='paymentCardDesc'>
                            <ul className='paymentCardDescList'>
                                <li className='paymentCardDescList_li'>365일권</li>
                                <li className='paymentCardDescList_li'>AI 템플릿 생성</li>
                                <li className='paymentCardDescList_li'>이력서 작성 무제한</li>
                            </ul>
                            </div>
                        </div>
                        <div className="paymentCardBottom">
                            <div className='paymentCardPrice'>120,000원</div>
                            <button className='paymentCardButton'>구매하기</button>
                        </div>
                    </div>

                </div>
                
                <div className='paymentDescSection'>
                    <h2>사용권 활용 및 환불안내</h2>

                    <section class="accordion">
                        <details>
                            <summary class="question"><span>Q.</span>사용권은 어디에 사용할 수 있나요?</summary>
                            <div class="answer">
                            컨텐츠 이용 중 사용권 안내 메시지가 나올 경우 해당 사용권 만큼 차감이 됩니다. 대표적으로 자기소개서 생성시 사용되는 사용권은 1개, 면접에 사용되는 사용권은 2개입니다.
                            </div>
                        </details>

                        <details>
                            <summary class="question"><span>Q.</span>구매한 사용권의 환불기준</summary>
                            <div class="answer">
                            구매한 사용권을 전혀 사용하지 않은 경우에 한해 구매일로 부터 7일이래(달력일 기준, 구매일 포함) 아래 고객센터(카카오톡 혹은 이메일)로 환불의사를 전달해 주실 경우 100% 환불이 진행됩니다. 단, 사용권을 일부 사용하거나 환불 기한이 지난 경우는 잔여 사용권이 있더라도 부분 환불이 불가능합니다. 추가로 위 조건을 충족하여 환불이 진행되면, 결제내역은 즉시 취소가 되나 결제수단별(카드사)로 실제환급이 이뤄지기까지 카드사 사정에 따라 상이할 수 있습니다.(앱에서 구매를 한 경우, 구매한 스토어에서 환불여부를 결정하여 하이잡서비스에서는 환불여부 결정을 하지 못합니다.)
                            </div>
                        </details>

                        <details>
                            <summary class="question"><span>Q.</span>구매한 사용권은 언제까지 사용이 가능한가요?</summary>
                            <div class="answer">
                            사용권별로 명시된 유효기간(구매일 포함한 달력일 기준)까지 사용이 가능하며, 이 날짜가 지난 이후에는 사용권이 남아 있더라도 사용이 불가능합니다.
                            </div>
                        </details>

                        <details>
                            <summary class="question"><span>Q.</span>사용권을 사용하여 받은 서비스의 품질은 어떻게 알 수 있나요?</summary>
                            <div class="answer">
                            구매 전 확인이 가능하도록, 서비스 가입시 일정 사용권을 무료로 제공해 드립니다. AI생성 품질은 일정 부분 편차가 있으나 무료 사용권 작성시 확인한 수준과 동일하게 유료로 구매시에도 생성합니다. 따라서 품질불만에 따른 환불은 불가능합니다. 다만 내용 깨짐이나 전혀 다른 내용이 출력이 되었다고 판단되시는 경우는 아래 카카오톡 고객센터 혹은 이메일로 연락주시면 확인 후 해당 자기소개서 작성시 사용한 사용권을 보상해 드립니다.
                            </div>
                        </details>
                    </section>
                    
                </div>
        </div>
    </div>
    );
};

export default Payment;
