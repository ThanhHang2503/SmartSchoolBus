import React from 'react';

interface LoginButtonProps {
  onClick?: () => void; // Hàm xử lý khi nhấn nút (tùy chọn)
}

const LoginButton: React.FC<LoginButtonProps> = ({ onClick }) => {
  return (
    <button onClick={onClick}>
      Đăng nhập
    </button>
  );
};

export default LoginButton;