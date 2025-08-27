'use client';

import { useState } from 'react';
import { Lock, User, Shield } from 'lucide-react';
import { useAuth } from '@/components/AuthProvider';

export default function SettingsPage() {
  const { user } = useAuth();
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError('新密码与确认密码不一致');
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setError('新密码至少需要6位');
      return;
    }

    try {
      const response = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          oldPassword: passwordForm.oldPassword,
          newPassword: passwordForm.newPassword
        })
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || '密码修改失败');
        return;
      }

      setMessage('密码修改成功！');
      setPasswordForm({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      setTimeout(() => {
        setShowPasswordModal(false);
        setMessage('');
      }, 2000);
    } catch {
      setError('网络错误，请稍后重试');
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">系统设置</h1>

      {/* 用户信息卡片 */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center mb-4">
          <User className="w-6 h-6 text-gray-400 mr-2" />
          <h2 className="text-xl font-semibold text-gray-800">用户信息</h2>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-600">用户名</label>
            <p className="text-gray-800 font-medium">{user?.username}</p>
          </div>
          <div>
            <label className="text-sm text-gray-600">姓名</label>
            <p className="text-gray-800 font-medium">{user?.name}</p>
          </div>
          <div>
            <label className="text-sm text-gray-600">角色</label>
            <p className="text-gray-800 font-medium">
              {user?.role === 'admin' ? '管理员' : '员工'}
            </p>
          </div>
          <div>
            <label className="text-sm text-gray-600">用户ID</label>
            <p className="text-gray-800 font-medium">#{user?.id}</p>
          </div>
        </div>
      </div>

      {/* 安全设置卡片 */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center mb-4">
          <Shield className="w-6 h-6 text-gray-400 mr-2" />
          <h2 className="text-xl font-semibold text-gray-800">安全设置</h2>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center">
              <Lock className="w-5 h-5 text-gray-400 mr-3" />
              <div>
                <p className="font-medium text-gray-800">登录密码</p>
                <p className="text-sm text-gray-500">定期修改密码以保证账户安全</p>
              </div>
            </div>
            <button
              onClick={() => setShowPasswordModal(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
              修改密码
            </button>
          </div>
        </div>
      </div>

      {/* 系统信息卡片 */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">系统信息</h2>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-600">系统版本</label>
            <p className="text-gray-800">1.0.0</p>
          </div>
          <div>
            <label className="text-sm text-gray-600">数据库类型</label>
            <p className="text-gray-800">SQLite</p>
          </div>
          <div>
            <label className="text-sm text-gray-600">前端框架</label>
            <p className="text-gray-800">Next.js 15</p>
          </div>
          <div>
            <label className="text-sm text-gray-600">UI框架</label>
            <p className="text-gray-800">Tailwind CSS</p>
          </div>
        </div>
      </div>

      {/* 修改密码弹窗 */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">修改密码</h2>
            
            {message && (
              <div className="mb-4 p-3 bg-green-50 text-green-600 rounded-lg">
                {message}
              </div>
            )}
            
            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg">
                {error}
              </div>
            )}
            
            <form onSubmit={handlePasswordChange}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    旧密码
                  </label>
                  <input
                    type="password"
                    required
                    value={passwordForm.oldPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, oldPassword: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    新密码（至少6位）
                  </label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    确认新密码
                  </label>
                  <input
                    type="password"
                    required
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <div className="mt-6 flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowPasswordModal(false);
                    setPasswordForm({
                      oldPassword: '',
                      newPassword: '',
                      confirmPassword: ''
                    });
                    setError('');
                    setMessage('');
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  确认修改
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}