import { NextRequest, NextResponse } from 'next/server';
import { authAPI } from '@/lib/auth';
import bcrypt from 'bcryptjs';
import db from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value;
    
    if (!token) {
      return NextResponse.json({ error: '未登录' }, { status: 401 });
    }

    const user = authAPI.verifyToken(token);
    if (!user) {
      return NextResponse.json({ error: '无效的登录状态' }, { status: 401 });
    }

    const { oldPassword, newPassword } = await request.json();

    if (!oldPassword || !newPassword) {
      return NextResponse.json({ error: '请输入旧密码和新密码' }, { status: 400 });
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ error: '新密码至少需要6位' }, { status: 400 });
    }

    // 验证旧密码
    const stmt = db.prepare('SELECT password FROM users WHERE id = ?');
    const dbUser = stmt.get(user.id) as { password: string };
    
    const isValidPassword = await bcrypt.compare(oldPassword, dbUser.password);
    if (!isValidPassword) {
      return NextResponse.json({ error: '旧密码不正确' }, { status: 400 });
    }

    // 更新密码
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const updateStmt = db.prepare('UPDATE users SET password = ? WHERE id = ?');
    updateStmt.run(hashedPassword, user.id);

    return NextResponse.json({ message: '密码修改成功' });
  } catch (error) {
    console.error('Change password error:', error);
    return NextResponse.json({ error: '密码修改失败' }, { status: 500 });
  }
}