export interface Customer {
  id: number;
  name: string;
  phone: string;
  gender?: 'male' | 'female';
  age?: number;
  height?: number;
  initial_weight?: number;
  target_weight?: number;
  address?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface ConsumptionRecord {
  id: number;
  customer_id: number;
  service_type: string;
  amount: number;
  payment_method?: string;
  description?: string;
  created_at: string;
  customer?: Customer;
}

export interface WeightRecord {
  id: number;
  customer_id: number;
  weight: number;
  body_fat_percentage?: number;
  muscle_mass?: number;
  notes?: string;
  recorded_at: string;
  customer?: Customer;
}

export interface Appointment {
  id: number;
  customer_id: number;
  appointment_date: string;
  service_type: string;
  status: 'pending' | 'completed' | 'cancelled';
  notes?: string;
  created_at: string;
  customer?: Customer;
}

export interface DashboardStats {
  totalCustomers: number;
  monthlyRevenue: number;
  todayAppointments: number;
  activeCustomers: number;
}