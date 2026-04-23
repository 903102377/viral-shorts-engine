import { NextResponse } from 'next/server';
import { renderTemplate } from '@/lib/prompts/templateEngine';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { template, variables } = body;
    
    if (!template) {
      return NextResponse.json({ success: false, error: 'Template string is required' }, { status: 400 });
    }
    
    const rendered = renderTemplate(template, variables || {});
    return NextResponse.json({ success: true, rendered });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
