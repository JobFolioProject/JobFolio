// src/components/common/PrivateRoute.jsx
import { useAuth } from "../../context/AuthContext";
import { Navigate, useLocation } from "react-router-dom";

const PrivateRoute = ({
  children,
  requiredRoles = null,
  loginRequired = false,
}) => {
  const { isAuthenticated, user, isLoading } = useAuth();
  const location = useLocation();

  //결제기간 만료 체크
  const isExpired = (expire_days) => {
    if (!expire_days) return true;
    const today = new Date();
    const expireDate = new Date(expire_days);
    return expireDate < new Date(today.toISOString().slice(0, 10));
  };

  // 로딩 중
  if (isLoading) return <div>로딩 중...</div>;

  // 로그인이 필요한 페이지인데 미로그인 상태
  if (loginRequired && !isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // 특정 권한이 필요한 페이지
  if (requiredRoles && isAuthenticated) {
    // 사용자의 권한이 요구되는 권한 목록에 포함되지 않으면 접근 거부
    if (!requiredRoles.includes(user?.userType)) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // 권한이 없는데 특정 권한이 필요한 페이지에 접근하려는 경우
  if (requiredRoles && !isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  //결제만료시 /pay로 이동시킬 url 설정
  const restrictedPaths = ["/resume/write", "/resume/edit"];

  //결제 만료시 /pay로 이동
  if (
    isAuthenticated &&
    restrictedPaths.includes(location.pathname) &&
    isExpired(user?.expire_days)
  ) {
    return <Navigate to="/pay" replace />;
  }

  return children;
};

export default PrivateRoute;
