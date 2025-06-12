// 种子标签ID映射表
export const tagMap: Record<string, string> = {
  "1": "喜剧",
  "2": "悬疑",
  "3": "爱情",
  "4": "动作",
  "5": "科幻",
  "6": "国产",
  "7": "欧美",
  "8": "日韩",
  "9": "港台",
  "10": "现场版",
  "11": "比赛",
  "12": "访谈",
  "13": "教学",
  "14": "流行",
  "15": "复古",
  "16": "电子",
  "17": "独立",
  "18": "自然",
  "19": "历史",
  "20": "科技",
  "21": "文化",
  "22": "角色扮演",
  "23": "竞技",
  "24": "开放世界",
  "25": "怀旧",
  "26": "新作",
  "27": "经典",
  "28": "连载中",
  "29": "完结"
};

// 标签ID到描述的映射
export const tagDescriptionMap: Record<string, string> = {
  "1": "幽默搞笑类内容",
  "2": "充满谜题和推理元素的内容",
  "3": "浪漫情感主题内容",
  "4": "激烈打斗场面内容",
  "5": "科学幻想元素内容",
  "6": "中国大陆制作内容",
  "7": "欧洲和美国制作内容",
  "8": "日本和韩国制作内容",
  "9": "香港和台湾制作内容",
  "10": "现场演出内容",
  "11": "竞技比赛内容",
  "12": "人物访谈内容",
  "13": "教学指导内容",
  "14": "流行风格内容",
  "15": "复古风格内容",
  "16": "电子风格内容",
  "17": "独立制作风格",
  "18": "自然生态主题",
  "19": "历史主题内容",
  "20": "科学技术主题",
  "21": "人文文化主题",
  "22": "RPG游戏元素",
  "23": "竞技对抗元素",
  "24": "开放世界设定",
  "25": "怀旧经典内容",
  "26": "最新发布内容",
  "27": "经久不衰内容",
  "28": "持续更新内容",
  "29": "已完结内容"
};

// 根据标签ID获取标签名称
export function getTagNameById(id: string): string {
  return tagMap[id] || "未知标签";
}

// 根据标签名称获取标签ID
export function getTagIdByName(name: string): string | undefined {
  for (const [id, tagName] of Object.entries(tagMap)) {
    if (tagName === name) {
      return id;
    }
  }
  return undefined;
}

// 根据标签ID获取标签描述
export function getTagDescriptionById(id: string): string {
  return tagDescriptionMap[id] || "无描述";
}

// 获取所有标签（用于选择器等场景）
export function getAllTags(): { id: string; name: string; description: string }[] {
  return Object.entries(tagMap).map(([id, name]) => ({
    id,
    name,
    description: getTagDescriptionById(id)
  }));
}
