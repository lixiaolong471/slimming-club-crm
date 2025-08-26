import { NextRequest, NextResponse } from 'next/server';
import { authAPI } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: '未登录' },
        { status: 401 }
      );
    }

    const user = authAPI.verifyToken(token);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Token无效' },
        { status: 401 }
      );
    }

    return NextResponse.json({ user });
  } catch (error) {
    return NextResponse.json(
      { error: '获取用户信息失败' },
      { status: 500 }
    );
  }
}