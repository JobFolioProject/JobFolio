import '../../css/user/MyPage.css';
import SideBar from './myPageComponent/SideBar';

const MyPage = () => {
   
    return (
    <div className='MyPage'>
        <SideBar/>
            <h1>
                마이 페이지 입니다.
            </h1>
    </div>
    );
};

export default MyPage;
