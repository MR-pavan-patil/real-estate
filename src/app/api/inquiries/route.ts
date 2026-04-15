/**
 * Inquiry Submission API Route
 *
 * Public endpoint for contact form submissions.
 * Creates a new inquiry in the database.
 */
import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { name, phone, city, message, property_id } = body;

    // Validate required fields
    if (!name || !phone) {
      return NextResponse.json(
        { error: 'Name and phone are required.' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const { error } = await supabase
      .from('inquiries')
      .insert({
        name,
        phone,
        city: city || '',
        message: message || '',
        property_id: property_id || null,
        status: 'new',
      });

    if (error) {
      console.error('Inquiry creation error:', error);
      return NextResponse.json(
        { error: 'Failed to submit inquiry.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error('Inquiry API error:', error);
    return NextResponse.json(
      { error: 'Internal server error.' },
      { status: 500 }
    );
  }
}
