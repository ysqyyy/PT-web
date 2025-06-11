'use client';

import { useState, useEffect } from "react";
import {
    getUserValues,
    exchangeMagicValue,
    exchangePointsToScore,
    exchangeMagicValueForBadge,
    UserValues,
    ApiResponse,
    ExchangeMagicValueResponseData,
    ExchangePointsToScoreResponseData,
    ExchangeMagicValueForBadgeResponseData,
    dailySignIn,
    DailySignInResponseData,
    getUserBadges,
    getAllBadges,
    Badge,
    rechargeTicket,
    TicketRechargeResponseData
} from "@/api/exchange";
import Navbar from "@/components/Navbar";
import { Button, InputNumber, Select, message, Card, Statistic, Divider, Tag } from 'antd';

export default function ExchangePage() {
    const [userValues, setUserValues] = useState<UserValues>({
        user_id: 0,
        points: 0,
        tickets: 0,
        magic_value: 0
    });

    const [exchangeAmount, setExchangeAmount] = useState<number>(0);
    const [fromType, setFromType] = useState<'tickets' | 'magic_value'>('tickets');
    const [toType, setToType] = useState<'magic_value' | 'points'>('magic_value');

    const [badgeIdToExchange, setBadgeIdToExchange] = useState<number | null>(null);
    const [badgeExchangeLoading, setBadgeExchangeLoading] = useState(false);

    const [loading, setLoading] = useState(false);
    const [exchangeLoading, setExchangeLoading] = useState(false);
    const [signInLoading, setSignInLoading] = useState(false);
    const [signInResult, setSignInResult] = useState<{ points: number; magicValue: number } | null>(null);
    const [isSignedToday, setIsSignedToday] = useState(false);

    const [allBadges, setAllBadges] = useState<Badge[]>([]);
    const [userBadges, setUserBadges] = useState<Badge[]>([]);
    const [badgesLoading, setBadgesLoading] = useState(false);

    // 新增：点券充值
    const [rechargeAmount, setRechargeAmount] = useState<number>(0);
    const [rechargeLoading, setRechargeLoading] = useState(false);

    useEffect(() => {
        fetchUserValues();
        fetchAllBadges();
        fetchUserOwnedBadges();
    }, []);

    const fetchUserValues = async () => {
        setLoading(true);
        try {
            const res: ApiResponse<UserValues> = await getUserValues();
            if (res.code === 200) {
                setUserValues(res.data);
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

    const fetchAllBadges = async () => {
        setBadgesLoading(true);
        try {
            const res: ApiResponse<Badge[]> = await getAllBadges();
            if (res.code === 200) {
                setAllBadges(res.data);
            } else {
                message.error(res.message || '获取所有勋章失败');
            }
        } catch (error) {
            message.error('获取所有勋章失败');
            console.error(error);
        } finally {
            setBadgesLoading(false);
        }
    };

    const fetchUserOwnedBadges = async () => {
        setBadgesLoading(true);
        try {
            const res: ApiResponse<Badge[]> = await getUserBadges();
            if (res.code === 200) {
                setUserBadges(res.data);
            } else {
                message.error(res.message || '获取用户勋章失败');
            }
        } catch (error) {
            message.error('获取用户勋章失败');
            console.error(error);
        } finally {
            setBadgesLoading(false);
        }
    };

    const handleDailySignIn = async () => {
        setSignInLoading(true);
        try {
            const res: ApiResponse<DailySignInResponseData> = await dailySignIn();
            if (res.code === 200) {
                message.success(res.message || '签到成功');
                setSignInResult(res.data.reward);
                setIsSignedToday(true);
                fetchUserValues();
            } else if (res.message && res.message.includes('已签到')) {
                message.warning(res.message || '今日已签到，请勿重复签到');
                setIsSignedToday(true);
                setSignInResult(null);
            } else {
                message.error(res.message || '签到失败');
                setSignInResult(null);
            }
        } catch (error) {
            console.error(error);
            message.error('签到失败');
            setSignInResult(null);
        } finally {
            setSignInLoading(false);
        }
    };

    const handleExchange = async () => {
        if (exchangeAmount <= 0) {
            message.warning('请输入有效的兑换数量');
            return;
        }
        if (fromType === 'tickets' && exchangeAmount > userValues.tickets) {
            message.warning('点券不足');
            return;
        } else if (fromType === 'magic_value' && exchangeAmount > userValues.magic_value) {
            message.warning('魔力值不足');
            return;
        }
        setExchangeLoading(true);
        try {
            if (fromType === 'tickets') {
                if (toType === 'magic_value') {
                    const res: ApiResponse<ExchangeMagicValueResponseData> = await exchangeMagicValue(exchangeAmount);
                    if (res.code === 200) {
                        message.success(res.message || '兑换成功');
                        setUserValues(prev => ({
                            ...prev,
                            points: res.data.remainingPoint,
                            magic_value: res.data.remainingMagicValue,
                            tickets: res.data.remainingTicket
                        }));
                        setExchangeAmount(0);
                    } else {
                        message.error(res.message || '兑换失败');
                    }
                } else if (toType === 'points') {
                    const res: ApiResponse<ExchangePointsToScoreResponseData> = await exchangePointsToScore(exchangeAmount);
                    if (res.code === 200) {
                        message.success(res.message || '兑换成功');
                        setUserValues(prev => ({
                            ...prev,
                            points: res.data.remainingPoint,
                            magic_value: res.data.remainingMagicValue,
                            tickets: res.data.remainingTicket
                        }));
                        setExchangeAmount(0);
                    } else {
                        message.error(res.message || '兑换失败');
                    }
                } else {
                    message.warning('请选择有效的兑换目标');
                }
            } else if (fromType === 'magic_value') {
                message.warning('暂不支持魔力值直接兑换点券或积分，请使用勋章兑换功能');
            }
        } catch (error) {
            console.error(error);
            message.error('兑换失败');
        } finally {
            setExchangeLoading(false);
        }
    };

    const handleExchangeBadge = async () => {
        if (badgeIdToExchange === null || badgeIdToExchange <= 0) {
            message.warning('请选择要兑换的勋章');
            return;
        }
        if (userBadges.some(badge => badge.titleId === badgeIdToExchange)) {
            message.warning('您已拥有此勋章，请勿重复兑换');
            return;
        }
        setBadgeExchangeLoading(true);
        try {
            const res: ApiResponse<ExchangeMagicValueForBadgeResponseData> = await exchangeMagicValueForBadge(badgeIdToExchange);
            if (res.code === 200) {
                message.success(res.message || '勋章兑换成功');
                fetchUserValues();
                fetchUserOwnedBadges();
                setBadgeIdToExchange(null);
            } else {
                message.error(res.message || '勋章兑换失败');
            }
        } catch (error) {
            console.error(error);
            message.error('勋章兑换失败');
        } finally {
            setBadgeExchangeLoading(false);
        }
    };

    // 点券充值处理函数
    const handleRecharge = async () => {
        if (rechargeAmount <= 0) {
            message.warning('请输入有效的充值金额');
            return;
        }
        setRechargeLoading(true);
        try {
            const res: ApiResponse<TicketRechargeResponseData> = await rechargeTicket(rechargeAmount);
            if (res.code === 200) {
                message.success(res.message || '充值成功');
                setUserValues(prev => ({
                    ...prev,
                    tickets: res.data.remainingTicket,
                    magic_value: res.data.remainingMagicValue,
                    points: res.data.remainingPoint,
                }));
                setRechargeAmount(0);
            } else {
                message.error(res.message || '充值失败');
            }
        } catch (error) {
            console.error(error);
            message.error('充值失败');
        } finally {
            setRechargeLoading(false);
        }
    };

    const exchangeRates = {
        ticketsToMagicValue: 10,
        ticketsToPoints: 10,
    };

    const calculateExchangeResult = () => {
        if (exchangeAmount <= 0) return 0;
        if (fromType === 'tickets') {
            if (toType === 'magic_value') {
                return exchangeAmount * exchangeRates.ticketsToMagicValue;
            }
            if (toType === 'points') {
                return exchangeAmount * exchangeRates.ticketsToPoints;
            }
        }
        return 0;
    };

    return (
        <div>
            <Navbar name="兑换中心">
                <h1 className="text-2xl font-bold mb-6">兑换中心</h1>

                {/* 用户积分概览 */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                    <Card loading={loading}>
                        <Statistic title="点券" value={userValues.tickets} precision={0} />
                    </Card>
                    <Card loading={loading}>
                        <Statistic title="魔力值" value={userValues.magic_value} precision={2} />
                    </Card>
                    <Card loading={loading}>
                        <Statistic title="积分" value={userValues.points} precision={0} />
                    </Card>
                </div>

                <Divider>点券充值</Divider>
                <div className="bg-white p-6 rounded-lg shadow mb-8 flex flex-col md:flex-row items-center gap-4">
                    <InputNumber
                        className="w-full"
                        min={1}
                        value={rechargeAmount}
                        onChange={v => setRechargeAmount(v || 0)}
                        placeholder="请输入充值点券数量"
                    />
                    <Button
                        type="primary"
                        loading={rechargeLoading}
                        onClick={handleRecharge}
                        className="w-full md:w-auto"
                    >
                        充值
                    </Button>
                </div>

                <Divider>每日签到</Divider>
                <div className="bg-white p-6 rounded-lg shadow mb-8 text-center">
                    <Button
                        type="primary"
                        size="large"
                        onClick={handleDailySignIn}
                        loading={signInLoading}
                        disabled={isSignedToday}
                    >
                        {isSignedToday ? '今日已签到' : '立即签到'}
                    </Button>
                    {signInResult && (
                        <div className="mt-4 text-lg">
                            <p>恭喜您，签到成功！</p>
                            <p>获得积分: <span className="font-bold text-green-600">{signInResult.points}</span></p>
                            <p>获得魔力值: <span className="font-bold text-blue-600">{signInResult.magicValue}</span></p>
                        </div>
                    )}
                </div>

                <Divider>积分兑换</Divider>
                <div className="bg-white p-6 rounded-lg shadow mb-8">
                    <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
                        <div className="flex-1 w-full">
                            <label className="block text-sm font-medium mb-1">兑换来源</label>
                            <Select
                                className="w-full"
                                value={fromType}
                                onChange={(value) => {
                                    setFromType(value as 'tickets' | 'magic_value');
                                    if (value === 'tickets') {
                                        setToType('magic_value');
                                    } else {
                                        setToType('points');
                                    }
                                    setExchangeAmount(0);
                                }}
                                options={[
                                    { value: 'tickets', label: '点券' },
                                    { value: 'magic_value', label: '魔力值' },
                                ]}
                            />
                        </div>
                        <div className="flex-1 w-full">
                            <label className="block text-sm font-medium mb-1">兑换数量</label>
                            <InputNumber
                                className="w-full"
                                min={0}
                                max={fromType === 'tickets' ? userValues.tickets : userValues.magic_value}
                                value={exchangeAmount}
                                onChange={(value) => setExchangeAmount(value || 0)}
                                disabled={fromType === 'magic_value' && toType !== 'points'}
                            />
                        </div>
                        <div className="flex-1 w-full">
                            <label className="block text-sm font-medium mb-1">兑换目标</label>
                            <Select
                                className="w-full"
                                value={toType}
                                onChange={(value) => setToType(value as 'magic_value' | 'points')}
                                options={[
                                    { value: 'magic_value', label: '魔力值' },
                                    { value: 'points', label: '积分' },
                                ]}
                                disabled={fromType === 'magic_value'}
                            />
                        </div>
                    </div>
                    {exchangeAmount > 0 && (
                        <div className="mb-6 p-4 bg-gray-50 rounded">
                            <p className="text-center">
                                兑换比例: 1 {fromType === 'tickets' ? '点券' : '魔力值'} =
                                {fromType === 'tickets' && toType === 'magic_value'
                                    ? ` 10 魔力值`
                                    : fromType === 'tickets' && toType === 'points'
                                        ? ` 10 积分`
                                        : ''}
                            </p>
                            <p className="text-center font-bold text-lg">
                                你将获得: {calculateExchangeResult().toFixed(2)}{' '}
                                {toType === 'magic_value' ? '魔力值' : '积分'}
                            </p>
                        </div>
                    )}
                    <Button
                        type="primary"
                        size="large"
                        className="w-full"
                        onClick={handleExchange}
                        loading={exchangeLoading}
                        disabled={exchangeAmount <= 0 || (fromType === 'magic_value' && toType !== 'points')}
                    >
                        确认兑换
                    </Button>
                </div>

                <Divider>魔力值兑换勋章</Divider>
                <div className="bg-white p-6 rounded-lg shadow">
                    <div className="mb-6">
                        <label className="block text-sm font-medium mb-1">选择勋章 (魔力值: {userValues.magic_value})</label>
                        <Select
                            className="w-full"
                            value={badgeIdToExchange}
                            onChange={(value) => setBadgeIdToExchange(value)}
                            placeholder="请选择要兑换的勋章"
                            loading={badgesLoading}
                            options={allBadges.map(badge => ({
                                value: badge.titleId,
                                label: badge.titleName,
                                disabled: userBadges.some(userBadge => userBadge.titleId === badge.titleId)
                            }))}
                        />
                    </div>
                    <Button
                        type="primary"
                        size="large"
                        className="w-full"
                        onClick={handleExchangeBadge}
                        loading={badgeExchangeLoading}
                        disabled={badgeIdToExchange === null || badgeIdToExchange <= 0 || userBadges.some(badge => badge.titleId === badgeIdToExchange)}
                    >
                        兑换勋章
                    </Button>
                    <div className="mt-6">
                        <h3 className="text-lg font-semibold mb-2">您已拥有的勋章:</h3>
                        {badgesLoading ? (
                            <p>加载中...</p>
                        ) : userBadges.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                                {userBadges.map(badge => (
                                    <Tag key={badge.titleId} color="blue">{badge.titleName}</Tag>
                                ))}
                            </div>
                        ) : (
                            <p>您目前还没有任何勋章。</p>
                        )}
                    </div>
                </div>
            </Navbar>
        </div>
    );
}