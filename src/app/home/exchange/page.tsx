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
                <h1 className="text-2xl font-bold mb-6 text-gray-800">兑换中心</h1>

                {/* 用户积分概览 */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                    <Card loading={loading} className="hover:shadow-md transition-shadow">
                        <Statistic
                            title={<span className="text-gray-700">点券</span>}
                            value={userValues.tickets}
                            precision={0}
                            valueStyle={{color: '#3f8600'}}
                            prefix={<span className="text-yellow-500 mr-1">🎫</span>}
                        />
                    </Card>
                    <Card loading={loading} className="hover:shadow-md transition-shadow">
                        <Statistic
                            title={<span className="text-gray-700">魔力值</span>}
                            value={userValues.magic_value}
                            precision={2}
                            valueStyle={{color: '#1890ff'}}
                            prefix={<span className="text-blue-500 mr-1">✨</span>}
                        />
                    </Card>
                    <Card loading={loading} className="hover:shadow-md transition-shadow">
                        <Statistic
                            title={<span className="text-gray-700">积分</span>}
                            value={userValues.points}
                            precision={0}
                            valueStyle={{color: '#722ed1'}}
                            prefix={<span className="text-purple-500 mr-1">🏆</span>}
                        />
                    </Card>
                </div>

                {/* 第一行：左侧点券充值和每日签到，右侧积分兑换 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    {/* 左侧：点券充值和每日签到 */}
                    <div className="space-y-4 md:col-span-1">
                        {/* 点券充值 */}
                        <div className="bg-white p-6 rounded-lg shadow-sm">
                            <h3 className="text-lg font-medium text-gray-700 mb-4">点券充值</h3>
                            <div className="flex flex-col gap-4">
                                <InputNumber
                                    className="w-full"
                                    min={1}
                                    value={rechargeAmount}
                                    onChange={v => setRechargeAmount(v || 0)}
                                    placeholder="请输入充值点券数量"
                                    addonBefore={<span className="text-yellow-500">🎫</span>}
                                />
                                <Button
                                    type="primary"
                                    loading={rechargeLoading}
                                    onClick={handleRecharge}
                                    className="w-full"
                                    icon={<span className="mr-1">💎</span>}
                                >
                                    充值
                                </Button>
                            </div>
                        </div>

                        {/* 每日签到 */}
                        <div className="bg-white p-6 rounded-lg shadow-sm">
                            <h3 className="text-lg font-medium text-gray-700 mb-4">每日签到</h3>
                            <div className="flex flex-col gap-4">
                                <Button
                                    type="primary"
                                    size="large"
                                    onClick={handleDailySignIn}
                                    loading={signInLoading}
                                    disabled={isSignedToday}
                                    className={`w-full ${isSignedToday ? 'bg-gray-400' : 'bg-green-500 hover:bg-green-600'}`}
                                    icon={<span className="mr-1">📅</span>}
                                >
                                    {isSignedToday ? '今日已签到' : '立即签到'}
                                </Button>
                                {signInResult && (
                                    <div className="p-3 bg-green-50 rounded">
                                        <p className="text-gray-800">恭喜您，签到成功！</p>
                                        <p className="text-gray-700">
                                            获得积分: <span
                                            className="font-medium text-purple-600">{signInResult.points}</span>
                                        </p>
                                        <p className="text-gray-700">
                                            获得魔力值: <span
                                            className="font-medium text-blue-600">{signInResult.magicValue}</span>
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* 右侧：积分兑换 */}
                    <div className="bg-white p-6 rounded-lg shadow-sm md:col-span-2">
                        <h3 className="text-lg font-medium text-gray-700 mb-4">积分兑换</h3>
                        <div className="flex flex-col gap-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-medium text-gray-700">兑换来源</label>
                                    <Select
                                        className="w-full"
                                        value={fromType}
                                        onChange={(value) => {
                                            setFromType(value as 'tickets');
                                            setToType('magic_value');
                                            setExchangeAmount(0);
                                        }}
                                        options={[
                                            {value: 'tickets', label: '🎫 点券'}
                                        ]}
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-medium text-gray-700">兑换数量</label>
                                    <InputNumber
                                        className="w-full"
                                        min={0}
                                        max={userValues.tickets}
                                        value={exchangeAmount}
                                        onChange={(value) => setExchangeAmount(value || 0)}
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-medium text-gray-700">兑换目标</label>
                                    <Select
                                        className="w-full"
                                        value={toType}
                                        onChange={(value) => setToType(value as 'magic_value' | 'points')}
                                        options={[
                                            {value: 'magic_value', label: '✨ 魔力值'},
                                            {value: 'points', label: '🏆 积分'},
                                        ]}
                                    />
                                </div>
                            </div>
                            {exchangeAmount > 0 && (
                                <div className="p-3 bg-blue-50 rounded">
                                    <p className="text-center text-sm text-gray-700">
                                        兑换比例: 1 点券 = {toType === 'magic_value' ? '10 魔力值' : '10 积分'}
                                    </p>
                                    <p className="text-center font-medium text-blue-600">
                                        你将获得: {calculateExchangeResult().toFixed(2)}{' '}
                                        {toType === 'magic_value' ? '魔力值' : '积分'}
                                    </p>
                                </div>
                            )}
                            <Button
                                type="primary"
                                className="w-full"
                                onClick={handleExchange}
                                loading={exchangeLoading}
                                disabled={exchangeAmount <= 0}
                                icon={<span className="mr-1">🔄</span>}
                            >
                                确认兑换
                            </Button>
                        </div>
                    </div>
                </div>

                {/* 第二行：勋章相关 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* 已拥有的勋章 */}
                    <div className="bg-white p-6 rounded-lg shadow-sm md:col-span-1">
                        <h3 className="text-lg font-medium text-gray-700 mb-4">已拥有的勋章</h3>
                        {badgesLoading ? (
                            <p className="text-gray-500">加载中...</p>
                        ) : userBadges.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                                {userBadges.map(badge => (
                                    <Tag
                                        key={badge.titleId}
                                        color="purple"
                                        className="px-3 py-1"
                                    >
                                        🏅 {badge.titleName}
                                    </Tag>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500">您目前还没有任何勋章。</p>
                        )}
                    </div>

                    {/* 选择勋章 */}
                    <div className="bg-white p-6 rounded-lg shadow-sm md:col-span-2">
                        <h3 className="text-lg font-medium text-gray-700 mb-4">兑换勋章</h3>
                        <div className="flex flex-col gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    选择勋章 <span className="text-blue-600">(魔力值: {userValues.magic_value})</span>
                                </label>
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
                                className="w-full bg-purple-600 hover:bg-purple-700"
                                onClick={handleExchangeBadge}
                                loading={badgeExchangeLoading}
                                disabled={badgeIdToExchange === null || badgeIdToExchange <= 0 || userBadges.some(badge => badge.titleId === badgeIdToExchange)}
                                icon={<span className="mr-1">🏅</span>}
                            >
                                兑换勋章
                            </Button>
                        </div>
                    </div>
                </div>
            </Navbar>
        </div>
    );
}