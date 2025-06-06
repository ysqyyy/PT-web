import request from '../utils/request';

// 获取用户积分
export async function getUserPoints() {
    return request.get('/api/request/exchange');
}

// 兑换积分
export async function exchangePoints(params: {
    fromType: 'bonusPoints' | 'tokens';
    toType: 'bonusPoints' | 'tokens';
    amount: number;
}) {
    return request.post('/api/request/exchange', params);
}