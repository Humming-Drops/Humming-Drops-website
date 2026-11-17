import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongodb';
import Lead from '@/lib/models/Lead';
import { sanitizeString, normalizePhone, isValidIndianPhone, isValidEmail } from '@/lib/sanitization';
import { OFFICIAL_PLANS } from '@/types/plans';

export async function POST(request: Request) {
  try {
    // 1. Safely parse JSON payload
    let body: any;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, error: "Invalid JSON in request payload." },
        { status: 400 }
      );
    }

    if (!body || typeof body !== 'object') {
      return NextResponse.json(
        { success: false, error: "Request payload must be a JSON object." },
        { status: 400 }
      );
    }

    // 2. Validate and sanitize inputs
    const fullName = sanitizeString(body.fullName, 100);
    if (!fullName || fullName.length < 2) {
      return NextResponse.json(
        { success: false, error: "Full name is required (minimum 2 characters)." },
        { status: 400 }
      );
    }

    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
    if (!email || !isValidEmail(email)) {
      return NextResponse.json(
        { success: false, error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    const normalizedPhone = normalizePhone(body.phone);
    if (!normalizedPhone || !isValidIndianPhone(normalizedPhone)) {
      return NextResponse.json(
        { success: false, error: "Please enter a valid 10-digit Indian mobile number." },
        { status: 400 }
      );
    }

    const planId = typeof body.planId === 'string' ? body.planId.trim().toLowerCase() : '';
    if (!planId || !(planId in OFFICIAL_PLANS)) {
      return NextResponse.json(
        { success: false, error: "Invalid or missing plan tier. Must be 'standard' or 'premium'." },
        { status: 400 }
      );
    }

    // 3. Connect to MongoDB Atlas
    await connectToDatabase();
    
    // 4. Create a new document in the database
    const newLead = await Lead.create({
      fullName,
      email,
      phone: normalizedPhone,
      planId,
      status: 'pending_confirmation'
    });

    // 5. Return success response
    return NextResponse.json({ 
      success: true, 
      message: "Registration successful", 
      data: newLead 
    }, { status: 201 });

  } catch (error: any) {
    console.error("Registration Error:", error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || "Internal server error"
    }, { status: 500 });
  }
}