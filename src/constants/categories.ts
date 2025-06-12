// 种子分类ID映射表
export const categoryMap: Record<string, string> = {
  "电影": "1",
  "剧集": "2",
  "音乐": "3",
  "动漫": "4",
  "游戏": "5",
  "综艺": "6",
  "体育": "7",
  "纪录片": "8"
};

// 根据分类ID获取分类名称
export function getCategoryNameById(id: string): string {
  for (const [name, categoryId] of Object.entries(categoryMap)) {
    if (categoryId === id) {
      return name;
    }
  }
  return "未知分类";
}

// 根据分类名称获取分类ID
export function getCategoryIdByName(name: string): string {
  return categoryMap[name] || "0"; // 默认返回0表示未知分类
}
