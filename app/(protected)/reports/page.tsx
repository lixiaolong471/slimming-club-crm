'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { 
  TrendingUp, Users, DollarSign, 
  Download, Award, UserCheck, Scale
} from 'lucide-react';
import { format, startOfMonth, endOfMonth } from 'date-fns';
import {
  RevenueData, ServiceTypeData, PaymentMethodData, CustomerStats,
  TopCustomer, WeightProgress, MonthlySummary
} from '@/lib/types';
import EmptyState from '@/components/EmptyState';

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState<'revenue' | 'customer' | 'service' | 'summary'>('revenue');
  const [dateRange, setDateRange] = useState({
    startDate: format(startOfMonth(new Date()), 'yyyy-MM-dd'),
    endDate: format(endOfMonth(new Date()), 'yyyy-MM-dd')
  });
  
  const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
  const [serviceTypeData, setServiceTypeData] = useState<ServiceTypeData[]>([]);
  const [paymentMethodData, setPaymentMethodData] = useState<PaymentMethodData[]>([]);
  const [customerStatsData, setCustomerStatsData] = useState<CustomerStats>({ gender: [], age: [] });
  const [topCustomersData, setTopCustomersData] = useState<TopCustomer[]>([]);
  const [weightProgressData, setWeightProgressData] = useState<WeightProgress[]>([]);
  const [monthlySummaryData, setMonthlySummaryData] = useState<MonthlySummary[]>([]);

  const fetchAllReports = useCallback(async () => {
    // 获取收入数据
    const revenueRes = await fetch(`/api/reports?type=revenue&startDate=${dateRange.startDate}&endDate=${dateRange.endDate}`);
    const revenue = await revenueRes.json();
    setRevenueData(revenue);

    // 获取服务类型数据
    const serviceRes = await fetch(`/api/reports?type=service-type&startDate=${dateRange.startDate}&endDate=${dateRange.endDate}`);
    const service = await serviceRes.json();
    setServiceTypeData(service);

    // 获取支付方式数据
    const paymentRes = await fetch(`/api/reports?type=payment-method&startDate=${dateRange.startDate}&endDate=${dateRange.endDate}`);
    const payment = await paymentRes.json();
    setPaymentMethodData(payment);

    // 获取客户统计
    const customerRes = await fetch('/api/reports?type=customer-stats');
    const customer = await customerRes.json();
    setCustomerStatsData(customer);

    // 获取TOP客户
    const topRes = await fetch('/api/reports?type=top-customers');
    const top = await topRes.json();
    setTopCustomersData(top);

    // 获取减重进度
    const weightRes = await fetch('/api/reports?type=weight-progress');
    const weight = await weightRes.json();
    setWeightProgressData(weight);

    // 获取月度汇总
    const monthlyRes = await fetch('/api/reports?type=monthly-summary');
    const monthly = await monthlyRes.json();
    setMonthlySummaryData(monthly);
  }, [dateRange]);

  useEffect(() => {
    fetchAllReports();
  }, [fetchAllReports]);

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

  // 计算总收入
  const totalRevenue = revenueData.reduce((sum, item) => sum + (item.total || 0), 0);
  const totalTransactions = revenueData.reduce((sum, item) => sum + (item.count || 0), 0);

  // 导出CSV功能
  const exportToCSV = (data: unknown[], filename: string) => {
    if (data.length === 0) return;
    
    const headers = Object.keys(data[0] as Record<string, unknown>).join(',');
    const rows = data.map(row => Object.values(row as Record<string, unknown>).join(','));
    const csv = [headers, ...rows].join('\n');
    
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${filename}_${format(new Date(), 'yyyy-MM-dd')}.csv`;
    link.click();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">统计报表</h1>
        <div className="flex gap-4">
          <div className="flex gap-2">
            <input
              type="date"
              value={dateRange.startDate}
              onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span className="flex items-center px-2">至</span>
            <input
              type="date"
              value={dateRange.endDate}
              onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <DollarSign className="w-8 h-8 text-green-500" />
          </div>
          <h3 className="text-gray-600 text-sm mb-1">期间总收入</h3>
          <p className="text-2xl font-bold text-gray-800">¥{totalRevenue.toFixed(2)}</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <TrendingUp className="w-8 h-8 text-blue-500" />
          </div>
          <h3 className="text-gray-600 text-sm mb-1">交易笔数</h3>
          <p className="text-2xl font-bold text-gray-800">{totalTransactions}</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <Users className="w-8 h-8 text-purple-500" />
          </div>
          <h3 className="text-gray-600 text-sm mb-1">活跃客户</h3>
          <p className="text-2xl font-bold text-gray-800">
            {topCustomersData.filter(c => c.total_amount > 0).length}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <Award className="w-8 h-8 text-orange-500" />
          </div>
          <h3 className="text-gray-600 text-sm mb-1">客单价</h3>
          <p className="text-2xl font-bold text-gray-800">
            ¥{totalTransactions > 0 ? (totalRevenue / totalTransactions).toFixed(2) : '0.00'}
          </p>
        </div>
      </div>

      {/* 选项卡 */}
      <div className="bg-white rounded-lg shadow-md mb-6">
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('revenue')}
            className={`px-6 py-3 font-medium ${
              activeTab === 'revenue'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            收入分析
          </button>
          <button
            onClick={() => setActiveTab('customer')}
            className={`px-6 py-3 font-medium ${
              activeTab === 'customer'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            客户分析
          </button>
          <button
            onClick={() => setActiveTab('service')}
            className={`px-6 py-3 font-medium ${
              activeTab === 'service'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            服务分析
          </button>
          <button
            onClick={() => setActiveTab('summary')}
            className={`px-6 py-3 font-medium ${
              activeTab === 'summary'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            月度汇总
          </button>
        </div>
      </div>

      {/* 收入分析 */}
      {activeTab === 'revenue' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800">每日收入趋势</h2>
              <button
                onClick={() => exportToCSV(revenueData, '收入数据')}
                className="text-blue-600 hover:text-blue-800 flex items-center text-sm"
              >
                <Download className="w-4 h-4 mr-1" />
                导出
              </button>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="total" stroke="#3B82F6" name="收入金额" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">支付方式分布</h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={paymentMethodData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({payment_method, total}) => `${payment_method}: ¥${total}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="total"
                  >
                    {paymentMethodData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">TOP消费客户</h2>
              {topCustomersData.length === 0 ? (
                <EmptyState
                  icon={UserCheck}
                  title="暂无客户消费数据"
                  description="当前时间段内没有客户消费记录"
                />
              ) : (
                <div className="space-y-2 max-h-[300px] overflow-y-auto">
                  {topCustomersData.slice(0, 10).map((customer, index) => (
                    <div key={customer.id} className="flex justify-between items-center p-2 hover:bg-gray-50 rounded">
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-gray-600 mr-3">#{index + 1}</span>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{customer.name}</p>
                          <p className="text-xs text-gray-500">{customer.phone}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-gray-900">¥{customer.total_amount?.toFixed(2) || '0.00'}</p>
                        <p className="text-xs text-gray-500">{customer.consumption_count || 0}次</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 客户分析 */}
      {activeTab === 'customer' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">性别分布</h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={customerStatsData.gender}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({gender, count}) => `${gender === 'male' ? '男' : '女'}: ${count}人`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {customerStatsData.gender.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.gender === 'male' ? '#3B82F6' : '#EC4899'} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">年龄分布</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={customerStatsData.age}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="age_group" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#10B981" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">减重进度榜</h2>
            {weightProgressData.length === 0 ? (
              <EmptyState
                icon={Scale}
                title="暂无减重进度数据"
                description="还没有客户的体重跟踪记录"
              />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">客户</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">初始体重</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">当前体重</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">目标体重</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">已减重</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">进度</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {weightProgressData.map((customer) => {
                      const currentWeight = customer.current_weight || customer.initial_weight;
                      const weightLoss = customer.initial_weight - currentWeight;
                      const targetLoss = customer.initial_weight - customer.target_weight;
                      const progress = targetLoss > 0 ? (weightLoss / targetLoss) * 100 : 0;
                      
                      return (
                        <tr key={customer.id} className="hover:bg-gray-50">
                          <td className="px-4 py-2 text-sm text-gray-900">{customer.name}</td>
                          <td className="px-4 py-2 text-sm text-gray-500">{customer.initial_weight} kg</td>
                          <td className="px-4 py-2 text-sm text-gray-900 font-medium">{currentWeight} kg</td>
                          <td className="px-4 py-2 text-sm text-gray-500">{customer.target_weight} kg</td>
                          <td className="px-4 py-2 text-sm">
                            <span className={weightLoss > 0 ? 'text-green-600' : 'text-gray-500'}>
                              {weightLoss > 0 ? `-${weightLoss.toFixed(1)}` : '0'} kg
                            </span>
                          </td>
                          <td className="px-4 py-2">
                            <div className="flex items-center">
                              <div className="w-24 bg-gray-200 rounded-full h-2 mr-2">
                                <div
                                  className="bg-gradient-to-r from-blue-400 to-green-500 h-2 rounded-full"
                                  style={{ width: `${Math.min(progress, 100)}%` }}
                                />
                              </div>
                              <span className="text-xs text-gray-600">{progress.toFixed(0)}%</span>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 服务分析 */}
      {activeTab === 'service' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">服务类型收入分布</h2>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={serviceTypeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="service_type" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="total" fill="#3B82F6" name="收入金额" />
                <Bar dataKey="count" fill="#10B981" name="服务次数" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">服务类型明细</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">服务类型</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">服务次数</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">总收入</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">平均单价</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">占比</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {serviceTypeData.map((service) => {
                    const percentage = totalRevenue > 0 ? (service.total / totalRevenue) * 100 : 0;
                    return (
                      <tr key={service.service_type} className="hover:bg-gray-50">
                        <td className="px-4 py-2 text-sm font-medium text-gray-900">{service.service_type}</td>
                        <td className="px-4 py-2 text-sm text-gray-500">{service.count}</td>
                        <td className="px-4 py-2 text-sm font-medium text-gray-900">¥{service.total.toFixed(2)}</td>
                        <td className="px-4 py-2 text-sm text-gray-500">
                          ¥{(service.total / service.count).toFixed(2)}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-500">{percentage.toFixed(1)}%</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 月度汇总 */}
      {activeTab === 'summary' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">月度收入趋势</h2>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={monthlySummaryData.slice().reverse()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="total_revenue" stroke="#3B82F6" name="月收入" />
                <Line type="monotone" dataKey="transaction_count" stroke="#10B981" name="交易笔数" />
                <Line type="monotone" dataKey="active_customers" stroke="#F59E0B" name="活跃客户" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800">月度数据明细</h2>
              <button
                onClick={() => exportToCSV(monthlySummaryData, '月度汇总')}
                className="text-blue-600 hover:text-blue-800 flex items-center text-sm"
              >
                <Download className="w-4 h-4 mr-1" />
                导出
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">月份</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">交易笔数</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">月收入</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">活跃客户</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">客单价</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {monthlySummaryData.map((month) => (
                    <tr key={month.month} className="hover:bg-gray-50">
                      <td className="px-4 py-2 text-sm font-medium text-gray-900">{month.month}</td>
                      <td className="px-4 py-2 text-sm text-gray-500">{month.transaction_count}</td>
                      <td className="px-4 py-2 text-sm font-medium text-gray-900">
                        ¥{month.total_revenue?.toFixed(2) || '0.00'}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-500">{month.active_customers}</td>
                      <td className="px-4 py-2 text-sm text-gray-500">
                        ¥{month.transaction_count > 0 
                          ? (month.total_revenue / month.transaction_count).toFixed(2) 
                          : '0.00'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}