'use client';

import { useState, useEffect } from 'react';
import { Plus, Calendar, Clock, CheckCircle, XCircle, CalendarDays } from 'lucide-react';
import { Appointment, Customer } from '@/lib/types';
import { format } from 'date-fns';
import EmptyState from '@/components/EmptyState';

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [formData, setFormData] = useState({
    customer_id: '',
    appointment_date: '',
    appointment_time: '',
    service_type: '',
    notes: '',
  });

  useEffect(() => {
    fetchAppointments();
    fetchCustomers();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await fetch('/api/appointments');
      const data = await response.json();
      setAppointments(data);
    } catch (error) {
      console.error('Failed to fetch appointments:', error);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const appointmentData = {
      customer_id: parseInt(formData.customer_id),
      appointment_date: `${formData.appointment_date}T${formData.appointment_time}:00`,
      service_type: formData.service_type,
      status: 'pending' as const,
      notes: formData.notes,
    };

    try {
      await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(appointmentData),
      });
      
      fetchAppointments();
      setShowModal(false);
      resetForm();
    } catch (error) {
      console.error('Failed to save appointment:', error);
    }
  };

  const handleStatusUpdate = async (id: number, status: 'completed' | 'cancelled') => {
    try {
      await fetch(`/api/appointments/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      fetchAppointments();
    } catch (error) {
      console.error('Failed to update appointment status:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('确定要删除这个预约吗？')) {
      try {
        await fetch(`/api/appointments/${id}`, { method: 'DELETE' });
        fetchAppointments();
      } catch (error) {
        console.error('Failed to delete appointment:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      customer_id: '',
      appointment_date: '',
      appointment_time: '',
      service_type: '',
      notes: '',
    });
  };

  const serviceTypes = [
    '减脂课程',
    '营养咨询',
    '体测服务',
    '私教课程',
    '团课课程',
    '身体护理',
    '其他服务',
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return '待完成';
      case 'completed':
        return '已完成';
      case 'cancelled':
        return '已取消';
      default:
        return status;
    }
  };

  const filteredAppointments = appointments.filter((apt: Appointment) => {
    if (filterStatus === 'all') return true;
    return apt.status === filterStatus;
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">预约管理</h1>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center"
        >
          <Plus className="w-5 h-5 mr-2" />
          新建预约
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex gap-4">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-4 py-2 rounded-lg ${
              filterStatus === 'all' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            全部
          </button>
          <button
            onClick={() => setFilterStatus('pending')}
            className={`px-4 py-2 rounded-lg ${
              filterStatus === 'pending' 
                ? 'bg-yellow-500 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            待完成
          </button>
          <button
            onClick={() => setFilterStatus('completed')}
            className={`px-4 py-2 rounded-lg ${
              filterStatus === 'completed' 
                ? 'bg-green-500 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            已完成
          </button>
          <button
            onClick={() => setFilterStatus('cancelled')}
            className={`px-4 py-2 rounded-lg ${
              filterStatus === 'cancelled' 
                ? 'bg-red-500 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            已取消
          </button>
        </div>
      </div>

      {filteredAppointments.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md">
          <EmptyState
            icon={CalendarDays}
            title="暂无预约记录"
            description={filterStatus === 'all' ? "还没有任何预约安排，点击新建预约添加" : `没有${getStatusText(filterStatus)}的预约`}
            action={filterStatus === 'all' ? {
              label: "新建首个预约",
              onClick: () => {
                resetForm();
                setShowModal(true);
              }
            } : undefined}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAppointments.map((appointment: Appointment) => (
          <div key={appointment.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  {appointment.customer_name || '未知客户'}
                </h3>
                <p className="text-sm text-gray-600">{appointment.customer_phone || ''}</p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(appointment.status)}`}>
                {getStatusText(appointment.status)}
              </span>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex items-center text-gray-600">
                <Calendar className="w-4 h-4 mr-2" />
                {format(new Date(appointment.appointment_date), 'yyyy-MM-dd')}
              </div>
              <div className="flex items-center text-gray-600">
                <Clock className="w-4 h-4 mr-2" />
                {format(new Date(appointment.appointment_date), 'HH:mm')}
              </div>
              <div className="text-gray-700 font-medium">
                {appointment.service_type}
              </div>
              {appointment.notes && (
                <div className="text-gray-600 italic">
                  备注：{appointment.notes}
                </div>
              )}
            </div>

            {appointment.status === 'pending' && (
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => handleStatusUpdate(appointment.id, 'completed')}
                  className="flex-1 bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 text-sm flex items-center justify-center"
                >
                  <CheckCircle className="w-4 h-4 mr-1" />
                  完成
                </button>
                <button
                  onClick={() => handleStatusUpdate(appointment.id, 'cancelled')}
                  className="flex-1 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm flex items-center justify-center"
                >
                  <XCircle className="w-4 h-4 mr-1" />
                  取消
                </button>
              </div>
            )}
            
            {appointment.status !== 'pending' && (
              <div className="mt-4">
                <button
                  onClick={() => handleDelete(appointment.id)}
                  className="w-full bg-gray-100 text-gray-700 px-3 py-1 rounded hover:bg-gray-200 text-sm"
                >
                  删除记录
                </button>
              </div>
            )}
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">新建预约</h2>
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">预约日期 *</label>
                  <input
                    type="date"
                    required
                    value={formData.appointment_date}
                    onChange={(e) => setFormData({ ...formData, appointment_date: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">预约时间 *</label>
                  <input
                    type="time"
                    required
                    value={formData.appointment_time}
                    onChange={(e) => setFormData({ ...formData, appointment_time: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">服务类型 *</label>
                  <select
                    required
                    value={formData.service_type}
                    onChange={(e) => setFormData({ ...formData, service_type: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">请选择服务类型</option>
                    {serviceTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">备注</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
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
                  创建预约
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}