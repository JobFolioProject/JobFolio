import '../../../css/admin/adminComponents/NoticeManagement.css';
import AdminSideBar from '../AdminSideBar';

const NoticeManagement = () => {
   
    return (
    <div className='noticeManagement'>
    <AdminSideBar/>
        <h1>
            공지사항 관리 페이지 입니다.
        </h1>
    </div>
    );
};

export default NoticeManagement;