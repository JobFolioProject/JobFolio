import axios from "axios";

// 토큰 관리를 위한 저장소 (현업에서는 보통 별도 tokenService 사용)
let currentAccessToken = null;

// 기본 axios 인스턴스 (interceptor 없음)
const baseAxios = axios.create({
  baseURL: "/",
  timeout: 10000,
  withCredentials: true,
});

// 메인 axios 인스턴스 (interceptor 포함)
const apiAxios = axios.create({
  baseURL: "/",
  timeout: 10000,
  withCredentials: true,
});

// 토큰 갱신 중복 방지를 위한 플래그 및 큐
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  
  failedQueue = [];
};

// 토큰 설정 함수 (외부에서 호출)
export const setAccessToken = (token) => {
  currentAccessToken = token;
};

// 토큰 갱신 함수 (순환 참조 방지를 위해 baseAxios 사용)
const refreshAccessToken = async () => {
  try {
    console.log("🔄 토큰 갱신 시도...");
    
    // interceptor가 없는 baseAxios 사용 (순환 참조 방지)
    const response = await baseAxios.post('/api/join/refresh-token');
    
    if (response.data.result === 'Y') {
      const newToken = response.data.accessToken;
      setAccessToken(newToken);
      console.log("✅ 토큰 갱신 성공");
      return newToken;
    } else {
      throw new Error('토큰 갱신 실패');
    }
  } catch (error) {
    console.error("❌ 토큰 갱신 실패:", error);
    // 갱신 실패 시 로그인 페이지로 리다이렉트
    setAccessToken(null);
    window.location.href = '/';
    throw error;
  }
};

// Request Interceptor
apiAxios.interceptors.request.use(
  (config) => {
    // 토큰이 있으면 헤더에 추가
    if (currentAccessToken) {
      config.headers.Authorization = `Bearer ${currentAccessToken}`;
    }
    
    // Content-Type 설정
    if (!config.headers['Content-Type'] && !(config.data instanceof FormData)) {
      config.headers['Content-Type'] = 'application/json';
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor
apiAxios.interceptors.response.use(
  (response) => {
    return response.data; // data만 반환
  },
  async (error) => {
    const originalRequest = error.config;

    // 401 에러이고 재시도하지 않은 경우
    if (error.response?.status === 401 && !originalRequest._retry) {
      
      // 이미 갱신 중인 경우 큐에 추가
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return apiAxios(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const newToken = await refreshAccessToken();
        processQueue(null, newToken);
        
        // 원래 요청에 새 토큰 적용하여 재시도
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return apiAxios(originalRequest);
        
      } catch (refreshError) {
        processQueue(refreshError, null);
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // 기타 에러 처리
    const errorMessage = error.response?.data?.message || "네트워크 오류가 발생했습니다.";
    return Promise.reject({ ...error, message: errorMessage });
  }
);

// 관리자용 인스턴스 (동일한 패턴 적용)
const adminAxios = axios.create({
  baseURL: "/",
  timeout: 5000,
  withCredentials: true,
});

// 관리자용도 동일한 interceptor 적용
adminAxios.interceptors.request.use(apiAxios.interceptors.request.handlers[0].fulfilled);
adminAxios.interceptors.response.use(
  (response) => response.data,
  apiAxios.interceptors.response.handlers[0].rejected
);

export default apiAxios;
export { adminAxios as instanceAdmin };