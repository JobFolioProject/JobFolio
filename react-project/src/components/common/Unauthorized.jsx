// src/components/common/Unauthorized.jsx
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Unauthorized = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const handleGoBack = () => {
    navigate(-1); // 이전 페이지로
  };

  const handleGoHome = () => {
    navigate("/"); // 메인 페이지로
  };

  const handleLogin = () => {
    navigate("/login"); // 로그인 페이지로
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "60vh",
        textAlign: "center",
        padding: "2rem",
      }}
    >
      <h1 style={{ fontSize: "3rem", color: "#ff4757", marginBottom: "1rem" }}>
        🚫 403
      </h1>

      <h2 style={{ marginBottom: "1rem", color: "#2f3542" }}>
        접근 권한이 없습니다
      </h2>

      <p style={{ marginBottom: "2rem", color: "#57606f", lineHeight: "1.6" }}>
        {!isAuthenticated
          ? "이 페이지에 접근하려면 로그인이 필요합니다."
          : `현재 권한(${user?.userType})으로는 이 페이지에 접근할 수 없습니다.`}
      </p>

      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
        <button
          onClick={handleGoBack}
          style={{
            padding: "0.75rem 1.5rem",
            backgroundColor: "#3742fa",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            fontSize: "1rem",
          }}
        >
          이전 페이지로
        </button>

        <button
          onClick={handleGoHome}
          style={{
            padding: "0.75rem 1.5rem",
            backgroundColor: "#2ed573",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            fontSize: "1rem",
          }}
        >
          메인으로
        </button>

        {!isAuthenticated && (
          <button
            onClick={handleLogin}
            style={{
              padding: "0.75rem 1.5rem",
              backgroundColor: "#ff6b6b",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              fontSize: "1rem",
            }}
          >
            로그인
          </button>
        )}
      </div>
    </div>
  );
};

export default Unauthorized;
