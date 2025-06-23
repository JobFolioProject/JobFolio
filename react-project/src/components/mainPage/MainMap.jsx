import React, { useEffect } from 'react';
import "../../css/mainPage/MainMap.css";


const MainMap = () => {

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
      
        <div className="mainMap">
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

export default MainMap;