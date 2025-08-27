import { NextRequest, NextResponse } from 'next/server';
import { consumptionAPI } from '@/lib/api';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const customerId = searchParams.get('customerId');
    
    if (customerId) {
      const records = consumptionAPI.getByCustomerId(parseInt(customerId));
      return NextResponse.json(records);
    }
    
    const records = consumptionAPI.getAll();
    return NextResponse.json(records);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch consumption records' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const record = consumptionAPI.create(body);
    return NextResponse.json(record, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to create consumption record' }, { status: 500 });
  }
}