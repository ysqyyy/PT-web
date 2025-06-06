import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { url, ...rest } = req.query;

  // 获取原始请求的方法、头和体
  const method = req.method || 'GET';
  const headers = { ...req.headers };
  
  // 删除一些不需要转发的头
  delete headers.host;
  delete headers['content-length'];

  // 构建目标URL
  let targetUrl = '';
  if (Array.isArray(url)) {
    targetUrl = 'http://localhost:8080/' + url.join('/');
  } else if (url) {
    targetUrl = 'http://localhost:8080/' + url;
  } else {
    return res.status(400).json({ error: 'URL parameter is required' });
  }

  // 添加其他查询参数
  const searchParams = new URLSearchParams();
  for (const key in rest) {
    if (rest[key]) {
      searchParams.append(key, rest[key] as string);
    }
  }
  
  // 如果有查询参数，添加到URL
  const queryString = searchParams.toString();
  if (queryString) {
    targetUrl += '?' + queryString;
  }

  try {
    // 获取请求体
    let body = null;
    if (method !== 'GET' && method !== 'HEAD') {
      if (req.headers['content-type']?.includes('application/json')) {
        body = JSON.stringify(req.body);
      } else {
        body = req.body;
      }
    }

    // 发送请求到目标服务器
    const fetchOptions: RequestInit = {
      method,
      headers,
      credentials: 'include',
      body,
    };

    const response = await fetch(targetUrl, fetchOptions);
    
    // 复制响应头
    for (const [key, value] of response.headers.entries()) {
      res.setHeader(key, value);
    }

    // 返回响应
    const responseData = await response.text();
    
    try {
      // 尝试解析为JSON
      const jsonData = JSON.parse(responseData);
      return res.status(response.status).json(jsonData);
    } catch {
      // 如果不是JSON，返回原始文本
      return res.status(response.status).send(responseData);
    }
  } catch (error) {
    console.error('API代理错误:', error);
    return res.status(500).json({ error: '代理请求失败' });
  }
}
