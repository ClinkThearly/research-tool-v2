import { NextResponse } from 'next/server';
import { updateArticleStatus } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { articleId, newStatus } = await request.json();
    
    if (!['Relevant', 'Not Relevant', 'Ungraded'].includes(newStatus)) {
      return NextResponse.json({ success: false, error: 'Invalid status' }, { status: 400 });
    }

    await updateArticleStatus(articleId, newStatus);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to update article status:', error);
    return NextResponse.json({ success: false, error: 'Failed to update article status' }, { status: 500 });
  }
}