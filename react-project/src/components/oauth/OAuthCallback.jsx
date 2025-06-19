import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import axios from "../../utils/axiosConfig";
import '../../css/user/join/ErrorModal.css';

const OAuthCallback = () => {
  const navigate = useNavigate();
  const { setAccessToken, setUser } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        // URL에서 에러 파라미터 먼저 체크
        const urlParams = new URLSearchParams(window.location.search);
        const error = urlParams.get('error');
        const message = urlParams.get('message');
        const code = urlParams.get('code');
        
        if (error === 'true') {
          // 백엔드에서 온 에러 메시지를 커스텀 모달로 표시
          const decodedMessage = message ? decodeURIComponent(message) : '로그인에 실패했습니다.';
          setErrorMessage(decodedMessage);
          setShowErrorModal(true);
          setIsLoading(false);
          return;
        }

        // 토큰 처리 (기존 로직)
        const token = urlParams.get('token');
        
        if (!token) {
          throw new Error('토큰이 없습니다.');
        }

        console.log("OAuth 토큰 수신:", token.substring(0, 20) + "...");

        setAccessToken(token);
        await new Promise(resolve => setTimeout(resolve, 100));

        const userResponse = await axios.post("/api/join/check-login-status");
                
        if (userResponse.result === "Y") {
          const userData = {
            userNo: userResponse.user_no,
            loginId: userResponse.login_id,
            userName: userResponse.user_name,
            userType: userResponse.user_type,
            expire_days: userResponse.expire_days,
          };
                  
          setUser(userData);
          navigate("/");
        } else {
          throw new Error('사용자 정보를 가져올 수 없습니다.');
        }
      } catch (error) {
        console.error("OAuth 콜백 처리 실패:", error);
        setErrorMessage("로그인 처리 중 오류가 발생했습니다.");
        setShowErrorModal(true);
      } finally {
        setIsLoading(false);
      }
    };

    handleOAuthCallback();
  }, [navigate, setAccessToken, setUser]);

  const handleCloseErrorModal = () => {
    setShowErrorModal(false);
    navigate("/");
  };

  // 에러 코드에 따른 아이콘과 스타일 결정
  const getErrorIcon = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    
    switch (code) {
      case 'DEACTIVATED_USER':
        return '🚫'; // 탈퇴한 계정
      case 'DUPLICATE_ACCOUNT':
        return '⚠️'; // 중복 계정
      default:
        return '❌'; // 일반 오류
    }
  };

  const getErrorTitle = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    
    switch (code) {
      case 'DEACTIVATED_USER':
        return '탈퇴한 계정';
      case 'DUPLICATE_ACCOUNT':
        return '계정 중복';
      default:
        return '로그인 실패';
    }
  };

  const getErrorClass = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    
    switch (code) {
      case 'DEACTIVATED_USER':
        return 'deactivated';
      case 'DUPLICATE_ACCOUNT':
        return 'duplicate';
      default:
        return '';
    }
  };

  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f8f9fa'
      }}>
        <div style={{
          width: '50px',
          height: '50px',
          border: '5px solid #e3e3e3',
          borderTop: '5px solid #007bff',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <p style={{ marginTop: '20px', fontSize: '18px', color: '#666' }}>
          로그인 처리 중입니다...
        </p>
        <style>
          {`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}
        </style>
      </div>
    );
  }

  return (
    <>
      {showErrorModal && (
        <div className="error-modal-overlay">
          <div className="error-modal">
            <div className="error-modal-header">
              <h3 className={getErrorClass()}>{getErrorTitle()}</h3>
              <button 
                className="error-modal-close"
                onClick={handleCloseErrorModal}
              >
                ×
              </button>
            </div>
            <div className="error-modal-body">
              <div className={`error-icon ${getErrorClass()}`}>{getErrorIcon()}</div>
              <p className={getErrorClass()}>{errorMessage}</p>
            </div>
            <div className="error-modal-footer">
              <button 
                className={`error-modal-btn ${getErrorClass()}`}
                onClick={handleCloseErrorModal}
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default OAuthCallback;