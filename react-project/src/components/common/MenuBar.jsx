import { Link } from 'react-router-dom';
import {  useState } from 'react';
import '../../css/common/MenuBar.css';
import Login from '../user/Login';


const MenuBar = () => {
    const loginUser = sessionStorage.getItem('loginUser'); // loginUser 객체를 JSON.parse로 파싱
    const status = loginUser?.status || ''; // loginUser가 null일때 status를 빈 문자열로 초기화
    const [menuOpen, setMenuOpen] = useState(false); // 메뉴 열고 닫기
    const [showLoginModal, setShowLoginModal] = useState(false); // 모달 열기 상태

    const toggleMenu = () => {
    setMenuOpen(!menuOpen); // 메뉴 상태를 토글
    };

    {/* 로그아웃시 세선에 있는 로그인 정보 삭제 후 페이지 전송 */}
    const logout = () => {
    sessionStorage.removeItem('loginUser');
    window.location.href = '/';
    };

    return (
     <div className={`navbar ${menuOpen ? 'active' : ''}`}>
        <div className="toggle-button" onClick={toggleMenu}>
        </div>
        <div className="logo">
        <img src="/resources/logo/logo.png" alt="로고" className="logoImg" />
        <Link to="/">JOBFOLIO</Link>
        </div>
        <ul>
        <li><Link to="/resume">이력서</Link></li>
        <li><Link to="/interview">면접연습</Link></li>
        <li><Link to="/pay">이용권</Link></li>
        <li><Link to="/community/notice">커뮤니티</Link></li>
        {loginUser === 'user' && (
            <li><Link to="myPage">마이페이지</Link></li>
        )}
        {/* status가 'admin'일 때만 관리자 메뉴를 보여줌, 추후 마이페이지와 관리자 페이지 모두 설정할 것 */}
        {loginUser === 'admin' && (
            <li><Link to="/adminPage">관리자</Link></li>
        )}
        </ul>
        <div className="user-options">
        {loginUser ? (
            <>
            <span onClick={logout} style={{ cursor: 'pointer' }}>Logout</span>
            </>
        ) : (
             <span onClick={() => setShowLoginModal(true)} style={{ cursor: 'pointer' }}>LOG IN</span>
        )}
        </div>
        {showLoginModal && <Login onClose={() => setShowLoginModal(false)} />}
    </div>
    );
};

export default MenuBar;
