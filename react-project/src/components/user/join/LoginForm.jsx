import '../../../css/user/join/join.css';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const LoginForm = ({ onClose }) => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();
        navigate('/login-form');
        onClose();
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
                    <form onSubmit={handleLogin} className="login-form">
                        <div className="input-group">
                        이메일
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="input-group">
                            비밀번호
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className='login-btn user-login'>
                            <span className="login-text">로그인</span>
                        </button>
                    </form>
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

export default LoginForm; 