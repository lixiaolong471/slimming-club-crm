import { NextRequest, NextResponse } from 'next/server';
import { appointmentAPI } from '@/lib/api';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { status } = await request.json();
    const success = appointmentAPI.updateStatus(parseInt(params.id), status);
    
    if (!success) {
      return NextResponse.json({ error: 'Appointment not found' }, { status: 404 });
    }
    
    return NextResponse.json({ message: 'Status updated successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update appointment' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const success = appointmentAPI.delete(parseInt(params.id));
    
    if (!success) {
      return NextResponse.json({ error: 'Appointment not found' }, { status: 404 });
    }
    
    return NextResponse.json({ message: 'Appointment deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete appointment' }, { status: 500 });
  }
}