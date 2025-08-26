'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Weight, Plus, TrendingDown, Calendar, Activity, Target } from 'lucide-react';
import { Customer, WeightRecord, ConsumptionRecord } from '@/lib/types';
import { format } from 'date-fns';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function CustomerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const customerId = params.id as string;

  const [customer, setCustomer] = useState<Customer | null>(null);
  const [weightRecords, setWeightRecords] = useState<WeightRecord[]>([]);
  const [consumptionRecords, setConsumptionRecords] = useState<ConsumptionRecord[]>([]);
  const [showWeightModal, setShowWeightModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'weight' | 'consumption'>('overview');
  
  const [weightForm, setWeightForm] = useState({
    weight: '',
    body_fat_percentage: '',
    muscle_mass: '',
    notes: '',
  });

  useEffect(() => {
    if (customerId) {
      fetchCustomerData();
      fetchWeightRecords();
      fetchConsumptionRecords();
    }
  }, [customerId]);

  const fetchCustomerData = async () => {
    try {
      const response = await fetch(`/api/customers/${customerId}`);
      const data = await response.json();
      setCustomer(data);
    } catch (error) {
      console.error('Failed to fetch customer:', error);
    }
  };

  const fetchWeightRecords = async () => {
    try {
      const response = await fetch(`/api/weight-records?customerId=${customerId}`);
      const data = await response.json();
      setWeightRecords(data);
    } catch (error) {
      console.error('Failed to fetch weight records:', error);
    }
  };

  const fetchConsumptionRecords = async () => {
    try {
      const response = await fetch(`/api/consumption?customerId=${customerId}`);
      const data = await response.json();
      setConsumptionRecords(data);
    } catch (error) {
      console.error('Failed to fetch consumption records:', error);
    }
  };

  const handleWeightSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const recordData = {
      customer_id: parseInt(customerId),
      weight: parseFloat(weightForm.weight),
      body_fat_percentage: weightForm.body_fat_percentage ? parseFloat(weightForm.body_fat_percentage) : null,
      muscle_mass: weightForm.muscle_mass ? parseFloat(weightForm.muscle_mass) : null,
      notes: weightForm.notes,
    };

    try {
      await fetch('/api/weight-records', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(recordData),
      });
      
      fetchWeightRecords();
      setShowWeightModal(false);
      setWeightForm({
        weight: '',
        body_fat_percentage: '',
        muscle_mass: '',
        notes: '',
      });
    } catch (error) {
      console.error('Failed to save weight record:', error);
    }
  };

  const handleDeleteWeightRecord = async (id: number) => {
    if (confirm('确定要删除这条记录吗？')) {
      try {
        await fetch(`/api/weight-records/${id}`, { method: 'DELETE' });
        fetchWeightRecords();
      } catch (error) {
        console.error('Failed to delete weight record:', error);
      }
    }
  };

  if (!customer) {
    return <div className="p-8">加载中...</div>;
  }

  // 准备图表数据
  const chartData = weightRecords
    .slice()
    .reverse()
    .map((record) => ({
      date: format(new Date(record.recorded_at), 'MM/dd'),
      weight: record.weight,
      bodyFat: record.body_fat_percentage,
      muscleMass: record.muscle_mass,
    }));

  // 计算减重进度
  const currentWeight = weightRecords.length > 0 ? weightRecords[0].weight : customer.initial_weight;
  const weightLoss = customer.initial_weight && currentWeight ? customer.initial_weight - currentWeight : 0;
  const targetLoss = customer.initial_weight && customer.target_weight ? customer.initial_weight - customer.target_weight : 0;
  const progressPercentage = targetLoss > 0 ? Math.min((weightLoss / targetLoss) * 100, 100) : 0;

  // 计算总消费
  const totalConsumption = consumptionRecords.reduce((sum, record) => sum + record.amount, 0);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={() => router.back()}
            className="mr-4 p-2 rounded-lg hover:bg-gray-100"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">{customer.name}的健康档案</h1>
            <p className="text-gray-600 mt-1">{customer.phone}</p>
          </div>
        </div>
      </div>

      {/* 选项卡 */}
      <div className="bg-white rounded-lg shadow-md mb-6">
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-6 py-3 font-medium ${
              activeTab === 'overview'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            概览
          </button>
          <button
            onClick={() => setActiveTab('weight')}
            className={`px-6 py-3 font-medium ${
              activeTab === 'weight'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            体重记录
          </button>
          <button
            onClick={() => setActiveTab('consumption')}
            className={`px-6 py-3 font-medium ${
              activeTab === 'consumption'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            消费记录
          </button>
        </div>
      </div>

      {/* 概览标签页 */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* 统计卡片 */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <Weight className="w-8 h-8 text-blue-500" />
              </div>
              <h3 className="text-gray-600 text-sm mb-1">当前体重</h3>
              <p className="text-2xl font-bold text-gray-800">
                {currentWeight ? `${currentWeight} kg` : '-'}
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <TrendingDown className="w-8 h-8 text-green-500" />
              </div>
              <h3 className="text-gray-600 text-sm mb-1">已减重</h3>
              <p className="text-2xl font-bold text-green-600">
                {weightLoss > 0 ? `${weightLoss.toFixed(1)} kg` : '0 kg'}
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <Target className="w-8 h-8 text-purple-500" />
              </div>
              <h3 className="text-gray-600 text-sm mb-1">目标体重</h3>
              <p className="text-2xl font-bold text-gray-800">
                {customer.target_weight ? `${customer.target_weight} kg` : '-'}
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <Activity className="w-8 h-8 text-orange-500" />
              </div>
              <h3 className="text-gray-600 text-sm mb-1">总消费</h3>
              <p className="text-2xl font-bold text-gray-800">
                ¥{totalConsumption.toFixed(2)}
              </p>
            </div>
          </div>

          {/* 进度条 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">减重进度</h2>
            <div className="mb-2 flex justify-between text-sm text-gray-600">
              <span>初始: {customer.initial_weight || '-'} kg</span>
              <span>当前: {currentWeight || '-'} kg</span>
              <span>目标: {customer.target_weight || '-'} kg</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div
                className="bg-gradient-to-r from-blue-400 to-green-500 h-4 rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <p className="mt-2 text-center text-sm text-gray-600">
              完成 {progressPercentage.toFixed(1)}%
            </p>
          </div>

          {/* 体重趋势图 */}
          {chartData.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">体重趋势</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="weight"
                    stroke="#3B82F6"
                    name="体重(kg)"
                    strokeWidth={2}
                  />
                  {chartData.some(d => d.bodyFat) && (
                    <Line
                      type="monotone"
                      dataKey="bodyFat"
                      stroke="#10B981"
                      name="体脂率(%)"
                      strokeWidth={2}
                    />
                  )}
                  {chartData.some(d => d.muscleMass) && (
                    <Line
                      type="monotone"
                      dataKey="muscleMass"
                      stroke="#F59E0B"
                      name="肌肉量(kg)"
                      strokeWidth={2}
                    />
                  )}
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* 客户信息 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">基本信息</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm text-gray-600">性别</label>
                <p className="text-gray-800">{customer.gender === 'male' ? '男' : '女'}</p>
              </div>
              <div>
                <label className="text-sm text-gray-600">年龄</label>
                <p className="text-gray-800">{customer.age || '-'}</p>
              </div>
              <div>
                <label className="text-sm text-gray-600">身高</label>
                <p className="text-gray-800">{customer.height ? `${customer.height} cm` : '-'}</p>
              </div>
              <div>
                <label className="text-sm text-gray-600">地址</label>
                <p className="text-gray-800">{customer.address || '-'}</p>
              </div>
              <div>
                <label className="text-sm text-gray-600">注册时间</label>
                <p className="text-gray-800">{format(new Date(customer.created_at), 'yyyy-MM-dd')}</p>
              </div>
              <div>
                <label className="text-sm text-gray-600">备注</label>
                <p className="text-gray-800">{customer.notes || '-'}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 体重记录标签页 */}
      {activeTab === 'weight' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800">体重记录</h2>
            <button
              onClick={() => setShowWeightModal(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center"
            >
              <Plus className="w-5 h-5 mr-2" />
              添加记录
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">日期</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">体重</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">体脂率</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">肌肉量</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">变化</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">备注</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">操作</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {weightRecords.map((record, index) => {
                  const previousWeight = index < weightRecords.length - 1 ? weightRecords[index + 1].weight : null;
                  const weightChange = previousWeight ? record.weight - previousWeight : 0;
                  
                  return (
                    <tr key={record.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {format(new Date(record.recorded_at), 'yyyy-MM-dd HH:mm')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {record.weight} kg
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {record.body_fat_percentage ? `${record.body_fat_percentage}%` : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {record.muscle_mass ? `${record.muscle_mass} kg` : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {previousWeight && (
                          <span className={weightChange <= 0 ? 'text-green-600' : 'text-red-600'}>
                            {weightChange > 0 ? '+' : ''}{weightChange.toFixed(1)} kg
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {record.notes || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={() => handleDeleteWeightRecord(record.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          删除
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 消费记录标签页 */}
      {activeTab === 'consumption' && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">日期</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">服务类型</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">金额</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">支付方式</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">备注</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {consumptionRecords.map((record) => (
                <tr key={record.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {format(new Date(record.created_at), 'yyyy-MM-dd HH:mm')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {record.service_type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    ¥{record.amount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {record.payment_method || '-'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {record.description || '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 添加体重记录弹窗 */}
      {showWeightModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">添加体重记录</h2>
            <form onSubmit={handleWeightSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">体重 (kg) *</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={weightForm.weight}
                    onChange={(e) => setWeightForm({ ...weightForm, weight: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">体脂率 (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={weightForm.body_fat_percentage}
                    onChange={(e) => setWeightForm({ ...weightForm, body_fat_percentage: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">肌肉量 (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={weightForm.muscle_mass}
                    onChange={(e) => setWeightForm({ ...weightForm, muscle_mass: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">备注</label>
                  <textarea
                    value={weightForm.notes}
                    onChange={(e) => setWeightForm({ ...weightForm, notes: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowWeightModal(false);
                    setWeightForm({
                      weight: '',
                      body_fat_percentage: '',
                      muscle_mass: '',
                      notes: '',
                    });
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  添加记录
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}