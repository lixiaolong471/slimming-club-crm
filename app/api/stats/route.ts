import { NextResponse } from 'next/server';
import { statsAPI } from '@/lib/api';

export async function GET() {
  try {
    const stats = statsAPI.getDashboardStats();
    return NextResponse.json(stats);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch statistics' }, { status: 500 });
  }
}