// components/ResumeButton.jsx
import '../../css/resume/PrettyBtn.css';
import React from 'react';
/**
 * ResumeButton 컴포넌트는 다양한 스타일과 크기를 지원하는 버튼 컴포넌트입니다.
 * @param {Object} props - 컴포넌트의 속성
 * @param {React.ReactNode} props.children - 버튼에 표시될 내용
 * @param {string} [props.variant='primary'] - 버튼의 스타일 변형 ('primary', 'secondary', 'danger', 'outlined')
 * @param {string} [props.size='md'] - 버튼의 크기 ('sm', 'md', 'lg')
 * @param {boolean} [props.disabled=false] - 버튼 비활성화 여부
 * @param {string} [props.type='button'] - 버튼 타입 ('button', 'submit', 'reset')
 * @param {function} [props.onClick] - 버튼 클릭 이벤트 핸들러
 * @param {string} [props.className=''] - 추가적인 CSS 클래스
 */

export default function PrettyBtn({
  children,
  variant = 'primary', // 'primary', 'secondary', 'danger', 'outlined'
  size = 'md',         // 'sm', 'md', 'lg'
  disabled = false,
  type = 'button',
  onClick,
  className = '',
}) {
  const classNames = `resume-btn ${variant} ${size} ${disabled ? 'disabled' : ''} ${className}`;

  return (
    <button
      className={classNames}
      disabled={disabled}
      type={type}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
