import axios from "axios";

// AuthContext에서 토큰 가져오기 위한 참조 변수
let authContextRef = null;

// AuthContext 참조 설정 함수 (AuthContext에서 호출)
export const setAuthContextRef = (authContext) => {
  authContextRef = authContext;
  // 로그 최소화: 로그인 성공 시에만 출력
  if (authContext?.accessToken) {
    // console.log("🔗 AuthContext 참조 업데이트: 토큰 연결됨");
  }
};

// axios 인스턴스 생성
const axiosInstance = axios.create({
  baseURL: "/", // proxy 사용하므로 상대경로
  timeout: 10000,
  withCredentials: true, // Refresh Token 쿠키를 위해 유지
});

// 요청 인터셉터 - Bearer Token 자동 추가
axiosInstance.interceptors.request.use(
  (config) => {
    // 기본 헤더 설정
    config.headers["Content-Type"] = "application/json";

    // Memory에서 accessToken 가져와서 Authorization Header에 추가
    if (authContextRef?.accessToken) {
      config.headers.Authorization = `Bearer ${authContextRef.accessToken}`;
      // 중요한 API 요청에만 로그 출력
      if (config.url.includes("check-login-status")) {
        // console.log("🔑 Bearer Token으로 인증 요청:", config.url);
      }
    }
    // Bearer Token 없음 로그 제거 (로그아웃 상태는 정상)

    return config;
  },
  (error) => {
    console.error("❌ 요청 에러:", error);
    return Promise.reject(error);
  }
);

// 응답 인터셉터 - 토큰 만료 시 자동 갱신
axiosInstance.interceptors.response.use(
  (response) => {
    // API 응답 로그 제거 (너무 많음)
    return response.data;
  },
  async (error) => {
    // 로그아웃 상태의 400 에러는 조용히 처리
    if (
      error.response?.status === 400 &&
      error.response?.data?.message?.includes("리프레시 토큰")
    ) {
      // 리프레시 토큰 없음은 정상 상황 (로그아웃 상태)
      return Promise.reject({
        ...error,
        message: error.response?.data?.message,
      });
    }

    // 다른 에러만 출력
    if (error.response?.status !== 400) {
      console.error(
        "❌ 응답 에러:",
        error.response?.status,
        error.response?.data
      );
    }

    const originalRequest = error.config;

    // 401 Unauthorized - 토큰 만료 시 자동 갱신
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        console.log("🔄 토큰 만료 - 자동 갱신 시도");

        // AuthContext의 refreshToken 함수 사용
        if (authContextRef?.refreshToken) {
          const newAccessToken = await authContextRef.refreshToken();

          if (newAccessToken) {
            // 새로운 토큰으로 원래 요청의 헤더 업데이트
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

            console.log("✅ 토큰 갱신 후 재요청 성공");

            // 원래 요청 재시도
            return axiosInstance(originalRequest);
          }
        } else {
          throw new Error("AuthContext 참조가 없습니다");
        }
      } catch (refreshError) {
        console.error("🚨 토큰 갱신 실패:", refreshError);

        // Memory 상태 초기화
        if (authContextRef?.setAccessToken) {
          authContextRef.setAccessToken(null);
          authContextRef.setUser(null);
        }

        // 로그인 페이지로 리다이렉트
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    // 기타 에러
    const errorMessage =
      error.response?.data?.message || "네트워크 오류가 발생했습니다.";
    return Promise.reject({ ...error, message: errorMessage });
  }
);

export default axiosInstance;
