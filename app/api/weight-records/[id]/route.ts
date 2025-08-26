import { NextRequest, NextResponse } from 'next/server';
import { weightAPI } from '@/lib/api';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const success = weightAPI.delete(parseInt(params.id));
    if (!success) {
      return NextResponse.json({ error: 'Weight record not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Weight record deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete weight record' }, { status: 500 });
  }
}