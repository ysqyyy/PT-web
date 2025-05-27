// 使用相对路径导入类型，确保路径正确
import type { UserPoints, ExchangeParams } from "../types/exchange";

// 模拟获取用户积分
export const getUserPoints = async (): Promise<UserPoints> => {
    try {
        // 实际项目中替换为真实API调用:
        // const response = await fetch('/api/user/points');
        // if (!response.ok) throw new Error('Network response was not ok');
        // return await response.json();

        // 模拟数据
        return {
            bonusPoints: 1250.5,
            tokens: 85,
            exp: 3200,
            uploadCredit: 256.8,
            level: 4
        };
    } catch {
        throw new Error('获取积分信息失败');
    }
};

// 模拟积分兑换
export const exchangePoints = async (params: ExchangeParams): Promise<void> => {
    try {
        // 实际项目中替换为真实API调用:
        // const response = await fetch('/api/exchange', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(params)
        // });
        // if (!response.ok) throw new Error('Exchange failed');

        // 模拟API延迟
        await new Promise(resolve => setTimeout(resolve, 1000));

        // 这里使用了params参数避免ESLint警告
        console.log(`兑换参数: ${JSON.stringify(params)}`);
    } catch {
        throw new Error('兑换失败');
    }
};