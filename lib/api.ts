import db from './db';
import { Customer, ConsumptionRecord, WeightRecord, Appointment } from './types';

// 客户相关API
export const customerAPI = {
  getAll: (): Customer[] => {
    const stmt = db.prepare('SELECT * FROM customers ORDER BY created_at DESC');
    return stmt.all() as Customer[];
  },

  getById: (id: number): Customer | undefined => {
    const stmt = db.prepare('SELECT * FROM customers WHERE id = ?');
    return stmt.get(id) as Customer | undefined;
  },

  create: (customer: Omit<Customer, 'id' | 'created_at' | 'updated_at'>): Customer => {
    const stmt = db.prepare(`
      INSERT INTO customers (name, phone, gender, age, height, initial_weight, target_weight, address, notes)
      VALUES (@name, @phone, @gender, @age, @height, @initial_weight, @target_weight, @address, @notes)
    `);
    const result = stmt.run(customer);
    return customerAPI.getById(Number(result.lastInsertRowid))!;
  },

  update: (id: number, customer: Partial<Omit<Customer, 'id' | 'created_at' | 'updated_at'>>): Customer | undefined => {
    const fields = Object.keys(customer).map(key => `${key} = @${key}`).join(', ');
    const stmt = db.prepare(`
      UPDATE customers 
      SET ${fields}, updated_at = CURRENT_TIMESTAMP
      WHERE id = @id
    `);
    stmt.run({ ...customer, id });
    return customerAPI.getById(id);
  },

  delete: (id: number): boolean => {
    const stmt = db.prepare('DELETE FROM customers WHERE id = ?');
    const result = stmt.run(id);
    return result.changes > 0;
  },

  search: (query: string): Customer[] => {
    const stmt = db.prepare(`
      SELECT * FROM customers 
      WHERE name LIKE @query OR phone LIKE @query
      ORDER BY created_at DESC
    `);
    return stmt.all({ query: `%${query}%` }) as Customer[];
  }
};

// 消费记录相关API
export const consumptionAPI = {
  getAll: (): ConsumptionRecord[] => {
    const stmt = db.prepare(`
      SELECT cr.*, c.name as customer_name, c.phone as customer_phone
      FROM consumption_records cr
      LEFT JOIN customers c ON cr.customer_id = c.id
      ORDER BY cr.created_at DESC
    `);
    return stmt.all() as ConsumptionRecord[];
  },

  getByCustomerId: (customerId: number): ConsumptionRecord[] => {
    const stmt = db.prepare(`
      SELECT * FROM consumption_records 
      WHERE customer_id = ?
      ORDER BY created_at DESC
    `);
    return stmt.all(customerId) as ConsumptionRecord[];
  },

  create: (record: Omit<ConsumptionRecord, 'id' | 'created_at'>): ConsumptionRecord => {
    const stmt = db.prepare(`
      INSERT INTO consumption_records (customer_id, service_type, amount, payment_method, description)
      VALUES (@customer_id, @service_type, @amount, @payment_method, @description)
    `);
    const result = stmt.run(record);
    const getStmt = db.prepare('SELECT * FROM consumption_records WHERE id = ?');
    return getStmt.get(result.lastInsertRowid) as ConsumptionRecord;
  },

  delete: (id: number): boolean => {
    const stmt = db.prepare('DELETE FROM consumption_records WHERE id = ?');
    const result = stmt.run(id);
    return result.changes > 0;
  },

  getMonthlyRevenue: (): number => {
    const stmt = db.prepare(`
      SELECT SUM(amount) as total
      FROM consumption_records
      WHERE datetime(created_at) >= datetime('now', 'start of month')
    `);
    const result = stmt.get() as { total: number | null };
    return result.total || 0;
  }
};

// 体重记录相关API
export const weightAPI = {
  getByCustomerId: (customerId: number): WeightRecord[] => {
    const stmt = db.prepare(`
      SELECT * FROM weight_records 
      WHERE customer_id = ?
      ORDER BY recorded_at DESC
    `);
    return stmt.all(customerId) as WeightRecord[];
  },

  create: (record: Omit<WeightRecord, 'id' | 'recorded_at'>): WeightRecord => {
    const stmt = db.prepare(`
      INSERT INTO weight_records (customer_id, weight, body_fat_percentage, muscle_mass, notes)
      VALUES (@customer_id, @weight, @body_fat_percentage, @muscle_mass, @notes)
    `);
    const result = stmt.run(record);
    const getStmt = db.prepare('SELECT * FROM weight_records WHERE id = ?');
    return getStmt.get(result.lastInsertRowid) as WeightRecord;
  },

  delete: (id: number): boolean => {
    const stmt = db.prepare('DELETE FROM weight_records WHERE id = ?');
    const result = stmt.run(id);
    return result.changes > 0;
  }
};

// 预约相关API
export const appointmentAPI = {
  getAll: (): Appointment[] => {
    const stmt = db.prepare(`
      SELECT a.*, c.name as customer_name, c.phone as customer_phone
      FROM appointments a
      LEFT JOIN customers c ON a.customer_id = c.id
      ORDER BY a.appointment_date DESC
    `);
    return stmt.all() as Appointment[];
  },

  getTodayAppointments: (): Appointment[] => {
    const stmt = db.prepare(`
      SELECT a.*, c.name as customer_name, c.phone as customer_phone
      FROM appointments a
      LEFT JOIN customers c ON a.customer_id = c.id
      WHERE date(a.appointment_date) = date('now')
      ORDER BY a.appointment_date ASC
    `);
    return stmt.all() as Appointment[];
  },

  create: (appointment: Omit<Appointment, 'id' | 'created_at'>): Appointment => {
    const stmt = db.prepare(`
      INSERT INTO appointments (customer_id, appointment_date, service_type, status, notes)
      VALUES (@customer_id, @appointment_date, @service_type, @status, @notes)
    `);
    const result = stmt.run(appointment);
    const getStmt = db.prepare('SELECT * FROM appointments WHERE id = ?');
    return getStmt.get(result.lastInsertRowid) as Appointment;
  },

  updateStatus: (id: number, status: Appointment['status']): boolean => {
    const stmt = db.prepare('UPDATE appointments SET status = ? WHERE id = ?');
    const result = stmt.run(status, id);
    return result.changes > 0;
  },

  delete: (id: number): boolean => {
    const stmt = db.prepare('DELETE FROM appointments WHERE id = ?');
    const result = stmt.run(id);
    return result.changes > 0;
  }
};

// 服务类型相关API
export const serviceTypeAPI = {
  getAll: (activeOnly = false) => {
    const where = activeOnly ? "WHERE status = 'active'" : '';
    const stmt = db.prepare(`SELECT * FROM service_types ${where} ORDER BY name ASC`);
    return stmt.all();
  },

  getById: (id: number) => {
    const stmt = db.prepare('SELECT * FROM service_types WHERE id = ?');
    return stmt.get(id);
  },

  create: (serviceType: { name: string; description?: string; price?: number; duration?: number }) => {
    const stmt = db.prepare(`
      INSERT INTO service_types (name, description, price, duration)
      VALUES (@name, @description, @price, @duration)
    `);
    const result = stmt.run(serviceType);
    return serviceTypeAPI.getById(Number(result.lastInsertRowid));
  },

  update: (id: number, serviceType: { name?: string; description?: string; price?: number; duration?: number; status?: string }) => {
    const fields = Object.keys(serviceType).map(key => `${key} = @${key}`).join(', ');
    const stmt = db.prepare(`
      UPDATE service_types 
      SET ${fields}, updated_at = CURRENT_TIMESTAMP
      WHERE id = @id
    `);
    stmt.run({ ...serviceType, id });
    return serviceTypeAPI.getById(id);
  },

  delete: (id: number): boolean => {
    const stmt = db.prepare('DELETE FROM service_types WHERE id = ?');
    const result = stmt.run(id);
    return result.changes > 0;
  },

  toggleStatus: (id: number): boolean => {
    const stmt = db.prepare(`
      UPDATE service_types 
      SET status = CASE WHEN status = 'active' THEN 'inactive' ELSE 'active' END,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);
    const result = stmt.run(id);
    return result.changes > 0;
  }
};

// 统计相关API
export const statsAPI = {
  getDashboardStats: () => {
    const totalCustomers = db.prepare('SELECT COUNT(*) as count FROM customers').get() as { count: number };
    const monthlyRevenue = consumptionAPI.getMonthlyRevenue();
    const todayAppointments = appointmentAPI.getTodayAppointments().length;
    const activeCustomers = db.prepare(`
      SELECT COUNT(DISTINCT customer_id) as count
      FROM consumption_records
      WHERE datetime(created_at) >= datetime('now', '-30 days')
    `).get() as { count: number };

    return {
      totalCustomers: totalCustomers.count,
      monthlyRevenue,
      todayAppointments,
      activeCustomers: activeCustomers.count
    };
  }
};