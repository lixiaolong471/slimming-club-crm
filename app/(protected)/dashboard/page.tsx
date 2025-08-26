'use client';

import { useEffect, useState } from 'react';
import { Users, DollarSign, Calendar, TrendingUp } from 'lucide-react';
import { DashboardStats } from '@/lib/types';

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalCustomers: 0,
    monthlyRevenue: 0,
    todayAppointments: 0,
    activeCustomers: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/stats');
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const statCards = [
    {
      title: '总客户数',
      value: stats.totalCustomers,
      icon: Users,
      color: 'bg-blue-500',
    },
    {
      title: '本月收入',
      value: `¥${stats.monthlyRevenue.toFixed(2)}`,
      icon: DollarSign,
      color: 'bg-green-500',
    },
    {
      title: '今日预约',
      value: stats.todayAppointments,
      icon: Calendar,
      color: 'bg-purple-500',
    },
    {
      title: '活跃客户',
      value: stats.activeCustomers,
      icon: TrendingUp,
      color: 'bg-orange-500',
    },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">仪表盘</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div key={index} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`${card.color} text-white p-3 rounded-lg`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
              <h3 className="text-gray-600 text-sm mb-2">{card.title}</h3>
              <p className="text-2xl font-bold text-gray-800">{card.value}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">快速操作</h2>
          <div className="space-y-3">
            <a href="/customers" className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center">
                <Users className="w-5 h-5 text-blue-500 mr-3" />
                <span className="text-gray-700">添加新客户</span>
              </div>
            </a>
            <a href="/consumption" className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center">
                <DollarSign className="w-5 h-5 text-green-500 mr-3" />
                <span className="text-gray-700">记录消费</span>
              </div>
            </a>
            <a href="/appointments" className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center">
                <Calendar className="w-5 h-5 text-purple-500 mr-3" />
                <span className="text-gray-700">管理预约</span>
              </div>
            </a>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">系统信息</h2>
          <div className="space-y-3">
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">系统版本</span>
              <span className="text-gray-800">1.0.0</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">数据库状态</span>
              <span className="text-green-600">正常</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-600">最后更新</span>
              <span className="text-gray-800">{new Date().toLocaleDateString('zh-CN')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
