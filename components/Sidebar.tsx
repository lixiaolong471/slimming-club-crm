'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Users, FileText, Calendar, BarChart3, Home, LogOut, UserCircle, Settings, Package } from 'lucide-react';
import { useAuth } from './AuthProvider';

const menuItems = [
  { href: '/dashboard', label: '仪表盘', icon: Home },
  { href: '/customers', label: '客户管理', icon: Users },
  { href: '/consumption', label: '消费记录', icon: FileText },
  { href: '/appointments', label: '预约管理', icon: Calendar },
  { href: '/service-types', label: '服务类型', icon: Package },
  { href: '/reports', label: '统计报表', icon: BarChart3 },
  { href: '/settings', label: '系统设置', icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen flex flex-col">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-800">减肥馆管理系统</h1>
      </div>
      
      <nav className="flex-1 mt-6">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100 transition-colors ${
                isActive ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600' : ''
              }`}
            >
              <Icon className="w-5 h-5 mr-3" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-gray-200 p-4">
        {user && (
          <>
            <div className="flex items-center mb-3 px-2">
              <UserCircle className="w-8 h-8 text-gray-400 mr-3" />
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-900">{user.name}</div>
                <div className="text-xs text-gray-500">
                  {user.role === 'admin' ? '管理员' : '员工'}
                </div>
              </div>
            </div>
            <button
              onClick={logout}
              className="w-full flex items-center px-2 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4 mr-2" />
              <span>退出登录</span>
            </button>
          </>
        )}
      </div>
    </aside>
  );
}