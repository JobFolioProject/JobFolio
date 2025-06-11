import '../../../css/user/join/LoginForm.css';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const LoginForm = ({ onClose }) => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();
        // 로그인 로직 구현 필요
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
            <div className="modal-content loginform-modal-content">
                <div className='loginform-container'>
                <h1 className="login-title">jobfollio</h1>
                    <h3 className="loginform-subtitle mb-4">AI기반의 자기소개서 생성서비스</h3>
                    <form onSubmit={handleLogin} className="loginform-form">
                        <div className="mb-3 text-start">
                            <label htmlFor="email" className="form-label">이메일</label>
                            <input
                                type="email"
                                className="form-control"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                autoComplete="username"
                            />
                        </div>
                        <div className="mb-4 text-start">
                            <label htmlFor="password" className="form-label">비밀번호</label>
                            <input
                                type="password"
                                className="form-control"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                autoComplete="current-password"
                            />
                        </div>
                        <button type="submit" className='btn btn-primary loginform-btn w-100'>
                            로그인
                        </button>
                    </form>
                    <div className="loginform-links mt-4">
                        <span onClick={goToFindPassword} className="loginform-link">비밀번호 찾기</span>
                        <span className="loginform-divider">|</span>
                        <span onClick={goToFindId} className="loginform-link">아이디 찾기</span>
                        <span className="loginform-divider">|</span>
                        <span onClick={goToJoin} className="loginform-link">회원가입</span>
                    </div>
                </div>
                <button className="close-button" onClick={onClose}>×</button>
            </div>
        </div>
    );
};

export default LoginForm; 