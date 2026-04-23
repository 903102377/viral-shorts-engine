import { NextResponse } from 'next/server';
import { getAllTemplates, updateTemplate } from '@/lib/prompts/promptStore';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const templates = getAllTemplates();
    return NextResponse.json({ success: true, templates });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { template } = body;
    
    if (!template || !template.id) {
      return NextResponse.json({ success: false, error: 'Invalid template data' }, { status: 400 });
    }
    
    updateTemplate(template);
    return NextResponse.json({ success: true, template });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
