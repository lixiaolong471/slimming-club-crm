import { NextRequest, NextResponse } from 'next/server';
import { serviceTypeAPI } from '@/lib/api';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const activeOnly = searchParams.get('activeOnly') === 'true';
    
    const serviceTypes = serviceTypeAPI.getAll(activeOnly);
    return NextResponse.json(serviceTypes);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch service types' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const serviceType = serviceTypeAPI.create(body);
    return NextResponse.json(serviceType, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create service type' }, { status: 500 });
  }
}