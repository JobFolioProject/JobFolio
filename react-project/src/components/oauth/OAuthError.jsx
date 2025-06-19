import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const OAuthError = () => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const message = urlParams.get('message') || '로그인 중 오류가 발생했습니다.';
    setErrorMessage(decodeURIComponent(message));
  }, []);

  const goToMain = () => {
    navigate("/");
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      backgroundColor: '#f8f9fa',
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        textAlign: 'center',
        maxWidth: '500px',
        width: '100%'
      }}>
        <div style={{ fontSize: '48px', marginBottom: '20px' }}>❌</div>
        <h2 style={{ color: '#dc3545', marginBottom: '20px' }}>로그인 실패</h2>
        <p style={{ 
          color: '#666', 
          marginBottom: '30px', 
          fontSize: '16px',
          lineHeight: '1.5'
        }}>
          {errorMessage}
        </p>
        <button
          onClick={goToMain}
          style={{
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '6px',
            fontSize: '16px',
            cursor: 'pointer',
            transition: 'background-color 0.2s'
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#0056b3'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#007bff'}
        >
          메인 페이지로 돌아가기
        </button>
      </div>
    </div>
  );
};

export default OAuthError;
