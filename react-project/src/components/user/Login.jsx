import '../../css/user/Login.css';
import { useNavigate } from 'react-router-dom'

const Login = () => {


    const userLogin=() => {
        sessionStorage.setItem('loginUser', "user");
        window.location.href = '/'; // 메인 페이지로 이동
    }

    const adminLogin=() => {
        sessionStorage.setItem('loginUser', "admin");
        window.location.href = '/'; // 메인 페이지로 이동v
    }
   
    return (
    <div className='login'>
        <h1>
            로그인 페이지 입니다.
        </h1>
        <button onClick={userLogin}>유저 로그인</button>
        <button onClick={adminLogin}>관리자 로그인</button>
    </div>
    );
};

export default Login;
