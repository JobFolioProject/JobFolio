import '../../css/user/MyPage.css';
import SideBar from './myPageComponent/SideBar';
import { Outlet, useLocation } from 'react-router-dom';

const MyPage = () => {
    const location = useLocation();

    // 현재 경로에 따른 제목 매핑
    const getPageTitle = (path) => {
        if (path === '/myPage') {
            return '회원정보';
        }

        switch (path) {
            case '/myPage/userInfo':
                return '회원정보';
            case '/myPage/resumeDetail':
                return '이력서 내역';
            case '/myPage/myCareer':
                return '내 커리어';
            case '/myPage/payHistory':
                return '결제 내역';
            case '/myPage/postLike':
                return '좋아요 내역';
            default:
                return '';
        }
    };

    const pageTitle = getPageTitle(location.pathname);

    return (
        <div className="MyPage">
            <SideBar />
            <div className="mypagebg">
                <div className="mypageContainer">
                    <div className="mypageContent">
                        <h1 className='mypageHead'>{pageTitle}</h1>
                        <div className='mypageContentWrap'>
                            <Outlet />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyPage;