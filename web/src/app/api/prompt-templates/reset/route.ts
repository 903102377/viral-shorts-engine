import { NextResponse } from 'next/server';
import { resetTemplateToDefault } from '@/lib/prompts/promptStore';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { id } = body;
    
    if (!id) {
      return NextResponse.json({ success: false, error: 'Template ID is required' }, { status: 400 });
    }
    
    const resetTemplate = resetTemplateToDefault(id);
    return NextResponse.json({ success: true, template: resetTemplate });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
