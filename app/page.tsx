'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // 重定向到仪表盘页面
    router.push('/dashboard');
  }, [router]);

  return null;
}