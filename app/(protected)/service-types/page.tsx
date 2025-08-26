'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, ToggleLeft, ToggleRight, DollarSign, Clock } from 'lucide-react';

interface ServiceType {
  id: number;
  name: string;
  description?: string;
  price?: number;
  duration?: number;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

export default function ServiceTypesPage() {
  const [serviceTypes, setServiceTypes] = useState<ServiceType[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState<ServiceType | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    duration: '',
  });

  useEffect(() => {
    fetchServiceTypes();
  }, []);

  const fetchServiceTypes = async () => {
    try {
      const response = await fetch('/api/service-types');
      const data = await response.json();
      setServiceTypes(data);
    } catch (error) {
      console.error('Failed to fetch service types:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const serviceData = {
      name: formData.name,
      description: formData.description || undefined,
      price: formData.price ? parseFloat(formData.price) : undefined,
      duration: formData.duration ? parseInt(formData.duration) : undefined,
    };

    try {
      if (editingService) {
        await fetch(`/api/service-types/${editingService.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(serviceData),
        });
      } else {
        await fetch('/api/service-types', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(serviceData),
        });
      }
      
      fetchServiceTypes();
      setShowModal(false);
      resetForm();
    } catch (error) {
      console.error('Failed to save service type:', error);
    }
  };

  const handleToggleStatus = async (id: number) => {
    try {
      await fetch(`/api/service-types/${id}`, { method: 'PATCH' });
      fetchServiceTypes();
    } catch (error) {
      console.error('Failed to toggle status:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('确定要删除这个服务类型吗？删除后相关的消费记录将保留但不会显示服务类型名称。')) {
      try {
        await fetch(`/api/service-types/${id}`, { method: 'DELETE' });
        fetchServiceTypes();
      } catch (error) {
        console.error('Failed to delete service type:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      duration: '',
    });
    setEditingService(null);
  };

  const openEditModal = (service: ServiceType) => {
    setEditingService(service);
    setFormData({
      name: service.name,
      description: service.description || '',
      price: service.price?.toString() || '',
      duration: service.duration?.toString() || '',
    });
    setShowModal(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">服务类型管理</h1>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center"
        >
          <Plus className="w-5 h-5 mr-2" />
          添加服务类型
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {serviceTypes.map((service) => (
          <div
            key={service.id}
            className={`bg-white rounded-lg shadow-md p-6 ${
              service.status === 'inactive' ? 'opacity-60' : ''
            }`}
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold text-gray-800">{service.name}</h3>
              <button
                onClick={() => handleToggleStatus(service.id)}
                className={`${
                  service.status === 'active' ? 'text-green-500' : 'text-gray-400'
                } hover:opacity-80`}
                title={service.status === 'active' ? '点击停用' : '点击启用'}
              >
                {service.status === 'active' ? (
                  <ToggleRight className="w-6 h-6" />
                ) : (
                  <ToggleLeft className="w-6 h-6" />
                )}
              </button>
            </div>
            
            {service.description && (
              <p className="text-sm text-gray-600 mb-3">{service.description}</p>
            )}
            
            <div className="space-y-2 mb-4">
              {service.price !== undefined && service.price !== null && (
                <div className="flex items-center text-sm">
                  <DollarSign className="w-4 h-4 text-gray-400 mr-2" />
                  <span className="text-gray-700">参考价格：¥{service.price}</span>
                </div>
              )}
              {service.duration && (
                <div className="flex items-center text-sm">
                  <Clock className="w-4 h-4 text-gray-400 mr-2" />
                  <span className="text-gray-700">服务时长：{service.duration}分钟</span>
                </div>
              )}
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-gray-100">
              <span className={`text-xs px-2 py-1 rounded-full ${
                service.status === 'active' 
                  ? 'bg-green-100 text-green-600' 
                  : 'bg-gray-100 text-gray-600'
              }`}>
                {service.status === 'active' ? '启用' : '停用'}
              </span>
              
              <div className="flex gap-2">
                <button
                  onClick={() => openEditModal(service)}
                  className="text-blue-600 hover:text-blue-900"
                  title="编辑"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(service.id)}
                  className="text-red-600 hover:text-red-900"
                  title="删除"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 添加/编辑弹窗 */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">
              {editingService ? '编辑服务类型' : '添加服务类型'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    服务名称 *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="例如：减脂课程"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    服务描述
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="服务的详细描述"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    参考价格（元）
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0.00"
                  />
                  <p className="text-xs text-gray-500 mt-1">留空表示价格面议</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    服务时长（分钟）
                  </label>
                  <input
                    type="number"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="60"
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
                  {editingService ? '保存修改' : '添加'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}