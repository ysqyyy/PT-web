import request from '../utils/request';

export interface UserValues {
    user_id: number;
    points: number; // 积分
    tickets: number; // 点券
    magic_value: number; // 魔力值
}

export interface ExchangeMagicValueResponseData {
    remainingTicket: number; // 点券
    remainingMagicValue: number; // 魔力值
    remainingPoint: number; // 积分
    gained: {
        titleId: number | null;
        magicValue: number | null;
        point: number | null;
    };
}

export interface ExchangePointsToScoreResponseData {
    remainingTicket: number; // 点券
    remainingMagicValue: number; // 魔力值
    remainingPoint: number; // 积分
    gained: {
        titleId: number | null;
        magicValue: number | null;
        point: number | null;
    };
}

export interface ExchangeMagicValueForBadgeResponseData {
    remainingTicket: number; // 点券
    remainingMagicValue: number; // 魔力值
    remainingPoint: number; // 积分
    gained: {
        titleId: number | null;
        magicValue: number | null;
        point: number | null;
    };
}

// 添加每日签到接口返回值的类型定义
export interface DailySignInResponseData {
    message: string;
    reward: {
        points: number;
        magicValue: number;
    };
}

// 定义勋章类型
export interface Badge {
    titleId: number;
    titleName: string;
}

export interface ApiResponse<T> {
    code: number;
    message: string;
    data: T;
}

export interface ApiResponse<T> {
    code: number;
    message: string;
    data: T;
}

export async function getUserValues(): Promise<ApiResponse<UserValues>> {
    return request.get('/api/values/info');
}

export async function exchangeMagicValue(amount: number): Promise<ApiResponse<ExchangeMagicValueResponseData>> {
    // 1点券 = 10魔力值，接口为 /api/points/exchange/score
    return request.post('/api/points/exchange/score', { amount });
}

export async function exchangePointsToScore(amount: number): Promise<ApiResponse<ExchangePointsToScoreResponseData>> {
    // 1点券 = 10积分，接口为 /api/points/exchange/point
    return request.post('/api/points/exchange/point', { amount });
}

export async function exchangeMagicValueForBadge(titleId: number): Promise<ApiResponse<ExchangeMagicValueForBadgeResponseData>> {
    // 魔力值兑换勋章，接口为 /api/magic/exchange?titleId=${titleId}
    return request.post(`/api/magic/exchange/title?titleId=${titleId}`);
}

// 添加每日签到接口调用函数
export async function dailySignIn(): Promise<ApiResponse<DailySignInResponseData>> {
    return request.post('/api/values/signin', {});
}
// 添加获取用户所有拥有的勋章接口调用函数
export async function getUserBadges(): Promise<ApiResponse<Badge[]>> {
    return request.get('/api/titles/user');
}

// 添加获取所有设置的勋章接口调用函数
export async function getAllBadges(): Promise<ApiResponse<Badge[]>> {
    return request.get('/api/titles/all');
}

// 充值返回类型
export interface TicketRechargeResponseData {
    message: string;
    remainingTicket: number;
    remainingMagicValue: number;
    remainingPoint: number;
    gained: {
        titleId: number | null;
        magicValue: number;
        point: number;
    };
}

// 点券充值API
export async function rechargeTicket(amount: number): Promise<ApiResponse<TicketRechargeResponseData>> {
    return request.post('/api/ticket/recharge', { amount });
}