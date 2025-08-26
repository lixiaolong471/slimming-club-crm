import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'slimming-club.db');
const db = new Database(dbPath);

// 初始化数据库表
db.exec(`
  CREATE TABLE IF NOT EXISTS customers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    phone TEXT NOT NULL UNIQUE,
    gender TEXT CHECK(gender IN ('male', 'female')),
    age INTEGER,
    height INTEGER,
    initial_weight REAL,
    target_weight REAL,
    address TEXT,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS consumption_records (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_id INTEGER NOT NULL,
    service_type TEXT NOT NULL,
    amount REAL NOT NULL,
    payment_method TEXT,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS weight_records (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_id INTEGER NOT NULL,
    weight REAL NOT NULL,
    body_fat_percentage REAL,
    muscle_mass REAL,
    notes TEXT,
    recorded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS appointments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_id INTEGER NOT NULL,
    appointment_date DATETIME NOT NULL,
    service_type TEXT NOT NULL,
    status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'completed', 'cancelled')),
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
  );

  CREATE INDEX IF NOT EXISTS idx_customer_phone ON customers(phone);
  CREATE INDEX IF NOT EXISTS idx_consumption_customer ON consumption_records(customer_id);
  CREATE INDEX IF NOT EXISTS idx_weight_customer ON weight_records(customer_id);
  CREATE INDEX IF NOT EXISTS idx_appointment_customer ON appointments(customer_id);
  CREATE INDEX IF NOT EXISTS idx_appointment_date ON appointments(appointment_date);

  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    name TEXT NOT NULL,
    role TEXT DEFAULT 'staff' CHECK(role IN ('admin', 'staff')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE INDEX IF NOT EXISTS idx_user_username ON users(username);

  CREATE TABLE IF NOT EXISTS service_types (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    price REAL,
    duration INTEGER,
    status TEXT DEFAULT 'active' CHECK(status IN ('active', 'inactive')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  -- 插入默认服务类型
  INSERT OR IGNORE INTO service_types (name, description, price) VALUES 
    ('减脂课程', '专业减脂训练课程', 299),
    ('营养咨询', '个性化营养方案定制', 199),
    ('体测服务', '全面身体成分分析', 99),
    ('私教课程', '一对一私人教练指导', 399),
    ('团课课程', '小班制团体训练', 199),
    ('产品销售', '营养补剂及健康产品', 0),
    ('身体护理', '专业按摩理疗服务', 299),
    ('其他服务', '其他定制化服务', 0);
`);

export default db;