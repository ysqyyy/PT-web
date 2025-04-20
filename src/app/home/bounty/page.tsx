'use client';

import { useState } from 'react';
import Navbar from '../../../components/Navbar';

type BountyItem = {
  id: number;
  name: string;
  reward: string;
  publisher: string;
  status: '进行中' | '已完成' | '已取消';
};

const mockData: BountyItem[] = [
  { id: 1, name: '高清电影资源', reward: '100积分', publisher: '用户A', status: '进行中' },
  { id: 2, name: '冷门软件破解', reward: '300积分', publisher: '用户B', status: '已完成' },
  { id: 3, name: '动漫全集打包', reward: '200积分', publisher: '用户C', status: '进行中' },
];

export default function BountyPage() {
  const [bounties, setBounties] = useState<BountyItem[]>(mockData);

  const handleSubmit = (id: number) => {
    setBounties(mockData);//需删除
    alert(`提交资源给悬赏 ID: ${id}`);
  };

  const handleAppeal = (id: number) => {
    alert(`处理申诉，悬赏 ID: ${id}`);
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
                <td className="p-4 space-x-2">
                  <button
                    onClick={() => handleSubmit(item.id)}
                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    提交
                  </button>
                  <button
                    onClick={() => handleAppeal(item.id)}
                    className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                  >
                    处理申诉
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      </Navbar>
    </div>
  );
}
