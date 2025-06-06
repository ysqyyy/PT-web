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

  // 刷新token (如果后端提供了刷新token的接口)
  refreshToken: async () => {
    try {
      // 这里应该调用刷新token的API
      // 例如：const response = await request.post('/api/refresh-token');
      // 暂时模拟一个刷新成功的情况
      return true;
    } catch (error) {
      console.error('刷新token失败', error);
      return false;
    }
  }
};

export default auth;
