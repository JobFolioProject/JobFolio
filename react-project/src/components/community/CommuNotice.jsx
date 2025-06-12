import '../../css/community/CommuNotice.css';
import { Link, NavLink } from 'react-router-dom';
import CommuMenuBar from './CommuMenuBar';
import SearchIcon from '@mui/icons-material/Search';

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
                        공지사항
                    </h1>
                </div>
                <div className='community-notice-category'>
                    <div className='community-notice-tap'>
                        <ul className='notice-tap-list'>
                            <li><NavLink to="/">전체</NavLink></li>
                            <li><NavLink to="/">중요</NavLink></li>
                            <li><NavLink to="/">안내</NavLink></li>
                        </ul>
                    </div>
                    <div className='community-notice-search'>
                        <div className="community-notice-search-container">
                            <input className='community-notice-search-input' type="text" name="" id="" placeholder='검색'/>
                            <SearchIcon className='community-notice-search-icon'/>
                        </div>
                    </div>
                </div>
                <div className="community-notice-section">
                    <div className="community-notice-head">
                        <div className='notice-head-col num'>번호</div>
                        <div className='notice-head-col title'>제목</div>
                        <div className='notice-head-col write'>작성일</div>
                        <div className='notice-head-col author'>작성자</div>
                    </div>
                    <div className="community-notice-body">
                        <ul className="community-notice-list">
                            <li className='community-notice-list-item'>
                                <Link to="/">
                                    <div className='notice-body-col num'>1</div>
                                    <div className='notice-body-col title'>공지사항입니다</div>
                                    <div className='notice-body-col write'>2025-06-10</div>
                                    <div className='notice-body-col author'>관리자1</div>
                                </Link>
                            </li>                            
                            <li className='community-notice-list-item'>
                                <Link to="/">
                                    <div className='notice-body-col num'>1</div>
                                    <div className='notice-body-col title'>공지사항입니다</div>
                                    <div className='notice-body-col write'>2025-06-10</div>
                                    <div className='notice-body-col author'>관리자1</div>
                                </Link>
                            </li>                            
                            <li className='community-notice-list-item'>
                                <Link to="/">
                                    <div className='notice-body-col num'>1</div>
                                    <div className='notice-body-col title'>공지사항입니다</div>
                                    <div className='notice-body-col write'>2025-06-10</div>
                                    <div className='notice-body-col author'>관리자1</div>
                                </Link>
                            </li>                            
                            <li className='community-notice-list-item'>
                                <Link to="/">
                                    <div className='notice-body-col num'>1</div>
                                    <div className='notice-body-col title'>공지사항입니다</div>
                                    <div className='notice-body-col write'>2025-06-10</div>
                                    <div className='notice-body-col author'>관리자1</div>
                                </Link>
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