'use client';

import { useState, useEffect } from 'react';
import { Plus, CreditCard } from 'lucide-react';
import { ConsumptionRecord, Customer, ServiceType } from '@/lib/types';
import { format } from 'date-fns';
import EmptyState from '@/components/EmptyState';

export default function ConsumptionPage() {
  const [records, setRecords] = useState<ConsumptionRecord[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [serviceTypes, setServiceTypes] = useState<ServiceType[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    customer_id: '',
    service_type: '',
    amount: '',
    payment_method: '现金',
    description: '',
  });

  useEffect(() => {
    fetchRecords();
    fetchCustomers();
    fetchServiceTypes();
  }, []);

  const fetchRecords = async () => {
    try {
      const response = await fetch('/api/consumption');
      const data = await response.json();
      setRecords(data);
    } catch (error) {
      console.error('Failed to fetch consumption records:', error);
    }
  };

  const fetchCustomers = async () => {
    try {
      const response = await fetch('/api/customers');
      const data = await response.json();
      setCustomers(data);
    } catch (error) {
      console.error('Failed to fetch customers:', error);
    }
  };

  const fetchServiceTypes = async () => {
    try {
      const response = await fetch('/api/service-types?activeOnly=true');
      const data = await response.json();
      setServiceTypes(data);
    } catch (error) {
      console.error('Failed to fetch service types:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const recordData = {
      customer_id: parseInt(formData.customer_id),
      service_type: formData.service_type,
      amount: parseFloat(formData.amount),
      payment_method: formData.payment_method,
      description: formData.description,
    };

    try {
      await fetch('/api/consumption', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(recordData),
      });
      
      fetchRecords();
      setShowModal(false);
      resetForm();
    } catch (error) {
      console.error('Failed to save consumption record:', error);
    }
  };

  const handleServiceTypeChange = (serviceName: string) => {
    const selectedService = serviceTypes.find(s => s.name === serviceName);
    setFormData({
      ...formData,
      service_type: serviceName,
      amount: selectedService?.price ? selectedService.price.toString() : formData.amount
    });
  };

  const resetForm = () => {
    setFormData({
      customer_id: '',
      service_type: '',
      amount: '',
      payment_method: '现金',
      description: '',
    });
  };

  const paymentMethods = ['现金', '微信', '支付宝', '银行卡', '会员卡'];

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">消费记录</h1>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center"
        >
          <Plus className="w-5 h-5 mr-2" />
          添加消费记录
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {records.length === 0 ? (
          <EmptyState
            icon={CreditCard}
            title="暂无消费记录"
            description="还没有任何消费记录，点击添加消费记录开始记录"
            action={{
              label: "添加首条记录",
              onClick: () => {
                resetForm();
                setShowModal(true);
              }
            }}
          />
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">客户姓名</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">服务类型</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">金额</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">支付方式</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">描述</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">消费时间</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {records.map((record: ConsumptionRecord) => (
              <tr key={record.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {record.customer_name || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.service_type}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                  ¥{record.amount.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.payment_method || '-'}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{record.description || '-'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {format(new Date(record.created_at), 'yyyy-MM-dd HH:mm')}
                </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">添加消费记录</h2>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">客户 *</label>
                  <select
                    required
                    value={formData.customer_id}
                    onChange={(e) => setFormData({ ...formData, customer_id: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">请选择客户</option>
                    {customers.map((customer) => (
                      <option key={customer.id} value={customer.id}>
                        {customer.name} - {customer.phone}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">服务类型 *</label>
                  <select
                    required
                    value={formData.service_type}
                    onChange={(e) => handleServiceTypeChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">请选择服务类型</option>
                    {serviceTypes.map((service) => (
                      <option key={service.id} value={service.name}>
                        {service.name} {service.price ? `(¥${service.price})` : ''}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">金额 *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">支付方式</label>
                  <select
                    value={formData.payment_method}
                    onChange={(e) => setFormData({ ...formData, payment_method: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {paymentMethods.map((method) => (
                      <option key={method} value={method}>
                        {method}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">备注</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
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