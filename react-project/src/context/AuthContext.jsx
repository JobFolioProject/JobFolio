import { createContext, useContext, useState, useEffect } from "react";
import axios, { setAccessToken } from "../utils/axiosConfig";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessTokenState] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // 토큰 설정 함수 (axios와 동기화)
  const updateAccessToken = (token) => {
    setAccessTokenState(token);
    setAccessToken(token); // axios 설정도 업데이트
  };

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      setIsLoading(true);
      console.log("🔍 자동 로그인 확인 중...");

      // 기본 axios로 refresh 시도 (interceptor 없음)
      const refreshResponse = await fetch('/api/join/refresh-token', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const refreshData = await refreshResponse.json();

      if (refreshData.result === "Y") {
        const newAccessToken = refreshData.accessToken;
        updateAccessToken(newAccessToken);

        // 토큰 설정 후 사용자 정보 조회
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
          setIsAuthenticated(true);
          console.log("✅ 자동 로그인 성공:", userData.loginId);
        }
      } else {
        console.log("ℹ️ 로그아웃 상태입니다.");
        setAccessTokenState(null);
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.log("⚠️ 자동 로그인 확인 실패:", error.message);
      setAccessTokenState(null);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      const response = await axios.post("/api/join/login", credentials);
      
      if (response.result === "Y") {
        const newAccessToken = response.accessToken;
        const userData = {
          userNo: response.user.user_no,
          loginId: response.user.login_id,
          userName: response.user.user_name,
          userType: response.user.user_type,
          expire_days: response.user.expire_days,
        };

        updateAccessToken(newAccessToken);
        setUser(userData);
        setIsAuthenticated(true);

        console.log("✅ 로그인 성공:", userData.loginId);
        return { success: true, data: response };
      } else {
        return { success: false, message: response.message };
      }
    } catch (error) {
      console.error("❌ 로그인 에러:", error);
      return {
        success: false,
        message: error.message || "로그인 중 오류가 발생했습니다.",
      };
    }
  };

  const logout = async () => {
    try {
      await axios.post("/api/join/logout");
    } catch (error) {
      // 로그아웃 에러는 무시
    } finally {
      updateAccessToken(null);
      setUser(null);
      setIsAuthenticated(false);
      console.log("✅ 로그아웃 완료");
      window.location.href = "/";
    }
  };

  const checkLoginStatus = async () => {
    if (!accessToken) {
      return;
    }

    try {
      const response = await axios.post("/api/join/check-login-status");

      if (response.result === "Y") {
        setUser({
          userNo: response.user_no,
          loginId: response.login_id,
          userName: response.user_name,
          userType: response.user_type,
          expire_days: response.expire_days,
        });
        setIsAuthenticated(true);
      } else {
        updateAccessToken(null);
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      updateAccessToken(null);
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        user,
        isAuthenticated,
        isLoading,
        login,
        logout,
        checkLoginStatus,
        setUser,
        setIsAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);