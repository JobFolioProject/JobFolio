import React, { createContext, useContext, useState } from 'react';
import { 
  Snackbar, 
  Alert, 
  Slide, 
  Fade, 
  Grow, 
  Zoom,
  Collapse 
} from '@mui/material';

const SnackbarContext = createContext();

//  MUI 애니메이션 옵션들
const animationOptions = {
  slideDown: (props) => <Slide {...props} direction="down" />,
  slideUp: (props) => <Slide {...props} direction="up" />,
  slideLeft: (props) => <Slide {...props} direction="left" />,
  slideRight: (props) => <Slide {...props} direction="right" />,
  fade: (props) => <Fade {...props} />,
  grow: (props) => <Grow {...props} />,
  zoom: (props) => <Zoom {...props} />,
  collapse: (props) => <Collapse {...props} />,
};

export const SnackbarProvider = ({ children }) => {
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info',
    duration: 1500,
  });

  const showSnackbar = (message, severity = 'info', duration = 1500) => {
    if (snackbar.open) {
      setSnackbar(prev => ({ ...prev, open: false }));
      setTimeout(() => {
        setSnackbar({
          open: true,
          message,
          severity,
          duration,
        });
      }, 150);
    } else {
      setSnackbar({
        open: true,
        message,
        severity,
        duration,
      });
    }
  };

  const hideSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const snackbarMethods = {
    success: (message, duration = 1500) => showSnackbar(message, 'success', duration),
    error: (message, duration = 1500) => showSnackbar(message, 'error', duration),
    warning: (message, duration = 1500) => showSnackbar(message, 'warning', duration),
    info: (message, duration = 1500) => showSnackbar(message, 'info', duration),
    
    auth: {
      loginSuccess: (userName) => showSnackbar(`${userName}님, 환영합니다! 🎉`, 'success', 1500),
      loginError: (message = '로그인에 실패했습니다') => showSnackbar(message, 'error', 1500),
      logout: () => showSnackbar('안전하게 로그아웃되었습니다', 'info', 1500),
      sessionExpired: () => showSnackbar('세션이 만료되었습니다. 다시 로그인해주세요', 'warning', 1500),
      accountDeleted: () => showSnackbar('탈퇴한 계정입니다. 고객센터에 문의해주세요', 'error', 1500),
    },
    
    system: {
      networkError: () => showSnackbar('네트워크 연결을 확인해주세요', 'error', 1500),
      serverError: () => showSnackbar('서버에 문제가 발생했습니다. 잠시 후 다시 시도해주세요', 'error', 1500),
      formError: (field) => showSnackbar(`${field}를 확인해주세요`, 'warning', 1500),
    },
    
    loading: (message) => showSnackbar(message, 'info', 1500),
  };

  return (
    <SnackbarContext.Provider value={snackbarMethods}>
      {children}
      
      <Snackbar
        open={snackbar.open}
        autoHideDuration={snackbar.duration}
        onClose={hideSnackbar}
        anchorOrigin={{ 
          vertical: 'top',
          horizontal: 'center'
        }}
        TransitionComponent={animationOptions.zoom}
        TransitionProps={{
          timeout: {
            enter: 400,
            exit: 300,  
          },
        }}
        
        sx={{
          marginTop: '20px',
          '& .MuiSnackbar-root': {
            top: '20px !important',
          }
        }}
      >
        <Alert 
          onClose={hideSnackbar} 
          severity={snackbar.severity}
          variant="filled"
          sx={{
            width: '100%',
            minWidth: '380px',
            maxWidth: '520px',
            fontSize: '15px',
            fontWeight: 600,
            borderRadius: '20px',
            boxShadow: '0 12px 35px rgba(0, 0, 0, 0.15)',
            padding: '8px 16px',
            
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            
            '& .MuiAlert-icon': {
              fontSize: '26px',
              marginRight: '12px',
            },
            '& .MuiAlert-message': {
              padding: '8px 0',
              display: 'flex',
              alignItems: 'center',
            },
            '& .MuiAlert-action': {
              // paddingTop: 'unset',
              marginRight: '8px',
            },
            
            // ===== 성공 토스트 색상 옵션들 =====
            '&.MuiAlert-filledSuccess': {
              //  클래식 녹색 
              background: 'linear-gradient(145deg, #e8f5e8 0%, #d4f5d4 30%, #c1f0c1 100%)',
              border: '2px solid rgba(76, 175, 80, 0.3)',
              color: '#2e7d32',
              
              '&:hover': {
                transform: 'translateY(-2px) scale(1.02)',
                boxShadow: '0 16px 40px rgba(76, 175, 80, 0.25)',
              },
              
              //  민트 그린
              // background: 'linear-gradient(145deg, #e6fffa 0%, #b2f5ea 30%, #81e6d9 100%)',
              // border: '2px solid rgba(56, 178, 172, 0.3)',
              // color: '#234e52',
              
              // '&:hover': {
              //   transform: 'translateY(-2px) scale(1.02)',
              //   boxShadow: '0 16px 40px rgba(56, 178, 172, 0.25)',
              // },
              
              //  라임 그린
              // background: 'linear-gradient(145deg, #f0fff4 0%, #dcfce7 30%, #bbf7d0 100%)',
              // border: '2px solid rgba(34, 197, 94, 0.3)',
              // color: '#166534',
              
              // '&:hover': {
              //   transform: 'translateY(-2px) scale(1.02)',
              //   boxShadow: '0 16px 40px rgba(34, 197, 94, 0.25)',
              // },
              
              //  에메랄드 그린
              // background: 'linear-gradient(145deg, #ecfdf5 0%, #d1fae5 30%, #a7f3d0 100%)',
              // border: '2px solid rgba(16, 185, 129, 0.3)',
              // color: '#065f46',
              
              // '&:hover': {
              //   transform: 'translateY(-2px) scale(1.02)',
              //   boxShadow: '0 16px 40px rgba(16, 185, 129, 0.25)',
              // },
              
              // 진한 포레스트 그린
              // background: 'linear-gradient(145deg, #f6ffed 0%, #d9f7be 30%, #b7eb8f 100%)',
              // border: '2px solid rgba(82, 196, 26, 0.3)',
              // color: '#389e0d',
              
              // '&:hover': {
              //   transform: 'translateY(-2px) scale(1.02)',
              //   boxShadow: '0 16px 40px rgba(82, 196, 26, 0.25)',
              // },
            },
            
            // ===== 에러 토스트 =====
            '&.MuiAlert-filledError': {
              background: 'linear-gradient(145deg, #ffe6f1 0%, #ffd1e6 30%, #ffb3d9 100%)',
              border: '2px solid rgba(255, 107, 157, 0.3)',
              color: '#744d4d',
              
              '&:hover': {
                transform: 'translateX(-2px)',
                boxShadow: '0 12px 30px rgba(255, 107, 157, 0.25)',
              },
            },
            
            // ===== 경고 토스트 =====
            '&.MuiAlert-filledWarning': {
              background: 'linear-gradient(145deg, #fff4e6 0%, #ffe9d1 30%, #ffdbb3 100%)',
              border: '2px solid rgba(255, 167, 38, 0.3)',
              color: '#6b5d4d',
              
              '&:hover': {
                transform: 'scale(1.05)',
                boxShadow: '0 12px 30px rgba(255, 167, 38, 0.25)',
              },
            },
            
            // ===== 정보 토스트 =====
            '&.MuiAlert-filledInfo': {
              background: 'linear-gradient(145deg, #f0f0ff 0%, #e6e6ff 30%, #d9d9ff 100%)',
              border: '2px solid rgba(124, 77, 255, 0.3)',
              color: '#4a4a6b',
              
              '&:hover': {
                transform: 'rotateZ(1deg)',
                boxShadow: '0 12px 30px rgba(124, 77, 255, 0.25)',
              },
            },
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </SnackbarContext.Provider>
  );
};

export const useSnackbar = () => {
  const context = useContext(SnackbarContext);
  if (!context) {
    throw new Error('useSnackbar must be used within SnackbarProvider');
  }
  return context;
};