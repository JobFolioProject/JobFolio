import '../../../css/admin/adminComponents/UserManagement.css';
import AdminSideBar from '../AdminSideBar';

const UserManagement = () => {
   
    return (
    <div className='userManagement'>
    <AdminSideBar/>
        <h1>
            회원관리 페이지 입니다.
        </h1>
    </div>
    );
};

export default UserManagement;