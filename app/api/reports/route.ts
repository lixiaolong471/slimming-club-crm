import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    switch (type) {
      case 'revenue': {
        // 收入统计
        const stmt = db.prepare(`
          SELECT 
            DATE(created_at) as date,
            SUM(amount) as total,
            COUNT(*) as count
          FROM consumption_records
          WHERE DATE(created_at) BETWEEN DATE(?) AND DATE(?)
          GROUP BY DATE(created_at)
          ORDER BY date ASC
        `);
        const data = stmt.all(startDate || '2024-01-01', endDate || '2099-12-31');
        return NextResponse.json(data);
      }

      case 'service-type': {
        // 服务类型统计
        const stmt = db.prepare(`
          SELECT 
            service_type,
            COUNT(*) as count,
            SUM(amount) as total
          FROM consumption_records
          WHERE DATE(created_at) BETWEEN DATE(?) AND DATE(?)
          GROUP BY service_type
          ORDER BY total DESC
        `);
        const data = stmt.all(startDate || '2024-01-01', endDate || '2099-12-31');
        return NextResponse.json(data);
      }

      case 'payment-method': {
        // 支付方式统计
        const stmt = db.prepare(`
          SELECT 
            payment_method,
            COUNT(*) as count,
            SUM(amount) as total
          FROM consumption_records
          WHERE DATE(created_at) BETWEEN DATE(?) AND DATE(?)
          GROUP BY payment_method
          ORDER BY total DESC
        `);
        const data = stmt.all(startDate || '2024-01-01', endDate || '2099-12-31');
        return NextResponse.json(data);
      }

      case 'customer-stats': {
        // 客户统计
        const genderStmt = db.prepare(`
          SELECT 
            gender,
            COUNT(*) as count
          FROM customers
          GROUP BY gender
        `);
        const genderData = genderStmt.all();

        const ageStmt = db.prepare(`
          SELECT 
            CASE 
              WHEN age < 20 THEN '20岁以下'
              WHEN age BETWEEN 20 AND 30 THEN '20-30岁'
              WHEN age BETWEEN 31 AND 40 THEN '31-40岁'
              WHEN age BETWEEN 41 AND 50 THEN '41-50岁'
              ELSE '50岁以上'
            END as age_group,
            COUNT(*) as count
          FROM customers
          WHERE age IS NOT NULL
          GROUP BY age_group
        `);
        const ageData = ageStmt.all();

        return NextResponse.json({ gender: genderData, age: ageData });
      }

      case 'top-customers': {
        // 消费TOP客户
        const stmt = db.prepare(`
          SELECT 
            c.id,
            c.name,
            c.phone,
            COUNT(cr.id) as consumption_count,
            SUM(cr.amount) as total_amount
          FROM customers c
          LEFT JOIN consumption_records cr ON c.id = cr.customer_id
          GROUP BY c.id
          ORDER BY total_amount DESC
          LIMIT 10
        `);
        const data = stmt.all();
        return NextResponse.json(data);
      }

      case 'weight-progress': {
        // 减重进度统计
        const stmt = db.prepare(`
          SELECT 
            c.id,
            c.name,
            c.initial_weight,
            c.target_weight,
            (
              SELECT weight 
              FROM weight_records 
              WHERE customer_id = c.id 
              ORDER BY recorded_at DESC 
              LIMIT 1
            ) as current_weight
          FROM customers c
          WHERE c.initial_weight IS NOT NULL 
            AND c.target_weight IS NOT NULL
        `);
        const data = stmt.all();
        return NextResponse.json(data);
      }

      case 'monthly-summary': {
        // 月度汇总
        const stmt = db.prepare(`
          SELECT 
            strftime('%Y-%m', created_at) as month,
            COUNT(*) as transaction_count,
            SUM(amount) as total_revenue,
            COUNT(DISTINCT customer_id) as active_customers
          FROM consumption_records
          GROUP BY month
          ORDER BY month DESC
          LIMIT 12
        `);
        const data = stmt.all();
        return NextResponse.json(data);
      }

      default:
        return NextResponse.json({ error: 'Invalid report type' }, { status: 400 });
    }
  } catch (error) {
    console.error('Report generation error:', error);
    return NextResponse.json({ error: 'Failed to generate report' }, { status: 500 });
  }
}