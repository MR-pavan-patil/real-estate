/**
 * Image Upload API Route
 * 
 * Handles image uploads to Cloudinary via POST request.
 * Requires admin authentication.
 */
import { NextResponse, type NextRequest } from 'next/server';
import { uploadToCloudinary } from '@/lib/cloudinary';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    // Verify admin authentication
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Verify user is an admin
    const { data: admin } = await supabase
      .from('admins')
      .select('id')
      .eq('auth_id', user.id)
      .single();

    if (!admin) {
      return NextResponse.json(
        { error: 'Forbidden: Admin access required' },
        { status: 403 }
      );
    }

    // Parse the upload form data
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const folder = (formData.get('folder') as string) || 'estate-reserve/properties';

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Allowed: JPEG, PNG, WebP, AVIF' },
        { status: 400 }
      );
    }

    // Validate file size (max 10MB)
    const MAX_SIZE = 10 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: 'File size exceeds 10MB limit' },
        { status: 400 }
      );
    }

    // Convert to buffer and upload
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const result = await uploadToCloudinary(buffer, folder);

    return NextResponse.json({
      url: result.secure_url,
      public_id: result.public_id,
      width: result.width,
      height: result.height,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Upload failed. Please try again.' },
      { status: 500 }
    );
  }
}
