import '../../css/community/CommuNotice.css';
import CommuMenuBar from './CommuMenuBar';

const CommuNotice = () => {
   
    return (
    <>
        <div className="notice-banner">
            <img src="/resources/img/banner.png" alt="Banner" />
            <h1>공지사항</h1>
        </div>
    <CommuMenuBar/>
        <div className='community-notice-container'>
            <div className="community-notice-wrapper">
                <div className="communitiy-notice-title">
                    <h1>
                        공지사항 페이지 입니다.
                    </h1>
                </div>
                <div className='community-notice-top'>
                    <div className='community-notice-tap'>
                        <ul className='notice-tap-list'>
                            <li>전체</li>
                            <li>중요</li>
                            <li>안내</li>
                        </ul>
                    </div>
                    <div className='community-notice-search'>
                        <input type="text" name="" id="" placeholder='검색'/>
                    </div>
                </div>
                <div className="community-notice-content">
                    <div className="community-notice-emphasize">
                        <ul>
                            <li>
                                필독사항1
                            </li>
                            <li>
                                필독사항2
                            </li>
                            <li>
                                필독사항3
                            </li>
                        </ul>                    
                    </div>
                    <div className="community-notice-standard">
                        <ul>
                            <li>
                                일반공지1
                            </li>
                            <li>
                                일반공지2
                            </li>
                            <li>
                                일반공지3
                            </li>
                        </ul>
                    </div>
                    <div className="community-notice-pagination">
                        페이지네이션 자리
                    </div>
                </div>
            </div>
        </div>
    </>
    );
};

export default CommuNotice;