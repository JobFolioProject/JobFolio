import '../../css/user/MyPage.css';
import SideBar from './myPageComponent/SideBar';

const MyPage = () => {
    return (
        <div className="MyPage">
            <div className="container">
                <SideBar />
                <h1>마이 페이지 입니다.</h1>
            </div>
        </div>
    );
};

export default MyPage;
