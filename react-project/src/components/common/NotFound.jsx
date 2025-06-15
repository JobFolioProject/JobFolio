// src/components/common/NotFound.jsx
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1); // 이전 페이지로
  };

  const handleGoHome = () => {
    navigate("/"); // 메인 페이지로
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
      <h1 style={{ fontSize: "5rem", color: "#ff4757", marginBottom: "1rem" }}>
        404
      </h1>

      <h2 style={{ marginBottom: "1rem", color: "#2f3542" }}>
        페이지를 찾을 수 없습니다
      </h2>

      <p style={{ marginBottom: "2rem", color: "#57606f", lineHeight: "1.6" }}>
        요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.
        <br />
        URL을 다시 확인해주세요.
      </p>

      <div style={{ display: "flex", gap: "1rem" }}>
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
      </div>
    </div>
  );
};

export default NotFound;
