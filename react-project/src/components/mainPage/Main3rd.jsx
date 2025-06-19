import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Typed } from 'react-typed';
import "../../css/mainPage/Main3rd.css";
import { motion, useAnimation } from 'framer-motion';

const slides = [
  {
    title: "JobFolio",
    desc:
      "Job과 Portfolio의 합성어로 이력서 제작을 통해 일과 더욱 가까워 질 수 있게 사용자들을 돕는다는 의미를 지니고 있습니다.",
    image:
      "https://img.freepik.com/free-vector/company-concept-illustration_114360-2581.jpg?semt=ais_hybrid&w=740"
  },
  {
    title: "About",
    desc:
      "이력서 하나로 취업 ∙ 이직 준비 끝!\n 신입이든 경력이든 회사별 양식에 맞춰 여러 번 작성할 필요 없이 AI를 통해 다양한 이력서를 생성할 수 있습니다.\n 기본 정보 기입만으로 다양한 이력서를 만들어 보세요.",
    image:
      "https://img.freepik.com/free-vector/architectural-firm-office-interior-isometric-view-with-architects-team-discussing-project-creating-3d-computer-models-illustration_1284-65741.jpg?semt=ais_hybrid&w=740"
  },
  {
    title: "Resume",
    desc: `이력서 생성은 다음 단계를 따르세요:\n
1. 마이페이지 회원 정보 입력\n2. 마이페이지 내 커리어 입력\n3. 이력서 페이지 자기소개서 기입\n4. 템플릿 선택\n5. 이력서 출력\n\n모든 데이터는 AI를 통해 자동 첨삭됩니다.`,
    image:
      "https://img.freepik.com/free-vector/choice-worker-concept_23-2148621781.jpg?semt=ais_hybrid&w=740"
  },
  {
    title: "License",
    desc: `이용권 구매는 간편하게:\n- 이용권 구매 페이지에서\n- 간편하게 결제\n- 월별 구독으로 사용하고 싶은만큼\n- 저렴한 금액으로 높은 만족도를\n\n결제 관련 문의는 관리자가 직접 상담해 드립니다.`,
    image:
      "https://img.freepik.com/free-vector/illustration-characters-transacting-money_53876-37252.jpg"
  },
  {
    title: "Detail",
    desc:
      "자세한 이용문의나 안내사항은 공지사항 및 이용안내를 이용하시되 불편한 사항이나 추가질문은 관리자에게 문의 부탁드립니다.",
    image:
      "https://gongu.copyright.or.kr/gongu/wrt/cmmn/wrtFileImageView.do?wrtSn=13221760&filePath=L2Rpc2sxL25ld2RhdGEvMjAxOS8yMS9DTFMxMDAwNC8xMzIyMTc2MF9XUlRfMjAxOTExMjFfMQ==&thumbAt=Y&thumbSe=b_tbumb&wrtTy=10004"
  }
];

const Main3rdImage = () => {
  const controls = useAnimation();
    useEffect(() => {
        const typed = new Typed(".auto-type", {
            strings: ["Junior", "Senior", "Between-jobs", "Professional in transition"],
            typeSpeed: 80,
            backSpeed: 80,
            loop: true,
        });

        return () => {
            typed.destroy();
        };
    }, []);

    useEffect(() => {
        const onLoadMap = () => {
            const cityhall = new window.naver.maps.LatLng(37.4856599, 126.8955428);
            const map = new window.naver.maps.Map('map', {
                center: cityhall.destinationPoint(0, 500),
                zoom: 15,
            });

            const marker = new window.naver.maps.Marker({
                map: map,
                position: cityhall,
            });

            const contentString = `
                <div class="iw_inner">
                    <p><strong>주소:</strong> 서울특별시 구로구 구로동 디지털로 285</p>
                    <p>에이스트윈타워 1차) 401호</p>
                    <p>02-852-7424 | 공공, 사회기관</p>
                </div>`;

            const infowindow = new window.naver.maps.InfoWindow({
                content: contentString,
            });

            window.naver.maps.Event.addListener(marker, 'click', function () {
                if (infowindow.getMap()) {
                    infowindow.close();
                } else {
                    infowindow.open(map, marker);
                }
            });

            infowindow.open(map, marker);
        };

        // Naver Maps API가 이미 로드되었는지 확인하고, 없다면 스크립트를 추가합니다.
        if (window.naver && window.naver.maps) {
            onLoadMap(); // 스크립트가 이미 로드된 경우 바로 지도 생성
        } else {
            const script = document.createElement('script');
            script.src = 'https://oapi.map.naver.com/openapi/v3/maps.js?ncpClientId=srbxbvs7lt';
            script.async = true;
            script.onload = onLoadMap;
            document.head.appendChild(script);
        }
    }, []);

    return (
      
            <div className="introduce-area">
              <div className="header-container">
                <h1>For <span className="auto-type">Programmer</span></h1>
            </div>
        <motion.div
                className="introduce"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false }}
                transition={{
                  ease: 'easeInOut',
                  duration: 1,
                  y: { duration: 1 },
                }}
            >
                <h2>About Us</h2>
                <div className="team-container">
                  {slides.map((item, index) => (
                    <div className="team-card" key={index}>
                      <img src={item.image} alt={`이미지`} />
                      <h3>{item.title}</h3>
                      <p>{item.desc.split("\n").map((line, idx) => (
                        <React.Fragment key={idx}>
                        {line}
                        <br />
                        </React.Fragment>
                    ))}</p>
                    </div>
                  ))}
                </div>
            </motion.div>
            
            <div className="timeline">
                <div className="timeline-container left-container">
                    <div className="text-box">
                        <h2>Project personnel</h2>
                        <small>25.06.02 - 25.06.04</small>
                        <p>Made up a team of nine members </p>
                        <span className="left-container-arrow"></span>
                    </div>
                </div>

                <div className="timeline-container right-container">
                    <div className="text-box">
                        <h2>Create a project name</h2>
                        <small>25.06.04 - 25.06.05</small>
                        <p>The project team name is JobFolio.</p>
                        <span className="right-container-arrow"></span>
                    </div>
                </div>

                <div className="timeline-container left-container">
                    <div className="text-box">
                        <h2>Project planning</h2>
                        <small>25.06.05 - 25.06.09</small>
                        <p>Plan based on open AI API web services.</p>
                        <span className="left-container-arrow"></span>
                    </div>
                </div>

                <div className="timeline-container right-container">
                    <div className="text-box">
                        <h2>Configuring a Project</h2>
                        <small>25.06.09 - 25.06.30</small>
                        <p>Configure the project based on React, Spring-boot.</p>
                        <span className="right-container-arrow"></span>
                    </div>
                </div>

                <div className="timeline-container left-container">
                    <div className="text-box">
                        <h2>Project completion</h2>
                        <small>25.06.30</small>
                        <p>Complete and deploy the project.</p>
                        <span className="left-container-arrow"></span>
                    </div>
                </div>
            </div>
            
            <div className="map-header">
                <h1>찾아오시는길</h1>
            </div>

            <div className="map-container">
                <div id="map"></div>
            </div>

            <div className="address-info">
                <p><strong>주소:</strong> 서울특별시 구로구 구로동 디지털로 285</p>
                <p>에이스트윈타워 1차) 401호</p>
                <p>02-852-7424 | 공공, 사회기관</p>
            </div>
        </div>
    );
};

export default Main3rdImage;