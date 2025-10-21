export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'driver' | 'parent';
}

export interface LoginResponse {
  success: boolean;
  user?: Omit<User, 'password'>;
  message?: string;
}

const mockUsers: User[] = [
  { id: "1", name: "Quản lý Trường", email: "admin@test.com", password: "123456", role: "admin" },
  { id: "2", name: "Nguyễn Văn Tài", email: "driver@test.com", password: "123456", role: "driver" },
  { id: "3", name: "Trần Thị Huệ", email: "parent@test.com", password: "123456", role: "parent" },
];

export const mockLogin = async (email: string, password: string): Promise<LoginResponse> => {
  const trimmedEmail = email.trim().toLowerCase();
  const trimmedPassword = password.trim();
  const isDev = process.env.NODE_ENV !== 'production';
  
  if (!trimmedEmail || !trimmedPassword) {
    if (isDev) console.log('mockLogin: Empty email or password');
    return { success: false, message: 'Vui lòng nhập email và mật khẩu!' };
  }

  await new Promise((resolve) => setTimeout(resolve, 500));
  const user = mockUsers.find((u) => u.email.trim().toLowerCase() === trimmedEmail && u.password === trimmedPassword);
  if (isDev) console.log('mockLogin: Found user:', user, 'Role:', user?.role);
  if (user) {
    const { password, ...userWithoutPassword } = user;
    return { success: true, user: userWithoutPassword };
  }
  if (isDev) console.log('mockLogin: No user found for email:', trimmedEmail);
  return { success: false, message: 'Email hoặc mật khẩu sai!' };
};