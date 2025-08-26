import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from './db';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export interface User {
  id: number;
  username: string;
  password: string;
  name: string;
  role: 'admin' | 'staff';
  created_at: string;
  updated_at: string;
}

export interface UserPayload {
  id: number;
  username: string;
  name: string;
  role: string;
}

export const authAPI = {
  // 创建用户
  createUser: async (username: string, password: string, name: string, role: 'admin' | 'staff' = 'staff'): Promise<User> => {
    const hashedPassword = await bcrypt.hash(password, 10);
    const stmt = db.prepare(`
      INSERT INTO users (username, password, name, role)
      VALUES (?, ?, ?, ?)
    `);
    const result = stmt.run(username, hashedPassword, name, role);
    const getStmt = db.prepare('SELECT * FROM users WHERE id = ?');
    return getStmt.get(result.lastInsertRowid) as User;
  },

  // 验证用户
  validateUser: async (username: string, password: string): Promise<User | null> => {
    const stmt = db.prepare('SELECT * FROM users WHERE username = ?');
    const user = stmt.get(username) as User | undefined;
    
    if (!user) {
      return null;
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return null;
    }

    return user;
  },

  // 生成JWT token
  generateToken: (user: User): string => {
    const payload: UserPayload = {
      id: user.id,
      username: user.username,
      name: user.name,
      role: user.role,
    };
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
  },

  // 验证JWT token
  verifyToken: (token: string): UserPayload | null => {
    try {
      return jwt.verify(token, JWT_SECRET) as UserPayload;
    } catch {
      return null;
    }
  },

  // 获取所有用户
  getAllUsers: (): User[] => {
    const stmt = db.prepare('SELECT id, username, name, role, created_at, updated_at FROM users ORDER BY created_at DESC');
    return stmt.all() as User[];
  },

  // 检查是否有管理员用户
  hasAdminUser: (): boolean => {
    const stmt = db.prepare("SELECT COUNT(*) as count FROM users WHERE role = 'admin'");
    const result = stmt.get() as { count: number };
    return result.count > 0;
  },

  // 初始化默认管理员账户
  initDefaultAdmin: async () => {
    if (!authAPI.hasAdminUser()) {
      await authAPI.createUser('admin', 'admin123', '系统管理员', 'admin');
      console.log('默认管理员账户已创建: admin / admin123');
    }
  }
};