import { NextRequest, NextResponse } from 'next/server';
import { appointmentAPI } from '@/lib/api';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const today = searchParams.get('today');
    
    if (today === 'true') {
      const appointments = appointmentAPI.getTodayAppointments();
      return NextResponse.json(appointments);
    }
    
    const appointments = appointmentAPI.getAll();
    return NextResponse.json(appointments);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch appointments' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const appointment = appointmentAPI.create(body);
    return NextResponse.json(appointment, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create appointment' }, { status: 500 });
  }
}