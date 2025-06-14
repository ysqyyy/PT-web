// constants/permissions.ts

// 定义页面访问所需的最低权限等级
export const pagePermissions: Record<string, number> = {
  // 默认页面 - 所有人可访问
  "/home": 1,
  "/home/seed": 1,
  "/home/seed/detail": 1,
  "/home/bounty": 1,
  "/home/exchange": 1,
  
  // 用户基本功能 - 等级1可访问
  "/home/user/profile": 1,
  "/home/user/downloads": 1,
  "/home/user/bounties": 1,
  "/home/user/message": 1,
  
  // 管理功能 - 等级2可访问
  "/home/user/analytics": 2,
  "/home/user/users": 2,
  "/home/user/review": 2,
  "/home/user/arbitration": 2,
  "/home/user/report": 2,
};

/**
 * 获取页面所需的最低权限等级
 * @param path 页面路径
 * @returns 所需最低权限等级，默认为1
 */
export function getRequiredLevel(path: string): number {
  // 尝试精确匹配
  if (pagePermissions[path] !== undefined) {
    return pagePermissions[path];
  }
  
  // 如果没有精确匹配，尝试前缀匹配
  for (const [permissionPath, level] of Object.entries(pagePermissions)) {
    if (path.startsWith(permissionPath)) {
      return level;
    }
  }
  
  // 默认返回等级1
  return 1;
}
