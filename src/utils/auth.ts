import Cookies from 'js-cookie';

// token相关的工具函数
export const auth = {
  // 获取token
  getToken: () => {
    return Cookies.get('token');
  },

  // 设置token
  setToken: (token: string, expires = 7) => {
    return Cookies.set('token', token, { expires });
  },

  // 删除token
  removeToken: () => {
    return Cookies.remove('token');
  },

  // 检查是否已登录
  isLoggedIn: () => {
    return !!Cookies.get('token');
  },

  // 登出
  logout: () => {
    Cookies.remove('token');
    // 如果在浏览器环境，可以重定向到登录页
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  },
  
  // 设置刷新令牌
  setRefreshToken(token:string, expiryDays = 30) {
    localStorage.setItem('refresh_token', token);
    
    // 设置过期时间
    if (expiryDays) {
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + expiryDays);
      localStorage.setItem('refresh_token_expiry', expiryDate.toISOString());
    }
  },
  
  // 获取刷新令牌
  getRefreshToken() {
    const token = localStorage.getItem('refresh_token');
    const expiry = localStorage.getItem('refresh_token_expiry');
    
    // 检查刷新令牌是否过期
    if (token && expiry && new Date(expiry) > new Date()) {
      return token;
    }
    
    // 如果过期，清除令牌
    if (token && expiry) {
      this.removeRefreshToken();
    }
    
    return null;
  }
  ,
  // 移除刷新令牌
  removeRefreshToken() {
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('refresh_token_expiry');
  },
  
  // 清除所有令牌
  removeAllToken() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('token_expiry');
    this.removeRefreshToken();
  },
  // 检查访问令牌是否即将过期 可能会用到
  isTokenExpiringSoon(minutes = 5) {
    const expiry = localStorage.getItem('token_expiry');
    if (!expiry) return true;
    
    const expiryDate = new Date(expiry);
    const now = new Date();
    
    // 计算分钟差
    const diffMinutes = Math.floor((expiryDate.getTime() - now.getTime()) / (60 * 1000));
    
    // 如果剩余时间少于指定分钟数，返回true
    return diffMinutes < minutes;
  }
};

export default auth;
