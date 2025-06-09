import '../../css/user/Login.css';
import { useNavigate } from 'react-router-dom'

const Login = ({onClose}) => {


    const userLogin=() => {
        sessionStorage.setItem('loginUser', "user");
        window.location.href = '/'; // 메인 페이지로 이동
    }

    const adminLogin=() => {
        sessionStorage.setItem('loginUser', "admin");
        window.location.href = '/'; // 메인 페이지로 이동v
    }
   
    return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className='login'>
            <h1>
                로그인 모달창 입니다.
            </h1>
            <button className='loginBtn' onClick={userLogin}>유저 로그인</button>
            <button className='loginBtn' onClick={adminLogin}>관리자 로그인</button>
        </div>
        <button className="close-button" onClick={onClose}>x</button>
      </div>
    </div>
    );
};

export default Login;
