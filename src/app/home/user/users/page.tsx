'use client';

import { useEffect, useState } from "react";
import { Table, Button, Select, message, Modal } from "antd";
import type { ColumnsType } from "antd/es/table";
import Navbar from "@/components/Navbar";
import DashboardLayout from "@/components/DashboardLayout";
import ProtectedRoute from "@/components/ProtectedRoute";
import {
  getAllUsers,
  setUserLevel,
  getAllReports,
  handleReport,
  UserItem,
  ReportItem,
} from "@/api/admin";

const levelOptions = [
  { value: 1, label: "1" },
  { value: 2, label: "2" },
  { value: 3, label: "3" },
  { value: 4, label: "4" },
  { value: 5, label: "5" },
  { value: 6, label: "6" },
];

export function UsersPage() {
  // 用户管理
  const [users, setUsers] = useState<UserItem[]>([]);
  const [userLoading, setUserLoading] = useState(false);
  const [levelModal, setLevelModal] = useState<{ open: boolean; userId: number | null }>({ open: false, userId: null });
  const [selectedLevel, setSelectedLevel] = useState<number>(1);

  // 举报管理
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [reportLoading, setReportLoading] = useState(false);

  // 加载数据
  useEffect(() => {
    fetchUsers();
    fetchReports();
  }, []);

  const fetchUsers = async () => {
    setUserLoading(true);
    try {
      const data = await getAllUsers();
      setUsers(data);
    } catch {
      message.error("获取用户失败");
    } finally {
      setUserLoading(false);
    }
  };

  const fetchReports = async () => {
    setReportLoading(true);
    try {
      const data = await getAllReports();
      setReports(data);
    } catch {
      message.error("获取举报失败");
    } finally {
      setReportLoading(false);
    }
  };

  // 设置为管理员
  const handleSetAdmin = async (userId: number) => {
    try {
      await setUserLevel(userId, 7);
      message.success("设置为管理员成功");
      fetchUsers();
    } catch {
      message.error("操作失败");
    }
  };

  // 用户降级
  const handleShowLevelModal = (userId: number) => {
    setLevelModal({ open: true, userId });
    setSelectedLevel(1);
  };

  const handleLevelChange = (value: number) => {
    setSelectedLevel(value);
  };

  const handleLevelSubmit = async () => {
    if (levelModal.userId == null) return;
    try {
      await setUserLevel(levelModal.userId, selectedLevel);
      message.success("用户等级已修改");
      setLevelModal({ open: false, userId: null });
      fetchUsers();
    } catch {
      message.error("操作失败");
    }
  };

  // 举报同意
  const handleAgree = async (record: ReportItem) => {
    try {
      await handleReport(record.reportId, record.reportedUserId, record.commentId);
      message.success("举报处理成功");
      fetchReports();
    } catch {
      message.error("操作失败");
    }
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
            <Button size="small" onClick={() => handleSetAdmin(record.userId)} style={{ marginRight: 8 }}>
              设置为管理员
            </Button>
            <Button size="small" onClick={() => handleShowLevelModal(record.userId)}>
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
          <Button size="small" type="primary" onClick={() => handleAgree(record)}>
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
          </div>
          <Modal
              open={levelModal.open}
              title="用户降级"
              onCancel={() => setLevelModal({ open: false, userId: null })}
              onOk={handleLevelSubmit}
          >
            <Select
                style={{ width: "100%" }}
                value={selectedLevel}
                onChange={handleLevelChange}
                options={levelOptions}
                placeholder="请选择降级等级"
            />
          </Modal>
        </DashboardLayout>
      </Navbar>
  );
}

// 包装组件，加入路由保护
export default function UsersPageWithProtection() {
  return (
    <ProtectedRoute requiredLevel={2}>
      <UsersPage />
    </ProtectedRoute>
  );
}