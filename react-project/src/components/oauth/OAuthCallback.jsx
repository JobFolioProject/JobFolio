import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import axios from "../../utils/axiosConfig";

const OAuthCallback = () => {
  const navigate = useNavigate();
  const { setAccessToken, setUser } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        // URL에서 토큰 추출
        const urlParams = new URLSearchParams(window.location.search);
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
        alert("로그인 처리 중 오류가 발생했습니다.");
        navigate("/");
      } finally {
        setIsLoading(false);
      }
    };

    handleOAuthCallback();
  }, [navigate, setAccessToken, setUser]);

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

  return null;
};

export default OAuthCallback;