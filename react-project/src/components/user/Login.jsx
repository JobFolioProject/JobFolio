import '../../css/user/join.css';
import { useNavigate } from 'react-router-dom'

const Login = ({onClose}) => {
    const navigate = useNavigate();

    const userLogin = () => {
        sessionStorage.setItem('loginUser', "user");
        window.location.href = '/';
    }

    const naverLogin = () => {
        sessionStorage.setItem('loginUser', "naver");
        window.location.href = '/';
    }

    const kakaoLogin = () => {
        sessionStorage.setItem('loginUser', "kakao");
        window.location.href = '/';
    }

    const goToFindPassword = () => {
        navigate('/find-password');
    }

    const goToFindId = () => {
        navigate('/find-id');
    }

    const goToJoin = () => {
        navigate('/join');
    }
   
    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className='login-container'>
                    <h1 className="login-title">jobfollio</h1>
                    <h3 className="login-subtitle">Ai기반의 자기소개서 생성서비스</h3>
                    <div className="login-buttons">
                        <button className='login-btn user-login' onClick={userLogin}>로그인</button>
                        <button className='login-btn kakao-login' onClick={kakaoLogin}>카카오 로그인</button>
                        <button className='login-btn naver-login' onClick={naverLogin}>네이버 로그인</button>
                    </div>
                    <div className="login-links">
                        <span onClick={goToFindPassword}>비밀번호 찾기</span>
                        <span className="divider">|</span>
                        <span onClick={goToFindId}>아이디 찾기</span>
                        <span className="divider">|</span>
                        <span onClick={goToJoin}>회원가입</span>
                    </div>
                </div>
                <button className="close-button" onClick={onClose}>×</button>
            </div>
        </div>
    );
};

export default Login;
