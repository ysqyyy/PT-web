import request from '../utils/request';

export interface UserPoints {
    bonusPoints: number;
    tokens: number;
    exp: number;
    uploadCredit: number;
    level: number;
}

export interface ExchangeParams {
    fromType: 'bonusPoints' | 'tokens';
    toType: 'bonusPoints' | 'tokens';
    amount: number;
}

export interface ExchangeResponse {
    success: boolean;
    message?: string;
    data: UserPoints;
}

export async function getUserPoints(): Promise<ExchangeResponse> {
    return request.get('/api/request/exchange');
}

export async function exchangePoints(params: ExchangeParams): Promise<ExchangeResponse> {
    return request.post('/api/request/exchange', params);
}