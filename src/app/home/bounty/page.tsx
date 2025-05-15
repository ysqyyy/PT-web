"use client";

import { useState, useEffect } from "react";
import { getBountyList, submitSeed } from "../../../api/bounty";
import type { BountyItem } from "../../../types/bounty";
import Navbar from "../../../components/Navbar";
import { Upload, Button, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

export default function BountyPage() {
  const [bounties, setBounties] = useState<BountyItem[]>([]);
  // 弹窗相关状态
  const [showSeedModal, setShowSeedModal] = useState(false);
  const [seedId, setSeedId] = useState<number | null>(null);

  // 文件上传相关状态
  const [seedFile, setSeedFile] = useState<File | null>(null);

  // antd Upload 组件的自定义 beforeUpload
  const beforeUpload = (file: File) => {
    setSeedFile(file);
    return false; // 阻止自动上传
  };

  // 提交种子响应（支持文件上传）
  const handleSubmitSeed = async () => {
    if (!seedId ||  !seedFile) return;
    await submitSeed(seedId,seedFile);
    message.success('已提交种子');
    closeSeedModal();
  };

  useEffect(() => {
    getBountyList().then(setBounties);
  }, []);

  // 打开提交种子弹窗
  const openSeedModal = (id: number) => {
    setSeedId(id);
    setSeedFile(null);
    setShowSeedModal(true);
  };
  // 关闭弹窗
  const closeSeedModal = () => {
    setShowSeedModal(false);
    setSeedId(null);
    setSeedFile(null);
  };

  return (
    <div>
      <Navbar name="资源悬赏">
        <h1 className="text-2xl font-bold mb-6">资源悬赏</h1>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow border rounded-lg">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-4">名称</th>
                <th className="p-4">赏金</th>
                <th className="p-4">发布人</th>
                <th className="p-4">悬赏状态</th>
                <th className="p-4">描述</th>
                <th className="p-4">操作</th>
              </tr>
            </thead>
            <tbody>
              {bounties.map((item) => (
                <tr key={item.id} className="border-t hover:bg-gray-50">
                  <td className="p-4">{item.name}</td>
                  <td className="p-4">{item.reward}</td>
                  <td className="p-4">{item.publisher}</td>
                  <td className="p-4">{item.status}</td>
                  <td className="p-4">{item.description}</td>
                  <td className="p-4 space-y-1 flex flex-col">
                    {item.status === "进行中" && (
                      <button
                        onClick={() => openSeedModal(item.id)}
                        className="px-1 py-1 bg-teal-700 text-white rounded hover:bg-teal-900 mb-1"
                      >
                        提交种子
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* 提交种子弹窗 */}
        {showSeedModal && (
          <div className="fixed inset-0 flex items-center justify-center z-50" style={{ background: "rgba(0,0,0,0.15)" }}>
            <div className="bg-white p-6 rounded-2xl shadow-lg w-80">
              <h2 className="text-lg font-bold mb-4">提交种子</h2>
              <Upload
                beforeUpload={beforeUpload}
                accept=".torrent"
                maxCount={1}
                showUploadList={!!seedFile}
                fileList={seedFile ? [{ uid: '-1', name: seedFile.name }] : []}
                onRemove={() => setSeedFile(null)}
              >
                <Button icon={<UploadOutlined />}>选择.torrent文件</Button>
              </Upload>
              <div className="flex justify-end space-x-2 mt-4">
                <button
                  onClick={closeSeedModal}
                  className="px-4 py-1 bg-gray-300 rounded hover:bg-gray-400"
                >
                  取消
                </button>
                <button
                  onClick={handleSubmitSeed}
                  className="px-4 py-1 bg-teal-700 text-white rounded hover:bg-teal-900"
                  disabled={!seedFile}
                >
                  确认提交
                </button>
              </div>
            </div>
          </div>
        )}
      </Navbar>
    </div>
  );
}
