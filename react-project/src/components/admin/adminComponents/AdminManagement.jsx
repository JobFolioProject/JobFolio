import '../../../css/admin/adminComponents/AdminManagement.css';
import AdminSideBar from '../AdminSideBar';

const AdminManagement = () => {
   
    return (
    <div className='adminManagement'>
    <AdminSideBar/>
        <h1>
            관리자 계정 관리 페이지 입니다.
        </h1>
    </div>
    );
};

export default AdminManagement;