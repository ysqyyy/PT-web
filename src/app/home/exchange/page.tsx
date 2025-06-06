'use client';

import { useState, useEffect } from "react";
import { getUserPoints, exchangePoints } from "@/api/exchange";
import type { UserPoints, ExchangeParams } from "@/api/exchange";
import Navbar from "@/components/Navbar";
import { Button, InputNumber, Select, message, Card, Statistic, Divider } from 'antd';

export default function ExchangePage() {
    const [userPoints, setUserPoints] = useState<UserPoints>({
        bonusPoints: 0,
        tokens: 0,
        exp: 0,
        uploadCredit: 0,
        level: 1
    });

    const [exchangeForm, setExchangeForm] = useState<ExchangeParams>({
        fromType: 'bonusPoints',
        toType: 'tokens',
        amount: 0
    });

    const [loading, setLoading] = useState(false);
    const [exchangeLoading, setExchangeLoading] = useState(false);

    // 获取用户积分数据
    useEffect(() => {
        fetchUserPoints();
    }, []);

    const fetchUserPoints = async () => {
        setLoading(true);
        try {
            const res = await getUserPoints();
            if (res.success) {
                setUserPoints(res.data);
            } else {
                message.error(res.message || '获取积分信息失败');
            }
        } catch (error) {
            message.error('获取积分信息失败');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // 处理兑换操作
    const handleExchange = async () => {
        if (exchangeForm.amount <= 0) {
            message.warning('请输入有效的兑换数量');
            return;
        }

        // 检查兑换源是否足够
        if (exchangeForm.fromType === 'bonusPoints' && exchangeForm.amount > userPoints.bonusPoints) {
            message.warning('魔力值不足');
            return;
        }
        if (exchangeForm.fromType === 'tokens' && exchangeForm.amount > userPoints.tokens) {
            message.warning('点券不足');
            return;
        }

        setExchangeLoading(true);
        try {
            const res = await exchangePoints(exchangeForm);
            if (res.success) {
                message.success(res.message || '兑换成功');
                setUserPoints(res.data);
                setExchangeForm(prev => ({ ...prev, amount: 0 }));
            } else {
                message.error(res.message || '兑换失败');
            }
        } catch (error) {
            console.error(error);
            message.error('兑换失败');
        } finally {
            setExchangeLoading(false);
        }
    };

    // 兑换比例配置
    const exchangeRates = {
        bonusPointsToTokens: 10, // 10魔力值=1点券
        tokensToBonusPoints: 0.1, // 1点券=0.1魔力值
    };

    // 计算兑换结果
    const calculateExchangeResult = () => {
        if (exchangeForm.amount <= 0) return 0;

        if (exchangeForm.fromType === 'bonusPoints' && exchangeForm.toType === 'tokens') {
            return exchangeForm.amount / exchangeRates.bonusPointsToTokens;
        }
        if (exchangeForm.fromType === 'tokens' && exchangeForm.toType === 'bonusPoints') {
            return exchangeForm.amount * exchangeRates.tokensToBonusPoints;
        }
        return 0;
    };

    return (
        <div>
            <Navbar name="兑换中心">
                <h1 className="text-2xl font-bold mb-6">兑换中心</h1>

                {/* 用户积分概览 */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
                    <Card loading={loading}>
                        <Statistic
                            title="魔力值"
                            value={userPoints.bonusPoints}
                            precision={2}
                        />
                    </Card>
                    <Card loading={loading}>
                        <Statistic
                            title="点券"
                            value={userPoints.tokens}
                            precision={0}
                        />
                    </Card>
                    <Card loading={loading}>
                        <Statistic
                            title="上传量(GB)"
                            value={userPoints.uploadCredit}
                            precision={2}
                        />
                    </Card>
                    <Card loading={loading}>
                        <Statistic
                            title="经验值"
                            value={userPoints.exp}
                            precision={0}
                        />
                    </Card>
                    <Card loading={loading}>
                        <Statistic
                            title="等级"
                            value={userPoints.level}
                            precision={0}
                        />
                    </Card>
                </div>

                <Divider>积分兑换</Divider>

                {/* 兑换表单 */}
                <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
                        <div className="flex-1 w-full">
                            <label className="block text-sm font-medium mb-1">兑换来源</label>
                            <Select
                                className="w-full"
                                value={exchangeForm.fromType}
                                onChange={(value) => setExchangeForm({
                                    ...exchangeForm,
                                    fromType: value as 'bonusPoints' | 'tokens',
                                    toType: value === 'bonusPoints' ? 'tokens' : 'bonusPoints'
                                })}
                                options={[
                                    { value: 'bonusPoints', label: '魔力值' },
                                    { value: 'tokens', label: '点券' },
                                ]}
                            />
                        </div>

                        <div className="flex-1 w-full">
                            <label className="block text-sm font-medium mb-1">兑换数量</label>
                            <InputNumber
                                className="w-full"
                                min={0}
                                max={exchangeForm.fromType === 'bonusPoints' ? userPoints.bonusPoints : userPoints.tokens}
                                value={exchangeForm.amount}
                                onChange={(value) => setExchangeForm({ ...exchangeForm, amount: value || 0 })}
                            />
                        </div>

                        <div className="flex-1 w-full">
                            <label className="block text-sm font-medium mb-1">兑换目标</label>
                            <Select
                                className="w-full"
                                value={exchangeForm.toType}
                                onChange={(value) => setExchangeForm({ ...exchangeForm, toType: value as 'bonusPoints' | 'tokens' })}
                                options={[
                                    { value: 'tokens', label: '点券' },
                                    { value: 'bonusPoints', label: '魔力值' },
                                ]}
                            />
                        </div>
                    </div>

                    {/* 兑换结果预览 */}
                    {exchangeForm.amount > 0 && (
                        <div className="mb-6 p-4 bg-gray-50 rounded">
                            <p className="text-center">
                                兑换比例: 1 {exchangeForm.fromType === 'bonusPoints' ? '魔力值' : '点券'} =
                                {exchangeForm.fromType === 'bonusPoints' && exchangeForm.toType === 'tokens'
                                    ? ` ${1/exchangeRates.bonusPointsToTokens} 点券`
                                    : ` ${exchangeRates.tokensToBonusPoints} 魔力值`}
                            </p>
                            <p className="text-center font-bold">
                                将获得: {calculateExchangeResult().toFixed(2)} {exchangeForm.toType === 'bonusPoints' ? '魔力值' : '点券'}
                            </p>
                        </div>
                    )}

                    <div className="flex justify-center">
                        <Button
                            type="primary"
                            size="large"
                            onClick={handleExchange}
                            loading={exchangeLoading}
                            disabled={exchangeForm.amount <= 0}
                        >
                            确认兑换
                        </Button>
                    </div>
                </div>

                <Divider>兑换说明</Divider>

                {/* 兑换规则说明 */}
                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-lg font-bold mb-4">积分兑换规则</h2>
                    <ul className="list-disc pl-5 space-y-2">
                        <li>魔力值与点券可以互相兑换</li>
                        <li>兑换比例: 10 魔力值 = 1 点券</li>
                        <li>每日魔力值兑换上限: 5000 魔力值</li>
                        <li>点券兑换魔力值无上限</li>
                        <li>兑换操作不可逆，请谨慎操作</li>
                    </ul>

                    <h2 className="text-lg font-bold mt-6 mb-4">积分获取途径</h2>
                    <ul className="list-disc pl-5 space-y-2">
                        <li><strong>魔力值:</strong> 通过做种获取，种子越大、做种时间越长获得越多</li>
                        <li><strong>点券:</strong> 通过充值或每月活跃奖励获取</li>
                        <li><strong>上传量:</strong> 通过分享资源和他人下载你的资源获取</li>
                        <li><strong>经验值:</strong> 通过日常活跃行为获取，用于提升等级</li>
                    </ul>
                </div>
            </Navbar>
        </div>
    );
}