'use client';

import { useState } from "react";
import { Table, Button, Select, Modal } from "antd";
import type { ColumnsType } from "antd/es/table";
import Navbar from "@/components/Navbar";
import DashboardLayout from "@/components/DashboardLayout";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAdmin } from "@/hooks/useAdmin";
import { UserItem, ReportItem } from "@/apinew/adminApi";

const levelOptions = [
  { value: 1, label: "1" },
  { value: 2, label: "2" },
  { value: 3, label: "3" },
  { value: 4, label: "4" },
  { value: 5, label: "5" },
  { value: 6, label: "6" },
];

export function UsersPage() {
  // 使用useAdmin钩子
  const { 
    useAllUsers, 
    useAllReports, 
    setUserLevelMutation, 
    handleReportMutation 
  } = useAdmin();
  
  // 获取用户数据
  const { 
    data: users = [], 
    isLoading: userLoading 
  } = useAllUsers();
  
  // 获取举报数据
  const { 
    data: reports = [], 
    isLoading: reportLoading 
  } = useAllReports();

  // 用户等级修改相关状态
  const [levelModal, setLevelModal] = useState<{ open: boolean; userId: number | null }>({ open: false, userId: null });
  const [selectedLevel, setSelectedLevel] = useState<number>(1);

  // 设置为管理员
  const handleSetAdmin = (userId: number) => {
    setUserLevelMutation.mutate({ 
      userId, 
      level: 7 
    });
  };

  // 用户降级
  const handleShowLevelModal = (userId: number) => {
    setLevelModal({ open: true, userId });
    setSelectedLevel(1);
  };

  const handleLevelChange = (value: number) => {
    setSelectedLevel(value);
  };

  const handleLevelSubmit = () => {
    if (levelModal.userId == null) return;
    
    setUserLevelMutation.mutate({ 
      userId: levelModal.userId, 
      level: selectedLevel 
    }, {
      onSuccess: () => {
        setLevelModal({ open: false, userId: null });
      }
    });
  };

  // 举报同意
  const handleAgree = (record: ReportItem) => {
    handleReportMutation.mutate({
      reportId: record.reportId,
      userId: record.reportedUserId,
      commentId: record.commentId
    });
  };
  // 用户管理表格
  const userColumns: ColumnsType<UserItem> = [
    { title: "用户名", dataIndex: "userName", key: "userName" },
    { title: "用户等级", dataIndex: "userLevel", key: "userLevel" },
    { title: "用户角色", dataIndex: "role", key: "role" },
    { title: "用户状态", dataIndex: "userStatus", key: "userStatus", render: (v) => v || "无" },
    { title: "注册日期", dataIndex: "createdTime", key: "createdTime", render: (v) => v ? v.split("T")[0] : "无" },
    {
      title: "操作",
      key: "action",
      render: (_, record) => (
          <div>
            <Button 
              size="small" 
              onClick={() => handleSetAdmin(record.userId)} 
              style={{ marginRight: 8 }}
              loading={setUserLevelMutation.isPending}
              disabled={setUserLevelMutation.isPending}
            >
              设置为管理员
            </Button>
            <Button 
              size="small" 
              onClick={() => handleShowLevelModal(record.userId)}
              disabled={setUserLevelMutation.isPending}
            >
              用户降级
            </Button>
          </div>
      ),
    },
  ];

  // 举报管理表格
  const reportColumns: ColumnsType<ReportItem> = [
    { title: "被举报者", dataIndex: "reportedUserName", key: "reportedUserName" },
    { title: "被举报评论", dataIndex: "commentContent", key: "commentContent" },
    { title: "举报原因", dataIndex: "reason", key: "reason" },
    { title: "举报状态", dataIndex: "reportStatus", key: "reportStatus", render: () => "待处理" },
    { title: "被举报者状态", dataIndex: "reportedUserStatus", key: "reportedUserStatus" },
    { title: "举报日期", dataIndex: "createTime", key: "createTime", render: (v) => v.split("T")[0] },
    {
      title: "操作",
      key: "action",
      render: (_, record) => (
          <Button 
            size="small" 
            type="primary" 
            onClick={() => handleAgree(record)}
            loading={handleReportMutation.isPending}
            disabled={handleReportMutation.isPending}
          >
            同意
          </Button>
      ),
    },
  ];

  return (
      <Navbar name="个人中心">
        <DashboardLayout title="举报管理">
          <div className="bg-white rounded-xl shadow p-6 mb-8">
            <h2 className="text-lg font-semibold mb-4">用户管理</h2>
            <Table
                rowKey="userId"
                columns={userColumns}
                dataSource={users}
                loading={userLoading}
                pagination={false}
            />
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-lg font-semibold mb-4">举报处理</h2>
            <Table
                rowKey="reportId"
                columns={reportColumns}
                dataSource={reports}
                loading={reportLoading}
                pagination={false}
            />
          </div>          <Modal
              open={levelModal.open}
              title="用户降级"
              onCancel={() => setLevelModal({ open: false, userId: null })}
              onOk={handleLevelSubmit}
              confirmLoading={setUserLevelMutation.isPending}
          >
            <Select
                style={{ width: "100%" }}
                value={selectedLevel}
                onChange={handleLevelChange}
                options={levelOptions}
                placeholder="请选择降级等级"
                disabled={setUserLevelMutation.isPending}
            />
          </Modal>
        </DashboardLayout>
      </Navbar>
  );
}

// 包装组件，加入路由保护
export default function UsersPageWithProtection() {
  return (
    <ProtectedRoute requiredLevel={6}>
      <UsersPage />
    </ProtectedRoute>
  );
}