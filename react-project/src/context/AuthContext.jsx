// src/context/AuthContext.jsx (백엔드 호환 버전)
import { createContext, useContext, useState, useEffect } from "react";
import axios from "../utils/axiosConfig";
import { setAuthContextRef } from "../utils/axiosConfig";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    initializeAuth();
  }, []);

  const gracefulRefreshToken = async () => {
    try {
      const response = await axios.post("/api/join/refresh-token");
      return { success: true, data: response };
    } catch (error) {
      if (error.response?.status === 400) {
        return { success: false, reason: "NO_REFRESH_TOKEN" };
      }
      return { success: false, reason: "ERROR", error };
    }
  };

  const initializeAuth = async () => {
    try {
      setIsLoading(true);

      // console.log(" 자동 로그인 확인 중...");

      // 우아한 refresh token 요청
      const result = await gracefulRefreshToken();

      if (result.success && result.data.result === "Y") {
        const newAccessToken = result.data.accessToken;

        // 토큰 설정
        setAccessToken(newAccessToken);
        setAuthContextRef({
          accessToken: newAccessToken,
          refreshToken,
          setAccessToken,
          setUser,
        });

        // 토큰 설정 완료 보장
        await new Promise((resolve) => setTimeout(resolve, 100));

        // 사용자 정보 요청
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
          // console.log("자동 로그인 성공:", userData.loginId);
        }
      } else {
        // 실패 이유에 따른 다른 메시지
        if (result.reason === "NO_REFRESH_TOKEN") {
          console.log(" 로그아웃 상태입니다.");
        } else if (result.reason === "ERROR") {
          console.log(" 자동 로그인 확인 실패:", result.error.message);
        }

        setAccessToken(null);
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.log(" 예상치 못한 오류:", error.message);
      setAccessToken(null);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      const response = await axios.post("/api/join/login", credentials);
      console.log(response);
      if (response.result === "Y") {
        const newAccessToken = response.accessToken;
        const userData = {
          userNo: response.user.user_no,
          loginId: response.user.login_id,
          userName: response.user.user_name,
          userType: response.user.user_type,
          expire_days: response.user.expire_days,
        };

        setAccessToken(newAccessToken);
        setUser(userData);
        setIsAuthenticated(true);

        // console.log(" 로그인 성공:", userData.loginId);
        return { success: true, data: response };
      } else {
        return { success: false, message: response.message };
      }
    } catch (error) {
      console.error(" 로그인 에러:", error);
      return {
        success: false,
        message: error.message || "로그인 중 오류가 발생했습니다.",
      };
    }
  };

  const refreshToken = async () => {
    try {
      const response = await axios.post("/api/join/refresh-token");

      if (response.result === "Y") {
        const newAccessToken = response.accessToken;
        setAccessToken(newAccessToken);
        console.log(" 토큰 갱신 완료");
        return newAccessToken;
      } else {
        throw new Error("토큰 갱신 실패");
      }
    } catch (error) {
      console.error(" 토큰 갱신 실패:", error);
      await logout();
      throw error;
    }
  };

  const logout = async () => {
    try {
      await axios.post("/api/join/logout");
    } catch (error) {
      // 로그아웃 에러는 조용히 처리
    } finally {
      setAccessToken(null);
      setUser(null);
      setIsAuthenticated(false);
      console.log(" 로그아웃 완료");
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
        setAccessToken(null);
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      setAccessToken(null);
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  useEffect(() => {
    setAuthContextRef({
      accessToken,
      refreshToken,
      setAccessToken,
      setUser,
    });
  }, [accessToken]);

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        user,
        isAuthenticated,
        isLoading,
        login,
        logout,
        refreshToken,
        checkLoginStatus,
        setAccessToken,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
