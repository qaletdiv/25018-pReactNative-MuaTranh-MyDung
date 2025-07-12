export const validatePassword = (password) => {
  // Mật khẩu phải có ít nhất:8 ký tự trở lên, 1 chữ cái viết hoa, 1 chữ thường,1 số,1 ký tự đặc biệt
  const re =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{}|;:,.<>?])[A-Za-z\d!@#$%^&*()_+\-=\[\]{}|;:,.<>?]{8,}$/;

  return re.test(password);
};
