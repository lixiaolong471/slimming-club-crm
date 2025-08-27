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
  customer_name?: string;
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
  customer_name?: string;
  customer_phone?: string;
}

export interface ServiceType {
  id: number;
  name: string;
  description?: string;
  price?: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface DashboardStats {
  totalCustomers: number;
  monthlyRevenue: number;
  todayAppointments: number;
  activeCustomers: number;
}

// Report types
export interface RevenueData {
  date: string;
  total: number;
  count: number;
}

export interface ServiceTypeData {
  service_type: string;
  count: number;
  total: number;
}

export interface PaymentMethodData {
  payment_method: string;
  count: number;
  total: number;
}

export interface GenderStats {
  gender: 'male' | 'female';
  count: number;
}

export interface AgeStats {
  age_group: string;
  count: number;
}

export interface CustomerStats {
  gender: GenderStats[];
  age: AgeStats[];
}

export interface TopCustomer {
  id: number;
  name: string;
  phone: string;
  consumption_count: number;
  total_amount: number;
}

export interface WeightProgress {
  id: number;
  name: string;
  initial_weight: number;
  target_weight: number;
  current_weight: number;
}

export interface MonthlySummary {
  month: string;
  transaction_count: number;
  total_revenue: number;
  active_customers: number;
}