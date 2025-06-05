import '../../../css/user/myPageComponent/UserInfo.css';
import SideBar from './SideBar';

const UserInfo = () => {
   
    return (
    <div className='UserInfo'>
        <SideBar/>
            <h1>
                회원정보 입니다.
            </h1>
    </div>
    );
};

export default UserInfo;
