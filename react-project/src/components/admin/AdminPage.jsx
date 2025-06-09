import '../../css/admin/AdminPage.css';
import AdminSideBar from './AdminSideBar';

const AdminPage = () => {
   
    return (
    <div className='adminPage'>
    <AdminSideBar/>
        <h1>
            관리자 페이지 입니다.
        </h1>
    </div>
    );
};

export default AdminPage;