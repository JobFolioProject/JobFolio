import axios from "axios";

// axios 인스턴스 생성
const axiosInstance = axios.create({
  baseURL: "/", // proxy 사용하므로 상대경로
  timeout: 10000,
  withCredentials: true, // 쿠키 포함 (매우 중요!)
});

// 요청 인터셉터 - 모든 요청에 기본 헤더 추가
axiosInstance.interceptors.request.use(
  (config) => {
    // 기본 헤더 설정
    config.headers["Content-Type"] = "application/json";

    // console.log("API 요청:", config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error("요청 에러:", error);
    return Promise.reject(error);
  }
);

// 응답 인터셉터 - response.data.data 구조 처리
axiosInstance.interceptors.response.use(
  (response) => {
    // console.log("API 응답:", response.config.url, response.status);

    // 백엔드 응답 구조: { result: "Y", data: [...], message: "성공" }
    // 또는: { success: true, data: [...], message: "성공" }

    // response.data를 그대로 반환 (한 겹 벗겨냄)
    return response.data;
  },
  async (error) => {
    console.error("응답 에러:", error.response?.status, error.response?.data);

    const originalRequest = error.config;

    // 401 Unauthorized - 토큰 만료
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // 토큰 갱신 시도
        await axiosInstance.post("/api/join/refresh-token");
        console.log("토큰 갱신 성공");

        // 원래 요청 재시도
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error("토큰 갱신 실패:", refreshError);

        // 로그아웃 처리
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
