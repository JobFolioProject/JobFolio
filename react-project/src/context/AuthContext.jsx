// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import axios from "../utils/axiosConfig";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // 앱 시작 시 로그인 상태 확인
  useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    try {
      const response = await axios.post("/api/join/check-login-status");

      // 디버깅용 로그 추가
      console.log("=== checkLoginStatus 응답 ===");
      console.log("response:", response);

      if (response.result === "Y") {
        // 백엔드 응답 구조에 맞게 수정!
        setUser({
          userNo: response.user_no, // response.user.user_no가 아님!
          loginId: response.login_id, // response.user.login_id가 아님!
          userName: response.user_name, // response.user.user_name이 아님!
          userType: response.user_type, // response.user.user_type이 아님!
        });
        setIsAuthenticated(true);

        console.log("로그인 상태 확인 성공:", {
          userNo: response.user_no,
          loginId: response.login_id,
          userName: response.user_name,
          userType: response.user_type,
        });
      } else {
        console.log("로그인되지 않은 상태");
      }
    } catch (error) {
      console.log("로그인 상태 확인 실패:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
  };

  const logout = async () => {
    try {
      await axios.post("/api/join/logout");
    } catch (error) {
      console.error("로그아웃 에러:", error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      window.location.href = "/";
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        logout,
        checkLoginStatus,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
