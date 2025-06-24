import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useSnackbar } from "../../context/SnackbarProvider"; // 추가
import axios from "../../utils/axiosConfig";

const OAuthCallback = () => {
  const navigate = useNavigate();
  const { setAccessToken, setUser } = useAuth();
  const snackbar = useSnackbar(); // 추가
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let hasProcessed = false; // 중복 실행 방지 플래그
    
    const handleOAuthCallback = async () => {
      // 이미 처리했다면 리턴
      if (hasProcessed) return;
      hasProcessed = true;
      
      try {
        // URL에서 에러 파라미터 먼저 체크
        const urlParams = new URLSearchParams(window.location.search);
        const error = urlParams.get('error');
        const message = urlParams.get('message');
        const code = urlParams.get('code');
        
        if (error === 'true') {
          // 에러 코드별 메시지와 스낵바 표시
          const decodedMessage = message ? decodeURIComponent(message) : '로그인에 실패했습니다.';
          
          setIsLoading(false);
          // 바로 메인으로 이동 후 에러 메시지 표시
          navigate("/");
          setTimeout(() => {
            // 에러 코드별로 다른 처리
            switch (code) {
              case 'DEACTIVATED_USER':
                snackbar.auth.accountDeleted();
                break;
              case 'DUPLICATE_ACCOUNT':
                snackbar.error(`${decodedMessage} ⚠️`, 2500);
                break;
              default:
                snackbar.auth.loginError(decodedMessage);
                break;
            }
          }, 100);
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
          
          // 바로 메인으로 이동
          navigate("/");
          
          // 메인 페이지 로드 후 성공 메시지 표시 (약간의 딜레이)
          setTimeout(() => {
            snackbar.auth.loginSuccess(userData.userName);
          }, 100);
        } else {
          throw new Error('사용자 정보를 가져올 수 없습니다.');
        }
      } catch (error) {
        console.error("OAuth 콜백 처리 실패:", error);
        
        // 에러 발생시 바로 메인으로 이동 후 에러 메시지
        navigate("/");
        setTimeout(() => {
          // 네트워크 에러 vs 서버 에러 구분
          if (error.code === 'NETWORK_ERROR' || !navigator.onLine) {
            snackbar.system.networkError();
          } else {
            snackbar.system.serverError();
          }
        }, 100);
      } finally {
        setIsLoading(false);
      }
    };

    handleOAuthCallback();
  }, []); // 의존성 배열을 빈 배열로 변경 - 한 번만 실행

  // 로딩 화면
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
        <p style={{ 
          marginTop: '20px', 
          fontSize: '18px', 
          color: '#666',
          fontWeight: '500'
        }}>
          소셜 로그인 처리 중입니다...
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

  // 로딩이 끝나면 빈 컴포넌트 반환 (스낵바가 메시지 표시)
  return null;
};

export default OAuthCallback;