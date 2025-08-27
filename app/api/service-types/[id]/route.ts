import { NextRequest, NextResponse } from 'next/server';
import { serviceTypeAPI } from '@/lib/api';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await request.json();
    const resolvedParams = await params;
    const serviceType = serviceTypeAPI.update(parseInt(resolvedParams.id), body);
    if (!serviceType) {
      return NextResponse.json({ error: 'Service type not found' }, { status: 404 });
    }
    return NextResponse.json(serviceType);
  } catch {
    return NextResponse.json({ error: 'Failed to update service type' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const success = serviceTypeAPI.delete(parseInt(resolvedParams.id));
    if (!success) {
      return NextResponse.json({ error: 'Service type not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Service type deleted successfully' });
  } catch {
    return NextResponse.json({ error: 'Failed to delete service type' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const success = serviceTypeAPI.toggleStatus(parseInt(resolvedParams.id));
    if (!success) {
      return NextResponse.json({ error: 'Service type not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Status updated successfully' });
  } catch {
    return NextResponse.json({ error: 'Failed to update status' }, { status: 500 });
  }
}