export interface UserPoints {
    bonusPoints: number;  // 魔力值
    tokens: number;       // 点券
    exp: number;          // 经验值
    uploadCredit: number; // 上传量(GB)
    level: number;        // 用户等级
}

export interface ExchangeParams {
    fromType: 'bonusPoints' | 'tokens';  // 兑换来源类型
    toType: 'bonusPoints' | 'tokens';    // 兑换目标类型
    amount: number;                      // 兑换数量
}