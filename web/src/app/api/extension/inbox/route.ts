import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

function getInboxPath() {
    return path.join(process.cwd(), 'tmp', 'inbox.json');
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function GET() {
  try {
    const ip = getInboxPath();
    if (!fs.existsSync(ip)) {
      return NextResponse.json({ success: true, data: [] }, { headers: corsHeaders });
    }
    const data = JSON.parse(fs.readFileSync(ip, 'utf-8'));
    
    // Clear inbox after reading
    fs.writeFileSync(ip, JSON.stringify([]), 'utf-8');
    
    return NextResponse.json({ success: true, data }, { headers: corsHeaders });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500, headers: corsHeaders });
  }
}

